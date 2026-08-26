const { Plugin, PluginSettingTab, Setting, TFile, TFolder, ItemView, WorkspaceLeaf, Notice, Platform, requestUrl, Modal } = require('obsidian');

// ==================== 圣经书卷数据 ====================
const BIBLE_BOOKS = [
    { id: 1, fullName: '创世记', shortName: '创', testament: 'old', maxChapters: 50 },
    { id: 2, fullName: '出埃及记', shortName: '出', testament: 'old', maxChapters: 40 },
    { id: 3, fullName: '利未记', shortName: '利', testament: 'old', maxChapters: 27 },
    { id: 4, fullName: '民数记', shortName: '民', testament: 'old', maxChapters: 36 },
    { id: 5, fullName: '申命记', shortName: '申', testament: 'old', maxChapters: 34 },
    { id: 6, fullName: '约书亚记', shortName: '书', testament: 'old', maxChapters: 24 },
    { id: 7, fullName: '士师记', shortName: '士', testament: 'old', maxChapters: 21 },
    { id: 8, fullName: '路得记', shortName: '得', testament: 'old', maxChapters: 4 },
    { id: 9, fullName: '撒母耳记上', shortName: '撒上', testament: 'old', maxChapters: 31 },
    { id: 10, fullName: '撒母耳记下', shortName: '撒下', testament: 'old', maxChapters: 24 },
    { id: 11, fullName: '列王纪上', shortName: '王上', testament: 'old', maxChapters: 22 },
    { id: 12, fullName: '列王纪下', shortName: '王下', testament: 'old', maxChapters: 25 },
    { id: 13, fullName: '历代志上', shortName: '代上', testament: 'old', maxChapters: 29 },
    { id: 14, fullName: '历代志下', shortName: '代下', testament: 'old', maxChapters: 36 },
    { id: 15, fullName: '以斯拉记', shortName: '拉', testament: 'old', maxChapters: 10 },
    { id: 16, fullName: '尼希米记', shortName: '尼', testament: 'old', maxChapters: 13 },
    { id: 17, fullName: '以斯帖记', shortName: '斯', testament: 'old', maxChapters: 10 },
    { id: 18, fullName: '约伯记', shortName: '伯', testament: 'old', maxChapters: 42 },
    { id: 19, fullName: '诗篇', shortName: '诗', testament: 'old', maxChapters: 150 },
    { id: 20, fullName: '箴言', shortName: '箴', testament: 'old', maxChapters: 31 },
    { id: 21, fullName: '传道书', shortName: '传', testament: 'old', maxChapters: 12 },
    { id: 22, fullName: '雅歌', shortName: '歌', testament: 'old', maxChapters: 8 },
    { id: 23, fullName: '以赛亚书', shortName: '赛', testament: 'old', maxChapters: 66 },
    { id: 24, fullName: '耶利米书', shortName: '耶', testament: 'old', maxChapters: 52 },
    { id: 25, fullName: '耶利米哀歌', shortName: '哀', testament: 'old', maxChapters: 5 },
    { id: 26, fullName: '以西结书', shortName: '结', testament: 'old', maxChapters: 48 },
    { id: 27, fullName: '但以理书', shortName: '但', testament: 'old', maxChapters: 12 },
    { id: 28, fullName: '何西阿书', shortName: '何', testament: 'old', maxChapters: 14 },
    { id: 29, fullName: '约珥书', shortName: '珥', testament: 'old', maxChapters: 3 },
    { id: 30, fullName: '阿摩司书', shortName: '摩', testament: 'old', maxChapters: 9 },
    { id: 31, fullName: '俄巴底亚书', shortName: '俄', testament: 'old', maxChapters: 1 },
    { id: 32, fullName: '约拿书', shortName: '拿', testament: 'old', maxChapters: 4 },
    { id: 33, fullName: '弥迦书', shortName: '弥', testament: 'old', maxChapters: 7 },
    { id: 34, fullName: '那鸿书', shortName: '鸿', testament: 'old', maxChapters: 3 },
    { id: 35, fullName: '哈巴谷书', shortName: '哈', testament: 'old', maxChapters: 3 },
    { id: 36, fullName: '西番雅书', shortName: '番', testament: 'old', maxChapters: 3 },
    { id: 37, fullName: '哈该书', shortName: '该', testament: 'old', maxChapters: 2 },
    { id: 38, fullName: '撒迦利亚书', shortName: '亚', testament: 'old', maxChapters: 14 },
    { id: 39, fullName: '玛拉基书', shortName: '玛', testament: 'old', maxChapters: 4 },
    { id: 40, fullName: '马太福音', shortName: '太', testament: 'new', maxChapters: 28 },
    { id: 41, fullName: '马可福音', shortName: '可', testament: 'new', maxChapters: 16 },
    { id: 42, fullName: '路加福音', shortName: '路', testament: 'new', maxChapters: 24 },
    { id: 43, fullName: '约翰福音', shortName: '约', testament: 'new', maxChapters: 21 },
    { id: 44, fullName: '使徒行传', shortName: '徒', testament: 'new', maxChapters: 28 },
    { id: 45, fullName: '罗马书', shortName: '罗', testament: 'new', maxChapters: 16 },
    { id: 46, fullName: '哥林多前书', shortName: '林前', testament: 'new', maxChapters: 16 },
    { id: 47, fullName: '哥林多后书', shortName: '林后', testament: 'new', maxChapters: 13 },
    { id: 48, fullName: '加拉太书', shortName: '加', testament: 'new', maxChapters: 6 },
    { id: 49, fullName: '以弗所书', shortName: '弗', testament: 'new', maxChapters: 6 },
    { id: 50, fullName: '腓立比书', shortName: '腓', testament: 'new', maxChapters: 4 },
    { id: 51, fullName: '歌罗西书', shortName: '西', testament: 'new', maxChapters: 4 },
    { id: 52, fullName: '帖撒罗尼迦前书', shortName: '帖前', testament: 'new', maxChapters: 5 },
    { id: 53, fullName: '帖撒罗尼迦后书', shortName: '帖后', testament: 'new', maxChapters: 3 },
    { id: 54, fullName: '提摩太前书', shortName: '提前', testament: 'new', maxChapters: 6 },
    { id: 55, fullName: '提摩太后书', shortName: '提后', testament: 'new', maxChapters: 4 },
    { id: 56, fullName: '提多书', shortName: '多', testament: 'new', maxChapters: 3 },
    { id: 57, fullName: '腓利门书', shortName: '门', testament: 'new', maxChapters: 1 },
    { id: 58, fullName: '希伯来书', shortName: '来', testament: 'new', maxChapters: 13 },
    { id: 59, fullName: '雅各书', shortName: '雅', testament: 'new', maxChapters: 5 },
    { id: 60, fullName: '彼得前书', shortName: '彼前', testament: 'new', maxChapters: 5 },
    { id: 61, fullName: '彼得后书', shortName: '彼后', testament: 'new', maxChapters: 3 },
    { id: 62, fullName: '约翰一书', shortName: '约壹', testament: 'new', maxChapters: 5 },
    { id: 63, fullName: '约翰二书', shortName: '约贰', testament: 'new', maxChapters: 1 },
    { id: 64, fullName: '约翰三书', shortName: '约叁', testament: 'new', maxChapters: 1 },
    { id: 65, fullName: '犹大书', shortName: '犹', testament: 'new', maxChapters: 1 },
    { id: 66, fullName: '启示录', shortName: '启', testament: 'new', maxChapters: 22 }
];

const BOOK_MAP = {};
const BOOK_ID_MAP = {};
for (const book of BIBLE_BOOKS) {
    BOOK_MAP[book.shortName] = book;
    BOOK_MAP[book.fullName] = book;
    BOOK_ID_MAP[book.id] = book;
}
BOOK_MAP['约二'] = BOOK_MAP['约贰'];
BOOK_MAP['约三'] = BOOK_MAP['约叁'];
const BOOK_SHORT_NAMES = BIBLE_BOOKS.map(b => b.shortName);
if (BOOK_MAP['约二'] && !BOOK_SHORT_NAMES.includes('约二')) BOOK_SHORT_NAMES.push('约二');
if (BOOK_MAP['约三'] && !BOOK_SHORT_NAMES.includes('约三')) BOOK_SHORT_NAMES.push('约三');
BOOK_SHORT_NAMES.sort((a, b) => b.length - a.length);

// ==================== 版本数据配置 ====================
const VERSION_MAP = {
    'CUV': '1919原版官话和合本',
    'CUVS': '简体新标点和合本（主流）',
    'CUNP': '简体新标点和合本（主流）',
    'RCUV': '和合本修订版',
    'CRV': '恢复本（推荐）',
    'RCV': '恢复本（推荐）',
    'CNVS': '新译本 简体',
    'CNVT': '新译本 繁体',
    'CNV': '新译本 简体',
    'NCV': '新译本 简体',
    'TCV': '现代中文译本',
    'CCB': '当代圣经 简体',
    'CCBT': '当代圣经 繁体',
    'CNLT': '新普及译本',
    'LZZ': '吕振中译本',
    'LZC': '吕振中译本',
    'SGB': '思高本',
    'SBV': '思高本',
    'CCBIB': '牧灵圣经',
    'CSBS': '中文标准译本',
    'CSB': '中文标准译本',
};

const DEFAULT_VERSIONS = [
    { key: 'CRV', name: '恢复本（推荐）', file: 'bible-crv-data.json', url: 'https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/bible-crv-data.json' },
    { key: 'CUVS', name: '简体新标点和合本（主流）', file: 'bible-cuvs-data.json', url: 'https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/bible-cuvs-data.json' }
];

// ==================== 工具函数 ====================
function chineseToNumber(s) {
    const numMap = { '零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'百':100 };
    let result = 0, temp = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        const num = numMap[char];
        if (num === undefined) continue;
        if (num >= 10) {
            if (temp === 0) temp = 1;
            result += temp * num;
            temp = 0;
        } else {
            temp = temp * 10 + num;
        }
    }
    return result + temp;
}
function isChineseNumber(s) { return /^[一二三四五六七八九十百零]+$/.test(s); }
function parseNumber(s) {
    s = s.trim();
    if (/^\d+$/.test(s)) return parseInt(s);
    if (isChineseNumber(s)) return chineseToNumber(s);
    return NaN;
}

// ==================== 更新日志内容 ====================
const CHANGELOG_CONTENT = {
    '2.1.2': `
## [2.1.2] - 2026-08-26

### 修复
- **跨书卷选中计数累加**：修复阅读视图中切换书卷后，选中计数仍然累加的问题。现在切换书卷时会自动过滤掉旧书卷的选中项，重新计算序号。
- **新手引导无法选中版本**：修复首次安装引导窗口中，未安装的圣经版本无法勾选的问题。
- **数据删除后不弹窗引导**：修复删除数据文件后重启 Obsidian，插件仍认为版本已安装的问题。现在每次启动都会真实扫描文件系统，数据不存在时自动弹出版本选择引导。
- **旧版升级无数据不弹窗**：修复从旧版本升级后，本地没有数据文件时不会弹出引导窗口的问题。
- **阅读视图专注模式不全屏**：修复阅读视图进入专注模式后，全局操作区块和本页操作按钮行仍然显示的问题。
- **并列候选框不显示**：修复先选中对照版经文再选中同出处主版本时，主版本并列候选框不出现的问题。
- **主题选中无反应**：修复阅读视图中书卷主题卡片点击后选中状态无法刷新的问题。

### 改进
- **专注按钮文字缩短**：专注模式按钮文字从「退出专注」缩短为「取消」，避免影响布局。
- **对照按钮样式统一**：对照按钮采用与专注按钮一致的样式，保持视觉一致性。
- **主题直接显示**：去掉「书卷主题」标题栏，主题内容直接显示在阅读区域开头，节省空间。
- **章节标题分行**：阅读视图中章节标题与操作按钮分行排列，避免布局拥挤。
- **全局/本页操作区分**：阅读视图新增全局操作区（作用于整卷书）与本页操作区（作用于当前章），逻辑清晰分离。
- **快速跳转栏响应式**：快速跳转栏在窗口窄时保持单行显示，选择框自动缩小。
`,
    '2.1.1': `
## [2.1.1] - 2026-08-22

### 修复
- **新手引导无法选中版本**：修复首次安装引导窗口中，未安装的圣经版本无法勾选的问题。
- **数据删除后不弹窗引导**：修复删除数据文件后重启 Obsidian，插件仍认为版本已安装的问题。现在每次启动都会真实扫描文件系统，数据不存在时自动弹出版本选择引导。
- **旧版升级无数据不弹窗**：修复从旧版本升级后，本地没有数据文件时不会弹出引导窗口的问题。
- **阅读视图专注模式不全屏**：修复阅读视图进入专注模式后，全局操作区块和本页操作按钮行仍然显示的问题。
- **并列候选框不显示**：修复先选中对照版经文再选中同出处主版本时，主版本并列候选框不出现的问题。
- **主题选中无反应**：修复阅读视图中书卷主题卡片点击后选中状态无法刷新的问题。

### 改进
- **专注按钮文字缩短**：专注模式按钮文字从「退出专注」缩短为「取消」，避免影响布局。
- **对照按钮样式统一**：对照按钮采用与专注按钮一致的样式，保持视觉一致性。
- **主题直接显示**：去掉「书卷主题」标题栏，主题内容直接显示在阅读区域开头，节省空间。
- **章节标题分行**：阅读视图中章节标题与操作按钮分行排列，避免布局拥挤。
- **全局/本页操作区分**：阅读视图新增全局操作区（作用于整卷书）与本页操作区（作用于当前章），逻辑清晰分离。
`,
    '2.1.0': `
## [2.1.0] - 2026-08-20

### 新增
- **多版本圣经支持**：支持同时加载多个圣经版本，可在设置中管理已安装的版本。
- **多版本对照模式**：检索和阅读视图均支持多版本对照，默认关闭，开启后在首选经文下方按顺序显示其他版本。
- **版本管理设置**：全新的版本管理界面，支持启用/禁用版本、设置主版本、删除版本、下载新版本。
- **首次运行版本选择**：首次安装后引导用户选择圣经版本（可多选），自动检测本地已安装版本，支持下载恢复本和新标点和合本。
- **自定义版本识别**：自动识别插件目录下 bible-{缩写}-data.json 格式的自定义版本，支持常见中文圣经版本缩写对照表。

### 改进
- **移除外置数据模式**：2.1.0 起仅支持内置数据模式，简化架构和设置。
- **对照版本独立操作**：对照版本的经文拥有独立的候选框，可独立选中用于复制和投影。
- **投影支持多版本**：逐节、并列、混合投影均支持同时显示多个版本，对照版本自动弱化显示。

### 兼容
- **旧版本数据迁移**：自动检测旧版 bible-data.json 并迁移为恢复本（CRV）版本。
`,
    '2.0.2': `
## [2.0.2] - 2026-08-09

### 改进
- **检索经文时，点击经文出处，可跳转至内容所在的章节**：搜索结果中点击经文出处或纲目时，无论内置/外置数据模式，均统一跳转到插件「圣经阅读」界面并高亮定位，不再依赖外置 Markdown 文件。

### 修复
- **自动更新安装失败**：修复因依赖不可靠的 manifest.dir 导致插件目录定位失败的问题，改为通过 vault basePath 计算绝对路径。
`,
    '2.0.1': `
## [2.0.1] - 2026-08-06

### 修复
- **内置数据路径去重**：修复桌面端设置页面显示两处相同内置数据的问题（相对路径与绝对路径指向同一文件）。
- **README 默认版本描述**：修正默认圣经版本为「原注版圣经」（非和合本）。
- **纯关键词搜索排序**：修复单个关键词搜索时结果未按圣经书卷顺序展示的问题。
`,
    '2.0.0': `
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
- **内置数据读取**：修复 manifest.dir 不可靠导致的检测失败问题，增加多路径 fallback。
- **搜索结果显示异常**：修复 highlightKeywords 中未定义变量导致的渲染中断。
- **下载报错**：修复 Platform is not defined 错误，确保下载功能正常工作。
`
};

