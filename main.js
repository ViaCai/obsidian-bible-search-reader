const { Plugin, PluginSettingTab, Setting, TFile, TFolder, ItemView, WorkspaceLeaf, Notice, Platform, requestUrl, Modal, setIcon } = require('obsidian');

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
// 书卷别名映射（用于引用识别）
const BOOK_ALIASES = {
    // 福音书别名
    '路加': '路', '马太': '太', '马可': '可', '约翰': '约',
    '路加福音': '路', '马太福音': '太', '马可福音': '可', '约翰福音': '约',
    // 书信别名
    '彼得前书': '彼前', '彼得后书': '彼后',
    '约翰一书': '约壹', '约翰二书': '约贰', '约翰三书': '约叁',
    '提摩太前书': '提前', '提摩太后书': '提后',
    // 历史书别名
    '撒母耳记上': '撒上', '撒母耳记下': '撒下',
    '列王纪上': '王上', '列王纪下': '王下',
    '历代志上': '代上', '历代志下': '代下',
    // 其他常见别名
    '创世': '创', '出埃及': '出', '利未': '利', '民数': '民',
    '申命': '申', '约书亚': '书', '士师': '士', '路得': '得',
    '以斯拉': '拉', '尼希米': '尼', '以斯帖': '斯',
    '约伯': '伯', '诗篇': '诗', '箴言': '箴', '传道': '传', '雅歌': '歌',
    '以赛亚': '赛', '耶利米': '耶', '哀歌': '哀', '以西结': '结',
    '但以理': '但', '何西阿': '何', '约珥': '珥', '阿摩司': '摩',
    '俄巴底亚': '俄', '约拿': '拿', '弥迦': '弥', '那鸿': '鸿',
    '哈巴谷': '哈', '西番雅': '番', '哈该': '该', '撒迦利亚': '亚',
    '玛拉基': '玛', '罗马': '罗', '哥林多前': '林前', '哥林多后': '林后',
    '加拉太': '加', '以弗所': '弗', '腓立比': '腓', '歌罗西': '西',
    '帖撒罗尼迦前': '帖前', '帖撒罗尼迦后': '帖后',
    '提多': '多', '腓利门': '门', '希伯来': '来', '雅各': '雅',
    '犹大': '犹', '启示': '启', '启示录': '启',
    // 英文别名
    'Gen': '创', 'Genesis': '创',
    'Ex': '出', 'Exodus': '出',
    'Lev': '利', 'Leviticus': '利',
    'Num': '民', 'Numbers': '民',
    'Deut': '申', 'Deuteronomy': '申',
    'Josh': '书', 'Joshua': '书',
    'Judg': '士', 'Judges': '士',
    'Ruth': '得',
    '1Sam': '撒上', '1 Samuel': '撒上', '1Sa': '撒上',
    '2Sam': '撒下', '2 Samuel': '撒下', '2Sa': '撒下',
    '1Ki': '王上', '1 Kings': '王上',
    '2Ki': '王下', '2 Kings': '王下',
    '1Ch': '代上', '1 Chronicles': '代上',
    '2Ch': '代下', '2 Chronicles': '代下',
    'Ezra': '拉', 'Neh': '尼', 'Nehemiah': '尼',
    'Esth': '斯', 'Esther': '斯',
    'Job': '伯', 'Ps': '诗', 'Psa': '诗', 'Psalms': '诗',
    'Prov': '箴', 'Proverbs': '箴',
    'Eccl': '传', 'Ecclesiastes': '传', 'Song': '歌', 'Song of Solomon': '歌',
    'Isa': '赛', 'Isaiah': '赛',
    'Jer': '耶', 'Jeremiah': '耶', 'Lam': '哀', 'Lamentations': '哀',
    'Ezek': '结', 'Ezekiel': '结',
    'Dan': '但', 'Daniel': '但',
    'Hos': '何', 'Hosea': '何', 'Joel': '珥', 'Amos': '摩',
    'Obad': '俄', 'Jonah': '拿', 'Mic': '弥', 'Micah': '弥',
    'Nah': '鸿', 'Hab': '哈', 'Zeph': '番', 'Hag': '该',
    'Zech': '亚', 'Zechariah': '亚', 'Mal': '玛', 'Malachi': '玛',
    'Matt': '太', 'Matthew': '太',
    'Mark': '可', 'Mk': '可',
    'Luke': '路', 'Lk': '路',
    'John': '约', 'Jn': '约',
    'Acts': '徒', 'Ac': '徒',
    'Rom': '罗', 'Romans': '罗',
    '1Cor': '林前', '1 Cor': '林前', '1Co': '林前',
    '2Cor': '林后', '2 Cor': '林后', '2Co': '林后',
    'Gal': '加', 'Galatians': '加',
    'Eph': '弗', 'Ephesians': '弗',
    'Phil': '腓', 'Philippians': '腓',
    'Col': '西', 'Colossians': '西',
    '1Thess': '帖前', '1 Thess': '帖前', '1Th': '帖前',
    '2Thess': '帖后', '2 Thess': '帖后', '2Th': '帖后',
    '1Tim': '提前', '1 Tim': '提前', '1Ti': '提前',
    '2Tim': '提后', '2 Tim': '提后', '2Ti': '提后',
    'Titus': '多', 'Tit': '多',
    'Philem': '门', 'Philemon': '门',
    'Heb': '来', 'Hebrews': '来',
    'Jas': '雅', 'James': '雅',
    '1Pet': '彼前', '1 Pet': '彼前', '1Pe': '彼前',
    '2Pet': '彼后', '2 Pet': '彼后', '2Pe': '彼后',
    '1John': '约壹', '1 Jn': '约壹', '1Jn': '约壹',
    '2John': '约贰', '2 Jn': '约贰', '2Jn': '约贰',
    '3John': '约叁', '3 Jn': '约叁', '3Jn': '约叁',
    'Jude': '犹',
    'Rev': '启', 'Revelation': '启',
};
for (const [alias, target] of Object.entries(BOOK_ALIASES)) {
    if (BOOK_MAP[target] && !BOOK_MAP[alias]) {
        BOOK_MAP[alias] = BOOK_MAP[target];
    }
}


const BOOK_SHORT_NAMES = BIBLE_BOOKS.map(b => b.shortName);
if (BOOK_MAP['约二'] && !BOOK_SHORT_NAMES.includes('约二')) BOOK_SHORT_NAMES.push('约二');
if (BOOK_MAP['约三'] && !BOOK_SHORT_NAMES.includes('约三')) BOOK_SHORT_NAMES.push('约三');
BOOK_SHORT_NAMES.sort((a, b) => b.length - a.length);


// ===== 智能连写解析 =====
// 正确区分章节，特别是中文数字
function parseConnectedChapterVerse(text, pos, book) {
    const remaining = text.slice(pos);
    
    // 模式1: 中文数字章节 + 阿拉伯数字节 (如 "加五22" → 第五章第22节；也支持空格分隔，如“一 1”)
    const m1 = remaining.match(/^([一二三四五六七八九十百零〇]+)[\s　]*(\d+)/);
    if (m1) {
        const chapter = parseNumber(m1[1]);
        const verse = parseInt(m1[2]);
        if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && 
            !isNaN(verse) && verse >= 1 && verse <= 176) {
            return { chapter, verse, consumed: m1[0].length };
        }
    }
    
    // 模式2: 阿拉伯数字章节 + 中文数字节 (如 "约3十二" → 第三章第12节)
    const m2 = remaining.match(/^(\d+)([一二三四五六七八九十百零〇]+)/);
    if (m2) {
        const chapter = parseInt(m2[1]);
        const verse = parseNumber(m2[2]);
        if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && 
            !isNaN(verse) && verse >= 1 && verse <= 176) {
            return { chapter, verse, consumed: m2[0].length };
        }
    }
    
    // 模式3: 纯阿拉伯数字连写 (如 "约316" → 第三章第16节)
    const m3 = remaining.match(/^(\d+)(\d+)/);
    if (m3) {
        const allDigits = m3[0];
        // 尝试不同分割方式
        for (let i = 1; i < allDigits.length; i++) {
            const chapter = parseInt(allDigits.substring(0, i));
            const verse = parseInt(allDigits.substring(i));
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && 
                !isNaN(verse) && verse >= 1 && verse <= 176) {
                return { chapter, verse, consumed: i };
            }
        }
    }
    
    // 模式4: 纯中文数字连写 (如 "约五十二" → 第五章第十二节)
    const m4 = remaining.match(/^([一二三四五六七八九十百零〇]+)([一二三四五六七八九十百零〇]+)/);
    if (m4) {
        const chapter = parseNumber(m4[1]);
        const verse = parseNumber(m4[2]);
        if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && 
            !isNaN(verse) && verse >= 1 && verse <= 176) {
            return { chapter, verse, consumed: m4[0].length };
        }
    }
    
    return null;
}

// ===== 引导词处理 =====
const REFERENCE_GUIDE_WORDS = [
    '论到', '说到', '提及', '提到', '说', '讲', '道', 
    '经上记着', '经上写着', '圣经说', '先知说', '主说'
];

function skipGuideWords(text, pos) {
    for (const word of REFERENCE_GUIDE_WORDS) {
        if (text.slice(pos).startsWith(word)) {
            return pos + word.length;
        }
    }
    return pos;
}

