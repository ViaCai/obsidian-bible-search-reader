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
// 别名映射（文档中使用约二/约三，但标准简称是约贰/约叁）
BOOK_MAP['约二'] = BOOK_MAP['约贰'];
BOOK_MAP['约三'] = BOOK_MAP['约叁'];
const BOOK_SHORT_NAMES = BIBLE_BOOKS.map(b => b.shortName);
// 加入别名（文档中使用约二/约三，但标准简称是约贰/约叁）
if (BOOK_MAP['约二'] && !BOOK_SHORT_NAMES.includes('约二')) BOOK_SHORT_NAMES.push('约二');
if (BOOK_MAP['约三'] && !BOOK_SHORT_NAMES.includes('约三')) BOOK_SHORT_NAMES.push('约三');
BOOK_SHORT_NAMES.sort((a, b) => b.length - a.length);

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

// ==================== 首次运行引导模态框 ====================
class FirstRunModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.selectedMode = null;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.style.padding = '24px';
        contentEl.style.maxWidth = '640px';

        const header = contentEl.createDiv({ cls: 'bible-first-run-header' });
        header.style.textAlign = 'center';
        header.style.marginBottom = '20px';
        header.createEl('h2', { text: '📖 欢迎使用圣经检索与阅读插件' });
        header.createEl('p', { text: '首次使用，请选择圣经数据来源', cls: 'setting-item-description' });

        const cards = contentEl.createDiv({ cls: 'bible-first-run-cards' });
        cards.style.display = 'flex';
        cards.style.gap = '16px';
        cards.style.marginBottom = '20px';

        const builtinCard = cards.createDiv({ cls: 'bible-mode-card' });
        builtinCard.dataset.mode = 'builtin';
        builtinCard.style.flex = '1';
        builtinCard.style.padding = '16px';
        builtinCard.style.border = '2px solid var(--background-modifier-border)';
        builtinCard.style.borderRadius = '8px';
        builtinCard.style.cursor = 'pointer';
        builtinCard.style.transition = 'all 0.2s';
        builtinCard.createEl('h3', { text: '📦 内置数据模式（推荐）' });
        builtinCard.createEl('p', { text: '1. 需要下载14MB文件，文件较大，对网络要求较高。', cls: 'setting-item-description' });
        builtinCard.createEl('p', { text: '2. 仓库不会增加额外的文件夹和文件。', cls: 'setting-item-description', attr: { style: 'margin-top:4px;' } });
        builtinCard.createEl('p', { text: '3. 不需要设置圣经目录。', cls: 'setting-item-description', attr: { style: 'margin-top:4px;' } });

        const externalCard = cards.createDiv({ cls: 'bible-mode-card' });
        externalCard.dataset.mode = 'external';
        externalCard.style.flex = '1';
        externalCard.style.padding = '16px';
        externalCard.style.border = '2px solid var(--background-modifier-border)';
        externalCard.style.borderRadius = '8px';
        externalCard.style.cursor = 'pointer';
        externalCard.style.transition = 'all 0.2s';
        externalCard.createEl('h3', { text: '📁 外置数据模式' });
        externalCard.createEl('p', { text: '1. 需要下载1.4MB文件，文件较小，网络要求较低。', cls: 'setting-item-description' });
        externalCard.createEl('p', { text: '2. 下载后会自动解压到仓库并配置默认目录，会在仓库新建圣经文档，内含66个圣经文档。', cls: 'setting-item-description', attr: { style: 'margin-top:4px;' } });
        externalCard.createEl('p', { text: '3. 若圣经文档被移动，则需要手动修改插件设置里的圣经目录。', cls: 'setting-item-description', attr: { style: 'margin-top:4px;' } });
        if (!Platform.isDesktop) {
            externalCard.createEl('p', { text: '⚠️ 移动端暂不支持自动下载解压，请手动下载 ZIP 后解压到 Vault。', cls: 'setting-item-description', attr: { style: 'margin-top:4px;color:var(--text-error);' } });
        }

        const selectCard = (mode) => {
            this.selectedMode = mode;
            builtinCard.style.borderColor = mode === 'builtin' ? 'var(--bible-accent)' : 'var(--background-modifier-border)';
            builtinCard.style.background = mode === 'builtin' ? 'rgba(78,205,196,0.08)' : '';
            externalCard.style.borderColor = mode === 'external' ? 'var(--bible-accent)' : 'var(--background-modifier-border)';
            externalCard.style.background = mode === 'external' ? 'rgba(78,205,196,0.08)' : '';
            confirmBtn.disabled = false;
        };
        builtinCard.addEventListener('click', () => selectCard('builtin'));
        externalCard.addEventListener('click', () => selectCard('external'));

        const btnWrap = contentEl.createDiv();
        btnWrap.style.textAlign = 'center';
        const confirmBtn = btnWrap.createEl('button', { cls: 'mod-cta', text: '确认选择' });
        confirmBtn.disabled = true;
        confirmBtn.style.marginRight = '8px';
        const cancelBtn = btnWrap.createEl('button', { text: '稍后再说' });
        cancelBtn.addEventListener('click', () => this.close());

        confirmBtn.addEventListener('click', async () => {
            confirmBtn.disabled = true;
            confirmBtn.setText('检查数据中...');

            // 先设置数据源模式
            this.plugin.settings.dataSource = this.selectedMode;
            await this.plugin.saveSettings();

            // 检查是否已有数据
            let hasData = false;
            if (this.selectedMode === 'builtin') {
                const info = await this.plugin.getBuiltinDataInfo();
                hasData = info.available;
            } else {
                const oldFolder = this.plugin.app.vault.getAbstractFileByPath(this.plugin.settings.oldTestamentPath);
                const newFolder = this.plugin.app.vault.getAbstractFileByPath(this.plugin.settings.newTestamentPath);
                hasData = !!(oldFolder && newFolder);
            }

            if (hasData) {
                // 已有数据，直接打开
                this.plugin.settings.hasSetup = true;
                await this.plugin.saveSettings();
                await this.plugin.loadBibleData();
                this.plugin.activateSearchView();
                this.close();
                return;
            }

            // 无数据，询问用户
            confirmBtn.style.display = 'none';
            cancelBtn.style.display = 'none';

            // 禁用模式选择卡片，避免用户在此阶段误操作切换模式
            builtinCard.style.pointerEvents = 'none';
            builtinCard.style.opacity = '0.5';
            externalCard.style.pointerEvents = 'none';
            externalCard.style.opacity = '0.5';

            // 显示当前已选模式的提示
            const modeTip = contentEl.createEl('div', {
                cls: 'setting-item-description',
                attr: { style: 'text-align:center;margin-bottom:12px;padding:8px;background:var(--background-secondary);border-radius:6px;' }
            });
            modeTip.setText('当前模式：' + (this.selectedMode === 'builtin' ? '内置数据模式' : '外置数据模式') + '（如需切换请关闭窗口重新选择）');

            const askWrap = contentEl.createDiv();
            askWrap.style.textAlign = 'center';
            askWrap.style.marginTop = '16px';
            askWrap.createEl('p', { text: '未找到对应的圣经数据，您是否需要下载？', cls: 'setting-item-description', attr: { style: 'margin-bottom:12px;' } });

            const haveDataBtn = askWrap.createEl('button', { cls: 'mod-cta', text: '我已有数据，不需下载' });
            haveDataBtn.style.marginRight = '8px';
            const downloadBtn = askWrap.createEl('button', { cls: 'mod-cta', text: '我没有数据，请帮我下载' });

            haveDataBtn.addEventListener('click', async () => {
                haveDataBtn.disabled = true;
                downloadBtn.disabled = true;
                haveDataBtn.setText('检查中...');

                // 再次检查数据
                let found = false;
                if (this.selectedMode === 'builtin') {
                    const info = await this.plugin.getBuiltinDataInfo();
                    found = info.available;
                } else {
                    const oldFolder = this.plugin.app.vault.getAbstractFileByPath(this.plugin.settings.oldTestamentPath);
                    const newFolder = this.plugin.app.vault.getAbstractFileByPath(this.plugin.settings.newTestamentPath);
                    found = !!(oldFolder && newFolder);
                }

                if (found) {
                    this.plugin.settings.hasSetup = true;
                    await this.plugin.saveSettings();
                    await this.plugin.loadBibleData();
                    this.plugin.activateSearchView();
                    this.close();
                } else {
                    askWrap.empty();
                    askWrap.createEl('p', { text: '仍未找到圣经数据，是否需要下载？', cls: 'setting-item-description', attr: { style: 'margin-bottom:12px;color:var(--text-error);' } });
                    const yesBtn = askWrap.createEl('button', { cls: 'mod-cta', text: '是，帮我下载' });
                    yesBtn.style.marginRight = '8px';
                    const noBtn = askWrap.createEl('button', { text: '否，稍后处理' });

                    yesBtn.addEventListener('click', async () => {
                        yesBtn.disabled = true;
                        noBtn.disabled = true;
                        yesBtn.setText('下载中...');
                        try {
                            if (this.selectedMode === 'builtin') {
                                await this.plugin.downloadBuiltinData();
                            } else {
                                await this.plugin.downloadAndExtractBible(BIBLE_DOCUMENTS_URL);
                            }
                            this.plugin.settings.hasSetup = true;
                            await this.plugin.saveSettings();
                            await this.plugin.loadBibleData();
                            this.plugin.activateSearchView();
                            this.close();
                        } catch (e) {
                            new Notice('下载失败：' + e.message);
                            yesBtn.disabled = false;
                            yesBtn.setText('是，帮我下载');
                        }
                    });

                    noBtn.addEventListener('click', async () => {
                        this.plugin.settings.hasSetup = true;
                        await this.plugin.saveSettings();
                        await this.plugin.loadBibleData();
                        this.plugin.activateSearchView();
                        this.close();
                        new Notice('未找到圣经数据，请到设置里配置正确后，才能使用。', 5000);
                    });
                }
            });

            downloadBtn.addEventListener('click', async () => {
                haveDataBtn.disabled = true;
                downloadBtn.disabled = true;
                if (this.selectedMode === 'builtin') {
                    downloadBtn.setText('下载中...');
                    try {
                        await this.plugin.downloadBuiltinData();
                        this.plugin.settings.hasSetup = true;
                        await this.plugin.saveSettings();
                        await this.plugin.loadBibleData();
                        this.plugin.activateSearchView();
                        this.close();
                    } catch (e) {
                        new Notice('下载失败：' + e.message);
                        haveDataBtn.disabled = false;
                        downloadBtn.disabled = false;
                        downloadBtn.setText('我没有数据，请帮我下载');
                    }
                } else {
                    if (!Platform.isDesktop) {
                        new Notice('移动端暂不支持自动下载解压外置数据。请从 Release 页面下载 bible-documents.zip，解压到 Vault 后点击「我已有数据」。', 10000);
                        haveDataBtn.disabled = false;
                        downloadBtn.disabled = false;
                        downloadBtn.setText('我没有数据，请帮我下载');
                        return;
                    }
                    downloadBtn.setText('下载中...');
                    try {
                        await this.plugin.downloadAndExtractBible(BIBLE_DOCUMENTS_URL);
                        this.plugin.settings.hasSetup = true;
                        await this.plugin.saveSettings();
                        await this.plugin.loadBibleData();
                        this.plugin.activateSearchView();
                        this.close();
                    } catch (e) {
                        new Notice('下载失败：' + e.message);
                        haveDataBtn.disabled = false;
                        downloadBtn.disabled = false;
                        downloadBtn.setText('我没有数据，请帮我下载');
                    }
                }
            });
        });
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// ==================== 更新日志模态框 ====================
const CHANGELOG_CONTENT = {
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
            if (trimmed.startsWith('## ')) {
                body.createEl('h3', { text: trimmed.replace('## ', '') });
            } else if (trimmed.startsWith('### ')) {
                body.createEl('h4', { text: trimmed.replace('### ', ''), attr: { style: 'color:var(--bible-accent);margin-top:12px;' } });
            } else if (trimmed.startsWith('- ')) {
                body.createEl('div', { text: '• ' + trimmed.replace('- ', ''), attr: { style: 'margin-left:12px;margin-bottom:4px;' } });
            } else if (trimmed) {
                body.createEl('div', { text: trimmed });
            }
        }

        const btnWrap = contentEl.createDiv();
        btnWrap.style.textAlign = 'center';
        btnWrap.style.marginTop = '20px';
        const okBtn = btnWrap.createEl('button', { cls: 'mod-cta', text: '知道了' });
        okBtn.addEventListener('click', () => this.close());
    }
    onClose() {
        this.contentEl.empty();
    }
}