// ==================== 首次运行引导模态框（版本选择）====================
class FirstRunModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }
    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.style.padding = '24px';
        contentEl.style.maxWidth = '640px';

        await this.plugin.syncScannedVersions();

        const header = contentEl.createDiv({ cls: 'bible-first-run-header' });
        header.style.textAlign = 'center';
        header.style.marginBottom = '20px';
        header.createEl('h2', { text: '📖 欢迎使用圣经检索与阅读插件' });
        header.createEl('p', { text: '请选择要使用的圣经版本（可多选），拖动调整顺序，最上方的版本将作为主版本', cls: 'setting-item-description' });

        const versionList = contentEl.createDiv({ cls: 'bible-version-list' });
        versionList.style.display = 'flex';
        versionList.style.flexDirection = 'column';
        versionList.style.gap = '10px';
        versionList.style.marginBottom = '20px';

        this.renderVersionList(versionList);

        const btnWrap = contentEl.createDiv();
        btnWrap.style.textAlign = 'center';
        const confirmBtn = btnWrap.createEl('button', { cls: 'mod-cta', text: '确认选择' });
        confirmBtn.style.marginRight = '8px';
        const cancelBtn = btnWrap.createEl('button', { text: '稍后再说' });

        cancelBtn.addEventListener('click', () => this.close());
        confirmBtn.addEventListener('click', async () => this.onConfirm());
    }

    renderVersionList(container) {
        container.empty();
        for (let i = 0; i < this.plugin.settings.versions.length; i++) {
            const ver = this.plugin.settings.versions[i];
            const row = container.createDiv({ cls: 'bible-version-row' });
            row.setAttribute('draggable', 'true');
            row.dataset.index = String(i);
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '10px';
            row.style.padding = '10px';
            row.style.border = '2px solid var(--background-modifier-border)';
            row.style.borderRadius = '8px';
            row.style.cursor = 'pointer';
            row.style.transition = 'all 0.2s';

            const dragHandle = row.createEl('span', { text: '≡', attr: { style: 'color:var(--text-muted);cursor:grab;font-size:16px;' } });

            const checkbox = row.createEl('input', { type: 'checkbox', attr: { 'data-key': ver.key } });
            checkbox.style.width = '18px';
            checkbox.style.height = '18px';
            checkbox.style.cursor = 'pointer';
            checkbox.checked = ver.enabled;
            // 未安装的版本也可以勾选，确认时会自动下载
            // if (!ver.installed) checkbox.disabled = true;

            const info = row.createDiv();
            info.style.flex = '1';
            info.createEl('div', { text: ver.name, cls: 'setting-item-name' });
            const desc = info.createEl('div', { cls: 'setting-item-description' });
            if (ver.installed) {
                const label = ver.isPrimary ? '✅ 已安装（主版本）' : ver.enabled ? '✅ 已安装（对照）' : '✅ 已安装';
                desc.setText(label);
                desc.style.color = ver.isPrimary ? 'var(--interactive-success)' : ver.enabled ? 'var(--text-accent)' : 'var(--text-muted)';
            } else {
                desc.setText('⬇️ 需要下载');
                desc.style.color = 'var(--text-accent)';
            }

            checkbox.addEventListener('change', () => {
                ver.enabled = checkbox.checked;
                const firstEnabled = this.plugin.settings.versions.find(v => v.enabled);
                for (const v of this.plugin.settings.versions) v.isPrimary = false;
                if (firstEnabled) firstEnabled.isPrimary = true;
                this.renderVersionList(container);
            });

            row.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', String(i));
                row.style.opacity = '0.5';
            });
            row.addEventListener('dragend', () => {
                row.style.opacity = '1';
            });
            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(container, e.clientY);
                const draggable = container.querySelector('[style*="opacity: 0.5"]');
                if (draggable) {
                    if (afterElement == null) container.appendChild(draggable);
                    else container.insertBefore(draggable, afterElement);
                }
            });
        }
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const newOrder = [];
            const rows = container.querySelectorAll('.bible-version-row');
            for (const row of rows) {
                const idx = parseInt(row.dataset.index);
                newOrder.push(this.plugin.settings.versions[idx]);
            }
            const firstEnabled = newOrder.find(v => v.enabled);
            for (const v of newOrder) v.isPrimary = false;
            if (firstEnabled) firstEnabled.isPrimary = true;
            this.plugin.settings.versions = newOrder;
            this.renderVersionList(container);
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.bible-version-row:not([style*="opacity: 0.5"])')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    async onConfirm() {
        const selected = this.plugin.settings.versions.filter(v => v.enabled);
        if (selected.length === 0) {
            new Notice('请至少选择一个圣经版本');
            return;
        }

        for (const ver of selected) {
            if (!ver.installed) {
                const defaultVer = DEFAULT_VERSIONS.find(dv => dv.key === ver.key);
                if (defaultVer) {
                    const notice = new Notice(`正在下载 ${ver.name}...`, 0);
                    try {
                        await this.plugin.downloadVersionData(defaultVer);
                        ver.installed = true;
                        ver.file = defaultVer.file;
                        notice.hide();
                    } catch (e) {
                        notice.hide();
                        new Notice(`${ver.name} 下载失败: ${e.message}`);
                        ver.enabled = false;
                    }
                }
            }
        }

        const firstEnabled = this.plugin.settings.versions.find(v => v.enabled && v.installed);
        for (const v of this.plugin.settings.versions) v.isPrimary = false;
        if (firstEnabled) firstEnabled.isPrimary = true;

        this.plugin.settings.hasSetup = true;
        await this.plugin.saveSettings();
        await this.plugin.loadBibleData();
        this.plugin.activateSearchView();
        this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ==================== 更新日志模态框 ====================
class UpdateModal extends Modal {
    constructor(app, version, content) {
        super(app);
        this.version = version;
        this.content = content || CHANGELOG_CONTENT[this.version] || '';
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.style.padding = '24px';
        contentEl.style.maxWidth = '600px';

        contentEl.createEl('h2', { text: '🎉 Bible Search and Reader 已更新至 v' + this.version });
        const body = contentEl.createDiv();
        body.style.marginTop = '16px';
        body.style.lineHeight = '1.8';
        body.style.fontSize = '14px';

        const lines = this.content.trim().split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === '---') continue;
            if (trimmed.startsWith('## ')) {
                body.createEl('h3', { text: trimmed.replace('## ', '') });
            } else if (trimmed.startsWith('### ')) {
                const h4 = body.createEl('h4', { text: trimmed.replace('### ', '') });
                h4.style.color = 'var(--bible-accent)';
                h4.style.marginTop = '12px';
            } else if (trimmed.startsWith('- ')) {
                const div = body.createDiv({ attr: { style: 'margin-left:12px;margin-bottom:4px;' } });
                div.createEl('span', { text: '• ', attr: { style: 'margin-right:4px;' } });
                this.renderInlineMarkdown(div, trimmed.slice(2));
            } else if (trimmed) {
                const div = body.createDiv();
                this.renderInlineMarkdown(div, trimmed);
            }
        }

        const btnWrap = contentEl.createDiv();
        btnWrap.style.textAlign = 'center';
        btnWrap.style.marginTop = '20px';
        const okBtn = btnWrap.createEl('button', { cls: 'mod-cta', text: '知道了' });
        okBtn.addEventListener('click', () => this.close());
    }

    renderInlineMarkdown(container, text) {
        const regex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            const strong = container.createEl('strong', { text: match[1] });
            strong.style.fontWeight = '600';
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
            container.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
    }
    onClose() {
        this.contentEl.empty();
    }
}

// ==================== 设置标签页 ====================
class BibleSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: '圣经检索与阅读设置' });

        // ===== 板块 A：圣经版本管理 =====
        containerEl.createEl('h3', { text: '圣经版本管理', cls: 'setting-item-name' });
        containerEl.createEl('div', { cls: 'setting-item-description', text: '管理已安装的圣经版本。点击刷新按钮重新识别插件目录下的圣经数据文件。自定义版本请按 bible-{缩写}-data.json 命名并放置到插件目录下。' });

        const refreshBtn = containerEl.createEl('button', { cls: 'bible-small-btn', text: '🔄 刷新识别' });
        refreshBtn.style.marginBottom = '12px';
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.setAttribute('disabled', 'true');
            refreshBtn.setText('刷新中...');
            await this.plugin.syncScannedVersions();
            this.display();
            new Notice('版本识别已刷新');
        });

        const versionList = containerEl.createDiv({ cls: 'bible-version-list' });
        versionList.style.marginBottom = '16px';

        const allVersions = this.plugin.settings.versions;
        const defaultKeys = DEFAULT_VERSIONS.map(dv => dv.key);

        for (const ver of allVersions) {
            const isDefault = defaultKeys.includes(ver.key);
            const row = versionList.createDiv({ cls: 'bible-version-setting-row' });
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '12px';
            row.style.padding = '8px 0';
            row.style.borderBottom = '1px solid var(--background-modifier-border)';

            const info = row.createDiv();
            info.style.flex = '1';
            info.createEl('div', { text: ver.name + ' (' + ver.key + ')', cls: 'setting-item-name' });
            const status = info.createEl('div', { cls: 'setting-item-description' });
            if (ver.installed) {
                status.setText('✅ 已安装');
                status.style.color = 'var(--interactive-success)';
            } else {
                status.setText('⬇️ 未安装');
                status.style.color = 'var(--text-accent)';
            }

            if (!ver.installed && isDefault) {
                const dlBtn = row.createEl('button', { text: '⬇️ 下载', cls: 'bible-small-btn' });
                dlBtn.addEventListener('click', async () => {
                    dlBtn.setAttribute('disabled', 'true');
                    dlBtn.setText('下载中...');
                    try {
                        const defaultVer = DEFAULT_VERSIONS.find(dv => dv.key === ver.key);
                        if (defaultVer) {
                            await this.plugin.downloadVersionData(defaultVer);
                            ver.installed = true;
                            ver.file = defaultVer.file;
                            await this.plugin.saveSettings();
                            await this.plugin.loadBibleData();
                            new Notice(`${ver.name} 下载完成`);
                            this.display();
                        }
                    } catch (e) {
                        new Notice('下载失败：' + e.message);
                        dlBtn.removeAttribute('disabled');
                        dlBtn.setText('⬇️ 下载');
                    }
                });
            } else if (ver.installed) {
                const delBtn = row.createEl('button', { text: '🗑️ 删除', cls: 'bible-small-btn' });
                delBtn.title = '删除此版本数据';
                delBtn.addEventListener('click', async () => {
                    if (confirm(`确定要删除 ${ver.name} 吗？此操作不可恢复。`)) {
                        try {
                            await this.plugin.deleteVersionData(ver);
                        } catch (e) {}
                        ver.installed = false;
                        ver.enabled = false;
                        const firstEnabled = this.plugin.settings.versions.find(v => v.enabled && v.installed);
                        for (const v of this.plugin.settings.versions) v.isPrimary = false;
                        if (firstEnabled) firstEnabled.isPrimary = true;
                        await this.plugin.saveSettings();
                        await this.plugin.loadBibleData();
                        this.display();
                    }
                });
            }
        }

        // ===== 板块 B：插件更新 =====
        containerEl.createEl('h3', { text: '插件更新', cls: 'setting-item-name', attr: { style: 'margin-top:24px;' } });
        new Setting(containerEl)
            .setName('自动检测更新')
            .setDesc('启动时自动检测是否有新版本')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoCheckUpdate)
                .onChange(async (value) => {
                    this.plugin.settings.autoCheckUpdate = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('立即检查更新')
            .setDesc('手动检查是否有新版本')
            .addButton(button => button
                .setButtonText('🔍 检查更新')
                .onClick(async () => {
                    button.setDisabled(true);
                    button.setButtonText('检查中...');
                    await this.plugin.checkForUpdate(true);
                    button.setDisabled(false);
                    button.setButtonText('🔍 检查更新');
                }));

    
    }
}

// ==================== 圣经解析器（多版本）====================
class BibleParser {
    constructor(app, settings, pluginDir) {
        this.app = app;
        this.settings = settings;
        this.pluginDir = pluginDir;
    }

    async parseAllBooks() {
        let items = [];
        const enabledVersions = this.settings.versions.filter(v => v.enabled && v.installed);
        for (const ver of enabledVersions) {
            const verItems = await this.parseVersion(ver);
            items.push(...verItems);
        }
        return items;
    }

    async parseVersion(versionConfig) {
        const items = [];
        const { file, key } = versionConfig;
        try {
            const pluginId = 'bible-search-reader';
            const adapterPath = `.obsidian/plugins/${pluginId}/${file}`;

            if (await this.app.vault.adapter.exists(adapterPath)) {
                const raw = await this.app.vault.adapter.read(adapterPath);
                const data = JSON.parse(raw);
                if (Array.isArray(data)) {
                    for (const item of data) {
                        item.versionKey = key;
                        items.push(item);
                    }
                    
                    return items;
                }
            }

            if (Platform.isDesktop) {
                const fs = window.require('fs');
                const path = window.require('path');
                const possiblePaths = [];
                if (this.pluginDir) {
                    possiblePaths.push(path.join(this.pluginDir, file));
                }
                try {
                    const basePath = this.app.vault.adapter.getBasePath();
                    possiblePaths.push(path.join(basePath, '.obsidian', 'plugins', pluginId, file));
                } catch (e) {}

                for (const dataPath of possiblePaths) {
                    if (fs.existsSync(dataPath)) {
                        const raw = fs.readFileSync(dataPath, 'utf-8');
                        const data = JSON.parse(raw);
                        if (Array.isArray(data)) {
                            for (const item of data) {
                                item.versionKey = key;
                                items.push(item);
                            }
                            
                            return items;
                        }
                    }
                }
            }
            console.warn(`[Bible] 未找到版本 ${key} 数据文件: ${file}`);
        } catch (e) {
            console.error(`[Bible] 读取版本 ${key} 数据失败:`, e);
        }
        return items;
    }
}

// ==================== 检索引擎 ====================
class BibleSearchEngine {
    constructor() { this.items = []; }
    setItems(items) { this.items = items; }

    search(query, types, range, bookIds, primaryKey) {
        if (!query.trim()) return [];
        const parsed = this.parseQuery(query);
        const refs = parsed.refs;
        const keywords = parsed.keywords;
        const keywordMode = parsed.keywordMode || 'and';

        const results = [];
        const seen = new Set();

        for (const item of this.items) {
            if (item.versionKey !== primaryKey) continue;
            if (!types.includes(item.type)) continue;
            if (range === 'old' && item.testament !== 'old') continue;
            if (range === 'new' && item.testament !== 'new') continue;
            if (range === 'single' && bookIds && bookIds.length > 0 && !bookIds.includes(item.bookId)) continue;
            if (range === 'multi' && bookIds && bookIds.length > 0 && !bookIds.includes(item.bookId)) continue;

            let matched = false;
            let refIndex = -1;

            if (refs.length > 0) {
                for (let i = 0; i < refs.length; i++) {
                    if (this.matchVerseRef(item, refs[i])) {
                        matched = true;
                        refIndex = i;
                        break;
                    }
                }
            }
            if (keywords.length > 0) {
                const contentLower = item.content.toLowerCase();
                if (keywordMode === 'or' || keywordMode === 'or_ordered') {
                    matched = matched || keywords.some(k => contentLower.includes(k.toLowerCase()));
                } else if (keywordMode === 'and_ordered') {
                    let lastIndex = -1;
                    let allFound = true;
                    for (const kw of keywords) {
                        const idx = contentLower.indexOf(kw.toLowerCase(), lastIndex + 1);
                        if (idx === -1) { allFound = false; break; }
                        lastIndex = idx;
                    }
                    if (allFound) matched = true;
                } else {
                    const allMatch = keywords.every(k => contentLower.includes(k.toLowerCase()));
                    if (allMatch) matched = true;
                }
            }

            if (matched) {
                const key = item.bookId + '-' + item.chapter + '-' + item.verse + '-' + item.type + '-' + item.content;
                if (!seen.has(key)) {
                    seen.add(key);
                    results.push({ item: item, selected: false, order: 0, sideBySide: false, _refIndex: refIndex });
                }
            }
        }

        if (refs.length > 0) {
            results.sort((a, b) => {
                const aIdx = a._refIndex;
                const bIdx = b._refIndex;
                if (aIdx !== -1 && bIdx !== -1 && aIdx !== bIdx) return aIdx - bIdx;
                return a.item.lineIndex - b.item.lineIndex;
            });
        }

        if (keywordMode === 'or_ordered' && keywords.length > 0 && refs.length === 0) {
            results.sort((a, b) => {
                const aContent = a.item.content.toLowerCase();
                const bContent = b.item.content.toLowerCase();
                for (const kw of keywords) {
                    const aIdx = aContent.indexOf(kw.toLowerCase());
                    const bIdx = bContent.indexOf(kw.toLowerCase());
                    if (aIdx !== -1 && bIdx === -1) return -1;
                    if (aIdx === -1 && bIdx !== -1) return 1;
                    if (aIdx !== -1 && bIdx !== -1 && aIdx !== bIdx) return aIdx - bIdx;
                }
                return 0;
            });
        }

        if (refs.length === 0 && keywords.length > 0 && keywordMode !== 'or_ordered') {
            results.sort((a, b) => {
                const ia = a.item, ib = b.item;
                if (ia.bookId !== ib.bookId) return ia.bookId - ib.bookId;
                if (ia.chapter !== ib.chapter) return ia.chapter - ib.chapter;
                if (ia.verse !== ib.verse) return ia.verse - ib.verse;
                return ia.lineIndex - ib.lineIndex;
            });
        }

        for (const r of results) { delete r._refIndex; }

        return results;
    }

    parseQuery(query) {
        const refs = [];
        const keywords = [];
        const normalizedQuery = query.replace(/[～~]/g, '-').replace(/[：:]/g, ':');
        let keywordMode = 'and';
        if (/[,，]/.test(query) && !/[；;。.]/.test(query)) {
            keywordMode = 'and_ordered';
        } else if (/[；;]/.test(query) && !/[。.]/.test(query)) {
            keywordMode = 'or_ordered';
        } else if (/[。.]/.test(query)) {
            keywordMode = 'or';
        }

        const tokens = normalizedQuery.split(/[,，、；;\s。\.]+/).map(t => t.trim()).filter(t => t.length > 0);
        let currentBookId = null;
        let currentChapter = 1;

        for (const token of tokens) {
            let matched = false;
            for (const sn of BOOK_SHORT_NAMES) {
                if (token.startsWith(sn)) {
                    const parsed = this.parseVerseReference(token);
                    if (parsed.length > 0) {
                        refs.push(...parsed);
                        currentBookId = parsed[0].bookId;
                        currentChapter = parsed[0].startChapter;
                        matched = true;
                        break;
                    }
                }
            }
            if (matched) continue;

            if (currentBookId !== null) {
                const contParsed = this.parseContinuationReference(token, currentBookId, currentChapter);
                if (contParsed.length > 0) {
                    refs.push(...contParsed);
                    currentChapter = contParsed[0].startChapter;
                    matched = true;
                }
            }
            if (matched) continue;
            keywords.push(token);
        }

        return { refs: refs, keywords: keywords, keywordMode: keywordMode };
    }

