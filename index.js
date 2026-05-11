/**
 * SillyTavern Quick Restart Plugin
 * 在魔法棒菜单中添加快速重启按钮，一键重启 SillyTavern
 * 
 * @author xinyun
 * @version 3.0.0
 */

import { extension_settings, getContext } from '../../../extensions.js';
import { saveSettingsDebounced, callPopup } from '../../../../script.js';

const extensionName = 'SillyTavern-QuickRestart';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// 默认设置
const defaultSettings = {
    confirmBeforeRestart: false,
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
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                console.log('[QuickRestart] 保存设置时出错，继续重启...', e);
            }
        }

        console.log('[QuickRestart] 正在重启 SillyTavern...');

        // 短暂延迟后刷新页面，让用户看到重启动画
        setTimeout(() => {
            window.location.reload();
        }, 1800);
    } catch (error) {
        console.error('[QuickRestart] 重启失败:', error);
        hideRestartOverlay();
    }
}

/**
 * 显示重启遮罩层 - 美化版
 */
function showRestartOverlay() {
    $('#quick-restart-overlay').remove();

    const overlay = $(`
        <div id="quick-restart-overlay" class="qr-overlay">
            <div class="qr-overlay-content">
                <div class="qr-logo-container">
                    <div class="qr-logo-ring qr-ring-outer"></div>
                    <div class="qr-logo-ring qr-ring-inner"></div>
                    <div class="qr-logo-icon">
                        <i class="fa-solid fa-rotate-right"></i>
                    </div>
                </div>
                <div class="qr-overlay-text">正在重启 SillyTavern</div>
                <div class="qr-overlay-subtext">Restarting, please wait...</div>
                <div class="qr-progress-bar">
                    <div class="qr-progress-fill"></div>
                </div>
                <div class="qr-particles">
                    <div class="qr-particle qr-p1"></div>
                    <div class="qr-particle qr-p2"></div>
                    <div class="qr-particle qr-p3"></div>
                    <div class="qr-particle qr-p4"></div>
                    <div class="qr-particle qr-p5"></div>
                    <div class="qr-particle qr-p6"></div>
                </div>
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
    setTimeout(() => overlay.remove(), 500);
}

/**
 * 处理重启按钮点击 - 简化流程
 */
async function handleRestartClick() {
    const settings = extension_settings[extensionName];

    if (settings.confirmBeforeRestart) {
        const confirmed = await callPopup(
            '<div class="qr-confirm-popup">' +
            '<div class="qr-confirm-icon"><i class="fa-solid fa-bolt"></i></div>' +
            '<h3>快速重启</h3>' +
            '<p>确定要重启 SillyTavern 吗？</p>' +
            '<p class="qr-confirm-hint">页面将会刷新并重新加载所有内容</p>' +
            '</div>',
            'confirm'
        );

        if (confirmed) {
            await performRestart();
        }
    } else {
        // 默认不确认，直接重启，减少步骤
        await performRestart();
    }
}

/**
 * 创建设置面板HTML（嵌入扩展设置界面）
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
                            重启 SillyTavern / Restart
                        </button>
                    </div>
                    <div class="qr-hint">
                        <small>💡 也可以通过左下角魔法棒菜单中的重启按钮快速重启。</small>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

/**
 * 将重启按钮注入到魔法棒（Extensions）菜单中
 */
function injectIntoWandMenu() {
    // 等待 DOM 完全加载后查找魔法棒菜单
    const checkAndInject = () => {
        // SillyTavern 的魔法棒菜单通常在 #extensionsMenu 或 #extensions_menu
        // 它的容器通常是一个弹出菜单
        const wandMenuSelectors = [
            '#extensionsMenu',           // 常见的扩展菜单 ID
            '#extensions_menu',          // 备选 ID
            '.extensions_block',         // 扩展块
            '#leftSendForm',             // 左侧发送表单区域
            '#leftActionDrawer',         // 左侧抽屉
        ];

        let menuContainer = null;
        for (const selector of wandMenuSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                menuContainer = el;
                break;
            }
        }

        // 如果找不到特定菜单，尝试查找魔法棒按钮并创建菜单项
        // SillyTavern 中魔法棒按钮通常有 id="extensionsMenuButton" 或 class 含 "fa-magic"
        const wandButton = $('#extensionsMenuButton, #extension_floating_button, .fa-magic, .fa-wand-magic-sparkles').first();

        if (wandButton.length > 0) {
            // 监听魔法棒按钮的菜单弹出，动态注入
            addRestartToExtensionsMenu();
        }

        // 尝试直接添加到扩展菜单面板
        addRestartToExtensionsMenu();
    };

    // 延迟执行以确保 SillyTavern 的 DOM 已完全渲染
    setTimeout(checkAndInject, 2000);
    // 再次延迟确保
    setTimeout(checkAndInject, 5000);
}

/**
 * 添加重启按钮到扩展菜单中
 */
function addRestartToExtensionsMenu() {
    // 避免重复添加
    if ($('#qr_wand_restart_btn').length > 0) return;

    // 创建菜单项按钮
    const restartMenuItem = $(`
        <div id="qr_wand_restart_btn" class="list-group-item flex-container flexGap5 interactable" title="快速重启 SillyTavern">
            <i class="fa-solid fa-rotate-right extensionsMenuExtensionButton"></i>
            Quick Restart
        </div>
    `);

    restartMenuItem.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // 关闭魔法棒菜单
        $('.extensions_block .inline-drawer-content').slideUp();
        // 直接执行重启
        handleRestartClick();
    });

    // 尝试多种方式将按钮注入到魔法棒菜单
    const extensionsMenu = $('#extensionsMenu');
    if (extensionsMenu.length > 0) {
        extensionsMenu.append(restartMenuItem);
        console.log('[QuickRestart] ✅ 已将重启按钮添加到扩展菜单');
        return;
    }

    // 查找 data-i18n 为 Extensions 的菜单
    const extDrawer = $('.drawer-content, .list-group').filter(function () {
        return $(this).find('[data-i18n="Extensions"]').length > 0 ||
               $(this).closest('.drawer').find('.fa-cubes, .fa-magic, .fa-wand-magic-sparkles').length > 0;
    });
    if (extDrawer.length > 0) {
        extDrawer.first().append(restartMenuItem);
        console.log('[QuickRestart] ✅ 已将重启按钮添加到扩展抽屉');
        return;
    }

    // 终极方案：使用 MutationObserver 监听菜单弹出
    setupMenuObserver(restartMenuItem);
}

/**
 * 使用 MutationObserver 监听扩展菜单弹出
 */
function setupMenuObserver(restartMenuItem) {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                const el = $(node);
                // 检查是否是扩展菜单弹出
                if (el.hasClass('list-group') || el.find('.list-group').length > 0 ||
                    el.attr('id') === 'extensionsMenu') {
                    if ($('#qr_wand_restart_btn').length === 0) {
                        const target = el.hasClass('list-group') ? el : el.find('.list-group').first();
                        if (target.length > 0) {
                            target.append(restartMenuItem.clone(true));
                            console.log('[QuickRestart] ✅ 通过 Observer 添加重启按钮到菜单');
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 同时给魔法棒按钮添加点击事件监听
    $(document).on('click', '#extensionsMenuButton, #extension_floating_button, [id*="extensions"]', function () {
        setTimeout(() => {
            if ($('#qr_wand_restart_btn').length === 0) {
                const listGroup = $('.list-group:visible').last();
                if (listGroup.length > 0) {
                    listGroup.append(restartMenuItem.clone(true));
                    console.log('[QuickRestart] ✅ 通过点击事件添加重启按钮');
                }
            }
        }, 300);
    });
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

    // 注入到魔法棒菜单
    injectIntoWandMenu();

    // 注册命令
    registerSlashCommands();

    console.log('[QuickRestart] ⚡ 快速重启插件 v3.0 已加载');
});