// ==================== 设置标签页 ====================
const BIBLE_DATA_URL = 'https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/bible-data.json';
const BIBLE_DOCUMENTS_URL = 'https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/2.0.0/bible-documents.zip';

class BibleSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: '圣经检索与阅读设置' });

        containerEl.createEl('h3', { text: '数据源', cls: 'setting-item-name' });
        containerEl.createEl('div', { cls: 'setting-item-description', text: '选择圣经数据的来源方式' });

        const modeDesc = containerEl.createEl('div', { cls: 'setting-item' });
        modeDesc.style.padding = '12px 18px';
        modeDesc.style.background = 'var(--background-secondary)';
        modeDesc.style.borderRadius = '6px';
        modeDesc.style.marginBottom = '12px';
        modeDesc.style.fontSize = '13px';
        modeDesc.style.lineHeight = '1.8';
        modeDesc.style.color = 'var(--text-muted)';
        if (this.plugin.settings.dataSource === 'builtin') {
            modeDesc.setText('内置数据：需要下载 14MB 文件，文件较大，对网络要求较高，仓库不会有额外的文件增加，也不需要设置圣经所在的目录。');
        } else {
            modeDesc.setText('外置数据：需要下载 1.4MB 文件，文件较小，对网络要求较低，下载好后会自动解压，在仓库里生成对应的文件夹和 66 个圣经文档，作为数据源，并且会自动填写默认的圣经目录。若圣经文档被移动，则需要手动修改插件设置里的圣经目录。');
        }

        new Setting(containerEl)
            .setName('使用内置数据（推荐）')
            .setDesc('开启后使用内置 bible-data.json，关闭则使用外置 Markdown 文档。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.dataSource === 'builtin')
                .onChange(async (value) => {
                    this.plugin.settings.dataSource = value ? 'builtin' : 'external';
                    await this.plugin.saveSettings();
                    this.display();
                    await this.plugin.loadBibleData();
                }));

        if (this.plugin.settings.dataSource === 'builtin') {
            const builtinStatus = containerEl.createEl('div', { cls: 'setting-item' });
            builtinStatus.style.padding = '12px 18px';
            builtinStatus.style.background = 'var(--background-secondary)';
            builtinStatus.style.borderRadius = '6px';
            builtinStatus.style.marginBottom = '16px';
            const statusLabel = builtinStatus.createEl('div', { cls: 'setting-item-name', text: '内置数据状态' });
            statusLabel.style.marginBottom = '6px';
            const statusContent = builtinStatus.createDiv();
            statusContent.style.whiteSpace = 'pre-wrap';
            statusContent.style.lineHeight = '1.6';

            this.plugin.getBuiltinDataInfo().then(builtinInfo => {
                statusContent.empty();
                if (builtinInfo.available && builtinInfo.foundItems.length > 0) {
                    for (const item of builtinInfo.foundItems) {
                        const itemEl = statusContent.createDiv();
                        itemEl.style.padding = '8px 0';
                        itemEl.style.borderBottom = '1px solid var(--background-modifier-border)';
                        const infoText = itemEl.createEl('div', {
                            text: '✅ ' + item.bookCount + ' 卷，' + item.itemCount + ' 条数据'
                        });
                        infoText.style.color = 'var(--interactive-success)';
                        const pathText = itemEl.createEl('div', {
                            text: '📁 ' + item.path,
                            cls: 'setting-item-description'
                        });
                        pathText.style.fontSize = '11px';
                        pathText.style.marginTop = '2px';
                        const delBtn = itemEl.createEl('button', { text: '🗑️ 删除此数据' });
                        delBtn.style.marginTop = '4px';
                        delBtn.style.fontSize = '11px';
                        delBtn.style.padding = '2px 8px';
                        delBtn.addEventListener('click', async () => {
                            if (confirm('确定要删除 ' + item.path + ' 吗？')) {
                                try {
                                    await this.plugin.deleteBuiltinData(item.path);
                                    new Notice('已删除: ' + item.path);
                                    this.display();
                                } catch (e) {
                                    new Notice('删除失败: ' + e.message);
                                }
                            }
                        });
                    }
                    if (builtinInfo.foundItems.length > 1) {
                        const warnEl = statusContent.createEl('div', {
                            text: '⚠️ 发现 ' + builtinInfo.foundItems.length + ' 处数据，建议只保留一处'
                        });
                        warnEl.style.color = 'var(--text-error)';
                        warnEl.style.marginTop = '8px';
                        warnEl.style.fontSize = '12px';
                    }
                } else {
                    const pluginId = this.plugin.manifest?.id || 'bible-search-reader';
                    const msg = '❌ 未找到内置数据文件（bible-data.json）。\n请将文件放在以下位置：\n  · .obsidian/plugins/' + pluginId + '/bible-data.json\n或点击下方按钮下载。';
                    const statusText = statusContent.createEl('div', { text: msg });
                    statusText.style.color = 'var(--text-error)';
                }
            });
            new Setting(containerEl)
                .setName('下载内置数据')
                .setDesc('从 GitHub 下载 bible-data.json（约 14MB）到插件目录。')
                .addButton(button => {
                    const btn = button.setButtonText('⬇️ 下载 bible-data.json').setCta();
                    btn.onClick(async () => {
                        btn.buttonEl.setAttribute('disabled', 'true');
                        btn.setButtonText('下载中...');
                        try {
                            await this.plugin.downloadBuiltinData();
                            new Notice('内置数据下载完成！');
                        } catch (e) {
                            new Notice('下载失败：' + e.message);
                        }
                        btn.buttonEl.removeAttribute('disabled');
                        btn.setButtonText('⬇️ 下载 bible-data.json');
                        this.display();
                        await this.plugin.loadBibleData();
                    });
                });
        } else {
            new Setting(containerEl)
                .setName('旧约圣经目录')
                .setDesc('旧约圣经 Markdown 文档所在的文件夹路径（如：圣经/旧约）')
                .addText(text => text
                    .setPlaceholder('圣经/旧约')
                    .setValue(this.plugin.settings.oldTestamentPath)
                    .onChange(async (value) => {
                        this.plugin.settings.oldTestamentPath = value;
                        await this.plugin.saveSettings();
                        await this.plugin.loadBibleData();
                    }));
            new Setting(containerEl)
                .setName('新约圣经目录')
                .setDesc('新约圣经 Markdown 文档所在的文件夹路径（如：圣经/新约）')
                .addText(text => text
                    .setPlaceholder('圣经/新约')
                    .setValue(this.plugin.settings.newTestamentPath)
                    .onChange(async (value) => {
                        this.plugin.settings.newTestamentPath = value;
                        await this.plugin.saveSettings();
                        await this.plugin.loadBibleData();
                    }));

            new Setting(containerEl)
                .setName('下载圣经/模板文档')
                .setDesc(Platform.isDesktop ? '自动从 GitHub 下载圣经文档并解压到 vault 根目录，同时自动配置路径。' : '移动端请手动下载 ZIP 文件并解压到 Vault，然后配置下方目录路径。')
                .addButton(button => {
                    const btn = button.setButtonText(Platform.isDesktop ? '⬇️ 下载并解压' : '📱 移动端手动指南').setCta();
                    btn.onClick(async () => {
                        if (!Platform.isDesktop) {
                            new Notice('请从 Release 页面下载 bible-documents.zip，解压到 Vault 根目录（生成 圣经/旧约 和 圣经/新约 文件夹），然后在下方填写对应路径。', 10000);
                            return;
                        }
                        btn.buttonEl.setAttribute('disabled', 'true');
                        btn.setButtonText('下载中...');
                        try {
                            await this.plugin.downloadAndExtractBible(BIBLE_DOCUMENTS_URL);
                            new Notice('圣经文档下载并解压成功，路径已自动配置');
                        } catch (e) {
                            new Notice('下载失败：' + e.message);
                            console.error('[Bible] 下载失败:', e);
                        }
                        btn.buttonEl.removeAttribute('disabled');
                        btn.setButtonText('⬇️ 下载并解压');
                        this.display();
                    });
                });
        }

        containerEl.createEl('h3', { text: '更新', cls: 'setting-item-name', attr: { style: 'margin-top:24px;' } });
        new Setting(containerEl)
            .setName('自动检测更新')
            .setDesc('启动时自动检测是否有新版本，并在右上角弹出更新提示。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoCheckUpdate)
                .onChange(async (value) => {
                    this.plugin.settings.autoCheckUpdate = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('立即检查更新')
            .setDesc('手动检查是否有新版本可用。')
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

// ==================== 圣经解析器（带原文顺序索引）====================
class BibleParser {
    constructor(app, settings, pluginDir) {
        this.app = app;
        this.settings = settings;
        this.pluginDir = pluginDir;
    }

    async parseAllBooks() {
        console.log('[Bible] 开始解析圣经数据...');
        let items = [];

        if (this.settings.dataSource === 'builtin') {
            items = await this.parseBuiltinData();
        } else {
            items = await this.parseExternalBooks();
        }

        console.log('[Bible] 解析完成，共 ' + items.length + ' 条数据');
        return items;
    }

    async parseBuiltinData() {
        const items = [];
        try {
            const pluginId = 'bible-search-reader';
            const adapterPath = `.obsidian/plugins/${pluginId}/bible-data.json`;
            // 1. 检查 Vault adapter 插件目录（统一位置）
            if (await this.app.vault.adapter.exists(adapterPath)) {
                const raw = await this.app.vault.adapter.read(adapterPath);
                const data = JSON.parse(raw);
                if (Array.isArray(data)) {
                    for (const item of data) { items.push(item); }
                    console.log('[Bible] 内置数据加载成功 (Adapter):', items.length, '条');
                    return items;
                }
            }
            // 2. 桌面端 fs 路径（兼容旧数据）
            if (Platform.isDesktop) {
                const fs = window.require('fs');
                const path = window.require('path');
                const possiblePaths = [];
                if (this.pluginDir) {
                    possiblePaths.push(path.join(this.pluginDir, 'bible-data.json'));
                }
                try {
                    const basePath = this.app.vault.adapter.getBasePath();
                    possiblePaths.push(path.join(basePath, '.obsidian', 'plugins', pluginId, 'bible-data.json'));
                } catch (e) {}
                for (const dataPath of possiblePaths) {
                    if (fs.existsSync(dataPath)) {
                        const raw = fs.readFileSync(dataPath, 'utf-8');
                        const data = JSON.parse(raw);
                        if (Array.isArray(data)) {
                            for (const item of data) { items.push(item); }
                            console.log('[Bible] 内置数据加载成功 (fs):', items.length, '条');
                            return items;
                        }
                    }
                }
            }
            console.warn('[Bible] 未找到内置数据文件，路径:', adapterPath);
        } catch (e) {
            console.error('[Bible] 读取内置数据失败:', e);
        }
        return items;
    }

    async parseExternalBooks() {
        const items = [];
        const vault = this.app.vault;

        const oldFolder = vault.getAbstractFileByPath(this.settings.oldTestamentPath);
        if (oldFolder && oldFolder instanceof TFolder) {
            for (const file of oldFolder.children) {
                if (file instanceof TFile && file.extension === 'md') {
                    console.log('[Bible] 解析旧约文件:', file.path);
                    const content = await vault.read(file);
                    const parsed = this.parseBookContent(content, file.basename, 'old');
                    items.push(...parsed);
                }
            }
        }

        const newFolder = vault.getAbstractFileByPath(this.settings.newTestamentPath);
        if (newFolder && newFolder instanceof TFolder) {
            for (const file of newFolder.children) {
                if (file instanceof TFile && file.extension === 'md') {
                    console.log('[Bible] 解析新约文件:', file.path);
                    const content = await vault.read(file);
                    const parsed = this.parseBookContent(content, file.basename, 'new');
                    items.push(...parsed);
                }
            }
        }
        return items;
    }

    parseBookContent(content, fileName, testament) {
        const items = [];
        const lines = content.split('\n');
        const fileBaseName = fileName;

        const numMatch = fileName.match(/^\d+[.\s]*(.+)$/);
        let bookInfo = null;

        if (numMatch) {
            const id = parseInt(fileName.match(/^(\d+)/)[1]);
            bookInfo = BOOK_ID_MAP[id];
        }

        if (!bookInfo) {
            // 先精确匹配 fullName
            for (const book of BIBLE_BOOKS) {
                if (fileName.includes(book.fullName)) {
                    bookInfo = book;
                    break;
                }
            }
        }
        if (!bookInfo) {
            // 再按 shortName 长度降序匹配，避免"约"先匹配到约翰福音，"撒"先匹配到撒母耳记上
            const sortedByLength = [...BIBLE_BOOKS].sort((a, b) => b.shortName.length - a.shortName.length);
            for (const book of sortedByLength) {
                if (fileName.includes(book.shortName)) {
                    bookInfo = book;
                    break;
                }
            }
        }

        if (!bookInfo) {
            console.warn('[Bible] 无法识别书卷: ' + fileName);
            return items;
        }

        console.log('[Bible] 识别书卷: ' + bookInfo.fullName);

        let currentChapter = 0;
        let lineIndex = 0;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) { lineIndex++; continue; }

            const themeMatch = trimmed.match(/^>\s*\*\*主题[：:](.+)\*\*$/);
            if (themeMatch) {
                items.push({
                    type: 'theme', bookId: bookInfo.id, bookShortName: bookInfo.shortName,
                    bookFullName: bookInfo.fullName, testament: bookInfo.testament,
                    chapter: currentChapter, verse: 0, lineIndex: lineIndex,
                    content: themeMatch[1].trim(), rawLine: trimmed
                });
                lineIndex++;
                continue;
            }

            if (trimmed.startsWith('>')) {
                // 精确区分主题和纲目：主题格式为 > **主题：...**
                const isTheme = /^>\s*\*\*主题[：:].+\*\*\s*$/.test(trimmed);
                if (!isTheme) {
                    const outlineContent = trimmed.replace(/^>\s*/, '').trim();
                    if (outlineContent) {
                        items.push({
                            type: 'outline', bookId: bookInfo.id, bookShortName: bookInfo.shortName,
                            bookFullName: bookInfo.fullName, testament: bookInfo.testament,
                            chapter: currentChapter, verse: 0, lineIndex: lineIndex,
                            content: outlineContent, rawLine: trimmed
                        });
                    }
                    lineIndex++;
                    continue;
                }
            }

            const chapterMatch = trimmed.match(/^#+\s*(?:.*第)?([\d一二三四五六七八九十百零]+)章?.*$/);
            if (chapterMatch && trimmed.length < 50) {
                const ch = parseNumber(chapterMatch[1]);
                if (!isNaN(ch) && ch > 0 && ch <= 200) {
                    currentChapter = ch;
                }
                lineIndex++;
                continue;
            }

            // 统一经文解析：按书卷简称长度降序匹配，确保"约壹"优先于"约"
            let verseMatched = false;
            for (const sn of BOOK_SHORT_NAMES) {
                if (trimmed.startsWith(sn)) {
                    const after = trimmed.slice(sn.length);
                    const m = after.match(/^(\d+)[：:](\d+)\s*(.*)$/);
                    if (m) {
                        const chapter = parseInt(m[1]);
                        const verse = parseInt(m[2]);
                        const verseContent = m[3].trim();
                        const matchedBook = BOOK_MAP[sn];
                        if (matchedBook && matchedBook.id === bookInfo.id) {
                            currentChapter = chapter;
                            items.push({
                                type: 'verse', bookId: bookInfo.id, bookShortName: bookInfo.shortName,
                                bookFullName: bookInfo.fullName, testament: bookInfo.testament,
                                chapter: chapter, verse: verse, lineIndex: lineIndex,
                                content: verseContent, rawLine: trimmed
                            });
                        }
                        verseMatched = true;
                        break;
                    }
                }
            }
            if (verseMatched) {
                lineIndex++;
                continue;
            }

            lineIndex++;
        }

        console.log('[Bible] ' + bookInfo.fullName + ' 解析完成: ' + items.length + ' 条');
        return items;
    }
}

// ==================== 检索引擎 ====================
class BibleSearchEngine {
    constructor() { this.items = []; }
    setItems(items) { this.items = items; }

    search(query, types, range, bookIds) {
        if (!query.trim()) return [];
        const parsed = this.parseQuery(query);
        const refs = parsed.refs;
        const keywords = parsed.keywords;
        const keywordMode = parsed.keywordMode || 'and';

        const results = [];
        const seen = new Set();

        for (const item of this.items) {
            if (!types.includes(item.type)) continue;
            if (range === 'old' && item.testament !== 'old') continue;
            if (range === 'new' && item.testament !== 'new') continue;
            if (range === 'single' && bookIds && bookIds.length > 0 && !bookIds.includes(item.bookId)) continue;
            if (range === 'multi' && bookIds && bookIds.length > 0 && !bookIds.includes(item.bookId)) continue;

            let matched = false;
            let refIndex = -1; // 记录匹配的是第几个引用，用于按输入顺序排序

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
                    // OR 模式：包含任意一个关键词
                    matched = matched || keywords.some(k => contentLower.includes(k.toLowerCase()));
                } else if (keywordMode === 'and_ordered') {
                    // AND + 顺序：同时包含，且按输入顺序出现
                    let lastIndex = -1;
                    let allFound = true;
                    for (const kw of keywords) {
                        const idx = contentLower.indexOf(kw.toLowerCase(), lastIndex + 1);
                        if (idx === -1) { allFound = false; break; }
                        lastIndex = idx;
                    }
                    if (allFound) matched = true;
                } else {
                    // AND 模式（默认）：同时包含，忽略顺序
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

        // 经文引用检索：按输入顺序排序（_refIndex 从小到大，相同则保持原文顺序）
        if (refs.length > 0) {
            results.sort((a, b) => {
                const aIdx = a._refIndex;
                const bIdx = b._refIndex;
                if (aIdx !== -1 && bIdx !== -1 && aIdx !== bIdx) return aIdx - bIdx;
                // 相同 refIndex 或纯关键词匹配时，按原文 lineIndex 排序
                return a.item.lineIndex - b.item.lineIndex;
            });
        }

        // OR_ordered 模式：按关键词顺序排序结果
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

        // 纯关键词检索（无经文引用）：按圣经书卷顺序排序
        if (refs.length === 0 && keywords.length > 0 && keywordMode !== 'or_ordered') {
            results.sort((a, b) => {
                const ia = a.item, ib = b.item;
                if (ia.bookId !== ib.bookId) return ia.bookId - ib.bookId;
                if (ia.chapter !== ib.chapter) return ia.chapter - ib.chapter;
                if (ia.verse !== ib.verse) return ia.verse - ib.verse;
                return ia.lineIndex - ib.lineIndex;
            });
        }

        // 清理内部排序字段
        for (const r of results) { delete r._refIndex; }

        return results;
    }

    parseQuery(query) {
        const refs = [];
        const keywords = [];

        // 统一标点符号（保留原始分隔符信息用于判断模式）
        const normalizedQuery = query.replace(/[～~]/g, '-').replace(/[：:]/g, ':');

        // 判断关键词匹配模式
        let keywordMode = 'and'; // 默认：空格/顿号 = AND，忽略顺序
        if (/[,，]/.test(query) && !/[；;。.]/.test(query)) {
            keywordMode = 'and_ordered'; // 逗号 = AND，不忽略顺序
        } else if (/[；;]/.test(query) && !/[。.]/.test(query)) {
            keywordMode = 'or_ordered'; // 分号 = OR，按关键词顺序展示
        } else if (/[。.]/.test(query)) {
            keywordMode = 'or'; // 句号 = OR，按经文顺序展示
        }

        // 按所有分隔符分割成 tokens（逗号、顿号、分号、句号、空格）
        const tokens = normalizedQuery.split(/[,，、；;\s。\.]+/).map(t => t.trim()).filter(t => t.length > 0);

        let currentBookId = null;
        let currentChapter = 1;

        for (const token of tokens) {
            let matched = false;

            // 1. 尝试作为带书卷的完整引用
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

            // 2. 尝试作为延续引用（基于上一个书卷）
            if (currentBookId !== null) {
                const contParsed = this.parseContinuationReference(token, currentBookId, currentChapter);
                if (contParsed.length > 0) {
                    refs.push(...contParsed);
                    currentChapter = contParsed[0].startChapter;
                    matched = true;
                }
            }
            if (matched) continue;

            // 3. 作为关键词
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

        // 处理范围分隔符（支持 ~ 和 -）
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
        // 格式1: 阿拉伯数字:阿拉伯数字，如 "1:1", "2:5"
        let match = s.match(/^(\d+):(\d+)$/);
        if (match) {
            const ch = parseInt(match[1]);
            const vs = parseInt(match[2]);
            if (ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        // 格式2: 中文数字:阿拉伯数字，如 "一:1", "十一:2"
        match = s.match(/^([一二三四五六七八九十百零]+):(\d+)$/);
        if (match) {
            const ch = chineseToNumber(match[1]);
            const vs = parseInt(match[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        // 格式3: 中文数字+阿拉伯数字（无冒号），如 "一1", "十一2"
        match = s.match(/^([一二三四五六七八九十百零]+)(\d+)$/);
        if (match) {
            const ch = chineseToNumber(match[1]);
            const vs = parseInt(match[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        // 格式4: 阿拉伯数字+中文数字（无冒号），如 "1一"
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

        // 格式1: chapter:verse-range，如 "14:7-21", "2:9-10"
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

        // 格式2: chapter:verse，如 "2:3", "3:34"
        m = token.match(/^([一二三四五六七八九十百零\d]+):(\d+)$/);
        if (m) {
            const ch = parseNumber(m[1]);
            const vs = parseInt(m[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: vs });
                return ranges;
            }
        }

        // 格式3: 中文章+数字节-range，如 "十四7-21", "二一9-10"
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

        // 格式4: 中文章+数字节，如 "三34", "二一9", "二二13", "十四7"
        m = token.match(/^([一二三四五六七八九十百零]+)(\d+)$/);
        if (m) {
            const ch = chineseToNumber(m[1]);
            const vs = parseInt(m[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: vs });
                return ranges;
            }
        }

        // 格式5: 纯数字节号（同章），如 "23", "4", "9"
        m = token.match(/^(\d+)$/);
        if (m) {
            const vs = parseInt(m[1]);
            if (vs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: vs });
                return ranges;
            }
        }

        // 格式6: 纯中文数字节号（同章），如 "二十三", "四"
        m = token.match(/^([一二三四五六七八九十百零]+)$/);
        if (m) {
            const vs = chineseToNumber(m[1]);
            if (!isNaN(vs) && vs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: vs });
                return ranges;
            }
        }

        // 格式7: 纯数字节范围（同章），如 "7-21", "13-15"
        m = token.match(/^(\d+)-(\d+)$/);
        if (m) {
            const vs = parseInt(m[1]);
            const endVs = parseInt(m[2]);
            if (vs > 0 && endVs > 0) {
                ranges.push({ bookId: bookId, startChapter: currentChapter, startVerse: vs, endChapter: currentChapter, endVerse: endVs });
                return ranges;
            }
        }

        // 格式8: 纯中文数字节范围（同章），如 "七-二十一"
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
class BibleProjectionOverlay {
    constructor(app, results, mode, showSource) {
        this.app = app;
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
            for (const r of selected) this.slides.push({ items: [r.item] });
        } else if (this.mode === 'parallel') {
            this.slides.push({ items: selected.map(r => r.item) });
        } else if (this.mode === 'mixed') {
            let currentGroup = [];
            for (const r of selected) {
                currentGroup.push(r.item);
                if (!r.sideBySide) {
                    this.slides.push({ items: [...currentGroup] });
                    currentGroup = [];
                }
            }
            if (currentGroup.length > 0) this.slides.push({ items: currentGroup });
        }
    }

    open() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'bible-projection-fullscreen';
        this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;display:flex;flex-direction:column;background:#1a1a2e;color:#fff;';

        // 顶部：模式 | 快捷键说明 | 页码
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

        // 底部：翻页 + 操作按钮（同一行）
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
            const item = slide.items[0];
            // 阅读模式（showSource=false）下，theme/outline 不显示出处
            const shouldShowRef = this.showSource || item.type === 'verse';
            if (shouldShowRef) {
                const refDiv = wrapper.createEl('div', { cls: 'bible-proj-ref bible-proj-focus-ref', text: this.getItemRef(item) });
                refDiv.style.marginBottom = '20px';
                if (item.type === 'theme') {
                    refDiv.classList.add('bible-proj-focus-theme-ref');
                } else if (item.type === 'outline') {
                    refDiv.classList.add('bible-proj-focus-outline-ref');
                }
            }
            const textDiv = wrapper.createEl('div', { cls: 'bible-proj-text bible-proj-focus-text', text: this.getItemContent(item) });
            textDiv.style.lineHeight = '1.8';
            if (item.type === 'theme') {
                textDiv.classList.add('bible-proj-focus-theme');
            } else if (item.type === 'outline') {
                textDiv.classList.add('bible-proj-focus-outline');
            }
        } else {
            wrapper.style.textAlign = this.isCentered ? 'center' : 'left';
            for (const item of slide.items) {
                const itemEl = document.createElement('div');
                // 根据类型设置不同的样式：经文保留背景框，主题和纲目去掉背景框
                if (item.type === 'verse') {
                    itemEl.classList.add('bible-proj-verse-box');
                } else if (item.type === 'theme') {
                    itemEl.classList.add('bible-proj-theme-box');
                    itemEl.classList.add('bible-proj-parallel-theme');
                } else if (item.type === 'outline') {
                    itemEl.classList.add('bible-proj-outline-box');
                    itemEl.classList.add('bible-proj-parallel-outline');
                }
                const shouldShowRef = this.showSource || item.type === 'verse';
                if (shouldShowRef) {
                    const pRef = itemEl.createEl('div', { cls: 'bible-proj-ref bible-proj-parallel-ref', text: this.getItemRef(item) });
                    pRef.style.marginBottom = '8px';
                    pRef.style.fontWeight = '600';
                    if (item.type === 'theme') {
                        pRef.classList.add('bible-proj-parallel-theme-ref');
                    } else if (item.type === 'outline') {
                        pRef.classList.add('bible-proj-parallel-outline-ref');
                    }
                }
                const pText = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-parallel-text', text: this.getItemContent(item) });
                pText.style.lineHeight = '1.7';
                if (item.type === 'theme') {
                    pText.classList.add('bible-proj-parallel-theme-text');
                } else if (item.type === 'outline') {
                    pText.classList.add('bible-proj-parallel-outline-text');
                }
                wrapper.appendChild(itemEl);
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
        // 主题字体大小（比经文大15%）
        this.overlay.querySelectorAll('.bible-proj-focus-theme').forEach(el => { el.style.fontSize = (this.fontSize * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-theme-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline').forEach(el => { el.style.fontSize = (this.fontSize * 0.95) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-theme-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85 * 1.15) + 'px'; });
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
        if (item.type === 'theme') return item.bookFullName + ' 主题';
        if (item.type === 'outline') return item.bookFullName + ' 纲目';
        return item.bookShortName + item.chapter + ':' + item.verse;
    }

    getItemContent(item) {
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

// ==================== 侧边栏圣经视图（选项卡：搜索 + 阅读）====================
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
    }
    getViewType() { return BIBLE_SEARCH_VIEW_TYPE; }
    getDisplayText() { return '圣经检索'; }
    getIcon() { return 'book-plus'; }

    async onOpen() {
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
        this.focusModeBtn = tabBar.createEl('button', { cls: 'bible-focus-mode-btn', text: '专注模式' });
        this.focusModeBtn.addEventListener('click', () => this.toggleFocusMode());
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

    buildSearchTab() {
        this.searchPanel = this.container.createDiv({ cls: 'bible-tab-panel' });

        // 固定顶部区域
        const fixedTop = this.searchPanel.createDiv({ cls: 'bible-search-fixed-top' });
        this.searchFixedTop = fixedTop;

        // 检索范围
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

        // 输入框
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
            this.currentPage = 0;
            this.keywords = [];
            if (this.resultsContainer) {
                this.resultsContainer.empty();
                this.resultsContainer.createEl('div', { cls: 'bible-empty-state', text: '请输入检索内容后点击查询' });
            }
            if (this.resultsCount) this.resultsCount.setText('');
            if (this.paginationEl) this.paginationEl.empty();
        });

        // 全局操作
        const actionSection = fixedTop.createDiv({ cls: 'bible-section bible-action-section' });
        const actionHeader = actionSection.createDiv({ cls: 'bible-section-header' });
        const actionIcon = actionHeader.createEl('span', { cls: 'bible-section-icon', text: '⚡' });
        actionHeader.createEl('span', { text: '全局操作' });
        const actionBody = actionSection.createDiv({ cls: 'bible-action-grid' });
        actionHeader.addEventListener('click', () => {
            const isCollapsed = actionBody.style.display === 'none';
            actionBody.style.display = isCollapsed ? 'grid' : 'none';
            actionIcon.textContent = isCollapsed ? '⚡' : '⚡';
        });
        const selectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局全选' });
        const deselectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '取消全选' });
        const focusBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '逐节投影' });
        const parallelBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '并列投影' });
        const mixedBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '混合投影' });
        const copyAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局复制' });

        // 检索种类
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

        // 结果区域头部
        this.resultsHeader = fixedTop.createDiv({ cls: 'bible-results-header' });
        this.resultsCount = this.resultsHeader.createEl('span', { cls: 'bible-results-count', text: '' });
        const pageSelectAllBtn = this.resultsHeader.createEl('button', { cls: 'bible-small-btn', text: '本页全选' });
        const pageCopyBtn = this.resultsHeader.createEl('button', { cls: 'bible-small-btn', text: '📋 本页复制' });

        this.paginationEl = fixedTop.createDiv({ cls: 'bible-pagination' });

        // 可滚动结果区域
        this.searchScrollArea = this.searchPanel.createDiv({ cls: 'bible-search-scroll-area' });
        this.resultsContainer = this.searchScrollArea.createDiv({ cls: 'bible-results-list' });
        this.resultsContainer.createEl('div', { cls: 'bible-empty-state', text: '请输入检索内容后点击查询' });

        // 事件
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
            this.focusModeBtn.textContent = this.searchFocusMode ? '退出专注' : '专注模式';
        } else {
            this.focusModeBtn.textContent = this.readerFocusMode ? '退出专注' : '专注模式';
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

        this.results = this.plugin.searchEngine.search(query, types, rangeValue, bookIds);
        this.selectCounter = 0;

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
            jumpInput.style.width = '36px';
            jumpInput.style.textAlign = 'center';
            jumpInput.style.padding = '2px 4px';
            jumpInput.style.fontSize = '12px';
            jumpInput.style.border = '1px solid var(--bible-card-border)';
            jumpInput.style.borderRadius = '4px';
            jumpInput.style.background = 'var(--background-primary)';
            jumpInput.style.color = 'var(--text-normal)';
            jumpWrapper.createEl('span', { cls: 'bible-page-jump-label', text: '/' + totalPages });
            const jumpBtn = jumpWrapper.createEl('button', { cls: 'bible-page-btn', text: 'Go' });
            jumpBtn.style.minWidth = '28px';
            jumpBtn.style.height = '28px';
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
                if (e.target.closest('.bible-result-checkbox') || e.target.closest('.bible-side-tag') || e.target.closest('.bible-result-ref')) return;
                this.toggleSelection(globalIdx);
            });
        }
    }

    highlightKeywords(element, text, keywords) {
        if (!keywords || keywords.length === 0) {
            element.setText(text);
            return;
        }
        // 找到所有匹配位置
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
        // 合并重叠区间
        const merged = [];
        for (const m of matches) {
            if (merged.length === 0 || m.start >= merged[merged.length - 1].end) {
                merged.push({ start: m.start, end: m.end });
            } else if (m.end > merged[merged.length - 1].end) {
                merged[merged.length - 1].end = m.end;
            }
        }
        // 构建 DOM
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
            result.selected = false; result.sideBySide = false;
            const oldOrder = result.order; result.order = 0;
            for (const r of this.results) { if (r.selected && r.order > oldOrder) r.order--; }
            this.selectCounter--;
        } else {
            this.selectCounter++; result.selected = true; result.order = this.selectCounter;
        }
        this.renderResults();
    }

    toggleSideBySide(index) {
        const result = this.results[index];
        if (result && result.selected) { result.sideBySide = !result.sideBySide; this.renderResults(); }
    }

    selectAll() {
        this.selectCounter = 0;
        for (const result of this.results) { result.selected = true; result.sideBySide = false; this.selectCounter++; result.order = this.selectCounter; }
        this.renderResults();
    }

    deselectAll() {
        for (const result of this.results) { result.selected = false; result.sideBySide = false; result.order = 0; }
        this.selectCounter = 0;
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
            if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
            else if (item.type === 'outline') lines.push('> ' + item.content);
            else lines.push(item.bookShortName + item.chapter + ':' + item.verse + ' ' + item.content);
        }
        navigator.clipboard.writeText(lines.join('\n\n')).then(() => { new Notice('已复制 ' + selected.length + ' 条内容'); }).catch(() => new Notice('复制失败'));
    }

    copyAll() { this.copySelected(this.results); }
    copyPageAll() { this.copySelected(this.getPagedResults()); }

    openProjection(mode) {
        const selected = this.results.filter(r => r.selected);
        if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
        const overlay = new BibleProjectionOverlay(this.app, this.results, mode, true);
        overlay.open();
    }

    renderReader() {
        this.readerContent.empty();
        this.readerFixedTop.empty();
        if (this.readerState === 'books') this.renderBookList();
        else if (this.readerState === 'chapters') this.renderChapterList();
        else if (this.readerState === 'content') this.renderChapterContent();
    }

    renderBookList() {
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
        // 切换章节时清空上一章的选中状态
        this.readerResults = [];
        this.readerSelectCounter = 0;
        const book = this.readerBook;
        const chapter = this.readerChapter;
        if (!book) { this.readerState = 'books'; this.renderReader(); return; }

        const nav = this.readerFixedTop.createDiv({ cls: 'bible-reader-nav-row' });
        const backBtn = nav.createEl('button', { cls: 'bible-reader-nav-btn', text: '← 返回章节' });
        backBtn.addEventListener('click', () => { this.readerState = 'chapters'; this.renderReader(); });
        nav.createEl('span', { cls: 'bible-reader-nav-title', text: book.fullName + ' 第' + chapter + '章' });

        // 快速跳转
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

        // 字体控制
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

        // 操作按钮
        const contentNav = this.readerFixedTop.createDiv({ cls: 'bible-reader-content-nav' });
        const prevChBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '◀ 上一章' });
        const nextChBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '下一章 ▶' });
        const selectAllBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '全选' });
        const deselectAllBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '取消全选' });
        const copyVersesBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '复制经文' });
        const copyOutlinesBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '复制纲目' });
        const copySelectedBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '复制选中' });
        const focusProjBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '逐节投影' });
        const parallelProjBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '并列投影' });
        const mixedProjBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '混合投影' });

        prevChBtn.disabled = chapter <= 1;
        nextChBtn.disabled = chapter >= book.maxChapters;
        prevChBtn.addEventListener('click', () => { if (chapter > 1) { this.readerChapter--; this.renderReader(); } });
               nextChBtn.addEventListener('click', () => { if (chapter < book.maxChapters) { this.readerChapter++; this.renderReader(); } });

        if (this.plugin.allItems.length === 0) await this.plugin.loadBibleData();

        // 获取该章所有内容
        const items = this.plugin.allItems
            .filter(i => i.bookId === book.id && i.chapter === chapter)
            .sort((a, b) => a.lineIndex - b.lineIndex);

        // 获取该书卷所有主题（固定显示在顶部）
        const themeItems = this.plugin.allItems.filter(i => i.bookId === book.id && i.type === 'theme');
        if (themeItems.length > 0) {
            const themeEl = this.readerFixedTop.createDiv({ cls: 'bible-reader-book-theme' });
            themeEl.createEl('div', { cls: 'bible-reader-book-theme-title', text: '书卷主题' });
            for (const t of themeItems) {
                this.renderReaderItemCard(themeEl, t);
            }
        }

        const contentEl = this.readerContent.createDiv({ cls: 'bible-reader-content-list' });
        contentEl.style.fontSize = this.readerFontSize + 'px';

        // 渲染内容（纲目和经文）
        for (const item of items) {
            if (item.type === 'theme') continue;
            this.renderReaderItemCard(contentEl, item);
        }

        // 全选：第一章包含主题，其他章节不包含主题
        selectAllBtn.addEventListener('click', () => {
            const allItems = this.readerChapter === 1 ? [...themeItems, ...items] : [...items];
            for (const item of allItems) {
                const existingIdx = this.readerResults.findIndex(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
                );
                if (existingIdx === -1) {
                    this.readerSelectCounter++;
                    this.readerResults.push({ item: item, selected: true, order: this.readerSelectCounter, sideBySide: false });
                } else if (!this.readerResults[existingIdx].selected) {
                    this.readerSelectCounter++;
                    this.readerResults[existingIdx].selected = true;
                    this.readerResults[existingIdx].order = this.readerSelectCounter;
                }
            }
            for (const item of allItems) {
                this.refreshReaderItemCard(item);
            }
            new Notice('已将本章全部内容选中');
        });

        // 取消全选（主题+纲目+经文）
        deselectAllBtn.addEventListener('click', () => {
            const allItems = [...themeItems, ...items];
            for (const item of allItems) {
                const existingIdx = this.readerResults.findIndex(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
                );
                if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
                    const result = this.readerResults[existingIdx];
                    const oldOrder = result.order;
                    result.selected = false;
                    result.sideBySide = false;
                    result.order = 0;
                    for (const r of this.readerResults) { if (r.selected && r.order > oldOrder) r.order--; }
                    this.readerSelectCounter--;
                }
            }
            for (const item of allItems) {
                this.refreshReaderItemCard(item);
            }
            new Notice('已取消本章所有选中');
        });

        // 复制经文（此页全部经文，无论是否选中）
        copyVersesBtn.addEventListener('click', () => {
            const verses = items.filter(i => i.type === 'verse');
            if (verses.length === 0) { new Notice('本章没有经文内容'); return; }
            const lines = verses.map(v => v.bookShortName + v.chapter + ':' + v.verse + ' ' + v.content);
            navigator.clipboard.writeText(lines.join('\n\n')).then(() => { new Notice('已复制 ' + verses.length + ' 节经文'); });
        });

        // 复制纲目（此页全部纲目，无论是否选中）
        copyOutlinesBtn.addEventListener('click', () => {
            const outlines = items.filter(i => i.type === 'outline');
            if (outlines.length === 0) { new Notice('本章没有纲目内容'); return; }
            const lines = outlines.map(o => '> ' + o.content);
            navigator.clipboard.writeText(lines.join('\n\n')).then(() => { new Notice('已复制 ' + outlines.length + ' 条纲目'); });
        });

        // 复制选中项（只复制选中的主题+纲目+经文）
        copySelectedBtn.addEventListener('click', () => {
            const allItems = [...themeItems, ...items];
            const selected = [];
            for (const item of allItems) {
                const r = this.readerResults.find(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && r.selected
                );
                if (r) selected.push(r);
            }
            selected.sort((a, b) => a.order - b.order);
            if (selected.length === 0) { new Notice('请先选择要复制的内容'); return; }
            const lines = [];
            for (const r of selected) {
                const item = r.item;
                if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
                else if (item.type === 'outline') lines.push('> ' + item.content);
                else lines.push(item.bookShortName + item.chapter + ':' + item.verse + ' ' + item.content);
            }
            navigator.clipboard.writeText(lines.join('\n\n')).then(() => { new Notice('已复制 ' + selected.length + ' 条选中项'); });
        });

        // 聚焦投影（当前章选中的内容）
        focusProjBtn.addEventListener('click', () => {
            const allItems = [...themeItems, ...items];
            const selected = [];
            for (const item of allItems) {
                const r = this.readerResults.find(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && r.selected
                );
                if (r) selected.push(r);
            }
            selected.sort((a, b) => a.order - b.order);
            if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
            const overlay = new BibleProjectionOverlay(this.app, selected, 'focus', false);
            overlay.open();
        });

        // 并列投影（当前章选中的内容）
        parallelProjBtn.addEventListener('click', () => {
            const allItems = [...themeItems, ...items];
            const selected = [];
            for (const item of allItems) {
                const r = this.readerResults.find(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && r.selected
                );
                if (r) selected.push(r);
            }
            selected.sort((a, b) => a.order - b.order);
            if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
            const overlay = new BibleProjectionOverlay(this.app, selected, 'parallel', false);
            overlay.open();
        });

        // 混合投影（当前章选中的内容）
        mixedProjBtn.addEventListener('click', () => {
            const allItems = [...themeItems, ...items];
            const selected = [];
            for (const item of allItems) {
                const r = this.readerResults.find(r =>
                    r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && r.selected
                );
                if (r) selected.push(r);
            }
            selected.sort((a, b) => a.order - b.order);
            if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
            const overlay = new BibleProjectionOverlay(this.app, selected, 'mixed', false);
            overlay.open();
        });
    }

    renderReaderItemCard(container, item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
        );
        const isSelected = existingIdx !== -1 && this.readerResults[existingIdx].selected;
        const result = existingIdx !== -1 ? this.readerResults[existingIdx] : null;

        const card = container.createDiv({ cls: 'bible-reader-verse-card' + (isSelected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : '') });
        card.setAttribute('data-line-index', String(item.lineIndex));
        if (item.type === 'verse') {
            card.style.borderBottom = '1px solid var(--background-modifier-border)';
        }

        if (item.type === 'outline') {
            // 纲目：checkbox 与内容放在同一行，不单独显示 header
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
            // 主题和经文：保持原有 header + text 结构
            const header = card.createDiv({ cls: 'bible-reader-verse-header' });
            const checkbox = header.createDiv({ cls: 'bible-reader-verse-checkbox' + (isSelected ? ' checked' : '') });
            if (isSelected) checkbox.setText(String(result.order));

            let refText = '';
            if (item.type === 'theme') refText = item.bookFullName + ' 主题';
            else refText = item.bookShortName + item.chapter + ':' + item.verse;
            header.createEl('span', { cls: 'bible-reader-verse-ref', text: refText });

            let displayText = item.content;
            if (item.type === 'theme') displayText = '主题：' + item.content;
            card.createDiv({ cls: 'bible-reader-verse-text', text: displayText });

            checkbox.addEventListener('click', () => this.toggleReaderItemSelection(item));
            card.addEventListener('click', (e) => {
                if (e.target === card || e.target.closest('.bible-reader-verse-text')) this.toggleReaderItemSelection(item);
            });
        }

        if (isSelected) {
            const sideTag = card.createDiv({ cls: 'bible-reader-side-tag' + (result.sideBySide ? ' active' : '') });
            sideTag.setText(result.sideBySide ? '✓ 并列' : '并');
            sideTag.addEventListener('click', (e) => { e.stopPropagation(); this.toggleReaderSideBySide(item); });
        }
    }

    refreshReaderItemCard(item) {
        const card = this.readerPanel.querySelector('.bible-reader-verse-card[data-line-index="' + item.lineIndex + '"]');
        if (!card) return;

        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
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

        let sideTag = card.querySelector('.bible-reader-side-tag');
        if (isSelected) {
            if (!sideTag) {
                sideTag = card.createDiv({ cls: 'bible-reader-side-tag' + (result.sideBySide ? ' active' : '') });
                sideTag.setText(result.sideBySide ? '✓ 并列' : '并');
                sideTag.addEventListener('click', (e) => { e.stopPropagation(); this.toggleReaderSideBySide(item); });
            } else {
                sideTag.style.display = 'block';
                if (result.sideBySide) sideTag.classList.add('active');
                else sideTag.classList.remove('active');
                sideTag.textContent = result.sideBySide ? '✓ 并列' : '并';
            }
        } else {
            if (sideTag) sideTag.style.display = 'none';
        }
    }

    toggleReaderItemSelection(item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
        );

        if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
            const result = this.readerResults[existingIdx];
            const oldOrder = result.order;
            result.selected = false;
            result.sideBySide = false;
            result.order = 0;
            for (const r of this.readerResults) { if (r.selected && r.order > oldOrder) r.order--; }
            this.readerSelectCounter--;
        } else {
            this.readerSelectCounter++;
            if (existingIdx !== -1) {
                this.readerResults[existingIdx].selected = true;
                this.readerResults[existingIdx].order = this.readerSelectCounter;
            } else {
                this.readerResults.push({ item: item, selected: true, order: this.readerSelectCounter, sideBySide: false });
            }
        }
        this.refreshReaderItemCard(item);
    }

    toggleReaderSideBySide(item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
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
        // 内置数据模式下不跳转到文件
        if (this.plugin.settings.dataSource === 'builtin') {
            new Notice('内置数据模式下不支持跳转到文件位置');
            return;
        }
        const testament = item.testament;
        const folderPath = testament === 'old' ? this.plugin.settings.oldTestamentPath : this.plugin.settings.newTestamentPath;
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        if (!folder || !(folder instanceof TFolder)) {
            new Notice('未找到圣经目录: ' + folderPath);
            return;
        }

        // 通过书卷 ID 精确匹配文件
        let targetFile = null;
        for (const file of folder.children) {
            if (file instanceof TFile && file.extension === 'md') {
                const idMatch = file.basename.match(/^(\d+)/);
                if (idMatch && parseInt(idMatch[1]) === item.bookId) {
                    targetFile = file;
                    break;
                }
            }
        }
        if (!targetFile) {
            new Notice('未找到书卷文件: ' + item.bookFullName);
            return;
        }

        // 先读取文件内容，找到目标行号
        const fileContent = await this.app.vault.read(targetFile);
        const lines = fileContent.split('\n');
        let targetLine = -1;

        const possibleShortNames = [item.bookShortName];
        if (item.bookShortName === '约贰') possibleShortNames.push('约二');
        if (item.bookShortName === '约叁') possibleShortNames.push('约三');

        // 搜索目标行
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (item.type === 'verse') {
                for (const sn of possibleShortNames) {
                    if (line.startsWith(sn + item.chapter + ':' + item.verse + ' ') ||
                        line.startsWith(sn + item.chapter + '：' + item.verse + ' ')) {
                        targetLine = i;
                        break;
                    }
                }
            } else if (item.type === 'theme' && line.includes(item.content)) {
                targetLine = i; break;
            } else if (item.type === 'outline') {
                const outlineContent = item.content.replace(/^>\s*/, '');
                if (line.includes(outlineContent)) { targetLine = i; break; }
            }
            if (targetLine !== -1) break;
        }

        // 回退到章节标题
        if (targetLine === -1 && item.type === 'verse') {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (/^#+\s/.test(line) && line.includes('第' + item.chapter + '章')) {
                    targetLine = i; break;
                }
            }
        }

        if (targetLine < 0) {
            new Notice('未找到: ' + item.bookShortName + item.chapter + ':' + item.verse);
            return;
        }

        // 复用已有的圣经标签页：先精确匹配目标文件，再回退到目录匹配
        let leaf = null;
        for (const l of this.app.workspace.getLeavesOfType('markdown')) {
            if (l.view && l.view.file && l.view.file.path === targetFile.path) {
                leaf = l; break;
            }
        }
        if (!leaf) {
            for (const l of this.app.workspace.getLeavesOfType('markdown')) {
                if (l.view && l.view.file) {
                    const p = l.view.file.path;
                    if (p.startsWith(this.plugin.settings.oldTestamentPath + '/') ||
                        p.startsWith(this.plugin.settings.newTestamentPath + '/')) {
                        leaf = l; break;
                    }
                }
            }
        }
        if (!leaf) leaf = this.app.workspace.getLeaf('tab');

        // 打开文件并激活标签页，同时定位到目标行
        await leaf.openFile(targetFile, {
            active: true,
            eState: { line: targetLine, ch: 0 }
        });

        // 激活标签页（确保焦点切换）
        this.app.workspace.setActiveLeaf(leaf, { focus: true });

        // 等待编辑器就绪后设置选区高亮
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 100));
            if (leaf.view && leaf.view.editor && leaf.view.file && leaf.view.file.path === targetFile.path) {
                const editor = leaf.view.editor;
                if (targetLine < editor.lineCount()) {
                    const lineText = editor.getLine(targetLine);
                    editor.setSelection(
                        { line: targetLine, ch: 0 },
                        { line: targetLine, ch: lineText.length }
                    );
                    break;
                }
            }
        }
    }

}