    parseVerseReference(part) {
        const ranges = [];
        let bookShortName = '';
        let remaining = '';
        for (const sn of BOOK_SHORT_NAMES) {
            if (part.startsWith(sn)) { bookShortName = sn; remaining = part.slice(sn.length); break; }
        }
        if (!bookShortName) return ranges;
        const book = BOOK_MAP[bookShortName];
        if (!book) return ranges;

        const rangeParts = remaining.split(/[~\-]/);
        if (rangeParts.length === 2) {
            const start = this.parseChapterVerse(rangeParts[0]);
            const end = this.parseChapterVerse(rangeParts[1]);
            if (start && end) {
                ranges.push({ bookId: book.id, startChapter: start.chapter, startVerse: start.verse, endChapter: end.chapter, endVerse: end.verse });
            } else if (start) {
                const endVerse = parseNumber(rangeParts[1]);
                if (!isNaN(endVerse)) {
                    ranges.push({ bookId: book.id, startChapter: start.chapter, startVerse: start.verse, endChapter: start.chapter, endVerse: endVerse });
                }
            }
        } else if (rangeParts.length === 1) {
            const cv = this.parseChapterVerse(rangeParts[0]);
            if (cv) {
                ranges.push({ bookId: book.id, startChapter: cv.chapter, startVerse: cv.verse, endChapter: cv.chapter, endVerse: cv.verse });
            }
        }
        return ranges;
    }

    parseChapterVerse(s) {
        s = s.trim();
        let match = s.match(/^(\d+):(\d+)$/);
        if (match) {
            const ch = parseInt(match[1]);
            const vs = parseInt(match[2]);
            if (ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        match = s.match(/^([一二三四五六七八九十百零]+):(\d+)$/);
        if (match) {
            const ch = chineseToNumber(match[1]);
            const vs = parseInt(match[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        match = s.match(/^([一二三四五六七八九十百零]+)(\d+)$/);
        if (match) {
            const ch = chineseToNumber(match[1]);
            const vs = parseInt(match[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        match = s.match(/^(\d+)([一二三四五六七八九十百零]+)$/);
        if (match) {
            const ch = parseInt(match[1]);
            const vs = chineseToNumber(match[2]);
            if (ch > 0 && !isNaN(vs) && vs > 0) return { chapter: ch, verse: vs };
        }
        return null;
    }

    parseContinuationReference(token, bookId, currentChapter) {
        const ranges = [];
        let m = token.match(/^([一二三四五六七八九十百零\d]+):(\d+)-(\d+)$/);
        if (m) {
            const ch = parseNumber(m[1]);
            const vs = parseInt(m[2]);
            const endVs = parseInt(m[3]);
            if (!isNaN(ch) && ch > 0 && vs > 0 && endVs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: endVs });
                return ranges;
            }
        }
        m = token.match(/^([一二三四五六七八九十百零\d]+):(\d+)$/);
        if (m) {
            const ch = parseNumber(m[1]);
            const vs = parseInt(m[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: vs });
                return ranges;
            }
        }
        m = token.match(/^([一二三四五六七八九十百零]+)(\d+)-(\d+)$/);
        if (m) {
            const ch = chineseToNumber(m[1]);
            const vs = parseInt(m[2]);
            const endVs = parseInt(m[3]);
            if (!isNaN(ch) && ch > 0 && vs > 0 && endVs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: endVs });
                return ranges;
            }
        }
        m = token.match(/^([一二三四五六七八九十百零]+)(\d+)$/);
        if (m) {
            const ch = chineseToNumber(m[1]);
            const vs = parseInt(m[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: vs });
                return ranges;
            }
        }
        m = token.match(/^(\d+)$/);
        if (m) {
            const vs = parseInt(m[1]);
            if (vs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: vs });
                return ranges;
            }
        }
        m = token.match(/^([一二三四五六七八九十百零]+)$/);
        if (m) {
            const vs = chineseToNumber(m[1]);
            if (!isNaN(vs) && vs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: vs });
                return ranges;
            }
        }
        m = token.match(/^(\d+)-(\d+)$/);
        if (m) {
            const vs = parseInt(m[1]);
            const endVs = parseInt(m[2]);
            if (vs > 0 && endVs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: endVs });
                return ranges;
            }
        }
        m = token.match(/^([一二三四五六七八九十百零]+)-([一二三四五六七八九十百零]+)$/);
        if (m) {
            const vs = chineseToNumber(m[1]);
            const endVs = chineseToNumber(m[2]);
            if (!isNaN(vs) && !isNaN(endVs) && vs > 0 && endVs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: endVs });
                return ranges;
            }
        }
        return ranges;
    }

    matchVerseRef(item, ref) {
        if (item.type !== 'verse') return false;
        if (item.bookId !== ref.bookId) return false;
        if (item.chapter < ref.startChapter || item.chapter > ref.endChapter) return false;
        if (item.chapter === ref.startChapter && item.verse < ref.startVerse) return false;
        if (item.chapter === ref.endChapter && item.verse > ref.endVerse) return false;
        return true;
    }
}

// ==================== 投影覆盖层（支持多版本）====================
class BibleProjectionOverlay {
    constructor(app, results, mode, showSource) {
        this.app = app;
        // 所有模式都接收完整的选中数据；分组逻辑在 buildSlides 中处理
        this.results = results.filter(r => r.selected).sort((a, b) => a.order - b.order);
        this.mode = mode;
        this.showSource = showSource !== false;
        this.currentSlide = 0;
        this.slides = [];
        this.fontSize = 48;
        this.isDark = true;
        this.isCentered = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.buildSlides();
    }

    buildSlides() {
        const selected = this.results;
        if (this.mode === 'focus') {
            // 逐节模式：每个选中项单独一页（sideBySide 只在混合模式生效）
            for (const r of selected) {
                this.slides.push({ items: [r] });
            }
        } else if (this.mode === 'parallel') {
            // 并列模式：所有选中项在一页
            this.slides.push({ items: [...selected] });
        } else if (this.mode === 'mixed') {
            // 混合模式：按选中顺序逐页展示，勾了并列的项与前一页合并
            selected.forEach((r, i) => {
            });
            
            // 按选中顺序构建slides
            let currentSlide = null;
            for (const r of selected) {
                if (r.sideBySide && currentSlide !== null) {
                    // 勾了并列：添加到当前slide（与前一页合并）
                    currentSlide.items.push(r);
                } else {
                    // 普通项：创建新slide
                    currentSlide = { items: [r] };
                    this.slides.push(currentSlide);
                }
            }
        }
    }

    open() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'bible-projection-fullscreen';
        this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;display:flex;flex-direction:column;background:#1a1a2e;color:#fff;';

        const topBar = document.createElement('div');
        topBar.className = 'bible-proj-topbar';
        topBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 16px;background:rgba(0,0,0,0.2);border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;';
        const topLeft = topBar.createDiv();
        topLeft.createEl('span', { cls: 'bible-proj-mode-name', text: this.getModeName() });
        const topCenter = topBar.createDiv();
        topCenter.style.cssText = 'font-size:11px;opacity:0.5;text-align:center;flex:1;';
        topCenter.setText('← → 翻页  ·  +/- 字体  ·  T 主题  ·  ESC 关闭');
        const topRight = topBar.createDiv();
        topRight.createEl('span', { cls: 'bible-proj-page-num', text: (this.currentSlide + 1) + '/' + this.slides.length + '页' });
        this.overlay.appendChild(topBar);

        this.contentArea = document.createElement('div');
        this.contentArea.className = 'bible-proj-content';
        this.contentArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;position:relative;';
        this.overlay.appendChild(this.contentArea);

        const bottomBar = document.createElement('div');
        bottomBar.className = 'bible-proj-bottombar';
        bottomBar.style.cssText = 'flex-shrink:0;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.1);';

        const bottomRow = bottomBar.createDiv({ cls: 'bible-proj-bottom-row' });
        bottomRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 16px;gap:8px;';
        const prevBtn = bottomRow.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-prev', text: '◀' });

        const toolCenter = bottomRow.createDiv({ cls: 'bible-proj-tool-center' });
        toolCenter.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:6px;flex:1;';
        toolCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '-', attr: { 'data-action': 'font-smaller', title: '缩小字体' } });
        toolCenter.createEl('span', { cls: 'bible-proj-font-size', text: this.fontSize + 'px' });
        toolCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '+', attr: { 'data-action': 'font-larger', title: '放大字体' } });
        toolCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '⟲', attr: { 'data-action': 'font-reset', title: '重置字体' } });
        if (this.mode !== 'focus') {
            toolCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '⬜', attr: { 'data-action': 'toggle-centered', title: '切换居中' } });
        }
        toolCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '🌙', attr: { 'data-action': 'toggle-theme', title: '切换主题' } });
        toolCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '✕', attr: { 'data-action': 'close', title: '关闭投影' } });

        const nextBtn = bottomRow.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-next', text: '▶' });
        this.overlay.appendChild(bottomBar);

        document.body.appendChild(this.overlay);
        this.bindEvents(toolCenter, bottomRow);
        this.renderSlide();
    }

    bindEvents(toolCenter, bottomRow) {
        toolCenter.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'close') this.close();
            else if (action === 'font-larger') { this.fontSize += 4; this.updateFontSize(); }
            else if (action === 'font-smaller') { this.fontSize = Math.max(16, this.fontSize - 4); this.updateFontSize(); }
            else if (action === 'font-reset') { this.fontSize = 48; this.updateFontSize(); }
            else if (action === 'toggle-centered') { this.toggleCentered(); }
            else if (action === 'toggle-theme') { this.toggleTheme(); }
        });

        bottomRow.querySelector('.bible-proj-prev').addEventListener('click', () => this.prevSlide());
        bottomRow.querySelector('.bible-proj-next').addEventListener('click', () => this.nextSlide());

        this.keyHandler = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') this.nextSlide();
            else if (e.key === 'ArrowLeft') this.prevSlide();
            else if (e.key === 'Escape') this.close();
            else if (e.key === '+' || e.key === '=') { this.fontSize += 4; this.updateFontSize(); }
            else if (e.key === '-') { this.fontSize = Math.max(16, this.fontSize - 4); this.updateFontSize(); }
            else if (e.key === 't' || e.key === 'T') this.toggleTheme();
        };
        document.addEventListener('keydown', this.keyHandler);

        this.contentArea.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.contentArea.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            const dy = e.changedTouches[0].clientY - this.touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                if (dx < 0) this.nextSlide();
                else this.prevSlide();
            }
        }, { passive: true });

        this.contentArea.addEventListener('wheel', (e) => {
            const wrapper = this.contentArea.querySelector('.bible-proj-slide-wrapper');
            if (wrapper) {
                const canScroll = wrapper.scrollHeight > wrapper.clientHeight;
                if (canScroll) {
                    const atBottom = wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - 2;
                    const atTop = wrapper.scrollTop <= 0;
                    if (e.deltaY > 0 && !atBottom) return;
                    if (e.deltaY < 0 && !atTop) return;
                }
            }
            e.preventDefault();
            if (e.deltaY > 0) this.nextSlide();
            else this.prevSlide();
        }, { passive: false });
    }

    renderSlide() {
        while (this.contentArea.firstChild) this.contentArea.removeChild(this.contentArea.firstChild);
        if (this.slides.length === 0) {
            const emptyDiv = this.contentArea.createEl('div', { text: '没有选中的内容' });
            emptyDiv.style.textAlign = 'center';
            emptyDiv.style.fontSize = '24px';
            return;
        }

        const slide = this.slides[this.currentSlide];
        const pageNumEl = this.overlay.querySelector('.bible-proj-page-num');
        if (pageNumEl) pageNumEl.textContent = (this.currentSlide + 1) + '/' + this.slides.length + '页';

        const wrapper = document.createElement('div');
        wrapper.className = 'bible-proj-slide-wrapper';
        wrapper.style.cssText = 'max-width:' + this.getWrapperMaxWidth() + 'px;width:90%;text-align:center;padding:20px;margin:auto;overflow-y:auto;max-height:100%;';

        if (this.mode === 'focus') {
            for (const r of slide.items) {
                const item = { ...r.item, ...r };
                const isCompare = item._isCompare;

                if (isCompare) {
                    const refDiv = wrapper.createEl('div', { cls: 'bible-proj-ref bible-proj-compare-ref', text: this.getItemRef(item) });
                    refDiv.style.marginBottom = '8px';
                    refDiv.style.fontSize = (this.fontSize * 0.5) + 'px';
                    refDiv.style.color = this.isDark ? '#888' : '#999';

                    const textDiv = wrapper.createEl('div', { cls: 'bible-proj-text bible-proj-compare-text', text: this.getItemContent(item) });
                    textDiv.style.lineHeight = '1.6';
                    textDiv.style.fontSize = (this.fontSize * 0.75) + 'px';
                    textDiv.style.opacity = '0.7';
                    textDiv.style.marginBottom = '16px';
                } else {
                    const shouldShowRef = this.showSource || item.type === 'verse';
                    if (shouldShowRef) {
                        const refDiv = wrapper.createEl('div', { cls: 'bible-proj-ref bible-proj-focus-ref', text: this.getItemRef(item) });
                        refDiv.style.marginBottom = '20px';
                        if (item.type === 'theme') refDiv.classList.add('bible-proj-focus-theme-ref');
                        else if (item.type === 'outline') refDiv.classList.add('bible-proj-focus-outline-ref');
                    }
                    const textDiv = wrapper.createEl('div', { cls: 'bible-proj-text bible-proj-focus-text', text: this.getItemContent(item) });
                    textDiv.style.lineHeight = '1.8';
                    textDiv.style.fontSize = this.fontSize + 'px';
                    if (item.type === 'theme') textDiv.classList.add('bible-proj-focus-theme');
                    else if (item.type === 'outline') textDiv.classList.add('bible-proj-focus-outline');
                }
            }
        } else {
            wrapper.style.textAlign = this.isCentered ? 'center' : 'left';
            
            // 混合模式：普通项单独一页，勾了并列的项与前一页合并
            if (this.mode === 'mixed') {
                // 所有项使用相同样式
                for (const r of slide.items) {
                    const item = { ...r.item, ...r };
                    const itemEl = document.createElement('div');
                    itemEl.style.cssText = 'margin-bottom:15px;padding:20px;background:rgba(255,255,255,0.05);border-radius:8px;';
                    
                    const refDiv = itemEl.createEl('div', { cls: 'bible-proj-ref bible-proj-mixed-ref', text: this.getItemRef(item) });
                    
                    const textDiv = itemEl.createEl('div', { cls: 'bible-proj-text', text: this.getItemContent(item) });
                    textDiv.style.cssText = 'line-height:1.8;font-size:' + this.fontSize + 'px;';
                    
                    itemEl.appendChild(refDiv);
                    itemEl.appendChild(textDiv);
                    wrapper.appendChild(itemEl);
                }
            } else {
                // 其他模式：所有选中项在一页
                for (const r of slide.items) {
                    const item = { ...r.item, ...r };
                    const isCompare = item._isCompare;

                    const itemEl = document.createElement('div');
                    if (item.type === 'verse') itemEl.classList.add('bible-proj-verse-box');
                    else if (item.type === 'theme') itemEl.classList.add('bible-proj-theme-box', 'bible-proj-parallel-theme');
                    else if (item.type === 'outline') itemEl.classList.add('bible-proj-outline-box', 'bible-proj-parallel-outline');

                    if (isCompare) {
                        const pRef = itemEl.createEl('div', { cls: 'bible-proj-ref bible-proj-parallel-ref', text: this.getItemRef(item) });
                        pRef.style.marginBottom = '8px';
                        pRef.style.fontWeight = '600';
                        const pText = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-parallel-text', text: this.getItemContent(item) });
                        pText.style.lineHeight = '1.7';
                        pText.classList.add('bible-proj-compare-text');
                        pText.style.fontSize = (this.fontSize * 0.7) + 'px';
                        pText.style.opacity = '0.7';
                    } else {
                        const shouldShowRef = this.showSource || item.type === 'verse';
                        if (shouldShowRef) {
                            const pRef = itemEl.createEl('div', { cls: 'bible-proj-ref bible-proj-parallel-ref', text: this.getItemRef(item) });
                            pRef.style.marginBottom = '8px';
                            pRef.style.fontWeight = '600';
                        }
                        const pText = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-parallel-text', text: this.getItemContent(item) });
                        pText.style.lineHeight = '1.7';
                        if (item.type === 'theme') pText.classList.add('bible-proj-parallel-theme-text');
                        else if (item.type === 'outline') pText.classList.add('bible-proj-parallel-outline-text');
                    }
                    wrapper.appendChild(itemEl);
                }
            }
        }

        this.contentArea.appendChild(wrapper);
        this.updateFontSize();
    }

    updateFontSize() {
        const fontSizeEl = this.overlay.querySelector('.bible-proj-font-size');
        if (fontSizeEl) fontSizeEl.textContent = this.fontSize + 'px';
        this.overlay.querySelectorAll('.bible-proj-focus-text').forEach(el => { el.style.fontSize = this.fontSize + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; el.style.color = this.isDark ? '#a0a0a0' : '#666'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.55) + 'px'; el.style.color = this.isDark ? '#a0a0a0' : '#666'; });
        this.overlay.querySelectorAll('.bible-proj-focus-theme').forEach(el => { el.style.fontSize = (this.fontSize * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-theme-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline').forEach(el => { el.style.fontSize = (this.fontSize * 0.95) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-theme-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85 * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-compare-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.75) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-compare-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.5) + 'px'; });
        const wrapper = this.overlay.querySelector('.bible-proj-slide-wrapper');
        if (wrapper) wrapper.style.maxWidth = this.getWrapperMaxWidth() + 'px';
    }

    toggleCentered() {
        this.isCentered = !this.isCentered;
        const btn = this.overlay.querySelector('[data-action="toggle-centered"]');
        if (btn) btn.textContent = this.isCentered ? '⬛' : '⬜';
        this.renderSlide();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        const btn = this.overlay.querySelector('[data-action="toggle-theme"]');
        if (btn) btn.textContent = this.isDark ? '🌙' : '☀️';
        if (this.isDark) {
            this.overlay.classList.remove('light-mode');
            this.overlay.style.background = '#1a1a2e';
            this.overlay.style.color = '#fff';
        } else {
            this.overlay.classList.add('light-mode');
            this.overlay.style.background = '#f5f5f5';
            this.overlay.style.color = '#333';
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.renderSlide();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.renderSlide();
        }
    }

    getModeLabel() {
        if (this.mode === 'focus') return '逐节 ' + this.slides.length + ' 节';
        if (this.mode === 'parallel') return '并列 ' + this.results.length + ' 节';
        return '混合 ' + this.slides.length + ' 页';
    }

    getWrapperMaxWidth() {
        return window.innerWidth * 0.9;
    }

    getModeName() {
        if (this.mode === 'focus') return '逐节模式';
        if (this.mode === 'parallel') return '并列模式';
        return '混合模式';
    }

    getItemRef(item) {
        // 检查 item 本身或其内部是否有 _isCompare
        const isCompare = item._isCompare || (item.item && item.item._isCompare);
        if (isCompare) {
            // 投影中对照经文显示英文简写
            const versionKey = item.versionKey || (item.item && item.item.versionKey);
            const bookShortName = item.bookShortName || (item.item && item.item.bookShortName);
            const chapter = item.chapter || (item.item && item.item.chapter);
            const verse = item.verse || (item.item && item.item.verse);
            return `⌈${versionKey.toLowerCase()}⌋${bookShortName}${chapter}:${verse}`;
        }
        if (item.type === 'theme') return item.bookFullName + ' 主题';
        if (item.type === 'outline') return item.bookFullName + ' 纲目';
        return item.bookShortName + item.chapter + ':' + item.verse;
    }

    getItemContent(item) {
        if (item._isCompare) return item.content;
        if (item.type === 'theme') return '主题：' + item.content;
        if (item.type === 'outline') return item.content;
        return item.content;
    }

    close() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        document.removeEventListener('keydown', this.keyHandler);
    }
}

