/**
 * SillyTavern Quick Restart Plugin
 * 一个快速重启酒馆服务器的插件，支持移动端和iOS界面
 * 
 * @author xinyun
 * @version 1.0.0
 */

import { extension_settings, getContext, renderExtensionTemplateAsync } from '../../../extensions.js';
import { saveSettingsDebounced, callPopup } from '../../../../script.js';

const extensionName = 'SillyTavern-QuickRestart';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// 默认设置
const defaultSettings = {
    showFloatingButton: true,
    buttonPosition: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    buttonSize: 48,
    confirmBeforeRestart: true,
    autoReconnect: true,
    reconnectDelay: 3000,  // 重连延迟(ms)
    reconnectMaxAttempts: 20, // 最大重连尝试次数
};

/**
 * 加载插件设置
 */
function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
    // 确保所有默认设置键存在
    for (const key in defaultSettings) {
        if (extension_settings[extensionName][key] === undefined) {
            extension_settings[extensionName][key] = defaultSettings[key];
        }
    }
    updateUI();
}

/**
 * 更新UI状态
 */
function updateUI() {
    const settings = extension_settings[extensionName];
    
    $('#qr_show_floating').prop('checked', settings.showFloatingButton);
    $('#qr_confirm_restart').prop('checked', settings.confirmBeforeRestart);
    $('#qr_auto_reconnect').prop('checked', settings.autoReconnect);
    $('#qr_button_position').val(settings.buttonPosition);
    
    // 更新浮动按钮可见性
    const floatingBtn = $('#quick-restart-floating-btn');
    if (floatingBtn.length) {
        floatingBtn.toggle(settings.showFloatingButton);
        updateButtonPosition(floatingBtn, settings.buttonPosition);
    }
}

/**
 * 更新浮动按钮位置
 */
function updateButtonPosition(btn, position) {
    btn.removeClass('qr-pos-bottom-right qr-pos-bottom-left qr-pos-top-right qr-pos-top-left');
    btn.addClass(`qr-pos-${position}`);
}

/**
 * 执行服务器重启
 */