// ==================== 版本数据配置 ====================
const VERSION_MAP = {
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

// 圣经数据托管在仓库 main 分支的 data/ 目录，通过 raw 地址分发。
// 以后再修数据：只需更新 data/ 下的文件 + 改仓库根目录 bible-data-manifest.json 里的
// dataVersion / size / sha256 / changes，然后 git push；用户端启动时会自动检测到并提示。
const DATA_RAW_BASE = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/main/data/';
const DATA_MANIFEST_URL = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/main/bible-data-manifest.json';

const DEFAULT_VERSIONS = [
    { key: 'CRV', name: '恢复本（推荐）', file: 'bible-crv-data.json', url: DATA_RAW_BASE + 'bible-crv-data.json' },
    { key: 'CUVS', name: '简体新标点和合本（主流）', file: 'bible-cuvs-data.json', url: DATA_RAW_BASE + 'bible-cuvs-data.json' }
];

// ==================== 工具函数 ====================
function chineseToNumber(s) {
    const numMap = { '零':0,'〇':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'百':100 };
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
function isChineseNumber(s) { return /^[一二三四五六七八九十百零〇]+$/.test(s); }
function parseNumber(s) {
    s = s.trim();
    if (/^\d+$/.test(s)) return parseInt(s);
    if (isChineseNumber(s)) return chineseToNumber(s);
    return NaN;
}

// ==================== 更新日志内容 ====================
const CHANGELOG_CONTENT = {
    '3.1.5': `## [3.1.5] - 2026-10-19

### 修复
- **单章书卷的裸节号不识别**：修复“犹19~21”“俄3”这类写法不识别或识别成错误经文的问题。犹大书、俄巴底亚书、约翰二书、约翰三书、腓利门书等单章书卷，名字后面直接跟节号时一律按第 1 章该节解析（顺带修正“约叁13”被错拆成 1:3 的老问题）
- **「约三19~20」被误认为约翰三书**：修复以普通数字结尾的书卷别名（约二 / 约三）与「约翰福音 + 章号」之间的歧义。这类别名后面紧跟节号时，按“约翰福音三章十九节”解析；约翰二书 / 约翰三书仍可用「约贰」「约叁」书写，独立出现的“约三”也仍是约翰三书
- **诗篇长篇节号被截断**：修复“诗一一九105、130”被误认成诗 11:9 的问题。连写解析的节号上限由 100 放宽到 176，长篇诗篇（如 119 篇）的大节号可正常识别
- **破折号后省略书卷名的引用不识别**：修复“难处—二14~15，三12~17”“殉道者—五14~15”“范围里—十四31~35”这类写法完全不识别的问题。破折号（– — ‐）现在与空白、左括号一样可作为引用的起始边界，书卷沿用上文最后出现的书卷
- **弱引用的书卷归属错误**：修复行首 / 行内弱引用自己写了书卷名（如“赛四二4”）时，高亮归属被错挂到上文书卷的问题

### 改进
- **识别解析更稳健**：本轮共 41 项解析测试全部通过，其中包含 5 组反馈用例的原文复现（跨段落上下文、单章书卷、别名歧义、长篇节号、破折号边界），回归用例无破坏
`,
    '3.1.4': `## [3.1.4] - 2026-10-16

### 新增
- **历史更新记录**：新增「历史更新记录」弹窗，按版本号倒序折叠展示全部历史版本的更新说明，最新版本在最上方，当前版本标注「（当前版本）」；弹窗底部「🔄 重新获取」可清空缓存并重新从 GitHub 拉取完整的 CHANGELOG.md
- **历史更新记录的三个入口**：「设置 → 插件更新 → 🗂️ 查看历史更新记录」按钮、更新成功 / 更新说明弹窗底部的「📜 查看历史更新记录」按钮，以及命令面板中的「查看历史更新记录」命令
- **离线也能看历史**：内置更新日志（2.0.0 ~ 3.1.3）随插件一起发布，未联网时直接展示；联网后自动合并 GitHub 上的完整记录，同版本号以内置内容为准

### 修复
- **中文数字「〇」不识别**：修复“诗篇一百一十九篇一百〇九节”这类写法被截断的问题（原来会误判为 119:100），现已支持「〇」按 0 参与中文数字计算
- **“至”未作为范围分隔符**：修复“歌罗西书一章二十五至二十八节”只识别到“一章二十五”的问题。现在“至”与「～ ~ - －」一样表示范围，且范围结束后的「节」字会一并纳入高亮
- **范围后的同章延续丢失**：修复“以弗所书三章八至十一节，四节”这类写法中后半截不识别的问题，现在可正确得到弗 3:8-11 与弗 3:4
- **“X章X节”延续项被误拆**：修复“约翰福音六章五十七节下，十四章十九节”中后半截被连写解析误拆为 10:4 的问题；同时修掉跨章连写解析中一处捕获组写错导致的崩溃隐患

### 改进
- **更新日志渲染统一**：抽出共用的日志渲染逻辑，单版本更新说明与历史更新记录使用同一套渲染，避免两处显示不一致
`,
    '3.1.3': `## [3.1.3] - 2026-10-15

### 修复
- **侧边栏窄宽布局优化**：修复 Obsidian 侧边栏较窄时，全局操作按钮（全局全选 / 全局取消 / 全局复制 / 逐节 / 并列 / 混合投影）被挤出画面的问题。按钮组改为 flex 自适应换行，输入框右侧按钮不再被压缩，确保桌面端窄边栏和移动端都能正常显示
- **混合投影字体大小调节无效**：修复混合投影模式下投影工具栏字号调节不起作用的问题。原因是 updateFontSize() 没有更新混合模式专用的 .bible-proj-mixed-text / .bible-proj-mixed-ref，现已补齐
- **书卷 / 章节选择网格自适应**：书卷列表与章节列表从固定 6 列改为 repeat(auto-fill, minmax(46px, 1fr))，容器变窄时自动减少列数，避免按钮被挤出侧边栏
- **搜索框行自适应**：输入框与按钮整行允许换行，极窄窗口下「查询」按钮可自动换到第二行；输入框最小宽度压缩到 35px，更窄的侧边栏也能放得下
- **投影底部工具栏被遮盖**：工具栏按钮全部改为符号 / 图标，并大幅压缩按钮尺寸；左右翻页始终固定在两端，中间按钮在窄窗口自动换行成两行显示，不再被挤出画面
- **标签栏窄屏按钮被挤出**：侧边栏较窄时，标签栏的「对照」「专注」按钮会被挤出画面。现在会实时检测标签栏是否溢出，溢出时自动隐藏「搜索 / 阅读」的文字只保留图标，并缩小按钮宽度与间距；窗口大小足够时恢复完整显示

### 改进
- **标签页图标化**：「圣经搜索」「圣经阅读」标签页改为图标 + 文字（放大镜图标 + 搜索 / 书签图标 + 阅读）
- **阅读页顶部快速跳转改为点击选择**：书卷名与章数改为带 ▼ 的胶囊按钮，点击书卷名弹出按旧约 / 新约双列分组的书卷菜单，点击章数弹出网格章节菜单，当前所在书卷 / 章节高亮；菜单会自动避开窗口边界，窄侧边栏下也不再超出可视区。书卷名带序号（如 38. 撒迦利亚书），章数显示去掉「第」字
- **本页操作布局统一**：搜索页与阅读页的「本页操作」统一为可折叠区块（与「全局操作」一致），前面加「本页操作」标签，按钮精简为两个字（全选 / 复制 / 经文 / 纲目），宽度与全局操作按钮一致
- **字体调节入口调整**：移除阅读页独立的「字体：− / +」行，改为「全局操作」标题右侧的字体图标按钮，点击后弹出字号调节面板
- **返回按钮精简**：「← 返回书卷」「← 返回章节」统一改为「返回」，去掉箭头
- **章节列表页书卷选择**：章节列表页顶部的书卷名也改为可点击，点击后直接弹出书卷选择菜单，不必再返回上一级
- **投影工具栏符号化**：字号按钮由 A− / A+ 改为 − / +；重置改为旋转箭头图标；居中改为对齐图标（开启时蓝色高亮）；检索改为放大镜图标（分屏检索时切换为全屏图标）；主题切换由月亮 / 太阳图标表示
`,
    '3.1.2': `## [3.1.2] - 2026-10-12

### 新增
- **圣经数据更新检测与一键更新**：插件本体的自动更新只会下载 main.js / manifest.json / styles.css，不会带上十几 MB 的圣经数据文件，因此数据需要单独一套版本机制。启动时（自动检测开启，12 小时节流一次）拉取云端清单 bible-data-manifest.json，与本地已安装数据版本比对；发现修正版即弹出常驻通知，提供「查看详情 / 立即更新 / 稍后」。「查看详情」列出本次具体改了什么（如修复了哪些经文）。确认后自动下载覆盖，覆盖前把旧数据备份为 <file>.old，完成后自动重新加载圣经数据。
- **手动检查数据更新**：新增「检查圣经数据更新」命令，以及「设置 → 圣经版本管理 → 🔍 检查数据更新」按钮，可随时联网检查。

### 修复
- **内置圣经数据下载地址过时**：修正恢复本 / 和合本两个默认版本的下载地址。原先写死指向 2.0.0 的 Release 附件，会下载到修复前的旧数据；现在统一指向仓库 main 分支的 data/ 目录。

### 数据
- **恢复本（bible-crv-data.json）**：修复 79 节经文正文被误并入上一节导致检索不到的问题（如林后5:7）；补齐林后6:17、6:18 与约叁1:15 等章末缺失经文；修正 2 处章号错标；补回诗49:8、诗104:8；补充 12 处「节合并」标注；清理 8 处行尾残留标记；规范化 rawLine 29 条。
- **和合本（bible-cuvs-data.json）**：补入约书亚记、雅歌、阿摩司书、那鸿书 4 卷共 970 节（原文件仅 62 卷）；补写 71 处「节合并」说明；按恢复本分节边界修正 6 处（代上21/22、约7/8、启12/13、诗8、赛4）；全书按书卷顺序重排。
`,
    '3.1.1': `## [3.1.1] - 2026-10-12

### 新增
- **经文弹窗「保留候选」**：弹窗工具条新增「保留候选」开关（默认关闭）。勾选后，弹窗中勾选的经文会实时进入候选池，可与其它经文弹窗、圣经搜索、圣经阅读的选中项一起按顺序投影；取消勾选某节也会即时移出候选池。
- **弹窗显示选中顺序**：弹窗中每处经文前显示全局选中序号（候选池在前，其后是圣经搜索 / 圣经阅读及本弹窗的选中项），序号与投影顺序一致。
- **弹窗投影按钮**：新增「投影」按钮，点击后给出「逐节 / 并列 / 混合」三种投影模式；投影内容为全局选中项（候选池 + 各页面选中），投影前自动关闭弹窗。
- **复制范围选择**：当候选池或其它页面也有选中经文时，点击弹窗「复制」会弹出「本页复制 / 全局复制」选项；仅本弹窗有勾选时直接复制，不再多一步选择。

### 修复
- **三个窗口各自保留候选**：修复取消勾选「保留候选」后经文弹窗的选中项被清空的问题。现在经文弹窗、圣经搜索、圣经阅读三个窗口各自保留自己的候选：取消勾选时候选池中的弹窗候选项归还给弹窗（弹窗关闭后也不丢失，重新打开仍保持勾选与序号），检索页 / 阅读页的候选项各自留在原窗口。
- **各窗口投影互不干扰**：未勾选「保留候选」时，在哪个窗口点「投影」就只投影哪个窗口的内容（原先在经文弹窗中点投影会把圣经搜索 / 圣经阅读的选中项一起投出来）；勾选「保留候选」后才按全局顺序合并投影。复制的范围同样按此规则处理。
- **经文弹窗显示选中顺序**：修复弹窗中不显示选中顺序的问题。现在每处经文前都会显示顺序徽标——未勾选「保留候选」时按本弹窗独立编号（从 1 开始），勾选后按全局顺序编号，与投影顺序一致。
- **弹窗「保留候选」计数与清空按钮逻辑**：修复弹窗标题栏候选数与「清空」按钮的出现逻辑，现在与圣经搜索 / 圣经阅读一致——勾选「保留候选」时按候选池总数显示（三个窗口看到同一个数字），未勾选时各窗口独立、只统计本弹窗自己的候选；有候选时才出现「清空」按钮。
- **各经文弹窗独立统计**：修复未勾选「保留候选」时，多处经文引用的弹窗选中数字被累计的问题。现在每处经文引用（弹窗）各自独立编号、都从 1 开始，互不干扰，关闭再打开仍然保留。
- **弹窗「清空」改为整体清空**：修复点击经文弹窗「清空」只清掉弹窗、却不清其它页面的问题。现在一次清空经文弹窗、圣经搜索、圣经阅读三个窗口的全部候选（含所有经文弹窗的候选库），并给出相应提示。
- **浅色模式下弹窗看不清**：修复浅色主题下经文弹窗的候选框与选中状态几乎不可见的问题。弹窗挂在页面根节点，原先取不到检索视图作用域里的主题色，导致选中框背景变透明、白色顺序数字显示在白底上；现在弹窗自带一套随主题切换的颜色变量（浅色用更深的青色与更深的描边），选中框、顺序数字、「并」标签在浅色下都清晰可辨。
- **任何方式更新都显示更新内容**：修复通过 Obsidian 第三方插件市场、BRAT 或手动覆盖安装更新后看不到新版本更新说明的问题。现在启动时会自动比对「上次记录的版本」与当前版本号，只要版本发生变化就弹出最新版的更新说明（内置更新日志优先，缺失时自动从 GitHub 拉取），与插件自带的更新功能互不冲突、也不会重复弹；全新安装仍只显示首次运行引导。

### 改进
- **全选 / 取消合并为一个按钮**：弹窗的「全选」「取消」合并为同一按钮，未全选时显示「全选」，已全选时自动切换为「取消」，节省工具条空间。
- **弹窗标题栏集成候选操作**：「保留候选」复选框移到弹窗顶部经文出处后面，右侧显示候选数量，并在有候选时提供「清空」按钮（与圣经搜索 / 圣经阅读一致，整体清空三个窗口的候选）。
- **弹窗选中状态与圣经搜索 / 圣经阅读一致**：候选框改用与两个页面相同的方框——未选中是空框，选中后在框内直接显示选中顺序数字，不再出现「打勾 + 数字」重复显示。
- **弹窗新增「并」标签**：每节经文后面提供与圣经搜索 / 圣经阅读相同样式与交互的「并」标签，点击切换「✓ 并列」（混合投影时与前一节合并到同一页）；勾选「保留候选」时并列状态同步进候选池，取消勾选后仍保留在弹窗自己的候选里。
- **可随时回看更新说明**：新增「查看当前版本的更新说明」命令，以及「设置 → 插件更新 → 📜 查看」按钮，随时可以再打开当前版本的更新内容；更新说明弹窗的小标题也修复了浅色 / 深色下取不到主题色的问题。
`,
    '3.1.0': `
## [3.1.0] - 2026-10-12

### 新增
- **「保留候选」复选框**：在圣经检索与圣经阅读视图的「全局操作」标题右侧新增「保留候选」开关（默认关闭）。勾选后，在检索页面重新搜索、或在阅读页面切换书卷/章节时，之前已选中的候选经文会按顺序保留在候选池中（主版本与对照版本均保留），并按原有顺序继续追加新选择，便于跨检索/跨书卷按顺序投影连续内容。
- **候选计数与一键清空**：「保留候选」右侧实时显示已保留的候选数量，并提供「清空」按钮，可随时清空保留的候选经文。
- **投影内打开检索**：投影模式底部操作栏新增「🔍 检索」按钮。点击后投影不关闭，缩为左下角预览窗口并打开插件检索窗口，可在其中检索并选中新经文，再点击「逐节/并列/混合投影」即可更新投影内容并恢复全屏。
- **经文弹窗工具条**：阅读视图中单击经文出处打开的弹窗新增字体增大/缩小、全选、取消、复制按钮，并记住弹窗字体大小；每处经文前新增候选框，勾选后可复制选中内容；双击弹窗中的经文出处可跳转到圣经阅读页对应经文位置。

### 修复
- **候选池改为实时更新**：勾选「保留候选」后，每选中一处经文就立即按序进入候选池，候选数量与序号即时刷新（原先只在重新搜索 / 切换章节 / 切换标签页时才冻结入池）；取消勾选已选项会立即从候选池移除；全选操作与刚勾选开关时已有的选中项同样立即纳入。
- **未安装版本残留**：修复对照版本列表中出现「1919 原版官话和合本 未安装」等从未提供过数据的版本的问题，现在只保留已安装版本与默认可下载版本。
- **更新弹窗无更新简介**：修复更新成功后弹窗不显示新版本更新简介的问题，现在优先读取内置更新日志，缺失时自动从 GitHub 拉取对应版本的更新说明。
- **切换标签页丢失候选**：修复勾选「保留候选」后，圣经搜索最后一次搜索结果中选中的经文在切换到圣经阅读时未被保留、导致阅读页新选经文序号回退的问题；现在切换标签页（以及从经文弹窗跳转到阅读页）同样会按原顺序冻结已选中的经文。
- **取消「保留候选」后序号不从 1 开始**：取消勾选时会把候选池按来源归还到检索页 / 阅读页，两个视图都从 1 重新编号。
- **「保留候选」两处开关不同步**：检索页与阅读页现在共用同一个开关状态。
- **投影按钮在暗色下看不清**：底部工具栏改用「文字 + 符号」（A− / A+ / 重置 / 居中 / 🔍 检索 / ✕），加大字号与按钮尺寸；暗色下为纯白文字 + 更亮描边与底色，亮色下为深色文字 + 深色描边，「居中」开启时高亮为蓝色，翻页圆钮 ◀ ▶ 同步放大。
- **投影内检索改为右侧分屏**：原先点击「🔍 检索」会把投影缩成左下角小窗，每次更新内容都要缩小再放大、视觉跳动。现在投影保持满屏高度，只把宽度收窄到「视口宽度 − 右侧边栏宽度」，右侧正好空出侧边栏显示圣经检索；在侧边栏改选经文后点投影，内容原地更新、尺寸不变；需要时点底部「⛶ 全屏」恢复满屏。侧边栏拖动改宽或窗口缩放时投影宽度自动跟随。
- **经文出处跨行 / 跨段落无法识别**：只写章节没写书卷的引用（如「一1～二3」「四章一节」「二章一节」）现在会沿用本文档前文中最后出现的书卷，跨行、跨段落都不再丢失；章号改用前一处的结束章（「路一1-二2」之后的「4」＝路加福音 2:4）；同一行内的弱引用不再被后面出现的书卷名带偏（「一1，路一1-二2」的「一1」＝创世记 1:1）；成串弱引用「一2，一3，二4」一次高亮。换文档或重新渲染时上下文重置，不会串到别的笔记。
`,
    '3.0.2': `
## [3.0.2] - 2026-09-26

### 移动端交互优化
- **单击打开经文弹窗**：经文出处由“悬停显示”改为“单击打开”经文弹窗
- **点击外部关闭弹窗**：点击弹窗以外的区域即关闭弹窗（点击引用本身或弹窗内部不关闭）
- **双击跳转阅读**：双击经文出处跳转到圣经阅读视图并定位到对应经文
`,
    '3.0.1': `
## [3.0.1] - 2026-09-24

### 变更
- **移除 Node.js fs 直接文件系统访问**：版本数据扫描、读取、下载与删除统一改用 Obsidian 的 Vault Adapter API，桌面端与移动端共用同一代码路径
- **移除 styles.css 中全部 !important**：改用更高优先级的选择器覆盖样式

### 文档
- **README**：新增英文概述、安装步骤和基本使用说明

### 修复
- 修复桌面端通过 fs 回退读取版本数据时与 vault adapter 路径重复的问题
- 修复投影模式切换字体大小时，主题/纲目引用颜色可能被内联灰色覆盖的问题
`,
    '3.0.0': `
## [3.0.0] - 2026-09-01

### 新增
- **文章内圣经引用自动高亮**：阅读笔记时，自动识别文中的圣经引用并高亮显示
- **智能引用解析器**：支持多种中文圣经引用格式，覆盖绝大多数实际使用场景
- **悬停显示经文**：鼠标悬停在引用上，弹出 tooltip 显示对应经文内容
- **点击跳转阅读视图**：点击引用自动跳转到圣经阅读侧边栏并高亮定位

### 支持的引用格式
- 标准格式：约3:16、约翰福音3:16、约壹一5
- 中文量词：彼前二章二十三节、诗篇二十篇三节
- 连写格式：诗一一九15、赛四二4
- 范围引用：哀三22～24、弗六17～18
- 同章多节：启二4、7
- 半节标记：利一9下、赛五三2上
- 书卷别名与承前省略
`,
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
// ==================== 更新日志渲染（UpdateModal / 历史更新记录弹窗共用）====================
// 行内粗体 **...** 渲染
function renderInlineMarkdown(container, text) {
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

// 去掉日志开头的「## [版本号] - 日期」标题行（历史记录里该信息已在折叠标题显示）
function stripVersionHeading(content) {
    return String(content || '').replace(/^[ \t]*##[ \t]*[^\n]*\n?/, '');
}

// 将 Markdown 形式的更新说明渲染到容器：## 版本标题、### 分类小标题、- 列表项
function renderChangelogInto(container, content) {
    const lines = (content || '').trim().split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === '---') continue;
        if (trimmed.startsWith('## ')) {
            container.createEl('h3', { text: trimmed.replace('## ', '') });
        } else if (trimmed.startsWith('### ')) {
            const h4 = container.createEl('h4', { text: trimmed.replace('### ', '') });
            h4.style.color = 'var(--bible-accent)';
            h4.style.marginTop = '12px';
        } else if (trimmed.startsWith('- ')) {
            const div = container.createDiv({ attr: { style: 'margin-left:12px;margin-bottom:4px;' } });
            div.createEl('span', { text: '• ', attr: { style: 'margin-right:4px;' } });
            renderInlineMarkdown(div, trimmed.slice(2));
        } else if (trimmed) {
            const div = container.createDiv();
            renderInlineMarkdown(div, trimmed);
        }
    }
}

class UpdateModal extends Modal {
    constructor(app, plugin, version, content, title) {
        super(app);
        this.plugin = plugin || null;
        this.version = version;
        this.content = content || CHANGELOG_CONTENT[this.version] || '';
        // title 为空时按「已更新至 vX」显示（自动弹出场景）；手动查看时传入自定义标题
        this.customTitle = title || '';
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        // 弹窗挂在页面根节点，需自带主题色（否则小标题的强调色会失效）
        if (contentEl.classList) contentEl.classList.add('bible-update-modal');
        contentEl.style.padding = '24px';
        contentEl.style.maxWidth = '600px';

        contentEl.createEl('h2', { text: this.customTitle || ('🎉 Bible Search and Reader 已更新至 v' + this.version) });
        const body = contentEl.createDiv();
        body.style.marginTop = '16px';
        body.style.lineHeight = '1.8';
        body.style.fontSize = '14px';

        if (!this.content || !this.content.trim()) {
            const emptyEl = body.createEl('div', { cls: 'setting-item-description', text: '暂无该版本的更新说明，可查看插件目录下的 CHANGELOG.md。' });
            emptyEl.style.color = 'var(--text-muted)';
        } else {
            renderChangelogInto(body, this.content);
        }

        const btnWrap = contentEl.createDiv();
        btnWrap.style.display = 'flex';
        btnWrap.style.justifyContent = 'center';
        btnWrap.style.gap = '8px';
        btnWrap.style.marginTop = '20px';
        // 更新成功后可继续翻看全部历史版本说明
        if (this.plugin) {
            const histBtn = btnWrap.createEl('button', { text: '📜 查看历史更新记录' });
            histBtn.title = '按版本号倒序查看历次更新的完整说明';
            histBtn.addEventListener('click', () => this.plugin.showChangelogHistory());
        }
        const okBtn = btnWrap.createEl('button', { cls: 'mod-cta', text: '知道了' });
        okBtn.addEventListener('click', () => this.close());
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ==================== 历史更新记录弹窗 ====================
// 汇总「内置更新日志 + GitHub 上的 CHANGELOG.md」，按版本号倒序展示所有历史版本，
// 供「设置 → 插件更新」与更新成功弹窗共用。每个版本折叠，默认展开最新一条。
class ChangelogHistoryModal extends Modal {
    constructor(app, plugin, entries) {
        super(app);
        this.plugin = plugin || null;
        this.entries = entries || [];
        this._closed = false;
    }

    // 远端日志到达后原地刷新内容；弹窗已关闭则忽略
    setEntries(entries) {
        if (this._closed) return;
        this.entries = entries || [];
        this.render();
    }

    onOpen() { this.render(); }

    render() {
        const { contentEl } = this;
        contentEl.empty();
        if (contentEl.classList) contentEl.classList.add('bible-update-modal', 'bible-changelog-history');
        contentEl.style.padding = '24px';
        contentEl.style.maxWidth = '680px';

        contentEl.createEl('h2', { text: '📜 历史更新记录' });
        const currentVersion = this.plugin && this.plugin.manifest ? this.plugin.manifest.version : '';

        const meta = contentEl.createEl('div', { cls: 'setting-item-description' });
        meta.style.margin = '8px 0 12px';
        meta.setText(this.entries.length
            ? ('共 ' + this.entries.length + ' 个版本，最新版本在最上方；点击版本号展开 / 收起。')
            : '暂无可显示的更新记录。');

        if (!this.entries.length) {
            const emptyEl = contentEl.createEl('div', { cls: 'setting-item-description', text: '未找到内置更新日志，联网后可从 GitHub 拉取完整的 CHANGELOG.md。' });
            emptyEl.style.color = 'var(--text-muted)';
        } else {
            const listEl = contentEl.createDiv({ cls: 'bible-changelog-history-list' });
            listEl.style.maxHeight = '58vh';
            listEl.style.overflowY = 'auto';
            listEl.style.border = '1px solid var(--background-modifier-border)';
            listEl.style.borderRadius = '6px';
            listEl.style.padding = '8px 12px';
            for (let i = 0; i < this.entries.length; i++) {
                const entry = this.entries[i];
                const det = listEl.createEl('details');
                det.style.padding = '6px 0';
                det.style.borderBottom = (i === this.entries.length - 1) ? 'none' : '1px solid var(--background-modifier-border)';
                if (i === 0) det.setAttribute('open', 'true');
                const isCurrent = currentVersion && String(entry.version) === String(currentVersion);
                const summary = det.createEl('summary');
                summary.style.cursor = 'pointer';
                summary.style.fontWeight = isCurrent ? '700' : '600';
                summary.setText(this.versionTitle(entry) + (isCurrent ? '　（当前版本）' : ''));
                const body = det.createDiv();
                body.style.marginTop = '8px';
                body.style.lineHeight = '1.8';
                body.style.fontSize = '14px';
                if (!entry.content) {
                    const e = body.createEl('div', { cls: 'setting-item-description', text: '暂无该版本的更新说明，可查看插件目录下的 CHANGELOG.md。' });
                    e.style.color = 'var(--text-muted)';
                } else {
                    renderChangelogInto(body, stripVersionHeading(entry.content));
                }
            }
        }

        const btnWrap = contentEl.createDiv();
        btnWrap.style.display = 'flex';
        btnWrap.style.justifyContent = 'flex-end';
        btnWrap.style.gap = '8px';
        btnWrap.style.marginTop = '16px';
        const refreshBtn = btnWrap.createEl('button', { text: '🔄 重新获取' });
        refreshBtn.title = '清空缓存并重新从 GitHub 拉取完整的更新日志';
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.setAttribute('disabled', 'true');
            refreshBtn.setText('获取中...');
            try {
                if (this.plugin) this.plugin._remoteChangelogCache = null;
                const entries = this.plugin ? await this.plugin.getChangelogHistory() : [];
                this.setEntries(entries);
                new Notice(entries.length ? ('已获取 ' + entries.length + ' 个版本的更新记录') : '未获取到更新记录，请检查网络');
            } catch (e) {
                new Notice('获取失败：' + (e && e.message ? e.message : e));
            } finally {
                if (!this._closed) {
                    refreshBtn.removeAttribute('disabled');
                    refreshBtn.setText('🔄 重新获取');
                }
            }
        });
        const closeBtn = btnWrap.createEl('button', { cls: 'mod-cta', text: '关闭' });
        closeBtn.addEventListener('click', () => this.close());
    }

    // 从日志正文里取「版本标题 + 日期」，如 "## [3.1.3] - 2026-10-15" → "v3.1.3　2026-10-15"
    versionTitle(entry) {
        const lines = (entry.content || '').split('\n');
        for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith('## ')) continue;
            const title = t.replace(/^##\s*/, '');
            const dm = title.match(/^\[?([0-9][0-9.]*)\]?\s*[-–—]?\s*(.*)$/);
            if (dm) {
                const ver = dm[1];
                const rest = (dm[2] || '').trim();
                return 'v' + ver + (rest ? ('　' + rest) : '');
            }
            return title;
        }
        return 'v' + entry.version;
    }

    onClose() {
        this._closed = true;
        this.contentEl.empty();
    }
}

// ==================== 圣经数据更新弹窗 ====================
// 列出每个待更新数据文件的版本号、大小与本次变更说明，由用户确认后再下载。
class DataUpdateModal extends Modal {
    constructor(app, plugin, pending) {
        super(app);
        this.plugin = plugin;
        this.pending = pending;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.classList.add('bible-update-modal');
        contentEl.createEl('h2', { text: '📖 圣经数据有可用更新' });
        for (const item of this.pending) {
            contentEl.createEl('h3', { text: item.name + '（' + item.key + '）' });
            const meta = contentEl.createEl('div', { cls: 'setting-item-description' });
            meta.setText('最新版本 ' + (item.dataVersion || '未知') + '　大小 ' + this.fmtSize(item.size));
            const ul = contentEl.createEl('ul');
            const chs = item.changes || [];
            for (const c of chs) ul.createEl('li', { text: c });
            if (!chs.length) ul.createEl('li', { text: '数据修正' });
        }
        const btnWrap = contentEl.createDiv();
        btnWrap.style.display = 'flex';
        btnWrap.style.gap = '8px';
        btnWrap.style.marginTop = '16px';
        const updateBtn = btnWrap.createEl('button', { text: '⬇️ 立即更新', cls: 'mod-cta' });
        const cancelBtn = btnWrap.createEl('button', { text: '稍后' });
        updateBtn.addEventListener('click', async () => {
            this.close();
            await this.plugin.updateBibleData(this.pending);
        });
        cancelBtn.addEventListener('click', () => this.close());
    }
    fmtSize(n) {
        if (!n) return '未知';
        return (n / 1024 / 1024).toFixed(1) + ' MB';
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

        const checkDataBtn = containerEl.createEl('button', { cls: 'bible-small-btn', text: '🔍 检查数据更新' });
        checkDataBtn.style.marginBottom = '12px';
        checkDataBtn.style.marginLeft = '8px';
        checkDataBtn.title = '联网比对云端清单，检查已安装的圣经数据是否有修正版';
        checkDataBtn.addEventListener('click', async () => {
            checkDataBtn.setAttribute('disabled', 'true');
            checkDataBtn.setText('检查中...');
            await this.plugin.checkBibleDataUpdateAndNotify(true);
            checkDataBtn.removeAttribute('disabled');
            checkDataBtn.setText('🔍 检查数据更新');
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
        new Setting(containerEl)
            .setName('查看更新说明')
            .setDesc('随时查看当前版本 v' + (this.plugin.manifest?.version || '') + ' 的更新内容')
            .addButton(button => button
                .setButtonText('📜 查看')
                .onClick(async () => {
                    button.setDisabled(true);
                    await this.plugin.showCurrentChangelog();
                    button.setDisabled(false);
                }));
        new Setting(containerEl)
            .setName('查看历史更新记录')
            .setDesc('按版本号倒序查看历次更新的完整说明（优先内置日志，联网时可补齐 GitHub 上的全部记录）')
            .addButton(button => button
                .setButtonText('🗂️ 查看')
                .onClick(() => this.plugin.showChangelogHistory()));

    
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

            // 数据文件位于 vault 内的 .obsidian/plugins/ 目录，桌面端与移动端均通过 vault adapter 读取，无需直接访问文件系统
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
        match = s.match(/^([一二三四五六七八九十百零〇]+):(\d+)$/);
        if (match) {
            const ch = chineseToNumber(match[1]);
            const vs = parseInt(match[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        match = s.match(/^([一二三四五六七八九十百零〇]+)(\d+)$/);
        if (match) {
            const ch = chineseToNumber(match[1]);
            const vs = parseInt(match[2]);
            if (!isNaN(ch) && ch > 0 && vs > 0) return { chapter: ch, verse: vs };
        }
        match = s.match(/^(\d+)([一二三四五六七八九十百零〇]+)$/);
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
        m = token.match(/^([一二三四五六七八九十百零〇]+)(\d+)-(\d+)$/);
        if (m) {
            const ch = chineseToNumber(m[1]);
            const vs = parseInt(m[2]);
            const endVs = parseInt(m[3]);
            if (!isNaN(ch) && ch > 0 && vs > 0 && endVs > 0) {
                ranges.push({ bookId: bookId, startChapter: ch, startVerse: vs, endChapter: ch, endVerse: endVs });
                return ranges;
            }
        }
        m = token.match(/^([一二三四五六七八九十百零〇]+)(\d+)$/);
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
        m = token.match(/^([一二三四五六七八九十百零〇]+)$/);
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
        m = token.match(/^([一二三四五六七八九十百零〇]+)-([一二三四五六七八九十百零〇]+)$/);
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
    constructor(app, plugin, results, mode, showSource) {
        this.app = app;
        this.plugin = plugin;
        // 所有模式都接收完整的选中数据；分组逻辑在 buildSlides 中处理
        this.results = results.filter(r => r.selected).sort((a, b) => a.order - b.order);
        this.mode = mode;
        this.showSource = showSource !== false;
        this.currentSlide = 0;
        this.slides = [];
        this.fontSize = 48;
        this.isDark = true;
        this.isCentered = false;
        this.isSearchMode = false;
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
        topCenter.style.cssText = 'font-size:12px;opacity:0.75;text-align:center;flex:1;';
        topCenter.setText('← → 翻页  ·  +/- 字体  ·  T 主题  ·  检索  ·  ESC 关闭');
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
        // 按钮使用「文字 + 符号」而非纯符号，暗色/亮色下都能看清
        const addToolBtn = (text, action, title, extraCls) => {
            return toolCenter.createEl('button', {
                cls: 'bible-proj-tool-btn' + (extraCls ? ' ' + extraCls : ''),
                text: text,
                attr: { 'data-action': action, title: title }
            });
        };
        addToolBtn('−', 'font-smaller', '缩小字体', 'bible-proj-tool-icon');
        toolCenter.createEl('span', { cls: 'bible-proj-font-size', text: this.fontSize + 'px' });
        addToolBtn('+', 'font-larger', '放大字体', 'bible-proj-tool-icon');
        const resetBtn = addToolBtn('', 'font-reset', '重置字体', 'bible-proj-tool-icon');
        setIcon(resetBtn, 'rotate-ccw');
        if (this.mode !== 'focus') {
            const centerBtn = addToolBtn('', 'toggle-centered', '切换居中', 'bible-proj-tool-icon');
            setIcon(centerBtn, 'align-center');
        }
        const themeBtn = addToolBtn('', 'toggle-theme', '切换主题', 'bible-proj-tool-icon');
        setIcon(themeBtn, this.isDark ? 'moon' : 'sun');
        const searchBtn = addToolBtn('', 'open-search', '打开检索窗口（不关闭投影）', 'bible-proj-tool-icon');
        setIcon(searchBtn, 'search');
        addToolBtn('✕', 'close', '关闭投影', 'bible-proj-tool-emoji');

        const nextBtn = bottomRow.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-next', text: '▶' });
        this.overlay.appendChild(bottomBar);

        document.body.appendChild(this.overlay);
        if (this.plugin) this.plugin.currentProjection = this;
        this.bindEvents(toolCenter, bottomRow);
        this.renderSlide();
    }

    bindEvents(toolCenter, bottomRow) {
        toolCenter.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'close') this.close();
            else if (action === 'open-search') this.toggleSearchMode();
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
        // 宽度/最大宽度交给 CSS（min(900px, 92%)），侧边栏模式与全屏模式都能自适应
        wrapper.style.cssText = 'text-align:center;padding:20px;margin:auto;overflow-y:auto;max-height:100%;';

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
                    
                    const textDiv = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-mixed-text', text: this.getItemContent(item) });
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
        this.overlay.querySelectorAll('.bible-proj-focus-ref').forEach(el => {
            el.style.fontSize = (this.fontSize * 0.6) + 'px';
            // 主题/纲目引用的颜色由 CSS 控制（.bible-proj-focus-theme-ref / -outline-ref），不在此覆盖
            if (!el.classList.contains('bible-proj-focus-theme-ref') && !el.classList.contains('bible-proj-focus-outline-ref')) {
                el.style.color = this.isDark ? '#a0a0a0' : '#666';
            }
        });
        this.overlay.querySelectorAll('.bible-proj-parallel-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-ref').forEach(el => {
            el.style.fontSize = (this.fontSize * 0.55) + 'px';
            // 主题/纲目引用（对照版）的颜色由 CSS 控制，不在此覆盖
            if (!el.classList.contains('bible-proj-parallel-theme-ref') && !el.classList.contains('bible-proj-parallel-outline-ref')) {
                el.style.color = this.isDark ? '#a0a0a0' : '#666';
            }
        });
        this.overlay.querySelectorAll('.bible-proj-focus-theme').forEach(el => { el.style.fontSize = (this.fontSize * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-theme-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline').forEach(el => { el.style.fontSize = (this.fontSize * 0.95) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-theme-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85 * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-compare-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.75) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-compare-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.5) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-mixed-text').forEach(el => { el.style.fontSize = this.fontSize + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-mixed-ref').forEach(el => {
            el.style.fontSize = (this.fontSize * 0.6) + 'px';
            el.style.color = this.isDark ? '#a0a0a0' : '#666';
        });
        // 幻灯片宽度由 CSS 控制（min(900px, 92%)），分屏/全屏都能自适应，无需在此改写
    }

    toggleCentered() {
        this.isCentered = !this.isCentered;
        const btn = this.overlay.querySelector('[data-action="toggle-centered"]');
        if (btn) btn.classList.toggle('active', this.isCentered);
        this.renderSlide();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        const btn = this.overlay.querySelector('[data-action="toggle-theme"]');
        if (btn) {
            btn.empty();
            setIcon(btn, this.isDark ? 'moon' : 'sun');
            btn.title = this.isDark ? '切换到亮色' : '切换到暗色';
        }
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
        this.unwatchSidebar();
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        document.removeEventListener('keydown', this.keyHandler);
        if (this.plugin && this.plugin.currentProjection === this) this.plugin.currentProjection = null;
    }

    // ===== 投影内打开检索窗口（不关闭投影）=====
    // 不再缩成左下角小窗：投影区保持全高、只把宽度收窄，右侧正好空出侧边栏显示圣经检索；
    // 在侧边栏里改选经文后点投影，内容原地更新（不再来回放大缩小），点「⛶ 全屏」才恢复全屏。
    toggleSearchMode() {
        if (this.isSearchMode) this.exitSearchMode();
        else this.enterSearchMode();
        this.updateSearchBtn();
    }

    async enterSearchMode() {
        this.isSearchMode = true;
        const o = this.overlay;
        o.style.width = '100vw';
        o.style.height = '100vh';
        o.style.top = '0';
        o.style.bottom = '0';
        o.style.left = '0';
        o.style.right = 'auto';
        o.style.zIndex = '9999';
        o.classList.add('bible-proj-search-mode');
        // 在右侧边栏打开插件检索窗口并切到「圣经搜索」标签
        if (this.plugin) await this.plugin.activateSearchView();
        const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
        for (const leaf of leaves) {
            const v = leaf.view;
            if (v && typeof v.switchTab === 'function') v.switchTab('search');
        }
        // 等侧边栏完成布局后再按实际宽度收窄投影区
        this.applySplitLayout();
        setTimeout(() => this.applySplitLayout(), 120);
        this.watchSidebar();
        new Notice('已在右侧打开圣经检索；改选内容后点投影即可原地更新，点「全屏」按钮恢复全屏');
    }

    exitSearchMode() {
        this.isSearchMode = false;
        const o = this.overlay;
        o.style.width = '100vw';
        o.style.height = '100vh';
        o.style.top = '0';
        o.style.bottom = '0';
        o.style.left = '0';
        o.style.right = 'auto';
        o.style.zIndex = '9999';
        o.classList.remove('bible-proj-search-mode');
        this.unwatchSidebar();
        this.updateFontSize();
    }

    // 承载圣经检索视图的右侧边栏容器
    getSidebarEl() {
        try {
            const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
            for (const leaf of leaves) {
                const el = leaf && leaf.view && leaf.view.containerEl;
                if (!el) continue;
                const split = el.closest('.workspace-split') || el.closest('.sidebar-content');
                if (split) return split;
            }
        } catch (e) { /* 忽略，走下面的兜底 */ }
        return document.querySelector('.mod-right-split');
    }

    getSidebarWidth() {
        const el = this.getSidebarEl();
        if (el && el.getBoundingClientRect) {
            const w = el.getBoundingClientRect().width;
            if (w > 120) return Math.round(w);
        }
        return Math.min(420, Math.round(window.innerWidth * 0.3));
    }

    // 按右侧边栏的实际宽度收窄投影区（保持全高，不做缩放动画）
    applySplitLayout() {
        if (!this.isSearchMode || !this.overlay) return;
        const sw = this.getSidebarWidth();
        const projW = Math.max(360, window.innerWidth - sw);
        this.overlay.style.width = projW + 'px';
        this.overlay.style.maxWidth = 'none';
    }

    // 侧边栏被拖动改变宽度、或窗口尺寸变化时，投影区跟随
    watchSidebar() {
        this.unwatchSidebar();
        const el = this.getSidebarEl();
        if (el && typeof ResizeObserver !== 'undefined') {
            this._sidebarObserver = new ResizeObserver(() => this.applySplitLayout());
            this._sidebarObserver.observe(el);
        }
        this._resizeHandler = () => this.applySplitLayout();
        window.addEventListener('resize', this._resizeHandler);
    }

    unwatchSidebar() {
        if (this._sidebarObserver) {
            this._sidebarObserver.disconnect();
            this._sidebarObserver = null;
        }
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
    }

    updateSearchBtn() {
        const btn = this.overlay.querySelector('[data-action="open-search"]');
        if (btn) {
            btn.empty();
            setIcon(btn, this.isSearchMode ? 'maximize' : 'search');
            btn.title = this.isSearchMode ? '恢复全屏投影' : '打开检索窗口（不关闭投影）';
        }
    }

    // 用新的选中内容替换当前投影内容（原地更新，保持当前分屏/全屏状态，避免画面缩放跳动）
    reloadResults(results, mode) {
        this.results = results.filter(r => r.selected).sort((a, b) => a.order - b.order);
        this.mode = mode;
        this.currentSlide = 0;
        this.slides = [];
        this.buildSlides();
        this.renderSlide();
        const modeEl = this.overlay.querySelector('.bible-proj-mode-name');
        if (modeEl) modeEl.textContent = this.getModeName();
        const pageEl = this.overlay.querySelector('.bible-proj-page-num');
        if (pageEl) pageEl.textContent = '1/' + this.slides.length + '页';
        this.updateSearchBtn();
        // 分屏状态下保持宽度不变，仅刷新内容
        if (this.isSearchMode) this.applySplitLayout();
        new Notice('已更新投影内容');
    }
}

// ==================== 侧边栏圣经视图 ====================
const BIBLE_SEARCH_VIEW_TYPE = 'bible-search-view';

// 候选项的唯一标识：检索页 / 阅读页 / 经文弹窗三处共用同一套规则，
// 保证同名经文在不同窗口之间能正确去重、同步。
function verseIdentity(item, isCompare) {
    if (!item) return '';
    return (isCompare ? 'cmp|' : 'main|') + item.versionKey + '|' + item.bookId + '|' +
        item.chapter + '|' + item.verse + '|' + item.type + '|' + item.content;
}

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
        // 「保留候选」：重新搜索 / 切换书卷章节 / 切换标签页时是否保留已选中的候选经文
        // 两个标签页共用同一个开关状态，取消勾选时会把候选池归还到各自视图并从 1 重新编号
        this.keepCandidates = false;
        // 候选池：跨检索 / 跨书卷章节 / 跨标签页保留的候选经文（勾选「保留候选」后使用）
        // 每项：{ key, item, isCompare, sideBySide, source: 'search' | 'reader' }
        this.candidatePool = [];
        // 候选池变更计数：用于判断检索页结果区是否需要重绘（切换标签页时避免多余重绘）
        this._poolVersion = 0;
        this._renderedPoolVersion = 0;
        this._lastReaderChapterKey = null;
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
    async onClose() {
        if (this._tabResizeObserver) {
            this._tabResizeObserver.disconnect();
            this._tabResizeObserver = null;
        }
        if (this._tabResizeHandler) {
            window.removeEventListener('resize', this._tabResizeHandler);
            this._tabResizeHandler = null;
        }
    }

    buildTabs() {
        const tabBar = this.container.createDiv({ cls: 'bible-tab-bar' });
        this.tabBar = tabBar;
        this.tabSearch = tabBar.createEl('button', { cls: 'bible-tab active' });
        setIcon(this.tabSearch, 'search');
        this.tabSearch.createSpan({ cls: 'bible-tab-text', text: '搜索' });
        this.tabReader = tabBar.createEl('button', { cls: 'bible-tab' });
        setIcon(this.tabReader, 'book-marked');
        this.tabReader.createSpan({ cls: 'bible-tab-text', text: '阅读' });

        this.tabSearch.addEventListener('click', () => this.switchTab('search'));
        this.tabReader.addEventListener('click', () => this.switchTab('reader'));

        this.compareBtn = tabBar.createEl('button', { cls: 'bible-compare-toggle-btn', text: '对照' });
        this.compareBtn.addEventListener('click', () => this.toggleComparePanel());

        this.focusModeBtn = tabBar.createEl('button', { cls: 'bible-focus-mode-btn', text: '专注' });
        this.focusModeBtn.addEventListener('click', () => this.toggleFocusMode());

        this.setupTabOverflowWatch();
    }

    // 标签栏窄屏自适应：溢出时隐藏「搜索 / 阅读」文字只保留图标并缩小按钮宽度，
    // 保证右侧「对照 / 专注」不被挤出画面；窗口足够时自动恢复完整显示
    setupTabOverflowWatch() {
        requestAnimationFrame(() => this.updateTabBarCompact());
        if (typeof ResizeObserver !== 'undefined') {
            this._tabResizeObserver = new ResizeObserver(() => this.updateTabBarCompact());
            this._tabResizeObserver.observe(this.tabBar);
        }
        this._tabResizeHandler = () => this.updateTabBarCompact();
        window.addEventListener('resize', this._tabResizeHandler);
    }

    updateTabBarCompact() {
        if (!this.tabBar) return;
        // 先还原到完整状态再测量，避免在已精简的状态下误判（窗口变宽时能及时恢复）
        const wasCompact = this.tabBar.classList.contains('compact');
        if (wasCompact) this.tabBar.classList.remove('compact');
        if (this.tabBar.scrollWidth > this.tabBar.clientWidth + 1) {
            this.tabBar.classList.add('compact');
        }
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

        const defaultVersionKeys = DEFAULT_VERSIONS.map(dv => dv.key);

        for (let i = 0; i < versions.length; i++) {
            const ver = versions[i];
            // 跳过既未安装、又不是默认可下载版本的条目（如残留的未安装版本）
            if (!ver.installed && !defaultVersionKeys.includes(ver.key)) continue;

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
        // 勾选「保留候选」时，切换标签页也要把当前标签页已选中的候选经文冻结进候选池，
        // 否则最后一次搜索结果中选中、之后才切走的项会丢失（编号不会继续往后累加）
        if (this.keepCandidates && this.activeTab && this.activeTab !== tab) {
            this.freezeSelections(this.activeTab === 'reader' ? 'reader' : 'search');
            if (this.activeTab === 'search' && this.resultsContainer) this.renderResults();
        }
        this.activeTab = tab;
        this.tabSearch.classList.toggle('active', tab === 'search');
        this.tabReader.classList.toggle('active', tab === 'reader');
        if (this.searchPanel) this.searchPanel.style.display = tab === 'search' ? 'flex' : 'none';
        if (this.readerPanel) this.readerPanel.style.display = tab === 'reader' ? 'flex' : 'none';
        if (tab === 'reader') this.renderReader();
        // 候选池在别的标签页被改动过（冻结 / 移除 / 释放）时，回到检索页需要重绘结果区
        if (tab === 'search' && this.resultsContainer && this._poolVersion !== this._renderedPoolVersion) {
            this.renderResults();
        }
        this.updateFocusModeBtn();
        this.updateKeepCandidatesUI();
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

    // ==================== 候选池（保留候选）====================
    // 勾选「保留候选」后，选中/取消选中会**实时**同步到候选池：
    // 每选中一处经文就立即按序进入候选池，计数与序号即时更新；
    // 重新搜索 / 切换书卷章节 / 切换标签页只是把局部选中的镜像清掉，内容始终由候选池保留。
    // 取消勾选时，候选池按来源归还到检索页 / 阅读页，并从 1 重新编号。

    identityOfItem(item, isCompare) {
        return verseIdentity(item, isCompare);
    }

    getPoolEntry(item, isCompare) {
        const key = this.identityOfItem(item, !!isCompare);
        return this.candidatePool.find(p => p.key === key) || null;
    }

    poolIndexOf(item, isCompare) {
        const key = this.identityOfItem(item, !!isCompare);
        return this.candidatePool.findIndex(p => p.key === key);
    }

    poolAdd(item, isCompare, sideBySide, source, sessionKey) {
        if (!item) return;
        const key = this.identityOfItem(item, !!isCompare);
        if (this.candidatePool.some(p => p.key === key)) return;
        this.candidatePool.push({
            key: key, item: item, isCompare: !!isCompare, sideBySide: !!sideBySide,
            source: source || 'search', sessionKey: sessionKey || null
        });
        this._poolVersion++;
    }

    poolRemoveAt(idx) {
        if (idx >= 0 && idx < this.candidatePool.length) { this.candidatePool.splice(idx, 1); this._poolVersion++; }
    }

    poolClear() {
        if (this.candidatePool.length > 0) this._poolVersion++;
        this.candidatePool = [];
    }

    // 检索页当前选中项（按本地顺序）
    getSearchSelections() {
        const list = [];
        for (const r of this.results) {
            if (r.selected) list.push({ item: r.item, selected: true, order: r.order, sideBySide: !!r.sideBySide, _isCompare: false });
        }
        for (const c of this.getCompareSelected()) list.push(c);
        list.sort((a, b) => a.order - b.order);
        return list;
    }

    // 阅读页当前选中项（按本地顺序）
    getReaderSelections() {
        return this.readerResults.filter(r => r.selected).sort((a, b) => a.order - b.order).map(r => Object.assign({}, r));
    }

    // 候选池 + 当前视图选中项，合并后的全局顺序
    getAllSelections() {
        const list = [];
        let n = 0;
        for (const p of this.candidatePool) {
            n++;
            list.push({
                item: p.item,
                selected: true,
                order: n,
                sideBySide: !!p.sideBySide,
                _isCompare: !!p.isCompare,
                versionKey: p.isCompare ? p.item.versionKey : undefined
            });
        }
        const current = this.activeTab === 'reader' ? this.getReaderSelections() : this.getSearchSelections();
        for (const r of current) {
            if (this.poolIndexOf(r.item, !!r._isCompare) !== -1) continue;
            n++;
            list.push(Object.assign({}, r, { order: n }));
        }
        return list;
    }

    // ==================== 实时同步（勾选「保留候选」后，选中即入池）====================

    // 单项选中：勾选「保留候选」时立即进入候选池，序号与计数实时更新
    // sessionKey：经文弹窗专用——记录该候选项属于哪一处引用（取消勾选时按引用归还）
    poolSyncSelect(item, isCompare, sideBySide, source, sessionKey) {
        if (!this.keepCandidates || !item) return;
        const src = source || (this.activeTab === 'reader' ? 'reader' : 'search');
        this.poolAdd(item, !!isCompare, !!sideBySide, src, sessionKey);
        this.updateKeepCandidatesUI();
    }

    // 单项取消：把该项移出候选池（局部选中的清理由调用方负责）
    poolSyncDeselect(item, isCompare) {
        const idx = this.poolIndexOf(item, !!isCompare);
        if (idx !== -1) this.poolRemoveAt(idx);
    }

    // 更新候选池已有项的「并」（并列）状态（经文弹窗的「并」标签用）
    poolSetSideBySide(item, isCompare, sideBySide) {
        const idx = this.poolIndexOf(item, !!isCompare);
        if (idx === -1) return false;
        this.candidatePool[idx].sideBySide = !!sideBySide;
        this._poolVersion++;
        return true;
    }

    // 批量同步：把指定视图当前的局部选中全部纳入候选池（全选 / 刚勾选开关时使用）
    poolSyncCurrentView(source) {
        if (!this.keepCandidates) return;
        const src = source || (this.activeTab === 'reader' ? 'reader' : 'search');
        const current = src === 'reader' ? this.getReaderSelections() : this.getSearchSelections();
        for (const r of current) this.poolAdd(r.item, !!r._isCompare, !!r.sideBySide, src);
        this.updateKeepCandidatesUI();
    }

    // 冻结当前选中项到候选池（保留候选开启时调用），并清空当前视图的局部选中
    freezeSelections(source) {
        const src = source || (this.activeTab === 'reader' ? 'reader' : 'search');
        const current = src === 'reader' ? this.getReaderSelections() : this.getSearchSelections();
        for (const r of current) this.poolAdd(r.item, !!r._isCompare, !!r.sideBySide, src);
        if (src === 'reader') {
            this.clearReaderLocalSelection();
        } else {
            this.clearSearchLocalSelection();
        }
        this.updateKeepCandidatesUI();
    }

    // 清空检索页的局部选中（不动候选池）
    clearSearchLocalSelection() {
        for (const r of this.results) { r.selected = false; r.sideBySide = false; r.order = 0; }
        this.compareSelections = {};
        this.cmpOrder = [];
        this.selectCounter = 0;
    }

    // 清空阅读页的局部选中（不动候选池）
    clearReaderLocalSelection() {
        this.readerResults = [];
        this.readerSelectCounter = 0;
    }

    // 切换「保留候选」开关：两个标签页共用同一状态
    // 关闭时把候选池中的内容归还到各自视图（检索页 / 阅读页），并从 1 重新开始编号
    setKeepCandidates(on) {
        const next = !!on;
        const prev = !!this.keepCandidates;
        this.keepCandidates = next;
        this.syncKeepCandidatesCheckboxes();
        if (prev && !next) {
            // 关闭：把候选池归还到各自视图并从 1 重新编号
            this.releasePoolToViews();
        } else if (!prev && next) {
            // 开启：把两个视图当前已选中的经文立即纳入候选池，让序号与计数实时生效
            const first = this.activeTab === 'reader' ? 'reader' : 'search';
            this.poolSyncCurrentView(first);
            this.poolSyncCurrentView(first === 'reader' ? 'search' : 'reader');
            this.updateKeepCandidatesUI();
        }
        this.refreshCurrentView();
        this.updateKeepCandidatesUI();
    }

    syncKeepCandidatesCheckboxes() {
        if (!this.contentEl) return;
        const boxes = this.contentEl.querySelectorAll('.bible-keep-candidates input[type="checkbox"]');
        boxes.forEach(cb => { cb.checked = !!this.keepCandidates; });
    }

    // 取消「保留候选」：候选池中的项按来源归还到检索页 / 阅读页的局部选中，
    // 归还项排在最前，其后接原有局部选中，统一从 1 连续编号
    releasePoolToViews() {
        const pool = this.candidatePool.slice();
        if (pool.length === 0) return;
        this.candidatePool = [];
        this._poolVersion++;
        this._restoreSearchOrder = 0;
        this._restoreReaderOrder = 0;

        // 先保存两个视图现有的局部选中（按原顺序）
        const searchLocal = this.getSearchSelections();
        const readerLocal = this.getReaderSelections().filter(r => r.selected);
        this.clearSearchLocalSelection();
        this.clearReaderLocalSelection();

        let sOrder = 0;
        let rOrder = 0;
        for (const p of pool) {
            if (p.source === 'tooltip') {
                // 经文弹窗的候选项按引用归还给对应弹窗（弹窗关闭时也依然保留），并保留「并」状态
                this.plugin.tooltipPoolAdd(p.item, p.sideBySide, p.sessionKey);
                continue;
            }
            if (p.source === 'reader') {
                if (this.restoreReaderEntry(p)) rOrder++;
            } else {
                if (this.restoreSearchEntry(p)) sOrder++;
            }
        }
        // 原有局部选中接在归还项之后
        for (const s of searchLocal) {
            if (this.restoreSearchEntry({ item: s.item, isCompare: !!s._isCompare, sideBySide: !!s.sideBySide })) sOrder++;
        }
        for (const r of readerLocal) {
            if (this.restoreReaderEntry({ item: r.item, isCompare: !!r._isCompare, sideBySide: !!r.sideBySide })) rOrder++;
        }
        this.selectCounter = sOrder;
        this.readerSelectCounter = rOrder;
        this.recalcOrders();
        this.recalcReaderOrders();
    }

    // 把一个候选项归还到检索页的局部选中（仅当前搜索结果中仍存在的项），成功返回 true
    restoreSearchEntry(p) {
        if (!p || !p.item) return false;
        if (!p.isCompare) {
            const r = this.results.find(x => x.item === p.item);
            if (!r || r.selected) return false;
            r.selected = true;
            r.sideBySide = !!p.sideBySide;
            r.order = ++this._restoreSearchOrder;
            return true;
        }
        const idx = this.results.findIndex(x =>
            x.item.bookId === p.item.bookId && x.item.chapter === p.item.chapter &&
            x.item.verse === p.item.verse && x.item.type === p.item.type);
        if (idx === -1) return false;
        const cmpKey = `cmp-${idx}-${p.item.versionKey}`;
        if (this.compareSelections[cmpKey] && this.compareSelections[cmpKey].selected) return false;
        this.compareSelections[cmpKey] = { selected: true, sideBySide: !!p.sideBySide, order: ++this._restoreSearchOrder };
        if (!this.cmpOrder.includes(cmpKey)) this.cmpOrder.push(cmpKey);
        return true;
    }

    // 把一个候选项归还到阅读页的局部选中，成功返回 true
    restoreReaderEntry(p) {
        if (!p || !p.item) return false;
        if (!p.isCompare) {
            const existing = this.readerResults.find(r =>
                !r._isCompare && r.item.bookId === p.item.bookId && r.item.chapter === p.item.chapter &&
                r.item.verse === p.item.verse && r.item.type === p.item.type && r.item.content === p.item.content);
            if (existing) {
                if (existing.selected) return false;
                existing.selected = true;
                existing.sideBySide = !!p.sideBySide;
                existing.order = ++this._restoreReaderOrder;
                return true;
            }
            this.readerResults.push({
                item: p.item,
                selected: true,
                order: ++this._restoreReaderOrder,
                sideBySide: !!p.sideBySide,
                _isCompare: false
            });
            return true;
        }
        // 对照版本：需要找到主版本对应的行以生成 cmpKey
        const primaryKey = this.getReaderPrimaryVersion();
        const parent = this.plugin.allItems.find(i =>
            i.versionKey === primaryKey && i.bookId === p.item.bookId && i.chapter === p.item.chapter &&
            i.verse === p.item.verse && i.type === p.item.type);
        const cmpKey = `rd-cmp-${parent ? parent.lineIndex : p.item.lineIndex}-${p.item.versionKey}`;
        const existing = this.readerResults.find(r => r._cmpKey === cmpKey);
        if (existing) {
            if (existing.selected) return false;
            existing.selected = true;
            existing.sideBySide = !!p.sideBySide;
            existing.order = ++this._restoreReaderOrder;
            return true;
        }
        this.readerResults.push({
            item: p.item,
            selected: true,
            order: ++this._restoreReaderOrder,
            sideBySide: !!p.sideBySide,
            _isCompare: true,
            _cmpKey: cmpKey,
            versionKey: p.item.versionKey
        });
        return true;
    }

    // 刷新当前可见视图的选中显示
    refreshCurrentView() {
        if (!this.contentEl) return;
        if (this.activeTab === 'reader') {
            this.refreshAllReaderCards();
        } else {
            this.renderResults();
        }
    }

    // 某一项的展示状态（是否选中 / 展示序号 / 是否并列）
    getSelectionState(item, isCompare, localSelected, localOrder, localSideBySide) {
        const idx = this.poolIndexOf(item, isCompare);
        if (idx !== -1) {
            const p = this.candidatePool[idx];
            return { selected: true, order: idx + 1, sideBySide: !!p.sideBySide, fromPool: true, poolIdx: idx };
        }
        if (localSelected) {
            return { selected: true, order: this.candidatePool.length + (localOrder || 0), sideBySide: !!localSideBySide, fromPool: false, poolIdx: -1 };
        }
        return { selected: false, order: 0, sideBySide: false, fromPool: false, poolIdx: -1 };
    }

    clearPoolAndRefresh() {
        this.poolClear();
        if (this.activeTab === 'reader') {
            this.readerResults = [];
            this.readerSelectCounter = 0;
            this.refreshAllReaderCards();
        } else {
            for (const r of this.results) { r.selected = false; r.sideBySide = false; r.order = 0; }
            this.compareSelections = {};
            this.cmpOrder = [];
            this.selectCounter = 0;
            this.renderResults();
        }
        this.updateKeepCandidatesUI();
    }

    // 整体清空：候选池 + 圣经搜索 + 圣经阅读的选中项（经文弹窗的「清空」按钮用）
    clearAllSelections() {
        this.poolClear();
        this.clearSearchLocalSelection();
        this.clearReaderLocalSelection();
        this.selectCounter = 0;
        this.readerSelectCounter = 0;
        this.refreshCurrentView();
        this.updateKeepCandidatesUI();
    }

    updateKeepCandidatesUI() {
        if (!this.contentEl) return;
        const n = this.candidatePool.length;
        const counts = this.contentEl.querySelectorAll('.bible-keep-candidates-count');
        counts.forEach(el => { el.setText(n > 0 ? '(' + n + ')' : ''); });
        const clears = this.contentEl.querySelectorAll('.bible-keep-candidates-clear');
        clears.forEach(el => { el.style.display = n > 0 ? 'inline-block' : 'none'; });
    }

    // 在「全局操作」标题右侧构建「保留候选」复选框 + 计数 + 清空按钮
    // 检索页与阅读页共用同一个开关状态（this.keepCandidates）
    buildKeepCandidatesControl(header) {
        const label = header.createEl('label', { cls: 'bible-keep-candidates' });
        label.style.cssText = 'display:flex;align-items:center;gap:4px;margin-left:auto;font-size:12px;color:var(--text-muted);cursor:pointer;user-select:none;';
        const cb = label.createEl('input', { type: 'checkbox', attr: { title: '选中的经文实时进入候选池，跨检索 / 跨章节 / 跨标签页保留' } });
        label.createSpan({ text: '保留候选' });
        label.createSpan({ cls: 'bible-keep-candidates-count', text: '' });
        const clearBtn = label.createEl('button', { cls: 'bible-small-btn bible-keep-candidates-clear', text: '清空' });
        clearBtn.style.cssText = 'font-size:11px;padding:1px 6px;margin-left:2px;line-height:1.4;';
        clearBtn.title = '清空已保留的候选经文';
        cb.checked = !!this.keepCandidates;
        cb.addEventListener('change', () => { this.setKeepCandidates(cb.checked); });
        cb.addEventListener('click', (e) => e.stopPropagation());
        label.addEventListener('click', (e) => e.stopPropagation());
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clearPoolAndRefresh();
            new Notice('已清空保留的候选经文');
        });
        this.updateKeepCandidatesUI();
        return label;
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
            // 勾选「保留候选」时，先把当前已选中的候选经文冻结进候选池，再清空结果
            if (this.keepCandidates) this.freezeSelections('search');
            else { this.poolClear(); this.updateKeepCandidatesUI(); }
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
        // 「保留候选」复选框：勾选后重新搜索时保留已选中的候选经文
        this.buildKeepCandidatesControl(actionHeader);
        const actionBody = actionSection.createDiv({ cls: 'bible-action-grid' });
        actionHeader.addEventListener('click', () => {
            const isCollapsed = actionBody.style.display === 'none';
            actionBody.style.display = isCollapsed ? 'flex' : 'none';
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

        const pageActionSection = fixedTop.createDiv({ cls: 'bible-section' });
        const pageActionHeader = pageActionSection.createDiv({ cls: 'bible-section-header' });
        const pageActionIcon = pageActionHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        pageActionHeader.createEl('span', { text: '本页操作' });
        const pageActionBody = pageActionSection.createDiv({ cls: 'bible-action-grid' });
        pageActionHeader.addEventListener('click', () => {
            const isCollapsed = pageActionBody.style.display === 'none';
            pageActionBody.style.display = isCollapsed ? 'flex' : 'none';
            pageActionIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        const pageSelectAllBtn = pageActionBody.createEl('button', { cls: 'bible-action-btn', text: '全选' });
        const pageCopyBtn = pageActionBody.createEl('button', { cls: 'bible-action-btn', text: '复制' });

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

        // 勾选「保留候选」时，把当前已选中的候选经文（主版本 + 对照）按原顺序冻结进候选池，
        // 重新搜索后依然保留，并可继续按原顺序追加新选择
        if (this.keepCandidates) this.freezeSelections('search');

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
        this.updateKeepCandidatesUI();
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
        this._renderedPoolVersion = this._poolVersion;
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

            // 选中状态：可能来自当前视图，也可能来自「保留候选」的候选池
            const selState = this.getSelectionState(item, false, !!result.selected, result.order, result.sideBySide);

            const card = this.resultsContainer.createDiv({ cls: 'bible-result-card' + (selState.selected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : '') });
            const cardHeader = card.createDiv({ cls: 'bible-result-header' });
            const checkbox = cardHeader.createDiv({ cls: 'bible-result-checkbox' + (selState.selected ? ' checked' : '') });
            if (selState.selected) checkbox.setText(String(selState.order));

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

            if (selState.selected) {
                const sideTag = card.createDiv({ cls: 'bible-side-tag' + (selState.sideBySide ? ' active' : '') });
                sideTag.setText(selState.sideBySide ? '✓ 并列' : '并');
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
                    // 选中状态：可能来自当前视图，也可能来自「保留候选」的候选池
                    const cmpState = this.getSelectionState(cmp.item, true, !!(cmpSelection && cmpSelection.selected), cmpSelection ? cmpSelection.order : 0, cmpSelection ? cmpSelection.sideBySide : false);
                    
                    // 对照行容器：左列(复选框+并列标签) + 右列(经文文字)
                    const cmpRow = card.createDiv({ cls: 'bible-compare-row' + (cmpState.selected ? ' selected' : '') });
                    
                    // 左列：复选框 + 并列标签上下排列
                    const cmpLeftCol = cmpRow.createDiv({ cls: 'bible-compare-left-col' });
                    
                    // 复选框（与主版本相同的样式）
                    const cmpCb = cmpLeftCol.createDiv({ cls: 'bible-result-checkbox' + (cmpState.selected ? ' checked' : '') });
                    if (cmpState.selected) {
                        cmpCb.setText(String(cmpState.order));
                    }
                    
                    // 点击复选框切换选中
                    cmpCb.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleCompareSelection(globalIdx, cmp);
                    });
                    
                    // 并列标签（仅在选中时显示，与主版本卡片一致）
                    if (cmpState.selected) {
                        const cmpSideTag = cmpLeftCol.createDiv({ cls: 'bible-side-tag' + (cmpState.sideBySide ? ' active' : '') });
                        cmpSideTag.setText(cmpState.sideBySide ? '✓ 并列' : '并');
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
        
        // 取消选中：同时移出候选池并清除局部选中（勾选「保留候选」时两者是镜像关系）
        const poolIdx = this.poolIndexOf(cmp.item, true);
        if (poolIdx !== -1 || this.compareSelections[cmpKey]) {
            if (poolIdx !== -1) this.poolRemoveAt(poolIdx);
            delete this.compareSelections[cmpKey];
            // 从顺序数组中移除
            const idx = this.cmpOrder.indexOf(cmpKey);
            if (idx !== -1) this.cmpOrder.splice(idx, 1);
        } else {
            // 新选中时记录当前选中计数作为顺序
            this.compareSelections[cmpKey] = { selected: true, sideBySide: false, order: this.selectCounter + 1 };
            this.cmpOrder.push(cmpKey);  // 记录插入顺序
            this.selectCounter++;
            // 勾选「保留候选」时实时进入候选池，计数立即更新
            this.poolSyncSelect(cmp.item, true, false, 'search');
        }
        
        // 重新计算所有选中项的连续序号
        this.recalcOrders();
        this.updateKeepCandidatesUI();
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
        // 取消选中：同时移出候选池并清除局部选中（勾选「保留候选」时两者是镜像关系）
        const poolIdx = this.poolIndexOf(result.item, false);
        if (poolIdx !== -1 || result.selected) {
            if (poolIdx !== -1) this.poolRemoveAt(poolIdx);
            result.selected = false;
            result.sideBySide = false;
            result.order = 0;
        } else {
            this.selectCounter++;
            result.selected = true;
            result.order = this.selectCounter;
            // 勾选「保留候选」时实时进入候选池，计数立即更新
            this.poolSyncSelect(result.item, false, false, 'search');
        }
        this.recalcOrders();
        this.updateKeepCandidatesUI();
        this.renderResults();
    }

    toggleSideBySide(index) {
        const result = this.results[index];
        if (!result) return;
        const poolIdx = this.poolIndexOf(result.item, false);
        if (poolIdx !== -1) {
            const p = this.candidatePool[poolIdx];
            p.sideBySide = !p.sideBySide;
            if (result) result.sideBySide = p.sideBySide;
            this.renderResults();
            return;
        }
        if (result && result.selected) { result.sideBySide = !result.sideBySide; this.renderResults(); }
    }

    toggleCompareSideBySide(parentIdx, cmp) {
        const cmpKey = `cmp-${parentIdx}-${cmp.versionKey}`;
        const poolIdx = this.poolIndexOf(cmp.item, true);
        if (poolIdx !== -1) {
            const p = this.candidatePool[poolIdx];
            p.sideBySide = !p.sideBySide;
            if (this.compareSelections[cmpKey]) this.compareSelections[cmpKey].sideBySide = p.sideBySide;
            this.renderResults();
            return;
        }
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
        // 勾选「保留候选」时，全选的经文实时进入候选池
        this.poolSyncCurrentView('search');
        this.updateKeepCandidatesUI();
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
        this.poolClear();  // 同时清空保留的候选
        this.updateKeepCandidatesUI();
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
        // 勾选「保留候选」时，本页选中的经文实时进入候选池
        this.poolSyncCurrentView('search');
        this.updateKeepCandidatesUI();
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
        // 全局复制：候选池中保留的候选项排在前面，其后是当前视图选中的项
        this.copySelected(this.getAllSelections());
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
        // 本页包含的经文（主版本 + 其对照版本）
        const pageKeys = new Set();
        for (const result of paged) {
            pageKeys.add(this.identityOfItem(result.item, false));
            if (this.hasCompareMode() && result.item.type === 'verse') {
                for (const cmp of this.findCompareItems(result.item.bookId, result.item.chapter, result.item.verse, result.item.type)) {
                    pageKeys.add(this.identityOfItem(cmp.item, true));
                }
            }
        }
        const selected = this.getAllSelections().filter(s => pageKeys.has(this.identityOfItem(s.item, !!s._isCompare)));
        this.copySelected(selected);
    }

    openProjection(mode) {
        // 候选池中保留的候选项排在前面，其后是当前视图选中的项
        this.projectSelections(this.getAllSelections(), mode);
    }

    // 投影一组指定的选中项（供经文弹窗等外部入口调用）
    projectSelections(list, mode) {
        const selected = (list || []).filter(r => r && r.selected).sort((a, b) => (a.order || 0) - (b.order || 0));
        if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
        // 若已有投影（例如通过「检索」进入的分屏模式），直接复用并更新内容，避免叠加覆盖层
        if (this.plugin.currentProjection) {
            this.plugin.currentProjection.reloadResults(selected, mode);
            return;
        }
        const overlay = new BibleProjectionOverlay(this.app, this.plugin, selected, mode, true);
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
        // 切换回书卷列表时，清空之前书卷的选中状态（勾选「保留候选」时先冻结进候选池）
        if (this.keepCandidates) this.freezeSelections('reader');
        this.readerResults = [];
        this.readerSelectCounter = 0;
        this.updateKeepCandidatesUI();

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
        const backBtn = nav.createEl('button', { cls: 'bible-reader-nav-btn', text: '返回' });
        backBtn.addEventListener('click', () => { this.readerState = 'books'; this.renderReader(); });
        const titleGroup = nav.createEl('span', { cls: 'bible-reader-nav-title' });
        const bookLabel = titleGroup.createEl('span', { cls: 'bible-reader-nav-pill', text: book.id + '. ' + book.fullName });
        bookLabel.createEl('span', { cls: 'bible-reader-nav-caret', text: ' ▼' });
        bookLabel.addEventListener('click', () => this.showBookPicker(bookLabel));
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

        // 只保留当前书卷的选中状态（切换书卷时自动过滤掉旧书卷）；
        // 勾选「保留候选」时改为把已选中的候选经文按原顺序冻结进候选池，跨书卷/章节累计保留
        const chapterKey = book.id + ':' + chapter;
        if (this._lastReaderChapterKey !== chapterKey) {
            if (this.keepCandidates) {
                this.freezeSelections('reader');
            } else {
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
            }
            this._lastReaderChapterKey = chapterKey;
        }

        const compareVersions = this.getCompareVersions();
        const hasCompare = compareVersions.length > 0;

        const nav = this.readerFixedTop.createDiv({ cls: 'bible-reader-nav-row' });
        const backBtn = nav.createEl('button', { cls: 'bible-reader-nav-btn', text: '返回' });
        backBtn.addEventListener('click', () => { this.readerState = 'chapters'; this.renderReader(); });
        const titleGroup = nav.createEl('span', { cls: 'bible-reader-nav-title' });
        const bookLabel = titleGroup.createEl('span', { cls: 'bible-reader-nav-pill', text: book.id + '. ' + book.fullName });
        bookLabel.createEl('span', { cls: 'bible-reader-nav-caret', text: ' ▼' });
        const chapterLabel = titleGroup.createEl('span', { cls: 'bible-reader-nav-pill', text: chapter + '章' });
        chapterLabel.createEl('span', { cls: 'bible-reader-nav-caret', text: ' ▼' });
        bookLabel.addEventListener('click', () => this.showBookPicker(bookLabel));
        chapterLabel.addEventListener('click', () => this.showChapterPicker(chapterLabel, book));

        // 全局操作区块（模仿搜索视图的折叠区块）
        const actionSection = this.readerFixedTop.createDiv({ cls: 'bible-section bible-action-section' });
        const actionHeader = actionSection.createDiv({ cls: 'bible-section-header' });
        const actionIcon = actionHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        actionHeader.createEl('span', { text: '全局操作' });
        // 字体大小按钮（点击弹出调节面板）
        const fontSizeBtn = actionHeader.createEl('button', { cls: 'bible-section-font-btn', attr: { title: '字体大小' } });
        setIcon(fontSizeBtn, 'type');
        fontSizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showFontSizePicker(fontSizeBtn);
        });
        // 「保留候选」复选框：勾选后切换书卷/章节时保留已选中的候选经文
        this.buildKeepCandidatesControl(actionHeader);
        const actionBody = actionSection.createDiv({ cls: 'bible-action-grid' });
        actionHeader.addEventListener('click', () => {
            const isCollapsed = actionBody.style.display === 'none';
            actionBody.style.display = isCollapsed ? 'flex' : 'none';
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

        // 本页操作区块（参照全局操作的可折叠布局）
        const pageActionSection = this.readerFixedTop.createDiv({ cls: 'bible-section' });
        const pageActionHeader = pageActionSection.createDiv({ cls: 'bible-section-header' });
        const pageActionIcon = pageActionHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        pageActionHeader.createEl('span', { text: '本页操作' });
        const pageActionBody = pageActionSection.createDiv({ cls: 'bible-action-grid' });
        pageActionHeader.addEventListener('click', () => {
            const isCollapsed = pageActionBody.style.display === 'none';
            pageActionBody.style.display = isCollapsed ? 'flex' : 'none';
            pageActionIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        const pageSelectAllBtn = pageActionBody.createEl('button', { cls: 'bible-action-btn', text: '全选' });
        const pageCopyBtn = pageActionBody.createEl('button', { cls: 'bible-action-btn', text: '复制' });
        const copyVersesBtn = pageActionBody.createEl('button', { cls: 'bible-action-btn', text: '经文' });
        const copyOutlinesBtn = pageActionBody.createEl('button', { cls: 'bible-action-btn', text: '纲目' });

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
            // 勾选「保留候选」时，全书卷选中的经文实时进入候选池
            this.poolSyncCurrentView('reader');
            this.updateKeepCandidatesUI();
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
            this.poolClear();  // 同时清空保留的候选
            this.updateKeepCandidatesUI();
            this.refreshAllReaderCards();
            new Notice('已取消全部选中');
        };

        const buildCopyLines = (selected) => {
            const lines = [];
            for (const r of selected) {
                const item = r.item;
                if (r._isCompare) {
                    lines.push(`⌈${item.versionKey.toLowerCase()}⌋${item.bookShortName}${item.chapter}:${item.verse} ${item.content}`);
                } else if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
                else if (item.type === 'outline') lines.push('> ' + item.content);
                else lines.push(item.bookShortName + item.chapter + ':' + item.verse + ' ' + item.content);
            }
            return lines;
        };

        const doGlobalCopy = () => {
            // 全局复制：候选池中保留的候选项排在前面，其后是当前视图选中的项
            const selected = this.getAllSelections();
            if (selected.length === 0) { new Notice('请先选择要复制的内容'); return; }
            const lines = buildCopyLines(selected);
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
            // 勾选「保留候选」时，本章选中的经文实时进入候选池
            this.poolSyncCurrentView('reader');
            this.updateKeepCandidatesUI();
            this.refreshAllReaderCards();
            new Notice('已将本章主版本内容选中');
        };

        const doPageCopy = () => {
            // 本章选中项（含候选池中属于本章的保留项）
            const pageSelected = this.getAllSelections().filter(s => s.item.bookId === book.id && s.item.chapter === chapter);
            if (pageSelected.length === 0) { new Notice('本章没有选中的内容'); return; }
            const lines = buildCopyLines(pageSelected);
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

        this.updateKeepCandidatesUI();
    }

    showBookPicker(anchorEl) {
        const menu = document.body.createEl('div', { cls: 'bible-reader-nav-menu bible-reader-nav-menu-books' });
        const groups = [
            ['旧约', BIBLE_BOOKS.filter(b => b.testament === 'old')],
            ['新约', BIBLE_BOOKS.filter(b => b.testament === 'new')]
        ];
        const wrap = menu.createDiv({ cls: 'bible-reader-nav-menu-grid' });
        for (const [gname, books] of groups) {
            const col = wrap.createDiv({ cls: 'bible-reader-nav-menu-col' });
            col.createEl('div', { cls: 'bible-reader-nav-menu-group', text: gname });
            for (const b of books) {
                const item = col.createEl('div', { cls: 'bible-reader-nav-menu-item' + (b.id === this.readerBook.id ? ' active' : ''), text: b.id + '. ' + b.shortName });
                item.addEventListener('click', () => {
                    menu.remove();
                    this.readerBook = b;
                    this.readerChapter = 1;
                    this.renderReader();
                });
            }
        }
        this.positionPopupMenu(menu, anchorEl);
        const closeHandler = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
    }

    showChapterPicker(anchorEl, book) {
        const menu = document.body.createEl('div', { cls: 'bible-reader-nav-menu bible-reader-nav-menu-chapters' });
        const grid = menu.createDiv({ cls: 'bible-reader-nav-menu-chapter-grid' });
        for (let i = 1; i <= book.maxChapters; i++) {
            const item = grid.createEl('div', { cls: 'bible-reader-nav-menu-chip' + (i === this.readerChapter ? ' active' : ''), text: i + '章' });
            item.addEventListener('click', () => {
                menu.remove();
                this.readerChapter = i;
                this.renderReader();
            });
        }
        this.positionPopupMenu(menu, anchorEl);
        const closeHandler = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
    }

    positionPopupMenu(menu, anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        // 默认放在锚点下方、左对齐
        let top = rect.bottom + 4;
        let left = rect.left;
        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
        // 渲染一帧后根据实际尺寸校正，确保不超出视口
        requestAnimationFrame(() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const mw = menu.offsetWidth;
            const mh = menu.offsetHeight;
            if (left + mw > vw - 8) {
                left = Math.max(8, vw - mw - 8);
                menu.style.left = left + 'px';
            }
            if (top + mh > vh - 8) {
                top = Math.max(8, rect.top - mh - 4);
                menu.style.top = top + 'px';
            }
        });
    }

    showFontSizePicker(anchorEl) {
        const menu = document.body.createEl('div', { cls: 'bible-reader-nav-menu bible-reader-font-picker' });
        const row = menu.createDiv({ cls: 'bible-reader-font-picker-row' });
        const fontSmaller = row.createEl('button', { cls: 'bible-reader-font-picker-btn', text: '−', attr: { title: '缩小字体' } });
        const fontSizeDisplay = row.createEl('span', { cls: 'bible-reader-font-picker-size', text: this.readerFontSize + 'px' });
        const fontLarger = row.createEl('button', { cls: 'bible-reader-font-picker-btn', text: '+', attr: { title: '放大字体' } });
        const updateDisplay = () => {
            fontSizeDisplay.setText(this.readerFontSize + 'px');
            this.updateReaderFontSize();
        };
        fontSmaller.addEventListener('click', () => {
            this.readerFontSize = Math.max(10, this.readerFontSize - 1);
            updateDisplay();
        });
        fontLarger.addEventListener('click', () => {
            this.readerFontSize = Math.min(32, this.readerFontSize + 1);
            updateDisplay();
        });
        this.positionPopupMenu(menu, anchorEl);
        const closeHandler = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
    }

    openReaderProjection(mode) {
        // 候选池中保留的候选项排在前面，其后是当前视图选中的项
        const selected = this.getAllSelections();
        if (selected.length === 0) { new Notice('请先选择要投影的内容'); return; }
        // 若已有投影，直接复用并更新内容
        if (this.plugin.currentProjection) {
            this.plugin.currentProjection.reloadResults(selected, mode);
            return;
        }
        const overlay = new BibleProjectionOverlay(this.app, this.plugin, selected, mode, false);
        overlay.open();
    }

    renderReaderItemCard(container, item) {
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );
        const isSelected = existingIdx !== -1 && this.readerResults[existingIdx].selected;
        const result = existingIdx !== -1 ? this.readerResults[existingIdx] : null;
        // 选中状态：可能来自当前章节，也可能来自「保留候选」的候选池
        const selState = this.getSelectionState(item, false, isSelected, result ? result.order : 0, result ? result.sideBySide : false);

        // 主版本卡片（不设置分隔线）
        const card = container.createDiv({ cls: 'bible-reader-verse-card' + (selState.selected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : ''), attr: { 'data-line-index': item.lineIndex } });

        if (item.type === 'outline') {
            const contentRow = card.createDiv({ cls: 'bible-reader-verse-content-row' });
            contentRow.style.cssText = 'display:flex;align-items:flex-start;gap:8px;';

            const checkbox = contentRow.createDiv({ cls: 'bible-reader-verse-checkbox' + (selState.selected ? ' checked' : '') });
            if (selState.selected) checkbox.setText(String(selState.order));
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
            const checkbox = header.createDiv({ cls: 'bible-reader-verse-checkbox' + (selState.selected ? ' checked' : '') });
            if (selState.selected) checkbox.setText(String(selState.order));
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
        const sideTag = card.createDiv({ cls: 'bible-reader-side-tag' + (selState.selected && selState.sideBySide ? ' active' : '') });
        sideTag.setText(selState.selected && selState.sideBySide ? '✓ 并列' : '并');
        sideTag.style.display = selState.selected ? 'block' : 'none';
        sideTag.addEventListener('click', (e) => { e.stopPropagation(); this.toggleReaderSideBySide(item); });
        
        // 对照经文（在主版本卡片下方，同一容器内）
        if (this.hasCompareMode() && item.type === 'verse') {
            const compares = this.findCompareItems(item.bookId, item.chapter, item.verse, item.type);
            
            for (const cmp of compares) {
                const cmpKey = `rd-cmp-${item.lineIndex}-${cmp.versionKey}`;
                const cmpResultIdx = this.readerResults.findIndex(r => r._cmpKey === cmpKey);
                const cmpSelected = cmpResultIdx !== -1 && this.readerResults[cmpResultIdx].selected;
                const cmpResult = cmpResultIdx !== -1 ? this.readerResults[cmpResultIdx] : null;
                // 选中状态：可能来自当前章节，也可能来自「保留候选」的候选池
                const cmpState = this.getSelectionState(cmp.item, true, cmpSelected, cmpResult ? cmpResult.order : 0, cmpResult ? cmpResult.sideBySide : false);
                
                // 创建独立的对照行（作为 card 的子元素，便于查询和样式控制）
                const cmpRow = card.createDiv({ cls: 'bible-reader-compare-row' });
                cmpRow.setAttribute('data-version-key', cmp.versionKey);

                // 左列：候选框 + 并列标签（纵向排列）
                const cmpLeftCol = cmpRow.createDiv({ cls: 'bible-reader-compare-left-col' });
                const cmpCb = cmpLeftCol.createDiv({ cls: 'bible-reader-verse-checkbox' + (cmpState.selected ? ' checked' : '') });
                if (cmpState.selected) cmpCb.setText(String(cmpState.order));

                // 并列标签（仅在选中时显示，放在候选框下方）
                if (cmpState.selected) {
                    const cmpSideTag = cmpLeftCol.createDiv({ cls: 'bible-reader-side-tag' + (cmpState.sideBySide ? ' active' : '') });
                    cmpSideTag.setText(cmpState.sideBySide ? '✓ 并列' : '并');
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
        // 取消选中：同时移出候选池并清除局部选中（勾选「保留候选」时两者是镜像关系）
        const poolIdx = this.poolIndexOf(cmp.item, true);
        const existingIdx = this.readerResults.findIndex(r => r._cmpKey === cmpKey);
        if (poolIdx !== -1 || (existingIdx !== -1 && this.readerResults[existingIdx].selected)) {
            if (poolIdx !== -1) this.poolRemoveAt(poolIdx);
            if (existingIdx !== -1) {
                this.readerResults[existingIdx].selected = false;
                this.readerResults[existingIdx].sideBySide = false;
                this.readerResults[existingIdx].order = 0;
            }
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
            // 勾选「保留候选」时实时进入候选池，计数立即更新
            this.poolSyncSelect(cmp.item, true, false, 'reader');
        }
        this.recalcReaderOrders();
        this.updateKeepCandidatesUI();
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
        const poolIdx = this.poolIndexOf(cmp.item, true);
        const existingIdx = this.readerResults.findIndex(r => r._cmpKey === cmpKey);
        if (poolIdx !== -1) {
            const p = this.candidatePool[poolIdx];
            p.sideBySide = !p.sideBySide;
            if (existingIdx !== -1) this.readerResults[existingIdx].sideBySide = p.sideBySide;
            this.refreshReaderItemCard(parentItem);
            return;
        }
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
        // 选中状态：可能来自当前章节，也可能来自「保留候选」的候选池
        const selState = this.getSelectionState(item, false, isSelected, result ? result.order : 0, result ? result.sideBySide : false);

        if (selState.selected) card.classList.add('selected');
        else card.classList.remove('selected');

        const checkbox = card.querySelector('.bible-reader-verse-checkbox');
        if (checkbox) {
            if (selState.selected) {
                checkbox.classList.add('checked');
                checkbox.textContent = String(selState.order);
            } else {
                checkbox.classList.remove('checked');
                checkbox.textContent = '';
            }
        }

        const sideTag = card.querySelector('.bible-reader-side-tag');
        if (sideTag) {
            if (selState.selected) {
                sideTag.style.display = 'block';
                if (selState.sideBySide) sideTag.classList.add('active');
                else sideTag.classList.remove('active');
                sideTag.textContent = selState.sideBySide ? '✓ 并列' : '并';
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
                    const cmpState = this.getSelectionState(cmp.item, true, existingCmp !== -1,
                        existingCmp !== -1 ? this.readerResults[existingCmp].order : 0,
                        existingCmp !== -1 ? this.readerResults[existingCmp].sideBySide : false);
                    if (cmpCb) {
                        if (cmpState.selected) {
                            cmpCb.classList.add('checked');
                            cmpCb.textContent = String(cmpState.order);
                        } else {
                            cmpCb.classList.remove('checked');
                            cmpCb.textContent = '';
                        }
                    }

                    // 更新并列标签（在左列中）
                    let cmpSideTag = cmpLeftCol ? cmpLeftCol.querySelector('.bible-reader-side-tag') : null;
                    if (cmpState.selected) {
                        if (!cmpSideTag && cmpLeftCol) {
                            cmpSideTag = cmpLeftCol.createDiv({ cls: 'bible-reader-side-tag' + (cmpState.sideBySide ? ' active' : '') });
                            cmpSideTag.setText(cmpState.sideBySide ? '✓ 并列' : '并');
                            cmpSideTag.addEventListener('click', (e) => {
                                e.stopPropagation();
                                this.toggleReaderCompareSideBySide(item, cmp, cmpKey);
                            });
                        } else if (cmpSideTag) {
                            cmpSideTag.style.display = 'block';
                            if (cmpState.sideBySide) {
                                cmpSideTag.classList.add('active');
                            } else {
                                cmpSideTag.classList.remove('active');
                            }
                            cmpSideTag.textContent = cmpState.sideBySide ? '✓ 并列' : '并';
                        }
                    } else {
                        if (cmpSideTag) cmpSideTag.style.display = 'none';
                    }
                }
            }
        }
    }    toggleReaderItemSelection(item) {
        // 取消选中：同时移出候选池并清除局部选中（勾选「保留候选」时两者是镜像关系）
        const poolIdx = this.poolIndexOf(item, false);
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );

        if (poolIdx !== -1 || (existingIdx !== -1 && this.readerResults[existingIdx].selected)) {
            if (poolIdx !== -1) this.poolRemoveAt(poolIdx);
            if (existingIdx !== -1) {
                this.readerResults[existingIdx].selected = false;
                this.readerResults[existingIdx].sideBySide = false;
                this.readerResults[existingIdx].order = 0;
            }
        } else {
            this.readerSelectCounter++;
            if (existingIdx !== -1) {
                this.readerResults[existingIdx].selected = true;
                this.readerResults[existingIdx].order = this.readerSelectCounter;
            } else {
                this.readerResults.push({ item: item, selected: true, order: this.readerSelectCounter, sideBySide: false });
            }
            // 勾选「保留候选」时实时进入候选池，计数立即更新
            this.poolSyncSelect(item, false, false, 'reader');
        }
        this.recalcReaderOrders();
        this.updateKeepCandidatesUI();
        this.refreshAllReaderCards();
    }

    toggleReaderSideBySide(item) {
        const poolIdx = this.poolIndexOf(item, false);
        const existingIdx = this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse && r.item.type === item.type && r.item.content === item.content && !r._isCompare
        );
        if (poolIdx !== -1) {
            const p = this.candidatePool[poolIdx];
            p.sideBySide = !p.sideBySide;
            if (existingIdx !== -1) this.readerResults[existingIdx].sideBySide = p.sideBySide;
            this.refreshReaderItemCard(item);
            return;
        }
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
        // 勾选「保留候选」时，跳转前先把检索页已选中的候选经文冻结进候选池
        if (this.keepCandidates && this.activeTab !== 'reader') this.freezeSelections('search');
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
        this.currentProjection = null;  // 当前打开的投影覆盖层引用（用于投影内打开检索并复用）

        this.registerView(BIBLE_SEARCH_VIEW_TYPE, (leaf) => {
            const view = new BibleSearchView(leaf, this);
            this.searchViewRef = view;
            return view;
        })

        // 获取当前（或最近一次创建的）圣经检索视图实例
        // 经文弹窗要借助它访问「候选池」，才能与圣经搜索 / 圣经阅读的选中项一起投影
        this.getSearchView = () => {
            if (this.searchViewRef && typeof this.searchViewRef.getAllSelections === 'function') return this.searchViewRef;
            const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
            for (const leaf of leaves) {
                const v = leaf.view;
                if (v && typeof v.getAllSelections === 'function') { this.searchViewRef = v; return v; }
            }
            return null;
        };

        // 确保存在一个可用于候选池的检索视图（必要时打开插件侧边栏）
        this.ensureSearchView = async () => {
            const v = this.getSearchView();
            if (v) return v;
            await this.activateSearchView();
            return this.getSearchView();
        };

        // 构建书卷名列表（用于引用识别）
        this.allBookNames = this.buildBookNameList();
        this.verseIndex = new Map();

        // 注册文章内圣经引用自动高亮
        this.registerMarkdownPostProcessor((element, context) => {
            try {
                const docPath = context && context.sourcePath ? context.sourcePath : null;
                let lineNo = null;
                try {
                    const sec = context && context.getSectionInfo ? context.getSectionInfo(element) : null;
                    if (sec && typeof sec.lineStart === 'number') lineNo = sec.lineStart;
                } catch (e) { lineNo = null; }
                if (this.allItems.length === 0) {
                    this.loadBibleData().then(() => {
                        this.buildVerseIndex();
                        this.highlightBibleReferences(element, docPath, lineNo);
                    });
                } else {
                    if (this.verseIndex.size === 0) this.buildVerseIndex();
                    this.highlightBibleReferences(element, docPath, lineNo);
                }
            } catch (e) {
                console.error('[Bible] PostProcessor error:', e);
            }
        });;

        // 移动端适配：点击经文弹窗以外区域时关闭弹窗（点击经文引用或弹窗内部不关闭）
        this.registerDomEvent(document, 'click', (evt) => {
            const t = evt && evt.target;
            if (!t || !(t instanceof Element)) return;
            if (t.closest('.bible-inline-ref') || t.closest('.bible-inline-tooltip') || t.closest('.bible-tooltip-menu')) return;
            document.querySelectorAll('.bible-inline-tooltip').forEach(el => el.remove());
        });

        this.addRibbonIcon('book-plus', '圣经检索', () => { this.activateSearchView(); });
        this.addCommand({ id: 'open-bible-search', name: '打开圣经检索', callback: () => this.activateSearchView() });
        this.addCommand({
            id: 'show-bible-changelog',
            name: '查看当前版本的更新说明',
            callback: () => this.showCurrentChangelog()
        });
        this.addCommand({
            id: 'show-bible-changelog-history',
            name: '查看历史更新记录',
            callback: () => this.showChangelogHistory()
        });
        this.addCommand({
            id: 'check-bible-data-update',
            name: '检查圣经数据更新',
            callback: async () => {
                const pending = await this.checkBibleDataUpdate();
                if (pending && pending.length) new DataUpdateModal(this.app, this, pending).open();
                else new Notice('圣经数据已是最新版本');
            }
        });
        this.addSettingTab(new BibleSettingTab(this.app, this));

        await this.migrateOldData();
        await this.loadBibleData();

        this.registerEvent(this.app.workspace.onLayoutReady(async () => {
            const hasInstalledVersion = this.settings.versions.some(v => v.installed);
            if (!this.settings.hasSetup || !hasInstalledVersion) {
                new FirstRunModal(this.app, this).open();
            }
            // 版本发生变化就显示最新版的更新说明（与更新渠道无关：自带更新 / 插件市场 / BRAT 都覆盖）
            let changelogShown = false;
            try { changelogShown = await this.checkAndShowChangelog(); } catch (e) { }
            if (this.settings.autoCheckUpdate) {
                if (changelogShown) setTimeout(() => this.checkForUpdate(), 4000);
                else this.checkForUpdate();
                // 圣经数据更新单独检测，与插件更新提示错开，避免两个通知叠在一起
                setTimeout(() => this.checkBibleDataUpdateAndNotify(), changelogShown ? 9000 : 5000);
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
            readerSelectCounter: 0,
            tooltipFontSize: 14,
            // 已安装圣经数据的版本记录：{ 'bible-crv-data.json': '2026.10.12', ... }
            dataVersions: {},
            // 上次检测数据更新的时间戳（节流用）
            lastDataCheckAt: 0
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

        // 清理无效版本：既未安装、又不是默认可下载版本的条目（避免残留「未安装」的幽灵版本）
        const defaultKeys = DEFAULT_VERSIONS.map(dv => dv.key);
        this.settings.versions = this.settings.versions.filter(v => v.installed || defaultKeys.includes(v.key));

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

            // 数据文件位于 vault 内的 .obsidian/plugins/ 目录，桌面端与移动端均通过 vault adapter 扫描
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

            // 写入 vault 内 .obsidian/plugins/ 目录，桌面端与移动端均通过 vault adapter 完成
            const dirPath = `.obsidian/plugins/${pluginId}`;
            if (!(await this.app.vault.adapter.exists(dirPath))) {
                await this.app.vault.adapter.mkdir(dirPath);
            }
            await this.app.vault.adapter.writeBinary(adapterPath, response.arrayBuffer);

            // 记录已安装的数据版本，供以后检测更新时比对
            try {
                const manifest = await this.fetchDataManifest();
                const entry = (manifest.files || []).find(f => f.file === file);
                if (entry) {
                    this.settings.dataVersions = this.settings.dataVersions || {};
                    this.settings.dataVersions[file] = entry.dataVersion;
                    await this.saveSettings();
                }
            } catch (e) {
                console.warn('[Bible] 记录数据版本失败:', e);
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

            // 删除 vault 内 .obsidian/plugins/ 目录下的文件，桌面端与移动端均通过 vault adapter 完成
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

    // ==================== 更新说明：无论用哪种方式安装 / 更新都显示 ====================
    // 插件可能被插件自带的更新功能更新，也可能是 Obsidian 第三方插件市场、BRAT
    // 或手动覆盖安装更新的。这里只在启动时比对「上次记录的版本」与「当前版本号」，
    // 只要版本号发生变化就弹出最新版的更新说明，因此与更新渠道完全无关。
    async checkAndShowChangelog() {
        try {
            const current = this.manifest.version;
            const last = this.settings.lastVersion || '';
            if (!last) {
                // 从未记录过版本：全新安装只记下版本号（首次运行引导会介绍用法），
                // 老用户升级到含此功能的版本时，补弹一次最新版更新说明
                this.settings.lastVersion = current;
                await this.saveSettings();
                if (!this.settings.hasSetup) return false;
            } else if (this.compareVersion(current, last) <= 0) {
                // 版本没变（或回退到旧版本）：只同步记录，不弹窗
                if (last !== current) {
                    this.settings.lastVersion = current;
                    await this.saveSettings();
                }
                return false;
            }
            const changelog = await this.getChangelogFor(current);
            this.settings.lastVersion = current;
            await this.saveSettings();
            new UpdateModal(this.app, this, current, changelog).open();
            return true;
        } catch (e) {
            console.error('[Bible] 显示更新说明失败:', e);
            return false;
        }
    }

    // 手动查看当前版本的更新说明（命令 / 设置按钮）
    async showCurrentChangelog() {
        const version = this.manifest.version;
        const changelog = await this.getChangelogFor(version);
        new UpdateModal(this.app, this, version, changelog, '📜 Bible Search and Reader v' + version + ' 更新说明').open();
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
                    const changelog = await this.getChangelogFor(latestVersion);
                    new UpdateModal(this.app, this, latestVersion, changelog).open();
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

    // ==================== 圣经数据更新检测 ====================
    // 插件本体的自动更新只会下载 main.js / manifest.json / styles.css，不会带上
    // 十几 MB 的圣经数据文件。因此数据单独用一套版本机制：云端仓库根目录
    // bible-data-manifest.json 记录 dataVersion / size / sha256 / changes，
    // 本地 settings.dataVersions 记录已安装版本，启动时比对即可判断是否过期。
    async fetchDataManifest() {
        const resp = await requestUrl({ url: DATA_MANIFEST_URL, method: 'GET', timeout: 15000 });
        if (resp.status !== 200) throw new Error('HTTP ' + resp.status);
        const data = JSON.parse(resp.text);
        if (!data || !Array.isArray(data.files)) throw new Error('数据清单格式错误');
        return data;
    }

    async getLocalDataSize(file) {
        const pluginId = this.manifest?.id || 'bible-search-reader';
        const p = `.obsidian/plugins/${pluginId}/${file}`;
        if (!(await this.app.vault.adapter.exists(p))) return null;
        try {
            const stat = await this.app.vault.adapter.stat(p);
            return stat ? stat.size : null;
        } catch (e) {
            return null;
        }
    }

    /** 返回需要更新的清单条目数组；出错一律返回空数组，绝不打断启动流程。 */
    async checkBibleDataUpdate() {
        try {
            const manifest = await this.fetchDataManifest();
            const pending = [];
            for (const f of manifest.files) {
                const localSize = await this.getLocalDataSize(f.file);
                if (localSize === null) continue;   // 没装就不打扰
                const recorded = (this.settings.dataVersions || {})[f.file] || '';
                if (recorded) {
                    // 有版本记录：直接比版本号
                    if (this.compareVersion(f.dataVersion, recorded) > 0) pending.push(f);
                } else if (localSize !== f.size) {
                    // 老用户升级上来没有记录：用文件大小兜底判断
                    pending.push(f);
                }
            }
            return pending;
        } catch (e) {
            console.error('[Bible] 检查圣经数据更新失败:', e);
            return [];
        }
    }

    /** 下载并覆盖指定数据文件；覆盖前备份为 <file>.old，全部完成后重载数据。 */
    async updateBibleData(items) {
        const pluginId = this.manifest?.id || 'bible-search-reader';
        const dirPath = `.obsidian/plugins/${pluginId}`;
        if (!(await this.app.vault.adapter.exists(dirPath))) {
            await this.app.vault.adapter.mkdir(dirPath);
        }
        let done = 0;
        for (const item of items) {
            const target = `${dirPath}/${item.file}`;
            const notice = new Notice(`正在更新 ${item.name}（${done + 1}/${items.length}）...`, 0);
            try {
                const resp = await requestUrl({ url: item.url, method: 'GET' });
                if (resp.status !== 200) throw new Error('HTTP ' + resp.status);

                // 覆盖前先备份，出问题可以手工把 .old 改回来
                if (await this.app.vault.adapter.exists(target)) {
                    try {
                        const oldBin = await this.app.vault.adapter.readBinary(target);
                        await this.app.vault.adapter.writeBinary(target + '.old', oldBin);
                    } catch (e) {
                        console.warn('[Bible] 备份旧数据失败:', e);
                    }
                }

                await this.app.vault.adapter.writeBinary(target, resp.arrayBuffer);

                this.settings.dataVersions = this.settings.dataVersions || {};
                this.settings.dataVersions[item.file] = item.dataVersion;
                await this.saveSettings();
                done++;
                notice.hide();
            } catch (e) {
                notice.hide();
                new Notice(`${item.name} 更新失败：${e.message}`, 6000);
            }
        }
        if (done > 0) {
            await this.loadBibleData();
            new Notice(`✅ 已更新 ${done} 个圣经数据文件`, 6000);
        }
    }

    /** 启动时调用；默认 12 小时节流，force=true 可强制（手动检查用）。 */
    async checkBibleDataUpdateAndNotify(force = false) {
        try {
            if (!force && !this.settings.autoCheckUpdate) return;
            const now = Date.now();
            if (!force && now - (this.settings.lastDataCheckAt || 0) < 12 * 3600 * 1000) return;
            this.settings.lastDataCheckAt = now;
            await this.saveSettings();
            const pending = await this.checkBibleDataUpdate();
            if (pending && pending.length) this.showDataUpdateNotification(pending);
            else if (force) new Notice('圣经数据已是最新版本');
        } catch (e) {
            console.error('[Bible] 数据更新通知失败:', e);
        }
    }

    /** 右下角常驻通知（不自动消失），提供「查看详情 / 立即更新 / 稍后」。 */
    showDataUpdateNotification(pending) {
        const notice = new Notice('', 0);
        const frag = document.createDocumentFragment();
        const wrap = document.createElement('div');
        wrap.style.padding = '8px';
        wrap.style.minWidth = '300px';
        const names = pending.map(p => p.name).join('、');
        const total = pending.reduce((s, p) => s + (p.size || 0), 0);
        wrap.innerHTML = '<div style="font-weight:600;margin-bottom:6px;">📖 圣经数据有可用更新</div>' +
            '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">' +
            names + '　约 ' + (total / 1024 / 1024).toFixed(0) + ' MB</div>';
        const btnWrap = document.createElement('div');
        btnWrap.style.display = 'flex';
        btnWrap.style.gap = '8px';
        const detailBtn = document.createElement('button');
        detailBtn.textContent = '查看详情';
        detailBtn.style.fontSize = '12px';
        detailBtn.style.padding = '4px 12px';
        const updateBtn = document.createElement('button');
        updateBtn.className = 'mod-cta';
        updateBtn.textContent = '立即更新';
        updateBtn.style.fontSize = '12px';
        updateBtn.style.padding = '4px 12px';
        const laterBtn = document.createElement('button');
        laterBtn.textContent = '稍后';
        laterBtn.style.fontSize = '12px';
        laterBtn.style.padding = '4px 12px';
        btnWrap.appendChild(detailBtn);
        btnWrap.appendChild(updateBtn);
        btnWrap.appendChild(laterBtn);
        wrap.appendChild(btnWrap);
        frag.appendChild(wrap);
        notice.setMessage(frag);

        laterBtn.addEventListener('click', () => notice.hide());
        detailBtn.addEventListener('click', () => {
            notice.hide();
            new DataUpdateModal(this.app, this, pending).open();
        });
        updateBtn.addEventListener('click', async () => {
            notice.hide();
            await this.updateBibleData(pending);
        });
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
            // 优先使用内置更新日志，缺失时自动从 GitHub 拉取对应版本的更新简介
            const changelog = await this.getChangelogFor(targetVersion);
            new UpdateModal(this.app, this, targetVersion, changelog).open();
        } catch (e) {
            notice.hide();
            new Notice('更新失败：' + e.message);
            console.error('[Bible] 更新失败:', e);
        }
    }

    // 取得指定版本的更新简介：内置更新日志 → GitHub 上的 CHANGELOG.md
    async getChangelogFor(version) {
        const local = CHANGELOG_CONTENT[version];
        if (local && local.trim()) return local;
        const remote = await this.fetchRemoteChangelog(version);
        return remote || '';
    }

    // 内置更新日志（离线可用），用于历史弹窗首屏
    getLocalChangelogEntries() {
        const entries = Object.keys(CHANGELOG_CONTENT)
            .filter(v => /^[0-9]+(\.[0-9]+){1,3}$/.test(String(v == null ? '' : v).trim()))
            .map(v => ({ version: String(v).trim(), content: (CHANGELOG_CONTENT[v] || '').trim() }));
        entries.sort((a, b) => this.compareVersion(b.version, a.version));
        return entries;
    }

    // 历史更新记录：内置日志 + 远端 CHANGELOG.md 合并（内置优先），按版本号倒序
    async getChangelogHistory() {
        const map = new Map();
        const addEntry = (version, content) => {
            const v = String(version == null ? '' : version).trim();
            if (!/^[0-9]+(\.[0-9]+){1,3}$/.test(v)) return;
            map.set(v, String(content || '').trim());
        };
        const remote = await this.fetchFullRemoteChangelog();
        if (remote) for (const k of Object.keys(remote)) addEntry(k, remote[k]);
        for (const k of Object.keys(CHANGELOG_CONTENT)) addEntry(k, CHANGELOG_CONTENT[k]);
        const entries = [];
        for (const [version, content] of map.entries()) entries.push({ version: version, content: content });
        entries.sort((a, b) => this.compareVersion(b.version, a.version));
        return entries;
    }

    // 拉取远端完整 CHANGELOG.md，按 ## 标题切分为「版本 → 内容」
    async fetchFullRemoteChangelog() {
        if (this._remoteChangelogCache) return this._remoteChangelogCache;
        try {
            const url = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/main/CHANGELOG.md';
            const resp = await requestUrl({ url: url, method: 'GET', timeout: 15000 });
            if (!resp || resp.status !== 200 || !resp.text) return null;
            const out = {};
            let current = null;
            const buf = [];
            const flush = () => { if (current) out[current] = buf.join('\n').trim(); };
            for (const line of resp.text.split('\n')) {
                const t = line.trim();
                if (t.startsWith('##')) {
                    flush();
                    const m = t.match(/([0-9]+(?:\.[0-9]+)*)/);
                    current = m ? m[1] : null;
                    buf.length = 0;
                    if (current) buf.push(t); // 保留标题行，便于统一渲染
                    continue;
                }
                if (current) buf.push(line);
            }
            flush();
            this._remoteChangelogCache = out;
            return out;
        } catch (e) {
            console.error('[Bible] 获取远端完整更新日志失败:', e);
            return null;
        }
    }

    // 打开「历史更新记录」弹窗：先用内置日志渲染，远端日志到位后自动刷新
    showChangelogHistory() {
        const modal = new ChangelogHistoryModal(this.app, this, this.getLocalChangelogEntries());
        modal.open();
        this.getChangelogHistory().then(entries => {
            if (entries && entries.length) modal.setEntries(entries);
        }).catch(() => { });
        return modal;
    }

    async fetchRemoteChangelog(version) {
        try {
            const url = 'https://raw.githubusercontent.com/ViaCai/obsidian-bible-search-reader/main/CHANGELOG.md';
            const resp = await requestUrl({ url: url, method: 'GET', timeout: 15000 });
            if (!resp || resp.status !== 200 || !resp.text) return null;
            const lines = resp.text.split('\n');
            let start = -1;
            for (let i = 0; i < lines.length; i++) {
                const t = lines[i].trim();
                if (t.startsWith('##') && t.indexOf(version) !== -1) { start = i; break; }
            }
            if (start === -1) return null;
            const out = [];
            for (let i = start + 1; i < lines.length; i++) {
                const t = lines[i].trim();
                if (t.startsWith('## ')) break;
                out.push(lines[i]);
            }
            return out.join('\n').trim() || null;
        } catch (e) {
            console.error('[Bible] 获取远端更新日志失败:', e);
            return null;
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

    // ==================== 文章内圣经引用高亮 ====================

    buildBookNameList() {
        const names = new Set();
        for (const book of BIBLE_BOOKS) {
            names.add(book.fullName);
            names.add(book.shortName);
        }
        if (BOOK_MAP['约二']) names.add('约二');
        if (BOOK_MAP['约三']) names.add('约三');
        for (const alias of Object.keys(BOOK_ALIASES)) {
            if (BOOK_MAP[alias]) names.add(alias);
        }
        return Array.from(names).sort((a, b) => b.length - a.length);
    }

    buildVerseIndex() {
        this.verseIndex.clear();
        const primaryKey = this.getPrimaryVersionKey();
        if (!primaryKey) return;
        for (const item of this.allItems) {
            if (item.versionKey !== primaryKey || item.type !== 'verse') continue;
            const key = `${item.bookId}-${item.chapter}-${item.verse}`;
            this.verseIndex.set(key, item);
        }
    }

    getPrimaryVersionKey() {
        const pv = this.settings.versions.find(v => v.isPrimary && v.enabled && v.installed);
        return pv ? pv.key : null;
    }

    // 上下文跨段落（跨块元素）持久化：只写章节未写书卷时，沿用本文档前文中最后出现的书卷。
    // MarkdownPostProcessor 对每个块元素单独调用，局部变量无法跨块传递，因此存到实例上。
    refCtxReset(docPath, lineNo) {
        const c = this._refCtx;
        if (!c) { this._refCtx = { docPath: docPath || null, lineNo: lineNo == null ? -1 : lineNo, bookId: null, chapter: null, strongChapter: null }; return; }
        // 换文档，或行号回退（说明是一次新的渲染，从文档开头重新处理）→ 重置上下文
        if ((docPath && c.docPath && docPath !== c.docPath) || (lineNo != null && lineNo <= c.lineNo)) {
            this._refCtx = { docPath: docPath || c.docPath, lineNo: lineNo == null ? -1 : lineNo, bookId: null, chapter: null, strongChapter: null };
            return;
        }
        if (docPath && !c.docPath) c.docPath = docPath;
        if (lineNo != null) c.lineNo = lineNo;
    }

    // 取一处引用的“结束章”（跨章范围以后半段的章为准），用于后续弱引用的章上下文
    refEndChapter(ref) {
        if (!ref) return null;
        if (ref.endChapter) return ref.endChapter;
        return ref.chapter != null ? ref.chapter : null;
    }

    highlightBibleReferences(element, docPath, lineNo) {
        this.refCtxReset(docPath, lineNo);
        const ctx = this._refCtx;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode()) !== null) {
            if (this.shouldSkipNode(node)) continue;
            textNodes.push(node);
        }
        let globalLastBookId = ctx.bookId != null ? ctx.bookId : null;
        let globalLastChapter = ctx.chapter != null ? ctx.chapter : null;
        let globalLastStrongChapter = ctx.strongChapter != null ? ctx.strongChapter : null;
        for (const textNode of textNodes) {
            const text = textNode.textContent;
            if (!text || text.trim().length === 0) continue;
            const matches = this.findBibleReferences(text, globalLastBookId, globalLastChapter);
            if (matches.length === 0) continue;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            for (const match of matches) {
                if (match.start > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.start)));
                }
                const span = document.createElement('span');
                span.className = 'bible-inline-ref';
                span.textContent = match.text;
                span.dataset.bookId = match.bookId;
                span.dataset.chapter = match.allRefs[0].chapter;
                span.dataset.verse = match.allRefs[0].verse || '';
                span.dataset.verseEnd = match.allRefs[0].verseEnd || '';
                span.dataset.suffix = match.allRefs[0].suffix || '';
                // 移动端适配：单击打开经文弹窗；双击跳转到圣经阅读对应经文
                span.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showVerseTooltip(e.target, match);
                });
                span.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.removeCurrentTooltip();
                    this.jumpToBibleReader(match);
                });
                fragment.appendChild(span);
                lastIndex = match.end;
            }
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
            const lastMatch = matches[matches.length - 1];
            if (lastMatch.bookId != null) globalLastBookId = lastMatch.bookId;
            const lastRefOfMatch = lastMatch.allRefs[lastMatch.allRefs.length - 1];
            // 跨章范围（如“路一1-二2”）之后的弱引用应续接结束章（第二章），而不是起始章
            const endedChapter = this.refEndChapter(lastRefOfMatch);
            if (endedChapter != null) globalLastChapter = endedChapter;
            // 如果是强引用（有 bookName），更新强引用上下文
            if (lastMatch.bookName) {
                globalLastStrongChapter = endedChapter != null ? endedChapter : globalLastStrongChapter;
            }
            // 若文本以句号/问号/感叹号结束，重置章上下文（新句子不再沿用章号）；
            // 但书卷上下文保留——只写章节未写书卷时，仍沿用前面段落最后出现的书卷
            if (/[。！？]/.test(text.trim().slice(-1))) {
                globalLastChapter = null;
                globalLastStrongChapter = null;
            }
        }
        ctx.bookId = globalLastBookId;
        ctx.chapter = globalLastChapter;
        ctx.strongChapter = globalLastStrongChapter;
    }

    shouldSkipNode(node) {
        const parent = node.parentElement;
        if (!parent) return false;
        const tag = parent.tagName.toLowerCase();
        if (tag === 'code' || tag === 'pre' || tag === 'a') return true;
        if (parent.classList.contains('bible-inline-ref')) return true;
        if (parent.closest('code') || parent.closest('pre')) return true;
        return false;
    }

    isCovered(pos, ranges) {
        for (const r of ranges) {
            if (pos >= r[0] && pos < r[1]) return true;
        }
        return false;
    }

    // 判断一段文字是否以纲目行首序号开头（如“壹　…”“1 神…”“（一）　…”），
    // 这类序号不是经文出处，行首弱引用解析应跳过它们
    looksLikeOutlineMarker(s) {
        const m = s.match(/^([一二三四五六七八九十百零壹贰叁肆伍陆柒捌玖拾]+|[0-9]+|[a-zA-Z]+|[（(][一二三四五六七八九十百零0-9a-zA-Z]+[）)])[\s　]*[、．.、]?[\s　]*/);
        if (!m) return false;
        const rest = s.slice(m[0].length);
        const next = rest[0];
        if (!next) return false;
        // 后续为数字/范围符/上中下后缀/章:节冒号/收尾标点/括号闭合 → 可能是经文引用，不作纲目标记
        if (/[\d～~\-－–—‐上中下:：）〕)\],，。、；;]/.test(next)) return false;
        // 其余（中文标题文字、字母等）视为纲目行首标记
        return true;
    }

    findBibleReferences(text, lastBookId, lastChapter, lastStrongChapter) {
        const matches = [];
        const coveredRanges = [];
        // 已确定的引用按位置组成“时间线”。弱引用（未写书卷、只写章节或节号）解析时，
        // 只沿用其**左侧最近**一处引用的书卷与结束章，避免被同一行/同一段后面才出现的书卷名带偏。
        const timeline = [];
        const baseChapter = lastStrongChapter != null ? lastStrongChapter : lastChapter;
        const resolveCtx = (pos) => {
            let bookId = lastBookId != null ? lastBookId : null;
            let chapter = baseChapter != null ? baseChapter : null;
            for (const m of timeline) {
                if (m.start >= pos) break;
                if (m.bookId != null) bookId = m.bookId;
                const refs = m.allRefs;
                if (refs && refs.length > 0) {
                    const ec = this.refEndChapter(refs[refs.length - 1]);
                    if (ec != null) chapter = ec;
                }
            }
            return { bookId: bookId, chapter: chapter };
        };
        const pushMatch = (m) => {
            matches.push(m);
            coveredRanges.push([m.start, m.end]);
            timeline.push(m);
            timeline.sort((a, b) => a.start - b.start);
        };
        // 阶段1: 强引用（带书卷名）
        for (const name of this.allBookNames) {
            let idx = 0;
            while (true) {
                idx = text.indexOf(name, idx);
                if (idx === -1) break;
                if (this.isCovered(idx, coveredRanges)) { idx++; continue; }
                const cluster = this.parseRefCluster(text, idx, name);
                if (cluster) {
                    pushMatch(cluster);
                    idx = cluster.end;
                } else {
                    idx += name.length;
                }
            }
        }
        // 阶段2: 括号内弱引用
        const bracketMatches = this.findBracketRefs(text, coveredRanges, matches, resolveCtx);
        for (const m of bracketMatches) pushMatch(m);
        // 阶段3: 行首弱引用（每行按自身位置取上下文）
        const hasCtx = (lastBookId != null) || timeline.length > 0;
        if (hasCtx) {
            const lineMatches = this.findLineStartRefs(text, coveredRanges, resolveCtx);
            for (const m of lineMatches) pushMatch(m);
        }
        // 阶段4: 句中“X章Y节”及其顿号延续（如“三章三节、七节”“四章一节”“二章一节”）
        if (hasCtx) {
            const chVerseMatches = this.findChapterVersePatternRefs(text, coveredRanges, resolveCtx);
            for (const m of chVerseMatches) pushMatch(m);
        }
        // 阶段6: 行内省略书卷名/章号的弱引用（如纲目行“　一 1”“　一1”“　一2上”“　24～25”“　一1～二3”），
        // 依附本段或跨段落上下文；能完整吞并范围/后缀/跨章，须在阶段5之前运行
        if (hasCtx) {
            const weakCont = this.findWeakContinuationRefs(text, coveredRanges, resolveCtx);
            for (const m of weakCont) pushMatch(m);
        }
        // 阶段5: 行首/行内空白后的连写延续（如“　一2”），作为阶段6未覆盖的兜底（如行首起始处）
        if (hasCtx) {
            const contMatches = this.findInlineContinuationRefs(text, coveredRanges, resolveCtx);
            for (const m of contMatches) pushMatch(m);
        }
        matches.sort((a, b) => a.start - b.start);
        return matches;
    }

    parseRefCluster(text, startPos, bookName) {
        let book = BOOK_MAP[bookName];
        if (!book) return null;
        let pos = startPos + bookName.length;
        // 「约三19~20」消歧：以 一/二/三（普通数字）结尾的单章书卷别名（约二/约三，实为约贰/约叁）
        // 后面紧跟节号时，职事类文本惯例是「基础书卷 + 章 + 节」（约翰福音三章19节）；
        // 单章书卷本身的引用惯例用大写数字（约壹/约贰/约叁）。仅当剥掉末位数字后
        // 能按基础书卷解析出有效引用时才切换，否则保持原书卷（如独立出现的「约三」仍是约翰三书）。
        if (book.maxChapters === 1 && /[一二三]$/.test(bookName)) {
            const baseName = bookName.slice(0, -1);
            const base = BOOK_MAP[baseName];
            if (base && base.maxChapters > 1) {
                const trial = this.parseSingleRef(text, startPos + baseName.length, base);
                if (trial) {
                    book = base;
                    bookName = baseName;
                    pos = startPos + baseName.length;
                }
            }
        }
        while (pos < text.length && /\s/.test(text[pos])) pos++;
        const first = this.parseSingleRef(text, pos, book);
        if (!first) return null;
        const refs = [{ chapter: first.chapter, verse: first.verse, verseEnd: first.verseEnd, suffix: first.suffix, endChapter: first.endChapter, endVerse: first.endVerse }];
        pos = first.endPos;
        while (true) {
            // 记录引导词前的位置：若后续没有真正的延续内容，需回退，避免把“说到”“记载”等吞进高亮
            const beforeGuide = pos;
            // 跳过引导词（如“说”），支持“约壹四章十七节说……三章三节”这类写法
            pos = skipGuideWords(text, pos);
            // 检查范围分隔符
            const rangeSep = text.slice(pos).match(/^\s*[~～\-－至–—‐]\s*/);
            if (rangeSep) {
                pos += rangeSep[0].length;
                const rangeEnd = this.parseRangeEnd(text, pos, book, refs[refs.length - 1].chapter);
                if (rangeEnd) {
                    const lastRef = refs[refs.length - 1];
                    if (rangeEnd.crossChapter) {
                        lastRef.endChapter = rangeEnd.chapter;
                        lastRef.endVerse = rangeEnd.verse;
                    } else {
                        lastRef.verseEnd = rangeEnd.verse;
                    }
                    pos = rangeEnd.endPos;
                    // 吞掉范围结束后的“节”字（如“一章二十五至二十八节”）
                    if (text[pos] === '节') pos++;
                    continue;
                }
            }
            // 检查并列分隔符（含省略号 …；不跨行）；记录分隔前位置，后续解析失败时回退，避免把标点包进高亮
            const sepStart = pos;
            const listSep = text.slice(pos).match(/^[，、,;；…· \u3000]+/);
            if (!listSep) { pos = beforeGuide; break; }
            pos += listSep[0].length;
            const next = this.parseContinuationItem(text, pos, book, refs[refs.length - 1].chapter);
            if (!next) { pos = beforeGuide; break; }
            refs.push({ chapter: next.chapter, verse: next.verse, verseEnd: next.verseEnd, suffix: next.suffix, endChapter: null, endVerse: null });
            pos = next.endPos;
        }
        return {
            text: text.slice(startPos, pos),
            start: startPos, end: pos,
            bookId: book.id, bookName: book.fullName, bookShortName: book.shortName,
            allRefs: refs
        };
    }

    parseSingleRef(text, pos, book) {
        const startPos = pos;
        // 格式1: chapter:verse
        const m1 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)[:：]\s*([一二三四五六七八九十百零〇]+|\d+)/);
        if (m1) {
            const chapter = parseNumber(m1[1]);
            const verse = parseNumber(m1[2]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && !isNaN(verse) && verse >= 1) {
                pos += m1[0].length;
                const suffixMatch = text.slice(pos).match(/^[上中下]半?/);
                let suffix = suffixMatch ? suffixMatch[0] : null;
                if (suffix) pos += suffix.length;
                return { chapter, verse, verseEnd: null, suffix, endChapter: null, endVerse: null, endPos: pos };
            }
        }
        // 格式2: chapter章[第]verse节
        const m2 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)[章篇]/);
        if (m2) {
            const chapter = parseNumber(m2[1]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters) {
                pos += m2[0].length;
                while (pos < text.length && /\s/.test(text[pos])) pos++;
                const vm = text.slice(pos).match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)[节]?/);
                if (vm) {
                    const verse = parseNumber(vm[1]);
                    if (!isNaN(verse) && verse >= 1) {
                        pos += vm[0].length;
                        const suffixMatch = text.slice(pos).match(/^[上中下]半?/);
                        let suffix = suffixMatch ? suffixMatch[0] : null;
                        if (suffix) pos += suffix.length;
                        return { chapter, verse, verseEnd: null, suffix, endChapter: null, endVerse: null, endPos: pos };
                    }
                }
                return { chapter, verse: null, verseEnd: null, suffix: null, endChapter: null, endVerse: null, endPos: pos };
            }
        }
        // 格式2.5: 单章书卷 + 裸节号（如“俄3”“犹19~21”“约叁13”）→ 第1章该节。
        // 必须先于“连写”判断，否则“犹19”会被连写拆成 1:9
        if (book.maxChapters === 1) {
            const m15 = text.slice(pos).match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)(?![章篇:：])/);
            if (m15) {
                const verse = parseNumber(m15[1]);
                if (!isNaN(verse) && verse >= 1) {
                    return { chapter: 1, verse, verseEnd: null, suffix: null, endChapter: null, endVerse: null, endPos: pos + m15[0].length };
                }
            }
        }
        // 格式3: chapterverse 连写（智能区分章节）
        const m3 = parseConnectedChapterVerse(text, pos, book);
        if (m3) {
            pos += m3.consumed;
            const suffixMatch = text.slice(pos).match(/^[上中下]半?/);
            let suffix = suffixMatch ? suffixMatch[0] : null;
            if (suffix) pos += suffix.length;
            return { chapter: m3.chapter, verse: m3.verse, verseEnd: null, suffix, endChapter: null, endVerse: null, endPos: pos };
        }
        // 格式4: 只有章号
        const m4 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)/);
        if (m4) {
            const chapter = parseNumber(m4[1]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters) {
                return { chapter, verse: null, verseEnd: null, suffix: null, endChapter: null, endVerse: null, endPos: pos + m4[0].length };
            }
        }
        return null;
    }

    // 中文章 + 阿拉伯节（如“一 1”“一1”“一 20～23”“一1～二3”“一2上”“一2下～二3”），
    // 支持后缀（上/中/下）与范围（同章～节、跨章～章节）
    parseCnSpaceVerseRef(text, pos, book) {
        const remaining = text.slice(pos);
        const m = remaining.match(/^([一二三四五六七八九十百零〇]+)[\s　]*(\d+)/);
        if (!m) return null;
        const chapter = parseNumber(m[1]);
        const verse = parseNumber(m[2]);
        if (!(chapter >= 1 && chapter <= book.maxChapters && verse >= 1 && verse <= 176)) return null;
        let p = pos + m[0].length;
        // 后缀 上/中/下（允许“　上”“ 上”等空格分隔，如“一 2 上”）
        const sfx = text.slice(p).match(/^[\s　]*[上中下]半?/);
        let suffix = sfx ? sfx[0].trim() : null;
        if (suffix) p += sfx[0].length;
        // 范围
        let verseEnd = null, endChapter = null, endVerse = null;
        const rangeSep = text.slice(p).match(/^[\s　]*[～~\-－至–—‐][\s　]*/);
        if (rangeSep) {
            const q = p + rangeSep[0].length;
            // 跨章：中文章 + 阿拉伯节（如“二 3”）
            const rc = text.slice(q).match(/^([一二三四五六七八九十百零〇]+)[\s　]*(\d+)/);
            if (rc) {
                const ch2 = parseNumber(rc[1]);
                const v2 = parseNumber(rc[2]);
                if (!isNaN(ch2) && ch2 > chapter && ch2 <= book.maxChapters && !isNaN(v2) && v2 >= 1) {
                    endChapter = ch2; endVerse = v2;
                    p = q + rc[0].length;
                }
            }
            // 同章：纯节号
            if (endChapter === null) {
                const rv = text.slice(q).match(/^(\d+)/);
                if (rv) {
                    const v2 = parseNumber(rv[1]);
                    if (!isNaN(v2) && v2 >= verse) { verseEnd = v2; p = q + rv[0].length; }
                }
            }
        }
        return { chapter, verse, verseEnd, suffix, endChapter, endVerse, endPos: p };
    }

    parseContinuationItem(text, pos, book, lastChapter) {
        // 跳过引导词（如"论到这事说"等）
        pos = skipGuideWords(text, pos);
        
        // 模式A: 章:节
        const m1 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)[:：]\s*([一二三四五六七八九十百零〇]+|\d+)/);
        if (m1) {
            const chapter = parseNumber(m1[1]);
            const verse = parseNumber(m1[2]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && !isNaN(verse) && verse >= 1) {
                let p = pos + m1[0].length;
                const suffixMatch = text.slice(p).match(/^[上中下]半?/);
                let suffix = suffixMatch ? suffixMatch[0] : null;
                if (suffix) p += suffix.length;
                const rangeMatch = text.slice(p).match(/^\s*[~～\-－至–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
                let verseEnd = null;
                if (rangeMatch) {
                    verseEnd = parseNumber(rangeMatch[1]);
                    if (!isNaN(verseEnd) && verseEnd >= verse) {
                        p += rangeMatch[0].length;
                        // 吞掉范围结束后的“节”字
                        if (text[p] === '节') p++;
                    }
                    else verseEnd = null;
                }
                return { chapter, verse, verseEnd, suffix, endPos: p };
            }
        }
        // 模式A2: 中文章 + 空格 + 阿拉伯节（如“，一 2 上”“，一 20～23”）
        const cnSpace = this.parseCnSpaceVerseRef(text, pos, book);
        if (cnSpace) {
            return { chapter: cnSpace.chapter, verse: cnSpace.verse, verseEnd: cnSpace.verseEnd, suffix: cnSpace.suffix, endPos: cnSpace.endPos };
        }
        // 模式B: 只有节号（优先当 lastChapter 已知时）
        // 注意：数字后若紧跟 章/篇/节 或另一个数字，则不是纯节号，应让位给“X章X节”或“章+节连写”
        if (lastChapter !== null) {
            const afterSeparator = /^[章节篇\d一二三四五六七八九十百零〇]/;
            // digitStr 仅用于解析数字；consumedLen 为实际消耗长度（含可选的“节”字等）
            const applyVerse = (digitStr, consumedLen) => {
                const verse = parseNumber(digitStr);
                if (isNaN(verse) || verse < 1) return null;
                let p = pos + consumedLen;
                const suffixMatch = text.slice(p).match(/^[上中下]半?/);
                let suffix = suffixMatch ? suffixMatch[0] : null;
                if (suffix) p += suffix.length;
                const rangeMatch = text.slice(p).match(/^\s*[~～\-－至–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
                let verseEnd = null;
                if (rangeMatch) {
                    verseEnd = parseNumber(rangeMatch[1]);
                    if (!isNaN(verseEnd) && verseEnd >= verse) {
                        p += rangeMatch[0].length;
                        // 吞掉范围结束后的“节”字
                        if (text[p] === '节') p++;
                    }
                    else verseEnd = null;
                }
                return { chapter: lastChapter, verse, verseEnd, suffix, endPos: p };
            };
            const mNum = text.slice(pos).match(/^(?:第\s*)?(\d+)[节]?/);
            if (mNum && !afterSeparator.test(text.slice(pos + mNum[0].length))) {
                const r = applyVerse(mNum[1], mNum[0].length);
                if (r) return r;
            }
            const mCn = text.slice(pos).match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+)[节]?/);
            if (mCn && !afterSeparator.test(text.slice(pos + mCn[0].length))) {
                const r = applyVerse(mCn[1], mCn[0].length);
                if (r) return r;
            }
        }
        // 模式D: 章节节（中文量词）。
        // 注意：必须先于“连写”模式判断，否则“十四章十九节”这类延续项
        // 会被连写解析误拆成 十:4（如“六章五十七节下，十四章十九节”）
        const m2 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)[章篇]/);
        if (m2) {
            const chapter = parseNumber(m2[1]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters) {
                let p = pos + m2[0].length;
                while (p < text.length && /\s/.test(text[p])) p++;
                const vm = text.slice(p).match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)[节]?/);
                if (vm) {
                    const verse = parseNumber(vm[1]);
                    if (!isNaN(verse) && verse >= 1) {
                        p += vm[0].length;
                        const suffixMatch = text.slice(p).match(/^[上中下]半?/);
                        let suffix = suffixMatch ? suffixMatch[0] : null;
                        if (suffix) p += suffix.length;
                        const rangeMatch = text.slice(p).match(/^\s*[至～~\-－–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
                        let verseEnd = null;
                        if (rangeMatch) {
                            const ve = parseNumber(rangeMatch[1]);
                            if (!isNaN(ve) && ve >= verse) {
                                verseEnd = ve;
                                p += rangeMatch[0].length;
                                // 吞掉范围结束后的“节”字
                                if (text[p] === '节') p++;
                            }
                        }
                        return { chapter, verse, verseEnd, suffix, endPos: p };
                    }
                }
                return { chapter, verse: null, verseEnd: null, suffix: null, endPos: p };
            }
        }
        // 模式C: 连写 chapter+verse（使用智能解析）
        const m3 = parseConnectedChapterVerse(text, pos, book);
        if (m3) {
            let p = pos + m3.consumed;
            const suffixMatch = text.slice(p).match(/^[上中下]半?/);
            let suffix = suffixMatch ? suffixMatch[0] : null;
            if (suffix) p += suffix.length;
            const rangeMatch = text.slice(p).match(/^\s*[至～~\-－–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
            let verseEnd = null;
            if (rangeMatch) {
                verseEnd = parseNumber(rangeMatch[1]);
                if (!isNaN(verseEnd) && verseEnd >= m3.verse) {
                    p += rangeMatch[0].length;
                    // 吞掉范围结束后的“节”字
                    if (text[p] === '节') p++;
                }
                else verseEnd = null;
            }
            return { chapter: m3.chapter, verse: m3.verse, verseEnd, suffix, endPos: p };
        }
        return null;
    }

    parseRangeEnd(text, pos, book, currentChapter) {
        // 尝试跨章: chapter:verse
        const m1 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)[:：]\s*([一二三四五六七八九十百零〇]+|\d+)/);
        if (m1) {
            const chapter = parseNumber(m1[1]);
            const verse = parseNumber(m1[2]);
            if (!isNaN(chapter) && chapter > currentChapter && chapter <= book.maxChapters && !isNaN(verse) && verse >= 1) {
                return { crossChapter: true, chapter, verse, endPos: pos + m1[0].length };
            }
        }
        // 尝试跨章: 中文章 + 空格/无 + 阿拉伯节（如“二 25”“二25”）
        const mCn2 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+)[\s　]*(\d+)/);
        if (mCn2) {
            const chapter = parseNumber(mCn2[1]);
            const verse = parseNumber(mCn2[2]);
            if (!isNaN(chapter) && chapter > currentChapter && chapter <= book.maxChapters && !isNaN(verse) && verse >= 1) {
                return { crossChapter: true, chapter, verse, endPos: pos + mCn2[0].length };
            }
        }
        // 尝试跨章: chapterverse（仅限“中文章+阿拉伯节 / 阿拉伯章+中文节”的混合连写；
        // 纯阿拉伯“23”与纯中文“二十八”等按同章节号处理，避免“创一20～23”“八至二十八”
        // 被误拆为跨章引用）
        const m2 = text.slice(pos).match(/^(([一二三四五六七八九十百零〇]+)(\d+)|(\d+)([一二三四五六七八九十百零〇]+))/);
        if (m2 && !/^\d+$/.test(m2[0])) {
            // 捕获组：1=外层；2/3=中文章+阿拉伯节；4/5=阿拉伯章+中文节
            const cStr = m2[2] || m2[4];
            const vStr = m2[3] || m2[5];
            const chapter = parseNumber(cStr);
            const verse = parseNumber(vStr);
            if (!isNaN(chapter) && chapter > currentChapter && chapter <= book.maxChapters && !isNaN(verse) && verse >= 1) {
                return { crossChapter: true, chapter, verse, endPos: pos + m2[0].length };
            }
        }
        // 同章范围: 只有节号
        const m3 = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)/);
        if (m3) {
            const verse = parseNumber(m3[1]);
            if (!isNaN(verse) && verse >= 1) {
                return { crossChapter: false, verse, endPos: pos + m3[0].length };
            }
        }
        return null;
    }

    findBracketRefs(text, coveredRanges, strongMatches, resolveCtx) {
        const matches = [];
        const pattern = /[（〔(]([^）〕)]+)[）〕)]/g;
        let m;
        while ((m = pattern.exec(text)) !== null) {
            const start = m.index;
            const end = m.index + m[0].length;
            if (this.isCovered(start, coveredRanges)) continue;
            // 括号内容若本身以书卷名开头（允许前面有“参/参看”），说明其中包含强引用，
            // 交给阶段1按书卷名解析；这里只处理依附上下文的弱引用括号
            if (this.bracketHasBookName(m[1])) continue;
            // 跳过纲目序号括号（如“（一）”“（四）”）——裸中文数字视为结构标记，非经文出处
            const bareCn = m[1].trim().replace(/^(?:参看|参考|参)/, '');
            if (/^[一二三四五六七八九十百零〇]+$/.test(bareCn)) continue;
            // 按本括号所在位置取上下文：优先沿用其左侧最近引用（含跨段落的书卷上下文）
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) continue;
            const initialChapter = c.chapter != null ? c.chapter : null;
            const refContent = m[1];
            const refs = this.parseWeakRefList(refContent, book, initialChapter);
            if (refs && refs.length > 0) {
                matches.push({
                    text: m[0], start, end,
                    bookId: book.id,
                    bookName: book.fullName,
                    bookShortName: book.shortName,
                    allRefs: refs
                });
            }
        }
        return matches;
    }

    // 判断括号内容去掉“参/参看/参考”后是否以某个书卷短名开头
    bracketHasBookName(content) {
        let s = content;
        const gs = s.match(/^(?:参看|参考|参)/);
        if (gs) s = s.slice(gs[0].length);
        for (const bn of BOOK_SHORT_NAMES) {
            if (s.startsWith(bn)) return true;
        }
        return false;
    }

    findLastStrongRef(pos, strongMatches) {
        let lastRef = null;
        for (const sm of strongMatches) {
            if (sm.end <= pos) lastRef = sm;
        }
        return lastRef;
    }

    parseWeakRefList(content, book, initialLastChapter) {
        const refs = [];
        const parts = content.split(/[，、,;]/);
        let lastChapter = initialLastChapter !== undefined ? initialLastChapter : null;
        let currentBook = book;
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            const ref = this.parseWeakRef(trimmed, currentBook, lastChapter);
            if (ref) {
                refs.push({ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix, endChapter: ref.endChapter || null, endVerse: ref.endVerse || null });
                lastChapter = ref.chapter;
                // 段首识别到新书卷时切换上下文（如括号内“赛四二4…参约四13…可九7”）
                if (ref.book) currentBook = ref.book;
            }
        }
        // 如果分割后没有结果，尝试整体解析（处理 "四34，十七4" 这种整体格式）
        if (refs.length === 0) {
            const ref = this.parseWeakRef(content, currentBook, lastChapter);
            if (ref) {
                refs.push({ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix, endChapter: ref.endChapter || null, endVerse: ref.endVerse || null });
            }
        }
        return refs;
    }

    parseWeakRef(text, book, lastChapter) {
        let pos = 0;
        while (pos < text.length && /\s/.test(text[pos])) pos++;
        let remaining = text.slice(pos);
        // 跳过“参/参看/参考”等前缀
        const guideSkip = remaining.match(/^(?:参看|参考|参)/);
        if (guideSkip) { pos += guideSkip[0].length; remaining = text.slice(pos); }
        // 段首若为书卷名（如“赛四二4”“可九7”），切换到对应书卷
        let currentBook = book;
        for (const bn of BOOK_SHORT_NAMES) {
            if (remaining.startsWith(bn) && BOOK_MAP[bn]) {
                currentBook = BOOK_MAP[bn];
                pos += bn.length;
                remaining = text.slice(pos);
                break;
            }
        }
        // 纯节号后若紧跟 章/篇/节 或另一个数字，则不是纯节号，让位给 X章 / 连写
        const afterSeparator = /^[章节篇\d一二三四五六七八九十百零〇]/;
        // 模式A: 章:节
        const m1 = remaining.match(/^([一二三四五六七八九十百零〇]+|\d+)[:：]\s*([一二三四五六七八九十百零〇]+|\d+)/);
        if (m1) {
            const chapter = parseNumber(m1[1]);
            const verse = parseNumber(m1[2]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= currentBook.maxChapters && !isNaN(verse) && verse >= 1) {
                return { chapter, verse, verseEnd: null, suffix: null, book: currentBook, consumed: pos + m1[0].length };
            }
        }
        // 模式B: 章节节（中文量词）
        const m2 = remaining.match(/^([一二三四五六七八九十百零〇]+|\d+)[章篇]\s*(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)[节]?/);
        if (m2) {
            const chapter = parseNumber(m2[1]);
            const verse = parseNumber(m2[2]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= currentBook.maxChapters && !isNaN(verse) && verse >= 1) {
                return { chapter, verse, verseEnd: null, suffix: null, book: currentBook, consumed: pos + m2[0].length };
            }
        }
        // 模式B2: 中文章 + 空格 + 阿拉伯节（如“一 1”“一 20～23”“一 1～二 3”“一 2 上”）
        const cnSpace = this.parseCnSpaceVerseRef(text, pos, currentBook);
        if (cnSpace) {
            return { chapter: cnSpace.chapter, verse: cnSpace.verse, verseEnd: cnSpace.verseEnd, suffix: cnSpace.suffix, endChapter: cnSpace.endChapter, endVerse: cnSpace.endVerse, book: currentBook, consumed: cnSpace.endPos - pos };
        }
        // 模式B3: 单章书卷 + 裸节号（如“俄3”“犹19~21”）→ 第1章该节
        if (currentBook.maxChapters === 1) {
            const mB3 = remaining.match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)(?![章篇:：])/);
            if (mB3) {
                const verse = parseNumber(mB3[1]);
                if (!isNaN(verse) && verse >= 1) {
                    let p = pos + mB3[0].length;
                    const rB3 = text.slice(p).match(/^[\s　]*[～~\-－至–—‐][\s　]*(\d+)/);
                    let verseEnd = null;
                    if (rB3) { const v2 = parseNumber(rB3[1]); if (!isNaN(v2) && v2 >= verse) { verseEnd = v2; p += rB3[0].length; } }
                    const sB3 = text.slice(p).match(/^[上中下]半?/);
                    let suffix = sB3 ? sB3[0] : null;
                    if (suffix) p += suffix.length;
                    return { chapter: 1, verse, verseEnd, suffix, endChapter: null, endVerse: null, book: currentBook, consumed: p - pos };
                }
            }
        }
        // 模式C: 只有节号（优先当 lastChapter 已知）
        if (lastChapter !== null) {
            // 纯数字（如 "18"）应被视为节号
            const m4 = remaining.match(/^(\d+)/);
            if (m4 && !afterSeparator.test(remaining.slice(m4[0].length))) {
                const verse = parseInt(m4[1]);
                if (!isNaN(verse) && verse >= 1 && verse <= 200) {
                    let p = pos + m4[0].length;
                    const r4 = text.slice(p).match(/^[\s　]*[～~\-－至–—‐][\s　]*(\d+)/);
                    let verseEnd = null;
                    if (r4) { const v2 = parseInt(r4[1]); if (!isNaN(v2) && v2 >= verse) { verseEnd = v2; p += r4[0].length; } }
                    const s4 = text.slice(p).match(/^[上中下]半?/);
                    let suffix = s4 ? s4[0] : null;
                    if (suffix) p += suffix.length;
                    return { chapter: lastChapter, verse, verseEnd, suffix, endChapter: null, endVerse: null, book: currentBook, consumed: p - pos };
                }
            }
            // 中文数字节号
            const m5 = remaining.match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+)[节]?/);
            if (m5 && !afterSeparator.test(remaining.slice(m5[0].length))) {
                const verse = parseNumber(m5[1]);
                if (!isNaN(verse) && verse >= 1) {
                    let p = pos + m5[0].length;
                    const r5 = text.slice(p).match(/^[\s　]*[～~\-－至–—‐][\s　]*(\d+)/);
                    let verseEnd = null;
                    if (r5) { const v2 = parseNumber(r5[1]); if (!isNaN(v2) && v2 >= verse) { verseEnd = v2; p += r5[0].length; } }
                    const s5 = text.slice(p).match(/^[上中下]半?/);
                    let suffix = s5 ? s5[0] : null;
                    if (suffix) p += suffix.length;
                    return { chapter: lastChapter, verse, verseEnd, suffix, endChapter: null, endVerse: null, book: currentBook, consumed: p - pos };
                }
            }
        }
        // 模式D: 连写（使用智能解析）。remaining 已是切片，offset 传 0
        const m6 = parseConnectedChapterVerse(remaining, 0, currentBook);
        if (m6) {
            let p = pos + m6.consumed;
            const rangeMatch = remaining.substring(m6.consumed).match(/^[至～~\-－–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
            let verseEnd = null;
            if (rangeMatch) {
                verseEnd = parseNumber(rangeMatch[1]);
                if (!isNaN(verseEnd) && verseEnd >= m6.verse) p += rangeMatch[0].length;
                else verseEnd = null;
            }
            return { chapter: m6.chapter, verse: m6.verse, verseEnd, suffix: null, book: currentBook, consumed: p };
        }
    }

    findLineStartRefs(text, coveredRanges, resolveCtx) {
        const matches = [];
        const lines = text.split('\n');
        let pos = 0;
        for (const line of lines) {
            const trimmed = line.trimStart();
            const offset = line.length - trimmed.length;
            const lineStart = pos + offset;
            // 跳过纲目行首序号（如“壹　…”“1 神…”“（一）　…”），避免把序号误判为经文出处
            if (this.looksLikeOutlineMarker(trimmed)) { pos += line.length + 1; continue; }
            if (!this.isCovered(lineStart, coveredRanges) && trimmed.length > 0) {
                // 按本行所在位置取上下文（书卷沿用前文最后出现的书卷，章号沿用前一处的结束章）
                const c = resolveCtx(lineStart);
                const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
                if (!book) { pos += line.length + 1; continue; }
                let p = 0;
                const ref = this.parseWeakRef(trimmed.slice(p), book, c.chapter);
                if (ref) {
                    // 行首显式写了书卷名时（如“赛四二4”），归属及后续延续都应以切换后的书卷为准
                    const effBook = ref.book || book;
                    p += ref.consumed;
                    const refs = [{ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix }];
                    // 检查范围
                    const rangeMatch = trimmed.slice(p).match(/^\s*[~～\-－至–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
                    if (rangeMatch) {
                        const verseEnd = parseNumber(rangeMatch[1]);
                        if (!isNaN(verseEnd) && verseEnd >= ref.verse) {
                            refs[0].verseEnd = verseEnd;
                            p += rangeMatch[0].length;
                        }
                    }
                    // 向后吞并列延续项（如“一2，一3，二4”），让行首弱引用成串高亮
                    while (true) {
                        const listSep = trimmed.slice(p).match(/^[，、,;；][\s　]*/);
                        if (!listSep) break;
                        const q = p + listSep[0].length;
                        const next = this.parseContinuationItem(trimmed, q, effBook, refs[refs.length - 1].chapter);
                        if (!next || next.endPos <= q) break;
                        refs.push({ chapter: next.chapter, verse: next.verse, verseEnd: next.verseEnd || null, suffix: next.suffix || null });
                        p = next.endPos;
                    }
                    matches.push({
                        text: text.slice(lineStart, lineStart + p),
                        start: lineStart, end: lineStart + p,
                        bookId: effBook.id,
                        bookName: effBook.fullName,
                        bookShortName: effBook.shortName,
                        allRefs: refs
                    });
                }
            }
            pos += line.length + 1;
        }
        return matches;
    }

    // 阶段4：句中“X章Y节”及其顿号延续，如“三章三节、七节”“四章一节”
    findChapterVersePatternRefs(text, coveredRanges, resolveCtx) {
        const matches = [];
        const pattern = /([一二三四五六七八九十百零〇\d]+)章(?:第)?([一二三四五六七八九十百零〇\d]+)节/g;
        let m;
        while ((m = pattern.exec(text)) !== null) {
            const start = m.index;
            if (this.isCovered(start, coveredRanges)) { pattern.lastIndex = start + m[0].length; continue; }
            // 按本处所在位置取上下文（书卷沿用前文最后出现的书卷）
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) { pattern.lastIndex = start + m[0].length; continue; }
            const chapter = parseNumber(m[1]);
            const verse = parseNumber(m[2]);
            if (!(chapter >= 1 && chapter <= book.maxChapters && verse >= 1)) { pattern.lastIndex = start + m[0].length; continue; }
            let p = start + m[0].length;
            const refs = [{ chapter, verse, verseEnd: null, suffix: null }];
            // 向后扩展 “、X章Y节” 或 “、X节”（同章延续）
            while (true) {
                const sep = text.slice(p).match(/^[，、,;；]\s*/);
                if (!sep) break;
                const q = p + sep[0].length;
                const nextCh = text.slice(q).match(/^([一二三四五六七八九十百零〇\d]+)章(?:第)?([一二三四五六七八九十百零〇\d]+)节/);
                if (nextCh) {
                    const ch = parseNumber(nextCh[1]);
                    const v = parseNumber(nextCh[2]);
                    if (ch >= 1 && ch <= book.maxChapters && v >= 1) {
                        refs.push({ chapter: ch, verse: v, verseEnd: null, suffix: null });
                        p = q + nextCh[0].length;
                        continue;
                    }
                }
                const nextV = text.slice(q).match(/^(?:第)?([一二三四五六七八九十百零〇\d]+)节/);
                if (nextV) {
                    const v = parseNumber(nextV[1]);
                    if (v >= 1) {
                        refs.push({ chapter, verse: v, verseEnd: null, suffix: null });
                        p = q + nextV[0].length;
                        continue;
                    }
                }
                break;
            }
            matches.push({
                text: text.slice(start, p), start, end: p,
                bookId: book.id, bookName: book.fullName, bookShortName: book.shortName,
                allRefs: refs
            });
            pattern.lastIndex = p;
        }
        return matches;
    }

    // 阶段5：行内空白（或行首）后的“中文章+阿拉伯节”连写，如纲目行末“　一2”依附前一个书卷/章
    findInlineContinuationRefs(text, coveredRanges, resolveCtx) {
        const matches = [];
        // 前面必须是行首或空白/破折号；中文数字章 + 阿拉伯节；后面不跟数字（避免吃掉更长连写）
        const re = /(^|[\s　–—‐])([一二三四五六七八九十百零〇]+)(\d+)(?![\d一二三四五六七八九十百零〇])/g;
        let m;
        while ((m = re.exec(text)) !== null) {
            const start = m.index + m[1].length;
            if (this.isCovered(start, coveredRanges)) continue;
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) continue;
            const ch = parseNumber(m[2]);
            const v = parseNumber(m[3]);
            if (!(ch >= 1 && ch <= book.maxChapters && v >= 1 && v <= 176)) continue;
            const usedChapter = ch;
            const end = start + m[2].length + m[3].length;
            matches.push({
                text: text.slice(start, end), start, end,
                bookId: book.id, bookName: book.fullName, bookShortName: book.shortName,
                allRefs: [{ chapter: usedChapter, verse: v, verseEnd: null, suffix: null }]
            });
            re.lastIndex = end;
        }
        return matches;
    }

    // 阶段6：行内省略书卷名/章号的弱引用（如纲目行“　一 1”“　一 2 上”“　24～25”“　一 1～二 3”），
    // 依附本段或跨段落上下文；边界为空白（含全角空格　）、左括号或破折号（如“难处—二14~15”），
    // 不含行首（行首由 findLineStartRefs 负责）
    findWeakContinuationRefs(text, coveredRanges, resolveCtx) {
        const matches = [];
        const re = /([\s　（〔(–—‐])(?![\s　])/g;
        let runningChapter = null;
        let m;
        while ((m = re.exec(text)) !== null) {
            const start = m.index + m[1].length;
            if (this.isCovered(start, coveredRanges)) { re.lastIndex = start + 1; continue; }
            // 按本处所在位置取上下文：书卷沿用左侧最近引用（可跨行、跨段落），章号沿用其结束章
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) { re.lastIndex = start + 1; continue; }
            if (c.chapter != null) runningChapter = c.chapter;
            const ref = this.parseWeakRef(text.slice(start), book, runningChapter);
            if (!ref || ref.consumed <= 0) { re.lastIndex = start + 1; continue; }
            // 弱引用内部可能显式切换了书卷（如“　俄3”依附约叁上下文），归属应以切换后的书卷为准
            const effBook = ref.book || book;
            let end = start + ref.consumed;
            let refs = [{ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix, endChapter: ref.endChapter || null, endVerse: ref.endVerse || null }];
            // 向后吞并列延续项（如“　一2，一3，二4”“　一1，二3～5”），让同行弱引用一次成串高亮
            while (true) {
                const listSep = text.slice(end).match(/^[，、,;；][\s　]*/);
                if (!listSep) break;
                const q = end + listSep[0].length;
                const next = this.parseContinuationItem(text, q, effBook, refs[refs.length - 1].chapter);
                if (!next || next.endPos <= q) break;
                if (coveredRanges.some(([s]) => s >= q && s < next.endPos)) break;
                refs.push({ chapter: next.chapter, verse: next.verse, verseEnd: next.verseEnd || null, suffix: next.suffix || null, endChapter: next.endChapter || null, endVerse: next.endVerse || null });
                end = next.endPos;
            }
            const matchedSlice = text.slice(start, end);
            // 若本弱引用的区间内部已包含某个更强引用（如“参弗四17、21”中“弗四17、21”已由阶段1解析）
            // 的起点，说明这只是对已有书卷名的重复解析，跳过以免产生部分冗余高亮
            if (coveredRanges.some(([s]) => s >= start && s < end)) { re.lastIndex = start + 1; continue; }
            // 括号包裹的裸中文数字（纲目标记“（一）”“（四）”）不作经文出处
            const isBareCn = /^[一二三四五六七八九十百零〇]+$/.test(matchedSlice);
            const prevCh = start > 0 ? text[start - 1] : '';
            if (isBareCn && /[（〔(]/.test(prevCh) && /^[\s　]*[）〕)]/.test(text.slice(end))) { re.lastIndex = start + 1; continue; }
            // 纯数字（中文/阿拉伯，可带“第/节”前后缀，如“一”“（四）”“第五”）若未带范围/后缀，
            // 视为结构标记或正文数字，必须后跟范围/后缀/收尾标点/行尾/括号闭合才认可，
            // 避免误认纲目标记（“一”）与正文数字（“第五日”“31 岁”）；行尾（含换行）视为边界
            const bareNum = matchedSlice.replace(/^第/, '').replace(/节$/, '');
            const pureNum = /^[一二三四五六七八九十百零〇]+$/.test(bareNum) || /^\d+$/.test(bareNum);
            if (pureNum && !ref.verseEnd && !ref.suffix) {
                const afterSlice = text.slice(end);
                // 只跳过空格/制表符，换行保留下来作为“行尾边界”判断依据
                const skipSpace = afterSlice.match(/^[ \t　]*/);
                const nextChar = afterSlice.slice(skipSpace ? skipSpace[0].length : 0)[0];
                if (nextChar && !/[\d～~\-－–—‐上中下）〕)\],，。、；;\n]/.test(nextChar)) { re.lastIndex = start + 1; continue; }
            }
            matches.push({
                text: text.slice(start, end), start, end,
                bookId: effBook.id, bookName: effBook.fullName, bookShortName: effBook.shortName,
                allRefs: refs
            });
            const refEndCh = this.refEndChapter(refs[refs.length - 1]);
            if (refEndCh != null) runningChapter = refEndCh;
            re.lastIndex = end;
        }
        return matches;
    }

    // 轻量弹出菜单（用于经文弹窗的「复制范围」「投影模式」选项）
    showPopupMenu(anchorEl, items) {
        document.querySelectorAll('.bible-tooltip-menu').forEach(el => el.remove());
        const menu = document.createElement('div');
        menu.className = 'bible-tooltip-menu';
        for (const it of items) {
            const row = document.createElement('div');
            row.className = 'bible-tooltip-menu-item';
            row.textContent = it.label;
            row.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                menu.remove();
                if (it.action) it.action();
            });
            menu.appendChild(row);
        }
        document.body.appendChild(menu);
        const r = anchorEl.getBoundingClientRect();
        const mr = menu.getBoundingClientRect();
        let left = r.left;
        let top = r.bottom + 4;
        if (left + mr.width > window.innerWidth - 10) left = window.innerWidth - mr.width - 10;
        if (left < 10) left = 10;
        if (top + mr.height > window.innerHeight - 10) top = r.top - mr.height - 4;
        if (top < 10) top = 10;
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        // 点击菜单以外区域关闭
        setTimeout(() => {
            const onDoc = (ev) => {
                if (!menu.isConnected) { document.removeEventListener('click', onDoc, true); return; }
                if (ev.target && menu.contains(ev.target)) return;
                menu.remove();
                document.removeEventListener('click', onDoc, true);
            };
            document.addEventListener('click', onDoc, true);
        }, 0);
        return menu;
    }

    // 经文弹窗的「全局复制」：按全局顺序复制候选池 + 视图选中 + 本弹窗勾选
    copyTooltipSelection(view, list) {
        if (!view) { new Notice('请先打开圣经检索视图'); return; }
        view.copySelected(list);
    }

    // 经文弹窗的投影：按全局顺序投影，投影前关闭弹窗
    async projectTooltipSelection(view, list, mode) {
        let v = view || this.getSearchView();
        if (!v) v = await this.ensureSearchView();
        if (!v) { new Notice('无法打开圣经检索视图，投影失败'); return; }
        this.removeCurrentTooltip();
        v.projectSelections(list, mode);
    }

    // ==================== 经文弹窗自己的候选项 ====================
    // 弹窗是与「圣经搜索」「圣经阅读」并列的第三个窗口：
    // 未勾选「保留候选」时，每处经文引用（弹窗）独立统计——编号从 1 开始、弹窗之间互不累计，
    // 关闭后重新打开同一处引用仍然保留；勾选「保留候选」后，再与候选池同步合并。
    // 候选以「经文引用」为键分组保存（_tooltipPools），切换弹窗时只切换当前这一组。

    tooltipPoolListOf(sessionKey) {
        const key = sessionKey || 'default';
        if (!this._tooltipPools) this._tooltipPools = {};
        if (!this._tooltipPools[key]) this._tooltipPools[key] = [];
        return this._tooltipPools[key];
    }

    // 打开某个经文引用对应的弹窗：切换当前使用的候选组
    openTooltipPool(sessionKey) {
        this._tooltipPoolKey = sessionKey || 'default';
        return this.tooltipPoolListOf(this._tooltipPoolKey);
    }

    getTooltipPool() {
        return this.tooltipPoolListOf(this._tooltipPoolKey);
    }

    tooltipPoolIndexOf(item) {
        const key = verseIdentity(item, false);
        return this.getTooltipPool().findIndex(p => p.key === key);
    }

    tooltipPoolAdd(item, sideBySide, sessionKey) {
        if (!item) return;
        const key = verseIdentity(item, false);
        const pool = sessionKey ? this.tooltipPoolListOf(sessionKey) : this.getTooltipPool();
        if (pool.some(p => p.key === key)) return;
        const book = BOOK_ID_MAP[item.bookId];
        pool.push({
            key: key,
            item: item,
            bookShortName: item.bookShortName || (book ? book.shortName : ''),
            chapter: item.chapter,
            verse: item.verse,
            sideBySide: !!sideBySide
        });
    }

    tooltipPoolRemove(item) {
        const idx = this.tooltipPoolIndexOf(item);
        if (idx !== -1) this.getTooltipPool().splice(idx, 1);
    }

    // 切换某一项的「并」（与前一节并列）状态
    tooltipPoolSetSide(item, sideBySide) {
        const idx = this.tooltipPoolIndexOf(item);
        if (idx !== -1) this.getTooltipPool()[idx].sideBySide = !!sideBySide;
    }

    // 清空某一处引用的弹窗候选（默认当前弹窗）
    tooltipPoolClear(sessionKey) {
        this._tooltipPools = this._tooltipPools || {};
        this._tooltipPools[sessionKey || this._tooltipPoolKey || 'default'] = [];
    }

    // 清空全部弹窗候选（「清空」按钮：与圣经搜索 / 圣经阅读的清空一样，整体清空）
    tooltipPoolClearAll() {
        this._tooltipPools = {};
    }

    // 弹窗候选项按勾选顺序输出为统一的选中列表（保留「并」状态）
    tooltipPoolList() {
        return this.getTooltipPool().map((p, i) => ({
            item: p.item, selected: true, order: i + 1, sideBySide: !!p.sideBySide, _isCompare: false
        }));
    }

    showVerseTooltip(targetEl, match) {
        // 同一时间只显示一个弹窗
        document.querySelectorAll('.bible-inline-tooltip').forEach(el => el.remove());
        const tooltip = document.createElement('div');
        tooltip.className = 'bible-inline-tooltip';
        const refs = match.allRefs || [{ chapter: match.chapter, verse: match.verse, verseEnd: match.verseEnd, suffix: match.suffix, endChapter: match.endChapter, endVerse: match.endVerse }];
        // 本弹窗的「引用键」：同一处经文引用共用一组候选（关闭再打开仍保留），
        // 不同引用各自独立统计，勾选顺序互不影响
        const sessionKey = 'tt|' + match.bookId + '|' + refs.map(r =>
            `${r.chapter}:${r.verse == null ? '' : r.verse}${r.verseEnd ? '-' + r.verseEnd : ''}${r.endChapter ? '~' + r.endChapter + ':' + r.endVerse : ''}`
        ).join(',');
        this.openTooltipPool(sessionKey);
        // 收集弹窗中要显示的经文（每处一节，便于单独勾选与跳转）
        const verses = [];
        let hasMore = false;
        for (const ref of refs) {
            const chapter = ref.chapter;
            const verse = ref.verse;
            const verseEnd = ref.verseEnd;
            const endChapter = ref.endChapter;
            const endVerse = ref.endVerse;
            if (endChapter && endVerse) {
                for (let ch = chapter; ch <= endChapter; ch++) {
                    const startV = (ch === chapter) ? (verse || 1) : 1;
                    const endV = (ch === endChapter) ? endVerse : 999;
                    for (let v = startV; v <= endV; v++) {
                        const key = `${match.bookId}-${ch}-${v}`;
                        const item = this.verseIndex.get(key);
                        if (item) verses.push({ chapter: ch, verse: v, item: item });
                    }
                }
            } else if (verse && verseEnd && verseEnd >= verse) {
                for (let v = verse; v <= verseEnd; v++) {
                    const key = `${match.bookId}-${chapter}-${v}`;
                    const item = this.verseIndex.get(key);
                    if (item) verses.push({ chapter: chapter, verse: v, item: item });
                }
            } else if (verse) {
                const key = `${match.bookId}-${chapter}-${verse}`;
                const item = this.verseIndex.get(key);
                if (item) verses.push({ chapter: chapter, verse: verse, item: item });
            } else {
                for (let v = 1; v <= 3; v++) {
                    const key = `${match.bookId}-${chapter}-${v}`;
                    const item = this.verseIndex.get(key);
                    if (item) verses.push({ chapter: chapter, verse: v, item: item });
                }
                hasMore = true;
            }
        }

        // 顶部经文出处（双击跳转到圣经阅读视图）
        let refText = match.bookShortName;
        const first = refs[0];
        refText += first.chapter;
        if (first.verse) refText += `:${first.verse}`;
        if (first.verseEnd) refText += `-${first.verseEnd}`;
        if (first.endChapter && first.endVerse) refText += `～${first.endChapter}:${first.endVerse}`;
        if (first.suffix) refText += first.suffix;
        if (refs.length > 1) refText += ` 等${refs.length}处`;

        // 标题行：经文出处（双击跳转）+ 保留候选 + 候选计数 + 清空
        const headerRow = tooltip.createDiv({ cls: 'bible-inline-tooltip-header' });
        const refEl = headerRow.createDiv({ cls: 'bible-inline-tooltip-ref', text: refText });
        refEl.title = '双击跳转到圣经阅读视图';
        refEl.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeCurrentTooltip();
            this.jumpToBibleReader(match);
        });

        // 与「候选池」联动的检索视图（可能尚未打开；打开后即可与圣经搜索 / 圣经阅读的选中项一起投影）
        let view = this.getSearchView();

        // 「保留候选」开关：与圣经搜索、圣经阅读共用同一个开关；
        // 未勾选时本弹窗的勾选保存在弹窗自己的候选库里，只投影 / 复制本弹窗的内容
        const keepLabel = headerRow.createEl('label', { cls: 'bible-inline-tooltip-keep' });
        const keepCb = keepLabel.createEl('input', { type: 'checkbox' });
        keepCb.title = '勾选后，本弹窗选中的经文会进入候选池，可与圣经搜索 / 圣经阅读的选中项一起投影';
        keepLabel.createSpan({ text: '保留候选' });
        const keepCount = keepLabel.createSpan({ cls: 'bible-inline-tooltip-keep-count', text: '' });
        const keepClearBtn = keepLabel.createEl('button', { cls: 'bible-inline-tooltip-btn bible-inline-tooltip-clear', text: '清空' });
        keepClearBtn.title = '清空全部候选经文（经文弹窗 / 圣经搜索 / 圣经阅读）';
        keepCb.checked = view ? !!view.keepCandidates : false;
        keepLabel.addEventListener('click', (e) => e.stopPropagation());

        // 工具条：字体调节 / 全选·取消（合并） / 复制 / 投影
        const toolbar = tooltip.createDiv({ cls: 'bible-inline-tooltip-toolbar' });
        const fontMinusBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn', text: 'A-' });
        fontMinusBtn.title = '缩小字体';
        const fontLabel = toolbar.createEl('span', { cls: 'bible-inline-tooltip-font-size', text: '' });
        const fontPlusBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn', text: 'A+' });
        fontPlusBtn.title = '放大字体';
        const selToggleBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn', text: '全选' });
        const copyBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn bible-inline-tooltip-copy', text: '复制' });
        copyBtn.title = '复制勾选的经文';
        const projBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn bible-inline-tooltip-proj', text: '投影' });
        projBtn.title = '投影选中的内容（逐节 / 并列 / 混合）';

        const contentEl = tooltip.createDiv({ cls: 'bible-inline-tooltip-content' });

        // 记住弹窗字体大小
        const applyFontSize = (size) => {
            const s = Math.min(32, Math.max(10, size));
            if (this.settings.tooltipFontSize !== s) {
                this.settings.tooltipFontSize = s;
                this.saveSettings();
            }
            fontLabel.setText(s + 'px');
            contentEl.style.fontSize = s + 'px';
            // 字体变化后尽量保持弹窗在可视区域内
            if (tooltip.parentElement) {
                const r = tooltip.getBoundingClientRect();
                if (r.bottom > window.innerHeight - 10) {
                    tooltip.style.top = Math.max(10, window.innerHeight - r.height - 10) + 'px';
                }
                if (r.top < 10) tooltip.style.top = '10px';
            }
        };
        applyFontSize(this.settings.tooltipFontSize || 14);
        fontMinusBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); applyFontSize((this.settings.tooltipFontSize || 14) - 1); });
        fontPlusBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); applyFontSize((this.settings.tooltipFontSize || 14) + 1); });

        // 每处经文：候选框 + 出处（双击跳转）+ 内容
        const rows = [];
        if (verses.length === 0) {
            contentEl.createDiv({ cls: 'bible-inline-tooltip-verse', text: '未找到经文' });
        }
        for (const v of verses) {
            const row = contentEl.createDiv({ cls: 'bible-inline-tooltip-verse' });
            // 候选框：与圣经搜索 / 圣经阅读一致——未选中是空框，选中后直接显示选中顺序数字
            const box = row.createDiv({ cls: 'bible-inline-tooltip-checkbox' });
            box.title = '点击选中 / 取消此节经文';
            const numEl = row.createEl('span', { cls: 'bible-inline-tooltip-verse-num', text: v.chapter + ':' + v.verse });
            numEl.title = '双击跳转到圣经阅读视图的该节经文';
            numEl.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeCurrentTooltip();
                this.jumpToBibleReader({
                    bookId: match.bookId,
                    bookShortName: match.bookShortName,
                    allRefs: [{ chapter: v.chapter, verse: v.verse, verseEnd: null, suffix: null, endChapter: null, endVerse: null }]
                });
            });
            row.createEl('span', { cls: 'bible-inline-tooltip-verse-text', text: v.item.content });
            // 「并」标签：与圣经搜索 / 圣经阅读一致，选中后显示，点击切换并列
            const sideTag = row.createDiv({ cls: 'bible-inline-tooltip-side-tag' });
            sideTag.title = '与前一节并列显示（混合投影时合并到同一页）';
            const r = { row: row, box: box, sideTag: sideTag, verse: v, selected: false, sideBySide: false };
            rows.push(r);
            // 重新打开弹窗时恢复勾选：候选项可能在候选池中（已勾选「保留候选」），
            // 也可能只保存在弹窗自己的候选库中（未勾选「保留候选」时依然保留）
            const inPool = view ? view.poolIndexOf(v.item, false) !== -1 : false;
            const ownIdx = this.tooltipPoolIndexOf(v.item);
            if (inPool || ownIdx !== -1) {
                r.selected = true;
                r.sideBySide = inPool ? !!view.getPoolEntry(v.item, false).sideBySide : !!this.getTooltipPool()[ownIdx].sideBySide;
                // 若「保留候选」是在其它页面开启的，打开弹窗时把本弹窗的候选补进候选池
                if (!inPool && view && view.keepCandidates) view.poolSyncSelect(v.item, false, r.sideBySide, 'tooltip', sessionKey);
            }
            box.addEventListener('click', (e) => { e.stopPropagation(); setRowChecked(r, !r.selected); });
            sideTag.addEventListener('click', (e) => { e.stopPropagation(); toggleRowSideBySide(r); });
            // 点击整行切换选中（点击候选框 / 并标签由上面各自处理）
            row.addEventListener('click', (e) => {
                if (e.target === box || e.target === sideTag) return;
                setRowChecked(r, !r.selected);
            });
        }
        if (hasMore && verses.length > 0) {
            contentEl.createDiv({ cls: 'bible-inline-tooltip-more', text: '...' });
        }

        // ---- 选中 / 取消：始终记入弹窗自己的候选库；勾选「保留候选」时再同步进候选池 ----
        const setRowChecked = (r, checked) => {
            r.selected = !!checked;
            if (r.selected) {
                this.tooltipPoolAdd(r.verse.item, r.sideBySide);
                if (view && view.keepCandidates) view.poolSyncSelect(r.verse.item, false, r.sideBySide, 'tooltip', sessionKey);
            } else {
                r.sideBySide = false;
                this.tooltipPoolRemove(r.verse.item);
                if (view) view.poolSyncDeselect(r.verse.item, false);
            }
            if (view) view.updateKeepCandidatesUI();
            refreshOrders();
            updateSelToggleBtn();
        };

        // ---- 切换「并」（与前一节并列）：与圣经搜索 / 圣经阅读的「并」标签一致 ----
        const toggleRowSideBySide = (r) => {
            if (!r.selected) return;
            r.sideBySide = !r.sideBySide;
            this.tooltipPoolSetSide(r.verse.item, r.sideBySide);
            if (view) {
                if (view.poolSetSideBySide) view.poolSetSideBySide(r.verse.item, false, r.sideBySide);
                view.updateKeepCandidatesUI();
            }
            refreshOrders();
        };

        // ---- 刷新每行的选中状态（候选框显示顺序数字 / 「并」标签）+ 标题栏计数 ----
        // 勾选「保留候选」→ 与圣经搜索 / 圣经阅读统一编号（候选池在前）；
        // 未勾选 → 本弹窗独立编号（从 1 开始），与其它窗口互不干扰。
        const refreshOrders = () => {
            const keepOn = !!(view && view.keepCandidates);
            const base = keepOn ? view.getAllSelections().length : this.getTooltipPool().length;
            let n = 0;
            for (const r of rows) {
                if (!r.selected) {
                    r.box.setText('');
                    r.box.classList.remove('checked');
                    r.sideTag.style.display = 'none';
                    r.sideTag.classList.remove('active');
                    r.sideTag.setText('并');
                    continue;
                }
                const idx = keepOn
                    ? view.poolIndexOf(r.verse.item, false)
                    : this.tooltipPoolIndexOf(r.verse.item);
                r.box.setText(String((idx !== -1) ? (idx + 1) : (base + (++n))));
                r.box.classList.add('checked');
                // 「并」标签：与圣经搜索 / 圣经阅读一致，选中后才出现
                r.sideTag.style.display = 'block';
                if (r.sideBySide) r.sideTag.classList.add('active'); else r.sideTag.classList.remove('active');
                r.sideTag.setText(r.sideBySide ? '✓ 并列' : '并');
            }
            // 标题栏的候选计数 / 清空按钮：与圣经搜索 / 圣经阅读的「保留候选」逻辑一致——
            // 勾选「保留候选」→ 显示候选池的总数（各窗口共享，与搜索页 / 阅读页显示同一个数字）；
            // 未勾选 → 各窗口互不干扰，只统计本弹窗自己的候选数。
            const ownN = this.getTooltipPool().length;
            const cnt = keepOn ? (view ? view.candidatePool.length : 0) : ownN;
            keepCount.setText(cnt > 0 ? ' (' + cnt + ')' : '');
            keepClearBtn.style.display = cnt > 0 ? 'inline-block' : 'none';
            keepCb.checked = keepOn;
        };

        // ---- 全选 / 取消（同一按钮自动切换文案，与「全局全选」一样重置并列）----
        const isAllChecked = () => rows.length > 0 && rows.every(r => r.selected);
        const updateSelToggleBtn = () => {
            const all = isAllChecked();
            selToggleBtn.setText(all ? '取消' : '全选');
            selToggleBtn.title = all ? '取消本弹窗的全部勾选' : '勾选本弹窗的全部经文';
        };
        selToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const next = !isAllChecked();
            for (const r of rows) {
                if (next) { r.sideBySide = false; setRowChecked(r, true); }
                else setRowChecked(r, false);
            }
            updateSelToggleBtn();
        });

        // ---- 「保留候选」开关：与其它页面共用同一状态 ----
        keepCb.addEventListener('change', async () => {
            const on = keepCb.checked;
            let v = view || this.getSearchView();
            if (!v && on) v = await this.ensureSearchView();
            if (!v) { keepCb.checked = false; new Notice('无法访问圣经检索视图'); return; }
            view = v;
            if (on) {
                v.setKeepCandidates(true);
                // 本弹窗候选库中的经文全部纳入候选池（不止当前这几节，并保留「并」状态）
                for (const p of this.getTooltipPool().slice()) v.poolSyncSelect(p.item, false, !!p.sideBySide, 'tooltip', sessionKey);
                v.updateKeepCandidatesUI();
            } else {
                // 关闭时：候选池中的弹窗候选项归还给弹窗自己，检索页 / 阅读页各留各的
                v.setKeepCandidates(false);
            }
            keepCb.checked = !!v.keepCandidates;
            refreshOrders();
            updateSelToggleBtn();
        });
        keepCb.addEventListener('click', (e) => e.stopPropagation());

        // ---- 标题栏「清空」：与圣经搜索 / 圣经阅读的清空一致，整体清空所有窗口的候选 ----
        // 候选池 + 圣经搜索 + 圣经阅读 + 全部经文弹窗，一次清空
        keepClearBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            let v = view || this.getSearchView();
            if (!v) v = await this.ensureSearchView();
            const ownN = this.getTooltipPool().length;
            const beforeN = v ? v.getAllSelections().length : ownN;
            const hadOther = beforeN > ownN;
            if (v) v.clearAllSelections();              // 候选池 + 圣经搜索 + 圣经阅读
            this.tooltipPoolClearAll();                 // 全部经文弹窗的候选（不只是当前这一处引用）
            for (const r of rows) { r.selected = false; r.sideBySide = false; }
            refreshOrders();
            updateSelToggleBtn();
            new Notice(hadOther
                ? '已清空全部候选经文（经文弹窗 / 圣经搜索 / 圣经阅读）'
                : '已清空经文弹窗的候选经文');
        });

        const pickedRows = () => rows.filter(r => r.selected);
        const formatRows = (list) => list.map(r => `${match.bookShortName}${r.verse.chapter}:${r.verse.verse} ${r.verse.item.content}`).join('\n');
        // 本弹窗窗口自己的候选（跨弹窗保留）
        const ownList = () => this.tooltipPoolList();
        const formatOwn = () => this.getTooltipPool()
            .map(p => `${p.bookShortName || match.bookShortName}${p.chapter}:${p.verse} ${p.item.content}`).join('\n');
        const keepOn = () => !!(view && view.keepCandidates);

        // 本弹窗之外（候选池 / 圣经搜索 / 圣经阅读）仍有选中项 → 复制时需要选择范围
        // 未勾选「保留候选」时各窗口互不干扰，因此不存在「本弹窗之外」的内容
        const outsideCount = () => {
            if (!keepOn()) return 0;
            const keys = new Set(this.getTooltipPool().map(p => p.key));
            for (const r of pickedRows()) keys.add(verseIdentity(r.verse.item, false));
            return view.getAllSelections().filter(s => !keys.has(verseIdentity(s.item, !!s._isCompare))).length;
        };

        // 全局内容顺序：候选池 + 当前视图选中 + 本弹窗未入池的候选
        const buildGlobalList = () => {
            const list = view ? view.getAllSelections() : [];
            let n = list.length;
            for (const p of this.getTooltipPool()) {
                if (view && view.poolIndexOf(p.item, false) !== -1) continue;
                n++;
                list.push({ item: p.item, selected: true, order: n, sideBySide: !!p.sideBySide, _isCompare: false });
            }
            return list;
        };

        const doCopyText = (text, count) => {
            const done = () => new Notice('已复制 ' + count + ' 节经文');
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(done).catch(() => new Notice('复制失败'));
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                try {
                    const ok = document.execCommand('copy');
                    document.body.removeChild(ta);
                    if (ok) done(); else new Notice('复制失败');
                } catch (err) {
                    document.body.removeChild(ta);
                    new Notice('复制失败');
                }
            }
        };

        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const picked = pickedRows();
            const own = this.getTooltipPool();
            if (picked.length === 0 && own.length === 0) { new Notice('请先勾选要复制的经文'); return; }
            // 未勾选「保留候选」→ 各窗口各自独立，只复制本弹窗的内容
            if (!keepOn()) {
                doCopyText(formatOwn(), own.length || picked.length);
                return;
            }
            const out = outsideCount();
            if (out === 0) {
                doCopyText(formatOwn(), own.length || picked.length);
                return;
            }
            // 多个页面都有候选经文 → 弹出复制范围选项
            this.showPopupMenu(copyBtn, [
                { label: '本页复制（' + (own.length || picked.length) + ' 节）', action: () => doCopyText(formatOwn(), own.length || picked.length) },
                { label: '全局复制（' + buildGlobalList().length + ' 条）', action: () => this.copyTooltipSelection(view || this.getSearchView(), buildGlobalList()) }
            ]);
        });

        projBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // 未勾选「保留候选」→ 只投影本弹窗窗口的内容；勾选后投影全局（候选池 + 本弹窗）
            const list = keepOn() ? buildGlobalList() : ownList();
            if (list.length === 0) { new Notice('请先勾选要投影的经文'); return; }
            // 三种投影模式选项
            this.showPopupMenu(projBtn, [
                { label: '逐节投影', action: () => this.projectTooltipSelection(view || this.getSearchView(), list, 'focus') },
                { label: '并列投影', action: () => this.projectTooltipSelection(view || this.getSearchView(), list, 'parallel') },
                { label: '混合投影', action: () => this.projectTooltipSelection(view || this.getSearchView(), list, 'mixed') }
            ]);
        });

        refreshOrders();
        updateSelToggleBtn();

        document.body.appendChild(tooltip);
        const rect = targetEl.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + 8;
        if (left + tooltipRect.width > window.innerWidth - 20) left = window.innerWidth - tooltipRect.width - 20;
        if (left < 10) left = 10;
        if (top + tooltipRect.height > window.innerHeight - 20) top = rect.top - tooltipRect.height - 8;
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        // 移动端适配：不再依赖悬停关闭，改为“点击弹窗以外区域”关闭
        // （由 onload 中注册的 document 级 click 处理器统一处理）
    }

    removeCurrentTooltip() {
        document.querySelectorAll('.bible-inline-tooltip').forEach(el => el.remove());
    }

    async jumpToBibleReader(match) {
        await this.activateSearchView();
        const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
        if (leaves.length === 0) return;
        const view = leaves[0].view;
        const book = BOOK_ID_MAP[match.bookId];
        if (!book) return;
        view.readerBook = book;
        view.readerChapter = match.allRefs[0].chapter || 1;
        view.readerState = 'content';
        // 勾选「保留候选」时，跳转前先把检索页已选中的候选经文冻结进候选池
        if (view.keepCandidates && view.activeTab !== 'reader' && view.freezeSelections) view.freezeSelections('search');
        view.activeTab = 'reader';
        view.tabSearch.classList.remove('active');
        view.tabReader.classList.add('active');
        if (view.searchPanel) view.searchPanel.style.display = 'none';
        if (view.readerPanel) view.readerPanel.style.display = 'flex';
        if (view.readerContent) view.readerContent.empty();
        if (view.readerFixedTop) view.readerFixedTop.empty();
        await view.renderChapterContent();
        const firstRef = match.allRefs[0];
        if (firstRef.verse) {
            const item = this.allItems.find(i => i.versionKey === this.getPrimaryVersionKey() && i.bookId === match.bookId && i.chapter === firstRef.chapter && i.verse === firstRef.verse && i.type === 'verse');
            if (item && view.scrollToReaderItem) view.scrollToReaderItem(item);
        }
    }

}

module.exports = BibleSearchPlugin;
/* nosourcemap */
//（注：内容由AI生成）