// ==================== 侧边栏圣经视图 ====================
const BIBLE_SEARCH_VIEW_TYPE = 'bible-search-view';

class BibleSearchView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.results = [];
        this.selectCounter = 0;
        this.typeCheckboxes = {};
        this.currentPage = 0;
        this.pageSize = 50;
        this.keywords = [];
        this.activeTab = 'search';
        this.readerState = 'books';
        this.readerBook = null;
        this.readerChapter = 1;
        this.readerFontSize = 15;
        this.readerResults = [];
        this.readerSelectCounter = 0;
        this.selectedBookIds = new Set();
        this.searchFocusMode = false;
        this.readerFocusMode = false;
        this.comparePanelOpen = false;
        // 保存最后搜索条件，用于版本顺序改变后重新搜索
        this.lastSearchQuery = '';
        this.lastSearchTypes = ['theme', 'outline', 'verse'];
        this.lastRangeValue = 'all';
        this.lastBookIds = [];
        // 独立存储对照经文的选中状态，不添加到 results 数组
        this.compareSelections = {};
        this.cmpOrder = [];  // 保持对照版本选中的顺序
    }
    getViewType() { return BIBLE_SEARCH_VIEW_TYPE; }
    getDisplayText() { return '圣经检索'; }
    getIcon() { return 'book-plus'; }

    async onOpen() {
        this.contentEl.style.height = '100%';
        this.container = this.contentEl.createDiv({ cls: 'bible-search-container' });
        this.buildTabs();
        this.buildSearchTab();
        this.buildReaderTab();
        this.switchTab('search');
    }
    async onClose() {}

    buildTabs() {
        const tabBar = this.container.createDiv({ cls: 'bible-tab-bar' });
        this.tabSearch = tabBar.createEl('button', { cls: 'bible-tab active', text: '圣经搜索' });
        this.tabReader = tabBar.createEl('button', { cls: 'bible-tab', text: '圣经阅读' });

        this.tabSearch.addEventListener('click', () => this.switchTab('search'));
        this.tabReader.addEventListener('click', () => this.switchTab('reader'));

        this.compareBtn = tabBar.createEl('button', { cls: 'bible-compare-toggle-btn', text: '对照' });
        this.compareBtn.addEventListener('click', () => this.toggleComparePanel());

        this.focusModeBtn = tabBar.createEl('button', { cls: 'bible-focus-mode-btn', text: '专注' });
        this.focusModeBtn.addEventListener('click', () => this.toggleFocusMode());
    }



    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.bible-compare-modal-row:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    toggleComparePanel() {
        this.comparePanelOpen = !this.comparePanelOpen;
        if (this.comparePanelOpen) {
            this._openCompareModal();
        } else {
            this._closeCompareModal();
        }
        this.compareBtn.classList.toggle('active', this.comparePanelOpen);
    }

    _openCompareModal() {
        // 移除旧的弹窗
        this._closeCompareModal();

        // 创建遮罩层
        this._compareBackdrop = document.createElement('div');
        this._compareBackdrop.className = 'bible-overlay-backdrop active';
        this._compareBackdrop.addEventListener('click', () => this.toggleComparePanel());
        document.body.appendChild(this._compareBackdrop);

        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.className = 'bible-compare-modal';
        modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--background-primary);border:1px solid var(--bible-card-border);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.25);z-index:1001;width:400px;max-width:90vw;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;';

        // 标题栏
        const header = modal.createDiv({ cls: 'bible-compare-modal-header' });
        header.createEl('h3', { text: '对照设置' });
        const closeBtn = header.createEl('button', { cls: 'bible-small-btn', text: '✕' });
        closeBtn.addEventListener('click', () => this.toggleComparePanel());

        // 刷新按钮
        const refreshBtn = modal.createEl('button', { cls: 'bible-small-btn', text: '🔄 刷新版本', style: 'margin:10px 16px 0;width:calc(100% - 32px);' });
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.setAttribute('disabled', 'true');
            await this.plugin.syncScannedVersions();
            this._renderCompareModal();
            refreshBtn.removeAttribute('disabled');
            new Notice('版本识别已刷新');
        });

        // 说明文字
        const desc = modal.createDiv({ cls: 'bible-compare-modal-desc', text: '勾选要使用的版本，可拖动调整顺序。最上方的版本为主版本，其余为对照版本。' });

        // 版本列表容器
        this._compareModalList = modal.createDiv({ cls: 'bible-compare-modal-list' });
        this._renderCompareModal();

        document.body.appendChild(modal);
        this._compareModal = modal;
    }

    _closeCompareModal() {
        if (this._compareModal) {
            this._compareModal.remove();
            this._compareModal = null;
        }
        if (this._compareBackdrop) {
            this._compareBackdrop.remove();
            this._compareBackdrop = null;
        }
    }

    _renderCompareModal() {
        if (!this._compareModalList) return;
        this._compareModalList.empty();
        // 移除旧的 drop 监听器，避免重复添加
        const newContainer = this._compareModalList.cloneNode(false);
        this._compareModalList.parentNode.replaceChild(newContainer, this._compareModalList);
        this._compareModalList = newContainer;
        const versions = this.plugin.settings.versions;

        for (let i = 0; i < versions.length; i++) {
            const ver = versions[i];
            const row = this._compareModalList.createDiv({ cls: 'bible-compare-modal-row' });
            row.setAttribute('draggable', 'true');
            row.dataset.index = String(i);
            row.dataset.key = ver.key;  // 用于 drop 时查找版本

            const dragHandle = row.createEl('span', { cls: 'bible-compare-drag-handle', text: '≡' });

            const checkbox = row.createEl('input', { type: 'checkbox' });
            checkbox.checked = ver.enabled;
            checkbox.addEventListener('change', async () => {
                const oldPrimary = this.plugin.settings.versions.find(v => v.isPrimary)?.key;
                ver.enabled = checkbox.checked;

                // 确保至少有一个版本被选中
                const enabledVersions = this.plugin.settings.versions.filter(v => v.enabled && v.installed);
                if (enabledVersions.length === 0) {
                    ver.enabled = true;
                    checkbox.checked = true;
                    new Notice('至少需要一个圣经版本');
                    return;
                }

                const firstEnabled = this.plugin.settings.versions.find(v => v.enabled && v.installed);
                for (const v of this.plugin.settings.versions) v.isPrimary = false;
                if (firstEnabled) firstEnabled.isPrimary = true;
                await this.plugin.saveSettings();
                await this.plugin.loadBibleData();
                this._renderCompareModal();
                if (this.activeTab === 'reader' && this.readerState === 'content') {
                    this.renderChapterContent();
                }
                if (this.activeTab === 'search' && this.results.length > 0) {
                    const newPrimary = this.plugin.settings.versions.find(v => v.isPrimary)?.key;
                    if (oldPrimary !== newPrimary && this.lastSearchQuery) {
                        if (this.plugin.searchEngine === null || this.plugin.allItems.length === 0) {
                            await this.plugin.loadBibleData();
                        }
                        const primaryKey = this.getPrimaryVersion();
                        if (primaryKey) {
                            this.results = this.plugin.searchEngine.search(this.lastSearchQuery, this.lastSearchTypes, this.lastRangeValue, this.lastBookIds, primaryKey);
                            this.selectCounter = 0;
                            this.compareSelections = {};
                            this.cmpOrder = [];
                            const parsed = this.plugin.searchEngine.parseQuery(this.lastSearchQuery);
                            this.keywords = parsed.keywords;
                        }
                    }
                    this.renderResults();
                }
            });

            const info = row.createDiv({ cls: 'bible-compare-modal-info' });
            info.createEl('span', { text: ver.name, cls: 'bible-compare-modal-name' });
            const status = info.createEl('span', { cls: 'bible-compare-modal-status' });
            if (ver.installed) {
                status.setText(ver.isPrimary ? '主版本' : ver.enabled ? '对照版本' : '已启用');
                status.style.color = ver.isPrimary ? 'var(--interactive-success)' : ver.enabled ? 'var(--text-accent)' : 'var(--text-muted)';
            } else {
                status.setText('未安装');
                status.style.color = 'var(--text-muted)';
                checkbox.disabled = true;
                row.style.opacity = '0.5';
            }
            // 点击版本名也能切换选中状态
            row.addEventListener('click', (e) => {
                if (e.target === checkbox || e.target.classList.contains('bible-compare-drag-handle')) return;
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
            info.style.cursor = 'pointer';

            // 拖拽排序
            row.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', String(i));
                row.classList.add('dragging');
            });
            row.addEventListener('dragend', () => row.classList.remove('dragging'));
            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(this._compareModalList, e.clientY);
                const draggable = this._compareModalList.querySelector('.dragging');
                if (draggable) {
                    if (afterElement == null) {
                        this._compareModalList.appendChild(draggable);
                    } else {
                        this._compareModalList.insertBefore(draggable, afterElement);
                    }
                }
            });
        }

        this._compareModalList.addEventListener('drop', async (e) => {
            e.preventDefault();
            // 记录旧的主版本
            const oldPrimary = this.plugin.settings.versions.find(v => v.isPrimary)?.key;
            
            // 重新从 HTML 顺序读取版本
            const rows = this._compareModalList.querySelectorAll('.bible-compare-modal-row');
            const newOrder = [];
            for (const row of rows) {
                const key = row.dataset.key;
                const ver = this.plugin.settings.versions.find(v => v.key === key);
                if (ver) newOrder.push(ver);
            }
            // 确保所有版本都在（可能有未扫描到的）
            for (const v of this.plugin.settings.versions) {
                if (!newOrder.find(nv => nv.key === v.key)) {
                    newOrder.push(v);
                }
            }
            const firstEnabled = newOrder.find(v => v.enabled && v.installed);
            for (const v of newOrder) v.isPrimary = false;
            if (firstEnabled) firstEnabled.isPrimary = true;
            this.plugin.settings.versions = newOrder;
            await this.plugin.saveSettings();
            
            // 更新对照模态框
            this._renderCompareModal();
            
            // 检查主版本是否改变
            const newPrimary = this.plugin.settings.versions.find(v => v.isPrimary)?.key;
            
            if (this.activeTab === 'reader' && this.readerState === 'content') {
                this.renderChapterContent();
            }
            
            if (this.activeTab === 'search') {
                if (oldPrimary !== newPrimary && this.lastSearchQuery) {
                    // 主版本改变，重新搜索
                    const types = this.lastSearchTypes;
                    const rangeValue = this.lastRangeValue;
                    const bookIds = this.lastBookIds;
                    
                    if (this.plugin.searchEngine === null || this.plugin.allItems.length === 0) {
                        await this.plugin.loadBibleData();
                    }
                    
                    const primaryKey = this.getPrimaryVersion();
                    if (primaryKey) {
                        this.results = this.plugin.searchEngine.search(this.lastSearchQuery, types, rangeValue, bookIds, primaryKey);
                        this.selectCounter = 0;
                        const parsed = this.plugin.searchEngine.parseQuery(this.lastSearchQuery);
                        this.keywords = parsed.keywords;
                    }
                }
                this.renderResults();
            }
        });
    }

    hasCompareMode() {
        const enabled = this.plugin.settings.versions.filter(v => v.enabled && v.installed);
        return enabled.length > 1;
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.tabSearch.classList.toggle('active', tab === 'search');
        this.tabReader.classList.toggle('active', tab === 'reader');
        if (this.searchPanel) this.searchPanel.style.display = tab === 'search' ? 'flex' : 'none';
        if (this.readerPanel) this.readerPanel.style.display = tab === 'reader' ? 'flex' : 'none';
        if (tab === 'reader') this.renderReader();
        this.updateFocusModeBtn();
    }

    getPrimaryVersion() {
        const pv = this.plugin.settings.versions.find(v => v.isPrimary && v.enabled && v.installed);
        return pv ? pv.key : null;
    }
    getReaderPrimaryVersion() {
        return this.getPrimaryVersion();
    }

    getCompareVersions() {
        const primary = this.plugin.settings.versions.find(v => v.isPrimary);
        return this.plugin.settings.versions.filter(v => v.enabled && v.installed && v.key !== (primary?.key));
    }

    findCompareItems(bookId, chapter, verse, type) {
        const compares = [];
        const compareVersions = this.getCompareVersions();
        if (compareVersions.length === 0) return compares;
        for (const ver of compareVersions) {
            const found = this.plugin.allItems.find(i =>
                i.versionKey === ver.key &&
                i.bookId === bookId &&
                i.chapter === chapter &&
                i.verse === verse &&
                i.type === type
            );
            if (found) {
                compares.push({ item: found, versionName: ver.name, versionKey: ver.key });
            }
        }
        return compares;
    }

    buildSearchTab() {
        this.searchPanel = this.container.createDiv({ cls: 'bible-tab-panel' });

        const fixedTop = this.searchPanel.createDiv({ cls: 'bible-search-fixed-top' });
        this.searchFixedTop = fixedTop;

        const rangeSection = fixedTop.createDiv({ cls: 'bible-section' });
        const rangeHeader = rangeSection.createDiv({ cls: 'bible-section-header' });
        const rangeIcon = rangeHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        rangeHeader.createEl('span', { text: '检索范围' });
        const rangeBody = rangeSection.createDiv({ cls: 'bible-section-body' });
        rangeHeader.addEventListener('click', () => {
            const isCollapsed = rangeBody.style.display === 'none';
            rangeBody.style.display = isCollapsed ? 'block' : 'none';
            rangeIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        this.rangeRadios = {};
        const rangeOptions = [
            { value: 'all', label: '全部圣经' },
            { value: 'multi', label: '选择范围' }
        ];
        for (const opt of rangeOptions) {
            const label = rangeBody.createEl('label', { cls: 'bible-radio-label' });
            const radio = label.createEl('input', { type: 'radio', attr: { name: 'bible-range', value: opt.value } });
            if (opt.value === 'all') radio.checked = true;
            this.rangeRadios[opt.value] = radio;
            label.createSpan({ text: opt.label });
        }

        this.bookSelectWrapper = rangeBody.createDiv({ cls: 'bible-book-select-wrapper' });
        this.bookSelectWrapper.style.display = 'none';
        this.bookSelectCount = this.bookSelectWrapper.createEl('div', { cls: 'bible-book-select-count', text: '已选 0 卷' });
        const bookSelectActions = this.bookSelectWrapper.createDiv({ cls: 'bible-book-select-actions' });
        const selectAllBooksBtn = bookSelectActions.createEl('button', { cls: 'bible-small-btn', text: '全选' });
        const clearBooksBtn = bookSelectActions.createEl('button', { cls: 'bible-small-btn', text: '清空' });

        const oldGroup = this.bookSelectWrapper.createDiv({ cls: 'bible-book-group' });
        oldGroup.createEl('div', { cls: 'bible-book-group-title', text: '旧约' });
        const oldGrid = oldGroup.createDiv({ cls: 'bible-book-grid' });
        for (const book of BIBLE_BOOKS.filter(b => b.testament === 'old')) {
            const btn = oldGrid.createEl('button', { cls: 'bible-book-grid-btn', text: book.shortName, attr: { 'data-book-id': String(book.id) } });
            btn.addEventListener('click', () => this.toggleBookSelection(btn));
        }

        const newGroup = this.bookSelectWrapper.createDiv({ cls: 'bible-book-group' });
        newGroup.createEl('div', { cls: 'bible-book-group-title', text: '新约' });
        const newGrid = newGroup.createDiv({ cls: 'bible-book-grid' });
        for (const book of BIBLE_BOOKS.filter(b => b.testament === 'new')) {
            const btn = newGrid.createEl('button', { cls: 'bible-book-grid-btn', text: book.shortName, attr: { 'data-book-id': String(book.id) } });
            btn.addEventListener('click', () => this.toggleBookSelection(btn));
        }

        selectAllBooksBtn.addEventListener('click', () => {
            for (const book of BIBLE_BOOKS) { this.selectedBookIds.add(book.id); }
            this.updateBookSelectUI();
        });
        clearBooksBtn.addEventListener('click', () => {
            this.selectedBookIds.clear();
            this.updateBookSelectUI();
        });

        for (const key in this.rangeRadios) {
            this.rangeRadios[key].addEventListener('change', () => {
                const val = this.getRangeValue();
                this.bookSelectWrapper.style.display = (val === 'multi') ? 'block' : 'none';
            });
        }

        const inputRow = fixedTop.createDiv({ cls: 'bible-input-row' });
        this.searchInput = inputRow.createEl('input', {
            cls: 'bible-search-input',
            attr: { type: 'text', placeholder: '输入经文出处或词语，如：加1:1 或 恩典' }
        });
        const clearBtn = inputRow.createEl('button', { cls: 'bible-input-btn', text: '✕' });
        const searchBtn = inputRow.createEl('button', { cls: 'bible-input-btn bible-search-btn', text: '🔍 查询' });

        this.searchHint = fixedTop.createEl('div', {
            cls: 'bible-search-hint',
            text: '支持：太1:1、路一1～3、太1:1-2:5 或 关键词（空格分隔）'
        });

        clearBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.results = [];
            this.selectCounter = 0;
            this.compareSelections = {};
            this.cmpOrder = [];
            this.currentPage = 0;
            this.keywords = [];
            if (this.resultsContainer) {
                this.resultsContainer.empty();
                this.resultsContainer.createEl('div', { cls: 'bible-empty-state', text: '请输入检索内容后点击查询' });
            }
            if (this.resultsCount) this.resultsCount.setText('');
            if (this.paginationEl) this.paginationEl.empty();
        });

        const actionSection = fixedTop.createDiv({ cls: 'bible-section bible-action-section' });
        const actionHeader = actionSection.createDiv({ cls: 'bible-section-header' });
        const actionIcon = actionHeader.createEl('span', { cls: 'bible-section-icon', text: '⚡' });
        actionHeader.createEl('span', { text: '全局操作' });
        const actionBody = actionSection.createDiv({ cls: 'bible-action-grid' });
        actionHeader.addEventListener('click', () => {
            const isCollapsed = actionBody.style.display === 'none';
            actionBody.style.display = isCollapsed ? 'grid' : 'none';
            actionIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        const selectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局全选' });
        const deselectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '取消全选' });
        const copyAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局复制' });
        const focusBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '逐节投影' });
        const parallelBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '并列投影' });
        const mixedBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '混合投影' });

        const typeSection = fixedTop.createDiv({ cls: 'bible-section' });
        const typeHeader = typeSection.createDiv({ cls: 'bible-section-header' });
        const typeIcon = typeHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        typeHeader.createEl('span', { text: '检索种类' });
        const typeBody = typeSection.createDiv({ cls: 'bible-type-grid' });
        typeHeader.addEventListener('click', () => {
            const isCollapsed = typeBody.style.display === 'none';
            typeBody.style.display = isCollapsed ? 'flex' : 'none';
            typeIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        for (const type of ['theme', 'outline', 'verse']) {
            const label = typeBody.createEl('label', { cls: 'bible-checkbox-label' });
            const cb = label.createEl('input', { type: 'checkbox' });
            cb.checked = true;
            this.typeCheckboxes[type] = cb;
            label.createSpan({ text: type === 'theme' ? '主题' : type === 'outline' ? '纲目' : '经文' });
        }

        this.resultsHeader = fixedTop.createDiv({ cls: 'bible-results-header' });
        this.resultsCount = this.resultsHeader.createEl('span', { cls: 'bible-results-count', text: '' });
        const pageSelectAllBtn = this.resultsHeader.createEl('button', { cls: 'bible-small-btn', text: '本页全选' });
        const pageCopyBtn = this.resultsHeader.createEl('button', { cls: 'bible-small-btn', text: '📋 本页复制' });

        this.paginationEl = fixedTop.createDiv({ cls: 'bible-pagination' });

        this.searchScrollArea = this.searchPanel.createDiv({ cls: 'bible-search-scroll-area' });
        this.resultsContainer = this.searchScrollArea.createDiv({ cls: 'bible-results-list' });
        this.resultsContainer.createEl('div', { cls: 'bible-empty-state', text: '请输入检索内容后点击查询' });

        searchBtn.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.performSearch(); });
        selectAllBtn.addEventListener('click', () => this.selectAll());
        deselectAllBtn.addEventListener('click', () => this.deselectAll());
        pageSelectAllBtn.addEventListener('click', () => this.selectPageAll());
        copyAllBtn.addEventListener('click', () => this.copyAll());
        pageCopyBtn.addEventListener('click', () => this.copyPageAll());
        focusBtn.addEventListener('click', () => this.openProjection('focus'));
        parallelBtn.addEventListener('click', () => this.openProjection('parallel'));
        mixedBtn.addEventListener('click', () => this.openProjection('mixed'));
    }

    buildReaderTab() {
        this.readerPanel = this.container.createDiv({ cls: 'bible-tab-panel' });
        this.readerPanel.style.display = 'none';
        this.readerFixedTop = this.readerPanel.createDiv({ cls: 'bible-reader-fixed-top' });
        this.readerScrollArea = this.readerPanel.createDiv({ cls: 'bible-reader-scroll-area' });
        this.readerContent = this.readerScrollArea.createDiv({ cls: 'bible-reader-content-inner' });
    }

    getRangeValue() {
        for (const key in this.rangeRadios) { if (this.rangeRadios[key].checked) return key; }
        return 'all';
    }

    toggleBookSelection(btn) {
        const id = parseInt(btn.dataset.bookId);
        if (this.selectedBookIds.has(id)) {
            this.selectedBookIds.delete(id);
            btn.classList.remove('active');
        } else {
            this.selectedBookIds.add(id);
            btn.classList.add('active');
        }
        this.updateBookSelectCount();
    }

    updateBookSelectUI() {
        const buttons = this.bookSelectWrapper.querySelectorAll('.bible-book-grid-btn');
        for (const btn of buttons) {
            const id = parseInt(btn.dataset.bookId);
            if (this.selectedBookIds.has(id)) btn.classList.add('active');
            else btn.classList.remove('active');
        }
        this.updateBookSelectCount();
    }

    updateBookSelectCount() {
        const count = this.selectedBookIds.size;
        if (this.bookSelectCount) this.bookSelectCount.setText('已选 ' + count + ' 卷');
    }

    toggleFocusMode() {
        if (this.activeTab === 'search') {
            this.searchFocusMode = !this.searchFocusMode;
            if (this.searchFocusMode) {
                this.searchFixedTop.classList.add('focus-mode');
            } else {
                this.searchFixedTop.classList.remove('focus-mode');
            }
        } else {
            this.readerFocusMode = !this.readerFocusMode;
            if (this.readerFocusMode) {
                this.readerFixedTop.classList.add('focus-mode');
            } else {
                this.readerFixedTop.classList.remove('focus-mode');
            }
        }
        this.updateFocusModeBtn();
    }

    updateFocusModeBtn() {
        if (!this.focusModeBtn) return;
        if (this.activeTab === 'search') {
            this.focusModeBtn.textContent = this.searchFocusMode ? '取消' : '专注';
        } else {
            this.focusModeBtn.textContent = this.readerFocusMode ? '取消' : '专注';
        }
    }

    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) { new Notice('请输入检索内容'); return; }
        this.resultsCount.setText('正在检索...');
        this.currentPage = 0;

        const types = [];
        if (this.typeCheckboxes['theme'].checked) types.push('theme');
        if (this.typeCheckboxes['outline'].checked) types.push('outline');
        if (this.typeCheckboxes['verse'].checked) types.push('verse');
        if (types.length === 0) { new Notice('请至少选择一种检索类型'); return; }

        const rangeValue = this.getRangeValue();
        let bookIds = [];
        if (rangeValue === 'multi') {
            bookIds = Array.from(this.selectedBookIds);
            if (bookIds.length === 0) { new Notice('请选择书卷'); return; }
        }

        if (this.plugin.searchEngine === null || this.plugin.allItems.length === 0) {
            await this.plugin.loadBibleData();
        }

        const primaryKey = this.getPrimaryVersion();
        if (!primaryKey) { new Notice('未设置主版本，请先在「对照」设置中选择一个版本'); return; }

        this.results = this.plugin.searchEngine.search(query, types, rangeValue, bookIds, primaryKey);
        this.selectCounter = 0;
        this.compareSelections = {};  // 清空对照经文选中状态
        this.cmpOrder = [];

        // 保存搜索条件，用于版本顺序改变后重新搜索
        this.lastSearchQuery = query;
        this.lastSearchTypes = types;
        this.lastRangeValue = rangeValue;
        this.lastBookIds = bookIds;

        const parsed = this.plugin.searchEngine.parseQuery(query);
        this.keywords = parsed.keywords;
        this.renderResults();
    }

    getPagedResults() {
        const start = this.currentPage * this.pageSize;
        return this.results.slice(start, start + this.pageSize);
    }

    getTotalPages() {
        return Math.ceil(this.results.length / this.pageSize);
    }

    renderResults() {
        this.resultsContainer.empty();
        this.paginationEl.empty();

        if (this.results.length === 0) {
            this.resultsCount.setText('未找到结果');
            this.resultsContainer.createEl('div', { cls: 'bible-empty-state', text: '未找到符合条件的内容' });
            return;
        }

        const totalPages = this.getTotalPages();
        const paged = this.getPagedResults();
        const startIdx = this.currentPage * this.pageSize + 1;
        const endIdx = Math.min((this.currentPage + 1) * this.pageSize, this.results.length);

        let countText = '共找到 ' + this.results.length + ' 节经文';
        if (this.keywords.length > 0) countText += '    关键词：' + this.keywords.join(' ');
        this.resultsCount.setText(countText);

        const pageInfo = this.paginationEl.createEl('div', { cls: 'bible-page-info' });
        pageInfo.setText('第 ' + (this.currentPage + 1) + '/' + totalPages + ' 页，显示 ' + startIdx + '-' + endIdx + ' 条');
        const pageSizeLabel = this.paginationEl.createEl('span', { cls: 'bible-page-size' });
        pageSizeLabel.setText('每页 ' + this.pageSize + ' 条');

        if (totalPages > 1) {
            const pageNav = this.paginationEl.createDiv({ cls: 'bible-page-nav' });
            const prevBtn = pageNav.createEl('button', { text: '◀', cls: 'bible-page-btn' });
            prevBtn.disabled = this.currentPage === 0;
            prevBtn.addEventListener('click', () => { if (this.currentPage > 0) { this.currentPage--; this.renderResults(); } });

            const maxVisible = 7;
            let startPage = 0, endPage = totalPages - 1;
            if (totalPages > maxVisible) {
                const half = Math.floor(maxVisible / 2);
                if (this.currentPage <= half) {
                    startPage = 0; endPage = maxVisible - 1;
                } else if (this.currentPage >= totalPages - half - 1) {
                    startPage = totalPages - maxVisible; endPage = totalPages - 1;
                } else {
                    startPage = this.currentPage - half; endPage = this.currentPage + half;
                }
            }

            if (startPage > 0) {
                const firstBtn = pageNav.createEl('button', { text: '1', cls: 'bible-page-btn' });
                firstBtn.addEventListener('click', () => { this.currentPage = 0; this.renderResults(); });
                if (startPage > 1) pageNav.createEl('span', { cls: 'bible-page-ellipsis', text: '…' });
            }

            for (let i = startPage; i <= endPage; i++) {
                const btn = pageNav.createEl('button', { text: String(i + 1), cls: 'bible-page-btn' + (i === this.currentPage ? ' active' : '') });
                btn.addEventListener('click', () => { this.currentPage = i; this.renderResults(); });
            }

            if (endPage < totalPages - 1) {
                if (endPage < totalPages - 2) pageNav.createEl('span', { cls: 'bible-page-ellipsis', text: '…' });
                const lastBtn = pageNav.createEl('button', { text: String(totalPages), cls: 'bible-page-btn' });
                lastBtn.addEventListener('click', () => { this.currentPage = totalPages - 1; this.renderResults(); });
            }

            const nextBtn = pageNav.createEl('button', { text: '▶', cls: 'bible-page-btn' });
            nextBtn.disabled = this.currentPage >= totalPages - 1;
            nextBtn.addEventListener('click', () => { if (this.currentPage < totalPages - 1) { this.currentPage++; this.renderResults(); } });

            const jumpWrapper = pageNav.createDiv({ cls: 'bible-page-jump' });
            jumpWrapper.createEl('span', { cls: 'bible-page-jump-label', text: '跳转' });
            const jumpInput = jumpWrapper.createEl('input', { cls: 'bible-page-jump-input', attr: { type: 'text', placeholder: '' } });
            jumpWrapper.createEl('span', { cls: 'bible-page-jump-label', text: '/' + totalPages });
            const jumpBtn = jumpWrapper.createEl('button', { cls: 'bible-page-btn', text: 'Go' });
            const doJump = () => {
                const page = parseInt(jumpInput.value);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    this.currentPage = page - 1;
                    this.renderResults();
                } else {
                    new Notice('请输入有效页码 (1-' + totalPages + ')');
                }
            };
            jumpBtn.addEventListener('click', doJump);
            jumpInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doJump(); });
        }

        const startOffset = this.currentPage * this.pageSize;
        for (let i = 0; i < paged.length; i++) {
            const globalIdx = startOffset + i;
            const result = paged[i];
            const item = result.item;

            const card = this.resultsContainer.createDiv({ cls: 'bible-result-card' + (result.selected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : '') });
            const cardHeader = card.createDiv({ cls: 'bible-result-header' });
            const checkbox = cardHeader.createDiv({ cls: 'bible-result-checkbox' + (result.selected ? ' checked' : '') });
            if (result.selected) checkbox.setText(String(result.order));

            let refText = '';
            if (item.type === 'verse') refText = item.bookShortName + item.chapter + ':' + item.verse;
            else if (item.type === 'theme') refText = item.bookFullName + ' 主题';
            else refText = item.bookFullName + ' 纲目';
            const refEl = cardHeader.createEl('span', { cls: 'bible-result-ref', text: refText });
            refEl.style.cursor = 'pointer';
            refEl.title = '点击跳转到经文位置';
            refEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openVerseLocation(item);
            });

            const contentEl = card.createDiv({ cls: 'bible-result-text' });
            let displayText = item.content;
            if (item.type === 'theme') displayText = '主题：' + item.content;
            if (item.type === 'outline') displayText = '> ' + item.content;

            if (this.keywords.length > 0 && item.type === 'verse') {
                this.highlightKeywords(contentEl, displayText, this.keywords);
            } else {
                contentEl.setText(displayText);
            }

            if (result.selected) {
                const sideTag = card.createDiv({ cls: 'bible-side-tag' + (result.sideBySide ? ' active' : '') });
                sideTag.setText(result.sideBySide ? '✓ 并列' : '并');
                sideTag.addEventListener('click', (e) => { e.stopPropagation(); this.toggleSideBySide(globalIdx); });
            }

            checkbox.addEventListener('click', () => this.toggleSelection(globalIdx));
            card.addEventListener('click', (e) => {
                // 如果点击的是对照行区域，不触发主版本选中
                if (e.target.closest('.bible-compare-row')) return;
                if (e.target.closest('.bible-result-checkbox') || e.target.closest('.bible-side-tag') || e.target.closest('.bible-result-ref')) return;
                this.toggleSelection(globalIdx);
            });

            if (this.hasCompareMode() && item.type === 'verse') {
                const compares = this.findCompareItems(item.bookId, item.chapter, item.verse, item.type);
                for (const cmp of compares) {
                    const cmpKey = `cmp-${globalIdx}-${cmp.versionKey}`;
                    const cmpSelection = this.compareSelections[cmpKey];
                    
                    // 对照行容器：左列(复选框+并列标签) + 右列(经文文字)
                    const cmpRow = card.createDiv({ cls: 'bible-compare-row' + (cmpSelection && cmpSelection.selected ? ' selected' : '') });
                    
                    // 左列：复选框 + 并列标签上下排列
                    const cmpLeftCol = cmpRow.createDiv({ cls: 'bible-compare-left-col' });
                    
                    // 复选框（与主版本相同的样式）
                    const cmpCb = cmpLeftCol.createDiv({ cls: 'bible-result-checkbox' + (cmpSelection && cmpSelection.selected ? ' checked' : '') });
                    if (cmpSelection && cmpSelection.selected) {
                        cmpCb.setText(String(cmpSelection.order));
                    }
                    
                    // 点击复选框切换选中
                    cmpCb.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleCompareSelection(globalIdx, cmp);
                    });
                    
                    // 并列标签（仅在选中时显示，与主版本卡片一致）
                    if (cmpSelection && cmpSelection.selected) {
                        const cmpSideTag = cmpLeftCol.createDiv({ cls: 'bible-side-tag' + (cmpSelection.sideBySide ? ' active' : '') });
                        cmpSideTag.setText(cmpSelection.sideBySide ? '✓ 并列' : '并');
                        cmpSideTag.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.toggleCompareSideBySide(globalIdx, cmp);
                        });
                    }
                    
                    // 经文内容（右列）
                    const cmpText = cmpRow.createDiv({ cls: 'bible-compare-text' });
                    cmpText.setText(cmp.item.content);
                    
                    // 点击整行切换选中
                    cmpRow.addEventListener('click', (e) => {
                        if (e.target === cmpRow || e.target.closest('.bible-compare-text') || e.target.closest('.bible-result-checkbox')) {
                            this.toggleCompareSelection(globalIdx, cmp);
                        }
                    });
                }
            }
        }
    }

    toggleCompareSelection(parentIdx, cmp) {
        const cmpKey = `cmp-${parentIdx}-${cmp.versionKey}`;
        const parentResult = this.results[parseInt(parentIdx)];
        
        // 切换对照经文的选中状态（独立存储，不添加到 results）
        if (this.compareSelections[cmpKey]) {
            delete this.compareSelections[cmpKey];
            // 从顺序数组中移除
            const idx = this.cmpOrder.indexOf(cmpKey);
            if (idx !== -1) this.cmpOrder.splice(idx, 1);
        } else {
            // 新选中时记录当前选中计数作为顺序
            this.compareSelections[cmpKey] = { selected: true, sideBySide: false, order: this.selectCounter + 1 };
            this.cmpOrder.push(cmpKey);  // 记录插入顺序
            this.selectCounter++;
        }
        
        // 重新计算所有选中项的连续序号
        this.recalcOrders();
        this.renderResults();
    }

    recalcOrders() {
        // 按用户选中顺序重新编号（不重排）
        const selected = [];
        for (const r of this.results) {
            if (r.selected) selected.push({ result: r, type: 'main', order: r.order });
        }
        // 使用 cmpOrder 数组保持插入顺序
        for (const cmpKey of this.cmpOrder) {
            const cmp = this.compareSelections[cmpKey];
            if (cmp && cmp.selected) {
                selected.push({ cmpKey, type: 'compare', order: cmp.order });
            }
        }
        // 按原始顺序重新编号
        selected.sort((a, b) => a.order - b.order);
        for (let i = 0; i < selected.length; i++) {
            const entry = selected[i];
            if (entry.type === 'main') {
                entry.result.order = i + 1;
            } else {
                this.compareSelections[entry.cmpKey].order = i + 1;
            }
        }
        this.selectCounter = selected.length;
    }

    highlightKeywords(element, text, keywords) {
        if (!keywords || keywords.length === 0) {
            element.setText(text);
            return;
        }
        const matches = [];
        for (const kw of keywords) {
            const textLower = text.toLowerCase();
            const kwLower = kw.toLowerCase();
            let idx = textLower.indexOf(kwLower);
            while (idx !== -1) {
                matches.push({ start: idx, end: idx + kw.length, kw: kw });
                idx = textLower.indexOf(kwLower, idx + 1);
            }
        }
        matches.sort((a, b) => a.start - b.start);
        const merged = [];
        for (const m of matches) {
            if (merged.length === 0 || m.start >= merged[merged.length - 1].end) {
                merged.push({ start: m.start, end: m.end });
            } else if (m.end > merged[merged.length - 1].end) {
                merged[merged.length - 1].end = m.end;
            }
        }
        let lastEnd = 0;
        for (const seg of merged) {
            if (seg.start > lastEnd) {
                element.appendChild(document.createTextNode(text.slice(lastEnd, seg.start)));
            }
            const span = document.createElement('span');
            span.className = 'bible-keyword';
            span.textContent = text.slice(seg.start, seg.end);
            element.appendChild(span);
            lastEnd = seg.end;
        }
        if (lastEnd < text.length) {
            element.appendChild(document.createTextNode(text.slice(lastEnd)));
        }
    }

    toggleSelection(index) {
        const result = this.results[index];
        if (!result) return;
        if (result.selected) {
            result.selected = false;
            result.sideBySide = false;
            result.order = 0;
        } else {
            this.selectCounter++;
            result.selected = true;
            result.order = this.selectCounter;
        }
        this.recalcOrders();
        this.renderResults();
    }

    toggleSideBySide(index) {
        const result = this.results[index];
        if (result && result.selected) { result.sideBySide = !result.sideBySide; this.renderResults(); }
    }

    toggleCompareSideBySide(parentIdx, cmp) {
        const cmpKey = `cmp-${parentIdx}-${cmp.versionKey}`;
        const cmpSelection = this.compareSelections[cmpKey];
        if (cmpSelection && cmpSelection.selected) {
            cmpSelection.sideBySide = !cmpSelection.sideBySide;
            this.renderResults();
        }
    }

    selectAll() {
        this.selectCounter = 0;
        for (const result of this.results) { result.selected = true; result.sideBySide = false; this.selectCounter++; result.order = this.selectCounter; }
        // 全选对照经文
        for (const cmpKey of this.cmpOrder) {
            this.compareSelections[cmpKey].selected = true;
        }
        // 重新计算所有选中项的连续序号
        this.recalcOrders();
        this.renderResults();
    }

    deselectAll() {
        for (const result of this.results) { result.selected = false; result.sideBySide = false; result.order = 0; }
        this.selectCounter = 0;
        // 取消全选对照经文
        for (const cmpKey of this.cmpOrder) {
            delete this.compareSelections[cmpKey];
        }
        this.cmpOrder = [];
        this.renderResults();
    }

    selectPageAll() {
        const paged = this.getPagedResults();
        const startOffset = this.currentPage * this.pageSize;
        for (let i = 0; i < paged.length; i++) {
            const globalIdx = startOffset + i;
            const result = this.results[globalIdx];
            if (!result.selected) { this.selectCounter++; result.selected = true; result.order = this.selectCounter; }
        }
        this.renderResults();
    }

    copySelected(results) {
        const selected = results.filter(r => r.selected).sort((a, b) => a.order - b.order);
        if (selected.length === 0) { new Notice('请先选择要复制的内容'); return; }
        const lines = [];
        for (const r of selected) {
            const item = r.item;
            if (r._isCompare) {
                lines.push(`⌈${item.versionKey.toLowerCase()}⌋${item.bookShortName}${item.chapter}:${item.verse} ${item.content}`);
            } else if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
            else if (item.type === 'outline') lines.push('> ' + item.content);
            else lines.push(item.bookShortName + item.chapter + ':' + item.verse + ' ' + item.content);
        }
        this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + selected.length + ' 条内容'); }).catch(() => new Notice('复制失败'));
    }

    copyAll() {
        const selected = [...this.results.filter(r => r.selected).sort((a, b) => a.order - b.order), ...this.getCompareSelected()];
        selected.sort((a, b) => a.order - b.order);
        this.copySelected(selected);
    }
    
    getCompareSelected() {
        const selected = [];
        // 使用 cmpOrder 数组保持插入顺序
        for (const cmpKey of this.cmpOrder) {
            const cmpSel = this.compareSelections[cmpKey];
            if (cmpSel && cmpSel.selected) {
                // 正确解析 cmpKey: "cmp-${parentIdx}-${versionKey}"
                // versionKey 可能包含 "-"，所以需要从第一个数字后的位置截取
                const prefix = 'cmp-';
                if (!cmpKey.startsWith(prefix)) continue;
                const afterPrefix = cmpKey.slice(prefix.length);
                // 找到第一个非数字字符的位置（即 parentIdx 后的 "-"）
                let i = 0;
                while (i < afterPrefix.length && /\d/.test(afterPrefix[i])) i++;
                if (i === 0 || afterPrefix[i] !== '-') continue;
                const parentIdx = parseInt(afterPrefix.slice(0, i));
                const versionKey = afterPrefix.slice(i + 1);
                
                const parentResult = this.results[parseInt(parentIdx)];
                if (parentResult) {
                    const compares = this.findCompareItems(parentResult.item.bookId, parentResult.item.chapter, parentResult.item.verse, parentResult.item.type);
                    const cmp = compares.find(c => c.versionKey === versionKey);
                    if (cmp) {
                        selected.push({ item: cmp.item, selected: true, order: cmpSel.order, sideBySide: cmpSel.sideBySide, _isCompare: true, _cmpKey: cmpKey, versionKey: versionKey });
                    }
                }
            }
        }
        return selected;
    }


    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                textarea.style.top = '0';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (!success) throw new Error('execCommand failed');
            }
        } catch (e) {
            new Notice('复制失败：' + e.message);
            throw e;
        }
    }

    copyPageAll() {
        const paged = this.getPagedResults();
        const pageCompareSelected = [];
        const startOffset = this.currentPage * this.pageSize;
        for (let i = 0; i < paged.length; i++) {
            const globalIdx = startOffset + i;
            const result = paged[i];
            const compares = this.findCompareItems(result.item.bookId, result.item.chapter, result.item.verse, result.item.type);
            for (const cmp of compares) {
                const cmpKey = `cmp-${globalIdx}-${cmp.versionKey}`;
                if (this.compareSelections[cmpKey] && this.compareSelections[cmpKey].selected) {
                    const order = this.compareSelections[cmpKey].order;
                    pageCompareSelected.push({ item: cmp.item, selected: true, order: order, sideBySide: this.compareSelections[cmpKey].sideBySide, _isCompare: true, _cmpKey: cmpKey, versionKey: cmp.versionKey });
                }
            }
        }
        const selected = [...paged.filter(r => r.selected), ...pageCompareSelected];
        selected.sort((a, b) => a.order - b.order);
        this.copySelected(selected);
    }

    openProjection(mode) {
        const selected = [...this.results.filter(r => r.selected), ...this.getCompareSelected()];
        selected.sort((a, b) => a.order - b.order);
        if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
        const overlay = new BibleProjectionOverlay(this.app, selected, mode, true);
        overlay.open();
    }

    renderReader() {
        this.readerContent.empty();
        this.readerFixedTop.empty();
        if (this.readerState === 'books') {
            this.renderBookList();
        }
        else if (this.readerState === 'chapters') {
            this.renderChapterList();
        }
        else if (this.readerState === 'content') {
            this.renderChapterContent();
        }
    }

    renderBookList() {
        // 切换回书卷列表时，清空之前书卷的选中状态
        this.readerResults = [];
        this.readerSelectCounter = 0;

        this.readerContent.createEl('h4', { cls: 'bible-reader-label', text: '旧约' });
        const oldGrid = this.readerContent.createDiv({ cls: 'bible-reader-grid' });
        for (const book of BIBLE_BOOKS.filter(b => b.testament === 'old')) {
            const btn = oldGrid.createEl('button', { cls: 'bible-reader-book-btn', text: book.shortName });
            btn.title = book.fullName;
            btn.addEventListener('click', () => { this.readerBook = book; this.readerState = 'chapters'; this.renderReader(); });
        }
        this.readerContent.createEl('h4', { cls: 'bible-reader-label', text: '新约' });
        const newGrid = this.readerContent.createDiv({ cls: 'bible-reader-grid' });
        for (const book of BIBLE_BOOKS.filter(b => b.testament === 'new')) {
            const btn = newGrid.createEl('button', { cls: 'bible-reader-book-btn', text: book.shortName });
            btn.title = book.fullName;
            btn.addEventListener('click', () => { this.readerBook = book; this.readerState = 'chapters'; this.renderReader(); });
        }
    }

    renderChapterList() {
        const book = this.readerBook;
        if (!book) { this.readerState = 'books'; this.renderReader(); return; }
        const nav = this.readerContent.createDiv({ cls: 'bible-reader-nav-row' });
        const backBtn = nav.createEl('button', { cls: 'bible-reader-nav-btn', text: '← 返回书卷' });
        backBtn.addEventListener('click', () => { this.readerState = 'books'; this.renderReader(); });
        nav.createEl('span', { cls: 'bible-reader-nav-title', text: book.id + '. ' + book.fullName });
        const grid = this.readerContent.createDiv({ cls: 'bible-reader-grid' });
        for (let i = 1; i <= book.maxChapters; i++) {
            const btn = grid.createEl('button', { cls: 'bible-reader-chapter-btn', text: String(i) });
            btn.addEventListener('click', () => { this.readerChapter = i; this.readerState = 'content'; this.renderReader(); });
        }
    }

    async renderChapterContent() {
        this.readerContent.empty();
        this.readerFixedTop.empty();
        const book = this.readerBook;
        const chapter = this.readerChapter;
        if (!book) { this.readerState = 'books'; this.renderReader(); return; }

        // 只保留当前书卷的选中状态（切换书卷时自动过滤掉旧书卷）
        const prevCount = this.readerResults.length;
        this.readerResults = this.readerResults.filter(r => r.item.bookId === book.id);
        if (this.readerResults.length !== prevCount) {
            // 有跨书卷的项被过滤，重新计算计数器
            const selected = this.readerResults.filter(r => r.selected);
            for (let i = 0; i < selected.length; i++) {
                selected[i].order = i + 1;
            }
            this.readerSelectCounter = selected.length;
        }

        const compareVersions = this.getCompareVersions();
        const hasCompare = compareVersions.length > 0;

        const nav = this.readerFixedTop.createDiv({ cls: 'bible-reader-nav-row' });
        const backBtn = nav.createEl('button', { cls: 'bible-reader-nav-btn', text: '← 返回章节' });
        backBtn.addEventListener('click', () => { this.readerState = 'chapters'; this.renderReader(); });
        nav.createEl('span', { cls: 'bible-reader-nav-title', text: book.fullName + ' 第' + chapter + '章' });

        const jumpRow = this.readerFixedTop.createDiv({ cls: 'bible-reader-jump-row' });
        jumpRow.createEl('span', { cls: 'bible-reader-jump-label', text: '快速跳转：' });
        const bookSelect = jumpRow.createEl('select', { cls: 'bible-reader-jump-select' });
        for (const b of BIBLE_BOOKS) {
            const opt = bookSelect.createEl('option', { value: String(b.id), text: b.id + '. ' + b.fullName });
            if (b.id === book.id) opt.selected = true;
        }
        const chapterSelect = jumpRow.createEl('select', { cls: 'bible-reader-jump-select' });
        for (let i = 1; i <= book.maxChapters; i++) {
            const opt = chapterSelect.createEl('option', { value: String(i), text: '第' + i + '章' });
            if (i === chapter) opt.selected = true;
        }
        bookSelect.addEventListener('change', () => {
            const newBookId = parseInt(bookSelect.value);
            const newBook = BOOK_ID_MAP[newBookId];
            if (newBook) {
                this.readerBook = newBook;
                this.readerChapter = 1;
                this.renderReader();
            }
        });
        chapterSelect.addEventListener('change', () => {
            this.readerChapter = parseInt(chapterSelect.value);
            this.renderReader();
        });


        // 字体调节行（上一章/下一章放在右边）
        const fontRow = this.readerFixedTop.createDiv({ cls: 'bible-reader-font-row' });
        fontRow.createEl('span', { cls: 'bible-reader-font-label', text: '字体：' });
        const fontSmaller = fontRow.createEl('button', { cls: 'bible-reader-font-btn', text: '−' });
        const fontSizeDisplay = fontRow.createEl('span', { cls: 'bible-reader-font-size', text: this.readerFontSize + 'px' });
        const fontLarger = fontRow.createEl('button', { cls: 'bible-reader-font-btn', text: '+' });
        fontSmaller.addEventListener('click', () => {
            this.readerFontSize = Math.max(10, this.readerFontSize - 1);
            fontSizeDisplay.setText(this.readerFontSize + 'px');
            this.updateReaderFontSize();
        });
        fontLarger.addEventListener('click', () => {
            this.readerFontSize = Math.min(32, this.readerFontSize + 1);
            fontSizeDisplay.setText(this.readerFontSize + 'px');
            this.updateReaderFontSize();
        });
        // 上一章/下一章放在字体调节右边
        const prevChBtn = fontRow.createEl('button', { cls: 'bible-reader-nav-btn', text: '◀ 上一章' });
        const nextChBtn = fontRow.createEl('button', { cls: 'bible-reader-nav-btn', text: '下一章 ▶' });
        prevChBtn.disabled = chapter <= 1;
        nextChBtn.disabled = chapter >= book.maxChapters;
        prevChBtn.addEventListener('click', () => { if (chapter > 1) { this.readerChapter--; this.renderReader(); } });
        nextChBtn.addEventListener('click', () => { if (chapter < book.maxChapters) { this.readerChapter++; this.renderReader(); } });

        // 全局操作区块（模仿搜索视图的折叠区块）
        const actionSection = this.readerFixedTop.createDiv({ cls: 'bible-section bible-action-section' });
        const actionHeader = actionSection.createDiv({ cls: 'bible-section-header' });
        const actionIcon = actionHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        actionHeader.createEl('span', { text: '全局操作' });
        const actionBody = actionSection.createDiv({ cls: 'bible-action-grid' });
        actionHeader.addEventListener('click', () => {
            const isCollapsed = actionBody.style.display === 'none';
            actionBody.style.display = isCollapsed ? 'grid' : 'none';
            actionIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        const selectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局全选' });
        const deselectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局取消' });
        const copySelectedBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局复制' });
        const focusProjBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '逐节投影' });
        const parallelProjBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '并列投影' });
        const mixedProjBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '混合投影' });

        if (this.plugin.allItems.length === 0) await this.plugin.loadBibleData();

        const primaryKey = this.getReaderPrimaryVersion();
        // 当前章内容
        const items = this.plugin.allItems
            .filter(i => i.versionKey === primaryKey && i.bookId === book.id && i.chapter === chapter)
            .sort((a, b) => a.lineIndex - b.lineIndex);
        // 全书卷内容（用于全局全选）
        const allBookItems = this.plugin.allItems
            .filter(i => i.versionKey === primaryKey && i.bookId === book.id)
            .sort((a, b) => a.lineIndex - b.lineIndex);
        const themeItems = this.plugin.allItems.filter(i => i.versionKey === primaryKey && i.bookId === book.id && i.type === 'theme');
        const allBookThemeItems = this.plugin.allItems.filter(i => i.versionKey === primaryKey && i.bookId === book.id && i.type === 'theme');

        this.currentChapterItems = items;
        this.currentChapterThemeItems = themeItems;

        // 章节标题行（单独一行，不占按钮空间）
        const chapterTitleRow = this.readerFixedTop.createDiv({ cls: 'bible-reader-nav-title' });
        chapterTitleRow.style.textAlign = 'center';
        chapterTitleRow.style.marginBottom = '8px';
        chapterTitleRow.style.fontSize = '14px';
        chapterTitleRow.setText(book.fullName + ' 第' + chapter + '章');

        // 本页操作按钮行放在全局操作区块下方（readerFixedTop 中）
        const pageActionRow = this.readerFixedTop.createDiv({ cls: 'bible-results-header' });
        const pageSelectAllBtn = pageActionRow.createEl('button', { cls: 'bible-small-btn', text: '本页全选' });
        const pageCopyBtn = pageActionRow.createEl('button', { cls: 'bible-small-btn', text: '📋 本页复制' });
        const copyVersesBtn = pageActionRow.createEl('button', { cls: 'bible-small-btn', text: '复制经文' });
        const copyOutlinesBtn = pageActionRow.createEl('button', { cls: 'bible-small-btn', text: '复制纲目' });

        const contentEl = this.readerContent.createDiv({ cls: 'bible-reader-content-list' });
        contentEl.style.fontSize = this.readerFontSize + 'px';

        // 主题直接显示在内容区域开头（去掉"书卷主题"标题）
        if (themeItems.length > 0) {
            for (const t of themeItems) {
                this.renderReaderItemCard(contentEl, t);
            }
        }

        let prevVerseKey = null;
        for (const item of items) {
            if (item.type === 'theme') continue;
            const currentVerseKey = `${item.bookId}-${item.chapter}-${item.verse}`;
            if (prevVerseKey !== null && currentVerseKey !== prevVerseKey) {
                contentEl.createDiv({ cls: 'bible-reader-divider' });
            }
            prevVerseKey = currentVerseKey;
            this.renderReaderItemCard(contentEl, item);
        }

        // ========== 全局操作函数 ==========
        const doGlobalSelectAll = () => {
            // 按顺序选中此卷书所有章节的主版本内容
            const allItems = [...allBookThemeItems, ...allBookItems];
            for (const item of allItems) {
                const existingIdx = this.readerResults.findIndex(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
                );
                if (existingIdx === -1) {
                    this.readerResults.push({ item: item, selected: true, order: 0, sideBySide: false });
                } else {
                    this.readerResults[existingIdx].selected = true;
                    this.readerResults[existingIdx].sideBySide = false;
                    this.readerResults[existingIdx].order = 0;
                }
            }
            this.recalcReaderOrders();
            this.refreshAllReaderCards();
            new Notice(`已将《${book.fullName}》全部主版本内容选中`);
        };

        const doGlobalDeselectAll = () => {
            for (const r of this.readerResults) {
                r.selected = false;
                r.sideBySide = false;
                r.order = 0;
            }
            this.readerSelectCounter = 0;
            this.refreshAllReaderCards();
            new Notice('已取消全部选中');
        };

        const doGlobalCopy = () => {
            const selected = this.readerResults.filter(r => r.selected).sort((a, b) => a.order - b.order);
            if (selected.length === 0) { new Notice('请先选择要复制的内容'); return; }
            const lines = [];
            for (const r of selected) {
                const item = r.item;
                if (r._isCompare) {
                    lines.push(`⌈${item.versionKey.toLowerCase()}⌋${item.bookShortName}${item.chapter}:${item.verse} ${item.content}`);
                } else if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
                else if (item.type === 'outline') lines.push('> ' + item.content);
                else lines.push(item.bookShortName + item.chapter + ':' + item.verse + ' ' + item.content);
            }
            this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + selected.length + ' 条选中项'); });
        };

        // ========== 本页操作函数 ==========
        const doPageSelectAll = () => {
            // 按顺序选中当前章的主版本内容；第一章额外选中主题
            const pageItems = this.readerChapter === 1 ? [...themeItems, ...items] : [...items];
            for (const item of pageItems) {
                const existingIdx = this.readerResults.findIndex(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
                );
                if (existingIdx === -1) {
                    this.readerResults.push({ item: item, selected: true, order: 0, sideBySide: false });
                } else {
                    this.readerResults[existingIdx].selected = true;
                    this.readerResults[existingIdx].sideBySide = false;
                    this.readerResults[existingIdx].order = 0;
                }
            }
            this.recalcReaderOrders();
            this.refreshAllReaderCards();
            new Notice('已将本章主版本内容选中');
        };

        const doPageCopy = () => {
            const pageSelected = this.readerResults.filter(r => {
                if (!r.selected) return false;
                const item = r.item;
                return item.bookId === book.id && item.chapter === chapter;
            }).sort((a, b) => a.order - b.order);
            if (pageSelected.length === 0) { new Notice('本章没有选中的内容'); return; }
            const lines = [];
            for (const r of pageSelected) {
                const item = r.item;
                if (r._isCompare) {
                    lines.push(`⌈${item.versionKey.toLowerCase()}⌋${item.bookShortName}${item.chapter}:${item.verse} ${item.content}`);
                } else if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
                else if (item.type === 'outline') lines.push('> ' + item.content);
                else lines.push(item.bookShortName + item.chapter + ':' + item.verse + ' ' + item.content);
            }
            this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + pageSelected.length + ' 条本章选中项'); });
        };

        // ========== 事件绑定 ==========
        selectAllBtn.addEventListener('click', doGlobalSelectAll);
        deselectAllBtn.addEventListener('click', doGlobalDeselectAll);
        copySelectedBtn.addEventListener('click', doGlobalCopy);
        focusProjBtn.addEventListener('click', () => this.openReaderProjection('focus'));
        parallelProjBtn.addEventListener('click', () => this.openReaderProjection('parallel'));
        mixedProjBtn.addEventListener('click', () => this.openReaderProjection('mixed'));

        pageSelectAllBtn.addEventListener('click', doPageSelectAll);
        pageCopyBtn.addEventListener('click', doPageCopy);

        copyVersesBtn.addEventListener('click', () => {
            const verses = items.filter(i => i.type === 'verse');
            if (verses.length === 0) { new Notice('本章没有经文内容'); return; }
            const lines = verses.map(v => v.bookShortName + v.chapter + ':' + v.verse + ' ' + v.content);
            this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + verses.length + ' 节经文'); });
        });

        copyOutlinesBtn.addEventListener('click', () => {
            const outlines = items.filter(i => i.type === 'outline');
            if (outlines.length === 0) { new Notice('本章没有纲目内容'); return; }
            const lines = outlines.map(o => '> ' + o.content);
            this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + outlines.length + ' 条纲目'); });
        });
    }

    openReaderProjection(mode) {
        const selected = this.readerResults.filter(r => r.selected);
        if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
        const overlay = new BibleProjectionOverlay(this.app, selected, mode, false);
        overlay.open();
    }

    renderReaderItemCard(container, item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );
        const isSelected = existingIdx !== -1 && this.readerResults[existingIdx].selected;
        const result = existingIdx !== -1 ? this.readerResults[existingIdx] : null;

        // 主版本卡片（不设置分隔线）
        const card = container.createDiv({ cls: 'bible-reader-verse-card' + (isSelected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : ''), attr: { 'data-line-index': item.lineIndex } });

        if (item.type === 'outline') {
            const contentRow = card.createDiv({ cls: 'bible-reader-verse-content-row' });
            contentRow.style.cssText = 'display:flex;align-items:flex-start;gap:8px;';

            const checkbox = contentRow.createDiv({ cls: 'bible-reader-verse-checkbox' + (isSelected ? ' checked' : '') });
            if (isSelected) checkbox.setText(String(result.order));
            checkbox.addEventListener('click', () => this.toggleReaderItemSelection(item));

            const textEl = contentRow.createDiv({ cls: 'bible-reader-verse-text' });
            textEl.style.cssText = 'flex:1;line-height:1.7;';
            textEl.setText('> ' + item.content);

            card.addEventListener('click', (e) => {
                if (e.target === card || e.target === textEl) this.toggleReaderItemSelection(item);
            });
        } else {
            // 主版本：候选框 + 出处 + 内容
            const header = card.createDiv({ cls: 'bible-reader-verse-header' });
            const checkbox = header.createDiv({ cls: 'bible-reader-verse-checkbox' + (isSelected ? ' checked' : '') });
            if (isSelected) checkbox.setText(String(result.order));
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleReaderItemSelection(item);
            });

            let refText = '';
            if (item.type === 'theme') refText = item.bookFullName + ' 主题';
            else refText = item.bookShortName + item.chapter + ':' + item.verse;
            header.createEl('span', { cls: 'bible-reader-verse-ref', text: refText });

            // 经文内容
            const textEl = card.createDiv({ cls: 'bible-reader-verse-text', text: item.content });

            card.addEventListener('click', (e) => {
                // 排除对照行区域，避免点击对照行时误触发主版本选中
                if (e.target.closest('.bible-reader-compare-row')) return;
                if (e.target === card || e.target.closest('.bible-reader-verse-text') || e.target === checkbox || e.target.classList.contains('bible-reader-verse-ref')) {
                    this.toggleReaderItemSelection(item);
                }
            });
        }

        // 主版本的并列标签（总是创建，初始隐藏）
        const sideTag = card.createDiv({ cls: 'bible-reader-side-tag' + (isSelected && result && result.sideBySide ? ' active' : '') });
        sideTag.setText(isSelected && result && result.sideBySide ? '✓ 并列' : '并');
        sideTag.style.display = isSelected ? 'block' : 'none';
        sideTag.addEventListener('click', (e) => { e.stopPropagation(); this.toggleReaderSideBySide(item); });
        
        // 对照经文（在主版本卡片下方，同一容器内）
        if (this.hasCompareMode() && item.type === 'verse') {
            const compares = this.findCompareItems(item.bookId, item.chapter, item.verse, item.type);
            
            for (const cmp of compares) {
                const cmpKey = `rd-cmp-${item.lineIndex}-${cmp.versionKey}`;
                const cmpResultIdx = this.readerResults.findIndex(r => r._cmpKey === cmpKey);
                const cmpSelected = cmpResultIdx !== -1 && this.readerResults[cmpResultIdx].selected;
                const cmpResult = cmpResultIdx !== -1 ? this.readerResults[cmpResultIdx] : null;
                
                // 创建独立的对照行（作为 card 的子元素，便于查询和样式控制）
                const cmpRow = card.createDiv({ cls: 'bible-reader-compare-row' });
                cmpRow.setAttribute('data-version-key', cmp.versionKey);

                // 左列：候选框 + 并列标签（纵向排列）
                const cmpLeftCol = cmpRow.createDiv({ cls: 'bible-reader-compare-left-col' });
                const cmpCb = cmpLeftCol.createDiv({ cls: 'bible-reader-verse-checkbox' + (cmpSelected ? ' checked' : '') });
                if (cmpSelected) cmpCb.setText(String(cmpResult.order));

                // 并列标签（仅在选中时显示，放在候选框下方）
                if (cmpSelected) {
                    const cmpSideTag = cmpLeftCol.createDiv({ cls: 'bible-reader-side-tag' + (cmpResult.sideBySide ? ' active' : '') });
                    cmpSideTag.setText(cmpResult.sideBySide ? '✓ 并列' : '并');
                    cmpSideTag.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleReaderCompareSideBySide(item, cmp, cmpKey);
                    });
                }

                // 经文内容（淡化颜色）
                const cmpText = cmpRow.createDiv({ cls: 'bible-reader-compare-text' });
                cmpText.setText(cmp.item.content);

                // 点击候选框切换选中
                cmpCb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleReaderCompareSelection(item, cmp, cmpKey);
                });

                // 点击行切换选中
                cmpRow.addEventListener('click', (e) => {
                    if (e.target === cmpRow || e.target.closest('.bible-reader-compare-text')) {
                        this.toggleReaderCompareSelection(item, cmp, cmpKey);
                    }
                });
            }
        }

    }

        toggleReaderCompareSelection(parentItem, cmp, cmpKey) {
        const existingIdx = this.readerResults.findIndex(r => r._cmpKey === cmpKey);
        if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
            this.readerResults[existingIdx].selected = false;
            this.readerResults[existingIdx].sideBySide = false;
            this.readerResults[existingIdx].order = 0;
        } else {
            this.readerSelectCounter++;
            if (existingIdx !== -1) {
                this.readerResults[existingIdx].selected = true;
                this.readerResults[existingIdx].order = this.readerSelectCounter;
            } else {
                this.readerResults.push({
                    item: cmp.item,
                    selected: true,
                    order: this.readerSelectCounter,
                    sideBySide: false,
                    _isCompare: true,
                    _versionName: cmp.versionName,
                    _cmpKey: cmpKey,
                    versionKey: cmp.versionKey
                });
            }
        }
        this.recalcReaderOrders();
        this.refreshAllReaderCards();
    }

    recalcReaderOrders() {
        // 按用户选中顺序重新编号（不重排）
        const selected = this.readerResults.filter(r => r.selected);
        selected.sort((a, b) => a.order - b.order);
        for (let i = 0; i < selected.length; i++) {
            selected[i].order = i + 1;
        }
        this.readerSelectCounter = selected.length;
    }

    refreshAllReaderCards() {
        // 刷新当前章节所有可见经文卡片的选中状态
        const allItems = [...(this.currentChapterThemeItems || []), ...(this.currentChapterItems || [])];
        const cards = this.readerContent.querySelectorAll('.bible-reader-verse-card');
        for (const card of cards) {
            const lineIndex = parseInt(card.dataset.lineIndex);
            if (isNaN(lineIndex)) continue;
            const item = allItems.find(i => i.lineIndex === lineIndex);
            if (item) {
                this.refreshReaderItemCard(item);
            }
        }
    }

    toggleReaderCompareSideBySide(parentItem, cmp, cmpKey) {
        const existingIdx = this.readerResults.findIndex(r => r._cmpKey === cmpKey);
        if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
            this.readerResults[existingIdx].sideBySide = !this.readerResults[existingIdx].sideBySide;
            this.refreshReaderItemCard(parentItem);
        }
    }

    refreshReaderItemCard(item) {
        const card = this.readerPanel.querySelector('.bible-reader-verse-card[data-line-index="' + item.lineIndex + '"]');
        if (!card) return;

        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );
        const isSelected = existingIdx !== -1 && this.readerResults[existingIdx].selected;
        const result = existingIdx !== -1 ? this.readerResults[existingIdx] : null;

        if (isSelected) card.classList.add('selected');
        else card.classList.remove('selected');

        const checkbox = card.querySelector('.bible-reader-verse-checkbox');
        if (checkbox) {
            if (isSelected) {
                checkbox.classList.add('checked');
                checkbox.textContent = String(result.order);
            } else {
                checkbox.classList.remove('checked');
                checkbox.textContent = '';
            }
        }

        const sideTag = card.querySelector('.bible-reader-side-tag');
        if (sideTag) {
            if (isSelected && result) {
                sideTag.style.display = 'block';
                if (result.sideBySide) sideTag.classList.add('active');
                else sideTag.classList.remove('active');
                sideTag.textContent = result.sideBySide ? '✓ 并列' : '并';
            } else {
                sideTag.style.display = 'none';
            }
        }

        // 更新对照版本的选中状态
        if (this.hasCompareMode() && item.type === 'verse') {
            const compares = this.findCompareItems(item.bookId, item.chapter, item.verse, item.type);
            for (const cmp of compares) {
                const cmpKey = `rd-cmp-${item.lineIndex}-${cmp.versionKey}`;
                const cmpRow = card.querySelector(`.bible-reader-compare-row[data-version-key="${cmp.versionKey}"]`);
                if (cmpRow) {
                    const cmpLeftCol = cmpRow.querySelector('.bible-reader-compare-left-col');
                    const cmpCb = cmpLeftCol ? cmpLeftCol.querySelector('.bible-reader-verse-checkbox') : null;
                    const existingCmp = this.readerResults.findIndex(r => r._cmpKey === cmpKey && r.selected);
                    if (cmpCb) {
                        if (existingCmp !== -1) {
                            cmpCb.classList.add('checked');
                            cmpCb.textContent = String(this.readerResults[existingCmp].order);
                        } else {
                            cmpCb.classList.remove('checked');
                            cmpCb.textContent = '';
                        }
                    }

                    // 更新并列标签（在左列中）
                    let cmpSideTag = cmpLeftCol ? cmpLeftCol.querySelector('.bible-reader-side-tag') : null;
                    if (existingCmp !== -1) {
                        if (!cmpSideTag && cmpLeftCol) {
                            cmpSideTag = cmpLeftCol.createDiv({ cls: 'bible-reader-side-tag' + (this.readerResults[existingCmp].sideBySide ? ' active' : '') });
                            cmpSideTag.setText(this.readerResults[existingCmp].sideBySide ? '✓ 并列' : '并');
                            cmpSideTag.addEventListener('click', (e) => {
                                e.stopPropagation();
                                this.toggleReaderCompareSideBySide(item, cmp, cmpKey);
                            });
                        } else if (cmpSideTag) {
                            cmpSideTag.style.display = 'block';
                            if (this.readerResults[existingCmp].sideBySide) {
                                cmpSideTag.classList.add('active');
                            } else {
                                cmpSideTag.classList.remove('active');
                            }
                            cmpSideTag.textContent = this.readerResults[existingCmp].sideBySide ? '✓ 并列' : '并';
                        }
                    } else {
                        if (cmpSideTag) cmpSideTag.style.display = 'none';
                    }
                }
            }
        }
    }    toggleReaderItemSelection(item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );

        if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
            this.readerResults[existingIdx].selected = false;
            this.readerResults[existingIdx].sideBySide = false;
            this.readerResults[existingIdx].order = 0;
        } else {
            this.readerSelectCounter++;
            if (existingIdx !== -1) {
                this.readerResults[existingIdx].selected = true;
                this.readerResults[existingIdx].order = this.readerSelectCounter;
            } else {
                this.readerResults.push({ item: item, selected: true, order: this.readerSelectCounter, sideBySide: false });
            }
        }
        this.recalcReaderOrders();
        this.refreshAllReaderCards();
    }

    toggleReaderSideBySide(item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );
        if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
            this.readerResults[existingIdx].sideBySide = !this.readerResults[existingIdx].sideBySide;
            this.refreshReaderItemCard(item);
        }
    }

    updateReaderFontSize() {
        const contentList = this.readerContent.querySelector('.bible-reader-content-list');
        if (contentList) contentList.style.fontSize = this.readerFontSize + 'px';
        const themeEl = this.readerFixedTop.querySelector('.bible-reader-book-theme');
        if (themeEl) themeEl.style.fontSize = this.readerFontSize + 'px';
    }

    async openVerseLocation(item) {
        const book = BOOK_ID_MAP[item.bookId];
        if (!book) {
            new Notice('未知书卷');
            return;
        }
        this.readerBook = book;
        this.readerChapter = item.chapter > 0 ? item.chapter : 1;
        this.readerState = 'content';
        this.activeTab = 'reader';
        this.tabSearch.classList.remove('active');
        this.tabReader.classList.add('active');
        if (this.searchPanel) this.searchPanel.style.display = 'none';
        if (this.readerPanel) this.readerPanel.style.display = 'flex';
        if (this.readerContent) this.readerContent.empty();
        if (this.readerFixedTop) this.readerFixedTop.empty();
        await this.renderChapterContent();
        this.scrollToReaderItem(item);
        this.updateFocusModeBtn();
    }

    scrollToReaderItem(item) {
        const card = this.readerPanel.querySelector('.bible-reader-verse-card[data-line-index="' + item.lineIndex + '"]');
        if (!card) {
            if (this.readerScrollArea) this.readerScrollArea.scrollTop = 0;
            return;
        }
        card.classList.add('bible-jump-highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            card.classList.remove('bible-jump-highlight');
        }, 3000);
    }
}