async function performRestart() {
    const settings = extension_settings[extensionName];
    
    // 显示重启中状态
    showRestartOverlay();
    
    try {
        const response = await fetch('/api/plugins/restart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        console.log('[QuickRestart] 服务器重启请求已发送');
        
        if (settings.autoReconnect) {
            waitForReconnect(settings.reconnectDelay, settings.reconnectMaxAttempts);
        }
    } catch (error) {
        console.error('[QuickRestart] 重启请求失败，尝试备用方式...', error);
        
        // 备用重启方式
        try {
            await fetch('/api/server/restart', { method: 'POST' });
        } catch (e) {
            // 连接断开是预期行为（服务器正在重启）
            console.log('[QuickRestart] 连接已断开，服务器可能正在重启...');
        }
        
        if (settings.autoReconnect) {
            waitForReconnect(settings.reconnectDelay, settings.reconnectMaxAttempts);
        }
    }
}

/**
 * 显示重启遮罩层
 */
function showRestartOverlay() {
    // 移除已有遮罩
    $('#quick-restart-overlay').remove();
    
    const overlay = $(`
        <div id="quick-restart-overlay" class="qr-overlay">
            <div class="qr-overlay-content">
                <div class="qr-spinner"></div>
                <div class="qr-overlay-text">正在重启服务器...</div>
                <div class="qr-overlay-subtext">Restarting server, please wait...</div>
                <div class="qr-reconnect-status" id="qr-reconnect-status"></div>
            </div>
        </div>
    `);
    
    $('body').append(overlay);
    
    // 触发动画
    requestAnimationFrame(() => {
        overlay.addClass('qr-overlay-visible');
    });
}

/**
 * 隐藏重启遮罩层
 */
function hideRestartOverlay() {
    const overlay = $('#quick-restart-overlay');
    overlay.removeClass('qr-overlay-visible');
    setTimeout(() => overlay.remove(), 300);
}

/**
 * 等待服务器重连
 */
function waitForReconnect(delay, maxAttempts) {
    let attempts = 0;
    
    const statusEl = $('#qr-reconnect-status');
    
    const tryReconnect = async () => {
        attempts++;
        statusEl.text(`正在尝试重新连接... (${attempts}/${maxAttempts})`);
        
        try {
            const response = await fetch('/api/ping', { 
                method: 'GET',
                cache: 'no-cache',
            });
            
            if (response.ok) {
                statusEl.text('✅ 重连成功！正在刷新页面...');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                return;
            }
        } catch (e) {
            // 服务器还没启动完成
        }
        
        if (attempts < maxAttempts) {
            setTimeout(tryReconnect, delay);
        } else {
            statusEl.html('❌ 重连超时，请手动刷新页面<br><button class="qr-manual-refresh menu_button">刷新页面</button>');
            $('.qr-manual-refresh').on('click', () => window.location.reload());
        }
    };
    
    // 延迟一小段时间再开始重连（等待服务器关闭）
    setTimeout(tryReconnect, delay);
}

/**
 * 处理重启按钮点击
 */
async function handleRestartClick() {
    const settings = extension_settings[extensionName];
    
    if (settings.confirmBeforeRestart) {
        const confirmed = await callPopup(
            '<div style="text-align:center;">' +
            '<h3 style="margin-bottom:10px;">⚡ 快速重启</h3>' +
            '<p>确定要重启 SillyTavern 服务器吗？</p>' +
            '<p style="font-size:0.85em;color:#888;">当前的聊天记录会自动保存</p>' +
            '</div>',
            'confirm'
        );
        
        if (confirmed) {
            await performRestart();
        }
    } else {
        await performRestart();
    }
}

/**
 * 创建浮动重启按钮
 */
function createFloatingButton() {
    // 移除已有按钮
    $('#quick-restart-floating-btn').remove();
    
    const settings = extension_settings[extensionName];
    
    const button = $(`
        <div id="quick-restart-floating-btn" class="qr-floating-btn qr-pos-${settings.buttonPosition}" title="快速重启 SillyTavern">
            <div class="qr-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 4v6h-6"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
            </div>
        </div>
    `);
    
    // 触摸/点击事件
    button.on('click touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleRestartClick();
    });
    
    // 防止触摸事件穿透
    button.on('touchstart', function(e) {
        e.stopPropagation();
        $(this).addClass('qr-btn-active');
    });
    
    button.on('touchend touchcancel', function() {
        $(this).removeClass('qr-btn-active');
    });
    
    if (!settings.showFloatingButton) {
        button.hide();
    }
    
    $('body').append(button);
    
    // 支持拖动（移动端长按拖动）
    makeDraggable(button);
}

/**
 * 使按钮支持拖动
 */
function makeDraggable(element) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;
    let longPressTimer;
    let hasMoved = false;
    
    const onStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        hasMoved = false;
        
        // 长按才可拖动
        longPressTimer = setTimeout(() => {
            isDragging = true;
            element.addClass('qr-btn-dragging');
            const rect = element[0].getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
        }, 500);
    };
    
    const onMove = (e) => {
        if (!isDragging) {
            const touch = e.touches ? e.touches[0] : e;
            const dx = Math.abs(touch.clientX - startX);
            const dy = Math.abs(touch.clientY - startY);
            if (dx > 5 || dy > 5) {
                clearTimeout(longPressTimer);
                hasMoved = true;
            }
            return;
        }
        
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        
        const newLeft = Math.max(0, Math.min(window.innerWidth - element.outerWidth(), initialLeft + dx));
        const newTop = Math.max(0, Math.min(window.innerHeight - element.outerHeight(), initialTop + dy));
        
        element.css({
            left: newLeft + 'px',
            top: newTop + 'px',
            right: 'auto',
            bottom: 'auto',
        });
        
        hasMoved = true;
    };
    
    const onEnd = () => {
        clearTimeout(longPressTimer);
        if (isDragging) {
            isDragging = false;
            element.removeClass('qr-btn-dragging');
        }
    };
    
    element.on('touchstart mousedown', onStart);
    $(document).on('touchmove mousemove', onMove);
    $(document).on('touchend mouseup', onEnd);
}

