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

### 圣经搜索
- **检索种类**：主题、纲目、经文（可多选）
- **检索范围**：全部圣经、选择范围（自定义书卷）
- **检索语法**：
  - 经文出处：`太1:1`、`路一1～3`、`太1:1-2:5`
  - 词语检索：多词同时检索（空格/逗号/顿号/分号分隔）
  - 混合检索：可同时输入经文出处和词语
- **结果展示**：分页显示（每页 50 条），关键词高亮
- **出处可点击**：点击经文出处可直接打开圣经文档并定位到对应位置
- **选中排序**：点击候选框选中，显示顺序编号（1, 2, 3…）
- **并列标记**：选中后可标记"并列"，用于混合投影分组
- **专注模式**：一键折叠搜索区域，扩大内容显示空间

### 投影模式
- **逐节投影**：每条内容单独一页，左右翻页
- **并列投影**：所有内容在同一页面展示
- **混合投影**：按"并列"标记分组，每组一页
- **操作**：支持键盘方向键翻页、滚轮切换、+/- 调字体、T 切换主题、ESC 退出

### 圣经阅读
- **书卷浏览**：旧约 / 新约书卷简称网格，点击进入章节选择
- **章节阅读**：显示主题、纲目、经文，支持字体大小调节
- **快速跳转**：书卷下拉框 + 章节下拉框，一键切换
- **章节导航**：上一章 / 下一章按钮
- **选中功能**：点击卡片选中/取消，顺序累计
- **专注模式**：一键折叠阅读控制区域，扩大内容显示空间
- **复制功能**：复制经文 / 复制纲目 / 复制选中项
- **投影功能**：逐节投影 / 并列投影 / 混合投影（仅投影当前章选中内容）

## 安装方法

### 从 Obsidian 社区插件安装（推荐）

1. 打开 Obsidian 设置 → 社区插件
2. 关闭"安全模式"
3. 点击"浏览"，搜索 "Bible Search and Reader"
4. 点击"安装"然后"启用"

### 手动安装

