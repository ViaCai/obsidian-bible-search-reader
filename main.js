const { Plugin, PluginSettingTab, Setting, TFile, TFolder, ItemView, WorkspaceLeaf, Notice } = require('obsidian');

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
const BOOK_SHORT_NAMES = BIBLE_BOOKS.map(b => b.shortName).sort((a, b) => b.length - a.length);

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
        new Setting(containerEl)
            .setName('旧约圣经目录')
            .setDesc('旧约圣经 Markdown 文档所在的文件夹路径')
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
            .setDesc('新约圣经 Markdown 文档所在的文件夹路径')
            .addText(text => text
                .setPlaceholder('圣经/新约')
                .setValue(this.plugin.settings.newTestamentPath)
                .onChange(async (value) => {
                    this.plugin.settings.newTestamentPath = value;
                    await this.plugin.saveSettings();
                    await this.plugin.loadBibleData();
                }));
    }
}

// ==================== 圣经解析器（带原文顺序索引）====================
class BibleParser {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }

    async parseAllBooks() {
        const items = [];
        const vault = this.app.vault;
        console.log('[Bible] 开始解析圣经数据...');

        const oldFolder = vault.getAbstractFileByPath(this.settings.oldTestamentPath);
        if (oldFolder && oldFolder instanceof TFolder) {
            for (const file of oldFolder.children) {
                if (file instanceof TFile && file.extension === 'md') {
                    console.log('[Bible] 解析旧约文件:', file.path);
                    const parsed = await this.parseBookFile(file, 'old');
                    items.push(...parsed);
                }
            }
        }

        const newFolder = vault.getAbstractFileByPath(this.settings.newTestamentPath);
        if (newFolder && newFolder instanceof TFolder) {
            for (const file of newFolder.children) {
                if (file instanceof TFile && file.extension === 'md') {
                    console.log('[Bible] 解析新约文件:', file.path);
                    const parsed = await this.parseBookFile(file, 'new');
                    items.push(...parsed);
                }
            }
        }

        console.log('[Bible] 解析完成，共 ' + items.length + ' 条数据');
        return items;
    }

    async parseBookFile(file, testament) {
        const items = [];
        const content = await this.app.vault.read(file);
        const lines = content.split('\n');
        const fileName = file.basename;

        const numMatch = fileName.match(/^\d+[.\s]*(.+)$/);
        let bookInfo = null;

        if (numMatch) {
            const id = parseInt(fileName.match(/^(\d+)/)[1]);
            bookInfo = BOOK_ID_MAP[id];
        }

        if (!bookInfo) {
            for (const book of BIBLE_BOOKS) {
                if (fileName.includes(book.fullName) || fileName.includes(book.shortName)) {
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

            if (trimmed.startsWith('>') && !trimmed.includes('主题')) {
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

            const chapterMatch = trimmed.match(/^#+\s*(?:.*第)?([\d一二三四五六七八九十百零]+)章?.*$/);
            if (chapterMatch && !trimmed.includes(':') && trimmed.length < 50) {
                const ch = parseNumber(chapterMatch[1]);
                if (!isNaN(ch) && ch > 0 && ch <= 200) {
                    currentChapter = ch;
                }
                lineIndex++;
                continue;
            }

            const verseMatch2 = trimmed.match(/^([撒上下王代林前后帖前后提前后彼前后约壹贰叁])(\d+)[：:](\d+)\s*(.*)$/);
            if (verseMatch2) {
                const shortName = verseMatch2[1];
                const chapter = parseInt(verseMatch2[2]);
                const verse = parseInt(verseMatch2[3]);
                const verseContent = verseMatch2[4].trim();
                const matchedBook = BOOK_MAP[shortName];
                if (matchedBook && matchedBook.id === bookInfo.id) {
                    currentChapter = chapter;
                    items.push({
                        type: 'verse', bookId: bookInfo.id, bookShortName: bookInfo.shortName,
                        bookFullName: bookInfo.fullName, testament: bookInfo.testament,
                        chapter: chapter, verse: verse, lineIndex: lineIndex,
                        content: verseContent, rawLine: trimmed
                    });
                }
                lineIndex++;
                continue;
            }

            const verseMatch = trimmed.match(/^([创出利民申书士得撒上下王代拉尼斯伯诗箴传歌赛耶哀结但何珥摩俄拿弥鸿哈番该亚玛太可路约徒罗林前后加弗腓西帖前后提前后多门来雅彼前后约壹贰叁犹启])(\d+)[：:](\d+)\s*(.*)$/);
            if (verseMatch) {
                const shortName = verseMatch[1];
                const chapter = parseInt(verseMatch[2]);
                const verse = parseInt(verseMatch[3]);
                const verseContent = verseMatch[4].trim();
                const matchedBook = BOOK_MAP[shortName];
                if (matchedBook && matchedBook.id === bookInfo.id) {
                    currentChapter = chapter;
                    items.push({
                        type: 'verse', bookId: bookInfo.id, bookShortName: bookInfo.shortName,
                        bookFullName: bookInfo.fullName, testament: bookInfo.testament,
                        chapter: chapter, verse: verse, lineIndex: lineIndex,
                        content: verseContent, rawLine: trimmed
                    });
                }
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

        const results = [];
        const seen = new Set();

        for (const item of this.items) {
            if (!types.includes(item.type)) continue;
            if (range === 'old' && item.testament !== 'old') continue;
            if (range === 'new' && item.testament !== 'new') continue;
            if (range === 'single' && bookIds && bookIds.length > 0 && !bookIds.includes(item.bookId)) continue;
            if (range === 'multi' && bookIds && bookIds.length > 0 && !bookIds.includes(item.bookId)) continue;

            let matched = false;
            if (refs.length > 0) {
                for (const ref of refs) {
                    if (this.matchVerseRef(item, ref)) { matched = true; break; }
                }
            }
            if (keywords.length > 0) {
                const contentLower = item.content.toLowerCase();
                const allMatch = keywords.every(k => contentLower.includes(k.toLowerCase()));
                if (allMatch) matched = true;
            }

            if (matched) {
                const key = item.bookId + '-' + item.chapter + '-' + item.verse + '-' + item.type + '-' + item.content;
                if (!seen.has(key)) {
                    seen.add(key);
                    results.push({ item: item, selected: false, order: 0, sideBySide: false });
                }
            }
        }
        return results;
    }

    parseQuery(query) {
        const refs = [];
        const keywords = [];
        query = query.replace(/[～]/g, '-').replace(/[：]/g, ':');

        let remaining = query;
        const refStrings = [];

        for (const sn of BOOK_SHORT_NAMES) {
            let idx = remaining.indexOf(sn);
            while (idx !== -1) {
                const after = remaining.slice(idx + sn.length);
                const numMatch = after.match(/^(\d+[:：]\d+(?:[-—]\d+(?:[:：]?\d+)?)?)/);
                const cnMatch = after.match(/^([一二三四五六七八九十百零]+[:：][一二三四五六七八九十百零]+(?:[-—][一二三四五六七八九十百零]+(?:[:：]?[一二三四五六七八九十百零]+)?)?)/);
                if (numMatch) {
                    refStrings.push(sn + numMatch[1]);
                    remaining = remaining.slice(0, idx) + ' ' + remaining.slice(idx + sn.length + numMatch[1].length) + ' ';
                    idx = remaining.indexOf(sn);
                } else if (cnMatch) {
                    refStrings.push(sn + cnMatch[1]);
                    remaining = remaining.slice(0, idx) + ' ' + remaining.slice(idx + sn.length + cnMatch[1].length) + ' ';
                    idx = remaining.indexOf(sn);
                } else {
                    const noColonMatch = after.match(/^([一二三四五六七八九十百零]+)([一二三四五六七八九十百零]+)/);
                    if (noColonMatch) {
                        refStrings.push(sn + noColonMatch[1] + ':' + noColonMatch[2]);
                        remaining = remaining.slice(0, idx) + ' ' + remaining.slice(idx + sn.length + noColonMatch[0].length) + ' ';
                        idx = remaining.indexOf(sn);
                    } else {
                        idx = remaining.indexOf(sn, idx + 1);
                    }
                }
            }
        }

        for (const rs of refStrings) {
            const parsed = this.parseVerseReference(rs);
            refs.push(...parsed);
        }

        remaining = remaining.replace(/[,，、；;]/g, ' ').trim();
        if (remaining) {
            const kwParts = remaining.split(/\s+/).filter(p => p.length > 0);
            for (const kw of kwParts) {
                let isRef = false;
                for (const sn of BOOK_SHORT_NAMES) {
                    if (kw.startsWith(sn)) {
                        const after = kw.slice(sn.length);
                        if (/^[\d一二三四五六七八九十百零]/.test(after)) { isRef = true; break; }
                    }
                }
                if (!isRef) keywords.push(kw);
            }
        }

        if (refs.length === 0 && keywords.length === 0) {
            const parts = query.split(/[,，、；;\s]+/).map(p => p.trim()).filter(p => p);
            for (const part of parts) {
                if (this.isVerseReference(part)) {
                    const parsed = this.parseVerseReference(part);
                    refs.push(...parsed);
                } else {
                    keywords.push(part);
                }
            }
        }

        return { refs: refs, keywords: keywords };
    }

    isVerseReference(part) {
        for (const shortName of BOOK_SHORT_NAMES) {
            if (part.startsWith(shortName)) {
                const after = part.slice(shortName.length);
                if (/^[\d一二三四五六七八九十百零]+/.test(after)) return true;
            }
        }
        return false;
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

        const noColonMatch = remaining.match(/^([一二三四五六七八九十百零\d]+)([一二三四五六七八九十百零\d]+)$/);
        if (noColonMatch && !remaining.includes(':') && !remaining.includes('：')) {
            const ch = parseNumber(noColonMatch[1]);
            const vs = parseNumber(noColonMatch[2]);
            if (!isNaN(ch) && !isNaN(vs)) {
                ranges.push({ bookId: book.id, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: vs });
            }
            return ranges;
        }

        const rangeParts = remaining.split(/[-—]/);
        if (rangeParts.length === 2) {
            const start = this.parseChapterVerse(rangeParts[0]);
            const end = this.parseChapterVerse(rangeParts[1]);
            if (start && end) {
                const endCh = end.chapter > 0 ? end.chapter : start.chapter;
                ranges.push({ bookId: book.id, startChapter: start.chapter, startVerse: start.verse, endChapter: endCh, endVerse: end.verse });
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
        const match = s.match(/^([一二三四五六七八九十百零\d]+)[:：]([一二三四五六七八九十百零\d]+)$/);
        if (match) {
            const ch = parseNumber(match[1]);
            const vs = parseNumber(match[2]);
            if (!isNaN(ch) && !isNaN(vs)) return { chapter: ch, verse: vs };
        }
        return null;
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

// ==================== 全窗口投影组件 ====================
class BibleProjectionOverlay {
    constructor(app, results, mode) {
        this.app = app;
        this.results = results.filter(r => r.selected).sort((a, b) => a.order - b.order);
        this.mode = mode;
        this.currentSlide = 0;
        this.slides = [];
        this.fontSize = 48;
        this.isDark = true;
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

        const toolbar = document.createElement('div');
        toolbar.className = 'bible-proj-toolbar';
        const toolbarLeft = toolbar.createDiv({ cls: 'bible-proj-toolbar-left' });
        toolbarLeft.createEl('span', { cls: 'bible-proj-page-num', text: '1 / ' + this.slides.length });
        toolbarLeft.createEl('span', { cls: 'bible-proj-badge', text: this.getModeLabel() });

        const toolbarCenter = toolbar.createDiv({ cls: 'bible-proj-toolbar-center' });
        toolbarCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '-', attr: { 'data-action': 'font-smaller' } });
        toolbarCenter.createEl('span', { cls: 'bible-proj-font-size', text: this.fontSize + 'px' });
        toolbarCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '+', attr: { 'data-action': 'font-larger' } });
        toolbarCenter.createEl('button', { cls: 'bible-proj-tool-btn', text: '⟲', attr: { 'data-action': 'font-reset' } });

        const toolbarRight = toolbar.createDiv({ cls: 'bible-proj-toolbar-right' });
        toolbarRight.createEl('button', { cls: 'bible-proj-tool-btn', text: '🌙', attr: { 'data-action': 'toggle-theme' } });
        toolbarRight.createEl('button', { cls: 'bible-proj-tool-btn', text: '✕', attr: { 'data-action': 'close' } });
        this.overlay.appendChild(toolbar);

        this.contentArea = document.createElement('div');
        this.contentArea.className = 'bible-proj-content';
        this.contentArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;position:relative;';
        this.overlay.appendChild(this.contentArea);

        const bottomNav = document.createElement('div');
        bottomNav.className = 'bible-proj-bottom';
        const prevBtn = bottomNav.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-prev', text: '◀' });
        const bottomInfo = bottomNav.createDiv({ cls: 'bible-proj-bottom-info' });
        bottomInfo.createEl('div', { text: this.getModeName() + ' - ' + this.results.length + ' 节经文' });
        const hintDiv = bottomInfo.createEl('div', { text: '使用方向键切换，+/- 调整字体，T 切换主题' });
        hintDiv.style.fontSize = '12px';
        hintDiv.style.opacity = '0.6';
        const nextBtn = bottomNav.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-next', text: '▶' });
        this.overlay.appendChild(bottomNav);

        document.body.appendChild(this.overlay);
        this.bindEvents(toolbar, bottomNav);
        this.renderSlide();
    }

    bindEvents(toolbar, bottomNav) {
        toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'close') this.close();
            else if (action === 'font-larger') { this.fontSize += 4; this.updateFontSize(); }
            else if (action === 'font-smaller') { this.fontSize = Math.max(16, this.fontSize - 4); this.updateFontSize(); }
            else if (action === 'font-reset') { this.fontSize = 48; this.updateFontSize(); }
            else if (action === 'toggle-theme') { this.toggleTheme(); }
        });

        bottomNav.querySelector('.bible-proj-prev').addEventListener('click', () => this.prevSlide());
        bottomNav.querySelector('.bible-proj-next').addEventListener('click', () => this.nextSlide());

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
        const badgeEl = this.overlay.querySelector('.bible-proj-badge');
        if (pageNumEl) pageNumEl.textContent = (this.currentSlide + 1) + ' / ' + this.slides.length;
        if (badgeEl) badgeEl.textContent = this.getModeLabel();

        const wrapper = document.createElement('div');
        wrapper.className = 'bible-proj-slide-wrapper';
        wrapper.style.cssText = 'max-width:' + this.getWrapperMaxWidth() + 'px;width:90%;text-align:center;padding:20px;margin:auto;overflow-y:auto;max-height:100%;';

        if (this.mode === 'focus') {
            const item = slide.items[0];
            const refDiv = wrapper.createEl('div', { cls: 'bible-proj-ref bible-proj-focus-ref', text: this.getItemRef(item) });
            refDiv.style.marginBottom = '20px';
            const textDiv = wrapper.createEl('div', { cls: 'bible-proj-text bible-proj-focus-text', text: this.getItemContent(item) });
            textDiv.style.lineHeight = '1.8';
        } else {
            wrapper.style.textAlign = 'left';
            for (const item of slide.items) {
                const itemEl = document.createElement('div');
                itemEl.style.cssText = 'margin-bottom:24px;padding:16px;background:rgba(255,255,255,0.05);border-radius:8px;';
                const pRef = itemEl.createEl('div', { cls: 'bible-proj-ref bible-proj-parallel-ref', text: this.getItemRef(item) });
                pRef.style.marginBottom = '8px';
                pRef.style.fontWeight = '600';
                const pText = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-parallel-text', text: this.getItemContent(item) });
                pText.style.lineHeight = '1.7';
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
        const wrapper = this.overlay.querySelector('.bible-proj-slide-wrapper');
        if (wrapper) wrapper.style.maxWidth = this.getWrapperMaxWidth() + 'px';
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        const btn = this.overlay.querySelector('[data-action="toggle-theme"]');
        if (btn) btn.textContent = this.isDark ? '🌙' : '☀️';
        if (this.isDark) {
            this.overlay.style.background = '#1a1a2e';
            this.overlay.style.color = '#fff';
        } else {
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
        const baseWidth = 900;
        const extra = Math.max(0, (this.fontSize - 48) * 18);
        return Math.min(window.innerWidth * 0.9, baseWidth + extra);
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
        this.currentChapterVerses = [];
        this.readerResults = [];
        this.readerSelectCounter = 0;
        this.selectedBookIds = new Set();
        this.searchFocusMode = false;
        this.readerFocusMode = false;
    }
    getViewType() { return BIBLE_SEARCH_VIEW_TYPE; }
    getDisplayText() { return '圣经检索'; }
    getIcon() { return 'book-open'; }

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
        rangeHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        rangeHeader.createEl('span', { text: '检索范围' });
        const rangeBody = rangeSection.createDiv({ cls: 'bible-section-body' });
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

        clearBtn.addEventListener('click', () => { this.searchInput.value = ''; });

        // 全局操作
        const actionSection = fixedTop.createDiv({ cls: 'bible-section bible-action-section' });
        const actionHeader = actionSection.createDiv({ cls: 'bible-section-header' });
        actionHeader.createEl('span', { cls: 'bible-section-icon', text: '⚡' });
        actionHeader.createEl('span', { text: '全局操作' });
        const actionBody = actionSection.createDiv({ cls: 'bible-action-grid' });
        const selectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '全局全选' });
        const deselectAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '取消全选' });
        const focusBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '📄 逐节投影' });
        const parallelBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '📑 并列投影' });
        const mixedBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '🔀 混合投影' });
        const copyAllBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '📋 全局复制' });

        // 检索种类
        const typeSection = fixedTop.createDiv({ cls: 'bible-section' });
        const typeHeader = typeSection.createDiv({ cls: 'bible-section-header' });
        typeHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        typeHeader.createEl('span', { text: '检索种类' });
        const typeBody = typeSection.createDiv({ cls: 'bible-type-grid' });
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
            cardHeader.createEl('span', { cls: 'bible-result-ref', text: refText });

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
                if (e.target === card || e.target === contentEl) this.toggleSelection(globalIdx);
            });
        }
    }

    highlightKeywords(element, text, keywords) {
        if (!keywords || keywords.length === 0) {
            element.setText(text);
            return;
        }
        // 构建不区分大小写的关键词匹配
        const patterns = keywords.filter(k => k).map(kw => {
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return { regex: new RegExp('(' + escaped + ')', 'gi'), kw: kw };
        });
        // 找到所有匹配位置
        const matches = [];
        for (const p of patterns) {
            let m;
            const textLower = text.toLowerCase();
            const kwLower = p.kw.toLowerCase();
            let idx = textLower.indexOf(kwLower);
            while (idx !== -1) {
                matches.push({ start: idx, end: idx + p.kw.length, kw: p.kw });
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
        const overlay = new BibleProjectionOverlay(this.app, this.results, mode);
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
        this.readerContent.empty();
        this.readerFixedTop.empty();
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
        this.readerContent.empty();
        this.readerFixedTop.empty();
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
        // 同步 readerSelectCounter，确保当前章的选中数字从1开始显示
        this.readerSelectCounter = 0;
        for (const r of this.readerResults) {
            if (r.selected) {
                this.readerSelectCounter++;
                r.order = this.readerSelectCounter;
            }
        }
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
        const copyVersesBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '📋 复制经文' });
        const copyOutlinesBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '📋 复制纲目' });
        const copySelectedBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '📋 复制选中项' });
        const focusProjBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '📄 逐节投影' });
        const parallelProjBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '📑 并列投影' });
        const mixedProjBtn = contentNav.createEl('button', { cls: 'bible-reader-nav-btn', text: '🔀 混合投影' });

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

        // 全选（纲目+经文，不包含主题）
        selectAllBtn.addEventListener('click', () => {
            const allItems = [...items];
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
            const overlay = new BibleProjectionOverlay(this.app, selected, 'focus');
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
            const overlay = new BibleProjectionOverlay(this.app, selected, 'parallel');
            overlay.open();
        });
    }

    renderReaderItemCard(container, item) {
        const key = item.type + '-' + item.bookId + '-' + item.chapter + '-' + item.verse + '-' + item.content;
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content
        );
        const isSelected = existingIdx !== -1 && this.readerResults[existingIdx].selected;
        const result = existingIdx !== -1 ? this.readerResults[existingIdx] : null;

        const card = container.createDiv({ cls: 'bible-reader-verse-card' + (isSelected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : '') });
        card.setAttribute('data-item-key', key);

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
        const key = item.type + '-' + item.bookId + '-' + item.chapter + '-' + item.verse + '-' + item.content;
        const card = this.readerPanel.querySelector('.bible-reader-verse-card[data-item-key="' + key + '"]');
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
    }
}

