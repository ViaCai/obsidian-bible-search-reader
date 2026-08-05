# 圣经检索与阅读 (Bible Search and Reader)

![Version](https://img.shields.io/github/v/release/ViaCai/obsidian-bible-search-reader?label=version&color=blue) ![License](https://img.shields.io/badge/license-MIT-green)

> Obsidian 插件，用于本地圣经 Markdown 文档的检索、阅读与投影。

---

## 目录 / Table of Contents

- [中文文档](#中文文档)
- [English Documentation](#english-documentation)

---

# 中文文档

## 功能特性

- **圣经搜索**：支持主题、纲目、经文三种检索类型；可按全部圣经或自定义书卷范围搜索
- **智能检索语法**：支持经文出处（`太1:1`、`路一1～3`）、关键词（多词组合匹配）、以及混合检索
- **阅读模式**：书卷/章节网格浏览，快速跳转，字体调节，主题与纲目同屏显示
- **投影模式**：选中内容后可逐节、并列或混合投影，支持键盘/滚轮/触屏操作

## 快速开始

### 方式一：内置数据模式（推荐）

1. **安装插件**：从 Obsidian 社区插件市场搜索 "Bible Search and Reader" 安装启用
2. **首次引导**：启用后自动弹出引导窗口，选择「内置数据模式」
3. **自动下载**：插件自动从 GitHub 下载 `bible-data.json`（约 14MB）到插件目录
4. **开箱即用**：无需配置路径，直接点击左侧 📖 图标开始使用

> 📦 内置数据模式下，仓库不会增加任何额外文件，也不需要设置圣经目录。

### 方式二：外置数据模式

1. **安装插件**：同上
2. **首次引导**：选择「外置数据模式」
3. **自动下载**：插件自动从 GitHub 下载圣经文档 ZIP（约 1.4MB）并解压到 Vault
4. **自动配置**：插件自动填写旧约/新约目录路径

> 📁 外置数据模式下，仓库会生成「圣经/旧约」和「圣经/新约」文件夹及 66 个 Markdown 文档。若文档被移动，需手动修改插件设置中的目录路径。

> 💡 如需使用其他版本圣经（如和合本），可按下方「文档格式」自行整理后替换文档。

## 文档格式

### 文件命名
建议：`序号. 书卷名.md`，如 `01. 创世记.md`、`40. 马太福音.md`。旧约与新约文件分开放置。

### 内容格式

```markdown
---
title:
author:
---
> **主题：书卷主题内容**

# 书卷名第1章

> 壹　纲目内容　一1～5

书卷简称1:1 经文内容
书卷简称1:2 经文内容
```

**格式说明**
| 类型 | 格式 | 示例 |
|------|------|------|
| 主题 | `> **主题：内容**` | `> **主题：神的创造**` |
| 纲目 | `> 纲目内容`（以 `>` 开头，不含"主题"） | `> 壹　神的创造　一1～二3` |
| 经文 | `简称章:节 内容` | `加1:1 作使徒的保罗...` |
| 章标题 | `# 书卷名第X章` | `# 加拉太书第1章` |

## 自定义圣经版本

插件默认提供原注版圣经数据，你也可以使用其他中文圣经版本（如恢复本、新译本等），只需按以下步骤操作。

### 1. 准备外置文档

按照「文档格式」整理你的圣经文档，确保：
- 文件命名规范：`序号. 书卷名.md`
- 内容格式正确：主题、纲目、经文、章标题
- 旧约和新约分别放在两个文件夹中

### 2. 外置数据转内置数据

如果你希望将外置文档打包成内置的 `bible-data.json`（推荐，开箱即用）：

1. **下载工具**：从 Release 下载 [`build-bible-data.html`](https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/build-bible-data.html)
2. **打开工具**：用浏览器直接打开该 HTML 文件（无需联网，纯本地运行）
3. **选择文件夹**：
   - 点击「选择旧约文件夹」，选中你的旧约文档所在文件夹
   - 点击「选择新约文件夹」，选中你的新约文档所在文件夹
4. **生成数据**：点击「生成 bible-data.json」，浏览器会自动下载生成的文件
5. **放置文件**：将下载的 `bible-data.json` 放到插件目录（`.obsidian/plugins/bible-search-reader/`）下
6. **切换模式**：在插件设置中选择「使用内置数据」，即可使用你的自定义版本

> 💡 **提示**：生成工具会校验文档格式，如果某卷书解析失败，会在页面中显示错误信息，方便你定位问题。

### 3. 直接使用外置数据

如果你不想打包成内置数据，也可以直接使用外置文档：
1. 将整理好的圣经文件夹放入 Vault
2. 在插件设置中关闭「使用内置数据」
3. 分别设置「旧约圣经目录」和「新约圣经目录」的路径
4. 插件会自动解析外置文档

---

## 使用指南

### 搜索
1. 点击左侧边栏 📖 图标或运行命令「打开圣经检索」
2. 选择检索种类（主题/纲目/经文）和范围，输入内容后点击「🔍 查询」
3. 点击结果卡片选中（可排序、标记并列），再点击「逐节/并列/混合投影」
4. 点击经文出处可直接跳转到圣经文档对应位置

### 阅读
1. 切换到「圣经阅读」选项卡
2. 点击书卷简称 → 章节编号 → 阅读内容
3. 使用「快速跳转」下拉框或「上一章/下一章」按钮翻章
4. 点击卡片选中内容，可进行复制或投影

### 投影操作
- `←/→` 或 `空格`：翻页
- `+/-`：调整字体大小
- `T`：切换深色/浅色主题
- `ESC`：退出投影

## 检索语法速查

### 经文出处

| 输入 | 含义 |
|------|------|
| `加1:1` | 加拉太书1章1节 |
| `路一1～3` | 路加福音1章1至3节 |
| `太1:1-2:5` | 马太福音1章1节至2章5节 |
| `太1:1, 5` | 马太福音1章1节和1章5节（同书卷延续引用） |
| `约一1, 十四7~21, 23` | 约翰福音1:1、14:7-21、14:23（混合延续） |

### 关键词匹配

分隔符决定匹配行为：

| 分隔符 | 模式 | 顺序敏感 | 结果排序 |
|--------|------|----------|----------|
| 空格 / 顿号 `、` | 同时包含（AND） | 否 | 经文顺序 |
| 逗号 `，` `,` | 同时包含（AND） | **是**（按输入顺序） | 经文顺序 |
| 分号 `；` `;` | 包含任意（OR） | 是 | 关键词顺序 |
| 句号 `。` `.` | 包含任意（OR） | 否 | 经文顺序 |

**示例**：`世人 恩典`（同时包含，忽略顺序）、`世人，恩典`（同时包含，按顺序）、`世人；恩典`（包含任意一个）

## 更新

插件支持自动检测更新：
- **自动检测**：设置 → 自动检测更新（默认开启），启动时自动检查新版本
- **手动检查**：设置 → 立即检查更新
- **一键更新**：检测到新版本后，点击「立即更新」即可自动下载并安装

## 注意事项

1. 插件启动时自动加载圣经数据，首次加载可能需要几秒
2. 修改圣经文档后，重新打开检索视图或重启 Obsidian 即可更新
3. 移动端与桌面端均支持（自动下载功能仅桌面端可用）

## ☕ 支持

如果觉得这个插件对你有帮助，可以给予支持，以便继续开发。

> **加 6:6** — 只是那在话语上受教的，当与施教的人共同分享一切的美物。

<img src="https://raw.githubusercontent.com/ViaCai/bitiful-helper/main/images/wechat-pay.png" alt="微信收款码" width="240" />

## 许可证

MIT License

---

# English Documentation

> ⚠️ **This plugin currently supports Chinese Bible documents only.** All book names, verse reference formats, and search syntax are based on Chinese (Simplified/Traditional). **English or other language Bible versions are NOT supported.** The English documentation below is provided for reference only.

## Features

- **Bible Search**: Search by Theme, Outline, or Verse; scope can be set to the entire Bible or custom book selections
- **Smart Search Syntax**: Supports Chinese verse references (e.g. `太1:1`, `路一1～3`), keyword combinations, and mixed queries
- **Reader Mode**: Grid browsing by book/chapter, quick jump, font size adjustment, with themes and outlines displayed alongside verses
- **Projection Mode**: Selected content can be projected in Focus, Parallel, or Mixed mode; supports keyboard/scroll wheel/touch navigation

## Quick Start

1. **Install the plugin**: Search for "Bible Search and Reader" in the Obsidian Community Plugins marketplace, or manually download and extract to `.obsidian/plugins/bible-search-reader/`
2. **Prepare Bible documents**: Download the [sample Chinese Bible documents (ZIP)](https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/bible-documents.zip) and extract them into your vault
3. **Configure directories**: Obsidian Settings → Community Plugins → Bible Search and Reader → set the **Old Testament Path** and **New Testament Path**

   > 📁 **Path format**: In the Obsidian file explorer, right-click the target folder → "Copy path" → "From vault folder", then paste it into the plugin settings.

> 💡 If you need a different Chinese Bible version, you can reformat your own documents following the rules below.

## Document Format

### File Naming
Recommended: `Number. BookName.md`, e.g. `01. 创世记.md`, `40. 马太福音.md`. Old and New Testament files should be placed in separate folders.

### Content Format

```markdown
---
title:
author:
---
> **主题：书卷主题内容**

# 书卷名第1章

> 壹　纲目内容　一1～5

书卷简称1:1 经文内容
书卷简称1:2 经文内容
```

**Format Rules**
| Type | Format | Example |
|------|--------|---------|
| Theme | `> **主题：content**` | `> **主题：神的创造**` |
| Outline | `> outline content` (starts with `>`, no "主题") | `> 壹　神的创造　一1～二3` |
| Verse | `ShortNameChapter:Verse content` | `加1:1 作使徒的保罗...` |
| Chapter title | `# BookName第X章` | `# 加拉太书第1章` |

## Custom Bible Version

The plugin ships with the Chinese Recovery Version (原注版) by default. You can also use other Chinese Bible versions (e.g., Recovery Version, CNV, etc.) by following the steps below.

### 1. Prepare External Documents

Organize your Bible documents following the "Document Format" rules above. Make sure:
- File naming follows the convention: `Number. BookName.md`
- Content format is correct: theme, outline, verse, chapter title
- Old and New Testament files are placed in separate folders

### 2. Convert External Data to Built-in Data

If you want to package your external documents into a built-in `bible-data.json` (recommended, works out of the box):

1. **Download the tool**: Download [`build-bible-data.html`](https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/build-bible-data.html) from the Release page
2. **Open the tool**: Open the HTML file directly in your browser (runs entirely offline, no internet required)
3. **Select folders**:
   - Click "Select Old Testament folder" and choose your OT document folder
   - Click "Select New Testament folder" and choose your NT document folder
4. **Generate data**: Click "Generate bible-data.json" and the browser will download the generated file
5. **Place the file**: Move the downloaded `bible-data.json` into the plugin directory (`.obsidian/plugins/bible-search-reader/`)
6. **Switch mode**: In plugin settings, enable "Use built-in data" to use your custom version

> 💡 **Tip**: The generator validates document format during parsing. If a book fails to parse, an error message will be displayed on the page to help you locate the issue.

### 3. Use External Data Directly

If you prefer not to package into built-in data, you can use external documents directly:
1. Place your Bible folders into the Vault
2. In plugin settings, disable "Use built-in data"
3. Set the "Old Testament Path" and "New Testament Path" accordingly
4. The plugin will automatically parse the external documents

---

## Usage Guide

### Search
1. Click the 📖 icon in the left sidebar or run the command "Open Bible Search"
2. Select search types (Theme / Outline / Verse) and scope, enter your query, and click "🔍 Search"
3. Click result cards to select (with ordering and side-by-side tagging), then click "Focus / Parallel / Mixed Projection"
4. Click a verse reference to jump directly to the corresponding location in the Bible document

### Reading
1. Switch to the "Bible Reader" tab
2. Click a book abbreviation → chapter number → read the content
3. Use the "Quick Jump" dropdowns or "Previous / Next Chapter" buttons to navigate
4. Click cards to select content for copying or projection

### Projection Controls
- `←/→` or `Space`: Navigate slides
- `+/-`: Adjust font size
- `T`: Toggle dark/light theme
- `ESC`: Exit projection

## Search Syntax Cheatsheet

### Verse References

| Input | Meaning |
|-------|---------|
| `加1:1` | Galatians 1:1 |
| `路一1～3` | Luke 1:1–3 |
| `太1:1-2:5` | Matthew 1:1 to 2:5 |
| `太1:1, 5` | Matthew 1:1 and 1:5 (continuation within same book) |
| `约一1, 十四7~21, 23` | John 1:1, 14:7–21, 14:23 (mixed continuation) |

### Keyword Matching

The separator determines the matching behavior:

| Separator | Mode | Order Sensitive | Result Sorting |
|-----------|------|-----------------|----------------|
| Space / 顿号 `、` | AND | No | Verse order |
| Comma `，` `,` | AND | **Yes** (input order) | Verse order |
| Semicolon `；` `;` | OR | Yes | Keyword order |
| Period `。` `.` | OR | No | Verse order |

**Examples**: `世人 恩典` (contains both, any order), `世人，恩典` (contains both, in order), `世人；恩典` (contains either)

## Notes

1. The plugin loads Bible data automatically on startup; the first load may take a few seconds
2. After modifying Bible documents, reload the search view or restart Obsidian to update
3. Supports both desktop and mobile platforms

## ☕ Support

If you find this plugin helpful, your support is greatly appreciated to continue development.

> **Galatians 6:6** — Let the one who is taught the word share all good things with the one who teaches.

<img src="https://raw.githubusercontent.com/ViaCai/bitiful-helper/main/images/wechat-pay.png" alt="WeChat Pay" width="240" />

## License

MIT License