1. 从 [GitHub Releases](https://github.com/ViaCai/obsidian-bible-search-reader/releases) 下载最新版本
2. 将文件解压到你的仓库 `.obsidian/plugins/bible-search-reader/` 文件夹中
3. 在 Obsidian 设置 → 社区插件中启用"圣经检索与阅读"

## 初始设置

1. 打开 Obsidian 设置 → 社区插件 → 圣经检索与阅读
2. 设置**旧约圣经目录**：旧约 Markdown 文件所在的文件夹路径（如：`圣经/旧约`）
3. 设置**新约圣经目录**：新约 Markdown 文件所在的文件夹路径（如：`圣经/新约`）

## 圣经文档下载

本插件需要特定格式的圣经 Markdown 文档。你可以在这里下载示例文档：

（7月31日之前下载的，请重新下载，最新的圣经文档，已修复了一些bug）

- [下载圣经文档（ZIP）](https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/1.0.0/bible-documents.zip)

> 💡 **提示**：如果你需要其他版本的圣经，可以按照下方的格式要求修改下载的文档，或根据模板自行创建。

## 文档格式要求

### 文件命名
建议格式：`序号. 书卷名.md`

- 旧约示例：`01. 创世记.md`、`37. 哈该书.md`
- 新约示例：`40. 马太福音.md`、`48. 加拉太书.md`
- 旧约和新约文件应放在不同的目录中

### 文件内容格式

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

# 书卷名第2章

> 贰　纲目内容　二1～10

书卷简称2:1 经文内容
```

### 格式说明
1. **主题**：`> **主题：主题内容**`
2. **纲目**：`> 纲目内容`（以 `>` 开头但不包含"主题"）
3. **经文**：`书卷简称章数:节数 经文内容`，如 `加1:1 作使徒的保罗...`
4. **章标题**：`# 书卷名第X章`（用于识别当前章节）

## 使用说明

### 检索操作
1. 点击左侧边栏的 📖 图标或运行命令"打开圣经检索"
2. 在"圣经搜索"选项卡中：
   - 选择检索种类（主题/纲目/经文）
   - 选择检索范围（全部 / 选择范围）
   - 输入检索内容，点击"🔍 查询"
3. 点击"专注模式"按钮可折叠搜索区域，扩大结果显示空间
4. 在结果中点击卡片选中，再次点击取消
5. 选中后点击"逐节投影"、"并列投影"或"混合投影"

### 阅读操作
1. 切换到"圣经阅读"选项卡
2. 点击书卷简称 → 点击章节编号 → 阅读内容
3. 点击"专注模式"按钮可折叠控制区域，扩大阅读空间
4. 使用顶部按钮进行全选、复制、投影等操作
5. 使用"快速跳转"下拉框快速切换书卷和章节

### 检索语法示例

| 输入 | 说明 |
|------|------|
| `加1:1` | 加拉太书1章1节 |
| `路一1～3` | 路加福音1章1至3节 |
| `太1:1-2:5` | 马太福音1章1节至2章5节 |
| `世人 恩典` | 同时包含"世人"和"恩典"的经文 |
| `路2:1，世人` | 路加2章1节，以及包含"世人"的经文 |
| `太1:1-2:5` | 马太福音1章1节至2章5节 |
| `太1:1~5` | 马太福音1章1至5节 |
| `太1:1, 5` | 马太福音1章1节和1章5节（延续引用） |
| `约一1, 十四7~21, 23` | 约翰福音1章1节、14章7至21节、14章23节（混合延续） |
| `世人 恩典` | 同时包含"世人"和"恩典"（忽略顺序） |
| `世人，恩典` | 同时包含，且按输入顺序出现 |
| `世人；恩典` | 包含任意一个，按关键词顺序展示 |
| `世人。恩典` | 包含任意一个，按经文顺序展示 |

## 关键词匹配模式

检索汉字关键词时，分隔符决定匹配行为：

| 分隔符 | 模式 | 是否顺序敏感 | 结果排序 |
|--------|------|-------------|----------|
| 空格 ` ` / 顿号 `、` | 同时包含 | 否（忽略顺序） | 经文顺序 |
| 逗号 `，` / `,` | 同时包含 | **是**（按输入顺序） | 经文顺序 |
| 分号 `；` / `;` | 包含任意 | 是 | 关键词顺序 |
| 句号 `。` / `.` | 包含任意 | 否 | 经文顺序 |

## 检索语法参考

### 经文出处格式

| 格式 | 示例 | 含义 |
|------|------|------|
| 书卷+中文章+阿拉伯节 | `太一1` | 马太福音1章1节 |
| 书卷+阿拉伯章:节 | `太1:1` | 马太福音1章1节 |
| 书卷+中文章+阿拉伯节范围 | `太一1~5` | 马太福音1章1至5节 |
| 书卷+阿拉伯章:节范围 | `太1:1~5` | 马太福音1章1至5节 |
| 书卷+跨章范围 | `太一1~二1` | 马太福音1章1节至2章1节 |
| 书卷+阿拉伯跨章范围 | `太1:1~2:1` | 马太福音1章1节至2章1节 |
| 延续引用（同书卷） | `约一1, 十四7~21` | 约翰福音1章1节、14章7至21节 |

## 注意事项

1. 确保圣经文档严格按照命名规则和格式要求存放
2. 插件启动时会自动加载圣经数据，首次加载可能需要一些时间
3. 修改圣经文档后，需要重新打开检索视图或重启 Obsidian 以更新数据
4. 移动端和桌面端均支持

## ☕ 支持

如果觉得这个插件对你有帮助，可以给予支持，以便继续开发。

> **加 6:6** — 只是那在话语上受教的，当与施教的人共同分享一切的美物。

<img src="https://github.com/ViaCai/bitiful-helper/blob/main/images/wechat-pay.png" alt="微信收款码" width="240" />

## 许可证

MIT License

---

# English Documentation

## Features

### Bible Search
- **Search types**: Theme, Outline, Verse (multi-selectable)
- **Search scope**: Entire Bible, Single book, Multiple books
- **Search syntax**:
  - Verse references: `Gal1:1`, `Luke1:1-3`, `Matt1:1-2:5`
  - Keyword search: multiple words separated by spaces/commas
  - Mixed search: combine verse references and keywords
- **Results**: Paginated display (50 per page), keyword highlighting
- **Clickable references**: Click any verse reference to open the Bible document at the exact location
- **Selection**: Click to select/unselect, numbered order (1, 2, 3...)
- **Side-by-side tag**: Mark items for mixed projection grouping

### Projection Modes
- **Focus mode**: One item per slide, navigate with arrow keys
- **Parallel mode**: All items on one slide
- **Mixed mode**: Grouped by side-by-side tags, one group per slide
- **Controls**: Arrow keys / scroll wheel for navigation, +/- for font size, T for theme toggle, ESC to exit

### Bible Reader
- **Book browsing**: Old Testament / New Testament grid, click to enter chapter selection
- **Chapter reading**: Display themes, outlines, and verses with adjustable font size
- **Quick jump**: Book dropdown + Chapter dropdown for instant navigation
- **Chapter navigation**: Previous / Next chapter buttons
- **Selection**: Click cards to select/unselect, cumulative numbering
- **Copy functions**: Copy verses / copy outlines / copy selected items
- **Projection**: Focus projection / Parallel projection (current chapter only)

## Installation

### From Obsidian Community Plugins (Recommended)

1. Open Obsidian Settings → Community Plugins
2. Turn on "Safe mode" off if needed
3. Click "Browse" and search for "Bible Search and Reader"
4. Click "Install" then "Enable"

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/ViaCai/obsidian-bible-search-reader/releases)
2. Extract the files to your vault's `.obsidian/plugins/bible-search-reader/` folder
3. In Obsidian Settings → Community Plugins, enable "Bible Search and Reader"

## Setup

1. Open Obsidian Settings → Community Plugins → Bible Search and Reader
2. Set **Old Testament Path**: the folder containing Old Testament Markdown files (e.g., `Bible/Old Testament`)
3. Set **New Testament Path**: the folder containing New Testament Markdown files (e.g., `Bible/New Testament`)

