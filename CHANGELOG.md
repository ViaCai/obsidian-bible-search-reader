# 更新日志 / Changelog

---

## 中文

## [2.0.1] - 2026-08-06

### 修复
- **内置数据路径去重**：修复桌面端设置页面显示两处相同内置数据的问题（相对路径与绝对路径指向同一文件）。
- **README 默认版本描述**：修正默认圣经版本为「原注版圣经」（非和合本）。
- **纯关键词搜索排序**：修复单个关键词搜索时结果未按圣经书卷顺序展示的问题。

## [2.0.0] - 2026-08-04

### 新增
- **内置数据源**：插件自带圣经数据，安装后开箱即用，无需额外配置。
- **数据源切换**：设置中可选择「内置数据」或「外置数据」两种模式。
- **首次运行引导**：首次启用时自动弹出引导窗口，帮助选择数据源并自动下载。
- **一键下载**：内置/外置数据均支持一键从 GitHub Release 下载。
- **自动更新**：支持启动时自动检测新版本，一键下载并安装更新。
- **更新日志弹窗**：更新成功后自动弹出窗口显示版本更新内容。

### 改进
- **设置界面重构**：新增数据源选择区域，动态显示对应选项及状态。
- **兼容旧版本**：自动检测旧版配置，默认切换到外置数据模式，避免升级后无法使用。
- **禁用插件清理**：禁用插件时自动关闭所有圣经视图和投影窗口，避免残留。

### 修复
- **内置数据读取**：修复 `manifest.dir` 不可靠导致的检测失败问题，增加多路径 fallback。
- **搜索结果显示异常**：修复 `highlightKeywords` 中未定义变量导致的渲染中断。
- **下载报错**：修复 `Platform is not defined` 错误，确保下载功能正常工作。

---

### 文件说明

| 文件 | 说明 |
|------|------|
| `main.js` | 插件主程序（必要） |
| `manifest.json` | 插件清单（必要） |
| `styles.css` | 插件样式（必要） |
| `bible-data.json` | 内置圣经数据（中文原注版，约 14MB） |
| `bible-documents.zip` | 外置圣经数据（中文原注版，约 1.4MB） |
| `build-bible-data.html` | 外置数据转内置数据工具（纯本地运行） |

> 💡 如需使用其他圣经版本（如和合本），可将你的文本文件交给 AI，以上述压缩包中的文档为模板，生成符合插件格式的 66 卷 Markdown 文档。

---

# 更新日志 / Changelog

---

## 中文

## [1.0.5] - 2026-08-03

### 新增
- **并列/混合投影居中选项**：增加居中投影开关，勾选后每段内容居中显示。
- **圣经阅读经文分割线**：经文卡片之间增加视觉分割线，提升阅读体验。

### 修复
- **投影模式显示区域**：内容显示区域调整为窗口的 90%，解决窗口利用率低的问题。
- **圣经阅读主题勾选**：修复主题无法显示勾选状态及特定条件下无法勾选的问题。
- **投影模式样式区分**：主题、纲目、经文在投影模式下拥有独立的视觉样式，并移除纲目和主题的背景框。
- **投影主题字体大小**：修复主题字体过小且无法随字体调整的问题，主题字体现在比经文大 15%。
- **逐节投影居中选项**：移除逐节投影中的居中切换按钮（逐节投影本身即为居中显示）。
- **投影浅色主题样式失效**：修复切换浅色主题后，工具栏和按钮样式未正确切换的问题，现在通过 `light-mode` CSS 类统一管理浅色样式。
- **章节标题解析过于严格**：移除章节标题解析中 `!trimmed.includes(':')` 的限制，避免跳过如 `## 第1章：神的创造` 这类合法章节标题。
- **折叠区块功能缺失**：为「检索范围 / 全局操作 / 检索种类」三个折叠区块绑定点击事件，用户可自由展开/收起。
- **搜索视图空状态缺失**：搜索视图首次打开时添加「请输入检索内容后点击查询」引导提示。
- **标签页复用逻辑不精确**：跳转经文时改为「先精确匹配目标文件路径 → 再回退到目录匹配」，避免在错误的已打开书卷中定位经文。