// ==================== 插件主类 ====================
class BibleSearchPlugin extends Plugin {
    async onload() {
        await this.loadSettings();
        this.parser = new BibleParser(this.app, this.settings);
        this.searchEngine = new BibleSearchEngine();
        this.allItems = [];

        this.registerView(BIBLE_SEARCH_VIEW_TYPE, (leaf) => new BibleSearchView(leaf, this));

        this.addRibbonIcon('book-open', '圣经检索', () => { this.activateSearchView(); });
        this.addCommand({ id: 'open-bible-search', name: '打开圣经检索', callback: () => this.activateSearchView() });
        this.addSettingTab(new BibleSettingTab(this.app, this));

        await this.loadBibleData();

        this.app.workspace.onLayoutReady(() => {
            this.activateSearchView();
        });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, { oldTestamentPath: '圣经/旧约', newTestamentPath: '圣经/新约' }, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async loadBibleData() {
        try {
            this.allItems = await this.parser.parseAllBooks();
            if (this.searchEngine) this.searchEngine.setItems(this.allItems);
            console.log('[Bible] 数据加载完成，共 ' + this.allItems.length + ' 条');
        } catch (e) {
            console.error('[Bible] 加载失败:', e);
            new Notice('加载圣经数据失败，请检查目录设置: ' + e.message);
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
}

module.exports = BibleSearchPlugin;