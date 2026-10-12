# 圣经检索与阅读 (Bible Search and Reader) 

![Version](https://img.shields.io/github/v/release/ViaCai/obsidian-bible-search-reader?label=version&color=blue) ![License](https://img.shields.io/badge/license-MIT-green)

> Obsidian 插件，用于多版本圣经数据的检索、阅读与投影。支持内置恢复本和和合本对照、智能检索语法和投影模式。

<img src="https://github.com/ViaCai/obsidian-bible-search-reader/blob/main/images/ScreenShot-new.png" alt="插件展示" />

> 📖 使用教程（含演示视频）：[公众号教程](https://mp.weixin.qq.com/s/Ylzdu8Lr9hNePXNilQs4NQ)

## 功能特性

- **多版本圣经支持**：同时加载多个圣经版本，支持恢复本、新标点和合本及自定义版本
- **多版本对照阅读**：检索和阅读时可选开启对照模式，在主版本经文下方显示其他版本
- **版本选择引导**：首次安装或数据缺失时自动弹出引导窗口，帮助用户选择并下载所需的圣经版本
- **版本管理设置**：全新的版本管理界面，支持启用/禁用版本、设置主版本、删除版本、下载新版本
- **圣经搜索**：支持主题、纲目、经文三种检索类型；可按全部圣经或自定义书卷范围搜索
- **智能检索语法**：支持经文出处（`太1:1`、`路一1～3`）、关键词（多词组合匹配）、以及混合检索
- **阅读模式**：书卷/章节网格浏览，快速跳转，字体调节，主题与纲目同屏显示
- **投影模式**：选中内容后可逐节、并列或混合投影，支持键盘/滚轮/触屏操作；投影内可直接打开检索窗口检索新内容并更新投影
- **保留候选**：勾选「保留候选」后，选中的经文会实时进入候选池并即时更新数量，可跨检索/跨书卷/跨标签页保留已选经文（经文弹窗中勾选的经文也可入池），按顺序累计投影；取消勾选后，经文弹窗 / 圣经搜索 / 圣经阅读各自保留自己的候选，各窗口分别投影
- **文章内圣经引用自动识别**：阅读笔记时，自动识别文中所出现的圣经引用，点击可查看经文内容，双击可查看经文上下文
- **自动更新**：支持启动时自动检测新版本，一键下载并安装更新

---

## 快速开始

### 首次安装引导

1. **安装插件**：从 Obsidian 社区插件市场搜索 "Bible Search and Reader" 安装启用
2. **版本选择引导**：启用后自动弹出引导窗口，显示已安装的版本和可下载的版本
3. **选择版本**：勾选需要的圣经版本（可多选），点击「下一步」
4. **自动下载**：若选择的版本本地不存在，插件自动从 GitHub 下载对应数据文件
5. **开箱即用**：下载完成后直接点击左侧 📖 图标开始使用

> 📦 所有圣经数据以内置 JSON 形式存放在插件目录（vault 内 `.obsidian/plugins/bible-search-reader/`），仓库不会增加额外文件。

### 数据缺失自动检测

插件每次启动时都会真实扫描插件目录下的圣经数据文件。如果数据文件被删除或从未下载，会自动弹出版本选择引导窗口，确保始终至少有一个可用的圣经版本。

### 跨书卷选中管理

阅读视图中，选中内容仅在当前书卷内有效。切换书卷时会自动过滤掉旧书卷的选中项，避免计数跨书卷累加。同一书卷内跨章节选中不受影响，方便投影连续章节内容。

### 版本管理

在插件设置中可管理已安装的版本：
- **启用/禁用**：控制哪些版本可用
- **设置主版本**：选择检索和阅读时的默认版本
- **删除版本**：移除不再需要的版本数据
- **下载新版本**：从列表中选择并下载新的圣经版本

---

## 圣经版本

| 文件 | 说明 |
|------|------|
| `main.js` | 插件主程序（必要） |
| `manifest.json` | 插件清单（必要） |
| `styles.css` | 插件样式（必要） |
| `bible-crv-data.json` | 内置原注版圣经数据（中文原注版，约 14MB） |
| `bible-cuvs-data.json` | 内置新标点和合本圣经数据（中文原注版，约 13MB） |

> 💡 如需使用其他圣经版本，直接叫AI照着bible-crv-data.json的内容格式为模板，生成你所要的圣经版本，并照着下方的推荐命名表命名文件，比如思高本，就命名为bible-sgb-data.json


### 标准版本映射表

插件支持以下 14 个标准中文圣经版本：

| 版本名称 | 标准缩写 | 文件名 | 说明 |
|---------|---------|--------|------|
| 1919原版官话和合本 | CUV | `bible-cuv-data.json` | 原始和合本 |
| 简体新标点和合本 | CUVS / CUNP | `bible-cuvs-data.json` | 主流简体中文版本 |
| 和合本修订版 | RCUV | `bible-rcuv-data.json` | 和合本修订版 |
| 恢复本 | CRV / RCV | `bible-crv-data.json` |  Recovery Version，推荐 |
| 新译本 简体 | CNVS / CNV / NCV | `bible-cnvs-data.json` | 台湾圣经公会新译本 |
| 新译本 繁体 | CNVT | `bible-cnvt-data.json` | 繁体字版本 |
| 现代中文译本 | TCV | `bible-tcv-data.json` | 现代中文译本 |
| 当代圣经 简体 | CCB | `bible-ccb-data.json` | 当代圣经简体中文版 |
| 当代圣经 繁体 | CCBT | `bible-ccbt-data.json` | 当代圣经繁体中文版 |
| 新普及译本 | CNLT | `bible-cnlt-data.json` | 新普及译本 |
| 吕振中译本 | LZZ / LZC | `bible-lzz-data.json` | 吕振中译本 |
| 思高本 | SGB / SBV | `bible-sgb-data.json` | 思高圣经译本 |
| 牧灵圣经 | CCBIB | `bible-ccbib-data.json` | 牧灵圣经 |
| 中文标准译本 | CSBS / CSB | `bible-csbs-data.json` | 中文标准译本 |

> 💡 **默认提供版本**：恢复本 (CRV) 和新标点和合本 (CUVS) 在 Release 中默认提供。

### 自定义版本命名规则

使用其他中文圣经版本时，请按以下规则准备数据文件：

1. **文件命名**：`bible-{缩写}-data.json`
   - 示例：`bible-cuvs-data.json`、`bible-crv-data.json`
   - 缩写建议：使用 3-6 个字母的小写英文缩写
2. **数据格式**：JSON 数组，每条记录包含以下字段：
   ```json
   {
     "bookId": 1,
     "chapter": 1,
     "verse": 1,
     "type": "verse",
     "content": "起初神创造天地。",
     "testament": "OT",
     "bookShortName": "创",
     "bookFullName": "创世记",
     "lineIndex": 0
   }
   ```
3. **放置位置**：将文件放到插件目录（`.obsidian/plugins/bible-search-reader/`）下
4. **自动识别**：插件启动时会自动识别该版本，在设置中可启用并设为主版本

### 数据文件命名规范

| 文件类型 | 命名格式 | 示例 |
|---------|---------|------|
| 标准版本数据 | `bible-{缩写}-data.json` | `bible-cuvs-data.json` |
| 自定义版本数据 | `bible-{自定义缩写}-data.json` | `bible-myversion-data.json` |
| 版本元数据 | `versions.json` | （插件自动生成） |

---

## 使用指南

### 搜索

1. 点击左侧边栏 📖 图标或运行命令「打开圣经检索」
2. 点击「对照」按钮，在侧边栏勾选要使用的圣经版本（可多选）
3. 勾选多个版本时，最上方的版本为主版本，其余为对照版本，可拖动调整顺序
4. 选择检索种类（主题/纲目/经文）和范围，输入内容后点击「🔍 查询」
5. 开启多版本对照后，搜索结果下方会显示其他版本的对照经文
6. 点击结果卡片选中（可排序、标记并列），对照版本也有独立的候选框可选中
7. 点击「逐节/并列/混合投影」进行投影

### 阅读

1. 切换到「圣经阅读」选项卡
2. 点击书卷简称 → 章节编号 → 阅读内容
3. 开启多版本对照后，每节经文下方会显示其他版本对照
4. 点击卡片或对照版本的候选框选中内容，可进行复制或投影

### 对照设置说明

- **全局对照面板**：点击「对照」按钮打开，同时影响圣经检索和圣经阅读视图
- **版本排序**：拖动调整版本顺序，最上方为显示优先级最高的主版本
- **独立操作**：对照版本的经文拥有独立的候选框，可独立选中用于复制和投影
- **简洁显示**：对照经文不再显示版本全名，直接显示经文内容，复制/投影时自动补上版本简称和出处
- **投影支持**：逐节、并列、混合投影均支持同时显示多个版本，对照版本自动弱化显示

### 全局操作与本页操作

**全局操作**（作用于整个书卷或所有已选中内容）：
- **保留候选**（标题右侧复选框）：两个标签页与经文弹窗共用同一个开关。勾选后，选中的经文会**实时**进入候选池——每选中一处就立即按序加入，右侧的候选数量与经文序号即时刷新，重新搜索、切换书卷/章节、切换标签页、开关弹窗都不会丢失（主版本与对照版本均保留）；取消勾选某处经文也会立即从候选池移除。经文弹窗的「保留候选」开关默认不勾选，勾选后弹窗内勾选的经文同样进入候选池。刚勾选开关时已有的选中项会立即纳入候选池。默认关闭时保持原有行为（切换书卷会清空旧书卷选中项）。点击「清空」可一键清空保留的候选（「取消全选」也会一并清空）。取消勾选时会把已保留的候选按来源归还到检索页 / 阅读页，两个视图都从 1 重新开始编号
- **全局全选**：按顺序选中当前书卷所有章节的主版本内容（含主题）
- **全局取消**：取消所有已选中的内容（跨所有章节）
- **全局复制**：复制所有已选中的内容
- **逐节/并列/混合投影**：投影所有已选中的内容

**本页操作**（仅作用于当前章节）：
- **本页全选**：选中当前章的主版本内容（第一章额外包含主题）
- **本页复制**：仅复制当前章已选中的内容
- **复制经文**：复制当前章主版本的全部经文
- **复制纲目**：复制当前章主版本的纲目

### 投影操作

- `←/→` 或 `空格`：翻页
- `+/-`：调整字体大小
- `T`：切换深色/浅色主题
- `🔍 检索`（底部栏按钮）：在不关闭投影的情况下，把投影区宽度收窄、右侧空出侧边栏显示圣经检索；检索并选中新经文后点击「逐节/并列/混合投影」，投影内容会**原地更新**（尺寸不变），拖动侧边栏宽度时投影区自动跟随
- `⛶ 全屏`（同一按钮切换）：把投影恢复为满屏
- `ESC`：退出投影

### 自动识别文章中的圣经引用

- **单击经文出处**：单击打开经文弹窗，显示具体经文内容
- **双击经文出处**：双击跳转到圣经阅读区域中查看该经文的上下文

**省略书卷名的写法（上下文继承）**：

- 只写章节、没写书卷时，会自动沿用**本文档前文中最后出现的书卷**；跨行、跨段落都有效（换一篇笔记会重新开始）。例如：

```
壹　神的创造　创一1～二25
一　神的心愿和目的　一1～二3      ← 创世记 1:1～2:3
1神原初的创造　一1，路一1-二2     ← 创世记 1:1；路加福音 1:1～2:2
2 神看一切都甚好　4              ← 路加福音 2:4（续接前一处范围的结束章）
如在四章一节的内。约翰一章一节说到的话。  ← 路加福音 4:1；约翰福音 1:1
二章一节                        ← 约翰福音 2:1
```

- 章上下文取前一处的**结束章**：`路一1-二2` 之后单写 `4` 即为路加福音 2:4
- 同一行内的省略写法不会被后面才出现的书卷名带偏：`一1，路一1-二2` 中的 `一1` 仍按创世记解析
- 成串的省略写法会一次高亮：`一2，一3，二4` 识别为一处引用（创世记 1:2、1:3、2:4）

**经文弹窗操作**：

- `A-` / `A+`：缩小 / 放大弹窗字体（调整后的字体大小会被记住，下次弹窗自动沿用）
- `全选` / `取消`：合并为同一个按钮——未全选时显示「全选」，已全选时自动变成「取消」
- `复制`：复制弹窗中已勾选的经文（带出处）。勾选「保留候选」且候选池或圣经搜索 / 圣经阅读中也有选中经文时，会先弹出「本页复制 / 全局复制」供选择；否则只复制本弹窗的经文
- `投影`：点击后给出「逐节 / 并列 / 混合」三种投影模式。未勾选「保留候选」时只投影本弹窗的经文；勾选后按全局顺序投影候选池与各页面的选中经文
- `保留候选`（标题行，默认不勾选）：勾选后，弹窗中勾选的经文会实时进入候选池，可与圣经搜索 / 圣经阅读的选中项一起投影；取消勾选某节会即时移出候选池。右侧的候选数量与圣经搜索 / 圣经阅读保持一致——勾选时显示候选池总数，未勾选时只统计本弹窗自己的候选
- 标题行在候选数量大于 0 时显示 `清空`，与圣经搜索 / 圣经阅读的「清空」一致：**一次清空三个窗口的全部候选**（经文弹窗 / 圣经搜索 / 圣经阅读，含所有经文弹窗的候选）
- 未勾选「保留候选」时，每处经文引用的弹窗都**独立统计**、从 1 开始编号，弹窗之间互不累计；关闭再打开仍然保留
- 每处经文前是与圣经搜索 / 圣经阅读相同的**候选框**：未选中是空框，选中后在框内直接显示**选中顺序**编号——未勾选「保留候选」时按本弹窗从 1 开始编号，勾选后按全局顺序编号，与实际投影顺序一致
- 选中后的经文后面会出现**「并」标签**（与圣经搜索 / 圣经阅读一致）：点击切换为「✓ 并列」，混合投影时该节会与前一节合并到同一页
- **双击弹窗中的经文出处**（顶部出处或每节前的 `章:节`）：跳转到圣经阅读页面对应的经文位置，方便查看上下文
- 三个窗口（经文弹窗 / 圣经搜索 / 圣经阅读）各自保留自己的候选：取消勾选「保留候选」时，各窗口的选中项仍然保留，在哪个窗口点「投影」就只投影哪个窗口的内容

---

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

---

## 更新

### 插件本体更新

插件支持自动检测更新：
- **自动检测**：设置 → 插件更新 → 自动检测更新（默认开启），启动时自动检查新版本
- **手动检查**：设置 → 插件更新 → 🔍 检查更新
- **一键更新**：检测到新版本后，点击「立即更新」即可自动下载并安装

**更新说明**：无论用哪种方式安装或更新（插件自带的更新功能、Obsidian 第三方插件市场、BRAT、手动覆盖安装），只要版本号发生变化，下次启动 Obsidian 时都会自动弹出**最新版的更新内容**（内置更新日志优先，缺失时自动从 GitHub 拉取）；版本没变就不会重复弹。想随时回看，可以运行命令「查看当前版本的更新说明」，或在设置 → 插件更新里点「📜 查看」。

### 圣经数据更新

> 插件本体的自动更新**只会下载** `main.js` / `manifest.json` / `styles.css`，
> 不会带上十几 MB 的圣经数据文件。所以圣经数据单独有一套更新机制。

圣经数据（恢复本、和合本）托管在仓库 main 分支的 `data/` 目录，并配有版本清单
`bible-data-manifest.json`（记录每个数据文件的版本号、大小、校验值与本次变更说明）。

- **自动检测**：开启「自动检测更新」后，启动时联网比对云端清单（12 小时节流一次）
- **发现更新**：右下角弹出常驻通知，显示哪些数据文件有修正版及大致体积，
  提供「查看详情 / 立即更新 / 稍后」
- **查看详情**：列出本次改了什么，例如修复了哪些经文缺失、对齐了哪些分节边界
- **一键更新**：确认后自动下载并覆盖，覆盖前把旧数据备份为 `<文件名>.old`，
  全部完成后自动重新加载圣经数据
- **手动检查**：运行命令「检查圣经数据更新」，或在设置 → 圣经版本管理里点「🔍 检查数据更新」

以后若再发现数据错误，只需更新 `data/` 下的文件并修改清单里的版本号与变更说明，
再推送到 GitHub，已安装的用户启动时就会收到提示并可一键完成更新。

---

## 兼容性说明

### 数据源模式

- **2.1.0 起仅支持内置数据模式**，移除了外置数据模式，简化架构
- 旧版本数据自动迁移：自动检测旧版 `bible-data.json` 并迁移为恢复本（CRV）版本

### 平台支持

- 移动端与桌面端均支持
- 数据文件统一通过 Obsidian 的 Vault Adapter API 读写（vault 内 `.obsidian/plugins/bible-search-reader/`），桌面端与移动端行为一致

---

## Overview

Bible Search and Reader is an Obsidian plugin for searching, reading, and projecting multiple Chinese Bible versions in parallel. It features built-in multi-version data, smart search syntax, side-by-side comparison reading, fullscreen projection modes, inline Bible reference highlighting inside your notes, and a first-run setup wizard.

## Installation

**Method 1 — Obsidian Community Plugins (recommended):**

1. In Obsidian, open Settings → Community plugins → Browse
2. Search for "Bible Search and Reader" and click **Install**
3. Click **Enable** to activate the plugin

**Method 2 — From GitHub Releases (manual):**

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create the folder `.obsidian/plugins/bible-search-reader/` in your vault
3. Copy the three files into that folder
4. Enable the plugin in Settings → Community plugins

**First-run setup:**

1. After enabling, a version selection wizard opens automatically
2. Tick the Bible version(s) you want (multiple allowed), then click "Next"
3. Missing data files are downloaded automatically from GitHub
4. Once done, open the plugin via the 📖 icon in the left ribbon

The plugin works on desktop and mobile. Data files are stored inside the vault at `.obsidian/plugins/bible-search-reader/`, so no external files are added to your vault.

**What's new after updating**: however the plugin was installed or updated (its built-in updater, Obsidian's community plugin store, BRAT, or copying files in manually), it compares the last recorded version with the current one on startup and shows the **latest release notes** whenever the version changes (built-in changelog first, fetched from GitHub when missing). It never re-shows the same version. You can also re-open it anytime with the "View release notes for the current version" command or the 📜 button under Settings → Plugin update.

## Usage

- **Search**: click the 📖 ribbon icon (or run the "Open Bible Search" command). Pick the search type (theme / outline / verse) and range, type a query, and search.
- **Search syntax**: verse references like `太1:1`, `路一1～3`, `加1:1-2:5`, plus keyword matching. Space/`、` = AND, `，`/`,` = ordered AND, `；`/`;` = ordered OR, `。`/`.` = unordered OR.
- **Comparison reading**: click the "对照" button to enable side-by-side versions. The top version is the primary one; drag to reorder. Each version's verses have independent checkboxes for copying and projection.
- **Reader view**: switch to the "圣经阅读" tab, pick a book and chapter, then read. Selected verses can be copied or projected.
- **Projection**: select verses, then choose "逐节 / 并列 / 混合投影". Controls: `←/→`/`Space` to navigate, `+/-` for font size, `T` to toggle theme, `ESC` to exit. The `🔍 检索` button shrinks the projection horizontally and reveals the Bible search panel in the right sidebar; re-projecting updates the slide in place, and `⛶ 全屏` restores full screen.
- **Projection search**: the 🔍 button in the projection bottom bar opens the search window without closing the projection; re-select verses and project to update.
- **Keep candidates**: the 「保留候选」 checkbox beside "全局操作" is shared by both tabs. Once ticked, every verse you select is added to the candidate pool **in real time** — the counter and verse numbers update immediately, and nothing is lost on re-search, book/chapter switch or tab switch. Unticking a verse removes it from the pool at once. A 「清空」 button clears the pool. Unticking the checkbox releases kept candidates back to the search/reader view and restarts numbering from 1.
- **Reference highlighting**: while reading notes, Bible references in the text are automatically highlighted. References that omit the book name inherit the last book mentioned earlier in the same note (works across lines and paragraphs), and a bare verse number continues from the end chapter of the previous range. Single-click a reference to open the verse popup (font +/-, a combined 全选/取消 toggle, 复制 and 投影, per-verse checkboxes that show the selection-order number once selected (same box style as the search / reader tabs), a 「并」 tag behind each selected verse for side-by-side projection, and remembered font size). The popup keeps its own candidates: with 「保留候选」 unticked, the popup, the search tab and the reader tab each keep their own selections, and projecting from one of them only projects that window's content (each reference's popup numbers its own verses from 1, and the selections survive closing the popup). Its header shows 保留候选 + count + a 清空 button; the count follows the same rule as the search / reader tabs (shared pool total when ticked, the popup's own count when unticked), and 清空 clears every window's candidates at once (popup + search + reader). With 「保留候选」 ticked, popup verses join the shared pool so everything is projected together; 复制 then offers 本页复制 / 全局复制, and 投影 offers 逐节 / 并列 / 混合. Double-click a reference (or a `章:节` inside the popup) to jump to the reader view.
- **Version management**: in plugin settings, enable/disable versions, set the primary version, delete versions, or download new ones.

---

## 许可证

MIT License

## ☕ 如果觉得这款插件对您有帮助，也可以支持我的项目

加6:10 所以我们有了时机，就当向众人行善，尤其是向信仰之家的人。

<img src="https://raw.githubusercontent.com/ViaCai/bitiful-helper/main/images/wechat-pay.png" alt="微信收款码" width="240" />