### 优化
- **投影纲目出处显示**：并列/混合投影中，纲目不再显示书卷出处，直接展示内容。
- **圣经阅读全选逻辑**：第一章全选时包含书卷主题，从第二章开始全选不再选中主题。
- **阅读/检索投影出处区分**：圣经阅读模式下投影纲目不显示出处（同卷书），圣经检索模式下投影纲目显示出处（跨书卷）。
- **投影样式改用 CSS 类**：并列/混合投影中经文/主题/纲目的背景框和边框从 inline style 改为 CSS 类，支持浅色模式自动适配。
- **书卷主题字体联动**：阅读界面字体大小调节时，书卷主题区域同步联动。
- **事件注册规范化**：`onLayoutReady` 使用 `registerEvent()` 包装，确保插件卸载时自动清理。
- **代码清理**：移除 `highlightKeywords` 中的未使用变量，清理 `renderBookList` / `renderChapterList` 中的冗余 `empty()` 调用。

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

## [2.0.1] - 2026-08-06

### Fixed
- **Built-in data path deduplication**: fixed duplicate built-in data entries on desktop settings (relative and absolute paths pointing to the same file).
- **README default version description**: corrected default Bible version to "Chinese Recovery Version (原注版)" (not Union Version).
- **Single keyword search sorting**: fixed search results not being sorted by biblical book order when using a single keyword.

## [1.0.5] - 2026-08-03

### Added
- **Parallel/mixed projection centering option**: added centering toggle; content is centered when enabled.
- **Bible reader verse dividers**: added visual separators between verse cards for better readability.

### Fixed
- **Projection display area**: content area now scales to 90% of window size, improving space utilization.
- **Reader theme selection**: fixed theme checkbox state not showing and themes being unselectable under certain conditions.
- **Projection mode visual distinction**: themes, outlines, and verses now have distinct styles in projection mode; removed background boxes for themes and outlines.
- **Projection theme font size**: fixed theme font being too small and not responding to font size adjustments; theme font is now 15% larger than verse text.
- **Focus mode centering toggle**: removed centering toggle button from focus mode (focus mode is inherently centered).
- **Light theme CSS class toggle**: fixed toolbar and button styles not updating when switching to light theme; now managed via the `light-mode` CSS class.
- **Overly strict chapter title parsing**: removed the `!trimmed.includes(':')` restriction to avoid skipping valid chapter titles like `## 第1章：神的创造`.
- **Missing collapsible sections**: added click handlers to the "Search Scope", "Global Actions", and "Search Types" sections so users can expand/collapse them.
- **Missing empty state in search view**: added a "Enter search query and click Search" placeholder when the search view first opens.
- **Imprecise tab reuse logic**: changed verse jump tab reuse to "exact file path match first → fallback to folder match", preventing incorrect verse positioning in a previously opened book.

### Improved
- **Projection outline source display**: outlines in parallel/mixed projection no longer show book references, displaying content directly.
- **Reader select-all logic**: select-all in chapter 1 includes book themes; from chapter 2 onward, themes are not selected.
- **Reader vs. search projection source distinction**: outlines in reader projection omit source (same book), while search projection retains source (cross-book).
- **Projection styles moved to CSS classes**: verse/theme/outline background boxes and borders in parallel/mixed projection moved from inline styles to CSS classes, enabling automatic light-mode adaptation.
- **Book theme font size linkage**: the book theme area in the reader now syncs with font size adjustments.
- **Event registration规范化**: `onLayoutReady` now wrapped with `registerEvent()` to ensure automatic cleanup on plugin unload.
- **Code cleanup**: removed unused variables in `highlightKeywords`, and redundant `empty()` calls in `renderBookList` / `renderChapterList`.

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