// ==================== 插件主类 ====================
class BibleSearchPlugin extends Plugin {
    async onload() {
        await this.loadSettings();
        this.parser = new BibleParser(this.app, this.settings, this.manifest.dir);
        this.searchEngine = new BibleSearchEngine();
        this.allItems = [];

        this.registerView(BIBLE_SEARCH_VIEW_TYPE, (leaf) => new BibleSearchView(leaf, this));

        this.addRibbonIcon('book-plus', '圣经检索', () => { this.activateSearchView(); });
        this.addCommand({ id: 'open-bible-search', name: '打开圣经检索', callback: () => this.activateSearchView() });
        this.addSettingTab(new BibleSettingTab(this.app, this));

        await this.loadBibleData();

        this.registerEvent(this.app.workspace.onLayoutReady(() => {
            if (!this.settings.hasSetup) {
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
        // 清理所有圣经相关的 DOM 元素
        document.querySelectorAll('.bible-projection-fullscreen').forEach(el => el.remove());
    }

    async loadSettings() {
        this.settings = Object.assign({}, {
            dataSource: 'builtin',
            oldTestamentPath: '圣经/旧约',
            newTestamentPath: '圣经/新约',
            hasSetup: false,
            autoCheckUpdate: true,
            lastVersion: ''
        }, await this.loadData());
        if (!this.settings.dataSource) {
            this.settings.dataSource = 'external';
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async getBuiltinDataInfo() {
        const info = { available: false, foundItems: [], triedPaths: [] };
        try {
            const pluginId = this.manifest?.id || 'bible-search-reader';
            const adapterPath = `.obsidian/plugins/${pluginId}/bible-data.json`;
            let allPaths = [adapterPath];

            if (Platform.isDesktop) {
                const fs = window.require('fs');
                const path = window.require('path');
                // 桌面端将相对路径转为绝对路径，便于后续去重
                try {
                    const basePath = this.app.vault.adapter.getBasePath();
                    allPaths[0] = path.join(basePath, adapterPath);
                } catch (e) {}
                if (this.manifest && this.manifest.dir) {
                    allPaths.push(path.join(this.manifest.dir, 'bible-data.json'));
                }
                try {
                    const basePath = this.app.vault.adapter.getBasePath();
                    allPaths.push(path.join(basePath, '.obsidian', 'plugins', pluginId, 'bible-data.json'));
                } catch (e) {}
                // 路径规范化并去重
                allPaths = [...new Set(allPaths.map(p => path.normalize(p)))];
            }

            for (const dataPath of allPaths) {
                info.triedPaths.push(dataPath);
                let exists = false;
                let raw = null;

                if (Platform.isDesktop) {
                    const fs = window.require('fs');
                    if (fs.existsSync(dataPath)) {
                        exists = true;
                        raw = fs.readFileSync(dataPath, 'utf-8');
                    }
                } else {
                    // 移动端只能通过 vault adapter 访问
                    const relPath = dataPath;
                    if (await this.app.vault.adapter.exists(relPath)) {
                        exists = true;
                        raw = await this.app.vault.adapter.read(relPath);
                    }
                }

                if (exists && raw) {
                    try {
                        const data = JSON.parse(raw);
                        if (Array.isArray(data)) {
                            const bookIds = new Set();
                            for (const item of data) { if (item.bookId) bookIds.add(item.bookId); }
                            info.foundItems.push({
                                path: dataPath,
                                itemCount: data.length,
                                bookCount: bookIds.size
                            });
                            info.available = true;
                        }
                    } catch (e) {}
                }
            }
        } catch (e) {
            console.error('[Bible] 检查内置数据失败:', e);
            info.error = e.message;
        }
        return info;
    }

    async deleteBuiltinData(dataPath) {
        try {
            if (Platform.isDesktop) {
                const fs = window.require('fs');
                if (fs.existsSync(dataPath)) {
                    fs.unlinkSync(dataPath);
                    return true;
                }
            }
            // 移动端或 fs 删除失败时，尝试通过 vault adapter 删除（相对路径）
            const relPath = dataPath;
            if (await this.app.vault.adapter.exists(relPath)) {
                await this.app.vault.adapter.remove(relPath);
                return true;
            }
        } catch (e) {
            console.error('[Bible] 删除内置数据失败:', e);
            throw e;
        }
        return false;
    }

    async downloadBuiltinData() {
        const pluginId = this.manifest?.id || 'bible-search-reader';
        const adapterPath = `.obsidian/plugins/${pluginId}/bible-data.json`;
        let savedPath = adapterPath;

        const notice = new Notice('正在下载内置数据...', 0);
        const startTime = Date.now();
        try {
            const response = await requestUrl({ url: BIBLE_DATA_URL, method: 'GET' });
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
                const targetPath = path.join(targetDir, 'bible-data.json');
                fs.writeFileSync(targetPath, Buffer.from(response.arrayBuffer));
                savedPath = targetPath;
                console.log('[Bible] 内置数据下载完成:', targetPath);
            } else {
                const dirPath = `.obsidian/plugins/${pluginId}`;
                if (!(await this.app.vault.adapter.exists(dirPath))) {
                    await this.app.vault.adapter.mkdir(dirPath);
                }
                await this.app.vault.adapter.writeBinary(adapterPath, response.arrayBuffer);
                console.log('[Bible] 内置数据下载完成:', adapterPath);
            }

            notice.hide();
            new Notice('下载完成！' + sizeMB + 'MB，速度 ' + speed + 'MB/s\n保存位置: ' + savedPath, 6000);
        } catch (e) {
            notice.hide();
            throw e;
        }
    }

    async downloadAndExtractBible(url) {
        if (!Platform.isDesktop) {
            new Notice('移动端暂不支持自动解压，请手动下载 ZIP 文件并解压到 Vault 目录，然后在设置中配置圣经目录路径。', 8000);
            return;
        }
        const fs = window.require('fs');
        const path = window.require('path');
        const { execSync } = window.require('child_process');
        const vaultBasePath = this.app.vault.adapter.getBasePath();

        const notice = new Notice('正在下载圣经文档...', 0);
        const startTime = Date.now();
        let response;
        try {
            response = await requestUrl({ url: url, method: 'GET' });
            if (response.status !== 200) {
                throw new Error('HTTP ' + response.status);
            }
        } catch (e) {
            notice.hide();
            throw e;
        }
        const elapsed = (Date.now() - startTime) / 1000;
        const sizeMB = (response.arrayBuffer.byteLength / 1024 / 1024).toFixed(2);
        const speed = (sizeMB / elapsed).toFixed(2);
        notice.setMessage('下载完成 ' + sizeMB + 'MB (' + speed + 'MB/s)，正在解压...');

        const tempZip = path.join(vaultBasePath, '.obsidian', 'temp-bible-download.zip');
        if (!fs.existsSync(path.dirname(tempZip))) {
            fs.mkdirSync(path.dirname(tempZip), { recursive: true });
        }
        fs.writeFileSync(tempZip, Buffer.from(response.arrayBuffer));

        const extractTarget = path.join(vaultBasePath, '圣经');
        if (!fs.existsSync(extractTarget)) fs.mkdirSync(extractTarget, { recursive: true });

        if (process.platform === 'win32') {
            execSync(`PowerShell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${extractTarget}' -Force"`, { timeout: 60000 });
        } else {
            execSync(`unzip -o "${tempZip}" -d "${extractTarget}"`, { timeout: 60000 });
        }

        fs.unlinkSync(tempZip);

        this.settings.oldTestamentPath = '圣经/旧约';
        this.settings.newTestamentPath = '圣经/新约';
        this.settings.dataSource = 'external';
        await this.saveSettings();

        notice.hide();
        new Notice('解压完成！共 ' + sizeMB + 'MB');
        console.log('[Bible] 外置圣经数据下载并解压完成');
    }

    async loadBibleData() {
        try {
            this.allItems = await this.parser.parseAllBooks();
            if (this.searchEngine) this.searchEngine.setItems(this.allItems);
            console.log('[Bible] 数据加载完成，共 ' + this.allItems.length + ' 条');
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
        if (!Platform.isDesktop) {
            new Notice('自动更新仅支持桌面端');
            return;
        }
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

            const fs = window.require('fs');
            const path = window.require('path');
            const pluginDir = this.manifest.dir;
            if (!pluginDir) throw new Error('无法确定插件目录');

            fs.writeFileSync(path.join(pluginDir, 'main.js'), Buffer.from(mainResp.arrayBuffer));
            fs.writeFileSync(path.join(pluginDir, 'manifest.json'), Buffer.from(manifestResp.arrayBuffer));
            if (stylesResp.status === 200) {
                fs.writeFileSync(path.join(pluginDir, 'styles.css'), Buffer.from(stylesResp.arrayBuffer));
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