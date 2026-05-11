# ⚡ SillyTavern Quick Restart

[English](#english) | [中文](#中文)

---

## 中文

### 简介

**SillyTavern Quick Restart** 是一个为 [SillyTavern](https://github.com/SillyTavern/SillyTavern) 打造的快速重启插件。它在界面上添加一个浮动的重启按钮，让你可以**一键重启**酒馆服务器，无需手动切换到终端操作。

特别针对**移动端**和 **iOS** 设备做了适配优化，确保在手机上也能流畅使用。

### ✨ 功能特性

- 🔄 **一键重启** — 浮动按钮，随时可按，第一时间重启服务器
- 📱 **移动端适配** — 针对手机屏幕优化按钮大小和位置
- 🍎 **iOS 适配** — 支持 iOS 安全区域、防止点击延迟和长按菜单
- 🔁 **自动重连** — 重启后自动检测服务器状态并刷新页面
- 📍 **可拖动** — 长按按钮可拖动到任意位置
- ⚙️ **可配置** — 按钮位置、确认弹窗、自动重连等均可自定义
- 🎨 **优雅动画** — 重启过程有加载动画和状态提示
- 🌙 **主题适配** — 自动适配暗色/亮色主题
- 📐 **横屏支持** — 横屏模式下自动调整布局

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

3. 重启 SillyTavern 服务器。

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

安装后，界面右下角会出现一个**紫色的浮动重启按钮** ⚡：

1. **点击按钮** → 弹出确认对话框
2. **确认重启** → 服务器开始重启
3. **自动重连** → 插件会自动检测服务器状态并刷新页面

#### 设置选项

在 SillyTavern 的 **扩展设置** 中找到 **Quick Restart / 快速重启** 面板：

| 选项 | 说明 | 默认值 |
|------|------|--------|
| 显示浮动按钮 | 是否显示界面上的浮动重启按钮 | ✅ 开启 |
| 重启前确认 | 点击重启按钮后是否弹出确认对话框 | ✅ 开启 |
| 自动重连 | 重启后是否自动尝试重新连接 | ✅ 开启 |
| 按钮位置 | 浮动按钮在屏幕上的位置 | 右下角 |

### 📱 移动端使用提示

- **普通点击**：触发重启
- **长按拖动**：长按 0.5 秒后可拖动按钮到任意位置
- 按钮会自动避开 iOS 的刘海和底部横条区域

### 🔧 斜杠命令

你也可以在聊天框中输入斜杠命令来触发重启：

```
/restart
```

---

## English

### Introduction

**SillyTavern Quick Restart** is a plugin for [SillyTavern](https://github.com/SillyTavern/SillyTavern) that adds a floating restart button to the interface. It allows you to **restart the server with a single tap**, without switching to the terminal.

Specially optimized for **mobile** and **iOS** devices.

### ✨ Features

- 🔄 **One-tap Restart** — Floating button, always accessible
- 📱 **Mobile Friendly** — Optimized button size and position for phones
- 🍎 **iOS Compatible** — Safe area support, no tap delay, no long-press menu
- 🔁 **Auto Reconnect** — Automatically detects server status and refreshes
- 📍 **Draggable** — Long-press to drag the button anywhere
- ⚙️ **Configurable** — Position, confirmation, auto-reconnect settings
- 🎨 **Smooth Animations** — Loading spinner and status messages
- 🌙 **Theme Aware** — Adapts to dark/light themes
- 📐 **Landscape Support** — Adjusts layout for landscape mode

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

After installation, a **purple floating button** ⚡ appears in the bottom-right corner:

1. **Tap the button** → Confirmation dialog appears
2. **Confirm restart** → Server begins restarting
3. **Auto reconnect** → Plugin detects server status and refreshes the page

### Settings

Find **Quick Restart** in the SillyTavern **Extensions Settings** panel:

| Option | Description | Default |
|--------|-------------|---------|
| Show floating button | Toggle the floating restart button | ✅ On |
| Confirm before restart | Show confirmation dialog | ✅ On |
| Auto reconnect | Automatically reconnect after restart | ✅ On |
| Button position | Position of the floating button | Bottom Right |

### 📱 Mobile Tips

- **Tap**: Trigger restart
- **Long-press & drag**: Hold 0.5s then drag the button anywhere
- Button automatically avoids iOS notch and home indicator areas

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
├── style.css        # Styles (mobile & iOS optimized)
├── LICENSE          # MIT License
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

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ for SillyTavern users