/**
 * 创建设置面板HTML
 */
function createSettingsHTML() {
    const html = `
    <div class="quick-restart-settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>⚡ Quick Restart / 快速重启</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div class="quick-restart-settings-content">
                    <div class="qr-setting-item">
                        <label class="checkbox_label" for="qr_show_floating">
                            <input type="checkbox" id="qr_show_floating" />
                            <span>显示浮动按钮 / Show floating button</span>
                        </label>
                    </div>
                    <div class="qr-setting-item">
                        <label class="checkbox_label" for="qr_confirm_restart">
                            <input type="checkbox" id="qr_confirm_restart" />
                            <span>重启前确认 / Confirm before restart</span>
                        </label>
                    </div>
                    <div class="qr-setting-item">
                        <label class="checkbox_label" for="qr_auto_reconnect">
                            <input type="checkbox" id="qr_auto_reconnect" />
                            <span>自动重连 / Auto reconnect</span>
                        </label>
                    </div>
                    <div class="qr-setting-item">
                        <label for="qr_button_position">按钮位置 / Button position:</label>
                        <select id="qr_button_position" class="text_pole">
                            <option value="bottom-right">右下 / Bottom Right</option>
                            <option value="bottom-left">左下 / Bottom Left</option>
                            <option value="top-right">右上 / Top Right</option>
                            <option value="top-left">左上 / Top Left</option>
                        </select>
                    </div>
                    <div class="qr-setting-item">
                        <button id="qr_restart_now" class="menu_button menu_button_icon">
                            <span class="fa-solid fa-rotate-right"></span>
                            立即重启 / Restart Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

/**
 * 绑定设置面板事件
 */
function bindSettingsEvents() {
    $('#qr_show_floating').on('change', function() {
        extension_settings[extensionName].showFloatingButton = $(this).prop('checked');
        $('#quick-restart-floating-btn').toggle($(this).prop('checked'));
        saveSettingsDebounced();
    });
    
    $('#qr_confirm_restart').on('change', function() {
        extension_settings[extensionName].confirmBeforeRestart = $(this).prop('checked');
        saveSettingsDebounced();
    });
    
    $('#qr_auto_reconnect').on('change', function() {
        extension_settings[extensionName].autoReconnect = $(this).prop('checked');
        saveSettingsDebounced();
    });
    
    $('#qr_button_position').on('change', function() {
        extension_settings[extensionName].buttonPosition = $(this).val();
        updateButtonPosition($('#quick-restart-floating-btn'), $(this).val());
        saveSettingsDebounced();
    });
    
    $('#qr_restart_now').on('click', handleRestartClick);
}

/**
 * 注册斜杠命令
 */
function registerSlashCommands() {
    try {
        const context = getContext();
        if (context.registerSlashCommand) {
            context.registerSlashCommand('restart', () => {
                handleRestartClick();
                return '';
            }, [], '重启 SillyTavern 服务器 / Restart SillyTavern server', true, true);
        }
    } catch (e) {
        console.log('[QuickRestart] 斜杠命令注册跳过（可能不支持）');
    }
}

/**
 * 插件入口
 */
jQuery(async () => {
    // 添加设置面板
    const settingsHtml = createSettingsHTML();
    $('#extensions_settings').append(settingsHtml);
    
    // 加载设置
    loadSettings();
    
    // 绑定事件
    bindSettingsEvents();
    
    // 创建浮动按钮
    createFloatingButton();
    
    // 注册命令
    registerSlashCommands();
    
    console.log('[QuickRestart] ⚡ 快速重启插件已加载 / Quick Restart plugin loaded');
});
