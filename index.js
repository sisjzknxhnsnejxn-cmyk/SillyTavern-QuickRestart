/**
 * SillyTavern Quick Restart Plugin
 * 在用户设置界面中添加一个快速重启按钮，用于重启 SillyTavern 前端
 * 
 * @author xinyun
 * @version 2.0.0
 */

import { extension_settings, getContext } from '../../../extensions.js';
import { saveSettingsDebounced, callPopup } from '../../../../script.js';

const extensionName = 'SillyTavern-QuickRestart';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// 默认设置
const defaultSettings = {
    confirmBeforeRestart: true,
    autoSaveBeforeRestart: true,
};

/**
 * 加载插件设置
 */
function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }
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
    $('#qr_confirm_restart').prop('checked', settings.confirmBeforeRestart);
    $('#qr_auto_save').prop('checked', settings.autoSaveBeforeRestart);
}

/**
 * 执行 SillyTavern 重启（刷新页面重新加载前端）
 */
async function performRestart() {
    showRestartOverlay();

    try {
        // 先尝试保存当前设置
        if (extension_settings[extensionName].autoSaveBeforeRestart) {
            try {
                saveSettingsDebounced();
                // 给保存操作一点时间
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                console.log('[QuickRestart] 保存设置时出错，继续重启...', e);
            }
        }

        console.log('[QuickRestart] 正在重启 SillyTavern...');

        // 短暂延迟后刷新页面，让用户看到重启动画
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('[QuickRestart] 重启失败:', error);
        hideRestartOverlay();
    }
}

/**
 * 显示重启遮罩层
 */
function showRestartOverlay() {
    $('#quick-restart-overlay').remove();

    const overlay = $(`
        <div id="quick-restart-overlay" class="qr-overlay">
            <div class="qr-overlay-content">
                <div class="qr-spinner"></div>
                <div class="qr-overlay-text">正在重启 SillyTavern...</div>
                <div class="qr-overlay-subtext">Restarting SillyTavern, please wait...</div>
            </div>
        </div>
    `);

    $('body').append(overlay);

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
 * 处理重启按钮点击
 */
async function handleRestartClick() {
    const settings = extension_settings[extensionName];

    if (settings.confirmBeforeRestart) {
        const confirmed = await callPopup(
            '<div style="text-align:center;">' +
            '<h3 style="margin-bottom:10px;">⚡ 快速重启</h3>' +
            '<p>确定要重启 SillyTavern 吗？</p>' +
            '<p style="font-size:0.85em;color:#888;">页面将会刷新并重新加载所有内容</p>' +
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
 * 创建设置面板HTML（嵌入用户设置界面）
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
                        <label class="checkbox_label" for="qr_confirm_restart">
                            <input type="checkbox" id="qr_confirm_restart" />
                            <span>重启前确认 / Confirm before restart</span>
                        </label>
                    </div>
                    <div class="qr-setting-item">
                        <label class="checkbox_label" for="qr_auto_save">
                            <input type="checkbox" id="qr_auto_save" />
                            <span>重启前自动保存 / Auto save before restart</span>
                        </label>
                    </div>
                    <hr class="qr-divider" />
                    <div class="qr-setting-item">
                        <button id="qr_restart_now" class="menu_button menu_button_icon qr-restart-btn">
                            <span class="fa-solid fa-rotate-right"></span>
                            重启 SillyTavern / Restart SillyTavern
                        </button>
                    </div>
                    <div class="qr-hint">
                        <small>💡 此操作将刷新页面并重新加载 SillyTavern 的所有组件。</small>
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
    $('#qr_confirm_restart').on('change', function () {
        extension_settings[extensionName].confirmBeforeRestart = $(this).prop('checked');
        saveSettingsDebounced();
    });

    $('#qr_auto_save').on('change', function () {
        extension_settings[extensionName].autoSaveBeforeRestart = $(this).prop('checked');
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
            }, [], '重启 SillyTavern / Restart SillyTavern', true, true);
        }
    } catch (e) {
        console.log('[QuickRestart] 斜杠命令注册跳过（可能不支持）');
    }
}

/**
 * 插件入口
 */
jQuery(async () => {
    // 将设置面板添加到扩展设置区域
    const settingsHtml = createSettingsHTML();
    $('#extensions_settings').append(settingsHtml);

    // 加载设置
    loadSettings();

    // 绑定事件
    bindSettingsEvents();

    // 注册命令
    registerSlashCommands();

    console.log('[QuickRestart] ⚡ 快速重启插件已加载 / Quick Restart plugin loaded');
});
