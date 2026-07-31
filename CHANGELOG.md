# 更新日志 / Changelog

---

## 中文

## [1.0.4] - 2026-08-01

### 修复
- **经文解析引擎修复**：修复了 14 个书卷（撒上、撒下、王上、王下、代上、代下、林前、林后、帖前、帖后、提前、提后、彼前、彼后）因正则表达式字符类误用导致的经文完全无法解析的问题。
- **书卷识别精确匹配**：修复了不带序号前缀的文件名回退匹配时，因简称前缀冲突导致的识别错误（如 `约翰一书.md` 被误识别为 `约翰福音`，`撒母耳记下.md` 被误识别为 `撒母耳记上`）。现在按简称长度降序匹配，优先匹配最长前缀。
- **阅读模式混合投影**：修复了「圣经阅读」标签页中「混合投影」按钮点击无响应的问题。
- **搜索结果高亮区域点击**：修复了点击搜索结果中高亮的关键词时无法选中/取消选中卡片的问题。
- **纲目误过滤**：修复了纲目内容中若包含「主题」二字会被错误跳过的问题，现在使用精确正则区分主题和纲目。
- **选择器注入风险**：阅读界面使用行号索引定位卡片，避免将经文内容拼入 CSS 选择器导致的潜在语法错误。

### 优化
- 删除未使用的 `isVerseReference` 方法和 `currentChapterVerses` 变量。
- 清理 `renderChapterContent` 中的冗余空循环代码。

---

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

## [1.0.4] - 2026-08-01

### Fixed
- **Verse parsing engine fix**: Fixed an issue where 14 books (1Sam, 2Sam, 1Ki, 2Ki, 1Ch, 2Ch, 1Co, 2Co, 1Th, 2Th, 1Ti, 2Ti, 1Pe, 2Pe) had all verses completely skipped due to incorrect regex character class usage.
- **Accurate book name matching**: Fixed fallback filename matching errors caused by short-name prefix conflicts (e.g., `1John.md` misidentified as `John`, `2Samuel.md` as `1Samuel`). Now matches by descending short-name length to prioritize the longest prefix.
- **Reader mixed projection**: Fixed the unresponsive "Mixed Projection" button in the Bible Reader tab.
- **Search result highlight clickability**: Fixed an issue where clicking highlighted keywords in search results would not toggle card selection.
- **Outline mis-filtering**: Fixed outlines containing the word "theme" being incorrectly skipped. Now uses a precise regex to distinguish themes from outlines.
- **Selector injection risk**: Reader view now uses line-index attributes for card positioning instead of embedding verse content into CSS selectors.

### Improved
- Removed unused `isVerseReference` method and `currentChapterVerses` variable.
- Cleaned up redundant empty loop in `renderChapterContent`.

---

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
