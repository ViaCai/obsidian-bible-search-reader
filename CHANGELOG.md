# 更新日志 / Changelog

---

## 中文

## [1.0.3] - 2026-07-31

### 新增
- **搜索结果经文出处可点击**：点击搜索结果中的经文出处，可直接跳转到圣经文档中对应的位置。
- **智能标签页复用**：点击经文出处时，插件会复用已有的圣经文档标签页，而不会重复创建新标签页。
- **自动聚焦跳转**：跳转经文时，圣经标签页会自动激活并获得焦点。

### 修复
- **书卷精确匹配**：修复了因字符串匹配冲突导致的书卷跳转错误（如"亚"同时匹配约书亚记和撒迦利亚书，"加"同时匹配路加福音和加拉太书）。现在使用书卷数字 ID 进行精确文件匹配。
- **经文精确定位**：使用 Obsidian 原生 `eState.line` 参数打开文件并定位到精确行，确保目标经文可见。
- **编辑器高亮**：跳转后目标经文行会被选区高亮显示。

---

## [1.0.2] - 2026-07-31

### 修复
- **阅读选中状态残留**：切换到其他章节时，自动清空上一章的选中状态
- **检索引擎完全重写**：
  - 支持中文数字 + 阿拉伯数字混合格式：`太一1`、`太十一2`、`约壹一1`、`约贰一1`、`约叁一1`
  - 支持冒号格式：`太1:1`
  - 支持范围分隔符 `~` 或 `-`：`太一1~5`、`太一1-二1`、`太1:1~2:1`
  - 支持延续引用（逗号后省略书卷前缀）：`约一1,十四7~21,23` → 约1:1、约14:7-21、约14:23
  - 支持混合延续引用：`三34` → 3章34节、`十六13~15` → 16章13-15节
- **修复检索卡住问题**：纯数字字符串如 `21` 不再被错误拆分为 `2:1`
- **约翰二书/三书别名支持**：文档格式 `约二1:1`、`约三1:1` 正确映射到 `约贰`、`约叁`

### 新增
- **关键词匹配模式**：
  - 空格 / 顿号（`、`）：AND 模式，忽略关键词顺序
  - 逗号（`，` / `,`）：AND 模式，**保留输入顺序**（关键词在经文中必须按输入顺序出现）
  - 分号（`；` / `;`）：OR 模式，结果按关键词顺序展示
  - 句号（`。` / `.`）：OR 模式，结果按经文顺序展示
- **专注模式**：一键折叠搜索/阅读控制区域，扩大内容显示空间
- **书卷选择器网格**：多书卷检索范围使用 66 卷书卷可视化网格选择

---

## [1.0.1] - 2026-07-25

### 修复
- 小错误修复和稳定性改进

---

## [1.0.0] - 2026-07-20

### 新增
- 初始版本发布
- 支持主题、纲目、经文三种检索类型
- 全屏投影：逐节、并列、混合三种模式
- 圣经阅读：书卷/章节导航

---

## English

## [1.0.3] - 2026-07-31

### Added
- **Clickable verse references in search results**: Click any verse reference in search results to jump directly to the corresponding location in the Bible document.
- **Smart tab reuse**: When clicking a verse reference, the plugin reuses an existing Bible document tab instead of creating a new one.
- **Auto-focus on jump**: The Bible tab is automatically activated and focused when jumping to a verse.

### Fixed
- **Accurate book matching by ID**: Fixed incorrect book jumps caused by string matching conflicts (e.g., "亚" matching both Joshua and Zechariah, "加" matching both Luke and Galatians). Now uses numeric book ID for precise file matching.
- **Accurate verse positioning**: Uses Obsidian's native `eState.line` parameter to open files at the exact line, ensuring the target verse is visible.
- **Editor highlight**: The target verse line is selected (highlighted) after jumping.

---

## [1.0.2] - 2026-07-31

### Fixed
- **Reader selection persistence**: Chapter selections now clear when switching to a different chapter.
- **Verse reference parsing engine completely rewritten**:
  - Supports Chinese numeral + Arabic numeral mixed format: `太一1`, `太十一2`, `约壹一1`, `约贰一1`, `约叁一1`
  - Supports colon format: `太1:1`
  - Supports range with `~` or `-`: `太一1~5`, `太一1-二1`, `太1:1~2:1`
  - Supports continuation references (book prefix omitted after comma): `约一1,十四7~21,23` → John 1:1, John 14:7-21, John 14:23
  - Supports mixed continuation: `三34` → chapter 3 verse 34, `十六13~15` → chapter 16 verses 13-15
- **Fixed infinite search hang**: Pure numeric strings like `21` are no longer incorrectly split into `2:1`.
- **John 2 & 3 John alias support**: Document formats `约二1:1` and `约三1:1` are now correctly mapped to `约贰` and `约叁`.

### Added
- **Keyword matching modes**:
  - Space / 顿号 (` `、`、`): AND mode, ignore order
  - Comma (`，`、` ,`): AND mode, **preserve input order** in verse content
  - Semicolon (`；`、`;`): OR mode, results sorted by keyword order
  - Period (`。`、`.`): OR mode, results sorted by verse order
- **Focus mode**: One-click collapse of search/reader control panels to maximize content space.
- **Book selector grid**: Multi-book search scope now uses a visual grid of all 66 books.

---

## [1.0.1] - 2026-07-25

### Fixed
- Minor bug fixes and stability improvements.

---

## [1.0.0] - 2026-07-20

### Added
- Initial release.
- Bible search with theme, outline, and verse types.
- Full-screen projection with focus, parallel, and mixed modes.
- Bible reader with book/chapter navigation.