// ==================== 插件主类 ====================
class BibleSearchPlugin extends Plugin {
    async onload() {
        await this.loadSettings();
        await this.syncScannedVersions();
        this.parser = new BibleParser(this.app, this.settings, this.manifest.dir);
        this.searchEngine = new BibleSearchEngine();
        this.allItems = [];

        this.registerView(BIBLE_SEARCH_VIEW_TYPE, (leaf) => new BibleSearchView(leaf, this));

        this.addRibbonIcon('book-plus', '圣经检索', () => { this.activateSearchView(); });
        this.addCommand({ id: 'open-bible-search', name: '打开圣经检索', callback: () => this.activateSearchView() });
        this.addSettingTab(new BibleSettingTab(this.app, this));

        await this.migrateOldData();
        await this.loadBibleData();

        this.registerEvent(this.app.workspace.onLayoutReady(() => {
            const hasInstalledVersion = this.settings.versions.some(v => v.installed);
            if (!this.settings.hasSetup || !hasInstalledVersion) {
                new FirstRunModal(this.app, this).open();
            }
            if (this.settings.autoCheckUpdate) {
                this.checkForUpdate();
            }
        }));
    }

    onunload() {
        const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
        for (const leaf of leaves) {
            try { leaf.detach(); } catch (e) {}
        }
        document.querySelectorAll('.bible-projection-fullscreen').forEach(el => el.remove());
    }

