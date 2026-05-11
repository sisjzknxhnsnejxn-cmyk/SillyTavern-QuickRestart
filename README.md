# ⚡ SillyTavern Quick Restart

[English](#english) | [中文](#中文)

---

## 中文

### 简介

**SillyTavern Quick Restart** 是一个为 [SillyTavern](https://github.com/SillyTavern/SillyTavern) 打造的快速重启插件。它在**扩展设置面板**中添加一个重启按钮，让你可以**一键重启** SillyTavern，无需手动刷新页面或切换到终端操作。

### ✨ 功能特性

- 🔄 **一键重启** — 在设置面板中点击按钮即可重启 SillyTavern
- 💾 **自动保存** — 重启前自动保存当前设置和聊天记录
- ✅ **确认弹窗** — 可选的重启确认对话框，防止误操作
- 🎨 **优雅动画** — 重启过程有加载动画和状态提示
- 📱 **移动端适配** — 适配手机和平板设备
- 🍎 **iOS 兼容** — 支持 iOS 安全区域适配
- ⌨️ **斜杠命令** — 支持通过 `/restart` 命令快速重启

### 📦 安装方法

#### 方法一：通过 Git 安装（推荐）

1. 打开终端，进入 SillyTavern 的插件目录：

```bash
cd SillyTavern/data/default-user/extensions/third-party
```

2. 克隆本仓库：

```bash
git clone https://github.com/sisjzknxhnsnejxn-cmyk/SillyTavern-QuickRestart.git
```

3. 重启 SillyTavern。

#### 方法二：通过 SillyTavern 内置安装

1. 打开 SillyTavern
2. 进入 **扩展** → **安装扩展**
3. 在 URL 栏中输入：
```
https://github.com/sisjzknxhnsnejxn-cmyk/SillyTavern-QuickRestart
```
4. 点击 **安装**

#### 方法三：手动安装

1. 下载本仓库的 ZIP 文件
2. 解压到 `SillyTavern/data/default-user/extensions/third-party/SillyTavern-QuickRestart/`
3. 确保目录结构如下：
```
SillyTavern-QuickRestart/
├── manifest.json
├── index.js
├── style.css
└── README.md
```
4. 重启 SillyTavern

### 🚀 使用方法

安装后，在 SillyTavern 的**扩展设置面板**中找到 **⚡ Quick Restart / 快速重启**：

1. 展开设置面板
2. 点击 **重启 SillyTavern / Restart SillyTavern** 按钮
3. 确认后页面将自动刷新并重新加载所有组件

#### 设置选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| 重启前确认 | 点击重启按钮后是否弹出确认对话框 | ✅ 开启 |
| 重启前自动保存 | 重启前是否自动保存当前设置 | ✅ 开启 |

### 🔧 斜杠命令

你也可以在聊天框中输入斜杠命令来触发重启：

```
/restart
```

---

## English

### Introduction

**SillyTavern Quick Restart** is a plugin for [SillyTavern](https://github.com/SillyTavern/SillyTavern) that adds a restart button in the **Extensions Settings panel**. It allows you to **restart SillyTavern with a single click**, without manually refreshing the page or switching to the terminal.

### ✨ Features

- 🔄 **One-click Restart** — Restart button in the settings panel
- 💾 **Auto Save** — Automatically saves settings before restarting
- ✅ **Confirmation Dialog** — Optional confirmation to prevent accidental restarts
- 🎨 **Smooth Animations** — Loading spinner and status messages during restart
- 📱 **Mobile Friendly** — Optimized for phones and tablets
- 🍎 **iOS Compatible** — Safe area support
- ⌨️ **Slash Command** — Use `/restart` command for quick restart

### 📦 Installation

#### Option 1: Git Install (Recommended)

```bash
cd SillyTavern/data/default-user/extensions/third-party
git clone https://github.com/sisjzknxhnsnejxn-cmyk/SillyTavern-QuickRestart.git
```

Then restart SillyTavern.

#### Option 2: Install via SillyTavern UI

1. Open SillyTavern
2. Go to **Extensions** → **Install Extension**
3. Enter URL:
```
https://github.com/sisjzknxhnsnejxn-cmyk/SillyTavern-QuickRestart
```
4. Click **Install**

### 🚀 Usage

After installation, find **⚡ Quick Restart** in the SillyTavern **Extensions Settings** panel:

1. Expand the settings drawer
2. Click **Restart SillyTavern** button
3. Confirm and the page will reload all components

### Settings

| Option | Description | Default |
|--------|-------------|---------|
| Confirm before restart | Show confirmation dialog | ✅ On |
| Auto save before restart | Save settings before restarting | ✅ On |

### 🔧 Slash Command

You can also type in the chat input:

```
/restart
```

---

## 📄 File Structure

```
SillyTavern-QuickRestart/
├── manifest.json    # Plugin manifest file
├── index.js         # Main plugin logic
├── style.css        # Styles (settings panel & overlay)
└── README.md        # This file
```

## 🛠️ Compatibility

- SillyTavern 1.10.0+
- Desktop browsers (Chrome, Firefox, Edge, Safari)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Termux (Android)

## 📝 License

[MIT License](LICENSE)

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

Made with ❤️ for SillyTavern users