## Bible Documents Download

This plugin requires Bible Markdown documents in a specific format. You can download the sample documents here:

- [Download Bible Documents (ZIP)](https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/1.0.0/bible-documents.zip)

> ⚠️ **Note**: If you downloaded the documents before July 31, please re-download the latest version. The latest Bible documents have fixed some bugs.

> 💡 **Tip**: If you need a different Bible version, you can modify the downloaded documents according to the format requirements below, or create your own documents following the template.

## Document Format Requirements

### File Naming
Recommended format: `Number. Book Name.md`

- Old Testament examples: `01. Genesis.md`, `37. Haggai.md`
- New Testament examples: `40. Matthew.md`, `48. Galatians.md`
- Old and New Testament files should be in separate folders

### File Content Format

```markdown
---
title:
author:
---
> **Theme: Book theme content**

# Book Name Chapter 1

> I. Outline content 1:1-5

BookShortName1:1 Verse content
BookShortName1:2 Verse content

# Book Name Chapter 2

> II. Outline content 2:1-10

BookShortName2:1 Verse content
```

### Format Rules
1. **Theme**: `> **Theme: theme content**`
2. **Outline**: `> outline content` (starts with `>` but does not contain "Theme")
3. **Verse**: `BookShortNameChapter:Verse Verse content`, e.g., `Gal1:1 Paul, an apostle...`
4. **Chapter title**: `# Book Name Chapter X` (used to identify current chapter)

## Usage

### Search
1. Click the 📖 icon in the left sidebar or run the command "Open Bible Search"
2. In the "Bible Search" tab:
   - Select search types (Theme / Outline / Verse)
   - Select search scope (All / Single book / Multiple books)
   - Enter search query and click "🔍 Search"
3. Click cards to select/unselect
4. **Click verse references** in results to jump directly to the corresponding Bible document
5. Click "Focus Projection", "Parallel Projection", or "Mixed Projection"

### Reading
1. Switch to the "Bible Reader" tab
2. Click a book abbreviation → click a chapter number → read content
3. Use top buttons for select all, copy, projection, etc.
4. Use "Quick Jump" dropdowns to switch books and chapters instantly

### Search Syntax Examples

| Input | Description |
|-------|-------------|
| `Gal1:1` | Galatians 1:1 |
| `Luke1:1-3` | Luke 1:1 to 1:3 |
| `Matt1:1-2:5` | Matthew 1:1 to 2:5 |
| `grace love` | Verses containing both "grace" and "love" |
| `Luke2:1, grace` | Luke 2:1, plus verses containing "grace" |
| `Matt1:1-2:5` | Matthew 1:1 to 2:5 |
| `Matt1:1~5` | Matthew 1:1 to 1:5 |
| `Matt1:1, 5` | Matthew 1:1 and Matthew 1:5 (continuation) |
| `John1:1, 14:7-21, 23` | John 1:1, John 14:7-21, John 14:23 (mixed continuation) |
| `grace love` | Verses containing both "grace" and "love" (ignore order) |
| `grace, love` | Verses containing both, in input order |
| `grace; love` | Verses containing either, sorted by keyword order |
| `grace. love` | Verses containing either, sorted by verse order |

## Keyword Matching Modes

When searching by keywords (not verse references), the separator determines the matching behavior:

| Separator | Mode | Order Sensitive | Result Sorting |
|-----------|------|-----------------|----------------|
| Space ` ` / 顿号 `、` | AND | No (ignore order) | Verse order |
| Comma `,` / `，` | AND | **Yes** (input order) | Verse order |
| Semicolon `;` / `；` | OR | Yes | Keyword order |
| Period `.` / `。` | OR | No | Verse order |

## Search Syntax Reference

### Verse Reference Formats

| Format | Example | Meaning |
|--------|---------|---------|
| Book + Chinese chapter + Arabic verse | `太一1` | Matthew 1:1 |
| Book + Arabic chapter:verse | `太1:1` | Matthew 1:1 |
| Book + Chinese chapter + Arabic verse range | `太一1~5` | Matthew 1:1-5 |
| Book + Arabic chapter:verse range | `太1:1~5` | Matthew 1:1-5 |
| Book + cross-chapter range | `太一1~二1` | Matthew 1:1 to 2:1 |
| Book + Arabic cross-chapter range | `太1:1~2:1` | Matthew 1:1 to 2:1 |
| Continuation (same book) | `约一1, 十四7~21` | John 1:1, John 14:7-21 |

## Notes

1. Ensure Bible documents are stored according to the naming and format requirements
2. The plugin loads Bible data on startup; first load may take some time
3. After modifying Bible documents, reload the search view or restart Obsidian to update data
4. Supports both desktop and mobile platforms

## ☕ Support

If you find this plugin helpful, your support is greatly appreciated to continue development.

> **Galatians 6:6** — Let the one who is taught the word share all good things with the one who teaches.

<img src="https://github.com/ViaCai/bitiful-helper/blob/main/images/wechat-pay.png" alt="WeChat Pay" width="240" />

## License

MIT License