    async loadSettings() {
        const defaults = {
            versions: [],
            hasSetup: false,
            autoCheckUpdate: true,
            lastVersion: '',
            readerResults: [],
            readerSelectCounter: 0
        };
        const loaded = await this.loadData() || {};
        this.settings = Object.assign({}, defaults, loaded);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async migrateOldData() {
        try {
            const pluginId = this.manifest?.id || 'bible-search-reader';
            const oldFile = `.obsidian/plugins/${pluginId}/bible-data.json`;
            const newFile = `.obsidian/plugins/${pluginId}/bible-crv-data.json`;

            if (await this.app.vault.adapter.exists(oldFile)) {
                if (!(await this.app.vault.adapter.exists(newFile))) {
                    const data = await this.app.vault.adapter.read(oldFile);
                    await this.app.vault.adapter.write(newFile, data);
                }
                if (!this.settings.versions.find(v => v.key === 'CRV')) {
                    this.settings.versions.push({
                        key: 'CRV',
                        name: '恢复本（推荐）',
                        file: 'bible-crv-data.json',
                        enabled: true,
                        isPrimary: this.settings.versions.length === 0,
                        installed: true
                    });
                    await this.saveSettings();
                }
            }
        } catch (e) {
            console.error('[Bible] 迁移旧数据失败:', e);
        }
    }

    async syncScannedVersions() {
        const scanned = await this.scanBibleVersions();

        // 先去重：按 key 保留第一个出现的版本
        const deduped = [];
        const seenKeys = new Set();
        for (const ver of this.settings.versions) {
            if (!seenKeys.has(ver.key)) {
                seenKeys.add(ver.key);
                deduped.push(ver);
            }
        }
        this.settings.versions = deduped;

        // 如果没有任何版本，初始化默认版本列表（优先选中恢复本）
        if (this.settings.versions.length === 0) {
            // 按 DEFAULT_VERSIONS 顺序：CRV 优先，CUVS 次之
            for (let i = 0; i < DEFAULT_VERSIONS.length; i++) {
                const dv = DEFAULT_VERSIONS[i];
                const found = scanned.find(s => s.key === dv.key);
                // 第一个找到的版本设为已启用并作为主版本
                this.settings.versions.push({
                    key: dv.key,
                    name: dv.name,
                    file: dv.file,
                    enabled: found ? (i === 0) : false,  // 第一个找到的启用
                    isPrimary: found ? (i === 0) : false,
                    installed: !!found
                });
            }
        }

        // 建立已有版本 Map
        const existingMap = new Map(this.settings.versions.map(v => [v.key, v]));

        // 更新现有版本的 installed 状态（真实反映文件是否存在）
        for (const ver of this.settings.versions) {
            const found = scanned.find(s => s.key === ver.key);
            if (found) {
                ver.installed = true;
                if (!ver.file) ver.file = found.file;
            } else {
                // 文件已被删除，标记为未安装
                ver.installed = false;
                ver.enabled = false;
                ver.isPrimary = false;
            }
        }

        // 添加新扫描到的版本（去重）
        for (const s of scanned) {
            if (!existingMap.has(s.key)) {
                this.settings.versions.push({
                    key: s.key,
                    name: VERSION_MAP[s.key] || s.name,
                    file: s.file,
                    enabled: false,
                    isPrimary: false,
                    installed: true
                });
            }
        }

        // 确保主版本正确
        const firstEnabled = this.settings.versions.find(v => v.enabled && v.installed);
        for (const v of this.settings.versions) v.isPrimary = false;
        if (firstEnabled) firstEnabled.isPrimary = true;

        await this.saveSettings();
    }

    async scanBibleVersions() {
        const versions = [];
        try {
            const pluginId = this.manifest?.id || 'bible-search-reader';
            const pluginDir = `.obsidian/plugins/${pluginId}`;

            if (Platform.isDesktop) {
                const fs = window.require('fs');
                const path = window.require('path');
                let dirPath = '';
                try {
                    const basePath = this.app.vault.adapter.getBasePath();
                    dirPath = path.join(basePath, pluginDir);
                } catch (e) {
                    if (this.manifest && this.manifest.dir) {
                        dirPath = this.manifest.dir;
                    }
                }
                if (dirPath && fs.existsSync(dirPath)) {
                    const files = fs.readdirSync(dirPath);
                    for (const file of files) {
                        const match = file.match(/^bible-([a-z0-9]+)-data\.json$/i);
                        if (match) {
                            const key = match[1].toUpperCase();
                            const name = VERSION_MAP[key] || key;
                            versions.push({ key, name, file, installed: true });
                        }
                    }
                }
            } else {
                if (await this.app.vault.adapter.exists(pluginDir)) {
                    const list = await this.app.vault.adapter.list(pluginDir);
                    for (const file of list.files) {
                        const basename = file.split('/').pop();
                        const match = basename.match(/^bible-([a-z0-9]+)-data\.json$/i);
                        if (match) {
                            const key = match[1].toUpperCase();
                            const name = VERSION_MAP[key] || key;
                            versions.push({ key, name, file: basename, installed: true });
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[Bible] 扫描版本失败:', e);
        }
        return versions;
    }

    async downloadVersionData(versionConfig) {
        const pluginId = this.manifest?.id || 'bible-search-reader';
        const file = versionConfig.file;
        const adapterPath = `.obsidian/plugins/${pluginId}/${file}`;

        const notice = new Notice(`正在下载 ${versionConfig.name}...`, 0);
        const startTime = Date.now();
        try {
            const response = await requestUrl({ url: versionConfig.url, method: 'GET' });
            if (response.status !== 200) {
                throw new Error('HTTP ' + response.status);
            }
            const elapsed = (Date.now() - startTime) / 1000;
            const sizeMB = (response.arrayBuffer.byteLength / 1024 / 1024).toFixed(2);
            const speed = (sizeMB / elapsed).toFixed(2);

            if (Platform.isDesktop) {
                const fs = window.require('fs');
                const path = window.require('path');
                const basePath = this.app.vault.adapter.getBasePath();
                const targetDir = path.join(basePath, '.obsidian', 'plugins', pluginId);
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }
                const targetPath = path.join(targetDir, file);
                fs.writeFileSync(targetPath, Buffer.from(response.arrayBuffer));
            } else {
                const dirPath = `.obsidian/plugins/${pluginId}`;
                if (!(await this.app.vault.adapter.exists(dirPath))) {
                    await this.app.vault.adapter.mkdir(dirPath);
                }
                await this.app.vault.adapter.writeBinary(adapterPath, response.arrayBuffer);
            }

            notice.hide();
            new Notice(`${versionConfig.name} 下载完成！${sizeMB}MB，速度 ${speed}MB/s`, 6000);
        } catch (e) {
            notice.hide();
            throw e;
        }
    }

    async deleteVersionData(versionConfig) {
        try {
            const pluginId = this.manifest?.id || 'bible-search-reader';
            const file = versionConfig.file;
            const adapterPath = `.obsidian/plugins/${pluginId}/${file}`;

            if (Platform.isDesktop) {
                const fs = window.require('fs');
                const path = window.require('path');
                const basePath = this.app.vault.adapter.getBasePath();
                const filePath = path.join(basePath, '.obsidian', 'plugins', pluginId, file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    return true;
                }
            }
            if (await this.app.vault.adapter.exists(adapterPath)) {
                await this.app.vault.adapter.remove(adapterPath);
                return true;
            }
        } catch (e) {
            console.error(`[Bible] 删除版本 ${versionConfig.key} 失败:`, e);
            throw e;
        }
        return false;
    }

    async loadBibleData() {
        try {
            this.allItems = await this.parser.parseAllBooks();
            if (this.searchEngine) this.searchEngine.setItems(this.allItems);
        } catch (e) {
            console.error('[Bible] 加载失败:', e);
            new Notice('加载圣经数据失败，请检查设置: ' + e.message);
        }
    }

    async activateSearchView() {
        const { workspace } = this.app;
        const existing = workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
        if (existing.length > 0) { workspace.revealLeaf(existing[0]); return; }
        const leaf = workspace.getRightLeaf(false);
        if (leaf) {
            await leaf.setViewState({ type: BIBLE_SEARCH_VIEW_TYPE, active: true });
            workspace.revealLeaf(leaf);
        }
    }

    async checkForUpdate(manual = false) {
        try {
            const manifestUrl = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/main/manifest.json';
            const response = await requestUrl({ url: manifestUrl, method: 'GET', timeout: 10000 });
            if (response.status !== 200) {
                if (manual) new Notice('检查更新失败，无法获取版本信息');
                return;
            }
            const remoteManifest = JSON.parse(response.text);
            const currentVersion = this.manifest.version;
            const latestVersion = remoteManifest.version;
            if (this.compareVersion(latestVersion, currentVersion) > 0) {
                if (manual) {
                    new UpdateModal(this.app, latestVersion, CHANGELOG_CONTENT[latestVersion]).open();
                } else {
                    this.showUpdateNotification(latestVersion);
                }
            } else {
                if (manual) new Notice('当前已是最新版本 v' + currentVersion);
            }
        } catch (e) {
            console.error('[Bible] 检查更新失败:', e);
            if (manual) new Notice('检查更新失败：' + e.message);
        }
    }

    showUpdateNotification(latestVersion) {
        const notice = new Notice('', 0);
        const frag = document.createDocumentFragment();
        const wrap = document.createElement('div');
        wrap.style.padding = '8px';
        wrap.style.minWidth = '280px';
        wrap.innerHTML = '<div style="font-weight:600;margin-bottom:6px;">📢 Bible Search and Reader 有新版本</div>' +
            '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">最新版本: v' + latestVersion + ' | 当前版本: v' + this.manifest.version + '</div>';
        const btnWrap = document.createElement('div');
        btnWrap.style.display = 'flex';
        btnWrap.style.gap = '8px';
        const updateBtn = document.createElement('button');
        updateBtn.className = 'mod-cta';
        updateBtn.textContent = '立即更新';
        updateBtn.style.fontSize = '12px';
        updateBtn.style.padding = '4px 12px';
        const laterBtn = document.createElement('button');
        laterBtn.textContent = '稍后';
        laterBtn.style.fontSize = '12px';
        laterBtn.style.padding = '4px 12px';
        btnWrap.appendChild(updateBtn);
        btnWrap.appendChild(laterBtn);
        wrap.appendChild(btnWrap);
        frag.appendChild(wrap);
        notice.setMessage(frag);

        laterBtn.addEventListener('click', () => notice.hide());
        updateBtn.addEventListener('click', async () => {
            notice.hide();
            await this.performUpdate(latestVersion);
        });
    }

    async performUpdate(targetVersion) {
        const notice = new Notice('正在下载更新...', 0);
        const startTime = Date.now();
        try {
            const mainUrl = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/' + targetVersion + '/main.js';
            const mainResp = await requestUrl({ url: mainUrl, method: 'GET' });
            if (mainResp.status !== 200) throw new Error('下载 main.js 失败');

            const manifestUrl = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/' + targetVersion + '/manifest.json';
            const manifestResp = await requestUrl({ url: manifestUrl, method: 'GET' });
            if (manifestResp.status !== 200) throw new Error('下载 manifest.json 失败');

            const stylesUrl = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/' + targetVersion + '/styles.css';
            const stylesResp = await requestUrl({ url: stylesUrl, method: 'GET' });

            const elapsed = (Date.now() - startTime) / 1000;
            const totalBytes = mainResp.arrayBuffer.byteLength + manifestResp.arrayBuffer.byteLength +
                (stylesResp.status === 200 ? stylesResp.arrayBuffer.byteLength : 0);
            const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
            const speed = (totalMB / elapsed).toFixed(2);

            notice.setMessage('下载完成 ' + totalMB + 'MB (' + speed + 'MB/s)，正在安装...');

            const pluginId = this.manifest?.id || 'bible-search-reader';
            const pluginDir = `.obsidian/plugins/${pluginId}`;

            // 使用 vault.adapter 跨平台写入文件
            if (!(await this.app.vault.adapter.exists(pluginDir))) {
                await this.app.vault.adapter.mkdir(pluginDir);
            }

            await this.app.vault.adapter.writeBinary(`${pluginDir}/main.js`, mainResp.arrayBuffer);
            await this.app.vault.adapter.writeBinary(`${pluginDir}/manifest.json`, manifestResp.arrayBuffer);
            if (stylesResp.status === 200) {
                await this.app.vault.adapter.writeBinary(`${pluginDir}/styles.css`, stylesResp.arrayBuffer);
            }

            this.settings.lastVersion = targetVersion;
            await this.saveSettings();

            notice.hide();
            new Notice('更新成功！请重启 Obsidian 以应用新版本。');
            new UpdateModal(this.app, targetVersion, CHANGELOG_CONTENT[targetVersion]).open();
        } catch (e) {
            notice.hide();
            new Notice('更新失败：' + e.message);
            console.error('[Bible] 更新失败:', e);
        }
    }

    compareVersion(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const a = parts1[i] || 0;
            const b = parts2[i] || 0;
            if (a > b) return 1;
            if (a < b) return -1;
        }
        return 0;
    }
}

module.exports = BibleSearchPlugin;
/* nosourcemap */
