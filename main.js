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

// 单字书卷名黑名单：这些单字在日常文本里几乎只作普通汉字/动词出现（如「拿」=拿取），
// 由强引用路径（parseRefCluster）识别时，单字 + 整章（无节号、非跨章范围）几乎必是正文而非引用
// （如「拿一」=拿一块），不作为经文出处；带节号（拿一1 = 约拿书 1:1）仍正常识别。
// 如需为其它单字书卷关掉这种「单字 + 整章」的弱匹配，往此集合加一字即可。
const BOOK_NAME_DENYLIST = new Set(['拿']);

// 单字书卷名几乎都是常用汉字（创/出/可/来/徒/约/多/门…），强引用阶段只要它后面
// 能解析出章节，就可能把「普通词的最后一个字」误当书卷名：
//   「使徒　三1～6」→ 徒 3:1-6（「徒」其实是「使徒」的词尾，真正出处只有「三1～6」）
//   「大约三1」「将来三1」「东西三1」同理。
// 这里列出「左邻字 + 单字书卷名」构成的常见双字词；命中时该单字不作书卷名。
// 按书卷名分组，只写左邻字（运行期补上书卷名本身），便于逐卷核对与扩充。
const BOOK_NAME_PROSE_WORDS = (() => {
    const groups = {
        '利': '顺 便 福 功 有 流 犀 胜 吉 红 专 暴 私 名 权 益 锐 毛',
        '民': '人 市 居 村 国 移 选 平 难 全 网 股 农 牧 公 庶',
        '书': '读 图 秘 尚 证 经 圣 新 古 看 写 抄 藏 教 遗 文',
        '士': '人 战 博 硕 学 绅 武 将 护 烈 勇 谋 隐 志 教 修 卫 兵',
        '得': '取 获 使 记 懂 值 显 免 落 舍 求 心 自 不',
        '诗': '歌 写 古 史 情 新 颂 作 吟 唐 律',
        '传': '宣 说 统 流 相 遗 列 外 经 家 秘 真 口 世 嫡',
        '歌': '诗 国 民 赞 颂 情 唱 高 凯 挽 山 讴',
        '赛': '比 竞 球 决 初 复 大 联 预 参 田 径',
        '结': '果 束 合 团 总 论 账 连 纠 凝 冻 完 终 集 婚 巴',
        '但': '不 凡 愿 岂',
        '何': '任 如 几 必 时 处 以 况 故 等',
        '摩': '观 按 揣 抚 研',
        '番': '几 轮 翻 屡 更',
        '该': '应 活 本 当',
        '亚': '东 西 南 北 中 欧',
        '太': '阳 平 太 空 极 多 子 祖 初 古',
        '可': '认 许 无 尚 宁 不 即 未 两',
        '路': '道 公 思 出 马 线 门 生 套 电 迷 走 引 活 正 岔 上 下 同 之',
        '约': '大 节 预 契 合 相 简 制 盟 条 婚 立 背 守 失 邀 爽 解 缔 誓 旧 新 密 捆',
        '徒': '使 门 信 圣 学 叛 匪 歹 囚 酒 赌 暴 恶 督 党 生 工',
        '罗': '张 搜 网 包 姓 森 星',
        '加': '参 增 更 添 附 强 施 累 叠 外 愈 交 追',
        '西': '东 中 巴 陕 山 广 江 湖 河',
        '多': '许 很 大 众 居 诸 好 特 增 过 繁 众',
        '门': '大 部 专 徒 窍 入 开 名 豪 后 前 出 闭 满 同 佛 山 校 登 叩 守 看',
        '来': '将 原 后 以 出 未 本 近 从 进 上 下 回 过 拿 带 看 想 历 向 古 生 素 近 起 日',
        '雅': '文 优 典 高 幽 儒 温 清 淡 娴',
        '犹': '如 太 大 自 且 尚',
        '启': '开 示 动 发 蒙 迪 用 程',
    };
    const set = new Set();
    for (const [book, prefixes] of Object.entries(groups)) {
        for (const p of prefixes.split(/\s+/)) if (p) set.add(p + book);
    }
    return set;
})();

// 引用引导字：紧挨在书卷名左边时，说明这是「参看罗 三1」这类合法引用，
// 不应用下面的「词尾 + 空白」兜底规则跳过。
const BOOK_REF_GUIDE_CHARS = new Set('参见看如读查引载据论及与和或即比从到说详证在'.split(''));

// 除（ ）( )〔 〕外，中文里也常用这些成对括号 / 引号包住明确的经节标记（【16】「16」『16』）。
// 但「」『』“ ” 大量用于普通引文（「你们今日若听见祂的声音」「三年」「2026年」），
// 因此新增括号只放行「纯节号形态」的内容：仅数字、范围符、上中下、并列分隔符，
// 且中文数字与阿拉伯数字不得混排（「三1～6」是章+节，交给原有弱引用阶段处理）。
const EXTRA_VERSE_BRACKETS = [['【', '】'], ['「', '」'], ['『', '』'], ['“', '”'], ['‘', '’']];
const VERSE_BRACKET_CONTENT_RE = /^[\d一二三四五六七八九十百零〇～~\-－至–—‐上中下，,、；;\s　]+$/;
function isPureVerseBracketContent(content) {
    const s = content.trim().replace(/^(?:参看|参考|参|见)/, '').replace(/[\s　]/g, '');
    if (!s || !VERSE_BRACKET_CONTENT_RE.test(s)) return false;
    if (/\d/.test(s) && /[一二三四五六七八九十百零〇]/.test(s)) return false;
    return true;
}

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
    '玛拉基': '玛',     '罗马': '罗', '哥林多前': '林前', '哥林多后': '林后',
    // 「行传」是使徒行传的常见简称，必须放在「传」（传道书）之前生效；
    // buildBookNameList 按长度降序排列，2 字的「行传」会先于 1 字的「传」被解析
    '行传': '徒', '徒行传': '徒',
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

// 检索框专用书卷名表：在简称之外再加上全名（创世记 / 马太福音 …）。
// 短拼本来就取自全名字首（csj = 创世记），若中文全名反而不能检索会很不自然，
// 因此这里补齐，且只用这一张新表 —— 笔记正文的引用识别仍然只认 BOOK_SHORT_NAMES，
// 不会被「启示」「行传」这类常见词污染。按长度降序，保证「撒母耳记上」先于「撒」命中。
const SEARCH_BOOK_NAMES = (() => {
    const set = new Set(BOOK_SHORT_NAMES);
    for (const book of BIBLE_BOOKS) set.add(book.fullName);
    return Array.from(set).sort((a, b) => b.length - a.length);
})();

// ===== 书卷短拼（拼音首字母）=====
// 只作用于「搜索框」的查询解析：把 token 开头的拼音短拼还原成中文书卷简称，
// 之后完全复用既有的引用解析逻辑。刻意不并入 BOOK_MAP / BOOK_ALIASES /
// BOOK_SHORT_NAMES —— 那几张表同时供「笔记正文经文引用识别」使用，加入拉丁字母
// 缩写会让 sp2 / csj1 之类普通文本被误判成经文出处。
// 只收录圣经书卷名用到的汉字，按声母分组；未收录的字会让整串短拼作废，
// 避免生成错误缩写。
const PINYIN_LETTER_CHARS = {
    a: '阿哀埃',
    b: '巴伯比彼',
    c: '创出传',
    d: '但道得底代大多',
    e: '俄珥耳贰二',
    f: '弗番福腓',
    g: '各该歌谷哥',
    h: '哈何后鸿翰',
    j: '及记纪加基结迦',
    k: '可',
    l: '利拉历立林理罗录路来列',
    m: '民母命弥玛马摩门米',
    n: '尼拿那',
    p: '篇',
    q: '前启',
    s: '世申数上书士师使撒斯赛叁示所三司上诗',
    t: '太帖提徒',
    w: '未王',
    x: '西下希行',
    y: '以亚雅耶音犹约壹言一',
    z: '志箴',
};
const PINYIN_INITIAL_OF_CHAR = (() => {
    const map = {};
    for (const letter of Object.keys(PINYIN_LETTER_CHARS)) {
        for (const ch of PINYIN_LETTER_CHARS[letter]) {
            if (!map[ch]) map[ch] = letter;
        }
    }
    return map;
})();
function pinyinInitials(text) {
    let out = '';
    for (const ch of String(text)) {
        const c = PINYIN_INITIAL_OF_CHAR[ch];
        if (!c) return '';
        out += c;
    }
    return out;
}
// 短拼 → 中文简称。全名首字母（csj / mtfy / qsl …）为主，
// 两字以上的简称（林前 lq、撒上 ss …）作为补充；凡有多卷撞同一短拼就都不注册，
// 避免把 c 这类高度歧义的单字母硬指派给某一卷。
const BOOK_PINYIN_ABBR = (() => {
    const hits = {};
    const add = (text, shortName) => {
        const ab = pinyinInitials(text);
        if (!ab) return;
        (hits[ab] = hits[ab] || new Set()).add(shortName);
    };
    for (const book of BIBLE_BOOKS) {
        add(book.fullName, book.shortName);
        if (book.shortName.length >= 2) add(book.shortName, book.shortName);
    }
    const map = {};
    for (const ab of Object.keys(hits)) {
        if (hits[ab].size === 1) map[ab] = Array.from(hits[ab])[0];
    }
    return map;
})();
// 把查询词开头的短拼还原成中文简称。要求短拼后面紧跟章号，
// 否则像「csj」这样的纯字母仍按普通关键词检索，不劫持英文输入。
function normalizeBookAbbr(token) {
    const m = /^([A-Za-z]+)([\s\S]*)$/.exec(token);
    if (!m) return token;
    if (!/^[\d０-９一二三四五六七八九十百零〇]/.test(m[2])) return token;
    const shortName = BOOK_PINYIN_ABBR[m[1].toLowerCase()];
    if (!shortName) return token;
    return shortName + m[2];
}
// 短拼单独成词（「csj 1:1」）时，供 parseQuery 把后一段章号并过来
function bookAbbrOf(token) {
    return /^[A-Za-z]+$/.test(token) ? (BOOK_PINYIN_ABBR[token.toLowerCase()] || null) : null;
}

// ===== 搜索框书卷短拼自动补全 =====
// 与 BOOK_PINYIN_ABBR 的区别：这里保留「全部」短拼条目（包括因多卷撞车而没有注册进解析层的），
// 只用于「前缀 → 书卷」的候选提示。输入 c 时靠 csj / caj / cds … 反查出创世记、出埃及记、
// 传道书等；解析层仍然只认唯一短拼，补全不会放宽任何检索规则，也不会碰到 BOOK_MAP /
// BOOK_ALIASES / BOOK_SHORT_NAMES（笔记正文的引用识别不受影响）。
// 同一卷可有多条短拼（全名 smes、简称 ss），都得留着，否则输入 sm 就找不到撒母耳记上。
const BOOK_ABBR_SUGGESTIONS = (() => {
    const out = [];
    const seen = new Set();
    const add = (text, book, kind) => {
        const ab = pinyinInitials(text);
        if (!ab) return;
        const abbr = ab.toLowerCase();
        const key = abbr + '|' + book.id;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ abbr, bookId: book.id, shortName: book.shortName, fullName: book.fullName, kind });
    };
    for (const book of BIBLE_BOOKS) {
        add(book.fullName, book, 'full');
        if (book.shortName.length >= 2) add(book.shortName, book, 'short');
    }
    return out;
})();

// 光标所在的「当前词」：分隔符与 parseQuery 的分词保持一致。
// 只在该词以拉丁字母开头、字母后面跟的是章号/标点（而不是又一段英文）时才认为可以补全，
// 避免输入 grace、genesis 这类普通英文关键词时一直弹书卷列表。
// 返回 { token, start, letters, rest }，start 是字母段在整个输入值里的起点。
function getAbbrTokenAtCaret(value, caret) {
    const text = String(value == null ? '' : value);
    const pos = Math.max(0, Math.min(text.length, Number(caret) || 0));
    const before = text.slice(0, pos);
    const seg = /([^,，、；;\s。.]*)$/.exec(before);
    const token = seg ? seg[1] : '';
    const m = /^([A-Za-z]+)([\d０-９一二三四五六七八九十百零〇章篇:：～~\-—－.,，、；;\s]*)$/.exec(token);
    if (!m || !m[1] || m[1].length > 12) return null;
    return { token, start: pos - token.length, letters: m[1], rest: m[2] || '', value: text };
}

// 按前缀取候选。同一卷在当前前缀下只出一行（优先精确短拼，其次解析层认得的、再其次更短的），
// 列表一律按圣经书卷次序（创世记 → 启示录）排列，不再按短拼长度或字母序插队：
// 输入 c 时「创世记、出埃及记…」的顺序应当和圣经目录一致，方便按方向键顺序找书卷。
function getBookAbbrSuggestions(prefix, limit) {
    const p = String(prefix || '').toLowerCase();
    if (!/^[a-z]+$/.test(p)) return [];
    const score = (x) => (x.abbr === p ? 0 : (BOOK_PINYIN_ABBR[x.abbr] === x.shortName ? 1 : 2)) * 100 + x.abbr.length;
    const byBook = new Map();
    for (const s of BOOK_ABBR_SUGGESTIONS) {
        if (!s.abbr.startsWith(p)) continue;
        const prev = byBook.get(s.bookId);
        if (!prev || score(s) < score(prev)) byBook.set(s.bookId, s);
    }
    const list = Array.from(byBook.values());
    list.sort((a, b) => a.bookId - b.bookId);
    return list.slice(0, Math.max(1, Number(limit) || 12));
}

// 输入已经是一条完整且唯一的短拼（mtfy / lq / csj / tmtqs …）时，下拉依然要出现：
// 用户需要「这串短拼到底是哪卷书」的确认提示。但此时补全不会改写文本，若照常
// 吃掉 Enter，就得按两次才能检索；所以这类「精确提示」下 Enter / Tab 放行给查询。
function isExactAbbrHit(letters, cands) {
    return !!(cands && cands.length === 1 &&
        cands[0].abbr === String(letters || '').toLowerCase());
}

// 选中候选项后只把字母段换成该卷的完整短拼，章号等后续内容原样保留：
// 「mtfy1，tm」→「mtfy1，tmtqs」，搜索框里始终显示短拼而不是中文书名。
function applyBookAbbrSuggestion(value, caret, suggestion) {
    const tok = getAbbrTokenAtCaret(value, caret);
    if (!tok || !suggestion || !suggestion.abbr) return null;
    const abbr = String(suggestion.abbr).toLowerCase();
    const head = tok.value.slice(0, tok.start) + abbr + tok.rest;
    const tail = tok.value.slice(tok.start + tok.token.length);
    return { value: head + tail, caret: head.length };
}

// 投影顶部搜索框专用的短拼补全控制器。
// 与侧边栏共用上面三个纯函数和 .bible-abbr-suggestion 样式，但独立持有 DOM 与状态：
// 投影是挂在 body 上的全屏浮层，生命周期和 BibleSearchView 不同，若把状态挂在视图实例上，
// 关闭投影后下拉会残留在 body 里。下拉同样挂 body + fixed，层级高于投影层。
class ProjBookAbbrSuggestion {
    // mountEl 传投影覆盖层本身：按 D 进入全屏投影时覆盖层会进入浏览器 top layer，
    // 挂在 body 上的浮层（哪怕 z-index 更高）都会被挡住，只有挂进覆盖层内部才看得见。
    constructor(input, onApply, mountEl) {
        this.input = input;
        this.onApply = typeof onApply === 'function' ? onApply : function () {};
        this.mountEl = mountEl || (typeof document !== 'undefined' ? document.body : null);
        this.el = null;
        this.list = null;
        this.items = [];
        this.cands = [];
        this.index = 0;
        this.open = false;
        this.dismissed = null;
        const self = this;
        this._onFocus = () => self.refresh();
        this._onClick = () => self.refresh();
        this._onKeyUp = (e) => {
            if (e && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End')) self.refresh();
        };
        this._onCompositionEnd = () => self.refresh();
        this._onBlur = () => self.close();
        this._onReposition = () => { if (self.open) self.position(); };
        this._onDocDown = (e) => {
            if (!self.open) return;
            const t = e && e.target;
            if (t && t.closest && (t === input || t.closest('.bible-abbr-suggestion'))) return;
            self.close();
        };
        input.addEventListener('focus', this._onFocus);
        input.addEventListener('click', this._onClick);
        input.addEventListener('keyup', this._onKeyUp);
        input.addEventListener('compositionend', this._onCompositionEnd);
        input.addEventListener('blur', this._onBlur);
        // 定位重算 / 点外部收起属于增强能力，环境不具备时静默跳过，不影响投影本体
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('resize', this._onReposition);
        }
        if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
            document.addEventListener('pointerdown', this._onDocDown, true);
        }
    }

    destroy() {
        const i = this.input;
        if (i) {
            i.removeEventListener('focus', this._onFocus);
            i.removeEventListener('click', this._onClick);
            i.removeEventListener('keyup', this._onKeyUp);
            i.removeEventListener('compositionend', this._onCompositionEnd);
            i.removeEventListener('blur', this._onBlur);
        }
        if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
            window.removeEventListener('resize', this._onReposition);
        }
        if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
            document.removeEventListener('pointerdown', this._onDocDown, true);
        }
        if (this.el && this.el.parentNode) {
            try { this.el.parentNode.removeChild(this.el); } catch (err) { /* 忽略 */ }
        }
        this.el = null;
        this.list = null;
        this.open = false;
    }

    refresh(e) {
        const input = this.input;
        if (!input || (e && e.isComposing)) return;
        const value = String(input.value == null ? '' : input.value);
        const caret = (typeof input.selectionStart === 'number') ? input.selectionStart : value.length;
        const tok = getAbbrTokenAtCaret(value, caret);
        if (!tok) { this.close(); return; }
        const key = tok.value + '|' + tok.start + '|' + tok.letters;
        if (this.dismissed === key) { this.close(); return; }
        this.dismissed = null;
        const cands = getBookAbbrSuggestions(tok.letters, 12);
        if (!cands.length) { this.close(); return; }
        // 输全的唯一短拼也照常显示，作为「这串短拼是哪卷书」的确认提示
        this.render(cands, isExactAbbrHit(tok.letters, cands));
    }

    render(cands, exactHit) {
        const doc = document;
        if (!this.el) {
            const el = doc.createElement('div');
            el.className = 'bible-abbr-suggestion';
            const list = doc.createElement('div');
            list.className = 'bible-abbr-suggestion-list';
            const foot = doc.createElement('div');
            foot.className = 'bible-abbr-suggestion-foot';
            el.appendChild(list);
            el.appendChild(foot);
            (this.mountEl || doc.body).appendChild(el);
            this.el = el;
            this.list = list;
            this.foot = foot;
        }
        this.exactHit = !!exactHit;
        if (this.foot) this.foot.textContent = this.exactHit
            ? '已匹配 · 自动投影 · Enter 确认 · Esc 取消'
            : '↑↓ 选择 · Enter 补全 · Esc 取消';
        const self = this;
        const list = this.list;
        list.textContent = '';
        this.items = cands.map((c, i) => {
            const row = doc.createElement('div');
            row.className = 'bible-abbr-suggestion-item' + (i === 0 ? ' is-active' : '');
            const name = doc.createElement('span');
            name.className = 'bible-abbr-name';
            name.textContent = c.fullName;
            const short = doc.createElement('span');
            short.className = 'bible-abbr-short';
            short.textContent = c.shortName;
            const code = doc.createElement('span');
            code.className = 'bible-abbr-code';
            code.textContent = c.abbr;
            row.appendChild(name);
            row.appendChild(short);
            row.appendChild(code);
            const pick = (ev) => {
                if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
                self.pick(i);
            };
            row.addEventListener('pointerdown', pick);
            row.addEventListener('mousedown', pick);
            list.appendChild(row);
            return row;
        });
        this.cands = cands;
        this.index = 0;
        this.open = true;
        this.el.style.display = 'flex';
        this.el.classList.add('bible-abbr-open');
        this.position();
    }

    position() {
        const el = this.el, input = this.input;
        if (!el || !input || typeof input.getBoundingClientRect !== 'function') return;
        const r = input.getBoundingClientRect();
        el.style.left = Math.max(4, r.left) + 'px';
        el.style.width = Math.max(200, Math.min(360, r.width || 240)) + 'px';
        const vh = (typeof window !== 'undefined' && window.innerHeight) || 800;
        const h = el.offsetHeight || 240;
        const below = vh - r.bottom;
        if (below < Math.min(h + 8, 160) && r.top > h + 8) el.style.top = Math.max(4, r.top - h - 4) + 'px';
        else el.style.top = (r.bottom + 4) + 'px';
    }

    close() {
        this.open = false;
        this.items = [];
        this.cands = [];
        if (!this.el) return;
        if (this.el.classList && this.el.classList.remove) this.el.classList.remove('bible-abbr-open');
        this.el.style.display = 'none';
    }

    highlight() {
        const list = this.list;
        this.items.forEach((row, i) => {
            if (i === this.index) row.classList.add('is-active');
            else row.classList.remove('is-active');
        });
        const active = this.items[this.index];
        if (active && list && typeof list.scrollTop === 'number') {
            const top = active.offsetTop || 0, h = active.offsetHeight || 0;
            if (top < list.scrollTop) list.scrollTop = top;
            else if (top + h > list.scrollTop + list.clientHeight) list.scrollTop = top + h - list.clientHeight;
        }
    }

    // 返回 true 表示该键已被补全消费，投影搜索框不要再当 Enter 触发检索
    handleKey(e) {
        if (!this.open || !this.cands.length) return false;
        if (!e || e.isComposing || e.keyCode === 229 || e.ctrlKey || e.metaKey || e.altKey) return false;
        const key = e.key;
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            const n = this.cands.length;
            this.index = (this.index + (key === 'ArrowDown' ? 1 : -1) + n) % n;
            this.highlight();
            e.preventDefault(); e.stopPropagation();
            return true;
        }
        if (key === 'Enter' || key === 'Tab') {
            // 精确提示（mtfy / lq …）下补全不会改动文本，收起提示并放行，让 Enter 直接投影
            if (this.exactHit) { this.close(); return false; }
            this.pick(this.index);
            e.preventDefault(); e.stopPropagation();
            return true;
        }
        if (key === 'Escape') {
            const input = this.input;
            const value = String(input.value == null ? '' : input.value);
            const caret = (typeof input.selectionStart === 'number') ? input.selectionStart : value.length;
            const tok = getAbbrTokenAtCaret(value, caret);
            if (tok) this.dismissed = tok.value + '|' + tok.start + '|' + tok.letters;
            this.close();
            e.preventDefault(); e.stopPropagation();
            return true;
        }
        return false;
    }

    pick(i) {
        const cand = this.cands[i];
        if (!cand || !this.open) return;
        const input = this.input;
        const value = String(input.value == null ? '' : input.value);
        const caret = (typeof input.selectionStart === 'number') ? input.selectionStart : value.length;
        const applied = applyBookAbbrSuggestion(value, caret, cand);
        if (!applied) { this.close(); return; }
        input.value = applied.value;
        try { input.setSelectionRange(applied.caret, applied.caret); } catch (err) { /* 忽略 */ }
        this.close();
        this.onApply(applied.value);
    }
}


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
    // 注意：consumed 必须是整个数字串的长度，只返回切分点会把后半截数字留在高亮之外
    // （旧写法 consumed:i 会把「17节」错切成 1:7 且只高亮「1」）。
    // 同时限制总位数 2～3 位：4 位以上（年份「2026」、编号等）一律不当连写，
    // 否则会被切成 2:26 这类莫须有的引用。
    const m3 = remaining.match(/^(\d{2,3})(?!\d)/);
    if (m3) {
        const allDigits = m3[0];
        // 尝试不同分割方式
        for (let i = 1; i < allDigits.length; i++) {
            const chapter = parseInt(allDigits.substring(0, i));
            const verse = parseInt(allDigits.substring(i));
            if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters && 
                !isNaN(verse) && verse >= 1 && verse <= 176) {
                return { chapter, verse, consumed: allDigits.length };
            }
        }
    }
    
    // 模式4-pre: 纯数位串（不含「十」「百」）整体作为一个章号，不当作「章+节」连写。
    // 「诗一〇二」「诗一一九」是逐位读法（每位对应一个数字，〇=0），整体即 102 篇 / 119 篇；
    // 这类写法表达的是一个完整数值，而非章与节的拼接。
    // 含「十」「百」的串仍走下面的连写拆分（如「约五十二」→ 5:12）。
    const m40 = remaining.match(/^([一二三四五六七八九零〇]+)(?![一二三四五六七八九十百零〇\d])/);
    if (m40) {
        const chapter = parseNumber(m40[1]);
        if (!isNaN(chapter) && chapter >= 1 && chapter <= book.maxChapters) {
            return { chapter, verse: null, consumed: m40[0].length };
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

// ===== 不可见格式字符 =====
// 从网页 / Word / PDF 粘贴中文时，序号与正文之间常混入零宽空格(U+200B)、不换行空格(U+00A0)、
// BOM(U+FEFF)、书写方向标记等不可见字符。它们大多不属于 \s，会让「一<ZWSP> 我们…」这类纲目序号
// 绕过 looksLikeProseNumber 的空白跳过而被高亮成整章 / 节号；也会把「太<ZWSP>二六6~13」拆断造成漏识别。
// 统一按 1:1 等长替换为普通空格（字符偏移不变，与「○→〇」、全角数字归一同一范式），
// 让所有识别阶段与既有空白守卫看到一致的分隔。
const INVISIBLE_SPACES_RE = /[\u00A0\u00AD\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF]/g;

// ===== 经文并列分隔符 / 非经文量词 =====
// 并列经节之间除标点、顿号外，中文也常用并列连词：「启示录十四章一节和四节」＝启 14:1、14:4，
// 「三章三节、七节」与「三章三节和七节」是同一类写法。连词只在后面确实能解析出经节时才生效：
// 解析失败时各阶段都会回退到分隔符之前，不会把「和合本」「与神爱世人」这类普通文字吞进高亮。
// 不含换行：并列延续不应跨行吞并。
const VERSE_LIST_SEP_RE = /^(?:[，、,;；…· \t\u3000]+|(?:以及|和|与|及|并|或)[ \t\u3000]*)+[ \t\u3000]*/;
// 数字后紧跟这些量词，说明它是页码 / 册数 / 版次 / 数量而非经节号：
// 「新约总论第五册，一九九页」的「一九九」是页码，不能认成启 14:199。
// 「章 / 篇 / 节」是经文自身的量词，「上中下」是半节后缀，均不在此列。
const NON_VERSE_UNITS = new Set((
    '页册卷版期集辑部套本号届年月日岁次个位条件项则首幅张片句段行栏格题例种层成倍元角块处所间件份名周天时分秒' +
    '頁冊輯號屆歲個條項則張欄題種層塊處間週時'
).split(''));

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
    'ERV': '英文恢复本',
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
    { key: 'CUVS', name: '简体新标点和合本（主流）', file: 'bible-cuvs-data.json', url: DATA_RAW_BASE + 'bible-cuvs-data.json' },
    { key: 'ERV', name: '英文恢复本', file: 'bible-erv-data.json', url: DATA_RAW_BASE + 'bible-erv-data.json' }
];

// 恢复本注解 / 串珠数据（与 bible-crv-data.json 配套，按 书卷-章 分组）
const NOTES_FILE = 'bible-crv-notes.json';
// 注解数据约 6MB，raw.githubusercontent 偶发失败，备用 jsDelivr CDN
const NOTES_URLS = [
    DATA_RAW_BASE + NOTES_FILE,
    'https://cdn.jsdelivr.net/gh/ViaCai/obsidian-bible-search-reader@main/data/' + NOTES_FILE
];

// 注解数据按「节 + 上/下」定位：经文被拆成上、下半节时各自有独立的注与串珠
function notesVerseKey(verse, part) {
    return String(verse) + (part || '');
}

// 把一条注解正文写入容器：源数据用空行分段，每段单独成块，避免密密麻麻
// 注解正文：源数据用空行分段，每段单独成块。
// 传入 plugin 时，额外把正文里出现的经文出处识别为可点击引用（单击弹窗 / 双击跳转）；
// ctx 为该注解所属经文的 { bookId, chapter }，供「只写章節、省略书卷」的承上判断使用。
function appendNoteBody(container, text, plugin, ctx, keywords) {
    const paras = String(text || '').split(/\n+/).map(t => t.trim()).filter(t => t.length > 0);
    const canLink = !!(plugin && typeof plugin.linkifyBibleRefs === 'function');
    if (paras.length <= 1) {
        const span = container.createEl('span', { cls: 'bible-note-text' });
        if (canLink) plugin.linkifyBibleRefs(span, paras[0] || '', ctx, keywords);
        else span.setText(paras[0] || '');
        return;
    }
    const body = container.createDiv({ cls: 'bible-note-body' });
    for (const p of paras) {
        const el = body.createEl('div', { cls: 'bible-note-para' });
        if (canLink) plugin.linkifyBibleRefs(el, p, ctx, keywords);
        else el.setText(p);
    }
}

// 上标定位：这些字符不计入「非标点字符序列」
const NOTE_PUNC_RE = /[。，、；：？！“”「」『』（）()《》〈〉…—～·,. ;:?!\s]/;

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
    s = normalizeFullWidthDigits(s);
    if (/^\d+$/.test(s)) return parseInt(s);
    if (isChineseNumber(s)) return chineseToNumber(s);
    return NaN;
}

// 全角数字（０-９，U+FF10–U+FF19）归一为半角（0-9）。与 ○→〇 一样仅按码元替换、长度不变，
// 不影响任何字符偏移计算；归一后下游所有 \d+ 正则与 parseInt 即可直接识别「罗九２１」里的「２１」。
function normalizeFullWidthDigits(s) {
    return String(s == null ? '' : s).replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
}

// 「跨越整章的区间」（如“创三～五十章”“诗一百二十至一百三十四篇”“三～五十章”）的统一解析。
// 判据是范围末端紧跟「章 / 篇」——所以必须写全才算；没有这两个字的“一～二”按旧逻辑处理，
// 而“三～五节”这种结尾是“节”的自然不会命中，仍是同一章里的节范围。
// book 为空时（尚未确定书卷的弱引用）跳过章号合法性检查，由调用方自行判断。
function parseChapterRangeRef(text, pos, book) {
    const rest = text.slice(pos);
    const m = rest.match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)[\s　]*[章篇]?[\s　]*[～~\-－至–—][\s　]*(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)[\s　]*[章篇]/);
    if (!m) return null;
    const c1 = parseNumber(m[1]);
    const c2 = parseNumber(m[2]);
    if (isNaN(c1) || c1 < 1 || isNaN(c2) || c2 <= c1) return null;
    if (book && c2 > book.maxChapters) return null;
    return { chapter: c1, verse: null, verseEnd: null, suffix: null, endChapter: c2, endVerse: null, endPos: pos + m[0].length };
}

// ==================== 更新日志内容 ====================
const CHANGELOG_CONTENT = {
    '5.0.1': `## [5.0.1] - 2026-11-12

### 新增
- **全屏投影改用 \`D\`**：\`O / P\` 让给 Hymns 插件，两个插件不再抢键。
- **与 Hymns 投影互切**：诗歌投影在前台时按 \`Q / W / E\`，直接切回经文投影。

### 修复
- **投影标签页更好用**：在别的标签按 \`Q / W / E\` 只切回投影；在投影标签里再按同键才关闭，按别的键切模式。
- **重启不再出现空白投影标签**：残留的空标签会自动收掉，不会再出现两个「经文投影」。
- **投影不再自动弹输入法**：打开投影不聚焦搜索框，按 \`Enter\` 或 \`/\` 才聚焦。
- **提示文案**：按 \`S\` 打开侧边栏后的提示改为「恢复投影」。`,
    '5.0.0': `## [5.0.0] - 2026-11-11

### 新增
- **整章 / 章范围检索**：搜索框输入 \`太1\`、\`太一\`、\`诗23篇\` 显示整章；\`太1-3\` 支持跨章范围；勾选主题 / 纲目时一并带出对应行。
- **中文书卷拼音短拼**：\`csj1:1\` 等价 \`创1:1\`，66 卷通用（如 \`mtfy\` 马太福音、\`qsl\` 启示录）；撞车短拼不注册，避免误判笔记正文引用。
- **短拼自动补全**：搜索框输入 \`c\` 弹出书卷候选，\`↑↓\` 选择、\`Enter/Tab\` 确定、\`Esc\` 取消，选中后框内仍显示短拼；按圣经书卷次序排列；完整短拼（如 \`mtfy\`）也提示。
- **投影顶部常驻搜索框**：三种投影模式无需先选经文即可打开；顶部搜索框走同一检索引擎，支持短拼等，输入即实时投影（无需按确定键）。

### 修复
- **投影暗色补全可读性**：投影内候选下拉改为自洽配色，暗色模式下清晰可辨。`,
    '4.0.19': `## [4.0.19] - 2026-11-10

### 新增
- **QWE 同键关闭投影**：投影已处在该模式时，再按对应的 Q / W / E 键即可关闭投影；按别的键仍是切换模式。

### 修复
- **退出投影后快捷键恢复**：退出投影后，I / Y 等快捷键能继续控制侧边栏。
- **投影内容可上下键滚动**：投影内容超过一屏时，上下方向键与鼠标滚轮一样能滚动内容。
- **投影中可操控侧边栏**：投影中按 S 打开侧边栏后，方向键 / Y / I / 空格等可操控侧边栏并显示选框；再按 S 可恢复全屏投影。
- **移动端翻页不再带动侧边栏**：从内容区起手的横向翻页手势更早拦截，避免把侧边栏带出一点；投影内容较多时的上下键滚动也一并修好。`,
    '4.0.18': `## [4.0.18] - 2026-11-10

### 新增
- **滑动与手势导航**：手机左滑下一页、右滑上一页，阅读页左滑下一章、右滑上一章；桌面端在内容区按住鼠标左键横向拖动翻页、纵向拖动跟手滚动，触控板双指横滑同样翻页（支持从正文文字起手，需要框选文字请按住 Shift / Alt）。
- **跨书卷连续翻章**：阅读页翻到本卷末章后继续翻动，自动进入下一卷第一章（如创 50 → 出 1），滑动、按钮、键盘、鼠标拖拽共用同一套逻辑。
- **键盘导航与选框**：\`←/→\` 翻页 / 翻章，\`↑/↓\` 移动选框，\`空格\` 选中，\`B\` 切「并」，\`C\` 清空；选框会跟随点击、拖拽、滚动与换页；书卷 / 章目录也支持方向键与空格确认。
- **动作快捷键**：\`X\` 本页全选 / 取消，\`I\` 专注，\`Y\` 搜索 ↔ 阅读切换，\`U\` 开关对照面板；对照面板内方向键选择、\`空格\`/\`回车\` 确认、\`Esc\` 关闭。
- **移动端右滑不再误触侧边栏**：从内容区起手的横向手势只翻页、不再带动侧边栏，边缘起手的手势完整让给系统。

### 修复
- **移动端按钮显示问题**：修复「对照 / 专注」按钮点击后消失、打字或阅读时看不见但仍可点的问题；去掉对照按钮多余的 ✓；统一字体调节与上下章按钮的尺寸和配色，浅色 / 深色主题都清晰可点。
- **搜索页「全局操作」图标**：初始即为展开箭头 \`▼\`，不再先显示闪电。
- **鼠标交互修复**：修复对照面板关闭后快捷键失灵、正文卡片点击无法选中，以及正文文字上无法像触屏那样四向滑动的问题。`,
    '4.0.17': `## [4.0.17] - 2026-11-08

### 修复
- **纲目序号不再被误认成经文出处（修掉从网页 / Word 粘贴带来的不可见字符）**：中文纲目常用「一、二、三、四」或「1、2」作中点序号，若序号与正文之间混入了**零宽空格 \`U+200B\`、不换行空格 \`U+00A0\`、BOM、书写方向标记**等看不见的格式字符（从网页 / Word / PDF 复制中文时极常见），此前会被识别成整章或节号——例如「**二**<ZWSP> 下一代必须…」被高亮成「太 2 章」，「**1**<NBSP> 今天在主的恢复里…」被高亮成本章第 1 节。根因是这些字符大多不属于 JS 的 \`\\s\`，绕过了既有的「裸数字后紧跟正文即视为段落序号」守卫。现在识别入口统一把这些不可见字符按 **1:1 等长替换成普通空格**（与既有的「○→〇」、全角数字归一同一范式，字符偏移不变），所有识别阶段与空白守卫看到一致的分隔；普通空格 / 全角空格下的既有判定不变。中文大写序号（壹贰叁）、两位数序号（12）、括号序号（（一））、\`1、\` / \`1.\` 等变体一并覆盖。串珠文字解析不产生字符坐标，改为直接删掉这类字符（见下条）。
- **不可见字符夹在合法经文引用里导致的漏识别一并修好**：此前 \`一<ZWSP>2\` 只被认成「来 1 章」、\`太<ZWSP>二六6~13\` 只抓到「13」、\`　<ZWSP>三1～6\` 完全识别不到。归一后分别正确识别为 **来 1:2**、**太 26:6-13**、**来 3:1-6**；\`参看<ZWSP>罗三23\` 的引导词也照常排除在链接外。串珠文字串里的同类写法（如 \`1～3节：太<ZWSP>二六6~13\`）此前完全解析不到，现在也能正确列出 **太 26:6-13**。文档里真正的经文出处（\`太二六6~13\`、\`西三 16\`、\`诗一一九11\`、\`腓四8、13\`）全部保持正常识别。
- **「段落序号 + 空格 + 序数词」不再被当成并列经节**：\`民十四29~31：\` 之后写 \`1<NBSP><ZWSP>第二代没有像第一代经历那麽多…\`，此前会被高亮成 **民 14:1、14:2**。根因是空格也属于经节并列分隔符，序号 \`1\` 后面的「第二」被延续项解析当成了「本章第 2 节」，裸中文数字还可能被连写解析成整章；而「整串已是 \`1  第二\`、不再是纯数字」又让既有的正文守卫失效。现在在并列延续的入口加了专用守卫：「第N」不带「节」（第二代 / 第三代 / 第十）在**空白 / 顿号 / 逗号 / 连词**各种分隔符下一律判为正文；「裸数字后紧跟普通汉字」（二人 / 三代）只在分隔符纯为空白时拦，避免误伤 \`16、17说\` 这类合法并列。显式带「节」（第二节 / 16节说）、后接章 / 篇 / 数字 / 标点 / 范围 / 后缀的写法照常解析。同类排查时一并修掉 \`16、第二代…\`、\`16，第二代…\`、\`16和第二代…\` 三种变体。括号内的弱引用路径也补上了既有的正文守卫：\`（1 第二代…）\` 不再识别，\`（1 第二代，16节）\` 只高亮 \`16节\`。顿号、逗号、中文连词连接的合法并列（\`16、17\`、\`一2、一3\`、\`第三章三节、七节\`、\`启十四1和4\`、\`（16、17）\`、\`16、17说\`）全部保持正常。`,
    '4.0.16': `## [4.0.16] - 2026-11-06

### 修复
- **中文并列连词连接的经节现在能完整识别**：\`在启示录十四章一节和四节\` 此前只识别前半句「启示录十四章一节」＝启 14:1，「和四节」被丢掉。现在 \`和 / 与 / 及 / 以及 / 并 / 或\` 与顿号、逗号一样被视为并列分隔符，整句一次高亮为 **启 14:1、14:4**；\`约翰三章十六节与十七节\`、\`创一1和3\`、承上省略书卷的 \`十四章一节和四节\` 等同理。连词后面若不是经节（\`启示录十四章一节和合本\`、\`…与神爱世人\`），解析失败即回退，不会把普通文字吞进链接。强引用、行首 / 行内 /「X章Y节」各阶段统一生效。
- **书籍册数 / 页码 / 版次不再被误认成经文出处**：\`末了活着的得胜者（新约总论第五册，一九九页。）\` 里的「一九九」是页码，此前在已有书卷 / 章上下文时会被括号弱引用路径解析成「启 14:199」，并把前面的书名一起包进高亮。现在数字后紧跟 \`页 / 册 / 卷 / 版 / 期 / 集 / 年 / 人 …\` 等非经文量词（含繁体 \`頁 / 冊 / 輯 …\`）时一律不作经节；\`二〇五页\`、\`一九九年版\`、\`第五册\`、并列连词后的 \`…和199页\` 等同类写法一并修好。\`九节接着说\`、\`16节\`、\`三23注1\`、\`（16）\` 等合法引用不受影响（「章 / 篇 / 节」是经文自身量词，「上中下」是半节后缀，均不在拦截面）。
- **括号里「说明文字 + 经节」不再整括号高亮**：如 \`（见本书说明，16节）\` 此前会把整段说明一起变成可点击链接。现在只高亮真正解析到的经节段 \`16节\`；括号里第一段就是引用的情形（\`（二9，出十五23～25）\`）保持原有整括号高亮，行为不变。`,
    '4.0.15': `## [4.0.15] - 2026-11-06

### 修复
- **补全括号式经节标记**：此前只有 \`（16）\` / \`(16)\` / \`〔16〕\` 会被识别成「本章第 16 节」，而 \`【16】\` / \`「16」\` / \`『16』\` / \`“16”\` / \`‘16’\` 完全不识别、点击无反应。现在这些成对括号 / 引号都支持，且**只高亮其中的节号**（引号本身不跟着变成链接），与原有弱引用行为一致；\`16，17\`、\`16～18\`、\`十六\` 等并列 / 范围写法同样支持。由于中文引号大量用于普通引文，新增括号只放行「纯节号形态」的内容：\`「你们今日若听见祂的声音」\`、\`「三年」\`、\`「16个人」\`、\`【注1】\`、\`【2026年】\`、\`「第16节的事」\` 等都不会被误判；中文数字与阿拉伯数字混排的 \`【三1～6】\`（章+节）仍交给原有弱引用阶段处理，行为不变。
- **引导词不再被包进高亮、重叠链接不再被切碎**：在连续多段、上文已有书卷 / 章的阅读模式下，\`参看罗三23\` 原本会同时产生「参看罗」和「罗三23」两条重叠候选，主阅读渲染按位置裁剪后链接被切碎；\`参看四1～3\` 则是整段「参看四1～3」都被染成链接。现在 \`参 / 见 / 参看 / 参见 / 参阅\` 等引导词统一留作普通文字，只高亮出处本身（\`罗三23\` / \`四1～3\` / \`三23\`），重叠候选取更完整的一条。该收尾处理**只在确实出现引导词的行生效**，其余行识别结果原样不变；注文 / 弹窗里的同类剥离逻辑保持兼容。
- **修复「参看来三1」这类引导词后的书卷名被误拦**：4.0.14 新增的常见词守卫把「看来」当作普通双字词，导致 \`参看来三1\` 的「来」被跳过，出处只剩「参看」两字被高亮。现在只在**完整引导词「参看 / 参见 / 参阅」**之后豁免该守卫，单字「参 / 见」不豁免——\`参加三1\`、\`比赛三1\`、\`读书三1\` 等仍照常被词表拦下，不会被误认成书卷名。`,
    '4.0.14': `## [4.0.14] - 2026-11-06

### 修复
- **修复「使徒　三1～6」被识别成「徒 3:1-6」**：单字书卷简称几乎都是常用汉字（徒 / 约 / 来 / 多 / 门 / 西 / 可 / 路…），此前只要它后面能解析出章节，就会把「普通词的最后一个字」当成书卷名。典型如纲目「二. 超越摩西，是配得更多荣耀与尊贵的**使徒**　三1～6」——「徒」其实是「使徒」的词尾，被误认成使徒行传，把整段吞成徒 3:1-6，真正的出处「三1～6」反而丢失。现新增常见词守卫（按书卷名分组收录「左邻字 + 单字书卷名」构成的高频双字词，如「使徒 / 门徒 / 大约 / 节约 / 将来 / 原来 / 许多 / 参加 / 东西 / 道路 / 开启 / 人民 / 比赛」等），命中即不作书卷名；**多字别名也检查首字**，避免「大约三1」被别名「约三」（约翰三书）绕过守卫；另有全角空格兜底（中文纲目用它分隔标题与经文范围，如「基督徒　三1」），而合法引用「参看约 3:16」用半角空格、左邻多为引导字，不受影响。修复后「三1～6」正确沿上文识别为**来 3:1-6**，「三7～四13」为来 3:7~4:13；「徒三1」「约3:16」「参看罗三23」等合法引用完全不受影响。
- **修复经文正文的段首序号被误识别成经节**：如 \`1、\` \`2、\` \`11、\` \`19、\` 等阿拉伯数字列表编号，此前在已有书卷 / 章上下文时会被当成「本章第 N 节」高亮（甚至把 \`11\` 逐位读成 1:1、\`19\` 读成 1:9）。现「纯数字 + 顿号 \`、\`」与「纯数字 + 无配对开括号的右括号（如 \`1)\`）」一律判为段落编号；\`1.神爱世人\` 这类英文句点编号同样继续拦；而 \`（16）\` / \`【16】\` / \`〔16〕\` 这类**有配对开括号**的明确经节标记、以及 \`一2、一3\` 这类并列经节延续，都照常识别。
- **修复「第二个警告」「第一，」「第三，」等序数词被误识别成经节**：\`parseBareVerse\` 里的「第」前缀原本只要后接数字就当经节，导致纲目标题「（**第二**个警告─不要赶不上那应许的安息　三7～四13）」里的「第二」被高亮成当前章第 2 节。现要求「第N」必须带「节」字才算经节；\`第二节\` / \`第16节\` 与 \`第三章\` / \`三章第三节\` 等合法写法均不受影响。`,
    '4.0.13': `## [4.0.13] - 2026-11-04

### 新增
- **圣经数据文件支持放在 vault 任意位置（不再限于插件目录）**：很多用户因网络原因无法从 GitHub 下载圣经数据 / 注解数据。现在只需把 \`bible-{缩写}-data.json\`（如 \`bible-crv-data.json\`、\`bible-cuvs-data.json\`）与 \`bible-crv-notes.json\` 放到 vault 内任意目录，插件开机即自动识别并记录其相对路径，无需放在插件目录下。读取、下载、删除、更新均按记录的路径定位，旧数据（无路径记录）仍回退到插件目录，完全兼容。
- **设置 → 圣经版本管理 / 注解板块展示数据文件相对路径**：每个已安装版本与注解数据现在会显示其相对路径（📂 形式），方便确认文件实际位置。
- **多份同名数据自动集中、全局只留插件目录一份（静默、无弹窗）**：若 vault 多处存在同名数据文件（如旧版在根目录、新版在子文件夹），开机扫描会全部收集，按**修改时间（mtime）取最新的一份自动复制到插件目录**作为唯一生效位置（采用复制而非移动，原文件保留，避免破坏性移动与同步软件回弹）；复制完成后**自动把其它位置的旧副本静默删除**，确保全局只有插件目录下这一份生效数据，不会因多副本并存而用错版本。插件目录里的生效副本绝对不会被删（删除方法内部已加保护）。若个别副本因权限等原因删除失败，其路径会保留在「设置 → 圣经版本管理」的「🧹 清理重复」入口供手动重试。iOS / Android / Windows / macOS 行为一致。
- **每次启动都检索全库并集中 / 清理（不止于「复制完成」那一刻）**：插件 \`onload\` 即全库扫描，把 vault 任意位置的数据与插件目录里的做对比——新数据复制到插件目录、旧数据 / 重复数据静默删除，全程无弹窗提醒。为避免极少数「启动时 vault 文件索引尚未完全建立」导致漏扫，在 \`onLayoutReady\`（布局就绪）后再补扫一次；若本轮把更新的数据集中进了插件目录，会自动重载经文数据，保证内存里的经文 / 注解同步到最新。已集中后再次扫描为幂等（不再复制 / 删除，仅刷新设置）。

### 修复
- **修复「数据文件移到子文件夹后反而识别不到」**：上一版用 \`adapter.list('')\` 枚举整个 vault，但该方法在移动端（iOS/Android）及部分桌面端 Obsidian 上不会递归展开子目录，导致文件一旦放进如 \`测试/\` 这类子文件夹就扫不到。现改为跨平台双源扫描：\`vault.getFiles()\`（Obsidian 按各平台正确维护的完整文件索引，能覆盖任意内容子目录，含中文名文件夹）+ 单独扫描插件目录（\`.obsidian\` 不在 getFiles 索引内，需补扫以保留默认下载位置）。iOS / Android / Windows / macOS 均可识别 vault 任意位置的数据文件。`,
    '4.0.12': `## [4.0.12] - 2026-11-03

### 修复
- **单字书卷名不再因「正文里的动词/常用字」被误识别为经文出处**：罗马书九章二十一节里的「拿一块作成…」此前会被认成「拿9:1」（约拿书），因为「拿」既是约拿书的单字别名、又会在弱引用里触发「切换书卷 + 继承章号 + 裸节号」。现已在弱引用路径下，当因段首单字书卷名切换到多章书卷时，停用「继承章号 + 裸节号」和「整章」两类识别，正文里的「拿一块」「约一」「诗一」等不再被当成引用；带显式章号的合法写法（腓二5、罗九21、拿一1＝约拿书1:1）完全不受影响。另在强引用路径下，对纯动词「拿」加入单字黑名单，避免「拿一」被当成约拿书整章；「诗二十三」「太一」这类合法中文引用写法不受影响，如需为其它单字书卷关闭此识别，往 \`BOOK_NAME_DENYLIST\` 加一字即可。其余单字书卷（创/但/民/书/罗/诗…）经扫描确认均为合法引用用法，未一并禁用

---`,
    '4.0.11': `## [4.0.11] - 2026-10-31

### 修复
- **投影里串珠内容的「串珠出处」可以点击了**：经文投影中展开某节的串珠后，每条被引经文前面的出处（如「罗3:24」）之前只渲染了文字、没有绑定点击事件，点了毫无反应。现已可单击在弹窗中查看该节、双击跳转到圣经阅读页（与阅读页 / 经文弹窗里的串珠出处同一套交互）
- **投影支持「返回上一层内容」**：投影时不小心从「注角的经文出处」或「经文弹窗」里再次投影，会直接覆盖掉当前的投影内容、无法退回。现已加入投影内容历史栈——每次从浮层再次投影都会先把当前内容存起来，底部新增「↶ 返回」按钮（快捷键 Z）可逐级退回上一层投影，没有历史时按钮自动隐藏
- **全角数字（０-９）也能识别为经文引用了**：此前「罗九２１」里的「２１」因为是全角数字而识别不到，结果整句引用落空。现已在引用解析的多个入口统一把全角数字归一为半角（与 ○→〇 同样的单码元替换、不改变任何字符偏移），「罗九２１」现在能正确识别为罗马书九章二十一节，其它如「创一～二０章」等全角数字写法同样生效
- **投影里点串珠被引经文的标注（上标）不再关掉整个串珠**：投影中展开某节串珠后，点其被引经文里的小标注（¹²³⁴ᵃᵇ）本应展开对应的注解 / 串珠，结果却把整层串珠面板关掉、内容也看不到。现已改为子面板只管自己、不再牵连外层主串珠面板，点击正确在下方展开对应内容
- **串珠里的上标标注现在真正可点击了**：展开串珠列出的被引经文，其内嵌的 ¹ ᵃ 上标此前在阅读页 / 检索结果 / 经文弹窗 / 投影四处都缺少可交互样式（点了没有视觉反馈、也点不中）。现已补全 \`.bible-note-ref-text\` 与 \`.bible-proj-note-ref-text\` 下的标注样式（含 hover、浅色模式变体），四处一致——点击即在该节下方展开对应的注解或串珠
- **嵌套串珠（串珠里的串珠）也显示标注，可继续向下钻取**：点开一处串珠、再在被引经文里点它的串珠 / 注解标注时，第二层显示的经文此前被渲染成纯文本、丢失了 ¹ ᵃ 上标，导致没法继续往里点。现已在各层级（阅读页 / 检索 / 经文弹窗 / 投影）都保留标注，可一层层向下钻取对应的注解或串珠；每个被引经文行只保留一个子面板，不会无限叠加

---`,
    '4.0.10': `## [4.0.10] - 2026-10-30

### 新增
- **经文弹窗可以按住顶部拖动**：弹窗浮在经文旁边时常常挡住要看的正文，现在按住标题栏（经文出处那一行，含其上的「‹ 返回」按钮、「保留候选」复选框与「清空」按钮）就能把它拖到任意位置，光标会变成抓手。拖到屏幕边缘会停住，不会跑出可视区域；拖动松手不会误触发「点击空白处返回上一层」，标题栏上的按钮、复选框照常可用（纯点击不移动时仍正常触发各自行为）
- **触屏也能拖动弹窗**：之前只有鼠标能拖，改用 Pointer Events 后鼠标 / 触摸 / 触控笔统一支持；标题栏加了 \`touch-action: none\`，触屏拖动不再被当成页面滚动

### 修复
- **标题栏贴边位置也能拖动**：之前按在顶部栏两端的「‹ 返回」按钮或右侧「保留候选 / 清空」按钮上无法拖动（命中了按钮元素被排除），现在整条标题栏都作为拖动手柄，这些边缘区域也能正常拖动窗口
- **整条顶部区域都能拖动**：顶部栏其实有两行（标题行「约3:16 + 保留候选」与工具条「A- / A+ / 全选 / 复制 / 投影 / 注解」），之前只有标题行能拖、按在工具条那一行拖不动。现在两行都作为拖动手柄，顶部栏有多高、可拖动范围就有多高（鼠标与触屏一致）
- **外壳顶边那圈留白也能拖动**：之前按住外壳上边框与标题文字之间的内边距区域拖不动（那段属于外壳自身、不在标题栏元素内）。改用以几何区域判定拖动手柄——从外壳顶边一直到工具条底边整条顶部带（含这段留白）都是拖动区；同时把这段留白并入标题栏自身的内边距，触屏从最顶边起就能按住拖动

---`,
    '4.0.8': `## [4.0.8] - 2026-10-28

### 修复
- **注文中的经文出处识别更准确**：注文常省略书卷甚至章号，现在按「注文所属书卷 / 章」回溯，并且只有**同一句之内**出现过的引用才会被沿用。因此「加1:4注3」里的「六14～15」正确识别为加六14～15、「(三23)」为加三23（此前被前面隔了几句的「弗二2」带偏成弗三23），「创1:26注2」里的「11～12，21，24～25」为创一11～12、21、24～25，而同句内「罗六5，十一17～24」仍正确解析为罗十一17～24；「路9:2注1」的「见四43」也补上了
- **注文里「中文章 + 阿拉伯节」的连写不再漏识别**：如「这由六14～15得着证实」「见四43注2」这类前面是普通文字的写法，此前因弱引用要求左侧必须是空白或标点而抓不到。该规则只在注文上下文启用，笔记正文保持原有的严格判断
- **检索页「本页复制」包含注解 / 串珠**：本页复制原先只按本页结果里的经文条目过滤，经文上标展开后勾选的注 / 串会被过滤掉，只能走「全局复制」。现在注 / 串会记住所属经文，宿主经文在本页即算本页内容
- **首次安装下载数据后不再显示「未找到经文」**：经节索引此前只在渲染 Markdown 引用时顺手构建，首次安装下载完数据若没打开过带引用的笔记，索引一直是空的，经文弹窗便查不到经文。现改为数据重载时立刻重建，并在弹窗打开时兜底补建；已启用但尚未指定主版本时也不再返回空
- **只写章号的引用要求右侧能断句，普通语词不再被当成经文**：此前「旧约和新约二约组成」里的「约二」会被识别成约翰福音二章、「大约三万人」里的「约三」同理。现在「章节 + 数字」只有在数字后面是标点、空白、范围符、和缓的引导词（如「所说」）等断句位置时才算引用；真正的整章写法（「创世记一章」「约翰福音二章」「如诗一〇二所说」）不受影响
- **「创一～二」「启二一～二二」这类跨整章的范围列出全部章**：此前会把右侧的章号误当作同一章里的结束节，于是「创一～二」只显示创世记一章的前两节。现在识别为「第一章到第二章整章」，弹窗按真实节数列出区间内每一章
- **单独成行的段落序号不再被当成经节**：注文或笔记里独占一行的「一、」「十三、」「十四、」此前会被解析成当前书卷的对应节号，现在这类独占一行的序号直接跳过（序号后带标题的「一、基督的人性」原本就已经跳过）
- **「三～五十章」这类跨整章的弱范围不再被读成「某章 3 至 50 节」**：承上省略书卷时，范围末尾写了「章 / 篇」说明两侧都是章号。此前「创1:1注1」里的「三～五十章陈明八大人物的传记」被识别成创一3～50 节，现在正确识别为创三章至创五十章；带书卷名的「创三～五十章」「诗一百二十至一百三十四篇」同样修正（此前后者会被连写拆成「诗102:10-134」）。没有「章 / 篇」的写法（「创一～二」）与写作调整为末尾带「节」的同一章范围（「三～五节」）保持原有判断
- **一处括弧里的并列引用不再被前一个书卷吞掉**：「创1:11注1」的「(二9，出十五23～25，歌二3，五15，赛十一1，约十五1，启二二2)」此前整串都被并到创世记名下，出埃及记十五章成了「创十五23～25」、雅歌成了「创二3」；「创1:14注2」的「(16，诗一三六7～9)」里诗篇也被吃成创世记 136 篇。现在碰到已经带自己书卷名的段落就地断开，各归各卷
- **超大范围的经文弹窗不再卡住界面**：像「创三～五十章」这样 48 整章上千节的引用，弹窗现在只铺开前 400 节并给出「另有 N 节未列出」的提示，需要通读时可双击标题栏的经文出处直接跳到圣经阅读视图

---`,
    '4.0.7': `## [4.0.7] - 2026-10-27

### 新增
- **串珠里的经文也带注解 / 串珠标注**：展开串珠后列出的被引经文，现在与阅读页经文一样内嵌 ¹ ᵃ 上标，点击即在该节下方展开对应的注解或串珠。阅读页 / 检索结果 / 经文弹窗 / 投影四处一致；为避免无限套娃，串珠经文里再展开的面板不再继续嵌上标
- **注解正文里的经文出处可点击**：注文中提到的经文出处（如「参罗三24」「见太一1；路二2」）现在被识别为可点击引用，单击弹出经文、双击跳转到圣经阅读页。识别沿用该注解所属经文的书卷与章作「承上」上下文，与阅读模式下笔记正文的识别规则一致

### 改进
- **出处识别不再被切碎**：多个识别阶段可能对同一处经文给出重叠候选（如把引导词「参」一起吃进来），现在重叠时保留更完整的那条；「参 / 见 / 参看」等引导词不再被包进链接里
- **经文弹窗支持层层返回**：在弹窗里点注解、再点注文 / 串珠中的经文出处时，不再关掉当前弹窗另开一个（旧做法会让新弹窗丢失锚点、跑到屏幕左上角），而是就地新增一层显示。每层标题栏左侧有「‹ 返回」，点击弹窗内的空白处也可退回上一层；点击经文行、按钮、上标等可交互区域不会误触发返回。串珠出处改为单击在弹窗内查看、双击跳转圣经阅读页
- **再点同一处经文出处即关闭弹窗**：单击某处出处打开弹窗后，再次单击同一处出处会直接关闭弹窗（不必再去点弹窗以外的区域）。弹窗内压出的层级同样适用：再点该出处即关闭整个弹窗；另一处出处则照旧压新层。双击跳转不受影响（第二下 click 不再被当作开关处理）

### 修复
- **点击弹窗以外能正常关闭**：关闭监听原先注册在冒泡阶段，而阅读页 / 检索页 / 投影里的注解与串珠面板为避免事件穿透会 \`stopPropagation\`，导致点在注解面板上时弹窗关不掉（投影里尤其明显）。现改为捕获阶段监听：无论点在注解面板、投影面板还是其它位置都能关闭；弹窗内部、经文引用、串珠出处、弹窗菜单仍视为「内部」不关闭

---`,
    '4.0.6': `## [4.0.6] - 2026-10-27

### 修复
- **注解快捷键不再吞字母、不再干扰打字**：此前「切换恢复本注解 / 串珠」被注册为 Obsidian 的裸字母 A 命令快捷键，Obsidian 命中后会 preventDefault，导致字母 a 在笔记里打不出来、还不断触发开关。现改为插件自有监听 + 上下文门禁处理：在输入框 / 笔记正文 / 输入法合成态时一律放行（a 正常输入），仅在阅读笔记、检索 / 阅读页、经文弹窗等非输入场景下按 A 才开关；并清理旧版写入 \`hotkeys.json\` 的裸 A 及自动迁移的组合键，根因彻底清除（重启 Obsidian 后生效）

### 改进
- **阅读模式下非经文不再误识别为经文**：修复笔记中括号 / 引号包裹的裸中文数字（如「（一）」「“三一”」）及纲目序号（如「一、」）被误判为圣经引用的情形

---`,
    '4.0.5': `## [4.0.5] - 2026-10-26

### 新增
- **对照页也能检查数据更新**：对照设置弹窗标题栏（关闭按钮左侧）新增符号按钮「⟳」，点击检查并更新圣经数据与恢复本注解 / 串珠，与设置页「检查数据 / 注解更新」行为一致，会先提示再下载

### 改进
- **「检查数据 / 注解更新」一处搞定**：设置页「圣经版本管理」里的检查按钮现同时检查已装圣经数据与恢复本注解 / 串珠（注解本就在更新清单内；旧安装因缺版本记录未被提示，现已修正）
- **更新失败不再「消失」**：下载因网络失败时会明确提示哪些文件成功、哪些失败，并把未完成的文件记录到本地；重启后若上次没更新完会自动再次提醒（绕过 12 小时节流）可重试；点「稍后」进入 24 小时冷却，避免反复打扰
- **更新结果清晰可见**：更新完成弹「已更新 N 个文件」、有失败时弹「X 成功 / Y 失败，可重试」，不再静默结束，一眼知道是否成功

### 修复
- **对照页更新静默下载**：此前对照页更新按钮点了直接下载、不弹提示，与设置页不一致。现统一走「先检查 → 弹通知 / 弹窗」流程
- **注解每次启动误报待更新**：安装注解后未记录其数据版本，导致每次启动按「无版本记录 + 大小兜底」把注解误判为待更新、反复弹提示。现安装时一并记录版本

---`,
    '4.0.4': `## [4.0.4] - 2026-10-26

### 新增
- **注解 / 串珠开关快捷键**：新增命令「切换恢复本注解 / 串珠（开 / 关）」，默认快捷键 **A**（无修饰键）。首次启动会自动写入，重启 Obsidian 后生效；可在 设置 → 快捷键 中自行修改，改过或删掉之后插件不再干预
- **阅读页「本页操作」右侧的上一章 / 下一章**：标题右边新增两个极小的符号按钮，点击直接切章并回到章首；首章 / 末章自动置灰，悬停提示会写明目标章号
- **书卷下拉的选中标记**：经文阅读的书卷下拉里，当前书卷现在有明确的高亮标记，并与章数下拉的选中态一致

### 改进
- **经文数据重排（需更新数据）**：按恢复本原始排版把纲目重新插回它所对应的经节之前（此前一章的纲目都堆在经文之前），共修正 73 章、400 条纲目；顺带修掉哈巴谷书 1 章、约翰福音 12 章两处经文乱序。经文正文一字未动，共 34,332 条完全不变。启动时会提示更新经文数据
- **切换注解立即生效**：此前用快捷键切换后，阅读页要翻章、投影与经文弹窗要重开才能看到变化。现在切换注解会同时重渲染阅读页 / 检索结果、投影当前页（保留页码）与已打开的经文弹窗
- **下拉面板自动定位**：打开书卷 / 章数下拉时自动把当前选中项滚到面板中部，66 卷书与长卷上百章不用再手动找
- **英文恢复本显示名统一**：下载清单中的版本名统一为「英文恢复本（ERV）」

### 修复
- **亮色模式下选中项看不清**：阅读页的书卷 / 章数下拉里，当前书卷与当前章的文字几乎不可见。原因是这两个面板挂在页面根节点上，取不到插件容器内定义的主色变量，导致主色背景整条失效、只剩白色文字，亮色主题下就成了白底白字。现修正变量作用域，并把选中态改为「主色填充 + 深色文字」，亮色 / 暗色都清晰
- **「诗一〇二」被读成诗10:2**：纯数位连写的中文数字（如「一〇二」）现在整体当作一个章号，正确识别为诗篇 102 篇；「诗一〇二27」等带节号的写法不受影响
- **「九节」「五章二十至二十一节」等承上省略写法**：段落内「九节」这类只写节号的写法现在继承上文的书卷与章；「X章Y至Z节」这类范围写法一并支持（如林后三章七至八节 → 林后 3:7-8）
- **纲目里「—4节」「—4～6节」未被识别**：如「壹 …弗一3：／贰 父神的分赐—4～6节：／一 探远信徒—4节：」，现在正确继承为弗 1:4-6 与弗 1:4。同时修掉一个上下文缺陷：同一趟扫描里先解析出的章号会被后面的候选丢掉，导致「四4～6」之后的「—4节」退回上一章
- **经文弹窗中的串珠无法点击**：弹窗里串珠的出处原本点了没反应（渲染时取错了方法所属的对象），现可点击直接跳转到该节；阅读页里同类跳转一并修好
- **查看历史更新里 4.0.x 显示为空**：更新说明里的三级小标题（如「### 修复」）被误当成版本分隔符，导致该版本正文整段被丢弃，只剩标题行。现只按二级标题切分版本；同时把 4.0.0～4.0.3、3.1.8 补进内置更新说明，离线时也能看到

---`,
    '4.0.3': `## [4.0.3] - 2026-10-23

### 修复
- **本地已有注解仍提示下载**：本机 \`bible-crv-notes.json\` 已存在时，每次重启仍会在右上角横幅列出「恢复本注解 / 串珠数据」待下载。原因是横幅判定注解缺失时只看内存中的注解数据（刚启动时尚未异步加载完成），磁盘上已有文件却被误判为缺失。现改为判定前先按磁盘真实状态加载注解数据，只有本机确实没有该文件时才提示
- **英文恢复本显示名统一**：版本列表与下载横幅中原显示为「ERV（ERV）」（旧数据里版本名称被存成 key 本身）。现统一显示为「英文恢复本（ERV）」，并在启动时自动把旧的名称纠正过来，无需手动改动设置

---`,
    '4.0.2': `## [4.0.2] - 2026-10-23

### 新增
- **英文恢复本（Recovery Version）数据**：新增 \`data/bible-erv-data.json\`（66 卷 1189 章 31,102 节），与恢复本（CRV）共用同一套书卷编号，可在设置里下载，阅读 / 检索中对照显示；开机若缺版本数据会提示下载

### 改进
- **下载提示合并为单条非阻塞横幅**：版本数据缺失提示与注解数据缺失提示合并为同一条固定右上角的非阻塞横幅，后台下载不中断其它操作；「不再提醒」按版本分别抑制（只压当前版本，新增 / 更新版本仍会提醒），注解另有独立开关、安装成功后自动复位
- **注解模式跟随主版本**：主版本切到恢复本（CRV）时自动开启注解 / 串珠，切到其它版本时自动关闭，无需手动开关
- **对照弹窗实时刷新注解开关**：在对照弹窗里切换主版本后，弹窗内的「恢复本注解 / 串珠」勾选状态即时同步，不再需要重开弹窗才更新

---`,
    '4.0.1': `## [4.0.1] - 2026-10-23

### 修复
- **恢复本圆圈零识别**：恢复本引用里的零写作白色圆圈 \`○\`（U+25CB，如「诗一○二27」）原被误识别；现将其归一为汉字〇（U+3007），正确识别为诗102:27（含同类中文数字连写章 + 阿拉伯节）
- **串珠显示不全**：可6:1a 等串珠只列出部分被引经文（如缺「太十三54～58」）。改为以串珠文字为权威补全缺失引用，数据 \`targets\` 不全时从文字解析，全库约 273 条同类缺失一并修复（阅读页 / 检索页 / 经文弹窗 / 投影四处串珠渲染统一）
- **选中注解 / 串珠后「复制」失效**：搜索 / 阅读页的复制按钮只认勾选框选中，不捕获手动高亮的注解或串珠文字。现所有复制按钮在 \`mousedown\` 时捕获选区，优先复制高亮文字；无高亮时回退原勾选逻辑

### 改进
- **阅读页「本页操作」语义变更**：「经文」「纲目」按钮改为只选中本页全部经文 / 纲目（互斥取消本页其它类型），便于按类型批量投影或复制，不再做复制
- **投影中注解 / 串珠面板可选字**：去掉「面板内点任意位置即收起」，改为选区感知（正在拖选文字时不收起，普通轻点才收起），「✕ 收起」按钮独立关闭；面板正文显式允许选中，选中后 Ctrl+C 复制
- **投影正文可选中**：投影里的经文 / 注解 / 串珠文字可在投影模式下用鼠标选中（上标 ¹ ᵃ 仍保持不可选）

---`,
    '4.0.0': `## [4.0.0] - 2026-10-22

### 新增
- **按注 / 串出处直接检索**：可直接输入「1:26注2」「创1:26串1」之类的注 / 串出处进行检索，命中即返回对应注解或串珠条目（显示出处与正文）
- **投影模式即时切换**：投影已打开时按 Q / W / E 可在逐节 / 并列 / 混合三种模式间即时切换并重绘，无需翻页

### 改进
- **检索页布局重排**：检索范围默认收起；检索种类移到检索范围下方、本页操作移到结果简要上方，窄窗口不再遮挡
- **检索范围按钮尺寸统一**：旧约 / 新约 / 全选 / 取消按钮改为与书卷按钮同尺寸对齐
- **阅读页书卷 / 章候选框**：点击同一胶囊可开可关，箭头指示器联动
- **投影中注 / 串分段渲染**：选中的注解 / 串珠在投影里按段落渲染，段间留空行，注（蓝）/ 串（琥珀）视觉区分
- **弹窗注解 / 串珠面板单例化**：经文弹窗中始终只保留一个注解 / 串珠面板，新点开的会顶替旧的，不再堆叠

### 修复
- **投影 QWE 切换后内容不更新**：根因为 \`buildSlides\` 未先清空旧 slides，现切换模式立即按新模式重渲
- **经文弹窗「取消 / 清空」对注 / 串无效或残留序号**：取消现在一并清掉弹窗内选中的注 / 串；清空后同步刷新注 / 串候选框，序号不再残留
- **点注解 / 串珠内容即可选中**：检索页、阅读页、经文弹窗中，点击注解或串珠的正文即可选中 / 取消（此前只能点候选框）
- **弹窗注 / 串序号实时更新**：取消靠前的经文或注 / 串后，后续注 / 串序号立即重排
- **收起注解面板同步取消选中**：在弹窗中点标记(¹)收起注解面板时，同步取消该条注 / 串的选中，不再残留「保留候选」
- **全选后取消计数残留**：选注 / 串 → 全选 → 取消后，弹窗「保留候选」计数正确归零

---`,
    '3.2.1': `## [3.2.1] - 2026-10-21

### 改进
- **注解检索出「注解条目」**：勾选「注解」检索时，每条命中的注解各自成为一条结果，显示出处与注解正文（如「创6:3注2　这是本书第二次提到……」），不再拿整节经文充当结果；命中关键词在注解正文里高亮
- **注解正文分段**：注解原文的多段内容按空行分开，段与段之间留出间距，长注解不再挤成一坨
- **读完即点，不必再找按钮**：检索结果里既然已经有 ¹ ᵃ 上标，就去掉了卡片末尾的「注N · 串M」按钮

### 修复
- **经文与纲目的顺序**：按恢复本原始排版重排经文与纲目的前后关系。分上/下半节的经文各自归位——「创1:2上」现在紧跟纲目「2审判与败坏」，「创1:2下」在「a第一日」之后，不再统一堆到该段纲目之后

---`,
    '3.2.0': `## [3.2.0] - 2026-10-21

### 新增
- **恢复本经文数据重制**：按恢复本原始排版重新生成全部 31103 节经文，补齐旧数据大量缺失的句末标点；并保留 72 处上 / 下半节的区分，出处显示为「创1:2上」「创1:2下」，两半可分别选中、复制、投影
- **检索结果与经文弹窗内嵌上标**：检索结果和经文弹窗里的经文，现在与阅读页一样带 ¹ ᵃ 上标，点击即展开对应注解或串珠
- **检索页字体调节**：「全局操作」标题右侧新增字体按钮（与阅读页一致），检索结果字号可独立调节
- **对照设置里可直接开注解**：点顶部「对照」按钮打开的弹窗中新增「恢复本注解 / 串珠」开关、检索范围开关与数据下载按钮；经文弹窗工具条也有「注解」开关

### 修复
- **检索种类勾选「注解」无效**：只勾「注解」时现在自动按注解正文检索；与「经文」同时勾选则经文 + 注解一起匹配
- **下载注解数据失败**：改为先取 GitHub raw、失败自动回退 jsDelivr CDN，并校验返回内容，失败时给出具体原因
- **注解文字过小**：注解面板字号与经文一致（不再缩小到 0.86 倍），串珠出处、引用串同步放大
- 修正玛拉基书 3 章缺失的 4、9、11、14、15、18 六节；删除约翰三书 1:15 与 14 下重复的条目

---`,
    '3.1.9': `## [3.1.9] - 2026-10-21

### 新增
- **恢复本注解与串珠**：新增配套数据 \`bible-crv-notes.json\`（15791 条注解、26215 条串珠，覆盖全 66 卷 1189 章）。首次用到时按需加载，设置页可一键下载安装
- **阅读页经文内嵌上标**：经文中的注脚与串珠现以 ¹ ᵃ 上标直接嵌在字里行间，点击上标即在该节下方展开对应注文或串珠经文，再点一次收起。上标位置按「锚点词」定位，不受恢复本不同印次标点差异影响
- **检索结果标注注 / 串**：检索页每条经文结果下方显示「注N · 串M」，点击展开该节全部注解与串珠
- **检索可搜注解正文**：检索种类新增「注解」勾选项，勾选后关键词也会匹配注解内容，查主题词（如「神圣经纶」）能直接命中注解
- **经文弹窗显示注解串珠**：弹窗中每节下方同样提供「注N · 串M」展开入口

### 改进
- **串珠可直接跳转**：展开的串珠列出被引经文的出处与经文内容，点击出处即跳转到圣经阅读页对应位置

---`,
    '3.1.8': `## [3.1.8] - 2026-10-20

### 新增
- **经文引用识别新增破折号引导**：普通连字符 \`-\`（如 \`-五11～12\`）与连续破折号 \`——\`（如 \`——五11～12\`）现在能正确触发弱引用，沿用前文的书卷上下文，不再漏识别或丢失节范围
- **检索范围新增「旧约 / 新约」整组选择按钮**：位于「全选 / 取消」左侧，点击即只选中该约全部书卷（排他式，替换当前选择）并高亮提示；「全选」按钮在全部书卷选中时同样高亮

### 改进
- **简化检索范围设置**：移除与「全选」重复的「全部圣经 / 选择范围」单选，直接常显书卷选择区，打开检索页时默认即为全选状态

---`,
    '3.1.7': `## [3.1.7] - 2026-10-20

### 新增
- **投影标签页模式**：投影中按 \`S\` 打开检索时，投影不再与界面挤成分屏，而是搬进当前标签组成为一个普通标签页，检索完按 \`S\` 再回到全屏显示。标签页内仍可使用全部投影快捷键；关闭标签页即结束投影
- **桌面全屏**：新增 \`O\` 键与底部 \`⛶\` 按钮，把投影扩展到整个显示器显示。处于桌面全屏时按 \`ESC\` 只退出全屏、不关闭投影，再按一次 \`ESC\` 才关闭投影
- **投影窗口可拖动**：投影顶栏成为窗口拖动区，桌面端可直接拖动投影窗口调整位置

### 修复
- **投影中按 Q / W / E 不更新内容**：修复投影进行中先按 \`S\` 打开检索、改选经文后再按 \`Q\` / \`W\` / \`E\`，只切换排版却不刷新经文内容的问题。原因是投影层的键盘监听注册在 document 捕获阶段并直接拦截了 Q / W / E，导致插件的全局快捷键分派收不到事件。现在 Q / W / E 统一由全局监听分派：在任何界面按下都等价于点击当前页面的「投影」按钮——已有投影时原地刷新内容并提示「已更新投影内容」，没有投影时按当前界面语义开投影（检索页带出处、阅读页不带出处、经文弹窗投弹窗内容）
- **快捷键被编辑器吞掉 / 焦点丢失**：新增焦点守护，投影全屏时焦点若被笔记正文或其它面板抢走会自动夺回，配合输入法合成态识别，中文输入法打字不会误触发快捷键、也不会有字符漏进笔记
- **侧边栏是其它插件时快捷键误触发**：\`Q\` / \`W\` / \`E\` 只在圣经检索 / 阅读界面可见时才响应，当前标签页是别的插件时不会误开投影

### 改进
- **投影「检索」按钮图标统一**：打开检索后不再切换成全屏图标（与新增的 \`⛶\` 桌面全屏图标太相似、容易混淆），统一保持放大镜图标，改用蓝色高亮表示检索已打开

---`,
    '3.1.6': `## [3.1.6] - 2026-10-19

### 新增
- **投影模式快捷键**：投影进行中新增 \`Q\` / \`W\` / \`E\` 一键切换三种排版——\`Q\` 逐节投影、\`W\` 并列投影、\`E\` 混合投影（复用当前选中内容，不影响浏览位置）；\`S\` 打开 / 关闭检索分屏（再按一次恢复全屏）、\`C\` 切换居中、\`R\` 重置字体。投影顶栏已同步显示快捷键提示
- **未投影也能一键投影**：在圣经检索 / 阅读页选中经文后，按 \`Q\` / \`W\` / \`E\` 即可直接以对应模式开投影；在经文弹窗中勾选经文后按 \`Q\` / \`W\` / \`E\` 也能直接投影并自动关闭弹窗

### 修复
- **放大字体后经文换行**：修复投影内容区宽度被固定上限（1500px）卡死，宽屏下两侧留白且放大字体即换行成两行的问题。现投影区域宽度跟随窗口（窗口宽度的 94%），放大窗口或放大字体时区域同步变宽
- **检索范围书卷按钮溢出**：修复「检索范围 → 选择范围」中各卷书按钮在窄窗口下超出界面的问题，网格改为自适应列数（窄屏少列、宽屏多列），不再溢出
- **投影 \`S\` 退出检索不恢复全屏**：修复先按 \`S\` 进入检索分屏、再按 \`S\` 退出后投影区不扩大回全屏的问题（退出检索时复位区域宽度）

### 改进
- **逐节投影支持居中**：逐节投影现在与其他模式一样支持居中切换，底部操作栏在所有模式下都显示「居中」按钮（位置在「重置」之后、「主题」之前）

---`,
    '3.1.5': `## [3.1.5] - 2026-10-19

### 修复
- **单章书卷的裸节号不识别**：修复“犹19~21”“俄3”这类写法不识别或识别成错误经文的问题。犹大书、俄巴底亚书、约翰二书、约翰三书、腓利门书等单章书卷，名字后面直接跟节号时一律按第 1 章该节解析（顺带修正“约叁13”被错拆成 1:3 的老问题）
- **「约三19~20」被误认为约翰三书**：修复以普通数字结尾的书卷别名（约二 / 约三）与「约翰福音 + 章号」之间的歧义。这类别名后面紧跟节号时，按“约翰福音三章十九节”解析；约翰二书 / 约翰三书仍可用「约贰」「约叁」书写，独立出现的“约三”也仍是约翰三书
- **诗篇长篇节号被截断**：修复“诗一一九105、130”被误认成诗 11:9 的问题。连写解析的节号上限由 100 放宽到 176，长篇诗篇（如 119 篇）的大节号可正常识别
- **破折号后省略书卷名的引用不识别**：修复“难处—二14~15，三12~17”“殉道者—五14~15”“范围里—十四31~35”这类写法完全不识别的问题。破折号（– — ‐）现在与空白、左括号一样可作为引用的起始边界，书卷沿用上文最后出现的书卷
- **弱引用的书卷归属错误**：修复行首 / 行内弱引用自己写了书卷名（如“赛四二4”）时，高亮归属被错挂到上文书卷的问题

### 改进
- **识别解析更稳健**：本轮共 41 项解析测试全部通过，其中包含 5 组反馈用例的原文复现（跨段落上下文、单章书卷、别名歧义、长篇节号、破折号边界），回归用例无破坏

---`,
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

---`,
    '3.1.3': `## [3.1.3] - 2026-10-15

### 修复
- **侧边栏窄宽布局优化**：修复 Obsidian 侧边栏较窄时，全局操作按钮（全局全选 / 全局取消 / 全局复制 / 逐节 / 并列 / 混合投影）被挤出画面的问题。按钮组改为 flex 自适应换行，输入框右侧按钮不再被压缩，确保桌面端窄边栏和移动端都能正常显示
- **混合投影字体大小调节无效**：修复混合投影模式下投影工具栏字号调节不起作用的问题。原因是 \`updateFontSize()\` 没有更新混合模式专用的 \`.bible-proj-mixed-text\` / \`.bible-proj-mixed-ref\`，现已补齐
- **书卷 / 章节选择网格自适应**：书卷列表与章节列表从固定 6 列改为 \`repeat(auto-fill, minmax(46px, 1fr))\`，容器变窄时自动减少列数，避免按钮被挤出侧边栏
- **搜索框行自适应**：输入框与按钮整行允许换行，极窄窗口下「查询」按钮可自动换到第二行；输入框最小宽度压缩到 35px，更窄的侧边栏也能放得下
- **投影底部工具栏被遮盖**：工具栏按钮全部改为符号 / 图标，并大幅压缩按钮尺寸；左右翻页始终固定在两端，中间按钮在窄窗口自动换行成两行显示，不再被挤出画面
- **标签栏窄屏按钮被挤出**：侧边栏较窄时，标签栏的「对照」「专注」按钮会被挤出画面。现在会实时检测标签栏是否溢出，溢出时自动隐藏「搜索 / 阅读」的文字只保留图标，并缩小按钮宽度与间距；窗口大小足够时恢复完整显示

### 改进
- **标签页图标化**：「圣经搜索」「圣经阅读」标签页改为图标 + 文字（放大镜图标 + 搜索 / 书签图标 + 阅读）
- **阅读页顶部快速跳转改为点击选择**：书卷名与章数改为带 ▼ 的胶囊按钮，点击书卷名弹出按旧约 / 新约双列分组的书卷菜单，点击章数弹出网格章节菜单，当前所在书卷 / 章节高亮；菜单会自动避开窗口边界，窄侧边栏下也不再超出可视区。书卷名带序号（如 \`38. 撒迦利亚书\`），章数显示去掉「第」字
- **本页操作布局统一**：搜索页与阅读页的「本页操作」统一为可折叠区块（与「全局操作」一致），前面加「本页操作」标签，按钮精简为两个字（全选 / 复制 / 经文 / 纲目），宽度与全局操作按钮一致
- **字体调节入口调整**：移除阅读页独立的「字体：− / +」行，改为「全局操作」标题右侧的字体图标按钮，点击后弹出字号调节面板
- **返回按钮精简**：「← 返回书卷」「← 返回章节」统一改为「返回」，去掉箭头
- **章节列表页书卷选择**：章节列表页顶部的书卷名也改为可点击，点击后直接弹出书卷选择菜单，不必再返回上一级
- **投影工具栏符号化**：字号按钮由 \`A−\` / \`A+\` 改为 \`−\` / \`+\`；重置改为旋转箭头图标；居中改为对齐图标（开启时蓝色高亮）；检索改为放大镜图标（分屏检索时切换为全屏图标）；主题切换由 🌙 / ☀️ 改为月亮 / 太阳图标

---`,
    '3.1.2': `## [3.1.2] - 2026-10-12

### 新增
- **圣经数据更新检测与一键更新**：插件本体的自动更新只会下载 main.js / manifest.json / styles.css，不会带上十几 MB 的圣经数据文件，因此数据需要单独一套版本机制。启动时（自动检测开启，12 小时节流一次）拉取云端清单 \`bible-data-manifest.json\`，与本地已安装数据版本比对；发现修正版即弹出常驻通知，提供「查看详情 / 立即更新 / 稍后」。「查看详情」列出本次具体改了什么（如修复了哪些经文）。确认后自动下载覆盖，覆盖前把旧数据备份为 \`<file>.old\`，完成后自动重新加载圣经数据
- **手动检查数据更新**：新增「检查圣经数据更新」命令，以及「设置 → 圣经版本管理 → 🔍 检查数据更新」按钮，可随时联网检查

### 修复
- **内置圣经数据下载地址过时**：修正恢复本 / 和合本两个默认版本的下载地址。原先写死指向 2.0.0 的 Release 附件，会下载到修复前的旧数据；现在统一指向仓库 main 分支的 \`data/\` 目录

### 数据
- **恢复本（\`bible-crv-data.json\`）**：修复 79 节经文正文被误并入上一节导致检索不到的问题（如林后5:7）；补齐林后6:17、6:18 与约叁1:15 等章末缺失经文；修正 2 处章号错标；补回诗49:8、诗104:8；补充 12 处「节合并」标注；清理 8 处行尾残留标记；规范化 rawLine 29 条
- **和合本（\`bible-cuvs-data.json\`）**：补入约书亚记、雅歌、阿摩司书、那鸿书 4 卷共 970 节（原文件仅 62 卷）；补写 71 处「节合并」说明；按恢复本分节边界修正 6 处（代上21/22、约7/8、启12/13、诗8、赛4）；全书按书卷顺序重排

---`,
    '3.1.1': `## [3.1.1] - 2026-10-12

### 新增
- **经文弹窗「保留候选」**：弹窗工具条新增「保留候选」开关（默认关闭）。勾选后，弹窗中勾选的经文会实时进入候选池，可与其它经文弹窗、圣经搜索、圣经阅读的选中项一起按顺序投影；取消勾选某节也会即时移出候选池，右侧实时显示候选数量
- **弹窗显示选中顺序**：弹窗中每处经文前显示全局选中序号（候选池在前，其后是圣经搜索 / 圣经阅读及本弹窗的选中项），序号与实际投影顺序一致
- **弹窗投影按钮**：新增「投影」按钮，点击后给出「逐节 / 并列 / 混合」三种投影模式；投影内容为全局选中项（候选池 + 各页面选中项），投影前自动关闭弹窗
- **复制范围选择**：当候选池或其它页面也有选中经文时，点击弹窗「复制」会弹出「本页复制 / 全局复制」选项；仅本弹窗有勾选时直接复制，不多一步选择

### 修复
- **三个窗口各自保留候选**：修复取消勾选「保留候选」后经文弹窗的选中项被清空的问题。现在经文弹窗、圣经搜索、圣经阅读三个窗口各自保留自己的候选：取消勾选时候选池中的弹窗候选项归还给弹窗（弹窗关闭后也不丢失，重新打开仍保持勾选与序号），检索页 / 阅读页的候选项各自留在原窗口
- **各窗口投影互不干扰**：未勾选「保留候选」时，在哪个窗口点「投影」就只投影哪个窗口的内容（原先在经文弹窗中点投影会把圣经搜索 / 圣经阅读的选中项一起投出来）；勾选「保留候选」后才按全局顺序合并投影。复制的范围同样按此规则处理
- **经文弹窗显示选中顺序**：修复弹窗中不显示选中顺序的问题。现在每处经文前都会显示顺序徽标——未勾选「保留候选」时按本弹窗独立编号（从 1 开始），勾选后按全局顺序编号，与投影顺序一致
- **弹窗「保留候选」计数与清空按钮逻辑**：修复弹窗标题栏候选数与「清空」按钮的出现逻辑，现在与圣经搜索 / 圣经阅读一致——勾选「保留候选」时按候选池总数显示（三个窗口看到同一个数字），未勾选时各窗口独立、只统计本弹窗自己的候选；有候选时才出现「清空」按钮
- **各经文弹窗独立统计**：修复未勾选「保留候选」时，多处经文引用的弹窗选中数字被累计的问题。现在每处经文引用（弹窗）各自独立编号、都从 1 开始，互不干扰，关闭再打开仍然保留
- **弹窗「清空」改为整体清空**：修复点击经文弹窗「清空」只清掉弹窗、却不清其它页面的问题。现在一次清空经文弹窗、圣经搜索、圣经阅读三个窗口的全部候选（含所有经文弹窗的候选库），并给出相应提示
- **浅色模式下弹窗看不清**：修复浅色主题下经文弹窗的候选框与选中状态几乎不可见的问题。弹窗挂在页面根节点，原先取不到检索视图作用域里的主题色，导致选中框背景变透明、白色顺序数字显示在白底上；现在弹窗自带一套随主题切换的颜色变量（浅色用更深的青色与更深的描边），选中框、顺序数字、「并」标签在浅色下都清晰可辨
- **任何方式更新都显示更新内容**：修复通过 Obsidian 第三方插件市场、BRAT 或手动覆盖安装更新后，看不到新版本更新说明的问题。现在启动时会自动比对「上次记录的版本」与当前版本号，只要版本发生变化就弹出最新版的更新说明（内置更新日志优先，缺失时自动从 GitHub 拉取），与插件自带的更新功能互不冲突、也不会重复弹；全新安装仍只显示首次运行引导

### 改进
- **全选 / 取消合并为一个按钮**：弹窗的「全选」「取消」合并为同一按钮，未全选时显示「全选」，已全选时自动切换为「取消」，节省工具条空间
- **弹窗标题栏集成候选操作**：「保留候选」复选框移到弹窗顶部经文出处后面，右侧显示候选数量，并在有候选时提供「清空」按钮（与圣经搜索 / 圣经阅读一致，整体清空三个窗口的候选）
- **弹窗选中状态与圣经搜索 / 圣经阅读一致**：候选框改用与两个页面相同的方框——未选中是空框，选中后在框内直接显示选中顺序数字，不再出现「打勾 + 数字」重复显示
- **弹窗新增「并」标签**：每节经文后面提供与圣经搜索 / 圣经阅读相同样式与交互的「并」标签，点击切换「✓ 并列」（混合投影时与前一节合并到同一页）；勾选「保留候选」时并列状态同步进候选池，取消勾选后仍保留在弹窗自己的候选里
- **可随时回看更新说明**：新增「查看当前版本的更新说明」命令，以及「设置 → 插件更新 → 📜 查看」按钮，随时可以再打开当前版本的更新内容；更新说明弹窗的小标题也修复了浅色 / 深色下取不到主题色的问题`,
    '3.1.0': `## [3.1.0] - 2026-10-12

### 新增
- **「保留候选」复选框**：在圣经检索与圣经阅读视图的「全局操作」标题右侧新增「保留候选」开关（默认关闭）。勾选后，在检索页面重新搜索、或在阅读页面切换书卷/章节时，之前已选中的候选经文会按顺序保留在候选池中（主版本与对照版本均保留），并按原有顺序继续追加新选择，便于跨检索/跨书卷按顺序投影连续内容
- **候选计数与一键清空**：「保留候选」右侧实时显示已保留的候选数量，并提供「清空」按钮；「取消全选」也会一并清空保留的候选
- **投影内打开检索**：投影模式底部操作栏新增「🔍 检索」按钮。点击后投影不关闭，缩为左下角预览窗口并打开插件检索窗口（自动切到「圣经搜索」标签），可在其中检索并选中新经文，再点击「逐节/并列/混合投影」即可更新投影内容并恢复全屏
- **经文弹窗工具条**：阅读视图中单击经文出处打开的弹窗新增字体增大/缩小、全选、取消、复制按钮，弹窗字体大小会被记住；每处经文前新增候选框，勾选后可复制选中内容；双击弹窗中的经文出处（顶部出处或每节的「章:节」）可跳转到圣经阅读页对应经文位置

### 修复
- **投影按钮在暗色下看不清**：底部工具栏按钮改用「文字 + 符号」（A− / A+ / 重置 / 居中 / 🔍 检索 / ✕），并加大字号与按钮尺寸；暗色下使用纯白文字 + 更亮的描边与底色，亮色下使用深色文字 + 深色描边，「居中」开启时按钮高亮为蓝色，翻页圆钮的 ◀ ▶ 也一并放大
- **投影内检索改为右侧分屏**：原先点击「🔍 检索」会把投影缩成左下角小窗，每次更新内容都要缩小再放大、视觉跳动。现在投影保持满屏高度，只把宽度收窄到「视口宽度 − 右侧边栏宽度」，右侧正好空出侧边栏显示圣经检索；在侧边栏改选经文后点「逐节/并列/混合投影」，投影内容原地更新（尺寸不变），需要时再点底部「⛶ 全屏」恢复满屏。侧边栏被拖动改变宽度或窗口缩放时，投影宽度会自动跟随
- **候选池改为实时更新**：勾选「保留候选」后，每选中一处经文就立即按序进入候选池，候选数量与序号即时刷新（原先只在重新搜索 / 切换章节 / 切换标签页时才冻结入池）；取消勾选已选项也会立即从候选池中移除。全选（全局全选 / 本页全选）与勾选开关时已有的选中项同样立即纳入
- **未安装版本残留**：修复对照版本列表中出现「1919 原版官话和合本 未安装」等从未提供过数据的版本的问题，现在只保留已安装版本与默认可下载版本，并会清理配置中的无效版本条目
- **更新弹窗无更新简介**：修复更新成功后弹窗不显示新版本更新简介的问题，现在优先读取内置更新日志（已补齐 3.0.0～3.1.0），缺失时自动从 GitHub 拉取对应版本的更新说明
- **切换标签页丢失候选**：修复勾选「保留候选」后，圣经搜索最后一次搜索结果里选中的经文在切换到圣经阅读时没有被保留、导致阅读页新选经文序号回退（如本应 7、8 却显示 5、6）的问题；现在切换标签页（以及从经文弹窗跳转到阅读页）同样会把当前标签页已选中的经文按原顺序冻结进候选池
- **取消「保留候选」后序号不从 1 开始**：修复取消勾选后候选池未被释放、序号仍带偏移的问题；现在取消勾选会把候选池按来源归还到检索页 / 阅读页，两个视图都从 1 重新编号（仅当前搜索结果中仍存在的检索页候选项可被还原）
- **「保留候选」两处开关不同步**：检索页与阅读页的「保留候选」现在共用同一个开关状态，在任一处勾选 / 取消都会同步另一处
- **阅读模式经文出处跨行 / 跨段落无法识别**：修复只写章节没写书卷时（含跨行、跨段落两种情况）引用识别不到的问题：
  - 书卷上下文现在会跨越段落传递——只写章节（如「四章一节」「二章一节」或「一1～二3」）时，自动沿用本文档前文中最后出现的书卷；换行或换段落不再丢失上下文。换文档、或文档重新渲染时上下文会重置，避免串到别的笔记
  - 章上下文现在取前一处的**结束章**：「路一1-二2」之后单写「4」解析为路加福音 2:4（原先误判为 1:4）
  - 同一行内的弱引用不再被后面才出现的书卷名带偏：「一1，路一1-二2」中的「一1」现在正确解析为创世记 1:1（原先被解析成路加福音）
  - 强引用末尾不再吞掉引导词：「约翰一章一节说到的话」只高亮「约翰一章一节」
  - 成串弱引用一次高亮：「一2，一3，二4」识别为一处引用（创 1:2、1:3、2:4），点击弹窗可逐节查看

### 技术实现
- 候选池：新增跨检索/跨章节/跨标签页共享的候选池（按「版本+书卷+章+节+类型+内容」唯一标识），复制与投影统一按「候选池 → 当前选中」的全局顺序输出
- 实时同步：勾选「保留候选」后，选中/取消选中（含全选）即时写入或移出候选池；重新搜索、切换书卷/章节、切换标签页只清理局部镜像，内容由候选池持续保留
- 开关统一：检索页与阅读页共用 \`keepCandidates\` 开关；取消勾选时按候选项的来源（\`search\` / \`reader\`）归还到各自视图并从 1 重新编号
- 重绘优化：用候选池变更计数判断检索页结果区是否需要重绘，避免切换标签页时多余重绘导致滚动位置丢失
- 投影复用：插件记录当前投影覆盖层引用，重新投影时复用并更新，避免叠加多个全屏覆盖层
- 更新说明：内置更新日志补齐 3.0.0～3.1.0，并在缺失时回退到 GitHub 上的 CHANGELOG.md 解析对应版本段落
- 引用上下文：引入「引用时间线」，弱引用按自身位置取左侧最近引用的书卷与结束章；上下文（书卷/章）存到插件实例并随 MarkdownPostProcessor 逐块传递，换文档或行号回退（重新渲染）时重置
- 弱延续：\`findLineStartRefs\`（行首）与 \`findWeakContinuationRefs\`（行内）均支持顿号/逗号分隔的并列延续项解析

---`,
    '3.0.2': `## [3.0.2] - 2026-09-26

### 移动端交互优化
- **单击打开经文弹窗**：经文出处由“悬停显示”改为“单击打开”经文弹窗
- **点击外部关闭弹窗**：点击弹窗以外的区域即关闭弹窗（点击引用本身或弹窗内部不关闭）
- **双击跳转阅读**：双击经文出处跳转到圣经阅读视图并定位到对应经文

---`,
    '3.0.1': `## [3.0.1] - 2026-09-24

### 变更
- **移除 Node.js \`fs\` 直接文件系统访问**：版本数据扫描、读取、下载与删除统一改用 Obsidian 的 Vault Adapter API（操作 vault 内 \`.obsidian/plugins/bible-search-reader/\` 目录），桌面端与移动端共用同一代码路径，插件不再直接访问系统文件系统（消除 Obsidian 插件市场 "Direct Filesystem Access" 警告）
- **移除 \`styles.css\` 中全部 \`!important\`**：改用更高优先级的选择器覆盖样式（如 \`.bible-reader-verse-card .bible-reader-compare-row\`），投影模式主题/纲目引用颜色由 JS 内联样式改为 CSS 控制，显示效果保持不变

### 文档
- **README**：新增英文概述、安装步骤（社区插件市场 / GitHub 手动安装）和基本使用说明，满足 Obsidian 插件市场对安装/使用说明及英文文本的要求

### 修复
- 修复桌面端通过 \`fs\` 回退读取版本数据时与 vault adapter 路径重复的问题；统一后行为一致
- 修复投影模式切换字体大小时，主题/纲目引用颜色可能被内联灰色覆盖的问题

---`,
    '3.0.0': `## [3.0.0] - 2026-09-01

### 新增
- **文章内圣经引用自动高亮**：阅读笔记时，自动识别文中的圣经引用并高亮显示
- **智能引用解析器**：支持多种中文圣经引用格式，覆盖绝大多数实际使用场景
- **悬停显示经文**：鼠标悬停在引用上，弹出 tooltip 显示对应经文内容
- **点击跳转阅读视图**：点击引用自动跳转到圣经阅读侧边栏并高亮定位

### 支持的引用格式
- 标准格式：\`约3:16\`、\`约翰福音3:16\`、\`约壹一5\`
- 中文量词：\`彼前二章二十三节\`、\`诗篇二十篇三节\`
- 连写格式：\`诗一一九15\`、\`赛四二4\`、\`四34\`、\`六57\`
- 范围引用：\`哀三22～24\`、\`弗六17～18\`、\`创一1～二25\`
- 同章多节：\`启二4、7\`、\`约十四10、24\`
- 承前省略：\`约五19，四34\`（省略书卷名）、\`约壹四16，18\`（省略书卷名和章号）
- 半节标记：\`利一9下\`、\`赛五三2上\`
- 前缀支持：\`参约四13～14\`
- 括号内引用：\`〔参弗四17、21〕\`
- 书卷别名：\`路加二十三章四十六节\`、\`约翰十四章三十节\`
- 跨段落承前省略：\`创一20～23\` 换行后 \`一24～31\`

### 技术实现
- 基于 \`registerMarkdownPostProcessor\` 实现，不侵入编辑器
- 三阶段解析：强引用（带书卷名）→ 括号内弱引用 → 行首弱引用
- 全局状态传递：跨文本节点承前省略
- 建立经文索引 Map，悬停时 O(1) 查找
- 自动复用现有圣经数据和版本设置

# 更新日志 / Changelog

---`,
    '2.1.2': `## [2.1.2] - 2026-08-26

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

---`,
    '2.1.1': `## [2.1.1] - 2026-08-22

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

---`,
    '2.1.0': `## [2.1.0] - 2026-08-20

### 新增
- **多版本圣经支持**：支持同时加载多个圣经版本，可在设置中管理已安装的版本。
- **多版本对照模式**：检索和阅读视图均支持多版本对照，默认关闭，开启后在首选经文下方按顺序显示其他版本。
- **版本管理设置**：全新的版本管理界面，支持启用/禁用版本、设置主版本、删除版本、下载新版本。
- **首次运行版本选择**：首次安装后引导用户选择圣经版本（可多选），自动检测本地已安装版本，支持下载恢复本和新标点和合本。
- **自定义版本识别**：自动识别插件目录下 \`bible-{缩写}-data.json\` 格式的自定义版本，支持常见中文圣经版本缩写对照表。

### 改进
- **移除外置数据模式**：2.1.0 起仅支持内置数据模式，简化架构和设置。
- **对照版本独立操作**：对照版本的经文拥有独立的候选框，可独立选中用于复制和投影。
- **投影支持多版本**：逐节、并列、混合投影均支持同时显示多个版本，对照版本自动弱化显示。
- **混合模式投影**：按选中顺序逐页展示，勾选了「并列」的项自动与前一页合并显示。
- **统一选中逻辑**：检索视图与阅读视图的选中、并列、投影逻辑统一为同一套机制。
- **全局对照设置**：「对照」按钮打开全局对照面板，同时影响圣经检索和圣经阅读，支持拖动排序。
- **对照版本简洁显示**：对照经文不再显示版本全名，直接显示经文内容，复制/投影时自动补上版本简称和出处。

### 兼容
- **旧版本数据迁移**：自动检测旧版 \`bible-data.json\` 并迁移为恢复本（CRV）版本。

### 修复
- **选中顺序**：修复检索和阅读视图中对照版选中顺序无法正确记录的问题，现在保持用户的实际点击顺序。
- **对照版投影**：修复 \`getCompareSelected()\` 中 \`cmpKey.split('-')\` 解析错误（versionKey 包含 \`-\` 时导致 parentIdx 解析错误）。
- **全选/取消全选**：修复全选/取消全选按钮不包含对照版的问题，现在会同时选中/取消选中所有对照版。
- **对照版对齐**：修复阅读视图中对照版候选框和文字位置偏移的问题，现在与主版本对齐。
- **并列标签显示**：修复某些经文选中后并列候选框不出现的问题。
- **取消选中重排**：修复取消选中后后续项顺序不往前推的问题。
- **并列状态切换**：修复对照版勾选并列后无法取消的问题。
- **逐节投影重复**：修复对照版在逐节投影中既并列出现又单独出现的问题。

---`,
    '2.0.2': `## [2.0.2] - 2026-08-09

### 改进
- **检索经文时，点击经文出处，可跳转至内容所在的章节**：搜索结果中点击经文出处或纲目时，无论内置/外置数据模式，均统一跳转到插件「圣经阅读」界面并高亮定位，不再依赖外置 Markdown 文件。

### 修复
- **自动更新安装失败**：修复因依赖不可靠的 manifest.dir 导致插件目录定位失败的问题，改为通过 vault basePath 计算绝对路径。

---`,
    '2.0.1': `## [2.0.1] - 2026-08-06

### 修复
- **内置数据路径去重**：修复桌面端设置页面显示两处相同内置数据的问题（相对路径与绝对路径指向同一文件）。
- **README 默认版本描述**：修正默认圣经版本为「恢复本圣经」（非和合本）。
- **纯关键词搜索排序**：修复单个关键词搜索时结果未按圣经书卷顺序展示的问题。

---`,
    '2.0.0': `## [2.0.0] - 2026-08-04

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
- **下载报错**：修复 Platform is not defined 错误，确保下载功能正常工作。`,

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

        await this.plugin.syncScannedVersions({ silent: true });

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
                        ver.path = '.obsidian/plugins/bible-search-reader/' + defaultVer.file;
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
        // 首次确认版本选择后，按主版本同步注解模式（CRV 主版本→开注解，其它→关）
        await this.plugin.reconcileNotesWithPrimary();
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
        cancelBtn.addEventListener('click', () => {
            // 弹窗里点「稍后」同样进入 24h 冷却，避免反复打扰
            this.plugin.settings.dataUpdateCooldownUntil = Date.now() + 24 * 3600 * 1000;
            this.plugin.saveSettings();
            this.close();
        });
    }
    fmtSize(n) {
        if (!n) return '未知';
        return (n / 1024 / 1024).toFixed(1) + ' MB';
    }
    onClose() {
        this.contentEl.empty();
    }
}

// 注解数据缺失时的下载提示：与版本缺失提示统一到左上角非阻塞横幅（见 BibleSearchPlugin.showDownloadBanner），
// 不再使用阻塞式 Modal，避免打断用户操作。

// 默认可下载版本缺失时的下载提示：本地没有某些默认可下载的圣经版本时，开机提示下载
// 版本缺失与注解缺失提示已统一为左上角非阻塞横幅（见 BibleSearchPlugin.showDownloadBanner），
// 不再使用阻塞式 Modal，避免打断用户操作。

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
        containerEl.createEl('div', { cls: 'setting-item-description', text: '管理已安装的圣经数据。数据文件（bible-{缩写}-data.json）与注解文件（bible-crv-notes.json）可放在 vault 任意位置，开机自动识别；若存在多份同名文件，会自动把最新的一份集中到插件目录作为唯一生效位置，其余副本可在下方清理。点击「刷新识别」重新扫描。' });

        const refreshBtn = containerEl.createEl('button', { cls: 'bible-small-btn', text: '🔄 刷新识别' });
        refreshBtn.style.marginBottom = '12px';
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.setAttribute('disabled', 'true');
            refreshBtn.setText('刷新中...');
            await this.plugin.syncScannedVersions();
            this.display();
            new Notice('版本识别已刷新');
        });

        const checkDataBtn = containerEl.createEl('button', { cls: 'bible-small-btn', text: '🔍 检查数据/注解更新' });
        checkDataBtn.style.marginBottom = '12px';
        checkDataBtn.style.marginLeft = '8px';
        checkDataBtn.title = '联网比对云端清单，同时检查已安装的圣经数据与恢复本注解 / 串珠是否有修正版';
        checkDataBtn.addEventListener('click', async () => {
            checkDataBtn.setAttribute('disabled', 'true');
            checkDataBtn.setText('检查中...');
            await this.plugin.checkBibleDataUpdateAndNotify(true);
            checkDataBtn.removeAttribute('disabled');
            checkDataBtn.setText('🔍 检查数据/注解更新');
        });

        // 重复数据清理入口：集中到插件目录后，其它位置的旧副本可在此一键清理
        if (this.plugin.settings.duplicateDataPaths && this.plugin.settings.duplicateDataPaths.length) {
            const dupPaths = this.plugin.settings.duplicateDataPaths;
            new Setting(containerEl)
                .setName(`发现 ${dupPaths.length} 处重复数据文件`)
                .setDesc('已自动集中到插件目录（唯一生效位置）。以下旧副本可清理：' + dupPaths.join('、'))
                .addButton(button => button
                    .setButtonText('🧹 清理重复')
                    .onClick(async () => {
                        const { removed, failed } = await this.plugin.removeDuplicateDataFiles(dupPaths);
                        new Notice(`已删除 ${removed.length} 处重复数据${failed.length ? ('，' + failed.length + ' 处失败') : ''}`);
                        this.plugin.settings.duplicateDataPaths = [];
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        }

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

            // 展示数据文件相对路径（vault 任意位置均可）
            if (ver.installed) {
                const relPath = ver.path || ('.obsidian/plugins/bible-search-reader/' + ver.file);
                const pathEl = info.createEl('div', { cls: 'setting-item-description' });
                pathEl.setText('📂 ' + relPath);
                pathEl.style.fontSize = '12px';
                pathEl.style.color = 'var(--text-muted)';
                pathEl.style.wordBreak = 'break-all';
                pathEl.style.marginTop = '2px';
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
                        ver.path = '.obsidian/plugins/bible-search-reader/' + defaultVer.file;
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
                        // 删除版本后主版本可能改变，同步注解模式
                        await this.plugin.reconcileNotesWithPrimary();
                        this.display();
                    }
                });
            }
        }

        // ===== 板块：恢复本注解 / 串珠 =====
        containerEl.createEl('h3', { text: '恢复本注解 / 串珠', cls: 'setting-item-name', attr: { style: 'margin-top:24px;' } });
        new Setting(containerEl)
            .setName('启用注解与串珠')
            .setDesc('阅读页经文内嵌 ¹ ᵃ 上标，点击展开注解 / 串珠；检索结果与经文弹窗也会显示。数据文件 bible-crv-notes.json 约 6MB，首次用到时加载。默认快捷键 A（命令：切换恢复本注解 / 串珠），可在 设置 → 快捷键 中修改。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showNotes)
                .onChange(async (value) => {
                    await this.plugin.setShowNotes(value);
                }));
        new Setting(containerEl)
            .setName('注解数据文件')
            .setDesc((this.plugin.settings.notesInstalled ? '已安装' : '未安装') +
                '：' + (this.plugin.settings.notesPath || ('.obsidian/plugins/bible-search-reader/' + NOTES_FILE)) +
                '（约 6MB，含恢复本全部注解与串珠）。未安装时点击右侧按钮下载。')
            .addButton(button => button
                .setButtonText(this.plugin.settings.notesInstalled ? '🔄 重新安装' : '⬇️ 下载安装')
                .onClick(async () => {
                    button.setDisabled(true);
                    const old = button.buttonEl.textContent;
                    button.setButtonText('下载中...');
                    await this.plugin.installNotesData(true);
                    button.setButtonText(old);
                    button.setDisabled(false);
                }));

        // ===== 板块：检索与阅读交互 =====
        containerEl.createEl('h3', { text: '检索与阅读', cls: 'setting-item-name', attr: { style: 'margin-top:24px;' } });
        new Setting(containerEl)
            .setName('左右滑动翻页')
            .setDesc('触屏设备上，在检索结果或经文阅读区左滑翻到下一页 / 下一章，右滑翻到上一页 / 上一章，可跨书卷连续翻。上下滚动、点击与文字选择不受影响；不需要时可关闭。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.swipeNavigation !== false)
                .onChange(async (value) => {
                    this.plugin.settings.swipeNavigation = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('移动端右滑翻上一页')
            .setDesc('手机 / 平板上右滑默认翻到上一页 / 上一章，并阻止Obsidian侧边抽屉同时响应（侧边栏不会被划走，也不会被划出）。若你更习惯用右滑呼出侧边栏，可关闭此项：关闭后移动端右滑完全交给侧边栏，左滑仍可翻下一页 / 下一章。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.mobileRightSwipe !== false)
                .onChange(async (value) => {
                    this.plugin.settings.mobileRightSwipe = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('鼠标拖拽与触控板横滑翻页')
            .setDesc('桌面端在内容区（含正文文字）按住鼠标左键，像触屏一样四向滑动：左右滑翻页 / 翻章，上下滑跟着手势滚动内容；触控板双指横滑同样翻页，纵向滚轮照常滚动。按住 Shift / Alt 再拖动可保留原有选字复制；点击、链接、按钮、输入框与经文弹窗不受影响。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.pointerNavigation !== false)
                .onChange(async (value) => {
                    this.plugin.settings.pointerNavigation = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('键盘导航')
            .setDesc('← / → 翻页或翻章（可跨书卷）；↑ / ↓ 显示选框并逐条移动，超出屏幕时自动滚动；空格选中当前条；B 切换当前条的「并」（并列显示）；C 清空所有选中。焦点在输入框 / 笔记正文打字时全部让行。')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.keyboardNavigation !== false)
                .onChange(async (value) => {
                    this.plugin.settings.keyboardNavigation = value;
                    await this.plugin.saveSettings();
                }));

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
        const { file, key, path: vpath } = versionConfig;
        try {
            // 优先读取记录的相对路径（vault 任意位置），找不到再回退到插件目录默认位置
            const candidates = [vpath, '.obsidian/plugins/bible-search-reader/' + file].filter(Boolean);
            let raw = null;
            for (const p of candidates) {
                if (await this.app.vault.adapter.exists(p)) {
                    raw = await this.app.vault.adapter.read(p);
                    break;
                }
            }
            if (raw != null) {
                const data = JSON.parse(raw);
                if (Array.isArray(data)) {
                    for (const item of data) {
                        item.versionKey = key;
                        items.push(item);
                    }
                    return items;
                }
            }

            // 数据文件位于 vault 内（插件目录或用户自行放置的任意位置），桌面端与移动端均通过 vault adapter 读取
            console.warn(`[Bible] 未找到版本 ${key} 数据文件: ${file}`);
        } catch (e) {
            console.error(`[Bible] 读取版本 ${key} 数据失败:`, e);
        }
        return items;
    }
}

// ==================== 检索引擎 ====================
class BibleSearchEngine {
    constructor(plugin) { this.items = []; this.includeNotes = false; this.notesOnly = false; this.plugin = plugin || null; }
    setItems(items) { this.items = items; }
    setIncludeNotes(on) { this.includeNotes = !!on; }
    // 只检索注解正文：只勾了「注解」而不勾「经文」时生效
    setNotesOnly(on) { this.notesOnly = !!on; }

    // 关键词匹配：and / and_ordered / or / or_ordered 四种模式共用
    matchKeywords(text, keywords, mode) {
        const lower = String(text || '').toLowerCase();
        if (!keywords || !keywords.length) return false;
        if (mode === 'or' || mode === 'or_ordered') {
            return keywords.some(k => lower.includes(k.toLowerCase()));
        }
        if (mode === 'and_ordered') {
            let lastIndex = -1;
            for (const kw of keywords) {
                const idx = lower.indexOf(kw.toLowerCase(), lastIndex + 1);
                if (idx === -1) return false;
                lastIndex = idx;
            }
            return true;
        }
        return keywords.every(k => lower.includes(k.toLowerCase()));
    }

    search(query, types, range, bookIds, primaryKey) {
        if (!query.trim()) return [];
        const parsed = this.parseQuery(query);
        const refs = parsed.refs;
        const keywords = parsed.keywords;
        const noteRefs = parsed.noteRefs || [];
        const keywordMode = parsed.keywordMode || 'and';

        const results = [];
        const seen = new Set();

        for (const item of this.items) {
            if (item.versionKey !== primaryKey) continue;
            // 按注 / 串出处检索时，即使没勾「经文」也要允许扫描经文条目（结果只产出注 / 串本身）
            if (!types.includes(item.type) && !(item.type === 'verse' && noteRefs.length > 0)) continue;
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
            // 经文类结果只看经文本身；注解正文单独产出「注解结果」（见下），
            // 否则会出现「注解里命中、却拿一整节经文当结果」的情况
            if (keywords.length > 0 && !this.notesOnly && types.includes(item.type)) {
                if (this.matchKeywords(item.content, keywords, keywordMode)) matched = true;
            }

            if (matched) {
                const key = item.bookId + '-' + item.chapter + '-' + item.verse + '-' + item.type + '-' + item.content;
                if (!seen.has(key)) {
                    seen.add(key);
                    results.push({ item: item, selected: false, order: 0, sideBySide: false, _refIndex: refIndex });
                }
            }

            // 勾选「注解」时：每条命中的注解各自成为一条结果，显示「出处 + 注解正文」
            if (this.includeNotes && keywords.length > 0 && Array.isArray(item.notesList)) {
                for (const nt of item.notesList) {
                    if (!nt || !nt[1]) continue;
                    if (!this.matchKeywords(nt[1], keywords, keywordMode)) continue;
                    results.push({
                        item: item, isNote: true, noteKind: 'n', noteLabel: nt[0], noteText: nt[1],
                        selected: false, order: 0, sideBySide: false, _refIndex: -1
                    });
                }
            }

            // 按注 / 串出处直接定位：如「1:26注2」「创1:26注2」「罗8:28串1」
            for (const nr of noteRefs) {
                if (nr.bookId != null && item.bookId !== nr.bookId) continue;
                if (item.chapter !== nr.chapter || item.verse !== nr.verse) continue;
                if (nr.part && (item.part || '') !== nr.part) continue;
                const hit = this.findNoteEntry(item, nr.kind, nr.label);
                if (!hit) continue;
                const key = 'note-' + item.bookId + '-' + item.chapter + '-' + item.verse +
                    '-' + (item.part || '') + '-' + nr.kind + '-' + nr.label;
                if (seen.has(key)) continue;
                seen.add(key);
                results.push({
                    item: item, isNote: true, noteKind: nr.kind, noteLabel: nr.label, noteText: hit.text,
                    selected: false, order: 0, sideBySide: false, _refIndex: -1
                });
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
                const aContent = (a.noteText || a.item.content).toLowerCase();
                const bContent = (b.noteText || b.item.content).toLowerCase();
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
                // 同一节：经文行在前，注解行按注号排在后面
                if (!!a.isNote !== !!b.isNote) return a.isNote ? 1 : -1;
                if (a.isNote && b.isNote) {
                    const al = parseInt(a.noteLabel, 10), bl = parseInt(b.noteLabel, 10);
                    if (!isNaN(al) && !isNaN(bl) && al !== bl) return al - bl;
                }
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

        const tokens = normalizedQuery.split(/[,，、；;\s。\.]+/)
            .map(t => t.trim()).filter(t => t.length > 0)
            .map(t => normalizeBookAbbr(t));
        // 「csj 1:1」这类把短拼和章号用空格分开的写法：合并成一个 token 再走常规解析
        for (let i = 0; i < tokens.length - 1; i++) {
            const shortName = bookAbbrOf(tokens[i]);
            if (shortName && /^[\d０-９一二三四五六七八九十百零〇]/.test(tokens[i + 1])) {
                tokens[i] = shortName + tokens[i + 1];
                tokens.splice(i + 1, 1);
            }
        }
        let currentBookId = null;
        let currentChapter = 1;
        const noteRefs = [];

        for (const token of tokens) {
            let matched = false;
            // 注 / 串出处：先看是不是「…注N」「…串N」，是的话走注解定位而不是当关键词
            const noteRef = this.parseNoteReference(token, currentBookId, currentChapter);
            if (noteRef) {
                noteRefs.push(noteRef);
                if (noteRef.bookId != null) {
                    currentBookId = noteRef.bookId;
                    currentChapter = noteRef.chapter;
                }
                continue;
            }
            for (const sn of SEARCH_BOOK_NAMES) {
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

        return { refs: refs, keywords: keywords, noteRefs: noteRefs, keywordMode: keywordMode };
    }

    // 解析「注 / 串出处」形式的检索词：
    //   创1:26注2、创1:26串1、1:26注2（沿用前文书卷 / 全部书卷）、1:26上注1
    // 返回 { bookId(可为 null=不限书卷), chapter, verse, part, kind:'n'|'r', label }，不是这种形式则返回 null
    parseNoteReference(token, currentBookId, currentChapter) {
        // 注号是数字（注2），串珠标号是字母（串a），两者都要认
        const m = token.match(/^(.+?)\s*(?:串珠|注|串)\s*([0-9a-zA-Z]+)$/);
        if (!m) return null;
        const head = m[1].trim();
        const label = m[2];
        // kind：token 里写「注」是注解，写「串 / 串珠」是串珠
        const kind = /串/.test(token.slice(m[1].length)) ? 'r' : 'n';
        if (!head) return null;
        let bookId = null, chapter = null, verse = null, part = '';
        // 形如「创1:26」「约三2」等带书卷名的写法
        let rest = head;
        for (const sn of SEARCH_BOOK_NAMES) {
            if (rest.startsWith(sn)) {
                const book = BOOK_MAP[sn];
                if (!book) return null;
                bookId = book.id;
                rest = rest.slice(sn.length);
                break;
            }
        }
        if (bookId === null && currentBookId !== null) bookId = currentBookId;
        // 去掉上/下半节标记
        const partMatch = rest.match(/^(.*?)([上下])$/);
        if (partMatch) { part = partMatch[2]; rest = partMatch[1]; }
        const rangeParts = rest.split(/[-~～]/);
        if (rangeParts.length > 2) return null;
        const cv = this.parseChapterVerse(rangeParts[0]);
        if (cv) {
            chapter = cv.chapter;
            verse = cv.verse;
        } else if (bookId !== null) {
            // 只有节号：沿用当前章（如紧跟「罗马书八」之后搜「28注1」）
            const vs = parseNumber(rangeParts[0]);
            if (isNaN(vs) || vs <= 0) return null;
            chapter = currentChapter || 1;
            verse = vs;
        } else {
            return null;
        }
        if (bookId === null && !/^[一二三四五六七八九十百零〇\d]+[:：]\d+$/.test(rest)) {
            // 完全没有书卷上下文时只认「章:节」形式，避免把随意的词当成章节
            return null;
        }
        return { bookId: bookId, chapter: chapter, verse: verse, part: part, kind: kind, label: label };
    }

    // 取某一节里指定标号的那条注解 / 串珠（串珠附上被引用的经文）
    findNoteEntry(item, kind, label) {
        if (!item || item.type !== 'verse') return null;
        if (!this.plugin || !this.plugin.getVerseNotes) return null;
        const nd = this.plugin.getVerseNotes(item.bookId, item.chapter, item.verse, item.part);
        if (!nd) return null;
        const list = kind === 'r' ? (nd.r || []) : (nd.n || []);
        // 串珠标号是字母，大小写不敏感；注解标号是数字
        const key = String(label).toLowerCase();
        const hit = list.find(x => String(x[0]).toLowerCase() === key);
        if (!hit) return null;
        let text = hit[1] || '';
        if (kind === 'r') {
            const quoted = [];
            for (const v of this.plugin.getChainReferencedVerses(hit, item.versionKey)) {
                quoted.push(v.bookShortName + v.chapter + ':' + v.verse + (v.part || '') + ' ' + v.content);
            }
            if (quoted.length) text = text + '\n' + quoted.join('\n');
        }
        return { text: text };
    }

    parseVerseReference(part) {
        const ranges = [];
        let bookShortName = '';
        let remaining = '';
        for (const sn of SEARCH_BOOK_NAMES) {
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
            } else {
                // 「太1-3」「太一～三章」这类两端都只写章号的范围：展开成若干整章。
                // 两端都解析不出「章:节」才走这里，所以「太1:1-3」仍是节范围，语义不混。
                const chText = s => String(s).trim().replace(/[章篇]$/, '');
                const ch1 = parseNumber(chText(rangeParts[0]));
                const ch2 = parseNumber(chText(rangeParts[1]));
                if (!isNaN(ch1) && !isNaN(ch2) && ch1 >= 1 && ch2 >= ch1 && ch2 <= book.maxChapters) {
                    ranges.push({
                        bookId: book.id, startChapter: ch1, startVerse: 1,
                        endChapter: ch2, endVerse: Number.MAX_SAFE_INTEGER, chapterOnly: true
                    });
                }
            }
        } else if (rangeParts.length === 1) {
            const cv = this.parseChapterVerse(rangeParts[0]);
            if (cv) {
                ranges.push({ bookId: book.id, startChapter: cv.chapter, startVerse: cv.verse, endChapter: cv.chapter, endVerse: cv.verse });
            } else {
                // 「太1」「太一」「诗23篇」这类只写章号、不写节号的写法：展开成整章。
                // endVerse 用哨兵值，matchVerseRef 会把该章的所有节都纳入结果。
                const chText = String(rangeParts[0]).trim().replace(/[章篇]$/, '');
                const ch = parseNumber(chText);
                if (!isNaN(ch) && ch >= 1 && ch <= book.maxChapters) {
                    ranges.push({
                        bookId: book.id, startChapter: ch, startVerse: 1,
                        endChapter: ch, endVerse: Number.MAX_SAFE_INTEGER, chapterOnly: true
                    });
                }
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
        // 整章 / 章范围检索（chapterOnly）：检索种类勾了「主题 / 纲目」时也要带出对应行。
        // 这两类不能用经文的节号边界：纲目 verse 恒为 0，会被 startVerse=1 全数排除；
        // 主题 chapter 恒为 0（每卷一条、全书卷级），按书卷归属即可。是否真的出现在结果里
        // 由 search() 的 types 勾选决定，这里只负责放宽类型与匹配口径。
        // 普通的单节 / 节范围引用没有 chapterOnly，行为完全不变。
        if (ref.chapterOnly && item.type !== 'verse') {
            if (item.type !== 'theme' && item.type !== 'outline') return false;
            if (item.bookId !== ref.bookId) return false;
            if (item.type === 'theme') return true;
            return item.chapter >= ref.startChapter && item.chapter <= ref.endChapter;
        }
        if (item.type !== 'verse') return false;
        if (item.bookId !== ref.bookId) return false;
        if (item.chapter < ref.startChapter || item.chapter > ref.endChapter) return false;
        if (item.chapter === ref.startChapter && item.verse < ref.startVerse) return false;
        if (item.chapter === ref.endChapter && item.verse > ref.endVerse) return false;
        return true;
    }
}

// ==================== 与 Hymns 插件的投影联动 ====================
// 两个插件互不引用、加载顺序也不确定，因此只靠「DOM 标记 + 自定义事件」协同：
//   · Hymns 的投影层固定带 .hymns-proj 类；只要该图层还在 DOM 里，就认为诗歌投影在前台。
//   · 诗歌投影前台时按 Q/W/E＝想切回经文投影：先派发 hymns:projection-close 请对方
//     自己收起（它会退出浏览器整屏、移除图层、清理键盘监听），detail.done 用来确认是否被处理。
//   · 对方是旧版、不认识该事件时走 DOM 兜底，避免画面永远卡在诗歌投影。
// 反过来，本插件把 O/P 完全让给 Hymns（全屏投影改用 D），因此诗歌投影的打开/切换
// 仍由 Hymns 自己的快捷键处理，本文件不注册任何 O/P 监听。
const HYMNS_PROJECTION_SELECTOR = '.hymns-proj';

function isHymnsProjectionFront() {
    try {
        const doc = (typeof document !== 'undefined') ? document : null;
        if (!doc) return false;
        if (typeof doc.querySelector === 'function' && doc.querySelector(HYMNS_PROJECTION_SELECTOR)) return true;
        const fs = doc.fullscreenElement || doc.webkitFullscreenElement;
        return !!(fs && fs.classList && typeof fs.classList.contains === 'function' &&
            fs.classList.contains('hymns-proj'));
    } catch (err) { return false; }
}

function requestHymnsProjectionClose() {
    const doc = (typeof document !== 'undefined') ? document : null;
    if (!doc) return;
    let handled = false;
    try {
        if (typeof doc.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
            const detail = { reason: 'bible-projection', done: false };
            doc.dispatchEvent(new CustomEvent('hymns:projection-close', { detail }));
            handled = !!detail.done;
        }
    } catch (err) { /* 忽略：环境不支持自定义事件 */ }
    if (handled) return;
    // 兜底：对方没响应时直接摘掉图层并退出整屏，保证画面能回到经文投影
    try {
        const left = (typeof doc.querySelectorAll === 'function')
            ? doc.querySelectorAll(HYMNS_PROJECTION_SELECTOR) : [];
        for (let i = 0; i < left.length; i++) {
            const el = left[i];
            if (el && el.parentNode && typeof el.parentNode.removeChild === 'function') {
                el.parentNode.removeChild(el);
            }
        }
        const fs = doc.fullscreenElement || doc.webkitFullscreenElement;
        if (fs) {
            const fn = doc.exitFullscreen || doc.webkitExitFullscreen;
            if (typeof fn === 'function') {
                const p = fn.call(doc);
                if (p && typeof p.catch === 'function') p.catch(() => { /* 忽略 */ });
            }
        }
    } catch (err) { /* 忽略 */ }
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
        // 逐节模式默认居中（沿用原外观），其余模式默认左对齐，均可按 C 切换
        this.isCentered = (mode === 'focus');
        this.isSearchMode = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        // 投影内容历史：从注解出处 / 经文弹窗再次投影时先存档当前内容，便于返回上一层
        this._projHistory = [];
        // 顶部搜索框实时投影：去抖定时器 + 请求序号（序号用于丢弃已经过期的异步检索结果）
        this._quickSearchTimer = null;
        this._quickSearchSeq = 0;
        this._projComposing = false;
        this.buildSlides();
    }

    buildSlides() {
        // 切换模式时必须先清空旧 slides，否则 setMode / 重复进入会不断向数组追加，
        // currentSlide 仍指向旧模式的某一页，导致「按 QWE 切换后内容没变、翻页才生效」的问题
        this.slides = [];
        const selected = this.results;
        if (this.mode === 'focus') {
            // 逐节模式：每个选中项单独一页（sideBySide 只在混合模式生效）
            for (const r of selected) {
                this.slides.push({ items: [r] });
            }
        } else if (this.mode === 'parallel') {
            // 并列模式：所有选中项在一页。空选中时不要推出一个空白页，
            // 否则「不选中经文直接开投影」会显示空白而不是顶部搜索框的空态引导
            if (selected.length) this.slides.push({ items: [...selected] });
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
        // -webkit-app-region:drag 让投影顶栏成为 Electron 的窗口拖动区（桌面端适用，网页端忽略），
        // 从而在投影全屏遮挡原生标题栏时仍能拖动整个 Obsidian 窗口。
        // 顶栏改成上下两行：第一行常驻搜索框，第二行保留快捷键提示；
        // 搜索框与按钮单独设 no-drag，否则在 Electron 里点不中、也拿不到键盘焦点。
        topBar.style.cssText = 'display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;padding:6px 16px;background:rgba(0,0,0,0.2);border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;-webkit-app-region:drag;';
        const topRow = topBar.createDiv({ cls: 'bible-proj-toprow' });
        topRow.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;';
        const topLeft = topRow.createDiv();
        topLeft.createEl('span', { cls: 'bible-proj-mode-name', text: this.getModeName() });
        // 常驻快速搜索框：输入经文出处 / 关键词 / 短拼后按 Enter（或点「投影」）直接替换投影内容
        const quick = topRow.createDiv({ cls: 'bible-proj-quick-search' });
        const qsInput = quick.createEl('input', {
            cls: 'bible-proj-quick-search-input',
            attr: { type: 'text', autocomplete: 'off', spellcheck: 'false', title: '投影经文：输入即自动投影，支持整章、章范围、短拼、注串出处与关键词' }
        });
        qsInput.placeholder = '投影经文：太1、太1-3、csj1:1、恩典…（输入即投影）';
        this.quickSearchInput = qsInput;
        const qsClear = quick.createEl('button', { cls: 'bible-proj-quick-search-clear', text: '✕', attr: { type: 'button', title: '清空搜索框' } });
        const qsGo = quick.createEl('button', { cls: 'bible-proj-quick-search-go', text: '投影', attr: { type: 'button', title: '立即投影并把焦点交还画面（Enter）' } });
        const topRight = topRow.createDiv();
        topRight.createEl('span', { cls: 'bible-proj-page-num', text: (this.slides.length ? (this.currentSlide + 1) : 0) + '/' + this.slides.length + '页' });
        const hintRow = topBar.createDiv({ cls: 'bible-proj-tophint' });
        // D 键说明随全屏状态变化（全屏时提示「退出全屏投影」），由 updateDesktopBtn() 同步
        this.hintRow = hintRow;
        hintRow.setText('← → 翻页 · / 搜索 · Q 逐节 · W 并列 · E 混合 · S 检索 · D 全屏投影 · C 居中 · R 重置 · +/- 字体 · T 主题 · Z 返回 · ESC 关闭');
        this.overlay.appendChild(topBar);
        this.setupQuickSearch(qsInput, qsClear, qsGo);

        this.contentArea = document.createElement('div');
        this.contentArea.className = 'bible-proj-content';
        this.contentArea.style.cssText = 'flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;position:relative;';
        this.overlay.appendChild(this.contentArea);

        const bottomBar = document.createElement('div');
        bottomBar.className = 'bible-proj-bottombar';
        bottomBar.style.cssText = 'flex-shrink:0;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.1);';

        const bottomRow = bottomBar.createDiv({ cls: 'bible-proj-bottom-row' });
        bottomRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 16px;gap:8px;';
        // 返回上一个投影内容：从注解出处 / 经文弹窗再次投影后，可退回之前的投影（无历史时隐藏）
        const backBtn = bottomRow.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-back', text: '↶', attr: { 'data-action': 'proj-back' } });
        backBtn.title = '返回上一个投影内容（Z）';
        backBtn.style.display = 'none';
        backBtn.addEventListener('click', () => this.goBackProjection());
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
        const centerBtn = addToolBtn('', 'toggle-centered', '切换居中', 'bible-proj-tool-icon');
        setIcon(centerBtn, 'align-center');
        const themeBtn = addToolBtn('', 'toggle-theme', '切换主题', 'bible-proj-tool-icon');
        setIcon(themeBtn, this.isDark ? 'moon' : 'sun');
        const desktopFullBtn = addToolBtn('⛶', 'toggle-desktop-full', '全屏投影（D）', 'bible-proj-tool-emoji');
        this.desktopFullBtn = desktopFullBtn;
        const searchBtn = addToolBtn('', 'open-search', '打开检索窗口（S）', 'bible-proj-tool-icon');
        setIcon(searchBtn, 'search');
        addToolBtn('✕', 'close', '关闭投影', 'bible-proj-tool-emoji');

        const nextBtn = bottomRow.createEl('button', { cls: 'bible-proj-nav-btn bible-proj-next', text: '▶' });
        this.overlay.appendChild(bottomBar);

        document.body.appendChild(this.overlay);
        if (this.plugin) this.plugin.currentProjection = this;
        // 点击注解 / 串珠面板以外的任何区域即收起已展开的面板。
        // 上标（sup）自身的点击处理器里调了 stopPropagation，不会冒泡到这里，
        // 所以「点上标开关面板」与「点别处自动收起」两套逻辑互不干扰。
        this._noteOutsideHandler = (e) => {
            const t = e && e.target;
            if (t && t.closest) {
                const inside = t.closest('.bible-proj-notes');
                // 只认属于本投影的面板，避免误判成「内部」而不收起
                if (inside && this.overlay && this.overlay.contains(inside)) return;
            }
            this.closeProjNotePanels();
        };
        document.addEventListener('click', this._noteOutsideHandler);
        this.bindEvents(toolCenter, bottomRow);
        this.renderSlide();
        // 投影刚打开就把键盘焦点从笔记编辑器 / 输入框收回投影容器：
        // iPad 上笔记处于编辑模式时 contentEditable 会持续持有焦点，
        // 否则按快捷键会直接写进笔记正文并唤起输入法。延后执行以应对 Obsidian 的自动重聚焦。
        // 焦点一律先给投影容器（空投影也一样），保证翻页 / QWE / D 等快捷键打开即可用；
        // 想搜索时按 / 或 Enter 再把焦点交给顶部搜索框，避免一开投影就弹输入法、快捷键全哑。
        setTimeout(() => this.focusProjection(true), 0);
        setTimeout(() => this.focusProjection(true), 150);
    }

    // ===== 顶部常驻快速搜索框 =====
    // 输入即投影：打字停顿 350ms 就用当前文本替换投影内容，不必按 Enter 或点「投影」。
    // 实时投影刻意不打断输入（不抢焦点、不关补全下拉、不弹通知、不压历史），
    // Enter / 「投影」按钮仍保留为「确认」入口：存一次历史、给提示、把焦点交还画面。
    setupQuickSearch(input, clearBtn, goBtn) {
        const self = this;
        // 选中补全候选后 input.value 被改写但不会触发 input 事件，靠回调排一次实时投影
        this._projAbbr = new ProjBookAbbrSuggestion(input, () => self.scheduleQuickSearch(0), this.overlay);
        const confirm = () => {
            self.invalidateQuickSearch();
            self.projectQuery(input.value);
        };
        input.addEventListener('keydown', (e) => {
            if (self._projAbbr && self._projAbbr.handleKey(e)) return;
            if (e.key === 'Enter') {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                confirm();
            } else if (e.key === 'Escape') {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                self.cancelQuickSearch();
                if (self._projAbbr) self._projAbbr.close();
                try { input.blur(); } catch (err) { /* 忽略 */ }
                self.focusProjection(true);
            }
        });
        // 中文输入法组字期间不检索：compositionstart 先作废旧请求，compositionend 再排程
        input.addEventListener('compositionstart', () => {
            self._projComposing = true;
            self.invalidateQuickSearch();
        });
        input.addEventListener('compositionend', () => {
            self._projComposing = false;
            if (self._projAbbr) self._projAbbr.refresh();
            self.scheduleQuickSearch();
        });
        input.addEventListener('input', (e) => {
            // isComposing / keyCode 229 是 IME 组字中的 input，此时文本尚未定稿
            const composing = !!(e && (e.isComposing || e.keyCode === 229)) || self._projComposing;
            self.invalidateQuickSearch();
            if (composing) return;
            if (self._projAbbr) self._projAbbr.refresh(e);
            self.scheduleQuickSearch();
        });
        goBtn.addEventListener('click', confirm);
        clearBtn.addEventListener('click', () => {
            input.value = '';
            // 清空只收起下拉与待触发的实时投影，保留上一版画面，不闪空白
            self.invalidateQuickSearch();
            if (self._projAbbr) { self._projAbbr.dismissed = null; self._projAbbr.close(); }
            try { input.focus({ preventScroll: true }); } catch (err) { /* 忽略 */ }
        });
    }

    // 取消尚未触发的实时投影，并让已经发出但还没回来的异步检索作废
    invalidateQuickSearch() {
        this._quickSearchSeq = (this._quickSearchSeq || 0) + 1;
        this.cancelQuickSearch();
    }

    cancelQuickSearch() {
        if (!this._quickSearchTimer) return;
        try { clearTimeout(this._quickSearchTimer); } catch (err) { /* 忽略 */ }
        this._quickSearchTimer = null;
    }

    scheduleQuickSearch(delay) {
        this.cancelQuickSearch();
        if (this._closed) return;
        const self = this;
        this._quickSearchTimer = setTimeout(() => {
            self._quickSearchTimer = null;
            if (self._closed || !self.quickSearchInput) return;
            const q = String(self.quickSearchInput.value == null ? '' : self.quickSearchInput.value).trim();
            if (!q) return; // 空文本静默，保留上一版投影
            const seq = ++self._quickSearchSeq;
            self.projectQuery(q, { realtime: true, seq });
        }, typeof delay === 'number' ? delay : 350);
    }

    focusQuickSearch() {
        const input = this.quickSearchInput;
        if (!input) return;
        try { input.focus({ preventScroll: true }); }
        catch (err) { try { input.focus(); } catch (e2) { /* 忽略 */ } }
        if (this._projAbbr) this._projAbbr.refresh();
    }

    // 用顶部搜索框快速投影：走的是与侧边栏同一个 BibleSearchEngine，
    // 因此整章（太1）、章范围（太1-3）、拼音短拼（csj1:1）、注串出处、关键词等写法全部一致。
    // 检索种类 / 书卷范围 / 主版本沿用侧边栏当前设置；没有打开侧边栏时用「三类全选 + 全书卷」。
    // opts.realtime：输入过程中的自动投影。静默、不抢焦点、不压历史；
    // opts.seq：本次请求的序号，异步回来时若已被更新的输入作废就丢弃结果。
    async projectQuery(query, opts) {
        const realtime = !!(opts && opts.realtime);
        const seq = (opts && typeof opts.seq === 'number') ? opts.seq : ++this._quickSearchSeq;
        const stale = () => realtime && seq !== this._quickSearchSeq;
        const notify = (msg) => { if (!realtime) new Notice(msg); };
        const q = String(query == null ? '' : query).trim();
        if (!q) { notify('请输入经文出处或关键词'); return; }
        const plugin = this.plugin;
        if (!plugin) return;
        try {
            if ((!plugin.searchEngine || !plugin.allItems || plugin.allItems.length === 0) && typeof plugin.loadBibleData === 'function') {
                await plugin.loadBibleData();
            }
            if (stale()) return;
            const engine = plugin.searchEngine;
            if (!engine || typeof engine.search !== 'function') { notify('经文数据尚未就绪，请稍后重试'); return; }
            const view = (typeof plugin.getVisibleSearchView === 'function') ? plugin.getVisibleSearchView() : null;
            let primaryKey = (view && typeof view.getPrimaryVersion === 'function') ? view.getPrimaryVersion() : null;
            if (!primaryKey && plugin.settings && Array.isArray(plugin.settings.versions)) {
                const pv = plugin.settings.versions.find(v => v.isPrimary && v.enabled && v.installed);
                if (pv) primaryKey = pv.key;
            }
            if (!primaryKey) { notify('未设置主版本，请先在「对照」里选择一个版本'); return; }

            let types = ['theme', 'outline', 'verse'];
            let rangeValue = 'all';
            let bookIds = [];
            let notesChecked = false;
            if (view && view.typeCheckboxes) {
                const picked = [];
                for (const k of ['theme', 'outline', 'verse']) {
                    if (view.typeCheckboxes[k] && view.typeCheckboxes[k].checked) picked.push(k);
                }
                if (picked.length) types = picked;
                notesChecked = !!(view.searchNotesCheckbox && view.searchNotesCheckbox.checked);
                if (notesChecked && !types.includes('verse')) types.push('verse');
                rangeValue = (typeof view.getRangeValue === 'function') ? view.getRangeValue() : 'all';
                if (view.selectedBookIds && typeof view.selectedBookIds.size === 'number' && view.selectedBookIds.size) {
                    bookIds = Array.from(view.selectedBookIds);
                }
            }
            // 注 / 串出处检索依赖注解数据，和侧边栏 performSearch 一样先确保数据到位
            if (plugin.settings && plugin.settings.showNotes) {
                if (typeof plugin.loadNotesData === 'function') await plugin.loadNotesData();
                if (stale()) return;
                if (typeof plugin.attachNotesToItems === 'function') plugin.attachNotesToItems();
            }
            if (typeof engine.setIncludeNotes === 'function') engine.setIncludeNotes(!!(plugin.settings && plugin.settings.showNotes && notesChecked));
            if (typeof engine.setNotesOnly === 'function') engine.setNotesOnly(false);

            const found = engine.search(q, types, rangeValue, bookIds, primaryKey) || [];
            // 实时输入的中间态常会查不到东西：静默保留上一版画面，不闪空白也不弹通知
            if (!found.length) { notify('没有找到匹配的内容：' + q); return; }
            if (stale()) return;
            const list = found.map((r, i) => {
                const src = (r && r.item) || {};
                let item = src;
                // 注 / 串出处结果在 search() 里是「经文 + noteText」，投影要显示注解正文本身
                if (r && r.isNote) {
                    const kind = r.noteKind === 'c' ? 'chain' : 'note';
                    item = Object.assign({}, src, {
                        type: kind,
                        content: r.noteText || '',
                        ref: (src.bookShortName || '') + src.chapter + ':' + src.verse +
                            (r.noteKind === 'c' ? ' 串' : ' 注') + (r.noteLabel || '')
                    });
                }
                return { item, selected: true, order: i + 1, sideBySide: false, _isCompare: false };
            });
            // 实时投影保持输入框焦点与补全下拉，让用户能接着打字 / 接着挑书卷；
            // 也不写历史栈（否则按 Z 会退回到一堆输入碎片）、不弹「已更新投影内容」。
            if (realtime) {
                this.reloadResults(list, this.mode, { quiet: true, noHistory: true });
                return;
            }
            if (this._projAbbr) this._projAbbr.close();
            this.reloadResults(list, this.mode);
            // 显式确认后把焦点交还投影容器，方向键 / QWE / 翻页立即恢复；想再搜按 / 或点顶部输入框
            try { if (this.quickSearchInput) this.quickSearchInput.blur(); } catch (err) { /* 忽略 */ }
            this.focusProjection(true);
        } catch (err) {
            console.warn('[Bible] 投影搜索失败:', err);
            notify('投影搜索失败，请稍后重试');
        }
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
            else if (action === 'toggle-desktop-full') this.toggleDesktopFullscreen();
        });

        bottomRow.querySelector('.bible-proj-prev').addEventListener('click', () => this.prevSlide());
        bottomRow.querySelector('.bible-proj-next').addEventListener('click', () => this.nextSlide());

        // 按键处理拆成两步：先判断投影是否要消费该按键，消费了就必须连同传播一起阻断。
        // 原因：Obsidian 的笔记本编辑器（Live Preview 用 CodeMirror 6）在自己的 DOM 上于「目标阶段」
        // 就接管按键并插入字符，document 冒泡阶段的 preventDefault 完全拦不住，所以监听必须注册在
        // 「捕获阶段」，赶在编辑器之前把事件截下来（否则按快捷键只会变成往笔记里打字）。
        const handleKey = (e) => {
            // 系统组合键（Ctrl+R / Cmd+W 等）一律放行，绝不能被投影拦截
            if (e.ctrlKey || e.metaKey || e.altKey) return false;
            const ae = document.activeElement;
            // 跨插件联动：Hymns 诗歌投影在前台时，键盘一律归对方（方向键、空格、Esc、
            // O/P、搜索框打字等），只有 Q/W/E 用来「切回经文投影」。
            // 不这么做的话，本投影虽被压在底下仍会吃掉按键去翻页 / 切模式 / 关投影，
            // 焦点守卫还会抢走诗歌投影搜索框的焦点，表现就是「按 QWE 切不回来」。
            if (isHymnsProjectionFront()) {
                const hk = String(e.key || '').toLowerCase();
                const switchBack = (hk === 'q' || hk === 'w' || hk === 'e') &&
                    !e.isComposing && e.keyCode !== 229;
                const inHymnsInput = !!(ae && ae.closest && ae.closest(
                    '.hymns-proj input, .hymns-proj textarea, .hymns-proj [contenteditable="true"]'));
                if (!switchBack || inHymnsInput) return false;
                this.switchBackFromHymns(hk);
                return true;
            }
            // 顶部常驻搜索框聚焦时，所有按键都归输入框与它自己的短拼补全：
            // 否则 csj / ss / mtfy 里的 s、q、w、e、c、r、t、z 会被当成投影快捷键，
            // 短拼根本输不进去；S 的侧边栏开关也在这条判断之后，必须在这里提前放行。
            // 退出输入态用输入框里的 Esc（blur + 焦点交还投影），再按 Esc 才关投影。
            if (ae && ae.closest && ae.closest('.bible-proj-quick-search')) return false;
            // 搜索框短拼补全下拉打开时，方向键 / Enter / Esc 与字母都归补全和输入框。
            // 本监听注册在 document 捕获阶段，会先于输入框执行；不在这里放行的话，
            // 全屏投影会把焦点抢走、分屏投影也可能消费掉方向键，补全就没法用。
            const abbrOpen = typeof document.querySelector === 'function' &&
                document.querySelector('.bible-abbr-suggestion.bible-abbr-open');
            if (abbrOpen && ae && ae.closest && ae.closest('.bible-search-input')) return false;
            const typingTarget = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
            // 投影是否「独占屏幕」：全屏覆盖层（含桌面全屏）为 true，标签页模式为 false。
            // 独占屏幕时按键全部归投影——iPad 等触屏设备上笔记处于编辑模式时，
            // contentEditable 会一直持有焦点，按键会被笔记本编辑器吃掉变成打字（还会唤起输入法）；
            // 标签页模式（投影只占一个标签）则不抢，用户可能正在旁边的笔记里正常打字。
            const ownsScreen = this.ownsScreen();
            const insideProjection = !!(ae && ae.closest && ae.closest('.bible-projection-fullscreen'));
            // 焦点落在任意弹窗 / 浮层（命令面板、快速切换、设置、右键菜单等）里时一律让位：
            // 否则在投影独占屏幕的状态下打开这些界面打字，按键会被投影当成快捷键截走——
            // 与「打字时按 a 触发注解」属于同一类问题。本插件投影内部的输入框不受影响。
            const inFloatingUi = !!(ae && ae.closest &&
                ae.closest('.modal-container, .suggestion-container, .prompt, .menu, .popover'));
            if (inFloatingUi && !insideProjection) {
                // 只保留逃生通道：在本插件自己的浮层里按 Esc 退出输入态、焦点回到投影
                if (typingTarget && e.key === 'Escape' &&
                    ae.closest('.bible-search-input, .bible-proj-search-box, .bible-inline-tooltip, .bible-tooltip-menu')) {
                    try { ae.blur(); } catch (err) { /* 忽略 */ }
                    this.focusProjection(true);
                    return true;
                }
                return false;
            }
            // 确定键：焦点不在顶部搜索框时把焦点交给它，方便直接输入出处投影。
            // 已在搜索框聚焦的情况上面已放行（Enter 走「确认投影 / 选补全候选」）；
            // 投影内其它输入框、浮层、投影内按钮也让行，保留各自的键盘行为。
            // 标签页 / 分屏模式（ownsScreen=false）不抢，侧边栏才是当时的操作对象。
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229 &&
                !inFloatingUi && ownsScreen && this.quickSearchInput) {
                const tag = ae && ae.tagName ? String(ae.tagName).toUpperCase() : '';
                const inProjInput = typingTarget && insideProjection;
                const inProjButton = tag === 'BUTTON' && insideProjection;
                if (!inProjInput && !inProjButton) {
                    this.focusQuickSearch();
                    return true;
                }
            }
            // S：投影「开关侧边栏」快捷键。放在输入框让行判断之前，保证侧边栏搜索框聚焦时也能用 S 收起侧边栏、恢复投影。
            // 仅在投影可操作时拦截，避免劫持笔记正文里的正常打字：① 独占全屏（ownsScreen）必拦；
            // ② 检索分屏 / 标签页态（isSearchMode）必拦（焦点常在侧边栏搜索框，需要 S 收回全屏）；
            // ③ 其余（焦点在笔记编辑器且投影未独占）不拦，S 照常打字。输入法合成态放行。
            if (!inFloatingUi && (e.key === 's' || e.key === 'S') && !e.isComposing && e.keyCode !== 229) {
                if (this.ownsScreen() || this.isSearchMode) {
                    this.toggleSearchMode();
                    return true;
                }
            }
            // 逃生通道：焦点卡在本插件的搜索框里时，按 Esc 只「退出输入态」而不是关闭投影，
            // 焦点回到投影后 S / D / Q / W / E / C / R / 方向键立即恢复可用（否则只能先用鼠标点一下投影）
            if (typingTarget && e.key === 'Escape') {
                if (ae.closest && ae.closest('.bible-search-input, .bible-proj-search-box, .bible-inline-tooltip, .bible-tooltip-menu')) {
                    try { ae.blur(); } catch (err) { /* 忽略 */ }
                    this.focusProjection(true);
                    return true;
                }
                // 焦点在笔记正文 / 其它输入框：Esc 照常作用于投影（先退桌面全屏，其次关闭投影）
            } else if (typingTarget) {
                // 标签页模式、或输入目标就在投影内部：让位给打字，避免误触；
                // 输入法合成态（isComposing / keyCode 229）也必须放行，否则中文 candidate 会被吃掉
                if (!ownsScreen || insideProjection || e.isComposing || e.keyCode === 229) return false;
                // 全屏投影：把焦点从笔记编辑器抢回投影，之后按键归投影
                this.focusProjection(true);
            }
            // 焦点落在投影内的按钮上（非输入框）时，空格/回车会被按钮吞掉导致无法翻页，先交回投影
            if (ae && ae.tagName === 'BUTTON' && ae.closest && ae.closest('.bible-projection-fullscreen, .bible-proj-fullscreen') && (e.key === ' ' || e.key === 'Enter')) {
                ae.blur();
            }
            // 检索分屏 / 标签页模式下，投影只占一侧或独立标签，主视图侧边栏才是当前操作对象。
            // 直接把方向键 / 空格 / 选择类动作键委派给主视图的键盘导航方法（含选框移动、Y/I 切换、
            // 空格选中），无论焦点此时落在投影还是搜索框都能操控侧边栏；反过来，焦点在搜索输入框里时
            // 这些字母 / 空格要能正常打字，故输入框聚焦时不拦截（交给主视图 onKeyDown 同样的让行规则）。
            // 否则这些键会被投影吃掉翻页，或主视图因 hasBlockingOverlay 提前 return 而全哑。
            if (this.isSearchMode && !this.getFullscreenElement()) {
                const ae2 = document.activeElement;
                const inInput = !!(ae2 && ae2.tagName &&
                    (ae2.tagName === 'INPUT' || ae2.tagName === 'TEXTAREA' || ae2.isContentEditable));
                // 分屏 / 标签页态同样用 / 聚焦顶部快速搜索框（此时方向键归侧边栏，需单独放行）
                if (e.key === '/' && !inInput && !e.shiftKey) { this.focusQuickSearch(); return true; }
                const v = (this.plugin && typeof this.plugin.getVisibleSearchView === 'function')
                    ? this.plugin.getVisibleSearchView() : null;
                if (v && typeof v.moveKeyboardCursor === 'function' && !inInput) {
                    const k = e.key;
                    const lk = typeof k === 'string' ? k.toLowerCase() : '';
                    if (k === 'ArrowDown') { v.moveKeyboardCursor(1); return true; }
                    if (k === 'ArrowUp') { v.moveKeyboardCursor(-1); return true; }
                    if (k === 'ArrowLeft') { v.swipePrev(); return true; }
                    if (k === 'ArrowRight') { v.swipeNext(); return true; }
                    if (k === ' ' || k === 'Spacebar') { v.keyboardToggleSelection(); return true; }
                    if (lk === 'x') { v.keyboardSelectAllPage(); return true; }
                    if (lk === 'i') { v.keyboardToggleFocusMode(); return true; }
                    if (lk === 'y') { v.keyboardSwitchTab(); return true; }
                    if (lk === 'u') { v.keyboardToggleCompare(); return true; }
                    if (lk === 'b') { v.keyboardToggleSide(); return true; }
                    if (lk === 'c') { v.keyboardClearAll(); return true; }
                }
                // 输入框里或拿不到视图：方向键 / 字母放行，不拦截打字；不消费事件
                return false;
            }
            // 投影内容较长、超出可视区时，上 / 下方向键滚动内容（仅独占全屏、未开检索时生效）；
            // 滚到顶 / 底或内容无需滚动则交给下方翻页逻辑
            if (e.key === 'ArrowDown') { if (this.scrollProjectionContent(1)) return true; }
            if (e.key === 'ArrowUp') { if (this.scrollProjectionContent(-1)) return true; }
            if (e.key === 'ArrowRight' || e.key === ' ') this.nextSlide();
            else if (e.key === 'ArrowLeft') this.prevSlide();
            else if (e.key === 'Escape') {
                // 处于桌面全屏时，ESC 先退出全屏（浏览器也会自行退出），不能顺带把投影关掉
                if (this.getFullscreenElement()) { this.exitDesktopFullscreen(); return true; }
                if (Date.now() - (this._lastFullscreenExitAt || 0) < 800) return true;
                this.close();
            }
            else if (e.key === '+' || e.key === '=') { this.fontSize += 4; this.updateFontSize(); }
            else if (e.key === '-') { this.fontSize = Math.max(16, this.fontSize - 4); this.updateFontSize(); }
            else if (e.key === 't' || e.key === 'T') this.toggleTheme();
            else if (e.key === 's' || e.key === 'S') this.toggleSearchMode();
            // 全屏投影改用 D；O / P 让行给 Hymns 插件的投影快捷键（见文件顶部的跨插件联动说明）
            else if (e.key === 'd' || e.key === 'D') this.toggleDesktopFullscreen();
            else if (e.key === 'c' || e.key === 'C') this.toggleCentered();
            else if (e.key === 'r' || e.key === 'R') { this.fontSize = 48; this.updateFontSize(); }
            else if (e.key === 'z' || e.key === 'Z') this.goBackProjection();
            else if (e.key === '/' && !e.shiftKey) this.focusQuickSearch();
            else if (e.key === 'q' || e.key === 'Q' || e.key === 'w' || e.key === 'W' || e.key === 'e' || e.key === 'E') {
                // 已经处在投影里（投影独占屏幕）时，Q/W/E 就是切换排版模式：直接在这里切并阻断传播。
                // 原先这里刻意不消费事件，交给插件级监听统一分派，但那条路径在「侧边栏插件界面可见 /
                // 投影处于分屏搜索态」等情况下会先命中「点击界面上的投影按钮」分支，表现出来就是
                // 按 QWE 没反应（或只是重投影一次）。投影独占屏幕时用户的意图必然是切模式，
                // 因此这里自行处理；返回 true 让外层阻断传播，避免两层监听各执行一次。
                if (ownsScreen && !(this.plugin && this.plugin.currentTooltipProjector)) {
                    const map = { q: 'focus', w: 'parallel', e: 'mixed' };
                    const next = map[String(e.key).toLowerCase()];
                    if (next) {
                        // 同键切换为关闭：投影已处在该模式时，再按对应键关闭投影
                        if (next === this.mode) this.close();
                        else this.setMode(next);
                    }
                    return true;
                }
                return false;
            }
            else return false;
            return true;
        };
        this.keyHandler = (e) => {
            if (!handleKey(e)) return;
            // 投影已消费该按键：阻断后续传播，否则会被笔记本编辑器写进正文，
            // 或让插件的全局 Q/W/E 监听重复执行一次
            try { e.preventDefault(); e.stopPropagation(); } catch (err) { /* 忽略 */ }
        };
        // 捕获阶段注册（务必保持 true），否则拦不住 CodeMirror 6 的输入处理
        document.addEventListener('keydown', this.keyHandler, true);
        // 备选保险：触屏输入法 / IME 有时会绕过 keydown 直接产生 beforeinput。
        // 独占屏幕时统一拦下笔记区域的输入，杜绝字迹被写进正文
        this._beforeInputHandler = (e) => {
            // Hymns 投影在前台时让行，否则它搜索框里的输入会被这里拦掉
            if (!this.ownsScreen() || isHymnsProjectionFront()) return;
            const t = e && e.target;
            if (t && t.closest && t.closest('.bible-projection-fullscreen')) return;
            try { e.preventDefault(); e.stopPropagation(); } catch (err) { /* 忽略 */ }
            this.focusProjection(true);
        };
        document.addEventListener('beforeinput', this._beforeInputHandler, true);
        // 焦点守卫：投影独占屏幕时，任何把焦点移向笔记编辑器 / 输入框的行为立刻拉回投影。
        // 典型场景：从标签页按 S 切回全屏时，detach 标签页会让 Obsidian 把焦点交还给上一个活动编辑区，
        // contentEditable 只要一拿到焦点就会唤起输入法（iPad 直接弹软键盘），下一次按键即写进笔记正文。
        // 单靠 setTimeout 抢焦点抢不过 Obsidian 的异步重聚焦，故改为事件级拦截。
        this._focusGuard = (e) => {
            // Hymns 投影在前台时让行：否则它 open() 里 el.focus() / 搜索框聚焦都会被抢回本投影
            if (!this.ownsScreen() || isHymnsProjectionFront() || this._focusGuarding) return;
            const t = e && e.target;
            if (t && t.closest && t.closest('.bible-projection-fullscreen')) return;
            this._focusGuarding = true;
            try { this.focusProjection(true); } finally { this._focusGuarding = false; }
        };
        document.addEventListener('focusin', this._focusGuard, true);
        // 监听全屏状态变化，同步按钮高亮；离开全屏时记时间戳，避免 ESC 顺带关闭投影
        this._fsChangeHandler = () => {
            if (!this.getFullscreenElement()) this._lastFullscreenExitAt = Date.now();
            this.updateDesktopBtn();
        };
        document.addEventListener('fullscreenchange', this._fsChangeHandler);
        document.addEventListener('webkitfullscreenchange', this._fsChangeHandler);

        // 点击 / 触摸投影区域时把键盘焦点收回投影，保证快捷键随手可用
        this.contentArea.addEventListener('pointerdown', (e) => {
            const t = e && e.target;
            if (t && t.closest && t.closest('input, textarea, [contenteditable="true"]')) return;
            this.focusProjection(true);
        });

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
            // 允许「不选中任何经文」直接开投影，这时用空态引导用户使用顶部常驻搜索框
            const emptyPageNum = this.overlay && this.overlay.querySelector('.bible-proj-page-num');
            if (emptyPageNum) emptyPageNum.textContent = '0/0页';
            const box = this.contentArea.createEl('div', { cls: 'bible-proj-empty' });
            box.createEl('div', { cls: 'bible-proj-empty-title', text: '还没有投影内容' });
            box.createEl('div', { cls: 'bible-proj-empty-hint', text: '在上方搜索框输入经文出处，内容会自动投影' });
            box.createEl('div', { cls: 'bible-proj-empty-eg', text: '例如：太1 · 太1-3 · csj1:1 · 恩典 · 创1:26注2' });
            return;
        }

        const slide = this.slides[this.currentSlide];
        const pageNumEl = this.overlay.querySelector('.bible-proj-page-num');
        if (pageNumEl) pageNumEl.textContent = (this.currentSlide + 1) + '/' + this.slides.length + '页';

        const wrapper = document.createElement('div');
        wrapper.className = 'bible-proj-slide-wrapper';
        // 宽度/最大宽度交给 CSS（min(900px, 92%)），侧边栏模式与全屏模式都能自适应
        wrapper.style.cssText = 'text-align:center;padding:20px;margin:auto;overflow-y:auto;max-height:100%;';
        // 宽度/最大宽度交给 CSS：跟随窗口宽度（94%、不固定上限），放大窗口或放大字体时投影区域随之变宽，避免经文换行

        if (this.mode === 'focus') {
            // 逐节模式同样支持居中切换（参照并列/混合模式）：居中时文字居中，否则左对齐
            wrapper.style.textAlign = this.isCentered ? 'center' : 'left';
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
                    // 经文、注解 / 串珠都显示出處（主题 / 纲目仅在开启「显示出处」时显示）
                    const shouldShowRef = this.showSource || item.type === 'verse' || item.type === 'note' || item.type === 'chain';
                    if (shouldShowRef) {
                        const refDiv = wrapper.createEl('div', { cls: 'bible-proj-ref bible-proj-focus-ref', text: this.getItemRef(item) });
                        refDiv.style.marginBottom = '20px';
                        if (item.type === 'theme') refDiv.classList.add('bible-proj-focus-theme-ref');
                        else if (item.type === 'outline') refDiv.classList.add('bible-proj-focus-outline-ref');
                    }
                    const fDelta = this.projTypeDelta(item);
                    const fpx = this.fontSize + fDelta;
                    const textDiv = wrapper.createEl('div', { cls: 'bible-proj-text bible-proj-focus-text' });
                    textDiv.style.lineHeight = '1.8';
                    textDiv.dataset.projDelta = String(fDelta);
                    textDiv.style.fontSize = fpx + 'px';
                    if (item.type === 'theme') textDiv.classList.add('bible-proj-focus-theme');
                    else if (item.type === 'outline') textDiv.classList.add('bible-proj-focus-outline');
                    if (item.type === 'verse') this.fillProjVerseText(wrapper, textDiv, item, fpx, 1);
                    else this.fillProjItemText(textDiv, item);
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
                    
                    const mDelta = this.projTypeDelta(item);
                    const mpx = this.fontSize + mDelta;
                    const textDiv = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-mixed-text' });
                    textDiv.dataset.projDelta = String(mDelta);
                    textDiv.style.cssText = 'line-height:1.8;font-size:' + mpx + 'px;';
                    
                    itemEl.appendChild(refDiv);
                    itemEl.appendChild(textDiv);
                    if (item.type === 'verse') this.fillProjVerseText(itemEl, textDiv, item, mpx, 1);
                    else this.fillProjItemText(textDiv, item);
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
                        pText.dataset.projDelta = String(this.projTypeDelta(item));
                        pText.style.fontSize = (this.fontSize * 0.7 + this.projTypeDelta(item)) + 'px';
                        pText.style.opacity = '0.7';
                    } else {
                        const shouldShowRef = this.showSource || item.type === 'verse' || item.type === 'note' || item.type === 'chain';
                        if (shouldShowRef) {
                            const pRef = itemEl.createEl('div', { cls: 'bible-proj-ref bible-proj-parallel-ref', text: this.getItemRef(item) });
                            pRef.style.marginBottom = '8px';
                            pRef.style.fontWeight = '600';
                        }
                        const pDelta = this.projTypeDelta(item);
                        const ppx = this.fontSize * 0.85 + pDelta;
                        const pText = itemEl.createEl('div', { cls: 'bible-proj-text bible-proj-parallel-text' });
                        pText.style.lineHeight = '1.7';
                        if (item.type === 'theme') pText.classList.add('bible-proj-parallel-theme-text');
                        else if (item.type === 'outline') pText.classList.add('bible-proj-parallel-outline-text');
                        pText.dataset.projDelta = String(pDelta);
                        pText.style.fontSize = ppx + 'px';
                        if (item.type === 'verse') this.fillProjVerseText(itemEl, pText, item, ppx, 0.85);
                        else this.fillProjItemText(pText, item);
                    }
                    wrapper.appendChild(itemEl);
                }
            }
        }

        this.contentArea.appendChild(wrapper);
        this.updateFontSize();
        // 同步居中按钮高亮状态（应对内容原地更新导致模式切换的情形）
        const cb = this.overlay && this.overlay.querySelector('[data-action="toggle-centered"]');
        if (cb) cb.classList.toggle('active', this.isCentered);
    }

    updateFontSize() {
        const fontSizeEl = this.overlay.querySelector('.bible-proj-font-size');
        if (fontSizeEl) fontSizeEl.textContent = this.fontSize + 'px';
        this.overlay.querySelectorAll('.bible-proj-focus-text').forEach(el => { el.style.fontSize = (this.fontSize + (parseInt(el.dataset.projDelta || '0', 10))) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-ref').forEach(el => {
            el.style.fontSize = (this.fontSize * 0.6) + 'px';
            // 主题/纲目引用的颜色由 CSS 控制（.bible-proj-focus-theme-ref / -outline-ref），不在此覆盖
            if (!el.classList.contains('bible-proj-focus-theme-ref') && !el.classList.contains('bible-proj-focus-outline-ref')) {
                el.style.color = this.isDark ? '#a0a0a0' : '#666';
            }
        });
        this.overlay.querySelectorAll('.bible-proj-parallel-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85 + (parseInt(el.dataset.projDelta || '0', 10))) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-ref').forEach(el => {
            el.style.fontSize = (this.fontSize * 0.55) + 'px';
            // 主题/纲目引用（对照版）的颜色由 CSS 控制，不在此覆盖
            if (!el.classList.contains('bible-proj-parallel-theme-ref') && !el.classList.contains('bible-proj-parallel-outline-ref')) {
                el.style.color = this.isDark ? '#a0a0a0' : '#666';
            }
        });
        this.overlay.querySelectorAll('.bible-proj-focus-theme').forEach(el => { el.style.fontSize = (this.fontSize * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-theme-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-focus-outline-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.6) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-parallel-theme-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.85 * 1.15) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-compare-text').forEach(el => { el.style.fontSize = (this.fontSize * 0.75 + (parseInt(el.dataset.projDelta || '0', 10))) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-compare-ref').forEach(el => { el.style.fontSize = (this.fontSize * 0.5) + 'px'; });
        this.overlay.querySelectorAll('.bible-proj-mixed-text').forEach(el => { el.style.fontSize = (this.fontSize + (parseInt(el.dataset.projDelta || '0', 10))) + 'px'; });
        // 投影里展开的注解 / 串珠：字号跟随所在经文（同一系数与微调量）
        this.overlay.querySelectorAll('.bible-proj-notes').forEach(el => {
            const d = parseInt(el.dataset.projDelta || '0', 10);
            const s = parseFloat(el.dataset.projFontScale || '1');
            el.style.fontSize = (this.fontSize * s + d) + 'px';
        });
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
        if (item.type === 'note' || item.type === 'chain') return item.ref || '';
        return item.bookShortName + item.chapter + ':' + item.verse + (item.part || '');
    }

    getItemContent(item) {
        if (item._isCompare) return item.content;
        if (item.type === 'theme') return '主题：' + item.content;
        if (item.type === 'outline') return item.content;
        if (item.type === 'note' || item.type === 'chain') return item.content || '';
        return item.content;
    }

    // 投影里作为独立项显示的注解 / 串珠：按段落呈现，段与段之间留一个空行，
    // 并加左侧色条 + 淡底，避免和被投影的经文正文混淆
    fillProjItemText(textDiv, item) {
        if (item.type !== 'note' && item.type !== 'chain') {
            textDiv.setText(this.getItemContent(item));
            return;
        }
        textDiv.classList.add('bible-proj-item-' + item.type);
        const paras = String(item.content || '').split(/\n+/).map(t => t.trim()).filter(t => t.length > 0);
        if (!paras.length) { textDiv.setText(''); return; }
        for (const p of paras) textDiv.createDiv({ cls: 'bible-proj-text-para', text: p });
    }

    // 投影默认字号微调：经文 +1、纲目 -6、主题不变，点 +/− 时整体缩放仍在此基础上生效
    projTypeDelta(item) {
        if (!item) return 0;
        if (item.type === 'verse') return 1;
        if (item.type === 'outline') return -6;
        return 0;
    }

    // 经文投影：正文里嵌入注 / 串上标，点击上标展开对应的注解或串珠（展开面板字号与经文一致）
    // scale：该处经文的字号系数（逐节 / 混合 = 1，并列 = 0.85）
    fillProjVerseText(container, textDiv, item, fontPx, scale) {
        const content = this.getItemContent(item);
        const plugin = this.plugin;
        const nd = (plugin && plugin.settings && plugin.settings.showNotes && plugin.notesData && item.type === 'verse')
            ? plugin.getVerseNotes(item.bookId, item.chapter, item.verse, item.part)
            : null;
        if (!nd || !nd.m || !nd.m.length) { textDiv.setText(content); return; }
        const pk = plugin.getPrimaryVersionKey ? plugin.getPrimaryVersionKey() : null;
        const panel = document.createElement('div');
        panel.className = 'bible-proj-notes';
        panel.style.display = 'none';
        panel.style.fontSize = fontPx + 'px';
        panel.style.cursor = 'pointer';
        panel.dataset.projDelta = textDiv.dataset.projDelta || '0';
        panel.dataset.projFontScale = String(scale || 1);
        // 点击已展开的注解 / 串珠面板：若用户只是在面板内拖选文字（已产生选区），则不收起，
        // 便于选中注解 / 串珠正文后复制；只有「无选区的普通点击」才视为收起（与「再点上标」「点经文正文」同为关闭方式）
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
            const sel = (typeof window !== 'undefined' && window.getSelection) ? window.getSelection() : null;
            if (sel && sel.toString().trim().length > 0) return; // 正在选字，不关闭
            this.closeProjNotePanels();
        });
        const show = (kind, label) => {
            const key = kind + ':' + label;
            if (panel.style.display === 'block' && panel.getAttribute('data-note-key') === key) {
                // 再点同一个上标＝收起
                this.closeProjNotePanels();
                return;
            }
            // 同一时刻只展开一个：展开新的自动收起旧的（旧面板可能属于同一页上的另一节经文）
            this.closeProjNotePanels(panel);
            // 在展开前记下当前滚动位置：注解 / 串珠往往很长需要滚动查看，
            // 关闭后按这个位置还原，避免画面跳走、要重新找之前的经文位置
            this._saveProjNoteScroll();
            this.fillProjNotePanel(panel, nd, kind, label, pk, { bookId: item.bookId, chapter: item.chapter }, 0);
            panel.setAttribute('data-note-key', key);
            panel.style.display = 'block';
        };
        plugin.renderTextWithMarkers(textDiv, content, nd.m, show);
        container.appendChild(panel);
    }

    // 收起投影里已展开的注解 / 串珠面板；exceptPanel 传入时保留它（用于「展开新的自动收起旧的」）
    closeProjNotePanels(exceptPanel) {
        if (!this.overlay) return;
        let closed = false;
        this.overlay.querySelectorAll('.bible-proj-notes').forEach(p => {
            if (exceptPanel && p === exceptPanel) return;
            if (p.style.display === 'block') { p.style.display = 'none'; closed = true; }
        });
        // 关闭面板后内容高度回缩，把滚动位置还原到展开前的位置，避免画面跳走
        if (closed) this._restoreProjNoteScroll();
    }

    // 记录当前投影幻灯片的滚动位置（展开注解 / 串珠前调用）
    _saveProjNoteScroll() {
        const els = this._getProjScrollContainers();
        if (els) this._projNoteScroll = els.map(el => ({ el, top: el.scrollTop }));
    }

    // 把滚动位置还原到展开注解 / 串珠前的位置（关闭面板后调用）
    _restoreProjNoteScroll() {
        if (!this._projNoteScroll) return;
        for (const s of this._projNoteScroll) {
            try { s.el.scrollTop = s.top; } catch (e) { /* 元素已不存在时忽略 */ }
        }
    }

    // 投影幻灯片里真正发生滚动的容器：slide wrapper（带 overflow-y:auto; max-height:100%），
    // 以及外层 contentArea，两者一并记下、关闭时一并还原
    _getProjScrollContainers() {
        const list = [];
        const wrapper = this.contentArea && this.contentArea.querySelector('.bible-proj-slide-wrapper');
        if (wrapper) list.push(wrapper);
        if (this.contentArea && list.indexOf(this.contentArea) === -1) list.push(this.contentArea);
        return list.length ? list : null;
    }

    // 投影里展开的注解 / 串珠内容（字号由外层面板统一控制，与经文一致）
    // 与经文的关系：上方一条分割线隔开 + 淡背景 + 左侧重点色条 + 类型徽标，
    // 观感上明确是「附注内容」而不是经文正文；正文按段落分块，段落之间留出一个空行
    // ctx：{ bookId, chapter } —— 该注 / 串所属经文的书卷与章，供注文里「承上省略」的出处识别使用
    // depth：串珠经文里再展开注 / 串的层级（各级均保留 ¹ ᵃ 上标，可继续向下钻取，无限嵌套由每节只保留一个子面板兜底）
    fillProjNotePanel(panel, nd, kind, label, pk, ctx, depth) {
        panel.empty();
        // 顶部收起按钮：面板内部已改为「选字时不关闭」，这里给一个显式的收起入口
        const dismiss = panel.createDiv({ cls: 'bible-proj-note-dismiss', text: '✕ 收起' });
        dismiss.addEventListener('click', (e) => {
            e.stopPropagation();
            // 子面板（嵌在串珠被引经文里）只收起自身，不要连带关掉外层主 串珠 面板
            if ((depth || 0) > 0) panel.style.display = 'none';
            else this.closeProjNotePanels();
        });
        const paras = (text) => String(text || '').split(/\n+/).map(t => t.trim()).filter(t => t.length > 0);
        const addLabel = (row, kindLabel, kindCls, title) => {
            const chip = row.createEl('span', { cls: 'bible-proj-note-label ' + kindCls, text: kindLabel });
            chip.title = title;
            return chip;
        };
        if (kind === 'n') {
            for (const n of (nd.n || []).filter(x => x[0] === label)) {
                const row = panel.createDiv({ cls: 'bible-proj-note bible-proj-note-kind-note' });
                const head = row.createDiv({ cls: 'bible-proj-note-head' });
                addLabel(head, '注 ' + n[0], 'bible-proj-note-label-note', '恢复本注解');
                const body = row.createDiv({ cls: 'bible-proj-note-body' });
                const canLink = !!(this.plugin && typeof this.plugin.linkifyBibleRefs === 'function');
                for (const p of paras(n[1])) {
                    const el = body.createDiv({ cls: 'bible-proj-note-para' });
                    // 注解正文里提到的经文出处也识别为可点击引用
                    if (canLink) this.plugin.linkifyBibleRefs(el, p, ctx);
                    else el.setText(p);
                }
            }
            return;
        }
        for (const r of (nd.r || []).filter(x => x[0] === label)) {
            const row = panel.createDiv({ cls: 'bible-proj-note bible-proj-note-kind-ref' });
            const head = row.createDiv({ cls: 'bible-proj-note-head' });
            addLabel(head, '串珠 ' + r[0], 'bible-proj-note-label-ref', '恢复本串珠');
            head.createEl('span', { cls: 'bible-proj-note-refs', text: r[1] });
            const body = row.createDiv({ cls: 'bible-proj-note-body' });
            for (const v of this.plugin.getChainReferencedVerses(r, pk)) {
                const vr = body.createDiv({ cls: 'bible-proj-note-ref-verse' });
                // 串珠引用的经文出处：点击在弹窗里查看该节、双击跳转到圣经阅读页
                // （与阅读页 / 经文弹窗里的串珠出处同一套交互；之前这里只渲染了文字却没绑事件，点了毫无反应）
                const addr = vr.createEl('span', {
                    cls: 'bible-proj-note-ref-addr',
                    text: v.bookShortName + v.chapter + ':' + v.verse + (v.part || '')
                });
                addr.title = '点击在弹窗中查看该节，双击跳转到圣经阅读页';
                const tvMatch = {
                    bookId: v.bookId,
                    bookShortName: v.bookShortName,
                    allRefs: [{ chapter: v.chapter, verse: v.verse, verseEnd: null, suffix: null, endChapter: null, endVerse: null }]
                };
                addr.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.detail > 1) return;   // 双击的第二下交给 dblclick 去跳转
                    if (this.plugin && this.plugin.toggleTooltipFromElement) this.plugin.toggleTooltipFromElement(addr, tvMatch);
                });
                addr.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.plugin && this.plugin.jumpToBibleReader) this.plugin.jumpToBibleReader(tvMatch);
                });
                vr.appendChild(document.createTextNode(' '));
                const vt = vr.createEl('span', { cls: 'bible-proj-note-ref-text' });
                // 串珠引用的经文同样带 ¹ ᵃ 上标，点击在该节下方展开对应注解 / 串珠。
                // 各级（含嵌套串珠）都保留标注，可继续向下钻取；每个被引经文行只保留一个子面板，
                // 不会出现无限叠加 DOM，故不限制层级。
                if (typeof this.plugin.renderVerseTextWithMarkers === 'function') {
                    this.plugin.renderVerseTextWithMarkers(vt, v, (k2, l2) => this.toggleProjNoteSubPanel(vr, v, k2, l2, pk, depth));
                } else {
                    vt.setText(v.content);
                }
            }
        }
    }

    // 投影里串珠引用的经文：点注 / 串上标，在该节经文行下方展开 / 收起对应的注解或串珠。
    // 复用 .bible-proj-notes 面板，因此仍遵守「同一时刻只展开一个」「选字时不收起」的既有约定
    toggleProjNoteSubPanel(vr, item, kind, label, pk, depth) {
        const key = kind + ':' + label;
        let p = Array.from(vr.children).find(c => c.classList && c.classList.contains('bible-proj-notes'));
        if (p && p.style.display === 'block' && p.getAttribute('data-note-key') === key) {
            p.style.display = 'none';
            return;
        }
        if (!p) {
            p = document.createElement('div');
            p.className = 'bible-proj-notes';
            p.style.cursor = 'pointer';
            p.addEventListener('click', (e) => {
                e.stopPropagation();
                const sel = (typeof window !== 'undefined' && window.getSelection) ? window.getSelection() : null;
                if (sel && sel.toString().trim().length > 0) return;  // 正在选字，不收起
                p.style.display = 'none';
            });
            vr.appendChild(p);
        }
        this._saveProjNoteScroll();
        const nd = this.plugin ? this.plugin.getVerseNotes(item.bookId, item.chapter, item.verse, item.part) : null;
        this.fillProjNotePanel(p, nd, kind, label, pk, { bookId: item.bookId, chapter: item.chapter }, (depth || 0) + 1);
        p.setAttribute('data-note-key', key);
        p.style.display = 'block';
    }

    close() {
        // 幂等保护：detach 宿主标签页会再次触发 BibleProjectionView.onClose → close()，防止重复清理
        if (this._closed) return;
        this._closed = true;
        // 取消尚未触发的实时投影，并让进行中的异步检索作废，避免关掉投影后又刷新画面
        this.invalidateQuickSearch();
        // 顶部搜索框的补全下拉挂在 body 上，不随 overlay 一起移除，必须单独销毁
        if (this._projAbbr && typeof this._projAbbr.destroy === 'function') {
            try { this._projAbbr.destroy(); } catch (e) { /* 忽略 */ }
            this._projAbbr = null;
        }
        this.quickSearchInput = null;
        this.unwatchSidebar();
        // 处于桌面全屏时先退出全屏（否则关闭投影后 Obsidian 会一直停在全屏状态）
        if (this.getFullscreenElement && this.getFullscreenElement()) this.exitDesktopFullscreen();
        if (this._fsChangeHandler) {
            document.removeEventListener('fullscreenchange', this._fsChangeHandler);
            document.removeEventListener('webkitfullscreenchange', this._fsChangeHandler);
            this._fsChangeHandler = null;
        }
        // 标签页模式：直接关掉宿主标签页即可（避免先把覆盖层搬回全屏再移除造成闪一下）
        if (this.projectionLeaf) {
            const leaf = this.projectionLeaf;
            this.projectionLeaf = null;
            try { leaf.detach(); } catch (e) { /* 忽略 */ }
        }
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        // 注意：removeEventListener 的 capture 必须与注册时一致，否则监听残留会导致关闭后快捷键仍生效
        document.removeEventListener('keydown', this.keyHandler, true);
        if (this._beforeInputHandler) {
            document.removeEventListener('beforeinput', this._beforeInputHandler, true);
            this._beforeInputHandler = null;
        }
        if (this._focusGuard) {
            document.removeEventListener('focusin', this._focusGuard, true);
            this._focusGuard = null;
        }
        if (this.plugin && this.plugin.currentProjection === this) this.plugin.currentProjection = null;
        // 关闭投影后把键盘焦点交还主视图（圣经检索 / 阅读）：投影是 document 级捕获监听，
        // 主视图的快捷键（I / Y / X / U / 方向键 / 空格）挂在视图容器上，焦点若不交还就会全哑。
        try {
            if (this.plugin && typeof this.plugin.getVisibleSearchView === 'function') {
                const v = this.plugin.getVisibleSearchView();
                if (v && typeof v.restoreViewFocus === 'function') v.restoreViewFocus();
            }
        } catch (err) { /* 忽略 */ }
    }

    // ===== 投影内打开检索窗口（不关闭投影）=====
    // 不再缩成左下角小窗：投影区保持全高、只把宽度收窄，右侧正好空出侧边栏显示圣经检索；
    // 在侧边栏里改选经文后点投影，内容原地更新（不再来回放大缩小），点「⛶ 全屏」才恢复全屏。
    // 从 Hymns 诗歌投影切回经文投影：请对方收起（含退出浏览器整屏），再把自己提回前台，
    // 并切到用户按下的模式。对方退出整屏 / onClose 交还焦点都是异步的，故同步 + rAF +
    // 延时各抢一次焦点；若用户已经回到投影顶部搜索框打字，则不再抢，避免打断输入。
    switchBackFromHymns(key) {
        const map = { q: 'focus', w: 'parallel', e: 'mixed' };
        const next = map[key] || null;
        requestHymnsProjectionClose();
        // 经文投影已切成标签页时，还要把那个标签调回前台：
        // 切去诗歌投影之前用户可能停在 Hymns / 笔记标签，只抢焦点仍看不到经文投影。
        if (this.projectionLeaf && this.plugin && typeof this.plugin.revealProjectionTab === 'function') {
            this.plugin.revealProjectionTab(this);
        }
        const bringToFront = () => {
            if (!this.overlay) return;
            if (next && this.mode !== next) this.setMode(next);
            const ae = document.activeElement;
            if (ae && ae.closest && ae.closest('.bible-proj-quick-search, .bible-proj-search-box')) return;
            this.focusProjection(true);
        };
        bringToFront();
        try {
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(bringToFront);
        } catch (err) { /* 忽略 */ }
        try { setTimeout(bringToFront, 150); } catch (err) { /* 忽略 */ }
    }

    // 投影是否「独占屏幕」：全屏覆盖层，或已扩展到桌面全屏。
    // 此时整个屏幕都是投影，键盘应当归投影；标签页模式（投影只占一个标签）则不是。
    ownsScreen() {
        if (this.projectionLeaf) return !!this.getFullscreenElement();
        // 非标签页却处于检索模式＝走「投影收窄让出侧边栏」的回退路径，
        // 此时侧边栏搜索框是可见可打字的，键盘不能全给投影
        if (this.isSearchMode) return !!this.getFullscreenElement();
        return true;
    }

    // 把键盘焦点收回到投影本身：先让输入框失焦，再聚焦投影容器（tabindex=-1），
    // 这样 S / D / Q / W / E / C / R / 方向键等快捷键不必先用鼠标或触屏点一下投影就能生效。
    // force=true 用于「刚打开 / 刚从标签页切回全屏」这类必须对抗 Obsidian 自动重聚焦的场景；
    // 默认只在投影「独占屏幕」时抢，标签页模式下不能抢——用户可能正要在侧边栏搜索框里打字。
    focusProjection(force) {
        if (!force && !this.ownsScreen()) return;
        try {
            const ae = document.activeElement;
            if (ae && ae !== document.body && typeof ae.blur === 'function') ae.blur();
        } catch (e) { /* 忽略 */ }
        const el = this.overlay;
        if (!el) return;
        try {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
            el.focus({ preventScroll: true });
        } catch (e) { /* 忽略 */ }
    }

    // 投影内容较长、超出可视区时，上 / 下方向键滚动内容（每次约 15% 视高，最少 40px）。
    // 真正可滚动的是 contentArea 内部的 .bible-proj-slide-wrapper（带 overflow-y:auto），
    // 而不是 contentArea 本身（它只做 flex 容器、不溢出），所以必须滚 wrapper，否则方向键点了没反应。
    // 返回是否真的滚动了：到边界或内容无需滚动时返回 false，让调用方改走翻页逻辑。
    scrollProjectionContent(dir) {
        const area = this.contentArea;
        if (!area) return false;
        const el = area.querySelector('.bible-proj-slide-wrapper') || area;
        if (!el || typeof el.scrollTop !== 'number' || typeof el.scrollHeight !== 'number') return false;
        const canScroll = el.scrollHeight > el.clientHeight + 2;
        if (!canScroll) return false;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        const atTop = el.scrollTop <= 0;
        if (dir > 0 && atBottom) return false;   // 已到底，交给下一页
        if (dir < 0 && atTop) return false;      // 已到顶，交给上一页
        const step = Math.max(40, Math.round((el.clientHeight || 600) * 0.15));
        el.scrollTop += dir * step;
        return true;
    }

    toggleSearchMode() {
        if (this.isSearchMode) this.exitSearchMode();
        else this.enterSearchMode();
        this.updateSearchBtn();
    }

    // ===== 桌面全屏：超出 Obsidian 窗口，铺满整个显示器 =====
    // 插件拿不到 Electron 的窗口 API，因此使用 HTML5 Fullscreen API 对投影层本身调用 requestFullscreen
    getFullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    toggleDesktopFullscreen() {
        try {
            if (this.getFullscreenElement()) { this.exitDesktopFullscreen(); return; }
            const el = this.overlay || document.documentElement;
            const fn = el && (el.requestFullscreen || el.webkitRequestFullscreen);
            if (!fn) { new Notice('当前环境不支持全屏投影'); return; }
            const p = fn.call(el);
            if (p && typeof p.catch === 'function') {
                p.catch(err => console.warn('[Bible] 进入全屏投影失败:', err));
            }
            this.updateDesktopBtn();
            new Notice('已进入全屏投影；再按 D 退出全屏投影');
        } catch (e) {
            console.warn('[Bible] 全屏投影切换失败:', e);
            new Notice('全屏投影切换失败，请确认是在桌面版 Obsidian 中使用');
        }
    }

    exitDesktopFullscreen() {
        try {
            const fn = document.exitFullscreen || document.webkitExitFullscreen;
            if (!fn) return;
            const p = fn.call(document);
            if (p && typeof p.catch === 'function') p.catch(() => { /* 忽略 */ });
            this.updateDesktopBtn();
        } catch (e) { /* 忽略 */ }
    }

    updateDesktopBtn() {
        const on = !!this.getFullscreenElement();
        const btn = this.desktopFullBtn || (this.overlay && this.overlay.querySelector('[data-action="toggle-desktop-full"]'));
        if (btn) {
            btn.classList.toggle('active', on);
            btn.title = on ? '退出全屏投影（D）' : '全屏投影（D）';
        }
        // 顶部快捷键提示与按钮说明保持同步：全屏时 D 的作用变成「退出全屏投影」
        const hint = this.hintRow || (this.overlay && this.overlay.querySelector('.bible-proj-tophint'));
        if (hint) {
            const text = '← → 翻页 · / 搜索 · Q 逐节 · W 并列 · E 混合 · S 检索 · ' +
                (on ? 'D 退出全屏投影' : 'D 全屏投影') +
                ' · C 居中 · R 重置 · +/- 字体 · T 主题 · Z 返回 · ESC 关闭';
            if (typeof hint.setText === 'function') hint.setText(text);
            else hint.textContent = text;
        }
    }

    // 把投影覆盖层搬进一个独立标签页：布局交给 Obsidian，投影与侧边栏各占一块，
    // 既不遮挡检索窗口，也不需要按侧边栏宽度去测算像素。
    async mountToTab() {
        try {
            const ws = this.app.workspace;
            // 已经挂在标签页里：直接调回，绝不新建第二个「经文投影」标签
            if (this.projectionLeaf) {
                if (typeof ws.revealLeaf === 'function') ws.revealLeaf(this.projectionLeaf);
                return this.projectionLeaf.view;
            }
            // 重启恢复 / 异常残留的空白「经文投影」标签先收掉，避免出现两个同名标签。
            // 视图的 onOpen 自检是第一道保险，这里是打开投影时的第二道保险。
            try {
                const orphans = (typeof ws.getLeavesOfType === 'function')
                    ? (ws.getLeavesOfType(BIBLE_PROJECTION_VIEW_TYPE) || []) : [];
                for (const l of orphans) {
                    try { l.detach(); } catch (e) { /* 忽略 */ }
                }
            } catch (e) { /* 忽略 */ }
            let leaf = null;
            const isInSidebar = (el) => !!(el && el.closest && el.closest('.mod-left-split, .mod-right-split'));
            // ① 优先加到主区域「已有的标签组」里（作为普通标签页，不会产生分屏）。
            //    注意不能直接 createLeafInParent(rootSplit)：那会在主区域新建一个并列面板，造成分屏；
            //    也不能用 getLeaf('tab')：它会在「活动面板」里开标签，活动面板常是侧边栏本身。
            try {
                const root = ws.rootSplit;
                if (root && typeof ws.createLeafInParent === 'function') {
                    const tabsGroup = (root.children || []).find(c => c && c.type === 'tabs');
                    if (tabsGroup) {
                        leaf = ws.createLeafInParent(tabsGroup, -1);
                        if (isInSidebar(leaf && leaf.view && leaf.view.containerEl)) {
                            try { leaf.detach(); } catch (e) { /* 忽略 */ }
                            leaf = null;
                        }
                    }
                }
            } catch (e) { leaf = null; }
            // ② 兜底：常规方式开标签，同样校验不要落进侧边栏
            if (!leaf && ws && typeof ws.getLeaf === 'function') {
                try { leaf = ws.getLeaf('tab'); } catch (e) { leaf = null; }
                if (isInSidebar(leaf && leaf.view && leaf.view.containerEl)) {
                    try { leaf.detach(); } catch (e) { /* 忽略 */ }
                    leaf = null;
                }
            }
            if (!leaf) return null;
            // 标记「正在挂载」：即便视图 onOpen 的自检在同一帧同步执行，也不会把新标签误判成孤儿
            this._pendingProjectionLeaf = leaf;
            try { leaf._bibleProjectionMounting = true; } catch (e) { /* 忽略 */ }
            await leaf.setViewState({ type: BIBLE_PROJECTION_VIEW_TYPE, active: false });
            const view = leaf.view;
            const host = view && view.contentEl;
            if (!host) { this.clearProjectionMounting(); return null; }
            if (typeof host.empty === 'function') host.empty(); else host.innerHTML = '';
            host.style.padding = '0';
            host.style.overflow = 'hidden';
            host.style.position = 'relative';
            host.appendChild(this.overlay);
            this.projectionLeaf = leaf;
            this.clearProjectionMounting();
            this.overlay.classList.add('bible-proj-in-tab');
            // 标签页内：不再遮盖整个窗口，只填满本标签的内容区
            this.overlay.style.position = 'absolute';
            this.overlay.style.top = '0';
            this.overlay.style.left = '0';
            this.overlay.style.right = '0';
            this.overlay.style.bottom = '0';
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.zIndex = '1';
            if (ws && typeof ws.revealLeaf === 'function') ws.revealLeaf(leaf);
            return view;
        } catch (e) {
            this.clearProjectionMounting();
            console.warn('[Bible] 投影切换到标签页失败，回退到收窄布局:', e);
            return null;
        }
    }

    // 挂载结束后清掉「正在挂载」标记，让视图自检能正常识别真正的孤儿标签
    clearProjectionMounting() {
        const l = this._pendingProjectionLeaf;
        if (l) { try { l._bibleProjectionMounting = false; } catch (e) { /* 忽略 */ } }
        this._pendingProjectionLeaf = null;
    }

    // 把覆盖层从标签页搬回 body，恢复全屏覆盖式投影
    restoreToFullscreen() {
        // 只有处于标签页模式（存在宿主 leaf）才需要「搬回全屏」；
        // 否则返回 false，让调用方走「复位宽度」的旧逻辑
        const leaf = this.projectionLeaf;
        if (!leaf) return false;
        this.projectionLeaf = null;
        // detach 会让 Obsidian 把焦点交还给上一个活动编辑区（笔记）：contentEditable 一拿到焦点
        // 就唤起输入法 / 软键盘，之后按键会被写进笔记正文（表现为「切换回全屏后变成打字」）。
        // 因此先主动失焦，再于 detach 之后多次抢回焦点，配合 _focusGuard 兜住异步重聚焦
        try {
            const ae = document.activeElement;
            if (ae && typeof ae.blur === 'function') ae.blur();
        } catch (e) { /* 忽略 */ }
        try { leaf.detach(); } catch (e) { /* 忽略 */ }
        if (this.overlay) {
            document.body.appendChild(this.overlay);
            this.overlay.classList.remove('bible-proj-in-tab');
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;display:flex;flex-direction:column;background:#1a1a2e;color:#fff;';
        }
        this.focusProjection(true);
        setTimeout(() => this.focusProjection(true), 0);
        setTimeout(() => this.focusProjection(true), 80);
        setTimeout(() => this.focusProjection(true), 250);
        return true;
    }

    async enterSearchMode() {
        this.isSearchMode = true;
        const o = this.overlay;
        o.classList.add('bible-proj-search-mode');
        // 优先变成独立标签页；老版本 API / 移动端不支持时，回退到「收窄 + 留出侧边栏」的旧逻辑
        const mounted = await this.mountToTab();
        // 在右侧边栏打开插件检索窗口并切到「圣经搜索」标签
        if (this.plugin) await this.plugin.activateSearchView();
        const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
        for (const leaf of leaves) {
            const v = leaf.view;
            if (v && typeof v.switchTab === 'function') v.switchTab('search');
        }
        if (mounted) {
            // 标签页模式下由 Obsidian 排版，无需再按侧边栏宽度收窄（也去掉分屏描边/阴影）
            o.classList.remove('bible-proj-search-mode');
            this.updateFontSize();
            // 打开检索后把键盘焦点留在投影上，避免焦点被侧边栏搜索框抢走导致 S 等快捷键变成打字
            // （Obsidian 激活某个 view 时会自动聚焦其内部第一个输入框，故这里延后抢回来）
            setTimeout(() => this.focusProjection(), 0);
            setTimeout(() => this.focusProjection(), 120);
            setTimeout(() => this.focusProjection(), 400);
            new Notice('投影已切换为标签页；侧边栏改选经文后可继续投影，按 S（或点「全屏」）恢复投影（光标若在搜索框内，先按 Esc）');
            return;
        }
        if (this.projectionLeaf) this.restoreToFullscreen();
        o.style.width = '100vw';
        o.style.height = '100vh';
        o.style.top = '0';
        o.style.bottom = '0';
        o.style.left = '0';
        o.style.right = 'auto';
        o.style.zIndex = '9999';
        // 等侧边栏完成布局后再按实际宽度收窄投影区（多次校正，照顾布局动画较慢的设备）
        this.applySplitLayout();
        setTimeout(() => this.applySplitLayout(), 120);
        setTimeout(() => this.applySplitLayout(), 400);
        this.watchSidebar();
        setTimeout(() => this.focusProjection(), 0);
        new Notice('已在右侧打开圣经检索；改选后可继续投影，按 S（或点「全屏」）恢复投影');
    }

    exitSearchMode() {
        this.isSearchMode = false;
        // 标签页模式：把覆盖层搬回全屏并关掉那个标签页
        if (this.restoreToFullscreen()) {
            this.overlay.classList.remove('bible-proj-search-mode');
            this.unwatchSidebar();
        this.updateFontSize();
        this.focusProjection(true);
        setTimeout(() => this.focusProjection(true), 0);
        setTimeout(() => this.focusProjection(true), 250);
        return;
    }
        const o = this.overlay;
        // 回退路径：退出检索时必须把宽度复位为全屏，否则 applySplitLayout 收窄的像素宽度会残留，
        // 导致再按 S（或点「全屏」按钮）时投影区无法扩大回全屏。
        o.style.width = '100vw';
        o.style.height = '100vh';
        o.style.top = '0';
        o.style.bottom = '0';
        o.style.left = '0';
        o.style.right = 'auto';
        o.style.maxWidth = '';
        o.style.zIndex = '9999';
        o.classList.remove('bible-proj-search-mode');
        this.unwatchSidebar();
        this.updateFontSize();
        // 退出检索后把焦点带回投影，紧接着再按 S / D / 方向键才能直接生效
        this.focusProjection();
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

    // 投影区在检索分屏下应保留的右侧宽度。
    // 优先直接测量圣经检索视图自身的可见矩形：投影区左边界对齐视图左边缘。
    // 之前用侧边栏容器（.workspace-split）的宽度来推算，在部分设备/布局下容器宽度
    // 与视图实际可见区域不一致（测量偏小 → 投影区算得过宽 → 盖住检索窗口）。
    getSidebarWidth() {
        try {
            const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
            for (const leaf of leaves) {
                const el = leaf && leaf.view && leaf.view.containerEl;
                if (!el || !el.getBoundingClientRect) continue;
                const r = el.getBoundingClientRect();
                // 视图实际可见（有宽度、左边缘在视口内且右侧贴近视口右缘）才采用
                if (r.width > 120 && r.left >= 0 && r.left < window.innerWidth - 120 && r.right <= window.innerWidth + 1) {
                    return Math.round(r.left);
                }
            }
        } catch (e) { /* 忽略，走下面的兜底 */ }
        // 兜底：按侧边栏容器推算（保留区 = 视口宽 − 容器左边缘）
        const el = this.getSidebarEl();
        if (el && el.getBoundingClientRect) {
            const r = el.getBoundingClientRect();
            if (r.width > 120 && r.left >= 0 && r.left < window.innerWidth - 120) {
                return Math.round(window.innerWidth - r.left);
            }
        }
        return Math.min(420, Math.round(window.innerWidth * 0.3));
    }

    // 按右侧边栏的实际宽度收窄投影区（保持全高，不做缩放动画）
    applySplitLayout() {
        if (!this.isSearchMode || !this.overlay) return;
        // 已切换为标签页模式：布局由 Obsidian 负责，不能再改动覆盖层尺寸
        if (this.projectionLeaf) return;
        const sw = this.getSidebarWidth();
        const projW = Math.max(360, window.innerWidth - sw);
        this.overlay.style.width = projW + 'px';
        this.overlay.style.maxWidth = 'none';
    }

    // 侧边栏被拖动改变宽度、或窗口尺寸变化时，投影区跟随
    watchSidebar() {
        this.unwatchSidebar();
        // 同时观察侧边栏容器与圣经视图自身容器：部分设备上侧边栏容器尺寸不变、
        // 只是内部视图区域变化（如分栏、抽屉式侧边栏），只观察容器会漏掉重算时机
        const targets = new Set();
        const sidebar = this.getSidebarEl();
        if (sidebar) targets.add(sidebar);
        try {
            const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
            for (const leaf of leaves) {
                const el = leaf && leaf.view && leaf.view.containerEl;
                if (el) targets.add(el);
            }
        } catch (e) { /* 忽略 */ }
        if (typeof ResizeObserver !== 'undefined' && targets.size) {
            this._sidebarObserver = new ResizeObserver(() => this.applySplitLayout());
            targets.forEach(el => this._sidebarObserver.observe(el));
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
            // 检索打开与否都用放大镜图标（此前打开时用 maximize，与「扩展到整个桌面」的 ⛶ 太相似易混淆）；
            // 用蓝色高亮（.active）表示检索已打开，作为视觉标志
            setIcon(btn, 'search');
            btn.classList.toggle('active', !!this.isSearchMode);
            btn.title = this.isSearchMode ? '恢复投影（S）' : '打开检索窗口（S）';
        }
    }

    // 在投影进行中，用快捷键即时切换投影模式（逐节/并列/混合），复用当前选中内容
    setMode(mode) {
        if (!mode || mode === this.mode) return;
        this.mode = mode;
        // 沿用各模式默认居中行为：逐节默认居中、并列/混合默认左对齐，与初始投影一致
        this.isCentered = (mode === 'focus');
        this.buildSlides();
        // 模式切换会改变页数，钳制当前页防止越界
        if (this.currentSlide > this.slides.length - 1) this.currentSlide = Math.max(0, this.slides.length - 1);
        if (this.currentSlide < 0) this.currentSlide = 0;
        this.renderSlide();
        const modeEl = this.overlay.querySelector('.bible-proj-mode-name');
        if (modeEl) modeEl.textContent = this.getModeName();
        this.updateSearchBtn();
        // 处于检索分屏时保持窄宽度不变，仅刷新内容排版
        if (this.isSearchMode) this.applySplitLayout();
    }

    // 把当前投影内容存档到历史栈（仅当确有内容时），便于之后「返回上一个投影内容」
    pushProjectionHistory() {
        if (!this.results || !this.results.length) return;
        this._projHistory.push({
            results: this.results,
            mode: this.mode,
            currentSlide: this.currentSlide,
            showSource: this.showSource
        });
        if (this._projHistory.length > 30) this._projHistory.shift();
        this.updateBackBtn();
    }
    canGoBackProjection() { return this._projHistory.length > 0; }
    // 返回上一个投影内容：从注解出处 / 经文弹窗再次投影后，可逐级退回到先前的投影
    goBackProjection() {
        const prev = this._projHistory.pop();
        if (!prev) return;
        this.results = prev.results;
        this.mode = prev.mode;
        this.showSource = prev.showSource;
        this.slides = [];
        this.buildSlides();
        this.currentSlide = Math.min(Math.max(0, prev.currentSlide), Math.max(0, this.slides.length - 1));
        this.renderSlide();
        const modeEl = this.overlay && this.overlay.querySelector('.bible-proj-mode-name');
        if (modeEl) modeEl.textContent = this.getModeName();
        const pageEl = this.overlay && this.overlay.querySelector('.bible-proj-page-num');
        if (pageEl) pageEl.textContent = (this.currentSlide + 1) + '/' + this.slides.length + '页';
        this.updateBackBtn();
    }
    // 根据历史栈是否为空切换「返回」按钮的显隐
    updateBackBtn() {
        const btn = this.overlay && this.overlay.querySelector('[data-action="proj-back"]');
        if (btn) btn.style.display = this.canGoBackProjection() ? '' : 'none';
    }

    // 用新的选中内容替换当前投影内容（原地更新，保持当前分屏/全屏状态，避免画面缩放跳动）
    reloadResults(results, mode, opts) {
        // 先存档当前内容：从注解出处 / 经文弹窗再次投影时，仍可返回到这一版投影。
        // 实时投影（noHistory）不存档，否则每敲一个字都会往「返回」栈里塞一版碎片。
        if (!(opts && opts.noHistory)) this.pushProjectionHistory();
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
        if (!(opts && opts.quiet)) new Notice('已更新投影内容');
    }
}

// ==================== 侧边栏圣经视图 ====================
const BIBLE_SEARCH_VIEW_TYPE = 'bible-search-view';
// 投影切换到「标签页模式」时使用的独立视图类型：由 Obsidian 负责与侧边栏的排版，避免贪死角算宽度导致遮挡
const BIBLE_PROJECTION_VIEW_TYPE = 'bible-projection-view';

// 投影标签页宿主的视图：仅提供容器，投影覆盖层会被搬进它的 contentEl
class BibleProjectionView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
    }
    getViewType() { return BIBLE_PROJECTION_VIEW_TYPE; }
    getDisplayText() { return '经文投影'; }
    getIcon() { return 'monitor'; }
    async onOpen() {
        // 标签页内容区由投影覆盖层完全占据：去掉主题默认内边距，并作为绝对定位的参照容器
        if (this.contentEl) {
            this.contentEl.empty();
            this.contentEl.style.padding = '0';
            this.contentEl.style.overflow = 'hidden';
            this.contentEl.style.position = 'relative';
        }
        // Obsidian 退出时会把「经文投影」标签连同 view 类型一起存进 workspace，重启后照原样恢复；
        // 但投影覆盖层是运行时创建的，新会话里没有任何插件实例与之对应，于是只剩一个空白标签，
        // 再开投影就会出现「空白 + 正常」两个经文投影标签。这里延迟一拍自检：
        // 既没有挂载投影层、也不是当前投影的宿主，就当作孤儿标签自行关掉。
        // 延迟是为了让 mountToTab() 里 setViewState 之后的 appendChild 先同步完成。
        const check = () => { try { this.dropOrphanProjectionTab(); } catch (e) { /* 忽略 */ } };
        try {
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(check);
            else if (typeof setTimeout === 'function') setTimeout(check, 0);
            else check();
        } catch (e) { /* 忽略 */ }
    }

    // 关掉「重启恢复出来的空白投影标签」；返回是否真的关了。
    dropOrphanProjectionTab() {
        const host = this.contentEl;
        // 环境不支持查询时保守跳过，避免误伤正常标签
        if (!host || typeof host.querySelector !== 'function') return false;
        if (host.querySelector('.bible-projection-fullscreen')) return false;  // 已挂载投影层
        const leaf = this.leaf;
        if (leaf && leaf._bibleProjectionMounting) return false;               // 正在挂载中
        const proj = this.plugin && this.plugin.currentProjection;
        if (proj && proj.projectionLeaf === leaf) return false;                 // 当前投影的宿主
        if (!leaf || typeof leaf.detach !== 'function') return false;
        try { leaf.detach(); } catch (e) { return false; }
        return true;
    }

    async onClose() {
        // 用户点了标签页的 ✕：直接关闭整个投影（而非搬回全屏继续投影）
        const proj = this.plugin && this.plugin.currentProjection;
        if (proj && proj.projectionLeaf === this.leaf) {
            // 标签页本来就在关闭流程中，先摘掉引用，避免 close() 里重复 detach
            proj.projectionLeaf = null;
            proj.close();
        }
    }
}

// 候选项的唯一标识：检索页 / 阅读页 / 经文弹窗三处共用同一套规则，
// 保证同名经文在不同窗口之间能正确去重、同步。
function verseIdentity(item, isCompare) {
    if (!item) return '';
    // 注解 / 串珠条目与经文共用同一套选中机制，靠 noteKey 区分同一节里的多条注 / 串
    return (isCompare ? 'cmp|' : 'main|') + item.versionKey + '|' + item.bookId + '|' +
        item.chapter + '|' + item.verse + '|' + item.type + '|' + item.content +
        (item.noteKey ? '|' + item.noteKey : '');
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
        this.searchFontSize = 15;
        this.readerResults = [];
        this.readerSelectCounter = 0;
        this.selectedBookIds = new Set(BIBLE_BOOKS.map(b => b.id));
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
        // 检索页：从经文上标展开的注解 / 串珠选中项（与检索结果共用序号 / 复制 / 投影）
        // 每项：{ item: noteItem, selected, order, sideBySide }
        this.searchNoteEntries = [];
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
        this.setupSwipeNavigation();
        this.setupPointerNavigation();
        this.setupKeyboardNavigation();
    }
    async onClose() {
        if (typeof this.destroyAbbrSuggestion === 'function') this.destroyAbbrSuggestion();
        if (this._swipeHandlers) {
            const h = this._swipeHandlers;
            h.host.removeEventListener('touchstart', h.onStart);
            h.host.removeEventListener('touchmove', h.onMove);
            h.host.removeEventListener('touchend', h.onEnd);
            h.host.removeEventListener('touchcancel', h.onCancel);
            this._swipeHandlers = null;
        }
        if (this._pointerHandlers) {
            const h = this._pointerHandlers;
            h.host.removeEventListener('pointerdown', h.onPointerDown);
            h.host.removeEventListener('pointermove', h.onPointerMove);
            h.host.removeEventListener('pointerup', h.onPointerUp);
            h.host.removeEventListener('pointercancel', h.onPointerCancel);
            h.host.removeEventListener('click', h.onClickCapture, true);
            h.host.removeEventListener('wheel', h.onWheel);
            if (typeof h.detachWindow === 'function') h.detachWindow();
            this._pointerHandlers = null;
        }
        if (this._keyboardHandlers) {
            const h = this._keyboardHandlers;
            h.host.removeEventListener('pointerdown', h.onPointerDown);
            h.host.removeEventListener('click', h.onClick);
            h.host.removeEventListener('keydown', h.onKeyDown);
            this._keyboardHandlers = null;
        }
        if (this._scrollCursorHandlers) {
            const h = this._scrollCursorHandlers;
            h.cancel();
            h.areas.forEach(a => a.removeEventListener('scroll', h.onScroll));
            this._scrollCursorHandlers = null;
        }
        if (this._tabResizeObserver) {
            this._tabResizeObserver.disconnect();
            this._tabResizeObserver = null;
        }
        if (this._tabResizeHandler) {
            window.removeEventListener('resize', this._tabResizeHandler);
            this._tabResizeHandler = null;
        }
        if (this._tabCompactRaf && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this._tabCompactRaf);
            this._tabCompactRaf = null;
        }
        if (this._tabBtnRefreshHandler) {
            if (this.container && typeof this.container.removeEventListener === 'function') {
                this.container.removeEventListener('focusin', this._tabBtnRefreshHandler);
                this.container.removeEventListener('input', this._tabBtnRefreshHandler);
                this.container.removeEventListener('pointerdown', this._tabBtnRefreshHandler);
            }
            this._tabBtnRefreshHandler = null;
        }
        if (this._tabBtnRefreshRaf && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this._tabBtnRefreshRaf);
            this._tabBtnRefreshRaf = null;
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
        this.compareBtn.addEventListener('click', (e) => {
            this.toggleComparePanel();
            this.releaseTabButtonFocus(e);
        });

        this.focusModeBtn = tabBar.createEl('button', { cls: 'bible-focus-mode-btn', text: '专注' });
        this.focusModeBtn.addEventListener('click', (e) => {
            this.toggleFocusMode();
            this.releaseTabButtonFocus(e);
        });

        this.setupTabOverflowWatch();
    }

    // 移动端 WebView 点完 button 后，:hover / :focus 会粘在按钮上直到下一次触摸别处，
    // 表现就是「按钮点了像消失、再点一下屏幕才出现」。主动失焦让它立刻回常态。
    releaseTabButtonFocus(e) {
        const btn = e && e.currentTarget;
        try { if (btn && typeof btn.blur === 'function') btn.blur(); } catch (err) { /* 忽略 */ }
        // 再兜一层：清掉任何残留的焦点，避免宿主主题把 focus 态渲染成透明
        try {
            if (typeof document !== 'undefined' && document.activeElement &&
                document.activeElement !== document.body &&
                typeof document.activeElement.blur === 'function' &&
                this.container && this.container.contains && this.container.contains(document.activeElement) &&
                document.activeElement.tagName === 'BUTTON') {
                document.activeElement.blur();
            }
        } catch (err) { /* 忽略 */ }
    }

    // 对照按钮的文字 / 激活态 / 可见性只由 comparePanelOpen 决定，避免弹窗被
    // 其它路径关掉后按钮还停在「已激活」或干脆不见了的状态。
    syncCompareBtnState() {
        if (!this.compareBtn) return;
        const on = !!this.comparePanelOpen;
        try {
            if (this.compareBtn.classList && typeof this.compareBtn.classList.toggle === 'function')
                this.compareBtn.classList.toggle('active', on);
            // 按钮文字始终固定为「对照」：激活态只靠底色 + 内描边表达，不额外加符号
            if (this.compareBtn.textContent !== '对照') this.compareBtn.textContent = '对照';
            this.compareBtn.title = on ? '关闭对照设置' : '打开对照设置';
            // 万一被别的逻辑写过内联隐藏，这里一律清掉，交给 CSS 决定可见性
            this.compareBtn.style.removeProperty('display');
            this.compareBtn.style.removeProperty('visibility');
            this.compareBtn.style.removeProperty('opacity');
        } catch (err) { /* 忽略 */ }
    }

    // 搜索框打字、点检索范围、阅读内容重绘时，宿主主题或移动 WebView 可能给
    // 标签栏按钮重新套上内联隐藏 / :focus / :hover 的透明样式，表现就是
    // 「按钮看不见，但位置还在、仍然能点」。这里做一次 rAF 合并的兜底：
    // 清掉外部写入的内联样式并重新同步状态；只有计算样式确实异常时才写内联值，
    // 正常渲染零干预。
    refreshTabButtonsVisible() {
        if (this._tabBtnRefreshRaf) return;
        if (typeof requestAnimationFrame !== 'function') { this._applyTabButtonsVisible(); return; }
        this._tabBtnRefreshRaf = requestAnimationFrame(() => {
            this._tabBtnRefreshRaf = null;
            this._applyTabButtonsVisible();
        });
    }

    _applyTabButtonsVisible() {
        this.syncCompareBtnState();
        this.updateFocusModeBtn();
        const props = ['display', 'visibility', 'opacity', 'color', 'background',
            'background-color', '-webkit-text-fill-color', 'border', 'box-shadow',
            'transform', 'filter'];
        for (const btn of [this.compareBtn, this.focusModeBtn]) {
            if (!btn || !btn.style) continue;
            for (const p of props) {
                try {
                    if (typeof btn.style.removeProperty === 'function') btn.style.removeProperty(p);
                } catch (err) { /* 忽略 */ }
            }
            try {
                const cs = typeof getComputedStyle === 'function' ? getComputedStyle(btn) : null;
                if (cs && typeof btn.style.setProperty === 'function') {
                    const invisible = cs.display === 'none' || cs.visibility === 'hidden' ||
                        (cs.opacity !== '' && parseFloat(cs.opacity) < 0.9);
                    if (invisible) {
                        btn.style.setProperty('display', 'inline-flex');
                        btn.style.setProperty('visibility', 'visible');
                        btn.style.setProperty('opacity', '1');
                    }
                    // 主题把背景 / 文字画成透明时，用与样式表兜底一致的硬编码色补回
                    const clear = (v) => v === 'transparent' || v === 'rgba(0, 0, 0, 0)';
                    if (clear(cs.backgroundColor) || clear(cs.color)) {
                        const on = !!(btn.classList && typeof btn.classList.contains === 'function' &&
                            btn.classList.contains('active'));
                        btn.style.setProperty('background-color', on ? '#3dbdb4' : '#4ecdc4');
                        btn.style.setProperty('color', '#0b2b29');
                        btn.style.setProperty('-webkit-text-fill-color', '#0b2b29');
                    }
                }
            } catch (err) { /* 忽略 */ }
        }
    }

    // 标签栏窄屏自适应：溢出时隐藏「搜索 / 阅读」文字只保留图标并缩小按钮宽度，
    // 保证右侧「对照 / 专注」不被挤出画面；窗口足够时自动恢复完整显示
    setupTabOverflowWatch() {
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => this.updateTabBarCompact());
        } else {
            this.updateTabBarCompact();
        }
        if (typeof ResizeObserver !== 'undefined') {
            this._tabResizeObserver = new ResizeObserver(() => this.updateTabBarCompact());
            this._tabResizeObserver.observe(this.tabBar);
        }
        this._tabResizeHandler = () => this.updateTabBarCompact();
        window.addEventListener('resize', this._tabResizeHandler);
        // 输入 / 点检索范围 / 内容区交互都会改变焦点或触发重绘，
        // 挂委托监听统一兜底刷新，不必侵入每个渲染函数。
        this._tabBtnRefreshHandler = () => this.refreshTabButtonsVisible();
        if (this.container && typeof this.container.addEventListener === 'function') {
            this.container.addEventListener('focusin', this._tabBtnRefreshHandler, { passive: true });
            this.container.addEventListener('input', this._tabBtnRefreshHandler, { passive: true });
            this.container.addEventListener('pointerdown', this._tabBtnRefreshHandler, { passive: true });
        }
    }

    // 同帧内的多次回调合并成一次测量。原先「每次都先移除 compact 再测、再按结果加回」
    // 会反复改标签栏自身的 class，触发 ResizeObserver 自激；窄屏下按钮会随之闪动、
    // 甚至有一帧被挤出可见区，看起来就是「点一下按钮不见了，再点屏幕才回来」。
    updateTabBarCompact() {
        if (!this.tabBar || this._tabCompactRaf) return;
        if (typeof requestAnimationFrame !== 'function') { this._applyTabBarCompact(); return; }
        this._tabCompactRaf = requestAnimationFrame(() => {
            this._tabCompactRaf = null;
            this._applyTabBarCompact();
        });
    }

    _applyTabBarCompact() {
        const bar = this.tabBar;
        if (!bar) return;
        const w = bar.clientWidth;
        if (!w) return;
        const lastW = this._lastTabBarWidth || 0;
        this._lastTabBarWidth = w;
        const isCompact = bar.classList.contains('compact');
        if (!isCompact) {
            // 完整状态溢出 → 切到紧凑（隐藏「搜索 / 阅读」文字），右侧按钮不再被挤出
            if (bar.scrollWidth > w + 1) bar.classList.add('compact');
            return;
        }
        // 已紧凑：只有容器确实变宽时才尝试恢复完整标签。
        // 宽度没变就完全不动 DOM，ResizeObserver 不会因我们自己的写入再次回调。
        if (w > lastW + 2) {
            bar.classList.remove('compact');
            if (bar.scrollWidth > w + 1) bar.classList.add('compact');
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
            // 弹窗挂在 document.body 上并抢走了焦点，弹窗移除后焦点会回落到 body；
            // 快捷键监听挂在插件容器上，不把焦点交还面板，X / I / Y / U 与方向键都收不到按键。
            this.restoreViewFocus();
        }
        this.syncCompareBtnState();
    }

    // 关闭对照弹窗后把键盘焦点交还插件面板（U / Esc / 关闭按钮 / 点遮罩共用）。
    // 只恢复「焦点确实丢了」的情形，不抢用户正在使用的笔记编辑器或其它面板控件。
    restoreViewFocus() {
        const host = this.container;
        if (!host || typeof host.focus !== 'function') return;
        const doFocus = () => {
            try {
                const ae = (typeof document !== 'undefined') ? document.activeElement : null;
                if (ae && typeof host.contains === 'function' && host.contains(ae)) return;
                if (ae && ae.closest && ae.closest(
                    'input, textarea, select, [contenteditable="true"], .cm-editor, .markdown-source-view')) return;
                if (typeof host.setAttribute === 'function') host.setAttribute('tabindex', '-1');
                host.focus({ preventScroll: true });
            } catch (err) { /* 忽略 */ }
        };
        doFocus();
        // 部分 WebView 会在弹窗节点移除后异步把焦点再交回 body，下一帧补一次
        try {
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(doFocus);
        } catch (err) { /* 忽略 */ }
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
        const headerTitle = header.createEl('h3', { text: '对照设置' });
        headerTitle.style.marginRight = 'auto';
        // 数据 / 注解更新入口（与设置页「检查数据/注解更新」同一逻辑）：符号按钮，置于关闭按钮左侧
        const dataUpdIcon = header.createEl('button', { cls: 'bible-small-btn', text: '⟳' });
        dataUpdIcon.title = '检查并更新圣经数据 / 注解（与设置页「检查数据/注解更新」同一逻辑）';
        dataUpdIcon.addEventListener('click', async () => {
            dataUpdIcon.setAttribute('disabled', 'true');
            dataUpdIcon.setText('⟳…');
            await this.plugin.checkBibleDataUpdateAndNotify(true);
            dataUpdIcon.removeAttribute('disabled');
            dataUpdIcon.setText('⟳');
            if (typeof syncNotesStatus === 'function') syncNotesStatus();
            if (typeof syncNotesDl === 'function') syncNotesDl();
        });
        const closeBtn = header.createEl('button', { cls: 'bible-small-btn', text: '✕' });
        closeBtn.style.marginLeft = '6px';
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
        const desc = modal.createDiv({ cls: 'bible-compare-modal-desc', text: '勾选要使用的版本，可拖动调整顺序。最上方的版本为主版本，其余为对照版本。圣经 / 注解数据文件（bible-*-data.json、bible-crv-notes.json）放在 vault 任意位置都会自动识别，并集中到插件目录作为唯一生效位置。' });

        // ===== 恢复本注解 / 串珠开关 =====
        const notesBox = modal.createDiv({ cls: 'bible-compare-modal-notes' });
        const notesRow = notesBox.createDiv({ cls: 'bible-compare-modal-notes-row' });
        const notesLabel = notesRow.createEl('label', { cls: 'bible-compare-modal-notes-label' });
        const notesCb = notesLabel.createEl('input', { type: 'checkbox' });
        notesCb.checked = !!this.plugin.settings.showNotes;
        notesLabel.createSpan({ text: '恢复本注解 / 串珠' });
        // 保存引用，便于主版本变化时把注解开关实时同步回这个 checkbox
        this._compareNotesCb = notesCb;
        const notesStatus = notesRow.createEl('span', { cls: 'bible-compare-modal-notes-status', text: '' });
        const syncNotesStatus = () => {
            const installed = !!this.plugin.settings.notesInstalled;
            notesStatus.setText(installed ? '已安装' : '未安装');
            notesStatus.style.color = installed ? 'var(--interactive-success)' : 'var(--text-muted)';
        };
        syncNotesStatus();

        const notesDlBtn = notesBox.createEl('button', { cls: 'bible-small-btn', text: '' });
        const syncNotesDl = () => {
            notesDlBtn.setText(this.plugin.settings.notesInstalled ? '🔄 重新安装注解数据' : '⬇️ 下载安装注解数据');
        };
        syncNotesDl();
        notesDlBtn.addEventListener('click', async () => {
            notesDlBtn.setAttribute('disabled', 'true');
            const ok = await this.plugin.installNotesData(true);
            notesDlBtn.removeAttribute('disabled');
            syncNotesStatus();
            syncNotesDl();
            if (ok) {
                this.plugin.attachNotesToItems();
                this.refreshNotesUI();
            }
        });

        notesCb.addEventListener('change', async () => {
            await this.plugin.setShowNotes(notesCb.checked);
            if (notesCb.checked) {
                notesStatus.setText('正在加载...');
                await this.plugin.loadNotesData();
                this.plugin.attachNotesToItems();
            }
            syncNotesStatus();
            await this.refreshNotesUI();
        });

        // 版本列表容器
        this._compareModalList = modal.createDiv({ cls: 'bible-compare-modal-list' });
        this._renderCompareModal();

        document.body.appendChild(modal);
        this._compareModal = modal;
        // 弹窗在 body 层：单独接管方向键 / 空格，并让焦点离开插件面板
        this._cmpCursorVisible = false;
        this._cmpCursorIdx = -1;
        this._cmpCursorKey = null;
        this._cmpKbIgnoreUntil = Date.now() + 200;
        this.setupCompareModalKeyboard();
        try {
            if (typeof modal.setAttribute === 'function') modal.setAttribute('tabindex', '-1');
            if (typeof modal.focus === 'function') modal.focus({ preventScroll: true });
        } catch (err) { /* 忽略 */ }
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
        this._compareNotesCb = null;
        this.teardownCompareModalKeyboard();
        this._cmpCursorVisible = false;
        this._cmpCursorIdx = -1;
        this._cmpCursorKey = null;
    }

    // 把对照 modal 里的「恢复本注解 / 串珠」开关实时同步为当前 settings.showNotes，
    // 这样主版本切换导致注解模式自动开/关后，无需重开 modal 即可看到正确状态。
    _syncCompareNotesCheckbox() {
        if (this._compareNotesCb) {
            this._compareNotesCb.checked = !!this.plugin.settings.showNotes;
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
                const newPrimary = this.plugin.settings.versions.find(v => v.isPrimary)?.key;
                if (oldPrimary !== newPrimary) {
                    // 主版本改变：同步注解模式（CRV 主版本→开注解，其它版本→关注解）
                    await this.plugin.reconcileNotesWithPrimary();
                    // 注解模式可能已自动切换，实时回写对照 modal 的开关状态
                    this._syncCompareNotesCheckbox();
                }
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
            if (oldPrimary !== newPrimary) {
                // 主版本改变：同步注解模式（CRV 主版本→开注解，其它版本→关注解）
                await this.plugin.reconcileNotesWithPrimary();
                // 注解模式可能已自动切换，实时回写对照 modal 的开关状态
                this._syncCompareNotesCheckbox();
            }

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
        // 版本列表被重建（勾选 / 拖动 / 刷新）后，按稳定 key 恢复键盘选框
        this.applyCompareModalCursor();
    }

    // ==================== 对照设置的键盘选框 ====================
    // 对照弹窗挂在 document.body 上，不在视图容器内，容器级 keydown 收不到；
    // 因此弹窗打开期间单独挂一个 document 级监听，关闭即移除。
    // 选项 = 弹窗里的按钮、注解开关行、各版本行；方向键移动选框，空格 / 回车等于点一下。
    setupCompareModalKeyboard() {
        if (this._compareKbHandler || typeof document === 'undefined' || !document.addEventListener) return;
        const self = this;
        const onKeyDown = (e) => {
            if (!self._compareModal) return;
            if (e.isComposing || e.keyCode === 229) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const t = e.target;
            if (t && t.closest && t.closest('input[type="text"], input[type="search"], textarea, [contenteditable="true"]')) return;
            const key = e.key;
            const lower = typeof key === 'string' ? key.toLowerCase() : '';
            // Esc 关弹窗是基础可用性，不受「键盘导航」开关影响
            if (key === 'Escape') {
                self.toggleComparePanel();
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
                return;
            }
            if (!self.keyboardNavEnabled()) return;
            let handled = true;
            if (key === 'ArrowDown' || key === 'ArrowRight') self.moveCompareModalCursor(1);
            else if (key === 'ArrowUp' || key === 'ArrowLeft') self.moveCompareModalCursor(-1);
            else if (key === ' ' || key === 'Spacebar' || key === 'Enter') self.activateCompareModalCursor();
            else if (lower === 'u') {
                // 打开弹窗的那一次 U 还会冒泡到 document，别把刚打开的弹窗立刻关掉
                if (Date.now() < (self._cmpKbIgnoreUntil || 0)) return;
                self.toggleComparePanel();
            }
            else handled = false;
            if (handled) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        this._compareKbHandler = onKeyDown;
        this.applyCompareModalCursor();
    }

    teardownCompareModalKeyboard() {
        if (this._compareKbHandler && typeof document !== 'undefined' && document.removeEventListener) {
            try { document.removeEventListener('keydown', this._compareKbHandler); } catch (err) { /* 忽略 */ }
        }
        this._compareKbHandler = null;
        this._cmpKbIgnoreUntil = 0;
    }

    getCompareModalKeyboardItems() {
        const modal = this._compareModal;
        if (!modal || typeof modal.querySelectorAll !== 'function') return [];
        let nodes;
        try {
            nodes = Array.prototype.slice.call(modal.querySelectorAll(
                'button, .bible-compare-modal-notes-row, .bible-compare-modal-row'));
        } catch (err) { return []; }
        const items = [];
        for (let i = 0; i < nodes.length; i++) {
            const el = nodes[i];
            if (!el) continue;
            if (el.disabled || (el.hasAttribute && el.hasAttribute('disabled'))) continue;
            let cb = null;
            try { cb = el.querySelector ? el.querySelector('input[type="checkbox"]') : null; }
            catch (err) { cb = null; }
            if (cb && (cb.disabled || (cb.hasAttribute && cb.hasAttribute('disabled')))) continue;
            const isButton = el.tagName === 'BUTTON' ||
                (el.classList && typeof el.classList.contains === 'function' && el.classList.contains('bible-small-btn'));
            let toggle = null;
            if (isButton) toggle = () => { if (typeof el.click === 'function') el.click(); };
            else if (cb) toggle = () => { if (typeof cb.click === 'function') cb.click(); };
            if (!toggle) continue;
            const ds = el.dataset || {};
            // 版本行重绘 / 拖动排序后仍按版本 key 找回同一项，按钮按固定顺序
            const key = ds.cmpKb || (ds.key ? 'v:' + ds.key : '') ||
                (String(el.className || '').indexOf('bible-compare-modal-notes-row') >= 0 ? 'n:notes' : '') ||
                ('i:' + i);
            el._cmpKey = key;
            el._cmpToggle = toggle;
            items.push(el);
        }
        return items;
    }

    setCompareModalCursorClass(el, on) {
        if (!el) return;
        const CLS = 'bible-cmp-kb-cursor';
        if (el.classList && typeof el.classList.toggle === 'function') { el.classList.toggle(CLS, on); return; }
        const cur = String(el.className || '');
        const has = cur.split(/\s+/).indexOf(CLS) !== -1;
        if (on && !has) el.className = (cur + ' ' + CLS).trim();
        else if (!on && has) el.className = cur.split(/\s+/).filter(x => x && x !== CLS).join(' ');
    }

    applyCompareModalCursor() {
        if (!this._compareModal) return;
        const items = this.getCompareModalKeyboardItems();
        if (!items.length) return;
        let idx = -1;
        if (this._cmpCursorKey) {
            for (let i = 0; i < items.length; i++) {
                if (items[i]._cmpKey === this._cmpCursorKey) { idx = i; break; }
            }
        }
        if (idx < 0) idx = this._cmpCursorIdx == null ? 0 : this._cmpCursorIdx;
        idx = Math.max(0, Math.min(items.length - 1, idx));
        this._cmpCursorIdx = idx;
        this._cmpCursorKey = items[idx]._cmpKey || null;
        items.forEach((el, i) => this.setCompareModalCursorClass(el, !!this._cmpCursorVisible && i === idx));
    }

    moveCompareModalCursor(delta) {
        const items = this.getCompareModalKeyboardItems();
        if (!items.length) return false;
        let idx;
        if (!this._cmpCursorVisible || this._cmpCursorIdx == null || this._cmpCursorIdx < 0)
            idx = delta > 0 ? 0 : items.length - 1;
        else idx = this._cmpCursorIdx + delta;
        idx = Math.max(0, Math.min(items.length - 1, idx));
        this._cmpCursorVisible = true;
        this._cmpCursorIdx = idx;
        this._cmpCursorKey = items[idx]._cmpKey || null;
        this.applyCompareModalCursor();
        const el = items[idx];
        if (el && typeof el.scrollIntoView === 'function') {
            try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
            catch (err) { try { el.scrollIntoView(); } catch (e2) { /* 忽略 */ } }
        }
        return true;
    }

    activateCompareModalCursor() {
        const items = this.getCompareModalKeyboardItems();
        if (!items.length) return false;
        if (!this._cmpCursorVisible) {
            // 第一次按空格只唤出选框，不误触第一项（通常是「检查更新」按钮）
            this._cmpCursorVisible = true;
            this._cmpCursorIdx = 0;
            this._cmpCursorKey = items[0]._cmpKey || null;
            this.applyCompareModalCursor();
            return true;
        }
        const idx = Math.max(0, Math.min(items.length - 1, this._cmpCursorIdx == null ? 0 : this._cmpCursorIdx));
        const el = items[idx];
        this._cmpCursorKey = el._cmpKey || null;
        if (typeof el._cmpToggle === 'function') el._cmpToggle();
        // 勾选版本会触发异步重绘；_renderCompareModal 末尾会按 _cmpCursorKey 把选框找回来
        this.applyCompareModalCursor();
        return true;
    }

    hasCompareMode() {
        const enabled = this.plugin.settings.versions.filter(v => v.enabled && v.installed);
        return enabled.length > 1;
    }

    // ==================== 翻页手势 / 键盘导航 ====================
    // 左滑 / 右滑 / ← / → / 触控板横滑 / 鼠标拖拽共用 swipeNext / swipePrev：
    // 检索页按「页」翻，阅读页按「章」翻（可跨书卷）。

    navEnabled() {
        return !(this.plugin && this.plugin.settings && this.plugin.settings.swipeNavigation === false);
    }

    isMobileEnv() {
        if (this._forceMobile !== undefined) return !!this._forceMobile;
        try {
            if (typeof Platform !== 'undefined' && Platform && Platform.isMobile) return true;
            if (typeof document !== 'undefined' && document.body && document.body.classList &&
                document.body.classList.contains('is-mobile')) return true;
            if (typeof navigator !== 'undefined' && navigator.userAgent &&
                /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return true;
        } catch (err) { /* 忽略 */ }
        return false;
    }

    // 关闭「移动端右滑翻上一页」后，右向手势整条让给 Obsidian 侧边栏
    allowRightSwipe() {
        return !(this.isMobileEnv() && this.plugin && this.plugin.settings &&
            this.plugin.settings.mobileRightSwipe === false);
    }

    hasBlockingOverlay() {
        try {
            if (typeof document !== 'undefined' && document.querySelector &&
                document.querySelector('.bible-inline-tooltip-host, .bible-compare-modal')) return true;
            // 投影处于「独占全屏」才算遮挡主视图；检索分屏 / 标签页模式下主视图侧边栏可见可操作，
            // 不应被当成遮挡层拦掉键盘导航（否则 S 打开侧边栏后方向键 / Y / I / 空格都失灵）
            const proj = this.plugin && this.plugin.currentProjection;
            if (proj) {
                if (proj.isSearchMode) return false;       // 检索分屏（含标签页）
                if (proj.projectionLeaf) return false;     // 标签页模式
            }
            if (typeof document !== 'undefined' && document.querySelector &&
                document.querySelector('.bible-projection-fullscreen')) return true;
        } catch (err) { /* 忽略 */ }
        return false;
    }

    hasTextSelection() {
        try {
            const sel = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null;
            return !!(sel && String(sel).length > 0);
        } catch (err) { return false; }
    }

    setupSwipeNavigation() {
        const host = this.container;
        if (!host || this._swipeHandlers) return;
        const MIN_DISTANCE = 60;    // 水平位移阈值（px）
        const MIN_RATIO = 1.4;      // 水平位移须明显大于垂直位移，避免误伤上下滚动
        const MAX_DURATION = 900;   // 超过此时长视为拖拽 / 选字，不当作翻页
        const COOLDOWN = 350;       // 一次翻页后的冷却，避免惯性连翻多页
        const self = this;
        let startX = 0, startY = 0, startAt = 0, tracking = false, horizontal = false, lastSwipeAt = 0;

        const edgeGuard = () => {
            const vw = (typeof window !== 'undefined' && window.innerWidth) || 0;
            if (!vw) return 28;
            // 手机 / 平板侧边抽屉的感应带更宽，从这一带起手时完全让给系统手势
            return self.isMobileEnv() ? Math.min(80, Math.max(44, vw * 0.14)) : 28;
        };

        const onStart = (e) => {
            const t = e.touches && e.touches[0];
            tracking = false; horizontal = false;
            if (!t || (e.touches && e.touches.length !== 1)) return;
            // 部分移动 WebView 不派发 pointerdown，用 touchstart 兜底同步选框
            self.syncKeyboardCursorFromTarget(e.target);
            const vw = (typeof window !== 'undefined' && window.innerWidth) || 0;
            const eg = edgeGuard();
            if (vw > 0 && (t.clientX < eg || t.clientX > vw - eg)) return;
            if (self.isSwipeBlockedTarget(e.target)) return;
            startX = t.clientX; startY = t.clientY; startAt = Date.now();
            tracking = true;
        };

        const onMove = (e) => {
            if (!tracking) return;
            const t = e.touches && e.touches[0];
            if (!t || (e.touches && e.touches.length !== 1)) return;
            const dx = t.clientX - startX, dy = t.clientY - startY;
            // 横向手势一旦起头（哪怕几像素）立刻拦下系统 / 侧边栏抽屉的冒泡 touch 监听，
            // 避免「翻了页，侧边栏也被带动一点」。仅在「明显横向（dx>dy 且已有几像素位移）」时拦，
            // 纵向手势（dy≥dx）全程放行，保证内容能正常滚动。边缘起手的手势在 onStart 已让给系统，不会进入这里。
            if (self.isMobileEnv() && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 4) {
                try { if (e.stopPropagation) e.stopPropagation(); } catch (err) { /* 忽略 */ }
                try { if (e.cancelable && e.preventDefault) e.preventDefault(); } catch (err) { /* 忽略 */ }
            }
            if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            if (dx > 0 && !self.allowRightSwipe()) { tracking = false; horizontal = false; return; }
            horizontal = true;
            // 移动端：确认为横向翻页手势后，再次拦下浏览器默认滚动与 Obsidian 侧边抽屉的
            // 冒泡 touch 监听，避免「翻了页，侧边栏也被划走 / 被划出」。
            if (self.isMobileEnv()) {
                try { if (e.cancelable && e.preventDefault) e.preventDefault(); } catch (err) { /* 忽略 */ }
                try { if (e.stopPropagation) e.stopPropagation(); } catch (err) { /* 忽略 */ }
            }
        };

        const onEnd = (e) => {
            if (!tracking) return;
            tracking = false;
            const wasHorizontal = horizontal;
            horizontal = false;
            const t = e.changedTouches && e.changedTouches[0];
            // 多指手势（缩放等）不翻页
            if (!t || (e.touches && e.touches.length > 0)) return;
            const now = Date.now();
            const dx = t.clientX - startX, dy = t.clientY - startY;
            if (Math.abs(dx) < MIN_DISTANCE) return;
            if (Math.abs(dx) < Math.abs(dy) * MIN_RATIO) return;
            if (now - startAt > MAX_DURATION) return;
            if (now - lastSwipeAt < COOLDOWN) return;
            if (dx > 0 && !self.allowRightSwipe()) return;
            if (!self.navEnabled() || self.hasBlockingOverlay() || self.hasTextSelection()) return;
            if (self.isSwipeBlockedTarget(e.target)) return;
            const moved = dx < 0 ? self.swipeNext() : self.swipePrev();
            if (!moved) return;
            lastSwipeAt = now;
            if (self.isMobileEnv() && wasHorizontal) {
                // 阻止翻页后合成的 click（避免误选中卡片），并拦下抽屉的 touchend
                try { if (e.cancelable && e.preventDefault) e.preventDefault(); } catch (err) { /* 忽略 */ }
                try { if (e.stopPropagation) e.stopPropagation(); } catch (err) { /* 忽略 */ }
            }
        };
        const onCancel = () => { tracking = false; horizontal = false; };
        host.addEventListener('touchstart', onStart, { passive: true });
        host.addEventListener('touchmove', onMove, { passive: false });
        host.addEventListener('touchend', onEnd, { passive: false });
        host.addEventListener('touchcancel', onCancel, { passive: true });
        this._swipeHandlers = { host, onStart, onMove, onEnd, onCancel };
    }

    // 鼠标拖拽（触屏式四向）+ 触控板双指横滑：
    // 横向翻页 / 翻章，纵向跟手滚动内容；纵向滚轮仍完全交给浏览器原生滚动。
    setupPointerNavigation() {
        const host = this.container;
        if (!host || this._pointerHandlers) return;
        const MIN_DISTANCE = 60;   // 横向翻页阈值
        const DRAG_SLOP = 6;       // 超过这个位移才认定为拖拽，轻点仍是点击 / 选字起点
        const WHEEL_THRESHOLD = 90;
        const COOLDOWN = 400;
        const self = this;
        let tracking = false, dragX = 0, dragY = 0, dragAt = 0;
        let axis = '', dragged = false, scrollArea = null, startScrollTop = 0;
        let lastNavAt = 0, wheelAcc = 0, wheelAt = 0, wheelDir = 0;

        const pointerEnabled = () => !(self.plugin && self.plugin.settings &&
            self.plugin.settings.pointerNavigation === false);
        // 拖拽过程中浏览器可能顺带选中卡片文字，因此不在移动中检查「已选中文字」，
        // 改为手势确认后清掉这段顺带产生的选区。
        const blocked = (target) => self.isSwipeBlockedTarget(target) || self.hasBlockingOverlay();
        const clearIncidentalSelection = () => {
            try {
                const s = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null;
                if (s && s.removeAllRanges) s.removeAllRanges();
            } catch (err) { /* 忽略 */ }
        };
        // 找离手势起点最近的可纵向滚动容器；找不到就退回当前标签页的内容区
        const findScrollArea = (target) => {
            const hit = target && target.closest ? target.closest(
                '.bible-search-scroll-area, .bible-reader-scroll-area, .bible-search-fixed-top, .bible-reader-fixed-top') : null;
            if (hit) return hit;
            return typeof self.getKeyboardScrollArea === 'function' ? self.getKeyboardScrollArea() : null;
        };
        const setDragCursor = (on) => {
            try {
                if (host.classList && host.classList.toggle) host.classList.toggle('bible-pointer-dragging', on);
            } catch (err) { /* 忽略 */ }
        };
        // 拖拽进行中临时挂到 window 的监听，结束手势时统一卸载（避免泄漏）
        const detachWindow = () => {
            try {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('pointermove', onPointerMove, { passive: false });
                    window.removeEventListener('pointerup', onPointerUp, { passive: true });
                    window.removeEventListener('pointercancel', onPointerCancel, { passive: true });
                }
            } catch (err) { /* 忽略 */ }
        };
        const finishDrag = () => {
            tracking = false; axis = ''; dragged = false; scrollArea = null;
            setDragCursor(false);
            detachWindow();
        };

        const onPointerDown = (e) => {
            finishDrag();       // 拖到面板外释放时不会留下残留状态
            if (!pointerEnabled()) return;
            if (e.pointerType && e.pointerType !== 'mouse') return;
            if (e.button != null && e.button !== 0) return;
            // 按住修饰键时保持浏览器原生框选 / 选字（复制经文的通道）
            if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
            // 只让行链接与表单控件；正文文字、注解文字上也能像触屏一样四向滑动
            if (e.target && e.target.closest && e.target.closest(
                'a, input, textarea, select, button, label, [contenteditable="true"]')) return;
            if (blocked(e.target)) return;
            tracking = true;
            dragX = e.clientX || 0; dragY = e.clientY || 0; dragAt = Date.now();
            scrollArea = findScrollArea(e.target);
            startScrollTop = scrollArea && typeof scrollArea.scrollTop === 'number' ? scrollArea.scrollTop : 0;
            // 不用 setPointerCapture：捕获会把后续 click 重定向到容器，破坏子元素
            // （经文卡片）的点击选中。改为在 window 上临时挂 move / up / cancel，
            // 既能跟住拖出容器的手势，又不干扰正常点击选中。
            try {
                if (typeof window !== 'undefined') {
                    window.addEventListener('pointermove', onPointerMove, { passive: false });
                    window.addEventListener('pointerup', onPointerUp, { passive: true });
                    window.addEventListener('pointercancel', onPointerCancel, { passive: true });
                }
            } catch (err) { /* 忽略 */ }
        };
        const onPointerMove = (e) => {
            if (!tracking) return;
            if (e.buttons != null && e.buttons === 0) { finishDrag(); return; }
            const dx = (e.clientX || 0) - dragX, dy = (e.clientY || 0) - dragY;
            if (!axis) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_SLOP) return;
                axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
                dragged = true;
                setDragCursor(true);
                clearIncidentalSelection();
            }
            if (axis === 'y' && scrollArea && typeof scrollArea.scrollTop === 'number') {
                // 与触屏一致：往下拖 dy > 0，内容跟着往下走，scrollTop 减小
                scrollArea.scrollTop = startScrollTop - dy;
            }
            // 手势已确认：吃掉浏览器默认的文字选中 / 原生图片拖拽
            try { if (e.cancelable && e.preventDefault) e.preventDefault(); } catch (err) { /* 忽略 */ }
        };
        const onPointerUp = (e) => {
            if (!tracking) return;
            const wasAxis = axis, wasDragged = dragged;
            const dx = (e.clientX || 0) - dragX, dy = (e.clientY || 0) - dragY;
            finishDrag();
            // 部分 WebView / 合成事件只派发 down + up、不发 move：按终点位移兜底判定横向拖拽
            const isHorizontal = wasAxis === 'x' || (wasAxis === '' &&
                Math.abs(dx) >= MIN_DISTANCE && Math.abs(dx) >= Math.abs(dy) * 1.4);
            if (wasDragged || isHorizontal) {
                clearIncidentalSelection();
                // 拖拽后浏览器补发的 click 不该误选中卡片
                self._suppressNextClickUntil = Date.now() + 250;
            }
            if (!isHorizontal) return;      // 纵向拖拽只滚动，不翻页
            if (!pointerEnabled() || blocked(e.target)) return;
            if (Math.abs(dx) < MIN_DISTANCE) return;
            if (Math.abs(dx) < Math.abs(dy) * 1.4) return;
            if (Date.now() - dragAt > 900) return;
            if (Date.now() - lastNavAt < COOLDOWN) return;
            const moved = dx < 0 ? self.swipeNext() : self.swipePrev();
            if (moved) lastNavAt = Date.now();
        };
        const onPointerCancel = () => { finishDrag(); };
        const onClickCapture = (e) => {
            if (Date.now() >= (self._suppressNextClickUntil || 0)) return;
            self._suppressNextClickUntil = 0;
            try {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
            } catch (err) { /* 忽略 */ }
        };

        const onWheel = (e) => {
            if (!pointerEnabled()) return;
            const dx = e.deltaX || 0, dy = e.deltaY || 0;
            if (Math.abs(dx) < 1 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            if (blocked(e.target)) return;
            const now = Date.now();
            const dir = dx > 0 ? 1 : -1;
            if (now - wheelAt > 300 || dir !== wheelDir) { wheelAcc = 0; wheelDir = dir; }
            wheelAt = now;
            const unit = e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? 400 : 1);
            wheelAcc += Math.abs(dx) * unit;
            // 横向手势一律吃掉：既不让页面横向滚动，也避免 macOS 触发浏览器前进 / 后退
            try { if (e.cancelable && e.preventDefault) e.preventDefault(); } catch (err) { /* 忽略 */ }
            if (now - lastNavAt < COOLDOWN || wheelAcc < WHEEL_THRESHOLD) return;
            wheelAcc = 0;
            const moved = dx > 0 ? self.swipeNext() : self.swipePrev();
            if (moved) lastNavAt = now;
        };
        host.addEventListener('pointerdown', onPointerDown, { passive: true });
        // pointermove / pointerup / pointercancel 在每次按下后临时挂到 window，
        // 由 finishDrag / detachWindow 负责卸载（见 onPointerDown、finishDrag）。
        host.addEventListener('click', onClickCapture, true);
        host.addEventListener('wheel', onWheel, { passive: false });
        this._pointerHandlers = {
            host, onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
            onClickCapture, onWheel, detachWindow
        };
    }

    // 键盘导航：←/→ 翻页，↑/↓ 移动选框，空格选中，B 切「并」，C 清空
    setupKeyboardNavigation() {
        const host = this.container;
        if (!host || this._keyboardHandlers) return;
        const self = this;
        const keyEnabled = () => !(self.plugin && self.plugin.settings &&
            self.plugin.settings.keyboardNavigation === false);
        const onPointerDown = (e) => {
            if (!keyEnabled()) return;
            const t = e.target;
            if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
            // 触屏轻点 / 鼠标点选：把上下键的选框同步到手指或鼠标点到的那一条，
            // 之后接着按 ↑/↓ 就从这里继续，不必从头再走一遍。
            self.syncKeyboardCursorFromTarget(t);
            try { if (typeof host.focus === 'function') host.focus({ preventScroll: true }); } catch (err) { /* 忽略 */ }
        };
        // 少数环境只派发 click（辅助点击、键盘激活控件），补一个兜底
        const onClick = (e) => {
            if (!keyEnabled()) return;
            self.syncKeyboardCursorFromTarget(e && e.target);
        };
        const onKeyDown = (e) => {
            if (!keyEnabled()) return;
            // 输入法合成态、带修饰键、焦点在输入框 / 按钮 / 浮层里，一律让行
            if (e.isComposing || e.keyCode === 229) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const t = e.target;
            const gridMode = self.isGridKeyboardMode();
            const key0 = e.key;
            const lower0 = typeof key0 === 'string' ? key0.toLowerCase() : '';
            // X / I / Y / U 是全局动作键：点过工具栏按钮后焦点还留在按钮上，也要继续生效
            const actionKey = lower0 === 'x' || lower0 === 'i' || lower0 === 'y' || lower0 === 'u';
            if (t && t.closest && t.closest('input, textarea, select, button, [contenteditable="true"]')) {
                // 输入框 / 可编辑区一律让行（打字时不能触发快捷键）
                if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
                // 书卷 / 章节网格本身就是按钮：焦点落在它们上面时仍允许方向键导航，
                // 其余工具栏按钮只放行上述四个动作键。
                if (!(gridMode && t.closest('.bible-reader-book-btn, .bible-reader-chapter-btn')) && !actionKey) return;
            }
            if (t && t.closest && t.closest('.bible-inline-tooltip-host, .bible-inline-tooltip, .bible-projection-fullscreen, .bible-popup-menu, .modal-container')) return;
            if (self.hasBlockingOverlay()) return;
            const key = e.key;
            const lower = typeof key === 'string' ? key.toLowerCase() : '';
            let handled = true;
            if (lower === 'x') self.keyboardSelectAllPage();
            else if (lower === 'i') self.keyboardToggleFocusMode();
            else if (lower === 'y') self.keyboardSwitchTab();
            else if (lower === 'u') self.keyboardToggleCompare();
            else if (gridMode) {
                // 网格页：四个方向键在书卷 / 章号之间移动选框，空格 / 回车确定，
                // ←/→ 不再翻页，B / C 也不触发「并」与清空，避免误改候选池。
                if (key === 'ArrowLeft') self.moveGridKeyboardCursor('left');
                else if (key === 'ArrowRight') self.moveGridKeyboardCursor('right');
                else if (key === 'ArrowUp') self.moveGridKeyboardCursor('up');
                else if (key === 'ArrowDown') self.moveGridKeyboardCursor('down');
                else if (key === ' ' || key === 'Spacebar' || key === 'Enter') self.keyboardToggleSelection();
                else if (key === 'Escape' || key === 'Backspace') self.gridGoBack();
                else if (key === 'b' || key === 'B' || key === 'c' || key === 'C') { /* 网格页不响应 */ }
                else handled = false;
            }
            else if (key === 'ArrowLeft') self.swipePrev();
            else if (key === 'ArrowRight') self.swipeNext();
            else if (key === 'ArrowDown') self.moveKeyboardCursor(1);
            else if (key === 'ArrowUp') self.moveKeyboardCursor(-1);
            else if (key === ' ' || key === 'Spacebar') self.keyboardToggleSelection();
            else if (key === 'b' || key === 'B') self.keyboardToggleSide();
            else if (key === 'c' || key === 'C') self.keyboardClearAll();
            else handled = false;
            if (handled) {
                if (e.preventDefault) e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();
            }
        };
        try { if (typeof host.setAttribute === 'function') host.setAttribute('tabindex', '-1'); } catch (err) { /* 忽略 */ }
        host.addEventListener('pointerdown', onPointerDown, { passive: true });
        host.addEventListener('click', onClick, { passive: true });
        host.addEventListener('keydown', onKeyDown);
        this._keyboardHandlers = { host, onPointerDown, onClick, onKeyDown };
        this.setupScrollCursorSync();
    }

    keyboardNavEnabled() {
        return !(this.plugin && this.plugin.settings && this.plugin.settings.keyboardNavigation === false);
    }

    // 滚动搜索结果 / 经文阅读时，把上下键的选框跟到「当前显示的内容」上。
    // 监听两个内容区各自的 scroll（passive），滚动中节流、停止后再定案一次。
    setupScrollCursorSync() {
        if (this._scrollCursorHandlers) return;
        const self = this;
        const THROTTLE = 90;
        let lastAt = 0, pending = null;
        const run = () => {
            lastAt = Date.now();
            if (pending) { clearTimeout(pending); pending = null; }
            if (!self.keyboardNavEnabled()) return;
            // 翻页复位、↑/↓ 把目标滚进视野等程序滚动，不该反过来把选框拽走
            if (Date.now() < (self._kbSuppressScrollUntil || 0)) return;
            self.syncKeyboardCursorOnScroll();
        };
        const onScroll = () => {
            if (!self.keyboardNavEnabled()) return;
            const wait = THROTTLE - (Date.now() - lastAt);
            if (wait <= 0) run();
            else if (!pending) pending = setTimeout(run, wait);
        };
        const areas = [this.searchScrollArea, this.readerScrollArea]
            .filter(a => a && typeof a.addEventListener === 'function');
        areas.forEach(a => a.addEventListener('scroll', onScroll, { passive: true }));
        this._scrollCursorHandlers = {
            areas, onScroll,
            cancel: () => { if (pending) { clearTimeout(pending); pending = null; } }
        };
    }

    // 程序自身滚动前调用，短暂屏蔽滚动同步，避免「滚动 → 移框 → 再滚动」来回拉扯
    suppressKeyboardScrollSync(ms) {
        this._kbSuppressScrollUntil = Date.now() + (ms == null ? 180 : ms);
    }

    getKeyboardScrollArea() {
        return this.activeTab === 'reader' ? this.readerScrollArea : this.searchScrollArea;
    }

    // 统一取几何：优先用浏览器 rect（真实环境最准），
    // 没有 rect 的极简 DOM 环境退回 scrollTop / offsetTop。
    getKeyboardItemGeometry(area, el) {
        if (!area || !el) return null;
        let viewTop = 0, viewBottom = 0, top = 0, bottom = 0;
        try {
            if (typeof area.getBoundingClientRect === 'function' && typeof el.getBoundingClientRect === 'function') {
                const a = area.getBoundingClientRect(), r = el.getBoundingClientRect();
                viewTop = a.top; viewBottom = a.bottom; top = r.top; bottom = r.bottom;
            } else {
                viewTop = Number(area.scrollTop) || 0;
                viewBottom = viewTop + (Number(area.clientHeight) || 0);
                top = Number(el.offsetTop) || 0;
                bottom = top + (Number(el.offsetHeight) || 0);
            }
        } catch (err) { return null; }
        if (!(viewBottom > viewTop) || !(bottom > top)) return null;
        return { viewTop, viewBottom, top, bottom };
    }

    keyboardItemVisibleRatio(area, el) {
        const g = this.getKeyboardItemGeometry(area, el);
        if (!g) return 0;
        const v = Math.min(g.bottom, g.viewBottom) - Math.max(g.top, g.viewTop);
        return v <= 0 ? 0 : v / (g.bottom - g.top);
    }

    // 「当前显示的内容」= 视口内最靠上的内容条；若它已被顶部裁掉一半以上，
    // 则取下一条完整露出的；视口里只剩被裁的条目时取可见高度最大的一条。
    findVisibleKeyboardItem(area, items) {
        let first = -1, firstVisible = 0, firstH = 1, firstTop = -1, best = -1, bestH = 0;
        for (let i = 0; i < items.length; i++) {
            const g = this.getKeyboardItemGeometry(area, items[i]);
            if (!g) continue;
            const v = Math.min(g.bottom, g.viewBottom) - Math.max(g.top, g.viewTop);
            if (v <= 0) continue;
            const h = g.bottom - g.top;
            if (first < 0) { first = i; firstVisible = v; firstH = h; }
            if (firstTop < 0 && g.top >= g.viewTop - 2) firstTop = i;
            if (v > bestH) { bestH = v; best = i; }
        }
        if (first >= 0 && firstVisible >= firstH * 0.5) return first;
        if (firstTop >= 0) return firstTop;
        return best;
    }

    // 滚动稳定后调用：选框已在视野内就不动；滚出去了就落到当前显示的内容条。
    // 选框尚未唤出时只记下锚点，下次按 ↑/↓ 或空格便从当前看到的内容开始。
    syncKeyboardCursorOnScroll(area) {
        const root = area || this.getKeyboardScrollArea();
        const items = this.getKeyboardItems();
        if (!root || !items.length) return -1;
        if (typeof this.hasBlockingOverlay === 'function' && this.hasBlockingOverlay()) return -1;
        const idx = this.findVisibleKeyboardItem(root, items);
        if (idx < 0) return -1;
        if (this._kbCursorVisible && this._kbCursorIdx !== idx &&
            this.keyboardItemVisibleRatio(root, items[this._kbCursorIdx]) >= 0.5) return this._kbCursorIdx;
        this._kbScrollAnchorIdx = idx;
        if (this._kbCursorVisible && this._kbCursorIdx === idx &&
            this._kbCursorKey === (items[idx]._kbKey || null)) return idx;
        this._kbCursorIdx = idx;
        this._kbCursorKey = items[idx]._kbKey || null;
        this._kbCursorFresh = false;
        // 只更新高亮，不再 scrollIntoView，否则会再次触发滚动
        if (this._kbCursorVisible) this.applyKeyboardCursor();
        return idx;
    }

    // 触屏 / 鼠标点到的内容条 → 把键盘选框移过去。
    // 用「当前标签页里实际存在的可选条」反查，天然避开隐藏页、浮层与工具栏。
    syncKeyboardCursorFromTarget(target) {
        if (this.plugin && this.plugin.settings && this.plugin.settings.keyboardNavigation === false) return false;
        if (!target || !target.closest || this.hasBlockingOverlay()) return false;
        let card = null;
        try { card = target.closest('[data-bible-kb-item="1"]'); } catch (err) { return false; }
        if (!card) return false;
        return this.setKeyboardCursorTo(card);
    }

    // 翻页 / 换章后若选框落在页内较靠下的「新选中目标」，把它滚进视野
    settleKeyboardCursorAfterTurn() {
        if (!this._kbCursorNeedsReveal) return;
        this._kbCursorNeedsReveal = false;
        const card = this.getKeyboardCursorCard();
        if (card && typeof card.scrollIntoView === 'function') {
            this.suppressKeyboardScrollSync();
            try { card.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
            catch (err) { /* 忽略 */ }
        }
    }

    setKeyboardCursorTo(card, reveal) {
        const items = this.getKeyboardItems();
        const idx = items.indexOf(card);
        if (idx < 0) return false;
        this._kbCursorVisible = true;
        this._kbCursorIdx = idx;
        this._kbCursorKey = card._kbKey || null;
        this._kbCursorFresh = false;
        this.applyKeyboardCursor();
        if (reveal && typeof card.scrollIntoView === 'function') {
            this.suppressKeyboardScrollSync();
            try { card.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
            catch (err) { /* 忽略 */ }
        }
        return true;
    }

    // 翻页 / 翻章后旧目标已不在新内容里：清掉身份锚点，让重绘后的选框
    // 落到新页里「新选中的目标」（保留候选等），没有则回到新页第一条。
    // 同时清掉滚动锚点，并屏蔽翻页时 scrollTop = 0 带来的滚动同步。
    resetKeyboardCursorForNewView() {
        this._kbCursorKey = null;
        this._kbCursorIdx = 0;
        this._kbCursorFresh = true;
        this._kbScrollAnchorIdx = -1;
        this.suppressKeyboardScrollSync(220);
    }

    // 给每条可选中的内容挂上键盘动作（渲染时调用，重绘后自动重建）
    // data.key 是跨重绘稳定的身份标识；有它时选框跟着「同一条内容」走，而不是跟着行号走。
    markKeyboardItem(card, data) {
        if (!card) return;
        try { if (typeof card.setAttribute === 'function') card.setAttribute('data-bible-kb-item', '1'); } catch (err) { /* 忽略 */ }
        card._kbKey = data.key || null;
        card._kbToggle = data.toggle;
        card._kbSide = data.side;
        card._kbSelected = !!data.selected;
    }

    getKeyboardItems() {
        const root = this.activeTab === 'reader' ? this.readerContent : this.resultsContainer;
        if (!root || typeof root.querySelectorAll !== 'function') return [];
        try { return Array.prototype.slice.call(root.querySelectorAll('[data-bible-kb-item="1"]')); }
        catch (err) { return []; }
    }

    setCursorClass(el, on) {
        if (!el) return;
        const CLS = 'bible-kb-cursor';
        if (el.classList && typeof el.classList.toggle === 'function') { el.classList.toggle(CLS, on); return; }
        const cur = String(el.className || '');
        const has = cur.split(/\s+/).indexOf(CLS) !== -1;
        if (on && !has) el.className = (cur + ' ' + CLS).trim();
        else if (!on && has) el.className = cur.split(/\s+/).filter(x => x && x !== CLS).join(' ');
    }

    applyKeyboardCursor() {
        const items = this.getKeyboardItems();
        if (!items.length) return;
        if (!this._kbCursorVisible) {
            items.forEach(el => this.setCursorClass(el, false));
            this._kbCursorFresh = false;
            return;
        }
        let idx = -1;
        // 1) 优先按身份锚点找回同一条内容：点击选中后整页重绘，选框仍停在被操作的那条
        if (this._kbCursorKey) {
            for (let i = 0; i < items.length; i++) {
                if (items[i]._kbKey && items[i]._kbKey === this._kbCursorKey) { idx = i; break; }
            }
        }
        // 2) 锚点失效（触屏 / 鼠标 / 键盘翻页、换章）：移到新内容里的新目标，
        //    优先落在这一页已选中的条目，没有则回到第一条
        if (idx < 0 && this._kbCursorFresh) {
            for (let i = 0; i < items.length; i++) {
                if (items[i]._kbSelected) { idx = i; break; }
            }
            if (idx < 0) idx = 0;
            // 落点不在页首时，翻页复位滚动之后再把它滚进视野
            if (idx > 0) this._kbCursorNeedsReveal = true;
        }
        // 3) 既无锚点也不是换页：沿用行号（兼容未标记身份的内容）
        if (idx < 0) idx = this._kbCursorIdx == null ? 0 : this._kbCursorIdx;
        idx = Math.max(0, Math.min(items.length - 1, idx));
        this._kbCursorIdx = idx;
        this._kbCursorKey = items[idx]._kbKey || null;
        this._kbCursorFresh = false;
        items.forEach((el, i) => this.setCursorClass(el, i === idx));
    }

    moveKeyboardCursor(delta) {
        const items = this.getKeyboardItems();
        if (!items.length) return false;
        let idx;
        if (!this._kbCursorVisible || this._kbCursorIdx == null || this._kbCursorIdx < 0) {
            // 还没唤出选框、但内容被滚动过：从当前显示的内容开始，而不是回到第一 / 最后一条
            const anchor = this._kbScrollAnchorIdx;
            idx = (anchor >= 0 && anchor < items.length) ? anchor : (delta > 0 ? 0 : items.length - 1);
        } else idx = this._kbCursorIdx + delta;
        idx = Math.max(0, Math.min(items.length - 1, idx));
        this._kbCursorVisible = true;
        this._kbCursorIdx = idx;
        this._kbScrollAnchorIdx = -1;
        // 键盘移动后锚点必须跟着更新，否则下次重绘会被旧 key 拉回原处
        this._kbCursorKey = items[idx]._kbKey || null;
        this._kbCursorFresh = false;
        this.applyKeyboardCursor();
        const el = items[idx];
        if (el && typeof el.scrollIntoView === 'function') {
            this.suppressKeyboardScrollSync();
            try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
            catch (err) { try { el.scrollIntoView(); } catch (e2) { /* 忽略 */ } }
        }
        return true;
    }

    // 书卷列表 / 章目录列表：这两个页面没有经文卡片，用同一套键盘选框在网格按钮间移动，
    // 空格 / 回车等于点击按钮（复用 markKeyboardItem 挂的 _kbToggle）。
    isGridKeyboardMode() {
        return this.activeTab === 'reader' &&
            (this.readerState === 'books' || this.readerState === 'chapters') &&
            this.keyboardNavEnabled();
    }

    getGridItemTop(el) {
        try {
            if (el && typeof el.getBoundingClientRect === 'function') {
                const r = el.getBoundingClientRect();
                if (r && typeof r.top === 'number' && isFinite(r.top)) return r.top;
            }
        } catch (err) { /* 忽略 */ }
        if (el && typeof el.offsetTop === 'number' && isFinite(el.offsetTop)) return el.offsetTop;
        return null;
    }

    // 按视觉行分组（同一行按钮的 top 相同）。几何不可用时返回空数组，
    // 调用方退化为按固定列数移动，保证极简 DOM / 尚未布局时方向键仍可用。
    getGridKeyboardRows(items) {
        const rows = [];
        let cur = null, curTop = null;
        for (let i = 0; i < items.length; i++) {
            const top = this.getGridItemTop(items[i]);
            if (top == null) return [];
            if (curTop == null || Math.abs(top - curTop) > 2) {
                cur = [];
                rows.push(cur);
                curTop = top;
            }
            cur.push(i);
        }
        return rows.length > 1 ? rows : [];
    }

    moveGridKeyboardCursor(dir) {
        const items = this.getKeyboardItems();
        if (!items.length) return false;
        const FALLBACK_COLS = 5;   // 手机窄屏常见的每行 5 个
        let idx;
        if (!this._kbCursorVisible || this._kbCursorIdx == null || this._kbCursorIdx < 0) {
            // 还没唤出选框：从当前滚动到的内容开始，而不是一律回到第一 / 最后一条
            const anchor = this._kbScrollAnchorIdx;
            idx = (anchor >= 0 && anchor < items.length)
                ? anchor
                : (dir === 'up' || dir === 'left' ? items.length - 1 : 0);
        } else if (dir === 'left' || dir === 'right') {
            idx = this._kbCursorIdx + (dir === 'right' ? 1 : -1);
        } else {
            // ↑ / ↓ 优先按视觉行上下移动并保持列；拿不到行信息时按固定列数
            const rows = this.getGridKeyboardRows(items);
            const cur = this._kbCursorIdx;
            if (rows.length) {
                const r = rows.findIndex(row => row.indexOf(cur) >= 0);
                if (r < 0) idx = cur + (dir === 'down' ? 1 : -1);
                else {
                    const col = rows[r].indexOf(cur);
                    const target = rows[r + (dir === 'down' ? 1 : -1)];
                    if (!target || !target.length) return false;   // 已在首 / 末行
                    idx = target[Math.min(col, target.length - 1)];
                }
            } else {
                idx = cur + (dir === 'down' ? FALLBACK_COLS : -FALLBACK_COLS);
            }
        }
        idx = Math.max(0, Math.min(items.length - 1, idx));
        this._kbCursorVisible = true;
        this._kbCursorIdx = idx;
        this._kbCursorKey = items[idx]._kbKey || null;
        this._kbCursorFresh = false;
        this._kbScrollAnchorIdx = -1;
        this.applyKeyboardCursor();
        const el = items[idx];
        if (el && typeof el.scrollIntoView === 'function') {
            this.suppressKeyboardScrollSync();
            try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
            catch (err) { try { el.scrollIntoView(); } catch (e2) { /* 忽略 */ } }
        }
        return true;
    }

    getKeyboardCursorCard() {
        const items = this.getKeyboardItems();
        if (!items.length) return null;
        const idx = this._kbCursorIdx == null ? 0 : Math.max(0, Math.min(items.length - 1, this._kbCursorIdx));
        return items[idx] || null;
    }

    keyboardToggleSelection() {
        if (!this._kbCursorVisible) this.moveKeyboardCursor(1);
        const card = this.getKeyboardCursorCard();
        if (card && typeof card._kbToggle === 'function') card._kbToggle();
        this.applyKeyboardCursor();
    }

    keyboardToggleSide() {
        if (!this._kbCursorVisible) this.moveKeyboardCursor(1);
        let card = this.getKeyboardCursorCard();
        if (!card) return;
        // 「并」只在选中后可用：未选中时先选中，再切换并列
        if (!card._kbSelected && typeof card._kbToggle === 'function') {
            card._kbToggle();
            this.applyKeyboardCursor();
            card = this.getKeyboardCursorCard();
            if (!card) return;
        }
        if (typeof card._kbSide === 'function') card._kbSide();
        this.applyKeyboardCursor();
    }

    keyboardClearAll() {
        if (typeof this.clearAllSelections === 'function') this.clearAllSelections();
        this.applyKeyboardCursor();
    }

    // X：本页全选 / 取消本页选中。逐条走各自的 _kbToggle，保证「保留候选」、序号、
    // 并列状态与手动点选完全一致；批量期间抑制逐条整页重绘，最后统一重绘一次。
    keyboardSelectAllPage() {
        if (this.isGridKeyboardMode()) return;   // 书卷 / 章目录没有「选中」概念
        const items = this.getKeyboardItems();
        if (!items.length) return;
        const allSelected = items.every(el => !!el._kbSelected);
        // 先把动作闭包固化下来：选中会重绘列表，旧节点上的引用会失效
        const actions = items
            .filter(el => typeof el._kbToggle === 'function' && (allSelected ? !!el._kbSelected : !el._kbSelected))
            .map(el => el._kbToggle);
        if (!actions.length) return;
        this._kbBatchSelecting = true;
        try { actions.forEach(fn => fn()); }
        finally { this._kbBatchSelecting = false; }
        if (this.activeTab === 'reader' && this.readerState === 'content') {
            this.refreshAllReaderCards();
            if (typeof this.refreshNotePanels === 'function') this.refreshNotePanels();
        } else if (typeof this.renderResults === 'function') {
            this.renderResults();
        }
        this.updateKeepCandidatesUI();
        this.applyKeyboardCursor();
    }

    keyboardToggleFocusMode() {
        if (typeof this.toggleFocusMode === 'function') this.toggleFocusMode();
    }

    keyboardSwitchTab() {
        this.switchTab(this.activeTab === 'reader' ? 'search' : 'reader');
    }

    keyboardToggleCompare() {
        if (typeof this.toggleComparePanel === 'function') this.toggleComparePanel();
    }

    // 判断手势起点 / 终点是否落在不该翻页的元素上
    isSwipeBlockedTarget(target) {
        if (!target || !target.closest) return false;
        // 表单控件与按钮：点选、拖动滑块、输入都不应触发翻页
        if (target.closest('input, textarea, select, button, label, [contenteditable="true"]')) return true;
        // 各类浮层内不翻页
        if (target.closest('.bible-inline-tooltip-host, .bible-inline-tooltip, .bible-projection-fullscreen, .bible-popup-menu, .menu, .suggestion-container, .modal-container')) return true;
        // 内容自身可横向滚动时，把横滑让给该容器
        let node = target;
        while (node && node !== this.container) {
            if (node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 4) {
                try {
                    const ox = typeof getComputedStyle === 'function' ? getComputedStyle(node).overflowX : '';
                    if (ox === 'auto' || ox === 'scroll') return true;
                } catch (err) { /* 忽略 */ }
            }
            node = node.parentElement;
        }
        return false;
    }

    swipeNext() {
        if (this.activeTab === 'reader') {
            if (this.readerState !== 'content') return false;
            return this.goReaderChapter(this.readerChapter + 1);
        }
        return this.goSearchPage(this.currentPage + 1);
    }

    swipePrev() {
        if (this.activeTab === 'reader') {
            if (this.readerState !== 'content') return false;
            return this.goReaderChapter(this.readerChapter - 1);
        }
        return this.goSearchPage(this.currentPage - 1);
    }

    switchTab(tab) {
        // 勾选「保留候选」时，切换标签页也要把当前标签页已选中的候选经文冻结进候选池，
        // 否则最后一次搜索结果中选中、之后才切走的项会丢失（编号不会继续往后累加）
        if (this.keepCandidates && this.activeTab && this.activeTab !== tab) {
            this.freezeSelections(this.activeTab === 'reader' ? 'reader' : 'search');
            if (this.activeTab === 'search' && this.resultsContainer) this.renderResults();
        }
        this.activeTab = tab;
        // 换标签页后选框重新由 ↑/↓ 唤出，避免沿用另一页的行号
        this._kbCursorVisible = false;
        this._kbCursorIdx = -1;
        this._kbCursorKey = null;
        this._kbCursorFresh = false;
        this._kbScrollAnchorIdx = -1;
        // 切换面板时浏览器可能因内容高度变化补一次 scroll，别让它改写锚点
        this.suppressKeyboardScrollSync(150);
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
        this.syncCompareBtnState();
        this.updateTabBarCompact();
        this.refreshTabButtonsVisible();
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
            if (r.selected) list.push({
                item: r.isNote ? this.noteResultItem(r) : r.item,
                selected: true, order: r.order, sideBySide: !!r.sideBySide, _isCompare: false
            });
        }
        // 经文上标展开的注解 / 串珠：同一套序号，跟着一起复制 / 投影
        for (const e of (this.searchNoteEntries || [])) {
            if (!e.selected) continue;
            list.push({ item: e.item, selected: true, order: e.order, sideBySide: !!e.sideBySide, _isCompare: false });
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
        // 经文上标展开的注 / 串选中项一并清除
        this.searchNoteEntries = [];
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
            // 展开中的注解 / 串珠面板里也有候选框，一并刷新，避免残留选中序号
            this.refreshNotePanels();
        } else {
            for (const r of this.results) { r.selected = false; r.sideBySide = false; r.order = 0; }
            this.compareSelections = {};
            this.cmpOrder = [];
            // 经文上标展开的注 / 串也一并清空（展开面板里的候选框同步刷新）
            this.searchNoteEntries = [];
            this.selectCounter = 0;
            this.renderResults();
            this.refreshNotePanels();
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
        // 阅读页展开的注解 / 串珠面板里的候选框也要跟着清空
        this.refreshNotePanels();
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

        // ① 搜索框（放在最上方）
        const inputRow = fixedTop.createDiv({ cls: 'bible-input-row' });
        this.searchInput = inputRow.createEl('input', {
            cls: 'bible-search-input',
            attr: { type: 'text', placeholder: '出处 / 关键词 / 注串出处，如：太1、太1-3、csj1:1、恩典、创1:26注2' }
        });
        const clearBtn = inputRow.createEl('button', { cls: 'bible-input-btn', text: '✕' });
        const searchBtn = inputRow.createEl('button', { cls: 'bible-input-btn bible-search-btn', text: '🔍 查询' });

        this.searchHint = fixedTop.createEl('div', {
            cls: 'bible-search-hint',
            text: '支持：太1:1、路一1～3、太1:1-2:5、创1:26注2 或 关键词；短拼 c / tm 可弹出书卷候选（↑↓ 选择、Enter 确定）'
        });

        // 区块槽位：搜索框下方依次为 检索范围 → 检索种类 → 全局操作 → 本页操作 → 结果简要 → 分页。
        // 先占位、后往各槽里填区块，保证 DOM 顺序（=视觉顺序）不受源码书写顺序影响
        const rangeSlot = fixedTop.createDiv({ cls: 'bible-slot' });
        const typeSlot = fixedTop.createDiv({ cls: 'bible-slot' });
        const actionSlot = fixedTop.createDiv({ cls: 'bible-slot' });
        const pageActionSlot = fixedTop.createDiv({ cls: 'bible-slot' });

        // ② 检索范围（紧跟搜索框下方；默认收起，需要调整时再点开）
        const rangeSection = rangeSlot.createDiv({ cls: 'bible-section' });
        const rangeHeader = rangeSection.createDiv({ cls: 'bible-section-header' });
        const rangeIcon = rangeHeader.createEl('span', { cls: 'bible-section-icon', text: '▶' });
        rangeHeader.createEl('span', { text: '检索范围' });
        // 收起时在标题右侧显示已选书卷数，不必展开也能知道检索范围
        this.rangeCountEl = rangeHeader.createEl('span', { cls: 'bible-range-count', text: '' });
        const rangeBody = rangeSection.createDiv({ cls: 'bible-section-body' });
        rangeBody.style.display = 'none';
        rangeHeader.addEventListener('click', () => {
            const isCollapsed = rangeBody.style.display === 'none';
            rangeBody.style.display = isCollapsed ? 'block' : 'none';
            rangeIcon.textContent = isCollapsed ? '▼' : '▶';
        });
        this.bookSelectWrapper = rangeBody.createDiv({ cls: 'bible-book-select-wrapper' });
        this.bookSelectWrapper.style.display = 'block';
        this.bookSelectCount = this.bookSelectWrapper.createEl('div', { cls: 'bible-book-select-count', text: '已选 0 卷' });
        const bookSelectActions = this.bookSelectWrapper.createDiv({ cls: 'bible-book-select-actions' });
        const oldTestBtn = bookSelectActions.createEl('button', { cls: 'bible-small-btn', text: '旧约' });
        const newTestBtn = bookSelectActions.createEl('button', { cls: 'bible-small-btn', text: '新约' });
        const selectAllBooksBtn = bookSelectActions.createEl('button', { cls: 'bible-small-btn', text: '全选' });
        const clearBooksBtn = bookSelectActions.createEl('button', { cls: 'bible-small-btn', text: '取消' });
        this.oldTestBtn = oldTestBtn;
        this.newTestBtn = newTestBtn;
        this.selectAllBooksBtn = selectAllBooksBtn;

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

        const selectOnlyTestament = (testament) => {
            this.selectedBookIds.clear();
            const books = BIBLE_BOOKS.filter(b => b.testament === testament);
            for (const b of books) {
                this.selectedBookIds.add(b.id);
            }
            this.updateBookSelectUI();
        };
        oldTestBtn.addEventListener('click', () => { selectOnlyTestament('old'); this.scheduleRealTimeSearch(); });
        newTestBtn.addEventListener('click', () => { selectOnlyTestament('new'); this.scheduleRealTimeSearch(); });

        selectAllBooksBtn.addEventListener('click', () => {
            for (const book of BIBLE_BOOKS) { this.selectedBookIds.add(book.id); }
            this.updateBookSelectUI();
            this.scheduleRealTimeSearch();
        });
        clearBooksBtn.addEventListener('click', () => {
            this.selectedBookIds.clear();
            this.updateBookSelectUI();
            this.scheduleRealTimeSearch();
        });

        // 默认即「全选」状态：初始化书卷按钮高亮与计数显示
        this.updateBookSelectUI();

        clearBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            if (typeof this.closeAbbrSuggestion === 'function') this.closeAbbrSuggestion();
            this._abbrDismissed = null;
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

        const actionSection = actionSlot.createDiv({ cls: 'bible-section bible-action-section' });
        const actionHeader = actionSection.createDiv({ cls: 'bible-section-header' });
        // 折叠箭头与阅读页、检索范围、检索种类等区块保持一致；展开态为 ▼，收起后为 ▶
        const actionIcon = actionHeader.createEl('span', { cls: 'bible-section-icon', text: '▼' });
        actionHeader.createEl('span', { text: '全局操作' });
        // 字体大小按钮（与阅读页「全局操作」标题右侧的按钮一致）
        const searchFontBtn = actionHeader.createEl('button', { cls: 'bible-section-font-btn', attr: { title: '字体大小' } });
        setIcon(searchFontBtn, 'type');
        searchFontBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showFontSizePicker(searchFontBtn, 'search');
        });
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
        this.captureCopySelection(copyAllBtn);
        const focusBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '逐节投影' });
        const parallelBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '并列投影' });
        const mixedBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '混合投影' });

        const typeSection = typeSlot.createDiv({ cls: 'bible-section' });
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
            cb.addEventListener('change', () => this.scheduleRealTimeSearch());
        }
        // 恢复本注解：勾选后把注解正文一并纳入检索范围
        const notesLabel = typeBody.createEl('label', { cls: 'bible-checkbox-label' });
        const notesCb = notesLabel.createEl('input', { type: 'checkbox' });
        notesCb.checked = this.plugin.settings.showNotes && !!this.plugin.settings.searchIncludeNotes;
        notesCb.title = '把恢复本注解正文纳入检索范围（仅恢复本）';
        this.searchNotesCheckbox = notesCb;
        notesLabel.createSpan({ text: '注解' });
        notesCb.addEventListener('click', (e) => e.stopPropagation());
        notesCb.addEventListener('change', async () => {
            this.plugin.settings.searchIncludeNotes = notesCb.checked;
            await this.plugin.saveSettings();
            // 首次勾选时按需加载注解数据（约 6MB，随用随读）
            if (notesCb.checked && this.plugin.settings.showNotes && !this.plugin.notesData) {
                if (this.resultsCount) this.resultsCount.setText('正在加载注解数据...');
                await this.plugin.loadNotesData();
                this.plugin.attachNotesToItems();
                if (this.resultsCount) this.resultsCount.setText('');
            }
            if (this.lastSearchQuery) {
                await this.performSearch();
            }
        });

        this.resultsHeader = fixedTop.createDiv({ cls: 'bible-results-header' });
        this.resultsCount = this.resultsHeader.createEl('span', { cls: 'bible-results-count', text: '' });

        const pageActionSection = pageActionSlot.createDiv({ cls: 'bible-section' });
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
        this.searchInput.addEventListener('keydown', (e) => {
            // 补全下拉打开时，方向键 / Enter / Tab / Esc 先给它用；关闭后 Enter 恢复查询
            if (this.handleAbbrSuggestionKey(e)) return;
            if (e.key === 'Enter') this.performSearch();
        });
        this.searchInput.addEventListener('input', (e) => {
            this.refreshAbbrSuggestion(e);
            this.scheduleRealTimeSearch();
        });
        this.setupAbbrSuggestion();
        selectAllBtn.addEventListener('click', () => this.selectAll());
        deselectAllBtn.addEventListener('click', () => this.deselectAll());
        pageSelectAllBtn.addEventListener('click', () => this.selectPageAll());
        copyAllBtn.addEventListener('click', () => this.copyAll());
        this.captureCopySelection(pageCopyBtn);
        pageCopyBtn.addEventListener('click', () => this.copyPageAll());
        focusBtn.addEventListener('click', () => this.openProjection('focus'));
        parallelBtn.addEventListener('click', () => this.openProjection('parallel'));
        mixedBtn.addEventListener('click', () => this.openProjection('mixed'));
    }

    // ===== 搜索框书卷短拼自动补全 =====
    // 下拉挂在 document.body：投影检索分屏态会把主视图整个搬进覆盖层，且侧边栏固定头部有
    // overflow 裁剪，只有 body + fixed 定位才不会被裁掉或跟着滚动。
    setupAbbrSuggestion() {
        const input = this.searchInput;
        if (!input || this._abbrSuggestHandlers) return;
        const self = this;
        const onFocus = () => self.refreshAbbrSuggestion();
        const onClick = () => self.refreshAbbrSuggestion();
        const onKeyUp = (e) => {
            // 左右键 / Home / End 只移动光标、不产生 input 事件，需重新按光标位置算候选
            if (e && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End')) self.refreshAbbrSuggestion();
        };
        const onCompositionEnd = () => self.refreshAbbrSuggestion();
        const onBlur = () => self.closeAbbrSuggestion();
        const onReposition = () => { if (self._abbrSuggest && self._abbrSuggest.open) self.positionAbbrSuggestion(); };
        const onDocDown = (e) => {
            const st = self._abbrSuggest;
            if (!st || !st.open) return;
            const t = e && e.target;
            if (t && t.closest && (t === input || t.closest('.bible-abbr-suggestion'))) return;
            self.closeAbbrSuggestion();
        };
        input.addEventListener('focus', onFocus);
        input.addEventListener('click', onClick);
        input.addEventListener('keyup', onKeyUp);
        input.addEventListener('compositionend', onCompositionEnd);
        input.addEventListener('blur', onBlur);
        window.addEventListener('resize', onReposition);
        window.addEventListener('scroll', onReposition, true);
        document.addEventListener('pointerdown', onDocDown, true);
        this._abbrSuggestHandlers = { input, onFocus, onClick, onKeyUp, onCompositionEnd, onBlur, onReposition, onDocDown };
    }

    destroyAbbrSuggestion() {
        const h = this._abbrSuggestHandlers;
        if (h) {
            h.input.removeEventListener('focus', h.onFocus);
            h.input.removeEventListener('click', h.onClick);
            h.input.removeEventListener('keyup', h.onKeyUp);
            h.input.removeEventListener('compositionend', h.onCompositionEnd);
            h.input.removeEventListener('blur', h.onBlur);
            window.removeEventListener('resize', h.onReposition);
            window.removeEventListener('scroll', h.onReposition, true);
            document.removeEventListener('pointerdown', h.onDocDown, true);
            this._abbrSuggestHandlers = null;
        }
        const st = this._abbrSuggest;
        if (st && st.el && st.el.parentNode) {
            try { st.el.parentNode.removeChild(st.el); } catch (err) { /* 忽略 */ }
        }
        this._abbrSuggest = null;
        this._abbrDismissed = null;
    }

    refreshAbbrSuggestion(e) {
        const input = this.searchInput;
        if (!input || (e && e.isComposing)) return;
        const value = String(input.value == null ? '' : input.value);
        const caret = (typeof input.selectionStart === 'number') ? input.selectionStart : value.length;
        const tok = getAbbrTokenAtCaret(value, caret);
        if (!tok) { this.closeAbbrSuggestion(); return; }
        // 用完整输入值做 key：Esc 之后只要继续输章号 / 改一个字就自动解除抑制
        const key = tok.value + '|' + tok.start + '|' + tok.letters;
        // Esc 关闭后同一个词不再反复弹；文本一变 key 就变，自动解除抑制
        if (this._abbrDismissed === key) { this.closeAbbrSuggestion(); return; }
        this._abbrDismissed = null;
        const cands = getBookAbbrSuggestions(tok.letters, 12);
        if (!cands.length) { this.closeAbbrSuggestion(); return; }
        // 输全的唯一短拼也照常显示（mtfy → 马太福音、lq → 哥林多前书），作为确认提示
        this.renderAbbrSuggestion(cands, isExactAbbrHit(tok.letters, cands));
    }

    renderAbbrSuggestion(cands, exactHit) {
        const doc = document;
        let st = this._abbrSuggest;
        if (!st) {
            const el = doc.createElement('div');
            el.className = 'bible-abbr-suggestion';
            const list = doc.createElement('div');
            list.className = 'bible-abbr-suggestion-list';
            const foot = doc.createElement('div');
            foot.className = 'bible-abbr-suggestion-foot';
            el.appendChild(list);
            el.appendChild(foot);
            doc.body.appendChild(el);
            st = this._abbrSuggest = { el, list, foot, items: [], cands: [], index: 0, open: false };
        }
        st.exactHit = !!exactHit;
        st.foot.textContent = st.exactHit
            ? '已匹配 · Enter 检索 · Esc 取消'
            : '↑↓ 选择 · Enter 确定 · Esc 取消';
        const self = this;
        st.list.textContent = '';
        st.items = cands.map((c, i) => {
            const row = doc.createElement('div');
            row.className = 'bible-abbr-suggestion-item' + (i === 0 ? ' is-active' : '');
            const name = doc.createElement('span');
            name.className = 'bible-abbr-name';
            name.textContent = c.fullName;
            const short = doc.createElement('span');
            short.className = 'bible-abbr-short';
            short.textContent = c.shortName;
            const code = doc.createElement('span');
            code.className = 'bible-abbr-code';
            code.textContent = c.abbr;
            row.appendChild(name);
            row.appendChild(short);
            row.appendChild(code);
            // 抢在 blur 之前选中：否则搜索框先失焦会把下拉关掉，点击事件就落空了
            const pick = (ev) => {
                if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
                self.pickAbbrSuggestion(i);
            };
            row.addEventListener('pointerdown', pick);
            row.addEventListener('mousedown', pick);
            st.list.appendChild(row);
            return row;
        });
        st.cands = cands;
        st.index = 0;
        st.open = true;
        st.el.style.display = 'flex';
        st.el.classList.add('bible-abbr-open');
        this.positionAbbrSuggestion();
    }

    positionAbbrSuggestion() {
        const st = this._abbrSuggest, input = this.searchInput;
        if (!st || !st.el || !input || typeof input.getBoundingClientRect !== 'function') return;
        const r = input.getBoundingClientRect();
        const el = st.el;
        el.style.left = Math.max(4, r.left) + 'px';
        el.style.width = Math.max(200, Math.min(360, r.width || 240)) + 'px';
        const vh = (typeof window !== 'undefined' && window.innerHeight) || 800;
        const h = el.offsetHeight || 240;
        const below = vh - r.bottom;
        // 下方空间不够且上方更宽裕时翻到输入框上方
        if (below < Math.min(h + 8, 160) && r.top > h + 8) el.style.top = Math.max(4, r.top - h - 4) + 'px';
        else el.style.top = (r.bottom + 4) + 'px';
    }

    closeAbbrSuggestion() {
        const st = this._abbrSuggest;
        if (!st || !st.el) return;
        st.open = false;
        st.items = [];
        st.cands = [];
        if (st.el.classList && st.el.classList.remove) st.el.classList.remove('bible-abbr-open');
        st.el.style.display = 'none';
    }

    highlightAbbrSuggestion() {
        const st = this._abbrSuggest;
        if (!st) return;
        st.items.forEach((row, i) => {
            if (i === st.index) row.classList.add('is-active');
            else row.classList.remove('is-active');
        });
        const active = st.items[st.index], box = st.list;
        if (active && box && typeof box.scrollTop === 'number') {
            const top = active.offsetTop || 0, h = active.offsetHeight || 0;
            if (top < box.scrollTop) box.scrollTop = top;
            else if (top + h > box.scrollTop + box.clientHeight) box.scrollTop = top + h - box.clientHeight;
        }
    }

    // 返回 true 表示该键已被补全消费，调用方不要再按 Enter 触发查询
    handleAbbrSuggestionKey(e) {
        const st = this._abbrSuggest;
        if (!st || !st.open || !st.cands || !st.cands.length) return false;
        if (!e || e.isComposing || e.keyCode === 229 || e.ctrlKey || e.metaKey || e.altKey) return false;
        const key = e.key;
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            const n = st.cands.length;
            st.index = (st.index + (key === 'ArrowDown' ? 1 : -1) + n) % n;
            this.highlightAbbrSuggestion();
            e.preventDefault(); e.stopPropagation();
            return true;
        }
        if (key === 'Enter' || key === 'Tab') {
            // 精确提示下补全不会改动文本，收起并放行，让 Enter 直接检索
            if (st.exactHit) { this.closeAbbrSuggestion(); return false; }
            this.pickAbbrSuggestion(st.index);
            e.preventDefault(); e.stopPropagation();
            return true;
        }
        if (key === 'Escape') {
            const input = this.searchInput;
            const value = String(input.value == null ? '' : input.value);
            const caret = (typeof input.selectionStart === 'number') ? input.selectionStart : value.length;
            const tok = getAbbrTokenAtCaret(value, caret);
            if (tok) this._abbrDismissed = tok.value + '|' + tok.start + '|' + tok.letters;
            this.closeAbbrSuggestion();
            e.preventDefault(); e.stopPropagation();
            return true;
        }
        return false;
    }

    pickAbbrSuggestion(i) {
        const st = this._abbrSuggest;
        if (!st || !st.open) return;
        const cand = st.cands[i];
        if (!cand) return;
        const input = this.searchInput;
        const value = String(input.value == null ? '' : input.value);
        const caret = (typeof input.selectionStart === 'number') ? input.selectionStart : value.length;
        const applied = applyBookAbbrSuggestion(value, caret, cand);
        if (!applied) { this.closeAbbrSuggestion(); return; }
        input.value = applied.value;
        try { input.setSelectionRange(applied.caret, applied.caret); } catch (err) { /* 忽略 */ }
        this.closeAbbrSuggestion();
        // 保持「输入即检索」的一致性；短拼还没带章号时按关键词检索，接着输章号即可
        if (typeof this.scheduleRealTimeSearch === 'function') this.scheduleRealTimeSearch();
    }

    buildReaderTab() {
        this.readerPanel = this.container.createDiv({ cls: 'bible-tab-panel' });
        this.readerPanel.style.display = 'none';
        this.readerFixedTop = this.readerPanel.createDiv({ cls: 'bible-reader-fixed-top' });
        this.readerScrollArea = this.readerPanel.createDiv({ cls: 'bible-reader-scroll-area' });
        this.readerContent = this.readerScrollArea.createDiv({ cls: 'bible-reader-content-inner' });
    }

    getRangeValue() {
        // 已移除「全部圣经 / 选择范围」单选，始终按选中的书卷范围检索
        return 'multi';
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
        this.scheduleRealTimeSearch();
    }

    updateBookSelectUI() {
        const buttons = this.bookSelectWrapper.querySelectorAll('.bible-book-grid-btn');
        for (const btn of buttons) {
            const id = parseInt(btn.dataset.bookId);
            if (this.selectedBookIds.has(id)) btn.classList.add('active');
            else btn.classList.remove('active');
        }
        const oldBooks = BIBLE_BOOKS.filter(b => b.testament === 'old');
        const newBooks = BIBLE_BOOKS.filter(b => b.testament === 'new');
        if (this.oldTestBtn) {
            const allOld = oldBooks.length > 0 && oldBooks.every(b => this.selectedBookIds.has(b.id));
            this.oldTestBtn.classList.toggle('active', allOld);
        }
        if (this.newTestBtn) {
            const allNew = newBooks.length > 0 && newBooks.every(b => this.selectedBookIds.has(b.id));
            this.newTestBtn.classList.toggle('active', allNew);
        }
        if (this.selectAllBooksBtn) {
            this.selectAllBooksBtn.classList.toggle('active', this.selectedBookIds.size === BIBLE_BOOKS.length);
        }
        this.updateBookSelectCount();
    }

    updateBookSelectCount() {
        const count = this.selectedBookIds.size;
        if (this.bookSelectCount) this.bookSelectCount.setText('已选 ' + count + ' 卷');
        // 检索范围收起时，把「已选 N 卷」显示在标题右侧
        if (this.rangeCountEl) {
            const total = BIBLE_BOOKS.length;
            this.rangeCountEl.setText(count === total ? '（全部）' : '（已选 ' + count + ' 卷）');
        }
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
        // 专注模式会隐藏大量区块，布局重排后立刻核一次标签栏，
        // 保证两个按钮不会被挤到可见区外（这正是「点专注后按钮消失」的另一条路径）
        this.updateTabBarCompact();
    }

    updateFocusModeBtn() {
        if (!this.focusModeBtn) return;
        const on = this.activeTab === 'search' ? !!this.searchFocusMode : !!this.readerFocusMode;
        const label = on ? '取消' : '专注';
        if (this.focusModeBtn.textContent !== label) this.focusModeBtn.textContent = label;
        // 明确的激活态：浅色 / 深色主题下都能看出当前在专注模式，退出入口不会「消失」
        try {
            if (this.focusModeBtn.classList && typeof this.focusModeBtn.classList.toggle === 'function')
                this.focusModeBtn.classList.toggle('active', on);
            this.focusModeBtn.title = on ? '退出专注模式' : '进入专注模式';
            // 清掉可能存在的内联隐藏，可见性一律由 CSS 决定
            this.focusModeBtn.style.removeProperty('display');
            this.focusModeBtn.style.removeProperty('visibility');
            this.focusModeBtn.style.removeProperty('opacity');
        } catch (err) { /* 忽略 */ }
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
        // 只勾「注解」也算一种检索范围：自动补上 verse，但只匹配注解正文
        const notesChecked = !!this.searchNotesCheckbox && this.searchNotesCheckbox.checked;
        const verseChecked = types.includes('verse');
        const notesOnly = notesChecked && !verseChecked;
        if (notesChecked && !verseChecked) types.push('verse');
        if (types.length === 0) { new Notice('请至少选择一种检索类型'); return; }
        if (notesChecked && !this.plugin.settings.showNotes) {
            new Notice('注解显示已关闭，请在「对照 → 恢复本注解」里打开');
        }

        // 先解析一次查询：检出「按注 / 串出处检索」这类查询后，即使没勾「注解」也要保证注解数据在位
        const preParsed = this.plugin.searchEngine ? this.plugin.searchEngine.parseQuery(query) : null;
        const hasNoteRef = !!(preParsed && preParsed.noteRefs && preParsed.noteRefs.length > 0);

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

        if (hasNoteRef && !this.plugin.settings.showNotes) {
            new Notice('检索注 / 串出处需要先开启「恢复本注解」，请在「对照 → 恢复本注解」里打开');
        }

        // 结果项要显示注/串标记，先确保注解数据已加载（与「是否搜注解正文」是两件事）
        if (this.plugin.settings.showNotes) {
            if (!this.plugin.notesData) this.resultsCount.setText('正在加载注解数据...');
            await this.plugin.loadNotesData();
            this.plugin.attachNotesToItems();
        }
        const wantNotes = this.plugin.settings.showNotes && notesChecked;
        if (wantNotes && !this.plugin.notesData) {
            new Notice('注解数据未安装，请在「对照 → 恢复本注解」里点「下载安装」');
        }
        this.plugin.searchEngine.setIncludeNotes(wantNotes);
        this.plugin.searchEngine.setNotesOnly(wantNotes && notesOnly);

        // 勾选「保留候选」时，把当前已选中的候选经文（主版本 + 对照）按原顺序冻结进候选池，
        // 重新搜索后依然保留，并可继续按原顺序追加新选择
        if (this.keepCandidates) this.freezeSelections('search');

        this.results = this.plugin.searchEngine.search(query, types, rangeValue, bookIds, primaryKey);
        this.selectCounter = 0;
        this.compareSelections = {};  // 清空对照经文选中状态
        this.cmpOrder = [];
        // 上一轮结果里展开的注 / 串选中项随结果一起作废
        this.searchNoteEntries = [];

        // 保存搜索条件，用于版本顺序改变后重新搜索
        this.lastSearchQuery = query;
        this.lastSearchTypes = types;
        this.lastRangeValue = rangeValue;
        this.lastBookIds = bookIds;

        const parsed = preParsed || this.plugin.searchEngine.parseQuery(query);
        this.keywords = parsed.keywords;
        this.updateKeepCandidatesUI();
        this.renderResults();
    }

    // 实时检索：搜索框输入 / 检索范围变化 / 检索种类变化后自动刷新结果（去抖），不再强依赖「查询」按钮
    scheduleRealTimeSearch() {
        if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
        this._searchDebounceTimer = setTimeout(() => this.performSearchLive(), 250);
    }

    performSearchLive() {
        const query = this.searchInput.value.trim();
        if (!query) {
            // 输入为空：清空结果并恢复空态，不打扰用户（不弹 Notice）
            this.results = [];
            this.keywords = [];
            this.lastSearchQuery = '';
            if (this.resultsContainer) {
                this.resultsContainer.empty();
                this.resultsContainer.createEl('div', { cls: 'bible-empty-state', text: '请输入检索内容后点击查询' });
            }
            if (this.resultsCount) this.resultsCount.setText('');
            if (this.paginationEl) this.paginationEl.empty();
            return;
        }
        this.performSearch();
    }

    getPagedResults() {
        const start = this.currentPage * this.pageSize;
        return this.results.slice(start, start + this.pageSize);
    }

    getTotalPages() {
        return Math.ceil(this.results.length / this.pageSize);
    }

    // 翻到指定页（页码从 0 起）：按钮、跳转框与左右滑动共用，翻页后回到结果区顶部
    goSearchPage(n) {
        const total = this.getTotalPages();
        if (total < 1 || n < 0 || n >= total || n === this.currentPage) return false;
        this.currentPage = n;
        this.resetKeyboardCursorForNewView();
        this.renderResults();
        if (this.searchScrollArea) this.searchScrollArea.scrollTop = 0;
        this.settleKeyboardCursorAfterTurn();
        return true;
    }

    renderResults() {
        this.refreshTabButtonsVisible();
        this._renderedPoolVersion = this._poolVersion;
        this.resultsContainer.empty();
        this.updateSearchFontSize();
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

        const noteHits = this.results.filter(r => r.isNote).length;
        let countText = '共找到 ' + this.results.length + ' 条' + (noteHits === this.results.length && noteHits > 0 ? '注解' : '结果');
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
            prevBtn.addEventListener('click', () => this.goSearchPage(this.currentPage - 1));

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
                firstBtn.addEventListener('click', () => this.goSearchPage(0));
                if (startPage > 1) pageNav.createEl('span', { cls: 'bible-page-ellipsis', text: '…' });
            }

            for (let i = startPage; i <= endPage; i++) {
                const btn = pageNav.createEl('button', { text: String(i + 1), cls: 'bible-page-btn' + (i === this.currentPage ? ' active' : '') });
                btn.addEventListener('click', () => this.goSearchPage(i));
            }

            if (endPage < totalPages - 1) {
                if (endPage < totalPages - 2) pageNav.createEl('span', { cls: 'bible-page-ellipsis', text: '…' });
                const lastBtn = pageNav.createEl('button', { text: String(totalPages), cls: 'bible-page-btn' });
                lastBtn.addEventListener('click', () => this.goSearchPage(totalPages - 1));
            }

            const nextBtn = pageNav.createEl('button', { text: '▶', cls: 'bible-page-btn' });
            nextBtn.disabled = this.currentPage >= totalPages - 1;
            nextBtn.addEventListener('click', () => this.goSearchPage(this.currentPage + 1));

            const jumpWrapper = pageNav.createDiv({ cls: 'bible-page-jump' });
            jumpWrapper.createEl('span', { cls: 'bible-page-jump-label', text: '跳转' });
            const jumpInput = jumpWrapper.createEl('input', { cls: 'bible-page-jump-input', attr: { type: 'text', placeholder: '' } });
            jumpWrapper.createEl('span', { cls: 'bible-page-jump-label', text: '/' + totalPages });
            const jumpBtn = jumpWrapper.createEl('button', { cls: 'bible-page-btn', text: 'Go' });
            const doJump = () => {
                const page = parseInt(jumpInput.value);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    this.goSearchPage(page - 1);
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
            // 注解结果：显示「出处 + 注解正文」，与经文结果共用同一套选中 / 复制 / 投影
            if (result.isNote) {
                this.renderNoteResultCard(result, globalIdx);
                continue;
            }

            const selState = this.getSelectionState(item, false, !!result.selected, result.order, result.sideBySide);

            const card = this.resultsContainer.createDiv({ cls: 'bible-result-card' + (selState.selected ? ' selected' : '') + (item.type === 'outline' ? ' outline-type' : '') });
            this.markKeyboardItem(card, {
                key: 's:' + globalIdx,
                toggle: () => this.toggleSelection(globalIdx),
                side: () => this.toggleSideBySide(globalIdx),
                selected: selState.selected
            });
            const cardHeader = card.createDiv({ cls: 'bible-result-header' });
            const checkbox = cardHeader.createDiv({ cls: 'bible-result-checkbox' + (selState.selected ? ' checked' : '') });
            if (selState.selected) checkbox.setText(String(selState.order));

            let refText = item.bookShortName + item.chapter + ':' + item.verse + (item.part || '');
            if (item.type === 'theme') refText = item.bookFullName + ' 主题';
            else if (item.type === 'outline') refText = item.bookFullName + ' 纲目';
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

            // 恢复本注解 / 串珠：经文内嵌 ¹ ᵃ 上标，点击展开对应注解或串珠
            const nd = item.type === 'verse'
                ? this.plugin.getVerseNotes(item.bookId, item.chapter, item.verse, item.part)
                : null;
            if (nd && nd.m && nd.m.length) {
                this.plugin.renderTextWithMarkers(contentEl, displayText, nd.m, (kind, label) => {
                    this.toggleVerseNotePanel(card, item, nd, kind, label, 'search');
                }, item.type === 'verse' ? this.keywords : null);
            } else if (this.keywords.length > 0 && item.type === 'verse') {
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
        this.applyKeyboardCursor();
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
        // 经文上标展开的注 / 串与检索结果统一编号
        for (const e of (this.searchNoteEntries || [])) {
            if (e.selected) selected.push({ noteEntry: e, type: 'note', order: e.order });
        }
        // 按原始顺序重新编号
        selected.sort((a, b) => a.order - b.order);
        for (let i = 0; i < selected.length; i++) {
            const entry = selected[i];
            if (entry.type === 'main') {
                entry.result.order = i + 1;
            } else if (entry.type === 'note') {
                entry.noteEntry.order = i + 1;
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
        // 注解结果用包装出的注条目参与选中，与经文结果共用同一套序号
        const selItem = result.isNote ? this.noteResultItem(result) : result.item;
        // 取消选中：同时移出候选池并清除局部选中（勾选「保留候选」时两者是镜像关系）
        const poolIdx = this.poolIndexOf(selItem, false);
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
            this.poolSyncSelect(selItem, false, false, 'search');
        }
        this.recalcOrders();
        this.updateKeepCandidatesUI();
        // X 全选时由调用方统一重绘一次，避免每选一条就重建整页
        if (!this._kbBatchSelecting) this.renderResults();
    }

    toggleSideBySide(index) {
        const result = this.results[index];
        if (!result) return;
        const poolIdx = this.poolIndexOf(result.isNote ? this.noteResultItem(result) : result.item, false);
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
        for (const result of this.results) {
            result.selected = true; result.sideBySide = false; this.selectCounter++; result.order = this.selectCounter;
        }
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
        // 经文上标展开的注 / 串也一并取消
        if (this.searchNoteEntries) this.searchNoteEntries = [];
        if (this.readerContent) this.refreshNotePanels();
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
                lines.push(`⌈${item.versionKey.toLowerCase()}⌋${item.bookShortName}${item.chapter}:${item.verse}${item.part || ''} ${item.content}`);
            } else if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
            else if (item.type === 'outline') lines.push('> ' + item.content);
            else if (item.type === 'note' || item.type === 'chain') lines.push((item.ref || '') + '\n' + item.content);
            else lines.push(item.bookShortName + item.chapter + ':' + item.verse + (item.part || '') + ' ' + item.content);
        }
        this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + selected.length + ' 条内容'); }).catch(() => new Notice('复制失败'));
    }

    copyAll() {
        if (this.copyPendingSelectionIfAny()) return;
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

    // 在「复制」按钮上记录用户当前高亮的文字（mousedown 时抓，避免点击后选中被清空）
    captureCopySelection(btn) {
        if (!btn) return;
        btn.addEventListener('mousedown', () => {
            try { const s = window.getSelection(); this._pendingCopyText = s ? s.toString() : ''; }
            catch (e) { this._pendingCopyText = ''; }
        });
    }

    // 若用户已高亮文字，则优先复制该文字并返回 true（调用方应直接 return）
    copyPendingSelectionIfAny() {
        const sel = (this._pendingCopyText || '').trim();
        this._pendingCopyText = '';
        if (!sel) return false;
        this.copyToClipboard(sel)
            .then(() => new Notice('已复制选中的文字'))
            .catch(() => new Notice('复制失败'));
        return true;
    }

    copyPageAll() {
        if (this.copyPendingSelectionIfAny()) return;
        const paged = this.getPagedResults();
        // 本页包含的经文（主版本 + 其对照版本）
        const pageKeys = new Set();
        for (const result of paged) {
            pageKeys.add(this.identityOfItem(result.item, false));
            // 检索结果本身就是注解 / 串珠条目时，可直接复制的是注文本身，而不是它所在的经文
            if (result.isNote) pageKeys.add(this.identityOfItem(this.noteResultItem(result), false));
            if (this.hasCompareMode() && result.item.type === 'verse') {
                for (const cmp of this.findCompareItems(result.item.bookId, result.item.chapter, result.item.verse, result.item.type)) {
                    pageKeys.add(this.identityOfItem(cmp.item, true));
                }
            }
        }
        // 本页经文上标展开的注解 / 串珠：宿主经文在本页时也算「本页」内容。
        // 少了这一步，勾选注 / 串后点「本页复制」会被过滤掉，只能走「全局复制」。
        for (const e of (this.searchNoteEntries || [])) {
            const parents = e.parentKeys || [];
            if (parents.length === 0 || parents.some(k => pageKeys.has(k))) {
                pageKeys.add(this.identityOfItem(e.item, false));
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
    // 允许空列表：没有选中经文时也能打开投影，顶部常驻搜索框可直接输入出处投影内容
    projectSelections(list, mode) {
        const selected = (list || []).filter(r => r && r.selected).sort((a, b) => (a.order || 0) - (b.order || 0));
        // 若已有投影（例如通过「检索」进入的分屏模式），直接复用并更新内容，避免叠加覆盖层。
        // 空列表时不覆盖已有内容：多半是按 Q/W/E 想切模式，空列表会把正在投影的内容清掉
        if (this.plugin.currentProjection) {
            if (selected.length === 0) this.plugin.currentProjection.setMode(mode);
            else this.plugin.currentProjection.reloadResults(selected, mode);
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
            this.createGridBookButton(oldGrid, book);
        }
        this.readerContent.createEl('h4', { cls: 'bible-reader-label', text: '新约' });
        const newGrid = this.readerContent.createDiv({ cls: 'bible-reader-grid' });
        for (const book of BIBLE_BOOKS.filter(b => b.testament === 'new')) {
            this.createGridBookButton(newGrid, book);
        }
        this.resetKeyboardCursorForNewView();
        this.applyKeyboardCursor();
    }

    // 书卷 / 章节网格的按钮复用同一套键盘选框：鼠标、触屏点击与「方向键 + 空格」
    // 全部走同一个入口，避免出现两套选中逻辑。
    createGridBookButton(grid, book) {
        const btn = grid.createEl('button', { cls: 'bible-reader-book-btn', text: book.shortName });
        btn.title = book.fullName;
        btn.addEventListener('click', () => this.enterBook(book));
        this.markKeyboardItem(btn, {
            key: 'g:book:' + book.id,
            toggle: () => this.enterBook(book),
            side: null,
            selected: false
        });
        return btn;
    }

    createGridChapterButton(grid, book, chapter) {
        const btn = grid.createEl('button', { cls: 'bible-reader-chapter-btn', text: String(chapter) });
        btn.addEventListener('click', () => this.enterChapter(chapter));
        this.markKeyboardItem(btn, {
            key: 'g:ch:' + book.id + ':' + chapter,
            toggle: () => this.enterChapter(chapter),
            side: null,
            selected: false
        });
        return btn;
    }

    enterBook(book) {
        this.readerBook = book;
        this.readerState = 'chapters';
        this.renderReader();
    }

    enterChapter(chapter) {
        this.readerChapter = chapter;
        this.readerState = 'content';
        // 章目录的按钮编号与章内经文行号无关，换页后让选框重新落到页内新目标
        this.resetKeyboardCursorForNewView();
        this.renderReader();
    }

    renderChapterList() {
        const book = this.readerBook;
        if (!book) { this.readerState = 'books'; this.renderReader(); return; }
        const nav = this.readerContent.createDiv({ cls: 'bible-reader-nav-row' });
        const backBtn = nav.createEl('button', { cls: 'bible-reader-nav-btn', text: '返回' });
        backBtn.addEventListener('click', () => this.gridGoBack());
        const titleGroup = nav.createEl('span', { cls: 'bible-reader-nav-title' });
        const bookLabel = titleGroup.createEl('span', { cls: 'bible-reader-nav-pill', text: book.id + '. ' + book.fullName });
        bookLabel.createEl('span', { cls: 'bible-reader-nav-caret', text: ' ▼' });
        bookLabel.addEventListener('click', () => this.showBookPicker(bookLabel));
        const grid = this.readerContent.createDiv({ cls: 'bible-reader-grid' });
        for (let i = 1; i <= book.maxChapters; i++) {
            this.createGridChapterButton(grid, book, i);
        }
        this.resetKeyboardCursorForNewView();
        this.applyKeyboardCursor();
    }

    // 章节目录里按 Esc / Backspace 退回书卷列表，和「返回」按钮一致
    gridGoBack() {
        if (this.activeTab !== 'reader' || this.readerState !== 'chapters') return false;
        this.readerState = 'books';
        this.renderReader();
        return true;
    }

    // 按书卷顺序解析「相对偏移」后的目标章：越过本卷首 / 末章时自动跨到相邻书卷。
    // 例如创 50 再往后 = 出 1，出 1 再往前 = 创 50；创 1 往前、启 22 往后返回 null。
    resolveReaderChapter(book, chapter, delta) {
        if (!book) return null;
        let b = book, ch = chapter + delta;
        let guard = 0;
        while (guard++ < 200) {
            if (ch >= 1 && ch <= b.maxChapters) return { book: b, chapter: ch };
            const idx = BIBLE_BOOKS.findIndex(x => x.id === b.id);
            if (idx < 0) return null;
            if (ch < 1) {
                if (idx === 0) return null;
                b = BIBLE_BOOKS[idx - 1];
                ch += b.maxChapters;
            } else {
                if (idx >= BIBLE_BOOKS.length - 1) return null;
                ch -= b.maxChapters;
                b = BIBLE_BOOKS[idx + 1];
            }
        }
        return null;
    }

    // 上一章 / 下一章：手势、页码按钮与键盘共用。n 是「以本卷为基准的章号」，
    // 小于 1 或大于本卷章数时按书卷顺序跨卷；切章后回到章首。
    // 选中状态按「保留候选」的规则在 renderChapterContent 里处理（chapterKey 含书卷 id）。
    goReaderChapter(n) {
        const book = this.readerBook;
        if (!book) return false;
        const target = this.resolveReaderChapter(book, this.readerChapter, n - this.readerChapter);
        if (!target) return false;
        if (target.book.id === book.id && target.chapter === this.readerChapter) return false;
        this.readerBook = target.book;
        this.readerChapter = target.chapter;
        this.readerState = 'content';
        this.resetKeyboardCursorForNewView();
        this.renderReader();
        if (this.readerContent) this.readerContent.scrollTop = 0;
        // 真正的滚动容器是 .bible-reader-scroll-area，内层 .bible-reader-content-inner 不滚动
        if (this.readerScrollArea) this.readerScrollArea.scrollTop = 0;
        this.settleKeyboardCursorAfterTurn();
        return true;
    }

    async renderChapterContent() {
        this.refreshTabButtonsVisible();
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
        this.captureCopySelection(copySelectedBtn);
        const focusProjBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '逐节投影' });
        const parallelProjBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '并列投影' });
        const mixedProjBtn = actionBody.createEl('button', { cls: 'bible-action-btn', text: '混合投影' });

        if (this.plugin.allItems.length === 0) await this.plugin.loadBibleData();
        // 注解/串珠数据按需加载（首次进入章内容时读一次）
        if (this.plugin.settings.showNotes) await this.plugin.loadNotesData();

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
        // 标题右侧：上一章 / 下一章（符号按钮，置右，尽量小）
        const chapterNav = pageActionHeader.createDiv({ cls: 'bible-section-chapter-nav' });
        const prevChBtn = chapterNav.createEl('button', { cls: 'bible-section-chapter-btn' });
        const nextChBtn = chapterNav.createEl('button', { cls: 'bible-section-chapter-btn' });
        setIcon(prevChBtn, 'chevron-left');
        setIcon(nextChBtn, 'chevron-right');
        // 跨书卷连翻：本卷首 / 末章时按钮仍可用，指向相邻书卷的首 / 末章
        const prevTarget = this.resolveReaderChapter(book, chapter, -1);
        const nextTarget = this.resolveReaderChapter(book, chapter, 1);
        prevChBtn.disabled = !prevTarget;
        nextChBtn.disabled = !nextTarget;
        prevChBtn.title = prevTarget
            ? `上一章（${prevTarget.book.fullName} ${prevTarget.chapter}章）`
            : '已经是第一卷第一章';
        nextChBtn.title = nextTarget
            ? `下一章（${nextTarget.book.fullName} ${nextTarget.chapter}章）`
            : '已经是最后一卷最后一章';
        // 这两个按钮不能触发标题的折叠，否则点一下就把本页操作收起来了
        prevChBtn.addEventListener('click', (e) => { e.stopPropagation(); this.goReaderChapter(chapter - 1); });
        nextChBtn.addEventListener('click', (e) => { e.stopPropagation(); this.goReaderChapter(chapter + 1); });
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
        this.applyKeyboardCursor();

        // ========== 全局操作函数 ==========
        const doGlobalSelectAll = () => {
            // 按顺序选中此卷书所有章节的主版本内容
            const allItems = [...allBookThemeItems, ...allBookItems];
            for (const item of allItems) {
                const existingIdx = this.readerEntryIdx(item);
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
            // 注解 / 串珠的候选框嵌在展开面板里，不属于经文卡片，需要单独刷新
            this.refreshNotePanels();
            new Notice('已取消全部选中');
        };

        const buildCopyLines = (selected) => {
            const lines = [];
            for (const r of selected) {
                const item = r.item;
                if (r._isCompare) {
                    lines.push(`⌈${item.versionKey.toLowerCase()}⌋${item.bookShortName}${item.chapter}:${item.verse}${item.part || ''} ${item.content}`);
                } else if (item.type === 'theme') lines.push(item.bookFullName + ' 主题：' + item.content);
                else if (item.type === 'outline') lines.push('> ' + item.content);
                // 注解 / 串珠：行首用带标记号的出处（如「创1:26注2」「创1:26串a」），正文另起行
                else if (item.type === 'note' || item.type === 'chain') lines.push((item.ref || '') + '\n' + (item.content || ''));
                else lines.push(item.bookShortName + item.chapter + ':' + item.verse + (item.part || '') + ' ' + item.content);
            }
            return lines;
        };

        const doGlobalCopy = () => {
            if (this.copyPendingSelectionIfAny()) return;
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
                const existingIdx = this.readerEntryIdx(item);
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
            if (this.copyPendingSelectionIfAny()) return;
            // 本章选中项（含候选池中属于本章的保留项）
            const pageSelected = this.getAllSelections().filter(s => s.item.bookId === book.id && s.item.chapter === chapter);
            if (pageSelected.length === 0) { new Notice('本章没有选中的内容'); return; }
            const lines = buildCopyLines(pageSelected);
            this.copyToClipboard(lines.join('\n\n')).then(() => { new Notice('已复制 ' + pageSelected.length + ' 条本章选中项'); });
        };

        // 本页操作「经文 / 纲目」：只选中本章该类型的全部内容（取消本页其它类型的选中）
        const selectPageByType = (type) => {
            const pageItems = this.readerChapter === 1 ? [...themeItems, ...items] : [...items];
            const newlySelected = [];
            const deselected = [];
            for (const item of pageItems) {
                const existingIdx = this.readerEntryIdx(item);
                if (item.type === type) {
                    if (existingIdx === -1) {
                        const entry = { item: item, selected: true, order: 0, sideBySide: false };
                        this.readerResults.push(entry);
                        newlySelected.push(entry);
                    } else {
                        const e = this.readerResults[existingIdx];
                        e.selected = true; e.sideBySide = false; e.order = 0;
                        newlySelected.push(e);
                    }
                } else {
                    if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
                        const e = this.readerResults[existingIdx];
                        e.selected = false; e.sideBySide = false; e.order = 0;
                        deselected.push(item);
                    }
                }
            }
            this.recalcReaderOrders();
            if (this.keepCandidates) {
                for (const e of newlySelected) this.poolSyncSelect(e.item, !!e._isCompare, false, 'reader');
                for (const it of deselected) this.poolSyncDeselect(it, false);
            }
            this.updateKeepCandidatesUI();
            this.refreshAllReaderCards();
            this.refreshNotePanels();
            const label = type === 'verse' ? '经文' : '纲目';
            new Notice('已只选中本章' + label + '（本页）');
        };

        // ========== 事件绑定 ==========
        selectAllBtn.addEventListener('click', doGlobalSelectAll);
        deselectAllBtn.addEventListener('click', doGlobalDeselectAll);
        copySelectedBtn.addEventListener('click', doGlobalCopy);
        focusProjBtn.addEventListener('click', () => this.openReaderProjection('focus'));
        parallelProjBtn.addEventListener('click', () => this.openReaderProjection('parallel'));
        mixedProjBtn.addEventListener('click', () => this.openReaderProjection('mixed'));

        pageSelectAllBtn.addEventListener('click', doPageSelectAll);
        this.captureCopySelection(pageCopyBtn);
        pageCopyBtn.addEventListener('click', doPageCopy);

        copyVersesBtn.addEventListener('click', () => selectPageByType('verse'));
        copyOutlinesBtn.addEventListener('click', () => selectPageByType('outline'));

        this.updateKeepCandidatesUI();
    }

    // 打开 / 关闭下拉面板的统一入口：再点同一个锚点即关闭，点其它锚点则换到新锚点。
    // build(menu, closeFn) 负责填充面板内容；关闭时同步把箭头指示回正。
    togglePopupMenu(anchorEl, build, menuCls) {
        const prev = this._popupMenu;
        if (prev && prev.el && prev.el.isConnected) {
            prev.el.remove();
            if (prev.cleanup) prev.cleanup();
            this._popupMenu = null;
            this.setNavCaret(prev.anchor, '▼');
            // 点同一个锚点＝关闭，不再重新打开
            if (prev.anchor === anchorEl) return null;
        }
        const menu = document.body.createEl('div', { cls: menuCls });
        const close = () => {
            if (!menu.isConnected) return;
            menu.remove();
            if (this._popupMenu && this._popupMenu.el === menu) this._popupMenu = null;
            this.setNavCaret(anchorEl, '▼');
        };
        build(menu, close);
        // 打开时把当前选中项滚到面板中间，避免选中标记落在可视区外（书卷 66 条、长卷章数上百）
        const activeEl = menu.querySelector('.active');
        if (activeEl) {
            const center = activeEl.offsetTop - menu.clientHeight / 2 + activeEl.offsetHeight / 2;
            menu.scrollTop = Math.max(0, center);
        }
        this.positionPopupMenu(menu, anchorEl);
        const closeHandler = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeHandler);
                if (this._popupMenu && this._popupMenu.el === menu) this._popupMenu = null;
                this.setNavCaret(anchorEl, '▼');
            }
        };
        // 延后注册，避免打开面板的同一次点击立刻把它关掉
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
        this._popupMenu = { el: menu, anchor: anchorEl, cleanup: () => document.removeEventListener('click', closeHandler) };
        this.setNavCaret(anchorEl, '▲');
        return menu;
    }

    // 锚点里的 ▼ / ▲ 指示符
    setNavCaret(anchorEl, ch) {
        if (!anchorEl) return;
        const caret = anchorEl.querySelector('.bible-reader-nav-caret');
        if (caret) caret.textContent = ' ' + ch;
    }

    showBookPicker(anchorEl) {
        const menu = this.togglePopupMenu(anchorEl, (menu, close) => {
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
                        close();
                        this.readerBook = b;
                        this.readerChapter = 1;
                        this.renderReader();
                    });
                }
            }
        }, 'bible-reader-nav-menu bible-reader-nav-menu-books');
        return menu;
    }

    showChapterPicker(anchorEl, book) {
        const menu = this.togglePopupMenu(anchorEl, (menu, close) => {
            const grid = menu.createDiv({ cls: 'bible-reader-nav-menu-chapter-grid' });
            for (let i = 1; i <= book.maxChapters; i++) {
                const item = grid.createEl('div', { cls: 'bible-reader-nav-menu-chip' + (i === this.readerChapter ? ' active' : ''), text: i + '章' });
                item.addEventListener('click', () => {
                    close();
                    this.readerChapter = i;
                    this.renderReader();
                });
            }
        }, 'bible-reader-nav-menu bible-reader-nav-menu-chapters');
        return menu;
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

    // target: 'reader'（阅读页） / 'search'（检索页）
    showFontSizePicker(anchorEl, target) {
        const isSearch = target === 'search';
        const menu = document.body.createEl('div', { cls: 'bible-reader-nav-menu bible-reader-font-picker' });
        const row = menu.createDiv({ cls: 'bible-reader-font-picker-row' });
        const fontSmaller = row.createEl('button', { cls: 'bible-reader-font-picker-btn', text: '−', attr: { title: '缩小字体' } });
        const fontSizeDisplay = row.createEl('span', {
            cls: 'bible-reader-font-picker-size',
            text: (isSearch ? this.searchFontSize : this.readerFontSize) + 'px'
        });
        const fontLarger = row.createEl('button', { cls: 'bible-reader-font-picker-btn', text: '+', attr: { title: '放大字体' } });
        const updateDisplay = () => {
            fontSizeDisplay.setText((isSearch ? this.searchFontSize : this.readerFontSize) + 'px');
            if (isSearch) this.updateSearchFontSize();
            else this.updateReaderFontSize();
        };
        fontSmaller.addEventListener('click', () => {
            if (isSearch) this.searchFontSize = Math.max(10, this.searchFontSize - 1);
            else this.readerFontSize = Math.max(10, this.readerFontSize - 1);
            updateDisplay();
        });
        fontLarger.addEventListener('click', () => {
            if (isSearch) this.searchFontSize = Math.min(32, this.searchFontSize + 1);
            else this.readerFontSize = Math.min(32, this.readerFontSize + 1);
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
        // 允许空列表：阅读页没勾选经文时也能打开投影，用顶部搜索框直接投影
        const selected = this.getAllSelections();
        // 若已有投影，直接复用并更新内容；空列表时只切模式，不清空正在投影的内容
        if (this.plugin.currentProjection) {
            if (selected.length === 0) this.plugin.currentProjection.setMode(mode);
            else this.plugin.currentProjection.reloadResults(selected, mode);
            return;
        }
        const overlay = new BibleProjectionOverlay(this.app, this.plugin, selected, mode, false);
        overlay.open();
    }

    renderReaderItemCard(container, item) {
        const existingIdx = this.readerEntryIdx(item);
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

            let refText = item.bookShortName + item.chapter + ':' + item.verse + (item.part || '');
            if (item.type === 'theme') refText = item.bookFullName + ' 主题';
            header.createEl('span', { cls: 'bible-reader-verse-ref', text: refText });

            // 经文内容：有注解/串珠标记时按锚点插入上标
            const textEl = card.createDiv({ cls: 'bible-reader-verse-text' });
            const nd = this.plugin.getVerseNotes(item.bookId, item.chapter, item.verse, item.part);
            if (nd && nd.m && nd.m.length) {
                this.plugin.renderTextWithMarkers(textEl, item.content, nd.m, (kind, label) => {
                    this.toggleVerseNotePanel(card, item, nd, kind, label, 'reader');
                });
                // 命中高亮：检索注解正文时给经文打底
                if (this._noteHitKey && this._noteHitKey === (item.bookId + '-' + item.chapter + '-' + item.verse)) {
                    textEl.addClass('bible-note-hit');
                }
            } else {
                textEl.setText(item.content);
            }

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

        this.markKeyboardItem(card, {
            key: 'r:' + item.bookId + ':' + item.chapter + ':' + (item.lineIndex != null
                ? item.lineIndex
                : (item.type || '') + ':' + (item.verse || '') + (item.part || '')),
            toggle: () => this.toggleReaderItemSelection(item),
            side: () => this.toggleReaderSideBySide(item),
            selected: selState.selected
        });
    }

    // ==================== 恢复本注解 / 串珠展开面板 ====================
    // 点击经文里的 ¹ ᵃ 上标，在该节卡片下方展开对应注解 / 串珠；再点一次收起
    toggleVerseNotePanel(card, item, nd, kind, label, host) {
        const key = kind + ':' + label;
        const inHost = host || this.activeTab || 'search';
        let panel = card.querySelector(':scope > .bible-note-panel');
        if (panel && panel.getAttribute('data-note-key') === key) {
            panel.remove();
            return;
        }
        if (panel) panel.remove();
        panel = card.createDiv({ cls: 'bible-note-panel' });
        panel.setAttribute('data-note-key', key);
        panel.addEventListener('click', (e) => e.stopPropagation());
        // 记住展开上下文：选中序号变化时可原样重绘面板
        panel._noteCtx = { item: item, nd: nd, kind: kind, label: label, host: inHost };
        this.fillVerseNotePanel(panel, item, nd, kind, label, inHost);
    }

    // 阅读页候选项定位：注解 / 串珠条目与经文字段结构一致，靠 noteKey 区分同一节里的多条注 / 串
    readerEntryIdx(item) {
        return this.readerResults.findIndex(r =>
            r.item.bookId === item.bookId && r.item.chapter === item.chapter && r.item.verse === item.verse &&
            r.item.type === item.type && r.item.content === item.content && !r._isCompare &&
            (r.item.noteKey || '') === (item.noteKey || '')
        );
    }

    // 注解 / 串珠条目的候选框：与所在页面的经文共用同一套序号、候选池、复制与投影。
    // host='reader' 走阅读页选中逻辑，host='search' 走检索页选中逻辑（默认按当前标签页判断）
    renderNoteEntryBoxes(rowEl, noteItem, host, parentItem) {
        const onSearch = (host || this.activeTab) === 'search';
        if (!onSearch) {
            const idx = this.readerEntryIdx(noteItem);
            const local = idx !== -1 ? this.readerResults[idx] : null;
            const st = this.getSelectionState(noteItem, false, !!(local && local.selected),
                local ? local.order : 0, local ? local.sideBySide : false);
            return this.plugin.renderNoteEntryBoxes(rowEl, st, {
                onToggle: () => this.toggleReaderItemSelection(noteItem),
                onToggleSide: () => this.toggleReaderSideBySide(noteItem)
            });
        }
        const entry = this.getSearchNoteEntry(noteItem, parentItem);
        const st = this.getSelectionState(noteItem, false, entry.selected, entry.order, entry.sideBySide);
        return this.plugin.renderNoteEntryBoxes(rowEl, st, {
            onToggle: () => this.toggleSearchNoteSelection(noteItem),
            onToggleSide: () => this.toggleSearchNoteSide(noteItem)
        });
    }

    // 检索页：同一条注 / 串在不同经文卡片里展开时用同一个选中项（按 noteKey 认定）。
    // parentItem 是该注 / 串所属的经文——记录它才能判断这条注属于哪一页结果
    // （「本页复制」只复制本页结果里的内容，见 copyPageAll）
    getSearchNoteEntry(noteItem, parentItem) {
        if (!this.searchNoteEntries) this.searchNoteEntries = [];
        const key = noteItem.noteKey || '';
        let e = this.searchNoteEntries.find(x => (x.item.noteKey || '') === key);
        if (!e) {
            e = { item: noteItem, selected: false, order: 0, sideBySide: false, parentKeys: [] };
            this.searchNoteEntries.push(e);
        } else if (e.item !== noteItem) {
            e.item = noteItem;
        }
        if (parentItem) {
            const pk = this.identityOfItem(parentItem, false);
            if (pk && e.parentKeys.indexOf(pk) === -1) e.parentKeys.push(pk);
        }
        return e;
    }

    toggleSearchNoteSelection(noteItem) {
        const e = this.getSearchNoteEntry(noteItem);
        const poolIdx = this.poolIndexOf(noteItem, false);
        if (e.selected || poolIdx !== -1) {
            if (poolIdx !== -1) this.poolRemoveAt(poolIdx);
            e.selected = false; e.sideBySide = false; e.order = 0;
        } else {
            this.selectCounter++;
            e.selected = true; e.sideBySide = false; e.order = this.selectCounter;
            // 勾选「保留候选」时实时进入候选池，计数立即更新
            this.poolSyncSelect(noteItem, false, false, 'search');
        }
        this.recalcOrders();
        this.updateKeepCandidatesUI();
        this.refreshNotePanels();
    }

    toggleSearchNoteSide(noteItem) {
        const e = this.getSearchNoteEntry(noteItem);
        if (!e.selected) return;
        const poolIdx = this.poolIndexOf(noteItem, false);
        if (poolIdx !== -1) {
            this.candidatePool[poolIdx].sideBySide = !this.candidatePool[poolIdx].sideBySide;
            e.sideBySide = this.candidatePool[poolIdx].sideBySide;
        } else {
            e.sideBySide = !e.sideBySide;
        }
        this.refreshNotePanels();
    }

    // 刷新展开中的注解 / 串珠面板（选中序号变化时同步候选框显示）
    refreshNotePanels() {
        const panels = [];
        if (this.readerContent) this.readerContent.querySelectorAll('.bible-note-panel').forEach(p => panels.push(p));
        if (this.resultsContainer) this.resultsContainer.querySelectorAll('.bible-note-panel').forEach(p => panels.push(p));
        for (const p of panels) {
            const ctx = p._noteCtx;
            if (ctx) this.fillVerseNotePanel(p, ctx.item, ctx.nd, ctx.kind, ctx.label, ctx.host);
        }
    }

    // depth：串珠经文里再展开注 / 串的层级（各级均保留 ¹ ᵃ 上标，可继续向下钻取，无限嵌套由每节只保留一个子面板兜底）
    fillVerseNotePanel(panel, item, nd, kind, label, host, depth) {
        panel.empty();
        if (kind === 'n') {
            const list = (nd.n || []).filter(n => n[0] === label);
            if (!list.length) {
                panel.createDiv({ cls: 'bible-note-empty', text: '没有对应的注解' });
                return;
            }
            for (const n of list) {
                const row = panel.createDiv({ cls: 'bible-note-item' });
                const refText = item.bookShortName + item.chapter + ':' + item.verse + (item.part || '') + '注' + n[0];
                this.renderNoteEntryBoxes(row, this.plugin.buildNoteItem(item, 'n', n[0], n[1], refText), host, item);
                const content = row.createDiv({ cls: 'bible-note-content' });
                content.createEl('span', { cls: 'bible-note-label bible-note-label-note', text: '注' + n[0] });
                // 注解正文里提到的经文出处也识别为可点击引用（承上上下文取该注解所属的书卷与章）
                appendNoteBody(content, n[1], this.plugin, { bookId: item.bookId, chapter: item.chapter });
                content.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (e.target.closest('.bible-note-ref-addr')) return;
                    if (row._noteToggle) row._noteToggle();
                });
            }
            return;
        }
        const list = (nd.r || []).filter(r => r[0] === label);
        if (!list.length) {
            panel.createDiv({ cls: 'bible-note-empty', text: '没有对应的串珠' });
            return;
        }
        for (const r of list) {
            const row = panel.createDiv({ cls: 'bible-note-item bible-note-item-ref' });
            const verses = this.plugin.getChainReferencedVerses(r, this.getReaderPrimaryVersion());
            const quoted = [];
            for (const v of verses) {
                quoted.push(v.bookShortName + v.chapter + ':' + v.verse + (v.part || '') + ' ' + v.content);
            }
            const refText = item.bookShortName + item.chapter + ':' + item.verse + (item.part || '') + '串' + r[0];
            const bodyText = r[1] + (quoted.length ? '\n' + quoted.join('\n') : '');
            this.renderNoteEntryBoxes(row, this.plugin.buildNoteItem(item, 'r', r[0], bodyText, refText), host, item);
            const content = row.createDiv({ cls: 'bible-note-content' });
            content.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.closest('.bible-note-ref-addr')) return;
                if (row._noteToggle) row._noteToggle();
            });
            const head = content.createDiv({ cls: 'bible-note-ref-head' });
            head.createEl('span', { cls: 'bible-note-label bible-note-label-ref', text: '串' + r[0] });
            head.createEl('span', { cls: 'bible-note-refs', text: r[1] });
            for (const v of verses) {
                const vr = content.createDiv({ cls: 'bible-note-ref-verse' });
                const addr = vr.createEl('span', {
                    cls: 'bible-note-ref-addr',
                    text: v.bookShortName + v.chapter + ':' + v.verse
                });
                addr.title = '点击跳转到该节';
                addr.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // jumpToBibleReader 定义在 plugin 上（本方法所属的是 View），必须经由 plugin 调用，
                    // 否则 this.jumpToBibleReader 取不到方法、点击无效果
                    const pluginRef = this.plugin || this;
                    pluginRef.jumpToBibleReader({
                        bookId: v.bookId,
                        bookShortName: v.bookShortName,
                        allRefs: [{ chapter: v.chapter, verse: v.verse, verseEnd: null, suffix: null, endChapter: null, endVerse: null }]
                    });
                });
                const vt = vr.createEl('span', { cls: 'bible-note-ref-text' });
                // 串珠引用的经文同样带 ¹ ᵃ 上标，点击在该节下方展开对应注解 / 串珠。
                // 各级（含嵌套串珠）都保留标注，可继续向下钻取；每个被引经文行只保留一个子面板，
                // 不会出现无限叠加 DOM，故不限制层级。
                this.plugin.renderVerseTextWithMarkers(vt, v, (k2, l2) => this.toggleVerseNoteSubPanel(vr, v, k2, l2, host, depth));
            }
        }
    }

    // 串珠引用的经文里点注 / 串上标：在该节经文行下方展开 / 收起对应的注解或串珠面板
    toggleVerseNoteSubPanel(vr, item, kind, label, host, depth) {
        const key = kind + ':' + label;
        const existing = Array.from(vr.children).find(c => c.classList && c.classList.contains('bible-note-panel'));
        if (existing) {
            if (existing.getAttribute('data-sub-key') === key) { existing.remove(); return; }
            existing.remove();
        }
        const nd = this.plugin.getVerseNotes(item.bookId, item.chapter, item.verse, item.part);
        const p = vr.createDiv({ cls: 'bible-note-panel bible-note-sub-panel' });
        p.setAttribute('data-sub-key', key);
        this.fillVerseNotePanel(p, item, nd, kind, label, host, (depth || 0) + 1);
    }

    // 串珠目标 -> 经文条目（实际实现在 plugin 上，检索页 / 阅读页 / 弹窗共用）
    getVersesForTarget(t) {
        return this.plugin.getVersesForTarget(t, this.getReaderPrimaryVersion());
    }

    // 检索结果里的注解条目：包装成候选项，与检索页的经文共用同一套序号 / 复制 / 投影
    noteResultItem(result) {
        const kind = (result.noteKind === 'r') ? 'chain' : 'note';
        const mark = (result.noteKind === 'r') ? '串' : '注';
        if (!result.noteItem || result.noteItem.noteKey.indexOf(':' + String(result.noteLabel)) === -1) {
            const it = result.item;
            result.noteItem = this.plugin.buildNoteItem(it, kind, result.noteLabel, result.noteText,
                it.bookShortName + it.chapter + ':' + it.verse + (it.part || '') + mark + result.noteLabel);
        }
        return result.noteItem;
    }

    // 检索结果里的注解条目：出处（如「创6:3注2」）+ 注解正文，命中关键词高亮
    renderNoteResultCard(result, globalIdx) {
        const item = result.item;
        const noteMark = (result.noteKind === 'r') ? '串' : '注';
        const refText = item.bookShortName + item.chapter + ':' + item.verse + (item.part || '') + noteMark + result.noteLabel;
        const noteItem = this.noteResultItem(result);
        const st = this.getSelectionState(noteItem, false, !!result.selected, result.order, result.sideBySide);
        const card = this.resultsContainer.createDiv({
            cls: 'bible-result-card bible-result-note-card' + (st.selected ? ' selected' : '')
        });
        const header = card.createDiv({ cls: 'bible-result-header' });
        // 候选框 / 并候选框：与检索页经文一致，直接用页面原有的选中逻辑
        this.plugin.renderNoteEntryBoxes(header, st, {
            onToggle: () => this.toggleSelection(globalIdx),
            onToggleSide: () => this.toggleSideBySide(globalIdx)
        });
        const ref = header.createEl('span', {
            cls: 'bible-result-ref',
            text: refText
        });
        ref.style.cursor = 'pointer';
        ref.title = '点击跳转到该节';
        ref.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openVerseLocation(item);
        });
        const body = card.createDiv({ cls: 'bible-result-text bible-result-note-text' });
        this.renderNoteParagraphs(body, result.noteText, this.keywords, { bookId: item.bookId, chapter: item.chapter });
        this.markKeyboardItem(card, {
            key: 'n:' + globalIdx,
            toggle: () => this.toggleSelection(globalIdx),
            side: () => this.toggleSideBySide(globalIdx),
            selected: st.selected
        });
    }

    // 注解正文分段：源数据用空行分段，每段单独成块（有关键词时高亮）
    renderNoteParagraphs(container, text, keywords, ctx) {
        const paras = String(text || '').split(/\n+/).map(t => t.trim()).filter(t => t.length > 0);
        if (!paras.length) return;
        const canLink = !!(this.plugin && typeof this.plugin.linkifyBibleRefs === 'function');
        for (const p of paras) {
            const el = container.createDiv({ cls: 'bible-note-para' });
            // 命中关键词照常高亮，同时把正文里的经文出处识别为可点击引用
            if (canLink) this.plugin.linkifyBibleRefs(el, p, ctx, keywords);
            else if (keywords && keywords.length) this.highlightKeywords(el, p, keywords);
            else el.setText(p);
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
        if (!this.readerContent) return;
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

        const existingIdx = this.readerEntryIdx(item);
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
    }
    toggleReaderItemSelection(item) {
        // 取消选中：同时移出候选池并清除局部选中（勾选「保留候选」时两者是镜像关系）
        const poolIdx = this.poolIndexOf(item, false);
        const existingIdx = this.readerEntryIdx(item);

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
        // X 全选时由调用方统一重绘一次，避免每选一条就刷新整章
        if (!this._kbBatchSelecting) {
            this.refreshAllReaderCards();
            this.refreshNotePanels();
        }
    }

    toggleReaderSideBySide(item) {
        const poolIdx = this.poolIndexOf(item, false);
        const existingIdx = this.readerEntryIdx(item);
        if (poolIdx !== -1) {
            const p = this.candidatePool[poolIdx];
            p.sideBySide = !p.sideBySide;
            if (existingIdx !== -1) this.readerResults[existingIdx].sideBySide = p.sideBySide;
            this.refreshReaderItemCard(item);
            this.refreshNotePanels();
            return;
        }
        if (existingIdx !== -1 && this.readerResults[existingIdx].selected) {
            this.readerResults[existingIdx].sideBySide = !this.readerResults[existingIdx].sideBySide;
            this.refreshReaderItemCard(item);
            this.refreshNotePanels();
        }
    }

    updateReaderFontSize() {
        const contentList = this.readerContent.querySelector('.bible-reader-content-list');
        if (contentList) contentList.style.fontSize = this.readerFontSize + 'px';
        const themeEl = this.readerFixedTop.querySelector('.bible-reader-book-theme');
        if (themeEl) themeEl.style.fontSize = this.readerFontSize + 'px';
    }

    updateSearchFontSize() {
        if (!this.resultsContainer) return;
        this.resultsContainer.style.fontSize = this.searchFontSize + 'px';
        this.resultsContainer.style.setProperty('--bible-result-font-size', this.searchFontSize + 'px');
    }

    // 「恢复本注解 / 串珠」开关变化后刷新当前视图
    async refreshNotesUI() {
        if (this.activeTab === 'reader' && this.readerState === 'content') {
            await this.renderChapterContent();
        } else if (this.activeTab === 'search' && this.resultsContainer) {
            this.renderResults();
        }
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
        // 启动即全库扫描：把 vault 任意位置的数据文件与插件目录里的做对比，
        // 最新一份集中到插件目录、其余旧/重复副本静默删除（详见 syncScannedVersions）。
        try { await this.syncScannedVersions(); }
        catch (e) { console.error('[Bible] 启动扫描数据文件失败:', e); }
        this.parser = new BibleParser(this.app, this.settings, this.manifest.dir);
        // 引擎持有插件引用：支持按注 / 串出处检索时读取某一节的注解 / 串珠数据
        this.searchEngine = new BibleSearchEngine(this);
        this.allItems = [];
        this.currentProjection = null;  // 当前打开的投影覆盖层引用（用于投影内打开检索并复用）
        this.notesData = null;          // 恢复本注解/串珠（null = 尚未加载）
        this.notesSearchIndex = null;   // 注解正文检索索引

        // 「打字守卫」：记录按键现场，供命令回调判断用户是不是正在打字（详见 installTypingGuard）
        this.installTypingGuard();
        this.register(() => document.removeEventListener('keydown', this._keydownRecorder, true));

        this.registerView(BIBLE_SEARCH_VIEW_TYPE, (leaf) => {
            const view = new BibleSearchView(leaf, this);
            this.searchViewRef = view;
            return view;
        })

        // 投影「标签页模式」的宿主视图：由 Obsidian 负责与侧边栏并排排版，避免手动算宽度导致遮挡
        this.registerView(BIBLE_PROJECTION_VIEW_TYPE, (leaf) => new BibleProjectionView(leaf, this));

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

        // 取得「当前实际可见」的圣经检索 / 阅读视图：
        // 多个圣经视图同时存在时优先取活动面板的那个，其次是任意可见的那个；
        // 全都不可见（侧边栏收起、或侧边栏停在其它插件的标签页）则返回 null，
        // 从而保证 Q/W/E 只在插件界面可见时才触发。
        this.getVisibleSearchView = () => {
            const visible = (v) => {
                const el = v && v.containerEl;
                return !!(el && el.offsetWidth > 0 && el.offsetHeight > 0);
            };
            try {
                const active = this.app.workspace.getActiveViewOfType(BIBLE_SEARCH_VIEW_TYPE);
                if (active && visible(active)) return active;
            } catch (e) { /* 忽略，继续遍历 */ }
            try {
                const leaves = this.app.workspace.getLeavesOfType(BIBLE_SEARCH_VIEW_TYPE);
                for (const leaf of leaves) {
                    const v = leaf && leaf.view;
                    if (v && typeof v.getAllSelections === 'function' && visible(v)) return v;
                }
            } catch (e) { /* 忽略 */ }
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
        // 章 → 该章节数（供「只写到章」的引用在弹窗里展开整章）
        this.chapterVerseCounts = new Map();

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

        // 点击经文弹窗以外的区域即关闭弹窗。
        // 必须注册在「捕获阶段」：阅读页 / 检索页 / 经文弹窗 / 投影里的注解与串珠面板为防止
        // 事件穿透，自身 click 会 stopPropagation，冒泡阶段的监听收不到事件——于是「点在注解面板上
        // 却关不掉弹窗」。捕获阶段先于目标执行，面板的 stopPropagation 拦不住它。
        // 不关闭的三类：弹窗内部、经文引用（点了要开新弹窗 / 压新层）、弹窗菜单。
        this._tooltipOutsideHandler = (evt) => this.handleTooltipOutsideClick(evt);
        document.addEventListener('click', this._tooltipOutsideHandler, true);
        this.register(() => document.removeEventListener('click', this._tooltipOutsideHandler, true));

        // 全局投影快捷键 Q/W/E：按当前上下文统一分派，只有一个入口，避免重复或漏执行——
        // ① 经文弹窗打开 → 等同于点击弹窗里的「投影」按钮（会自动关闭弹窗）；
        // ② 投影正独占屏幕（全屏覆盖 / 桌面全屏）→ 切换当前投影的排版模式；
        // ③ 插件界面可见（侧边栏停在本插件检索页 / 阅读页；含投影已切成标签页的情形）
        //    → 等同于点击该页面上的「投影」按钮（检索页带出处、阅读页不带出处）；
        // ④ 兜底 → 切换模式。
        // 注意：投影覆盖层自身的 keydown 监听注册在「捕获阶段」，若它拦截了 Q/W/E 并
        // stopPropagation，事件就到不了这里的冒泡监听，会出现「按 QWE 不刷新内容」的问题。
        // 因此投影层对 Q/W/E 只做 preventDefault（防写进笔记正文），不消费事件。
        this.registerDomEvent(document, 'keydown', (e) => {
            // 仅当焦点在「文本输入框」（如检索分屏的搜索框）时拦截快捷键，避免误触；
            // 勾选框（checkbox）、按钮、笔记正文不拦截，从而选中经文后按 Q/W/E 能正常投影
            const ae = document.activeElement;
            const typingText = ae && (
                ae.tagName === 'TEXTAREA' ||
                (ae.tagName === 'INPUT' && ['text', 'search', 'number', 'password', 'email', 'url', 'tel'].includes((ae.type || '').toLowerCase()))
            );
            // 没有弹窗时，避免在笔记正文中打字误触 Q/W/E；有弹窗时（用户在选经文体）允许触发。
            // 例外：投影正独占屏幕（全屏覆盖 / 桌面全屏）时按键归投影，否则 iPad 上笔记处于
            // 编辑模式会让 Q/W/E 写进正文而不是切换投影模式
            const projOwnsScreen = !!(this.currentProjection && this.currentProjection.ownsScreen && this.currentProjection.ownsScreen());
            const editingNote = ae && ae.isContentEditable && !this.currentTooltipProjector && !projOwnsScreen;
            // 输入法合成态（候选框开着，keyCode 229 / isComposing）同样放行，否则中文候选会被吃掉
            const composing = !!e.isComposing || e.keyCode === 229;
            // 经文投影已切成标签页、当前显示的却不是它时，Q/W/E 的语义是「把标签调回来」。
            // 此时即便焦点落在 Hymns 面板等别的输入框里也必须生效，否则从 Hymns 标签按 QWE
            // 会被 typingText 门禁整个吞掉，表现就是「按 QWE 切不回来」。
            // 笔记正文编辑、输入法合成态、组合键，以及本插件检索框里的短拼输入仍一律让行。
            const qweKey = e.key === 'q' || e.key === 'Q' || e.key === 'w' || e.key === 'W' ||
                e.key === 'e' || e.key === 'E';
            const projTabBehind = !!(this.currentProjection && this.currentProjection.projectionLeaf &&
                !this.isProjectionTabActive(this.currentProjection));
            const inBibleInput = !!(ae && ae.closest && ae.closest(
                '.bible-search-input, .bible-proj-quick-search, .bible-inline-tooltip, .bible-tooltip-menu'));
            const forceReveal = qweKey && projTabBehind && !inBibleInput;
            if ((typingText && !forceReveal) || editingNote || composing) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            // ⑤ 恢复本注解 / 串珠开关：裸字母 A（不按任何修饰键）即切换。
            //    与 Q/W/E 同理走插件自有监听 + 上下文门禁：焦点在输入框 / 笔记正文 / 输入法合成态时
            //    上面的 gating 已直接放行，字母照常输入，绝不会像 Obsidian 命令快捷键那样被 preventDefault 吞掉。
            //    只在「非输入场景」（阅读笔记、圣经检索 / 阅读页、经文弹窗等）触发，避免干扰打字。
            if ((e.key === 'a' || e.key === 'A') && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                void this.toggleShowNotes();
                return;
            }
            let mode = null;
            if (e.key === 'q' || e.key === 'Q') mode = 'focus';
            else if (e.key === 'w' || e.key === 'W') mode = 'parallel';
            else if (e.key === 'e' || e.key === 'E') mode = 'mixed';
            if (!mode) return;
            // 连投影实例都没有时（例如刚重启、或投影被关掉），先把可能残留的空白
            //「经文投影」标签收掉，免得下面新建投影后又变成「空白标签 + 正常投影」两处。
            if (!this.currentProjection) this.cleanupOrphanProjectionTabs();
            // 标签页模式：必须在任何 revealLeaf 之前「快照」标签是否在后台。
            // revealLeaf 会改写 activeLeaf / 标签头 is-active，事后再判断就会把
            //「刚从别的标签调回来」误看成「一直在前台」，进而落到同键关闭把标签 detach 掉。
            // 反过来，若简单规定「标签页模式永不关闭」，用户在投影标签里再按 q 也关不掉。
            // 用快照把两种情形分开：后台只调回，前台同键照常关闭（q/w/e 各自对应自己的模式）。
            const projTab = (this.currentProjection && this.currentProjection.projectionLeaf)
                ? this.currentProjection : null;
            const tabWasBehind = !!(projTab && !this.isProjectionTabActive(projTab));
            const tabAction = this.resolveQweTabAction(projTab, mode, tabWasBehind);
            // 后台标签先调回前台；⓪/① 两个优先级更高的分支仍需执行，故此处不 return。
            if (tabAction === 'reveal') this.revealProjectionTab(projTab);
            // ⓪ 跨插件联动：Hymns 诗歌投影在前台时，Q/W/E 一律表示「切回经文投影」。
            // 已有本插件投影时通常由覆盖层的捕获监听先处理（switchBackFromHymns）并阻断传播；
            // 这里负责「圣经投影根本没开」的场景——收起诗歌投影后打开对应模式的空投影。
            if (isHymnsProjectionFront()) {
                requestHymnsProjectionClose();
                const cur = this.currentProjection;
                if (cur) {
                    if (cur.mode !== mode) cur.setMode(mode);
                    const refocus = () => {
                        if (!cur.overlay) return;
                        const ae = document.activeElement;
                        if (ae && ae.closest && ae.closest('.bible-proj-quick-search, .bible-proj-search-box')) return;
                        cur.focusProjection(true);
                    };
                    refocus();
                    try { if (typeof requestAnimationFrame === 'function') requestAnimationFrame(refocus); } catch (err) { /* 忽略 */ }
                    try { setTimeout(refocus, 150); } catch (err) { /* 忽略 */ }
                } else {
                    const emptyProj = new BibleProjectionOverlay(this.app, this, [], mode, true);
                    emptyProj.open();
                }
                return;
            }
            // ① 经文弹窗打开时优先：等同点击弹窗里的「投影」按钮（会自动关闭弹窗）
            if (this.currentTooltipProjector) { this.currentTooltipProjector(mode); return; }
            // ② 标签页模式的 QWE 动作在这里统一执行（用 tabAction 快照，不再实时判激活）：
            //    后台 → 只调回 + 按需切模式；前台同模式 → 关闭（detach 宿主标签）；
            //    前台异模式 → 原地切排版。已消费按键就不再往下走原有分派，
            //    避免 openProjection 又新建一层投影覆盖 / 第二个标签页。
            if (this.applyQweTabAction(projTab, mode, tabAction)) return;
            // ②′ 走到这里说明不是标签页模式：投影已开且正处在该模式时，再按对应键关闭投影。
            //    （同键切换为关闭；放在独占屏幕 / 界面可见等分支之前统一生效）
            if (this.currentProjection && this.currentProjection.mode === mode) {
                this.currentProjection.close();
                return;
            }
            // ③ 投影正独占屏幕（全屏覆盖 / 桌面全屏）：此时够不到插件界面，
            //    按 Q/W/E 等同于切换当前投影的排版模式
            if (projOwnsScreen) { this.currentProjection.setMode(mode); return; }
            // ③ 插件界面可见（侧边栏停在本插件的检索页 / 阅读页；也包括投影已切成标签页、
            //    用户正在侧边栏改选经文的情形）：等同点击该页面上的「投影」按钮——
            //    检索页用 openProjection（带出处），阅读页用 openReaderProjection（不带出处）；
            //    已有投影时两者都会调用 reloadResults 原地刷新内容
            const view = this.getVisibleSearchView();
            if (view) {
                // 投影还开着但侧边栏当前没有任何选中项：此时「重新投影」只会弹提示，
                // 用户想做的是切换模式，退化成 setMode
                const selCount = (typeof view.getAllSelections === 'function') ? view.getAllSelections().length : 0;
                if (selCount === 0 && this.currentProjection) { this.currentProjection.setMode(mode); return; }
                if (view.activeTab === 'reader' && typeof view.openReaderProjection === 'function') {
                    view.openReaderProjection(mode);
                } else if (typeof view.openProjection === 'function') {
                    view.openProjection(mode);
                }
                return;
            }
            // ④ 没有可见界面、但投影仍在运行（例如从弹窗起投影后弹窗已关）：退化为切换模式
            if (this.currentProjection) { this.currentProjection.setMode(mode); return; }
            // ⑤ 连插件界面都不可见（侧边栏收起、只开着笔记）时，也允许按 Q/W/E 打开「空投影」：
            //    投影顶部常驻搜索框可直接输入出处投影经文，不必先回侧边栏选内容
            const emptyProj = new BibleProjectionOverlay(this.app, this, [], mode, true);
            emptyProj.open();
        });

        this.addRibbonIcon('book-plus', '圣经检索', () => { this.activateSearchView(); });
        // 所有命令都套一层「打字守卫」：无修饰键的单字母快捷键（如注解的 A）
        // 在笔记正文 / 输入框里打字时不应被触发，避免「按 a 顺带切换了注解」。
        const guarded = (fn) => (...args) => {
            if (this.shouldIgnoreCommandHotkey()) return;
            return fn.apply(this, args);
        };
        this.addCommand({ id: 'open-bible-search', name: '打开圣经检索', callback: guarded(() => this.activateSearchView()) });
        this.addCommand({
            id: 'show-bible-changelog',
            name: '查看当前版本的更新说明',
            callback: guarded(() => this.showCurrentChangelog())
        });
        this.addCommand({
            id: 'show-bible-changelog-history',
            name: '查看历史更新记录',
            callback: guarded(() => this.showChangelogHistory())
        });
        this.addCommand({
            id: 'check-bible-data-update',
            name: '检查圣经数据更新',
            callback: guarded(async () => {
                const pending = await this.checkBibleDataUpdate();
                if (pending && pending.length) new DataUpdateModal(this.app, this, pending).open();
                else new Notice('圣经数据已是最新版本');
            })
        });
        this.addCommand({
            id: 'toggle-bible-notes',
            name: '切换恢复本注解 / 串珠（开 / 关）',
            callback: guarded(async () => { await this.toggleShowNotes(); })
        });
        this.addSettingTab(new BibleSettingTab(this.app, this));

        await this.migrateOldData();
        await this.loadBibleData();

        this.registerEvent(this.app.workspace.onLayoutReady(async () => {
            // 布局就绪后补扫一次：极少数情况下 onload 时 vault 文件索引尚未完全建立，
            // 这里再扫一遍，确保「每次启动都检索全库并集中/清理」不漏。
            // 若本轮把更新的数据集中进了插件目录，则重载经文数据让内存中的内容同步到最新。
            try {
                const r = await this.syncScannedVersions({ silent: true });
                if (r && r.consolidated) await this.loadBibleData();
            } catch (e) { console.error('[Bible] 启动补扫数据文件失败:', e); }
            // 启动即维持「注解模式」与主版本一致的不变式：CRV 主版本→开注解，其它主版本→关注解
            try { await this.reconcileNotesWithPrimary(); } catch (e) { console.error('[Bible] 同步注解模式失败:', e); }
            try { await this.ensureNotesHotkey(); } catch (e) { console.error('[Bible] 分配注解快捷键失败:', e); }
            const hasInstalledVersion = this.settings.versions.some(v => v.installed);
            if (!this.settings.hasSetup || !hasInstalledVersion) {
                new FirstRunModal(this.app, this).open();
            } else {
                // 已配置且已有版本的用户：若有默认可下载版本本机缺失，开机提示下载
                this.promptInstallVersions();
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
        // 投影标签页的内容是运行时生成的，插件重启后无法还原。卸载 / 退出时主动收掉，
        // 否则 Obsidian 会把这个 view 类型存进 workspace，下次启动恢复出一个空白「经文投影」标签。
        // 先摘掉宿主引用，避免 detach 触发 BibleProjectionView.onClose() 反向调用 close()。
        try {
            if (this.currentProjection && this.currentProjection.projectionLeaf) {
                this.currentProjection.projectionLeaf = null;
            }
            const projLeaves = this.app.workspace.getLeavesOfType(BIBLE_PROJECTION_VIEW_TYPE) || [];
            for (const leaf of projLeaves) {
                try { leaf.detach(); } catch (e) {}
            }
        } catch (e) {}
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
            // 触屏左右滑动翻页：左滑下一页 / 下一章，右滑上一页 / 上一章（默认开启）
            swipeNavigation: true,
            // 移动端右滑仍翻上一页（关闭后右滑完全让给侧边栏）
            mobileRightSwipe: true,
            // 桌面端鼠标拖拽 / 触控板横滑翻页
            pointerNavigation: true,
            // 键盘 ←/→ 翻页、↑/↓ 选框、空格选中、B 并列、C 清空
            keyboardNavigation: true,
            // 恢复本注解 / 串珠
            showNotes: true,
            searchIncludeNotes: true,
            notesInstalled: false,
            // 注解 / 串珠数据文件的相对路径（相对于 vault 根目录）；为空时回退到插件目录默认位置
            notesPath: null,
            // 扫描时发现的「重复数据文件」相对路径（已被集中到插件目录，原位置副本自动清理）；
            // 仅记录自动清理失败的路径，供设置页兜底重试；为空表示无
            duplicateDataPaths: [],
            // 是否已为「切换注解」命令分配过默认快捷键（只写一次，之后由用户自己做主）
            notesHotkeyAssigned: false,
            // 已安装圣经数据的版本记录：{ 'bible-crv-data.json': '2026.10.12', ... }
            dataVersions: {},
            // 上次检测数据更新的时间戳（节流用）
            lastDataCheckAt: 0,
            // 待更新的数据文件（更新失败 / 用户延后后持久化，重启仍会再次提醒）
            pendingDataUpdates: [],
            // 用户点「稍后」后，多久内不再弹数据更新提示（毫秒时间戳）
            dataUpdateCooldownUntil: 0,
            // 开机时「不再提醒」针对的各圣经版本 key：只抑制这些版本，新版本 / 版本更新仍会提醒
            dismissedVersionPrompts: [],
            // 注解数据缺失提示是否被「不再提醒」关闭（安装成功后会复位为 false，便于日后更新仍提醒）
            dismissedNotesPrompt: false
        };
        const loaded = await this.loadData() || {};
        this.settings = Object.assign({}, defaults, loaded);
        // 兼容旧版布尔标志：曾点过「不再提示」的用户，按当时缺失的默认版本写入数组
        if (loaded && loaded.skipMissingVersionPrompt === true && (!this.settings.dismissedVersionPrompts || this.settings.dismissedVersionPrompts.length === 0)) {
            this.settings.dismissedVersionPrompts = (this.settings.versions || [])
                .filter(v => DEFAULT_VERSIONS.some(d => d.key === v.key) && !v.installed)
                .map(v => v.key);
        }
        if (loaded && typeof loaded.skipMissingVersionPrompt !== 'undefined') delete this.settings.skipMissingVersionPrompt;
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

    // 扫描并同步圣经 / 注解数据文件位置。
    // 多份同名文件（放在 vault 不同位置）会被全部收集，再按修改时间 mtime 选最新的一份，
    // 自动「集中」到插件目录作为唯一生效位置（避免多副本并存导致用错版本）；其余副本记为重复，
    // 由右上角提示 / 设置页入口清理。opts.silent=true 时不弹提示（如首次运行弹窗内调用，避免叠加）。
    async syncScannedVersions(opts) {
        opts = opts || {};
        const { versions: scannedVersions, notes: scannedNotes } = await this.scanDataFiles();
        const pluginId = this.manifest?.id || 'bible-search-reader';
        const pluginDir = '.obsidian/plugins/' + pluginId;

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

        // 确保所有默认可下载版本都出现在版本列表中（即使本机尚未安装）
        for (const dv of DEFAULT_VERSIONS) {
            if (!this.settings.versions.find(v => v.key === dv.key)) {
                this.settings.versions.push({
                    key: dv.key, name: dv.name, file: dv.file,
                    enabled: false, isPrimary: false, installed: false
                });
            }
        }

        // 如果没有任何版本，初始化默认版本列表（优先选中恢复本）
        if (this.settings.versions.length === 0) {
            for (let i = 0; i < DEFAULT_VERSIONS.length; i++) {
                const dv = DEFAULT_VERSIONS[i];
                const found = scannedVersions.find(s => s.key === dv.key);
                this.settings.versions.push({
                    key: dv.key, name: dv.name, file: dv.file,
                    enabled: found ? (i === 0) : false,
                    isPrimary: found ? (i === 0) : false,
                    installed: !!found
                });
            }
        }

        const existingMap = new Map(this.settings.versions.map(v => [v.key, v]));
        const statMtime = async (p) => {
            try { const st = await this.app.vault.adapter.stat(p); return st ? (st.mtime || 0) : -1; }
            catch (e) { return -1; }
        };

        // 重复副本相对路径（含插件目录外的所有同名旧副本）；集中完成后提示清理
        const duplicatePaths = [];
        let didConsolidate = false;

        // ---- 圣经版本：按 key 分组，选 mtime 最新一份集中到插件目录 ----
        const groups = new Map();
        for (const s of scannedVersions) {
            if (!groups.has(s.key)) groups.set(s.key, []);
            groups.get(s.key).push(s);
        }
        for (const [key, cands] of groups) {
            let best = null, bestMtime = -1;
            for (const c of cands) {
                const m = await statMtime(c.path);
                c.mtime = m;
                if (m > bestMtime) { bestMtime = m; best = c; }
            }
            if (!best) continue;
            const destPath = pluginDir + '/' + best.file;
            if (best.path !== destPath) {
                // 最新一份不在插件目录：复制到插件目录作为唯一生效位置（不移动、不删原文件）
                try {
                    await this.copyDataFileToPlugin(best.path, best.file, pluginDir);
                    didConsolidate = true;
                } catch (e) {
                    console.error('[Bible] 集中数据文件失败:', best.path, e);
                }
            }
            // 其余同名副本（非插件目录生效位置）记为重复
            for (const c of cands) {
                if (c.path !== destPath) duplicatePaths.push(c.path);
            }
            const ver = existingMap.get(key);
            if (ver) {
                ver.installed = true;
                if (!ver.file) ver.file = best.file;
                ver.path = destPath;
            } else {
                this.settings.versions.push({
                    key, name: VERSION_MAP[key] || best.name, file: best.file,
                    path: destPath, enabled: false, isPrimary: false, installed: true
                });
            }
        }

        // ---- 注解 / 串珠：同样集中到插件目录 ----
        if (scannedNotes.length) {
            let best = null, bestMtime = -1;
            for (const c of scannedNotes) {
                const m = await statMtime(c.path);
                c.mtime = m;
                if (m > bestMtime) { bestMtime = m; best = c; }
            }
            if (best) {
                const destPath = pluginDir + '/' + NOTES_FILE;
                if (best.path !== destPath) {
                    try { await this.copyDataFileToPlugin(best.path, NOTES_FILE, pluginDir); didConsolidate = true; }
                    catch (e) { console.error('[Bible] 集中注解数据失败:', best.path, e); }
                }
                for (const c of scannedNotes) if (c.path !== destPath) duplicatePaths.push(c.path);
                this.settings.notesPath = destPath;
                this.settings.notesInstalled = true;
            }
        } else if (this.settings.notesPath && !(await this.app.vault.adapter.exists(this.settings.notesPath))) {
            this.settings.notesInstalled = false;
        }

        // 更新现有版本的安装状态（文件已被删 -> 标记未安装）；并规范化显示名
        for (const ver of this.settings.versions) {
            const canonicalName = VERSION_MAP[ver.key];
            if (canonicalName && ver.name !== canonicalName) ver.name = canonicalName;
            if (ver.installed) {
                const canonical = ver.path || (pluginDir + '/' + (ver.file || ''));
                if (!(await this.app.vault.adapter.exists(canonical))) {
                    ver.installed = false;
                    ver.enabled = false;
                    ver.isPrimary = false;
                }
            }
        }

        // 清理无效版本：既未安装、又不是默认可下载版本的条目
        const defaultKeys = DEFAULT_VERSIONS.map(dv => dv.key);
        this.settings.versions = this.settings.versions.filter(v => v.installed || defaultKeys.includes(v.key));

        // 确保主版本正确
        const firstEnabled = this.settings.versions.find(v => v.enabled && v.installed);
        for (const v of this.settings.versions) v.isPrimary = false;
        if (firstEnabled) firstEnabled.isPrimary = true;

        // 记录重复副本（去重，排除插件目录生效副本）
        const dupSet = new Set();
        for (const p of duplicatePaths) {
            if (p.indexOf(pluginDir + '/') !== 0) dupSet.add(p);
        }
        const allDups = [...dupSet];

        // 复制完成即自动清理重复数据：采用「复制」而非「移动」保留了原文件，
        // 这里把其它位置的旧副本自动删除，确保全局只有插件目录下这一份生效数据。
        // 绝不删除插件目录下的生效副本（removeDuplicateDataFiles 内部已保护）。
        // 无任何弹窗提醒——清理是静默完成的；仅把删除失败的路径留在 settings 供设置页兜底重试。
        if (allDups.length > 0) {
            const { failed } = await this.removeDuplicateDataFiles(allDups);
            this.settings.duplicateDataPaths = failed;
        } else {
            this.settings.duplicateDataPaths = [];
        }

        await this.saveSettings();
        // 返回是否发生过「集中复制」，供启动补扫判断是否需要重载经文数据。
        return { consolidated: didConsolidate };
    }

    // 整库扫描圣经数据文件与注解数据文件。
    // bible-{缩写}-data.json 与 bible-crv-notes.json 可放在 vault 任意位置，只要文件名符合约定即自动识别。
    // 同名文件在多处出现时全部收集（不再静默丢弃），供 syncScannedVersions 集中处理。
    // 返回 { versions:[{key,name,file,path}], notes:[{file,path}] }（均为扁平数组，key 可能重复）
    async scanDataFiles() {
        const versions = [];
        const notes = [];

        // 命中一个文件路径：按命名约定识别圣经数据 / 注解数据，并记录相对 vault 根的路径
        const consider = (file) => {
            if (!file) return;
            const basename = file.split('/').pop();
            const m = basename.match(/^bible-([a-z0-9]+)-data\.json$/i);
            if (m) {
                const key = m[1].toUpperCase();
                versions.push({ key, name: VERSION_MAP[key] || key, file: basename, path: file });
            } else if (basename === NOTES_FILE) {
                notes.push({ file: NOTES_FILE, path: file });
            }
        };

        try {
            // 主扫描：vault.getFiles() 是 Obsidian 按各平台正确维护的完整文件索引，
            // 能覆盖 vault 任意内容目录（含中文子目录如「测试」），iOS/Android/Win/Mac 行为一致。
            const files = this.app.vault.getFiles();
            for (const f of (files || [])) {
                if (f && f.path) consider(f.path);
            }
        } catch (e) {
            console.error('[Bible] 扫描 vault 文件失败:', e);
        }

        try {
            // 补充扫描插件目录：.obsidian 不在 getFiles 索引内，故单独覆盖默认下载位置
            const pluginDir = '.obsidian/plugins/' + (this.manifest?.id || 'bible-search-reader');
            if (await this.app.vault.adapter.exists(pluginDir)) {
                const list = await this.app.vault.adapter.list(pluginDir);
                for (const file of (list.files || [])) {
                    consider(file);   // adapter.list 返回已含 pluginDir 前缀的相对 vault 根路径
                }
            }
        } catch (e) {
            console.error('[Bible] 扫描插件目录失败:', e);
        }

        return { versions, notes };
    }

    // 兼容别名：旧调用处仍按版本数组使用
    async scanBibleVersions() {
        const r = await this.scanDataFiles();
        return r.versions;
    }

    // 把一份数据文件复制到插件目录（集中为唯一生效位置）。用 adapter 二进制读写，跨平台一致，
    // 不依赖文件系统的 move 语义；原文件保留，避免破坏性移动与同步软件回弹。
    async copyDataFileToPlugin(fromPath, fileName, pluginDir) {
        if (!(await this.app.vault.adapter.exists(pluginDir))) {
            try { await this.app.vault.adapter.mkdir(pluginDir); } catch (e) { /* 已存在则忽略 */ }
        }
        const dest = pluginDir + '/' + fileName;
        const bin = await this.app.vault.adapter.readBinary(fromPath);
        await this.app.vault.adapter.writeBinary(dest, bin);
    }

    // 删除重复数据文件（集中到插件目录后遗留的旧副本）。
    // 安全护栏：绝不删除插件目录下的生效副本（路径以插件目录前缀开头的直接跳过）。
    async removeDuplicateDataFiles(paths) {
        const removed = [], failed = [];
        const pluginPrefix = '.obsidian/plugins/' + (this.manifest?.id || 'bible-search-reader') + '/';
        for (const p of (paths || [])) {
            if (!p || p.indexOf(pluginPrefix) === 0) continue;   // 保护生效副本
            try {
                if (await this.app.vault.adapter.exists(p)) {
                    await this.app.vault.adapter.remove(p);
                    removed.push(p);
                }
            } catch (e) {
                failed.push(p);
                console.error('[Bible] 删除重复数据失败:', p, e);
            }
        }
        return { removed, failed };
    }

    // 由文件名解析出实际存放路径：优先用记录的 path，否则回退到插件目录默认位置。
    resolveDataPath(file) {
        if (file === NOTES_FILE) {
            return this.settings.notesPath || ('.obsidian/plugins/bible-search-reader/' + NOTES_FILE);
        }
        const v = (this.settings.versions || []).find(x => x.file === file);
        return (v && v.path) || ('.obsidian/plugins/bible-search-reader/' + file);
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
            const adapterPath = versionConfig.path || `.obsidian/plugins/${pluginId}/${file}`;

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
            this._notesAttached = false;   // 数据重载后需要重新挂接注解
            if (this.searchEngine) this.searchEngine.setItems(this.allItems);
            // 经节索引必须跟着数据一起重建：首次安装下载完数据后若不重建，
            // 索引仍是空的，经文弹窗会显示「未找到经文」（见 ensureVerseIndex）
            this.buildVerseIndex();
        } catch (e) {
            console.error('[Bible] 加载失败:', e);
            new Notice('加载圣经数据失败，请检查设置: ' + e.message);
        }
    }

    // ==================== 恢复本注解 / 串珠 ====================
    // 开关「显示注解」：切换时清空缓存，让下次访问重新按需加载
    async setShowNotes(on) {
        this.settings.showNotes = !!on;
        if (!on) {
            // 关闭：直接置空缓存即可，下次要用会重新读
            this.notesData = {};
            this.notesSearchIndex = null;
            this._notesAttached = false;
            await this.saveSettings();
            await this.refreshNotesViews();
            return;
        }
        this.notesData = null;
        this.notesSearchIndex = null;
        this._notesAttached = false;
        await this.saveSettings();
        // 开启：立即加载（本机没有数据时会提示下载），并刷新已打开的视图，不必重启插件
        await this.refreshNotesViews();
    }

    /**
     * 安装「打字守卫」的按键记录器（捕获阶段注册，赶在笔记编辑器之前拿到按键现场）。
     * 背景：Obsidian 在 document **冒泡**阶段派发命令快捷键，而笔记编辑器（CodeMirror 6）
     * 在**目标**阶段处理完按键后既不 preventDefault 也不 stopPropagation（否则就打不了字），
     * 于是事件继续冒泡到 document，无修饰键的单字母快捷键（如注解的 A）被一起触发——
     * 表现为「打字时 a 既插入字符又切换注解」。这里记录现场，命令回调据此决定忽略。
     */
    installTypingGuard() {
        this._lastKeydown = null;
        this._keydownRecorder = (e) => {
            const el = (e && e.target instanceof Element) ? e.target : document.activeElement;
            this._lastKeydown = {
                ts: Date.now(),
                key: (e && typeof e.key === 'string') ? e.key : '',
                ctrl: !!(e && e.ctrlKey),
                meta: !!(e && e.metaKey),
                alt: !!(e && e.altKey),
                editable: this.isEditableTarget(el),
                composing: !!(e && e.isComposing) || (e && e.keyCode === 229)
            };
        };
        document.addEventListener('keydown', this._keydownRecorder, true);
    }

    // 判断元素是否为「可输入目标」：input / textarea / contenteditable（笔记正文、各类输入框等）。
    // 单选框、复选框、按钮等不算，否则在插件界面里用空格 / 回车操作控件会被误判成打字。
    isEditableTarget(el) {
        try {
            if (!el || typeof el !== 'object') return false;
            if (el.isContentEditable) return true;
            const tag = String(el.tagName || '').toUpperCase();
            if (tag === 'TEXTAREA') return true;
            if (tag === 'INPUT') {
                const t = String(el.type || 'text').toLowerCase();
                return ['text', 'search', 'number', 'password', 'email', 'url', 'tel'].includes(t);
            }
            if (typeof el.closest === 'function') {
                return !!el.closest('[contenteditable="true"], [contenteditable=""]');
            }
        } catch (e) { /* 忽略，按非可输入处理 */ }
        return false;
    }

    /**
     * 命令回调的「打字守卫」：若本次命令是由**无修饰键的单字符按键**触发，
     * 且按键落在可编辑区（笔记正文 / 搜索框 / 弹窗输入框），说明用户是在打字而非按快捷键，
     * 此时应忽略该命令。命令面板（Enter）、鼠标点击、带修饰键的组合键都不受影响。
     */
    shouldIgnoreCommandHotkey() {
        const k = this._lastKeydown;
        if (!k) return false;
        // 只认「刚刚」发生的按键；命令面板 / 鼠标触发时时间戳会明显偏旧（或没有按键记录）
        if (Date.now() - k.ts > 800) return false;
        if (k.ctrl || k.meta || k.alt) return false;   // 带修饰键 ⇒ 正常触发
        if (!k.editable) return false;                  // 焦点不在输入区 ⇒ 正常触发
        // 输入法合成态（候选框开着）或单字符按键（字母 / 数字 / 标点 / 空格）⇒ 视为打字
        return k.composing || k.key.length === 1;
    }

    // 命令 / 快捷键入口：切换「恢复本注解 / 串珠」的显示。返回切换后的状态。
    async toggleShowNotes() {
        const willShow = !this.settings.showNotes;
        // 6MB 数据首次载入有可感延迟，先给个提示；真正的加载在 setShowNotes → refreshNotesViews 里
        if (willShow) new Notice('正在载入恢复本注解…');
        await this.setShowNotes(willShow);
        // 经文弹窗工具栏上的「注解」按钮要跟着翻转，否则快捷键切了、按钮还停在旧状态
        if (typeof this._syncNotesToolbar === 'function') {
            try { this._syncNotesToolbar(); } catch (e) { /* 弹窗已关闭则忽略 */ }
        }
        new Notice(willShow ? '已开启：恢复本注解 / 串珠' : '已关闭：恢复本注解 / 串珠');
        return willShow;
    }

    // 某组快捷键是否已被其它命令占用（修饰键集合相同才算冲突）
    isHotkeyTaken(data, selfCmdId, letter, mods) {
        const want = mods.map(m => String(m).toLowerCase()).sort().join('+');
        return Object.keys(data).some(k => k !== selfCmdId && Array.isArray(data[k]) &&
            data[k].some(c => c && String(c.key || '').toLowerCase() === String(letter).toLowerCase() &&
                (c.modifiers || []).map(m => String(m).toLowerCase()).sort().join('+') === want));
    }

    // 注解 / 串珠开关改用插件自有监听 + 上下文门禁处理「裸字母 A」（见上方 keydown 监听），
    // 不再依赖 Obsidian 命令快捷键——后者会 preventDefault 把该字母吞掉，导致打不出 a、还不断触发。
    // 本函数只负责清理：移除旧版自动写入 hotkeys.json 的「无修饰键裸 A」（它正是吞键 + 不断触发的根因）。
    // 任何带修饰键的组合（含 4.0.6 迁移的 Ctrl/Cmd+Shift+A，或用户手动设的其它组合）都不动，留着也无害。
    // 注意：裸 A 的行为由插件自有监听提供，不会出现在「设置 → 快捷键」里，但命令面板仍可搜到该命令。
    async ensureNotesHotkey() {
        const CMD_ID = 'bible-search-reader:toggle-bible-notes';
        try {
            const p = '.obsidian/hotkeys.json';
            if (!(await this.app.vault.adapter.exists(p))) return;
            let data = {};
            try { data = JSON.parse(await this.app.vault.adapter.read(p)) || {}; } catch (e) { return; }
            if (!Array.isArray(data[CMD_ID]) || data[CMD_ID].length === 0) return;
            const kept = data[CMD_ID].filter(h => {
                const key = String(h.key || '').toUpperCase();
                const mods = (h.modifiers || []).map(m => String(m).toLowerCase());
                // 仅移除「无修饰键的裸 A」：它会被 Obsidian 全局拦截并 preventDefault，吞掉字母、还不断触发
                return !(key === 'A' && mods.length === 0);
            });
            if (kept.length === data[CMD_ID].length) return;  // 没有需要清理的
            if (kept.length === 0) delete data[CMD_ID];
            else data[CMD_ID] = kept;
            await this.app.vault.adapter.write(p, JSON.stringify(data, null, 2));
            new Notice('已移除「切换恢复本注解 / 串珠」的旧版裸 A 快捷键（它会吞掉字母 a、又不断触发）。现在在阅读 / 检索时按 A 即可开关注解，且不影响打字。重启 Obsidian 后生效');
        } catch (e) {
            console.error('[Bible] 清理注解快捷键失败:', e);
        }
    }

    // 注解标注位置按中文恢复本（CRV）设置，只兼容 CRV。维持「注解模式」与主版本一致的不变式：
    // 主版本为 CRV 时自动开启注解；主版本为其它版本时自动关闭注解。
    // 返回 true 表示本次发生了开关变化。
    async reconcileNotesWithPrimary() {
        const pk = this.getPrimaryVersionKey();
        const shouldShow = pk === 'CRV';
        if (this.settings.showNotes !== shouldShow) {
            await this.setShowNotes(shouldShow);
            return true;
        }
        return false;
    }

    // 开启注解但本机没有数据文件时提示下载。延迟到当前流程之后再弹，避免打断初始化；
    // 同一轮会话只提示一次。统一交给左上角非阻塞横幅（不弹阻塞 Modal）。
    promptInstallNotes() {
        if (this._notesPromptShown) return;
        this._notesPromptShown = true;
        setTimeout(() => {
            try {
                // 注解数据已就绪（已安装）则不提示
                if (this.notesData && Object.keys(this.notesData).length > 0) return;
                this.showDownloadBanner();
            } catch (e) {
                console.error('[Bible] 提示下载注解数据失败:', e);
            }
        }, 400);
    }

    // 本地缺少默认可下载的圣经版本时，开机提示下载（与注解缺失提示同理）。
    // 同一轮会话只提示一次；统一交给左上角非阻塞横幅（不弹阻塞 Modal）。
    // 用户点「不再提醒」只抑制当时缺失的版本——新增版本或版本有更新仍会提醒。
    promptInstallVersions() {
        if (this._versionPromptShown) return;
        this._versionPromptShown = true;
        setTimeout(async () => {
            try {
                // showDownloadBanner 内部会先 await loadNotesData，确保注解缺失判定基于磁盘真实状态
                await this.showDownloadBanner();
            } catch (e) {
                console.error('[Bible] 提示下载圣经版本失败:', e);
            }
        }, 800);
    }

    // 统一的非阻塞下载提示横幅（固定右上角）：同时承载「缺失的圣经版本」与「缺失的注解数据」，
    // 一次只出现一个横幅，后台下载，不拦截操作，下载期间也不影响其它操作。
    // 提供逐条「下载」、底部「稍后」与「不再提醒」（仅抑制当前已列出的项）。
    // 注意：判断注解缺失前必须先按磁盘真实状态加载注解数据，否则重启后内存里 notesData 尚未就绪
    // （仍为 null / 空对象），会把「本机已有注解」误判为缺失而每次开机都提醒。
    async showDownloadBanner() {
        try {
            // 注解缺失判定前，先确保注解数据已按磁盘真实状态加载完成；
            // 文件存在则 notesData 会被填充为真实数据，notesMissing 才不会误判。
            if (this.settings.showNotes) {
                try { await this.loadNotesData(); } catch (e) { console.error('[Bible] 预加载注解数据失败:', e); }
            }

            const id = 'bible-download-banner';
            const old = document.getElementById(id);
            if (old) old.remove();

            // 收集待下载项：缺失且未被「不再提醒」的默认可下载版本 + 缺失的注解数据
            const items = [];
            const dismissed = this.settings.dismissedVersionPrompts || [];
            // 清理集合：只保留当前仍缺失的版本 key，已安装 / 不再存在的条目移除，
            // 这样新出现的版本（key 不在集合里）以及版本更新仍会重新提醒。
            this.settings.dismissedVersionPrompts = dismissed.filter(k =>
                this.settings.versions.some(v => v.key === k && !v.installed));
            const missingVersions = this.settings.versions.filter(v =>
                DEFAULT_VERSIONS.some(d => d.key === v.key) && !v.installed &&
                !(this.settings.dismissedVersionPrompts || []).includes(v.key));
            for (const v of missingVersions) items.push({ kind: 'version', key: v.key, name: v.name + ' (' + v.key + ')' });

            const notesMissing = this.settings.showNotes &&
                !(this.notesData && Object.keys(this.notesData).length > 0);
            if (notesMissing && !this.settings.dismissedNotesPrompt) {
                items.push({ kind: 'notes', key: 'NOTES', name: '恢复本注解 / 串珠数据（约 6MB）' });
            }

            if (items.length === 0) return;

            const el = document.createElement('div');
            el.id = id;
            el.style.cssText = [
                'position:fixed', 'top:14px', 'right:14px', 'z-index:9999',
                'max-width:340px', 'background:var(--background-primary)',
                'border:1px solid var(--background-modifier-border)',
                'border-radius:10px', 'box-shadow:0 8px 30px rgba(0,0,0,0.25)',
                'padding:14px 16px 12px', 'font-size:14px', 'color:var(--text-normal)'
            ].join(';') + ';';
            const title = document.createElement('div');
            title.textContent = '📥 可下载的圣经资源';
            title.style.cssText = 'font-weight:600;margin-bottom:8px;';
            el.appendChild(title);

            const list = document.createElement('div');
            list.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
            el.appendChild(list);

            for (const it of items) {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 10px;border:1px solid var(--background-modifier-border);border-radius:8px;';
                const span = document.createElement('span');
                span.textContent = it.name;
                span.style.fontSize = '13px';
                row.appendChild(span);
                const dl = document.createElement('button');
                dl.className = 'mod-cta';
                dl.textContent = '⬇️ 下载';
                dl.style.cssText = 'font-size:12px;padding:4px 12px;flex:none;';
                dl.addEventListener('click', async () => {
                    dl.disabled = true;
                    dl.textContent = '下载中...';
                    try {
                        if (it.kind === 'version') {
                            const dv = DEFAULT_VERSIONS.find(d => d.key === it.key);
                            if (dv) {
                                await this.downloadVersionData(dv);
                                const v = this.settings.versions.find(x => x.key === it.key);
                                if (v) { v.installed = true; v.file = dv.file; v.path = '.obsidian/plugins/bible-search-reader/' + dv.file; }
                                await this.saveSettings();
                                await this.loadBibleData();
                                // 安装后从「不再提醒」集合移除该版本，便于日后更新仍会提醒
                                this.settings.dismissedVersionPrompts = (this.settings.dismissedVersionPrompts || []).filter(k => k !== it.key);
                                await this.saveSettings();
                            }
                        } else {
                            const ok = await this.installNotesData(false);
                            if (!ok) throw new Error('网络异常，请稍后重试');
                            // 安装成功复位，便于日后更新仍会提醒
                            this.settings.dismissedNotesPrompt = false;
                            await this.saveSettings();
                        }
                        dl.textContent = '✅ 已安装';
                        new Notice(it.name + ' 下载完成');
                        row.remove();
                        if (!list.children.length) el.remove();
                    } catch (e) {
                        dl.disabled = false;
                        dl.textContent = '⬇️ 下载';
                        new Notice(it.name + ' 下载失败：' + e.message);
                    }
                });
                row.appendChild(dl);
                list.appendChild(row);
            }

            const btnWrap = document.createElement('div');
            btnWrap.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:12px;';
            const laterBtn = document.createElement('button');
            laterBtn.textContent = '稍后';
            laterBtn.style.cssText = 'font-size:12px;padding:4px 12px;';
            const skipBtn = document.createElement('button');
            skipBtn.textContent = '不再提醒';
            skipBtn.style.cssText = 'font-size:12px;padding:4px 12px;';
            btnWrap.appendChild(laterBtn);
            btnWrap.appendChild(skipBtn);
            el.appendChild(btnWrap);

            laterBtn.addEventListener('click', () => el.remove());
            skipBtn.addEventListener('click', async () => {
                const dismissed = this.settings.dismissedVersionPrompts || [];
                for (const it of items) if (it.kind === 'version' && !dismissed.includes(it.key)) dismissed.push(it.key);
                this.settings.dismissedVersionPrompts = dismissed;
                if (items.some(it => it.kind === 'notes')) this.settings.dismissedNotesPrompt = true;
                await this.saveSettings();
                el.remove();
            });

            const closeX = document.createElement('div');
            closeX.textContent = '✕';
            closeX.style.cssText = 'position:absolute;top:8px;right:10px;cursor:pointer;color:var(--text-muted);font-size:14px;';
            closeX.addEventListener('click', () => el.remove());
            el.appendChild(closeX);

            document.body.appendChild(el);
        } catch (e) {
            console.error('[Bible] 渲染下载提示横幅失败:', e);
        }
    }

    // 注解数据安装 / 开关变化后刷新：重新挂接注解并重绘已打开的视图，让上标与面板立即生效
    // 投影是独立渲染的一整屏内容，不在检索视图里，切换注解后要自己重渲染当前页
    refreshProjectionNotes() {
        const proj = this.currentProjection;
        if (!proj) return;
        try {
            if (typeof proj.renderSlide === 'function') proj.renderSlide();
            else if (typeof proj.refresh === 'function') proj.refresh();
        } catch (e) { console.error('[Bible] 刷新投影注解失败:', e); }
    }

    // 经文弹窗同理：用原锚点重开一次，正文才会重新带上 / 去掉注串上标。
    // 弹窗已经被关掉时不要「复活」它，所以先确认当前确实有一个在页面上。
    async refreshTooltipNotes() {
        const reopen = this._tooltipRefresh;
        if (typeof reopen !== 'function') return;
        if (!document.querySelector('.bible-inline-tooltip')) return;
        try { await reopen(); } catch (e) { console.error('[Bible] 刷新弹窗注解失败:', e); }
    }

    async refreshNotesViews() {
        await this.loadNotesData();
        this._notesAttached = false;
        this.attachNotesToItems();
        // 投影与经文弹窗不依赖检索视图是否存在，必须在这里一并刷新（快捷键 A 也要生效）
        this.refreshProjectionNotes();
        await this.refreshTooltipNotes();
        const view = this.getSearchView ? this.getSearchView() : null;
        if (!view) return;
        // 注解 / 串珠上标是「渲染正文时」写进去的，只刷新卡片状态不会改变正文，
        // 必须走 refreshNotesUI 重渲染当前章 / 当前结果，否则要用快捷键切换后得翻章才看到变化
        if (typeof view.refreshNotesUI === 'function') {
            await view.refreshNotesUI();
        } else if (typeof view.refreshCurrentView === 'function') {
            view.refreshCurrentView();
        }
        if (typeof view.refreshNotePanels === 'function') view.refreshNotePanels();
    }

    // 注解数据体量约 6MB，与主圣经数据分开存放，首次用到时再读，避免拖慢启动
    async loadNotesData() {
        if (this.notesData) return this.notesData;
        if (this._notesLoading) return this._notesLoading;
        this._notesLoading = (async () => {
            try {
                if (!this.settings.showNotes) { this.notesData = {}; return this.notesData; }
                // 优先读取记录的相对路径（vault 任意位置），找不到再回退到插件目录默认位置
                const candidates = [this.settings.notesPath, '.obsidian/plugins/bible-search-reader/' + NOTES_FILE].filter(Boolean);
                let p = null;
                for (const cp of candidates) {
                    if (await this.app.vault.adapter.exists(cp)) { p = cp; break; }
                }
                if (!p) {
                    this.notesData = {};
                    // 功能已开启却没有数据：提示一次，让用户选择是否下载（每轮会话只提示一次）
                    this.promptInstallNotes();
                    return this.notesData;
                }
                const raw = await this.app.vault.adapter.read(p);
                const j = JSON.parse(raw);
                const ch = (j && j.chapters) || {};
                this.notesData = ch;
                this.notesSearchIndex = null;
                if (this.settings.notesInstalled !== (Object.keys(ch).length > 0)) {
                    this.settings.notesInstalled = Object.keys(ch).length > 0;
                    this.saveSettings();
                }
                return ch;
            } catch (e) {
                console.error('[Bible] 加载注解数据失败:', e);
                this.notesData = {};
                return this.notesData;
            } finally {
                this._notesLoading = null;
            }
        })();
        return this._notesLoading;
    }

    // 取某一节（可带上/下）的注解/串珠数据：
    //   { n:[[标号,正文]], r:[[标号,引用串,[[书,章,节,节尾,参]]]], m:[[ci,kind,label,anchor]] }
    getVerseNotes(bookId, chapter, verse, part) {
        if (!this.notesData) return null;
        const c = this.notesData[bookId + '-' + chapter];
        if (!c) return null;
        return c[notesVerseKey(verse, part)] || null;
    }

    // 注解正文检索索引：'书-章-节[上|下]' -> 该节全部注解拼接文本
    buildNotesSearchIndex() {
        if (this.notesSearchIndex) return this.notesSearchIndex;
        const idx = new Map();
        const ch = this.notesData || {};
        for (const key of Object.keys(ch)) {
            const dash = key.indexOf('-');
            if (dash < 0) continue;
            const bid = key.slice(0, dash), cap = key.slice(dash + 1);
            const verses = ch[key];
            for (const vs of Object.keys(verses)) {
                const ent = verses[vs];
                if (!ent.n || !ent.n.length) continue;
                let txt = '';
                for (const n of ent.n) txt += n[1] + ' ';
                idx.set(bid + '-' + cap + '-' + vs, txt);
            }
        }
        this.notesSearchIndex = idx;
        return idx;
    }

    getNotesText(bookId, chapter, verse, part) {
        if (!this.notesData) return '';
        const idx = this.buildNotesSearchIndex();
        return idx.get(bookId + '-' + chapter + '-' + notesVerseKey(verse, part)) || '';
    }

    // 串珠目标 -> 经文条目。t = [bookId, chapter, verse, verseEnd|结束章, 参标记]
    //   verse = -1 表示章范围（第 4 位是结束章）；verse = 0 表示只到章
    getVersesForTarget(t, primaryKey) {
        if (!t || t.length < 3) return [];
        const bid = t[0], cap = t[1];
        if (bid == null || cap == null) return [];
        const pool = this.allItems || [];
        const v1 = t[2], extra = t[3];
        const hit = (i) => i.versionKey === primaryKey && i.type === 'verse';
        if (v1 === -1) {
            const hi = extra || cap;
            return pool.filter(i => hit(i) && i.bookId === bid && i.chapter >= cap && i.chapter <= hi).slice(0, 12);
        }
        if (!v1) {
            return pool.filter(i => hit(i) && i.bookId === bid && i.chapter === cap).slice(0, 8);
        }
        const hi = (extra && extra > v1) ? extra : v1;
        return pool.filter(i => hit(i) && i.bookId === bid && i.chapter === cap && i.verse >= v1 && i.verse <= hi).slice(0, 20);
    }

    // 串珠目标 -> 实际引用的经文条目（补全数据里缺失的目标）
    // 有些串珠的「文字」（如「太十三54～58；路四16～24」）提到了多个引用，但 targets 数组只列了其中一部分，
    // 导致展开时只显示部分经文。这里以串珠文字为权威来源：解析出所有被引的（书卷+章+节），
    // 凡是 targets 里没有覆盖的，都从经文数据里取出来补上，保证「提到几处就显示几处」。
    getChainReferencedVerses(r, primaryKey) {
        if (!r) return [];
        const pk = primaryKey || this.getPrimaryVersionKey();
        const out = [];
        const seen = new Set();
        const addVerses = (verses) => {
            for (const v of (verses || [])) {
                const k = v.bookId + '-' + v.chapter + '-' + v.verse + '-' + (v.part || '');
                if (!seen.has(k)) { seen.add(k); out.push(v); }
            }
        };
        // 1) 先按串珠文字顺序取（保证显示顺序与文字一致）
        for (const ref of this.parseChainRefText(r[1])) {
            addVerses(this.fetchRefVerses(ref, pk));
        }
        // 2) 再补上 targets 里有、但文字解析没覆盖到的孤立目标（极少见，兜底）
        for (const t of (r[2] || [])) {
            for (const v of this.getVersesForTarget(t, pk)) {
                const k = v.bookId + '-' + v.chapter + '-' + v.verse + '-' + (v.part || '');
                if (!seen.has(k)) { seen.add(k); out.push(v); }
            }
        }
        return out;
    }

    // 解析串珠文字里提到的所有引用，返回 [{bookId, chapter, verse, verseEnd, endChapter, endVerse}]
    // 处理：去掉开头的「N～M节：」当前经文范围；「参」前缀；书名沿用（去掉书名只写章节时沿用上一个书名）；
    // 章/节可为中文或阿拉伯数字；支持同章范围与跨章范围（如「利五1～六7」「出七1～十三1」）。
    // 书名表排除易歧义的「约一/约二/约三」，避免把「约一51」误判为约翰一书（恢复本里「约」指约翰福音）。
    parseChainRefText(text) {
        if (!text) return [];
        // 同 findBibleReferences：恢复本串珠文字中的零偶尔也用白色圆圈○(U+25CB)，先归一为汉字〇(U+3007)
        text = text.replace(/○/g, '〇');
        text = normalizeFullWidthDigits(text);
        // 串珠文字解析不产生字符坐标，不可见格式字符可直接删掉：这里要求「书卷名后紧跟章号」
        // （numRe 不允许空格），替换成空格反而会阻断匹配；删掉后「太<ZWSP>二六6~13」＝「太二六6~13」。
        text = text.replace(INVISIBLE_SPACES_RE, '');
        let s = text.replace(/^\s*\d+[～~\-至]+\d+节\s*[：:]?\s*/, '');
        const refs = [];
        const seen = new Set();
        let curBook = null;
        const NAMES = BOOK_SHORT_NAMES.filter(n => n !== '约一' && n !== '约二' && n !== '约三');
        const cn = '[一二三四五六七八九十百零〇]';
        const numRe = new RegExp('^(' + cn + '+|\\d+)');
        for (const raw of s.split(/[；;、，,　]/)) {
            let part = raw.trim();
            if (!part) continue;
            if (part.startsWith('参')) part = part.slice(1);
            let bookName = null;
            for (const nm of NAMES) { if (part.startsWith(nm)) { bookName = nm; part = part.slice(nm.length); break; } }
            if (!bookName) bookName = curBook; else curBook = bookName;
            if (!bookName) continue;
            const book = BOOK_MAP[bookName] || BOOK_MAP[BOOK_ALIASES[bookName]];
            if (!book) continue;
            const cm = part.match(numRe);
            if (!cm) continue;
            const ch = /^\d/.test(cm[1]) ? parseInt(cm[1]) : chineseToNumber(cm[1]);
            part = part.slice(cm[0].length);
            const vm = part.match(new RegExp('^[:：]?\\s*(' + cn + '+|\\d+)\\s*节?'));
            if (!vm) continue;
            const v1 = /^\d/.test(vm[1]) ? parseInt(vm[1]) : chineseToNumber(vm[1]);
            part = part.slice(vm[0].length);
            let v2 = v1, endChapter = null, endVerse = null;
            const rm = part.match(new RegExp('^[～~-－至–—‐]+\\s*(' + cn + '+|\\d+)'));
            if (rm) {
                const endStr = rm[1];
                const ecm = endStr.match(new RegExp('^(' + cn + '+|\\d+)\\s*[章篇]?\\s*(' + cn + '+|\\d+)?'));
                if (ecm && ecm[2] != null) {
                    endChapter = /^\d/.test(ecm[1]) ? parseInt(ecm[1]) : chineseToNumber(ecm[1]);
                    endVerse = /^\d/.test(ecm[2]) ? parseInt(ecm[2]) : chineseToNumber(ecm[2]);
                } else {
                    v2 = /^\d/.test(endStr) ? parseInt(endStr) : chineseToNumber(endStr);
                }
            }
            const sig = book.id + ':' + ch + ':' + v1 + (endChapter ? ('~' + endChapter + ':' + endVerse) : ('-' + v2));
            if (!seen.has(sig)) { seen.add(sig); refs.push({ bookId: book.id, chapter: ch, verse: v1, verseEnd: v2, endChapter: endChapter, endVerse: endVerse }); }
        }
        return refs;
    }

    // 按引用取经文条目（支持跨章范围，如「利五1～六7」）
    fetchRefVerses(ref, primaryKey) {
        const pk = primaryKey || this.getPrimaryVersionKey();
        const pool = this.allItems || [];
        const hit = (i) => i.versionKey === pk && i.type === 'verse';
        if (ref.endChapter && ref.endChapter !== ref.chapter) {
            const res = [];
            for (const i of pool) {
                if (!hit(i) || i.bookId !== ref.bookId) continue;
                const afterStart = (i.chapter > ref.chapter) || (i.chapter === ref.chapter && i.verse >= ref.verse);
                const beforeEnd = (i.chapter < ref.endChapter) || (i.chapter === ref.endChapter && i.verse <= ref.endVerse);
                if (afterStart && beforeEnd) res.push(i);
            }
            return res.slice(0, 40);
        }
        const v1 = ref.verse, hi = (ref.verseEnd && ref.verseEnd > v1) ? ref.verseEnd : v1;
        return pool.filter(i => hit(i) && i.bookId === ref.bookId && i.chapter === ref.chapter && i.verse >= v1 && i.verse <= hi).slice(0, 20);
    }

    // 下载 / 更新注解数据文件（约 6MB）。raw.githubusercontent 失败时回退 jsDelivr
    async installNotesData(manual = true) {
        const p = `.obsidian/plugins/bible-search-reader/${NOTES_FILE}`;
        if (manual) new Notice('正在下载注解数据（约 6MB）...');
        const errors = [];
        for (const url of NOTES_URLS) {
            try {
                const resp = await requestUrl({ url: url, method: 'GET', timeout: 180000 });
                if (!resp || resp.status !== 200 || !resp.text) {
                    errors.push(url.split('/')[2] + ' → HTTP ' + (resp ? resp.status : '无响应'));
                    continue;
                }
                const j = JSON.parse(resp.text);
                if (!j || !j.chapters) {
                    errors.push(url.split('/')[2] + ' → 返回内容不是注解数据');
                    continue;
                }
                await this.app.vault.adapter.write(p, resp.text);
                this.settings.notesPath = p;   // 记录注解数据实际位置（插件目录），便于设置界面展示与后续读取
                this.notesData = null;
                this.notesSearchIndex = null;
                this._notesAttached = false;
                this.settings.notesInstalled = true;
                await this.saveSettings();
                // 记录注解数据版本，避免下次启动因「无版本记录 + 大小兜底」被误判为有待更新
                try {
                    const manifest = await this.fetchDataManifest();
                    const entry = (manifest.files || []).find(f => f.file === NOTES_FILE);
                    if (entry) {
                        this.settings.dataVersions = this.settings.dataVersions || {};
                        this.settings.dataVersions[NOTES_FILE] = entry.dataVersion;
                        await this.saveSettings();
                    }
                } catch (e) {
                    console.warn('[Bible] 记录注解数据版本失败:', e);
                }
                await this.loadNotesData();
                this._notesAttached = false;
                this.attachNotesToItems();
                this.refreshNotesViews();   // 下载完成后立即挂载数据并刷新已打开的视图
                if (manual) new Notice('注解数据已安装');
                return true;
            } catch (e) {
                console.error('[Bible] 注解数据下载失败:', url, e);
                errors.push(url.split('/')[2] + ' → ' + (e && e.message ? e.message : e));
            }
        }
        if (manual) new Notice('下载注解数据失败：' + errors.join('；'), 12000);
        return false;
    }

    // ===== 注解 / 串珠条目（检索页 / 阅读页 / 经文弹窗通用）=====
    // 注 / 串不再单独存放候选：每条注 / 串包装成一个候选条目（type='note' / 'chain'），
    // 交给所在页面原有的选中逻辑处理——与页面里的经文共用同一套序号、复制与投影按钮。
    // kind：'n' | 'note' = 注解；'r' | 'chain' = 串珠
    buildNoteItem(vi, kind, label, bodyText, refText) {
        const isNote = (kind === 'n' || kind === 'note');
        const src = (vi && vi.item) ? vi.item : vi;
        // 注解正文在源数据里用空行分段，且从第二段起常带全角空格缩进。
        // 逐段去首尾空白后重新拼接（注解段间留一个空行，串珠按行排），
        // 否则复制出去再贴进 Obsidian，第二段起会被当成缩进块。
        const parts = String(bodyText || '').split(/\n+/).map(t => t.trim()).filter(t => t.length > 0);
        const body = isNote ? parts.join('\n\n') : parts.join('\n');
        return {
            type: isNote ? 'note' : 'chain',
            versionKey: src.versionKey || (this.getPrimaryVersionKey ? this.getPrimaryVersionKey() : ''),
            bookId: src.bookId,
            bookShortName: src.bookShortName,
            bookFullName: src.bookFullName,
            chapter: src.chapter,
            verse: src.verse,
            part: src.part || '',
            ref: refText || '',
            content: body,
            noteKey: (isNote ? 'note' : 'chain') + ':' + src.bookId + ':' + src.chapter + ':' +
                src.verse + ':' + (src.part || '') + ':' + label
        };
    }

    // 在一条注解 / 串珠条目左侧渲染「候选框」+「并」候选框（样式复用经文候选框）
    // st: { selected, order, sideBySide }；handlers: { onToggle, onToggleSide }
    renderNoteEntryBoxes(rowEl, st, handlers) {
        if (rowEl) rowEl._noteToggle = (handlers && handlers.onToggle) ? handlers.onToggle : null;
        const wrap = rowEl.createDiv({ cls: 'bible-nc-boxes' });
        const cb = wrap.createDiv({ cls: 'bible-result-checkbox bible-nc-checkbox' + (st.selected ? ' checked' : '') });
        if (st.selected) cb.setText(String(st.order));
        cb.title = '选为候选（与所在页面共用复制 / 投影）';
        cb.addEventListener('click', (e) => {
            e.stopPropagation();
            if (handlers && handlers.onToggle) handlers.onToggle();
        });
        if (st.selected) {
            const sideTag = wrap.createDiv({ cls: 'bible-side-tag' + (st.sideBySide ? ' active' : '') });
            sideTag.setText(st.sideBySide ? '✓ 并列' : '并');
            sideTag.title = '并列投影（再点取消）';
            sideTag.addEventListener('click', (e) => {
                e.stopPropagation();
                if (handlers && handlers.onToggleSide) handlers.onToggleSide();
            });
        }
        return wrap;
    }

    // 经文弹窗里的注 / 串：候选框与弹窗里的经文共用同一套序号 / 复制 / 投影
    // ctx: { getView, sessionKey, refresh }
    renderTooltipNoteBoxes(rowEl, noteItem, ctx) {
        const view = (ctx && ctx.getView) ? ctx.getView() : null;
        const keepOn = !!(view && view.keepCandidates);
        const ownIdx = this.tooltipPoolIndexOf(noteItem);
        let selected = ownIdx !== -1;
        let order = ownIdx !== -1 ? ownIdx + 1 : 0;
        let sideBySide = ownIdx !== -1 ? !!this.getTooltipPool()[ownIdx].sideBySide : false;
        if (keepOn) {
            const pi = view.poolIndexOf(noteItem, false);
            if (pi !== -1) {
                selected = true; order = pi + 1; sideBySide = !!view.candidatePool[pi].sideBySide;
            } else if (selected) {
                order = view.getAllSelections().length;
            }
        }
        return this.renderNoteEntryBoxes(rowEl, { selected: selected, order: order, sideBySide: sideBySide }, {
            onToggle: () => {
                if (selected) {
                    this.tooltipPoolRemove(noteItem);
                    if (view) view.poolSyncDeselect(noteItem, false);
                } else {
                    this.tooltipPoolAdd(noteItem, false);
                    if (view && view.keepCandidates) {
                        view.poolSyncSelect(noteItem, false, false, 'tooltip', ctx && ctx.sessionKey);
                    }
                }
                if (view) view.updateKeepCandidatesUI();
                if (ctx && ctx.refresh) ctx.refresh();
            },
            onToggleSide: () => {
                if (!selected) return;
                const next = !sideBySide;
                this.tooltipPoolSetSide(noteItem, next);
                if (view && view.poolSetSideBySide) view.poolSetSideBySide(noteItem, false, next);
                if (view) view.updateKeepCandidatesUI();
                if (ctx && ctx.refresh) ctx.refresh();
            }
        });
    }

    // 经文弹窗里的注解 / 串珠面板
    // kind / label 指定时只显示对应的那一条注解或串珠
    // depth：串珠经文里再展开注 / 串的层级（各级均保留 ¹ ᵃ 上标，可继续向下钻取，无限嵌套由每节只保留一个子面板兜底）
    fillTooltipNotePanel(panel, nd, v, kind, label, ctx, depth) {
        panel.empty();
        panel.addEventListener('click', (e) => e.stopPropagation());
        const pk = (v && v.item) ? v.item.versionKey : null;
        const vi = (v && v.item) ? v.item : v;
        const shortName = (vi && vi.bookShortName) || '';
        const notes = (kind === 'r') ? [] : (nd.n || []).filter(n => !kind || n[0] === label);
        const refs = (kind === 'n') ? [] : (nd.r || []).filter(r => !kind || r[0] === label);
        for (const n of notes) {
            const row = panel.createDiv({ cls: 'bible-note-item' });
            const refText = shortName + (vi ? vi.chapter : '') + ':' + (vi ? vi.verse : '') + (vi ? (vi.part || '') : '') + '注' + n[0];
            this.renderTooltipNoteBoxes(row, this.buildNoteItem(vi, 'n', n[0], n[1], refText), ctx);
            const content = row.createDiv({ cls: 'bible-note-content' });
            content.createEl('span', { cls: 'bible-note-label bible-note-label-note', text: '注' + n[0] });
            // 注解正文里提到的经文出处也识别为可点击引用（承上上下文取该注解所属的书卷与章）
            appendNoteBody(content, n[1], this, vi ? { bookId: vi.bookId, chapter: vi.chapter } : null);
            content.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.closest('.bible-note-ref-addr')) return;
                if (row._noteToggle) row._noteToggle();
            });
        }
        for (const r of refs) {
            const row = panel.createDiv({ cls: 'bible-note-item bible-note-item-ref' });
            // 本方法的 this 就是 plugin（调用处均为 plugin.fillTooltipNotePanel），
            // 原先误写成 this.plugin.getChainReferencedVerses，导致 this.plugin 取不到而抛错、
            // 整个串珠列表渲染不出来也更无法点击
            const verses = this.getChainReferencedVerses(r, pk);
            const quoted = [];
            for (const tv of verses) {
                quoted.push(tv.bookShortName + tv.chapter + ':' + tv.verse + (tv.part || '') + ' ' + tv.content);
            }
            const refText = shortName + (vi ? vi.chapter : '') + ':' + (vi ? vi.verse : '') + (vi ? (vi.part || '') : '') + '串' + r[0];
            const bodyText = r[1] + (quoted.length ? '\n' + quoted.join('\n') : '');
            this.renderTooltipNoteBoxes(row, this.buildNoteItem(vi, 'r', r[0], bodyText, refText), ctx);
            const content = row.createDiv({ cls: 'bible-note-content' });
            content.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.closest('.bible-note-ref-addr')) return;
                if (row._noteToggle) row._noteToggle();
            });
            const head = content.createDiv({ cls: 'bible-note-ref-head' });
            head.createEl('span', { cls: 'bible-note-label bible-note-label-ref', text: '串' + r[0] });
            head.createEl('span', { cls: 'bible-note-refs', text: r[1] });
            for (const tv of verses) {
                const vr = content.createDiv({ cls: 'bible-note-ref-verse' });
                // 出处可点击：跳转到圣经阅读页对应经文（与阅读页串珠一致）。
                // 原来这里只渲染了文字没绑事件，外层的 click 又把它 return 掉，点了毫无反应。
                const addr = vr.createEl('span', { cls: 'bible-note-ref-addr', text: tv.bookShortName + tv.chapter + ':' + tv.verse + (tv.part || '') });
                addr.title = '点击在弹窗中查看该节，双击跳转到圣经阅读页';
                const tvMatch = {
                    bookId: tv.bookId,
                    bookShortName: tv.bookShortName,
                    allRefs: [{ chapter: tv.chapter, verse: tv.verse, verseEnd: null, suffix: null, endChapter: null, endVerse: null }]
                };
                addr.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.detail > 1) return;   // 双击的第二下不再处理，交给 dblclick 去跳转
                    // 弹窗里点串珠出处：原地压一层显示该节，弹窗不关闭、位置不变；
                    // 再点同一处出处则关闭弹窗
                    this.toggleTooltipFromElement(addr, tvMatch);
                });
                addr.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.removeCurrentTooltip();
                    this.jumpToBibleReader(tvMatch);
                });
                const vt = vr.createEl('span', { cls: 'bible-note-ref-text' });
                // 串珠引用的经文同样带 ¹ ᵃ 上标，点击在该节下方展开对应注解 / 串珠。
                // 各级（含嵌套串珠）都保留标注，可继续向下钻取；每个被引经文行只保留一个子面板，
                // 不会出现无限叠加 DOM，故不限制层级。
                this.renderVerseTextWithMarkers(vt, tv, (k2, l2) => this.toggleTooltipNoteSubPanel(vr, tv, k2, l2, ctx, depth));
            }
        }
    }

    // 弹窗里串珠引用的经文：点注 / 串上标，在该节经文行下方展开 / 收起对应的注解或串珠
    toggleTooltipNoteSubPanel(vr, item, kind, label, ctx, depth) {
        const key = kind + ':' + label;
        const existing = Array.from(vr.children).find(c => c.classList && c.classList.contains('bible-note-panel'));
        if (existing) {
            if (existing.getAttribute('data-sub-key') === key) { existing.remove(); return; }
            existing.remove();
        }
        const nd = this.getVerseNotes(item.bookId, item.chapter, item.verse, item.part);
        const p = vr.createDiv({ cls: 'bible-note-panel bible-note-sub-panel' });
        p.setAttribute('data-sub-key', key);
        this.fillTooltipNotePanel(p, nd, item, kind, label, ctx, (depth || 0) + 1);
    }

    // 把注解正文挂到对应经文条目上，供检索匹配（只做一次）
    attachNotesToItems() {
        if (this._notesAttached || !this.notesData) return;
        const idx = this.buildNotesSearchIndex();
        const all = this.allItems || [];
        for (const item of all) {
            if (item.type !== 'verse') continue;
            const t = idx.get(item.bookId + '-' + item.chapter + '-' + notesVerseKey(item.verse, item.part));
            if (t) item.notesText = t;
            else if (item.notesText) delete item.notesText;
            // 注解级检索需要逐条注解：[[注号, 正文], ...]
            const nd = this.getVerseNotes(item.bookId, item.chapter, item.verse, item.part);
            if (nd && nd.n && nd.n.length) item.notesList = nd.n;
            else if (item.notesList) delete item.notesList;
        }
        this._notesAttached = true;
    }

    // 把一段文本按关键词切开，追加到容器（命中处包 .bible-keyword）
    appendHighlighted(container, text, keywords) {
        if (!keywords || !keywords.length || !text) {
            container.appendChild(document.createTextNode(text || ''));
            return;
        }
        const matches = [];
        for (const kw of keywords) {
            const lower = text.toLowerCase();
            const kwLower = kw.toLowerCase();
            let idx = lower.indexOf(kwLower);
            while (idx !== -1) {
                matches.push({ start: idx, end: idx + kw.length });
                idx = lower.indexOf(kwLower, idx + 1);
            }
        }
        matches.sort((a, b) => a.start - b.start);
        const merged = [];
        for (const m of matches) {
            if (merged.length === 0 || m.start >= merged[merged.length - 1].end) merged.push({ start: m.start, end: m.end });
            else if (m.end > merged[merged.length - 1].end) merged[merged.length - 1].end = m.end;
        }
        let lastEnd = 0;
        for (const seg of merged) {
            if (seg.start > lastEnd) container.appendChild(document.createTextNode(text.slice(lastEnd, seg.start)));
            const span = document.createElement('span');
            span.className = 'bible-keyword';
            span.textContent = text.slice(seg.start, seg.end);
            container.appendChild(span);
            lastEnd = seg.end;
        }
        if (lastEnd < text.length) container.appendChild(document.createTextNode(text.slice(lastEnd)));
    }

    // 把经文按锚点切开，在标记处插入上标元素
    // markers: [[ci, kind('n'|'r'), label, anchor]]；keywords 可选，用于同时高亮检索关键词
    renderTextWithMarkers(container, text, markers, onMarkerClick, keywords) {
        if (!markers || !markers.length) {
            if (keywords && keywords.length) {
                container.empty();
                this.appendHighlighted(container, text, keywords);
            } else {
                container.setText(text);
            }
            return;
        }
        // 建立「非标点字符序列」-> 原文下标的映射，标点差异不影响定位
        const pos = [];
        let seq = '';
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (NOTE_PUNC_RE.test(c)) continue;
            seq += c;
            pos.push(i);
        }
        const cutAt = (ci) => {
            if (ci <= 0) return 0;
            const p = pos[ci - 1];
            return p === undefined ? text.length : p + 1;
        };
        // 计数落点是「第 ci 个非标点字符之后」，其后紧邻的标点在原文里位于上标之前
        // （如「神说，¹我们要」），因此在后面还有实词时把落点推过这些标点。
        // 用源文件逐节比对：计数 89.00% / 锚点优先 88.35% / 跳过标点 99.85%。
        const skipPunct = (i) => {
            let j = i;
            while (j < text.length && NOTE_PUNC_RE.test(text[j])) j++;
            return j < text.length ? j : i;   // 后面没有实词了就不动
        };

        let cursor = 0;        // 原文游标
        const frag = document.createDocumentFragment();
        for (const mk of markers) {
            const ci = mk[0], kind = mk[1], label = mk[2], anchor = mk[3];
            // 定位以「前面有多少个非标点字符」为准：经文正文与注解数据源出同源（逐字一致），
            // 计数定位永远精确；锚点（前若干非标点字符）在经文内有重复文句时会命中靠前的位置
            // （如创 1:26 的注2 前面都是「着我们的」），因此只作计数越界时的兜底。
            let target = ci;
            if (target > seq.length && anchor) {
                const found = seq.indexOf(anchor);
                if (found !== -1) target = found + anchor.length;
            }
            let at = skipPunct(cutAt(target));
            if (at < cursor) at = cursor;   // 不回退
            if (at > cursor) this.appendHighlighted(frag, text.slice(cursor, at), keywords);
            const sup = document.createElement('sup');
            sup.className = 'bible-note-mark ' + (kind === 'n' ? 'bible-note-mark-note' : 'bible-note-mark-ref');
            sup.setText(label);
            sup.setAttribute('data-kind', kind);
            sup.setAttribute('data-label', label);
            sup.title = kind === 'n' ? ('注 ' + label) : ('串珠 ' + label);
            if (onMarkerClick) {
                sup.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMarkerClick(kind, label);
                });
            }
            frag.appendChild(sup);
            cursor = at;
        }
        if (cursor < text.length) this.appendHighlighted(frag, text.slice(cursor), keywords);
        container.empty();
        container.appendChild(frag);
    }

    // 把一节经文正文渲染进容器，并按该节的注 / 串标记插入上标。
    // 供串珠引用的经文复用——串珠列出的被引经文从此与阅读页经文本体一样带 ¹ ᵃ 上标，
    // 点击即在该节下方展开对应的注解或串珠。注解开关关闭时只出纯文本。
    renderVerseTextWithMarkers(container, item, onMarkerClick, keywords) {
        const content = (item && item.content) || '';
        const nd = (item && item.type === 'verse' && this.settings && this.settings.showNotes && this.notesData)
            ? this.getVerseNotes(item.bookId, item.chapter, item.verse, item.part)
            : null;
        if (!nd || !nd.m || !nd.m.length) {
            if (typeof container.empty === 'function') container.empty();
            else while (container.firstChild) container.removeChild(container.firstChild);
            this.appendHighlighted(container, content, keywords);
            return;
        }
        this.renderTextWithMarkers(container, content, nd.m, onMarkerClick, keywords);
    }

    // 把一段文本（注解正文）里出现的经文出处识别出来，渲染成可点击的引用：
    // 单击弹出经文浮窗、双击跳转到圣经阅读页，与阅读模式下笔记正文里的引用同一套交互。
    // ctx：{ bookId, chapter } —— 该注解所属经文的书卷与章，作为「承上省略」的上下文
    //     （注文里只写「三24」而省略书卷时，沿用所属经文的书卷）
    linkifyBibleRefs(container, text, ctx, keywords) {
        const src = String(text || '');
        if (typeof container.empty === 'function') container.empty();
        else while (container.firstChild) container.removeChild(container.firstChild);
        if (!src) return;
        let matches = [];
        if (typeof this.findBibleReferences === 'function') {
            try {
                matches = this.findBibleReferences(
                    src,
                    (ctx && ctx.bookId != null) ? ctx.bookId : null,
                    (ctx && ctx.chapter != null) ? ctx.chapter : null,
                    null, null,
                    // 注文模式：展开更符合注文写法的规则（省略书卷时归属注文所属书卷等）
                    (ctx && ctx.bookId != null) ? { bookId: ctx.bookId, chapter: ctx.chapter } : null
                ) || [];
            } catch (e) { matches = []; }
        }
        if (!matches.length) {
            this.appendHighlighted(container, src, keywords);
            return;
        }
        // 多个识别阶段可能对同一处经文给出重叠候选（如弱引用把引导词「参」一起吃进来，
        // 强引用又单独识别出「罗三24」）。重叠时保留更完整的那条，避免出现
        // 「参罗三」+「24」这种被切碎的链接。
        const sorted = matches.slice().sort((a, b) =>
            (a.start - b.start) || ((b.end - b.start) - (a.end - a.start)));
        const picked = [];
        for (const m of sorted) {
            const prev = picked[picked.length - 1];
            if (prev && m.start < prev.end) {
                if ((m.end - m.start) > (prev.end - prev.start)) picked[picked.length - 1] = m;
                continue;
            }
            picked.push(m);
        }
        const frag = document.createDocumentFragment();
        let last = 0;
        for (const m of picked) {
            let s = m.start, e = m.end;
            if (s < last) s = last;
            if (e <= s) continue;
            // 「参 / 见 / 参看 …」这类引导词不属于出处本身，留作普通文本，不包进链接
            const lm = src.slice(s, e).match(/^(参看|参见|参阅|参|见)/);
            if (lm && lm[0].length < (e - s)) {
                if (s > last) this.appendHighlighted(frag, src.slice(last, s), keywords);
                this.appendHighlighted(frag, lm[0], keywords);
                s += lm[0].length;
                last = s;
            }
            if (s > last) this.appendHighlighted(frag, src.slice(last, s), keywords);
            const span = document.createElement('span');
            span.className = 'bible-inline-ref';
            span.textContent = src.slice(s, e);
            const r0 = (m.allRefs && m.allRefs[0]) || {};
            span.dataset.bookId = (m.bookId != null) ? m.bookId : '';
            span.dataset.chapter = (r0.chapter != null) ? r0.chapter : '';
            span.dataset.verse = (r0.verse != null) ? r0.verse : '';
            span.dataset.verseEnd = (r0.verseEnd != null) ? r0.verseEnd : '';
            span.dataset.suffix = r0.suffix || '';
            span.title = '点击查看经文，双击跳转';
            // 若这个出处本身就在经文弹窗里（注文中提到的经文），则在当前弹窗内新开一层显示，
            // 不再关掉旧弹窗另起浮层（否则新弹窗会丢失锚点、跑到左上角）
            span.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                if (ev.detail > 1) return;   // 双击的第二下不再处理，交给 dblclick 去跳转
                // 再点同一处出处即关闭弹窗；否则在弹窗里压一层或新开弹窗
                this.toggleTooltipFromElement(span, m);
            });
            span.addEventListener('dblclick', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                this.removeCurrentTooltip();
                this.jumpToBibleReader(m);
            });
            frag.appendChild(span);
            last = e;
        }
        if (last < src.length) this.appendHighlighted(frag, src.slice(last), keywords);
        container.appendChild(frag);
    }

    // Q/W/E 在「经文投影已切成标签页」时的动作决策（纯函数，便于回归测试）：
    //   reveal —— 按键瞬间标签在后台：只调回，绝不关闭；
    //   close  —— 标签已在前台且当前正是该模式：再按同键关闭（q/w/e 各管各的模式）；
    //   mode   —— 标签已在前台但按了别的模式：原地切排版；
    //   pass   —— 不是标签页模式：交回原有的全屏 / 侧边栏分派。
    resolveQweTabAction(projTab, mode, tabWasBehind) {
        if (!projTab) return 'pass';
        if (tabWasBehind) return 'reveal';
        if (projTab.mode === mode) return 'close';
        return 'mode';
    }

    // 执行上面的决策；返回 true 表示按键已被标签页模式消费。
    applyQweTabAction(projTab, mode, tabAction) {
        if (!projTab || tabAction === 'pass') return false;
        if (tabAction === 'reveal') {
            if (projTab.mode !== mode) projTab.setMode(mode);
            return true;
        }
        if (tabAction === 'close') { projTab.close(); return true; }
        if (tabAction === 'mode') { projTab.setMode(mode); return true; }
        return false;
    }

    // 经文投影切成标签页后，判断那个标签是否正是当前显示的标签。
    // ⚠️ 绝不能用 overlay / containerEl 的 offsetWidth 判断：Obsidian 的非激活标签仍留在
    // DOM 里且保有布局尺寸，背景标签会被误判成「正显示」，QWE 就会落到同键关闭把标签 detach 掉。
    // 只认 workspace 的活动 leaf；activeLeaf 明确指向别的标签时立即判定为后台。
    // 完全拿不到信息时按「后台」处理——宁可多调回一次，也绝不误关标签页。
    isProjectionTabActive(proj) {
        const leaf = proj && proj.projectionLeaf;
        if (!leaf) return true;
        const ws = this.app && this.app.workspace;
        if (!ws) return false;
        // ① 标签头的 is-active 由 Obsidian 自己同步维护，是判断「当前显示哪个标签」最可靠的信号。
        //    workspace.activeLeaf 在部分版本里是废弃字段，切换标签后可能滞后不更新，
        //    导致在 Hymns / 笔记标签里按 QWE 时被误判成「投影标签已激活」而不去调回。
        try {
            const th = leaf.tabHeaderEl;
            if (th && th.classList && typeof th.classList.contains === 'function') {
                return th.classList.contains('is-active');
            }
        } catch (e) { /* 忽略 */ }
        let al = null;
        try { al = ws.activeLeaf; } catch (e) { /* 忽略 */ }
        if (al) return al === leaf;
        try {
            if (typeof ws.getActiveViewOfType === 'function') {
                const av = ws.getActiveViewOfType(BIBLE_PROJECTION_VIEW_TYPE);
                return !!(av && av.leaf === leaf);
            }
        } catch (e) { /* 忽略 */ }
        return false;
    }

    // 收掉「重启恢复出来、没有对应投影实例」的空白经文投影标签。
    // 视图 onOpen 的自检是主力，这里是插件级兜底（按 QWE 重新投影之前的最后一道保险）。
    cleanupOrphanProjectionTabs() {
        const ws = this.app && this.app.workspace;
        if (!ws || typeof ws.getLeavesOfType !== 'function') return 0;
        let n = 0;
        try {
            const leaves = ws.getLeavesOfType(BIBLE_PROJECTION_VIEW_TYPE) || [];
            for (const l of leaves) {
                try { l.detach(); n++; } catch (e) { /* 忽略 */ }
            }
        } catch (e) { /* 忽略 */ }
        return n;
    }

    // 把投影标签页调回前台：只激活，不重建、不关闭
    revealProjectionTab(proj) {
        const leaf = proj && proj.projectionLeaf;
        const ws = this.app && this.app.workspace;
        if (!leaf || !ws) return;
        try {
            if (typeof ws.revealLeaf === 'function') ws.revealLeaf(leaf);
            else if (typeof ws.setActiveLeaf === 'function') ws.setActiveLeaf(leaf, { focus: false });
        } catch (e) { /* 忽略 */ }
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
        const p = this.resolveDataPath(file);
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

    /** 下载并覆盖指定数据文件；覆盖前备份为 <file>.old，全部完成后重载数据。
     *  逐文件记录成功 / 失败：失败的会持久化到 settings.pendingDataUpdates，
     *  方便重启后再次提醒并在设置 / 对照页重试。返回 { succeeded, failed }。 */
    async updateBibleData(items) {
        const succeeded = [];
        const failed = [];
        let bibleReload = false;
        let notesReload = false;
        let done = 0;
        for (const item of items) {
            // 就地更新：目标路径取文件当前所在位置（插件目录或用户自行放置的任意位置），
            // 而不是一律覆盖到插件目录——手动放置的文件原地升级，避免产生第二份副本。
            const target = this.resolveDataPath(item.file);
            const parent = target.split('/').slice(0, -1).join('/');
            if (parent && !(await this.app.vault.adapter.exists(parent))) {
                try { await this.app.vault.adapter.mkdir(parent); } catch (e) { /* 已存在则忽略 */ }
            }
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
                // 记录更新后的实际路径，保证下次读取 / 更新仍能定位
                if (item.file === NOTES_FILE) {
                    this.settings.notesPath = target;
                    this.settings.notesInstalled = true;
                } else {
                    const v = (this.settings.versions || []).find(x => x.file === item.file);
                    if (v) v.path = target;
                }
                await this.saveSettings();
                succeeded.push(item);
                if (item.file === NOTES_FILE) {
                    notesReload = true;
                } else {
                    bibleReload = true;
                }
                done++;
                notice.hide();
            } catch (e) {
                notice.hide();
                failed.push({ item, error: (e && e.message) ? e.message : String(e) });
            }
        }
        // 重载数据
        if (bibleReload) {
            try { await this.loadBibleData(); } catch (e) { console.error('[Bible] 重载经文数据失败:', e); }
        }
        if (notesReload) {
            try {
                this.notesData = null;
                this.notesSearchIndex = null;
                this._notesAttached = false;
                await this.loadNotesData();
                this.attachNotesToItems();
                await this.refreshNotesViews();
            } catch (e) { console.error('[Bible] 重载注解数据失败:', e); }
        }
        // 持久化「仍未完成」的更新，便于重启后再次提醒 / 重试
        this.settings.pendingDataUpdates = failed.map(f => f.item.file);
        await this.saveSettings();
        // 明确反馈结果，让用户知道成功 / 失败，失败的可重试
        if (failed.length === 0) {
            new Notice(`✅ 已更新 ${succeeded.length} 个圣经数据文件`, 6000);
        } else if (succeeded.length === 0) {
            new Notice(`❌ 圣经数据更新失败：${failed.map(f => f.item.name).join('、')}（${failed[0].error}）。可在设置或对照页重试。`, 12000);
        } else {
            new Notice(`⚠️ 已更新 ${succeeded.length} 个，${failed.length} 个失败（${failed.map(f => f.item.name).join('、')}）。可在设置或对照页重试。`, 12000);
        }
        return { succeeded, failed };
    }

    /** 启动时调用；默认 12 小时节流，force=true 可强制（手动检查用）。
     *  若此前有更新未完成（settings.pendingDataUpdates 非空），则绕过 12h 节流再次提醒，
     *  避免「更新因网络失败、重启后不再提示、也不知道是否成功」的情况。 */
    async checkBibleDataUpdateAndNotify(force = false) {
        try {
            if (!force && !this.settings.autoCheckUpdate) return;
            const now = Date.now();
            const persisted = (this.settings.pendingDataUpdates || []);
            const inCooldown = now < (this.settings.dataUpdateCooldownUntil || 0);
            if (!force && !persisted.length && now - (this.settings.lastDataCheckAt || 0) < 12 * 3600 * 1000) return;
            if (!force && inCooldown) return;
            const pending = await this.checkBibleDataUpdate();
            if (pending && pending.length) {
                this.settings.lastDataCheckAt = now;
                this.settings.pendingDataUpdates = pending.map(p => p.file);
                await this.saveSettings();
                this.showDataUpdateNotification(pending, persisted.length > 0);
            } else {
                // 没有待更新：清掉历史「未完成」记录，避免日后无意义重弹
                if (persisted.length) {
                    this.settings.pendingDataUpdates = [];
                    await this.saveSettings();
                }
                if (force) new Notice('圣经数据已是最新版本');
            }
        } catch (e) {
            console.error('[Bible] 数据更新通知失败:', e);
        }
    }

    /** 右下角常驻通知（不自动消失），提供「查看详情 / 立即更新 / 稍后」。
     *  fromFailure=true 表示此前更新未完成（失败或被延后），标题提示可重试。 */
    showDataUpdateNotification(pending, fromFailure = false) {
        const notice = new Notice('', 0);
        const frag = document.createDocumentFragment();
        const wrap = document.createElement('div');
        wrap.style.padding = '8px';
        wrap.style.minWidth = '300px';
        const names = pending.map(p => p.name).join('、');
        const total = pending.reduce((s, p) => s + (p.size || 0), 0);
        wrap.innerHTML = '<div style="font-weight:600;margin-bottom:6px;">📖 ' + (fromFailure ? '圣经数据更新未完成，可重试' : '圣经数据有可用更新') + '</div>' +
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

        laterBtn.addEventListener('click', () => {
            // 点「稍后」后 24 小时内不再弹数据更新提示，避免反复打扰；但持久化的 pendingDataUpdates 仍保留，
            // 待冷却结束或下次手动检查时会再次提醒，确保更新不会因一次延后就彻底消失。
            this.settings.dataUpdateCooldownUntil = Date.now() + 24 * 3600 * 1000;
            this.saveSettings();
            notice.hide();
        });
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
                // 只有二级标题（## [4.0.3] - …）才是版本分隔。三级标题「### 修复」是正文小标题，
                // 若一并当成版本分隔，会在它出现时先 flush 掉当前版本（只剩标题行），再把 current
                // 置空吞掉后面的全部正文——历史弹窗里 4.0.x 显示为空就是这个原因。
                if (t.startsWith('##') && !t.startsWith('###')) {
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
                // 同上：三级小标题「### 修复」不算版本标题
                if (t.startsWith('##') && !t.startsWith('###') && t.indexOf(version) !== -1) { start = i; break; }
            }
            if (start === -1) return null;
            const out = [];
            for (let i = start + 1; i < lines.length; i++) {
                const t = lines[i].trim();
                if (t.startsWith('##') && !t.startsWith('###')) break;
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

    // 经节索引（按「书卷-章-节」快速取经文），供经文弹窗 / 串珠按需使用。
    // 索引只在数据变化后重建——首次安装下载完数据若不重建，索引一直是空的，
    // 弹窗就会显示「未找到经文」（旧代码只在渲染 Markdown 引用时才顺手建索引）。
    ensureVerseIndex() {
        if (this.verseIndex && this.verseIndex.size > 0) return;
        if (!this.allItems || this.allItems.length === 0) return;
        this.buildVerseIndex();
    }

    // 主版本：设置里标记 primary 且已启用 / 已安装的版本。
    // 没有显式主版本时退回到第一个「已启用且已安装」的版本——刚下载完数据、还没显式
    // 指定主版本的场景很常见，若返回 null 会让经文弹窗查不到任何经文。
    getPrimaryVersionKey() {
        const vs = this.settings.versions || [];
        const pv = vs.find(v => v.isPrimary && v.enabled && v.installed);
        if (pv) return pv.key;
        const first = vs.find(v => v.enabled && v.installed);
        return first ? first.key : null;
    }

    buildVerseIndex() {
        this.verseIndex.clear();
        // 章 → 该章最大节号（用于「只写到章」的引用在弹窗里展开整章）
        this.chapterVerseCounts = new Map();
        const primaryKey = this.getPrimaryVersionKey();
        if (!primaryKey) return;
        for (const item of this.allItems) {
            if (item.versionKey !== primaryKey || item.type !== 'verse') continue;
            const key = `${item.bookId}-${item.chapter}-${item.verse}`;
            // 被拆成上 / 下半节的经文，两半都要能在弹窗里显示
            let arr = this.verseIndex.get(key);
            if (!arr) { arr = []; this.verseIndex.set(key, arr); }
            arr.push(item);
            const ck = `${item.bookId}-${item.chapter}`;
            if (item.verse > (this.chapterVerseCounts.get(ck) || 0)) this.chapterVerseCounts.set(ck, item.verse);
        }
    }

    // 某章的节数；数据缺失时按 150 兜底（避免“创世记一章”只弹出前几节）
    getChapterVerseCount(bookId, chapter) {
        if (this.chapterVerseCounts && this.chapterVerseCounts.has(`${bookId}-${chapter}`)) {
            return this.chapterVerseCounts.get(`${bookId}-${chapter}`);
        }
        return 150;
    }


    // 上下文跨段落（跨块元素）持久化：只写章节未写书卷时，沿用本文档前文中最后出现的书卷。
    // MarkdownPostProcessor 对每个块元素单独调用，局部变量无法跨块传递，因此存到实例上。
    refCtxReset(docPath, lineNo) {
        const c = this._refCtx;
        if (!c) { this._refCtx = { docPath: docPath || null, lineNo: lineNo == null ? -1 : lineNo, bookId: null, chapter: null, strongChapter: null, dormantChapter: null }; return; }
        // 换文档，或行号回退（说明是一次新的渲染，从文档开头重新处理）→ 重置上下文
        if ((docPath && c.docPath && docPath !== c.docPath) || (lineNo != null && lineNo <= c.lineNo)) {
            this._refCtx = { docPath: docPath || c.docPath, lineNo: lineNo == null ? -1 : lineNo, bookId: null, chapter: null, strongChapter: null, dormantChapter: null };
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
        let globalLastDormantChapter = ctx.dormantChapter != null ? ctx.dormantChapter : null;
        for (const textNode of textNodes) {
            const text = textNode.textContent;
            if (!text || text.trim().length === 0) continue;
            const matches = this.findBibleReferences(text, globalLastBookId, globalLastChapter, globalLastStrongChapter, globalLastDormantChapter);
            if (matches.length === 0) continue;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            for (const match of matches) {
                let mStart = match.start;
                let mEnd = match.end;
                // 与前面已渲染的高亮重叠时（如括号弱引用覆盖了其中被阶段1单独识别的强引用），
                // 裁剪起点，避免把重叠文字重复输出（修复「约一4」之类重复显示的问题）
                if (mStart < lastIndex) mStart = lastIndex;
                if (mEnd <= mStart) continue;
                if (mStart > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, mStart)));
                }
                const span = document.createElement('span');
                span.className = 'bible-inline-ref';
                span.textContent = text.slice(mStart, mEnd);
                span.dataset.bookId = match.bookId;
                span.dataset.chapter = match.allRefs[0].chapter;
                span.dataset.verse = match.allRefs[0].verse || '';
                span.dataset.verseEnd = match.allRefs[0].verseEnd || '';
                span.dataset.suffix = match.allRefs[0].suffix || '';
                // 移动端适配：单击打开经文弹窗；双击跳转到圣经阅读对应经文
                span.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.detail > 1) return;   // 双击的第二下不再处理，交给 dblclick 去跳转
                    // 再点同一处出处即关闭弹窗（注解数据首次用到时才读，读完后继续）
                    if (this.settings.showNotes && !this.notesData && !this._notesLoading) {
                        this.loadNotesData().then(() => this.toggleTooltipFromElement(span, match));
                    } else {
                        this.toggleTooltipFromElement(span, match);
                    }
                });
                span.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.removeCurrentTooltip();
                    this.jumpToBibleReader(match);
                });
                fragment.appendChild(span);
                lastIndex = mEnd;
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
            if (endedChapter != null) {
                globalLastChapter = endedChapter;
                globalLastDormantChapter = endedChapter;
            }
            // 如果是强引用（有 bookName），更新强引用上下文
            if (lastMatch.bookName) {
                globalLastStrongChapter = endedChapter != null ? endedChapter : globalLastStrongChapter;
            }
            // 若文本以句号/问号/感叹号结束，重置章上下文（新句子不再沿用章号）；
            // 但书卷上下文保留——只写章节未写书卷时，仍沿用前面段落最后出现的书卷。
            // 被清掉的章号存为“休眠章”，供后续出现的明确经节标记（（16）/——16/17节）复用。
            if (/[。！？]/.test(text.trim().slice(-1))) {
                if (globalLastChapter != null) globalLastDormantChapter = globalLastChapter;
                globalLastChapter = null;
                globalLastStrongChapter = null;
            }
        }
        ctx.bookId = globalLastBookId;
        ctx.chapter = globalLastChapter;
        ctx.strongChapter = globalLastStrongChapter;
        ctx.dormantChapter = globalLastDormantChapter;
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
        // 整行只有序号本身（如单独一行的“一、”“十三、”“十四、”）就是段落序号，不是经节
        if (!next) return true;
        // 后续为数字/范围符/上中下后缀/章:节冒号/收尾标点/括号闭合 → 可能是经文引用，不作纲目标记
        if (/[\d～~\-－–—‐上中下:：）〕)\],，。、；;]/.test(next)) return false;
        // 其余（中文标题文字、字母等）视为纲目行首标记
        return true;
    }

    // dormantChapter：被句末句号清掉的“上一个章号”。只有遇到明确的经节标记时才复用它，
    // 这样“创一1。”之后另起一句仍不会把正文数字当成节号，但“（16）”“——16”“17节”能接上。
    // noteCtx：注文专用上下文 { bookId, chapter }——注 / 串正文所属的经文。
    // 注文里大量出现「六14～15」「三23」「四43」这类只写章节不写书卷的写法，
    // 默认就是指注文所在的书卷（见 fix 4.0.8）。
    findBibleReferences(text, lastBookId, lastChapter, lastStrongChapter, dormantChapter, noteCtx) {
        // 恢复本（及多数中文和合本）引用中的零常写作白色圆圈「○」(U+25CB)，如「诗一○二27」；
        // 而中文数字解析只认汉字〇(U+3007)与「零」。这里统一归一为〇——两者都是单码元、长度不变，
        // 后续高亮所用字符偏移不受影响。一处归一即可覆盖全部中文数字正则。
        text = text.replace(/○/g, '〇');
        text = normalizeFullWidthDigits(text);
        // 零宽空格 / 不换行空格 / 方向标记等一律当普通空白：等长替换，字符偏移不变
        text = text.replace(INVISIBLE_SPACES_RE, ' ');
        const matches = [];
        const coveredRanges = [];
        // 已确定的引用按位置组成“时间线”。弱引用（未写书卷、只写章节或节号）解析时，
        // 只沿用其**左侧最近**一处引用的书卷与结束章，避免被同一行/同一段后面才出现的书卷名带偏。
        const timeline = [];
        const baseChapter = lastStrongChapter != null ? lastStrongChapter : lastChapter;
        // 注文模式下的额外规则：弱引用默认归属注文所在的书卷与章；
        // 只有**同一句之内**（中间没有 。！？；或换行 隔断）已经出现过的引用才被沿用
        // ——否则「见弗二2注1」会被后面隔了好几句的「(三23)」继承，把加拉太书注文里的
        // 加三23 误判成弗三23。同类（言某事…(罗六5，十一17～24)）因同句不受影响，仍是罗十一。
        const noteBase = noteCtx
            ? { bookId: (noteCtx.bookId != null ? noteCtx.bookId : null), chapter: (noteCtx.chapter != null ? noteCtx.chapter : null) }
            : null;
        const sentenceBroken = (from, to) => /[。！？；\n]/.test(text.slice(from, to));
        // list：timeline（完整引用对象，含 allRefs）或阶段内的 trail（含 chapter）
        const pickCtx = (list, pos) => {
            let bookId = lastBookId != null ? lastBookId : null;
            let chapter = baseChapter != null ? baseChapter : null;
            if (noteBase) {
                if (noteBase.bookId != null) bookId = noteBase.bookId;
                if (noteBase.chapter != null) chapter = noteBase.chapter;
            }
            for (const m of list) {
                if (m.start >= pos) break;
                if (noteBase && sentenceBroken((m.end != null ? m.end : m.start), pos)) continue;
                if (m.bookId != null) bookId = m.bookId;
                const refs = m.allRefs;
                if (refs && refs.length > 0) {
                    const ec = this.refEndChapter(refs[refs.length - 1]);
                    if (ec != null) chapter = ec;
                } else if (m.chapter != null) {
                    chapter = m.chapter;
                }
            }
            return { bookId: bookId, chapter: chapter };
        };
        const resolveCtx = (pos) => pickCtx(timeline, pos);
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
                // 书卷名若只是前一个常用词的词尾（「使徒」「大约」「将来」…），不作书卷名，
                // 否则「使徒　三1～6」会被识别成徒 3:1-6，真正的出处「三1～6」反而被吞掉。
                // 多字别名（「约三」）也一起检查首字，避免「大约三1」走别名绕过守卫。
                if (this.isBookNameInProseWord(text, idx, name)) { idx += name.length; continue; }
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
        // 阶段2: 括号内弱引用（括号本身就是明确标记，可以直接复用休眠章上下文）
        const bracketMatches = this.findBracketRefs(text, coveredRanges, matches, resolveCtx, dormantChapter);
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
            const weakCont = this.findWeakContinuationRefs(text, coveredRanges, resolveCtx, dormantChapter, pickCtx);
            for (const m of weakCont) pushMatch(m);
        }
        // 阶段5: 行首/行内空白后的连写延续（如“　一2”），作为阶段6未覆盖的兜底（如行首起始处）
        if (hasCtx) {
            const contMatches = this.findInlineContinuationRefs(text, coveredRanges, resolveCtx);
            for (const m of contMatches) pushMatch(m);
        }
        // 阶段7: 动词引导的裸“N节”（如“从十二节…到十七节”）
        if (hasCtx) {
            const verbLead = this.findVerbLeadVerseRefs(text, coveredRanges, resolveCtx, dormantChapter);
            for (const m of verbLead) pushMatch(m);
        }
        // 阶段8（仅注文模式）: 「中文章 + 阿拉伯节」连写（如“这由六14～15得着证实”“见四43注2”）。
        // 这类写法前面是普通汉字，阶段6 的弱引用要求左侧是空白 / 标点才启动，因此抓不到；
        // 而它们恰恰是注文里最常见的省略写法。只在注文上下文中启用，正文笔记不受影响。
        if (noteCtx) {
            const cv = this.findNoteChapterVerseRefs(text, coveredRanges, resolveCtx);
            for (const m of cv) pushMatch(m);
        }
        matches.sort((a, b) => a.start - b.start);
        return this.finalizeRefMatches(matches, text);
    }

    // 收尾统一处理：①「参 / 见 / 参看」等引导词不是出处本身，不能包进可点击链接；
    // ② 多个阶段可能对同一处给出重叠候选（如「参看罗」+「罗三23」），取更完整的一条，
    //    否则主阅读渲染按顺序裁剪起点，会把链接切成「参看罗」+「三23」两段。
    // 只有这一行确实出现引导词时才处理，其余行原样返回，不影响既有识别结果。
    finalizeRefMatches(matches, text) {
        const GUIDE_RE = /^(参看|参见|参阅|参|见)/;
        let changed = false;
        const trimmed = [];
        for (const m of matches) {
            const seg = text.slice(m.start, m.end);
            const g = seg.match(GUIDE_RE);
            if (!g) { trimmed.push(m); continue; }
            changed = true;
            if (g[0].length >= seg.length) continue;   // 整条只有引导词，丢弃
            const ns = m.start + g[0].length;
            let ne = m.end;
            // 「参看三23」这类：弱引用只覆盖到「三」，节号紧随其后却没被纳入范围，
            // 把紧邻的数字补回来，避免裁完只剩一个字（allRefs 本就指向 3:23）。
            const rest = text.slice(ns, ne);
            const tail = text.slice(ne).match(/^\d{1,3}/);
            if (tail && /[\d一二三四五六七八九十百零〇]$/.test(rest)) ne += tail[0].length;
            trimmed.push(Object.assign({}, m, { start: ns, end: ne, text: text.slice(ns, ne) }));
        }
        if (!changed) return matches;
        const sorted = trimmed.slice().sort((a, b) =>
            (a.start - b.start) || ((b.end - b.start) - (a.end - a.start)));
        const picked = [];
        for (const m of sorted) {
            const prev = picked[picked.length - 1];
            if (prev && m.start < prev.end) {
                if ((m.end - m.start) > (prev.end - prev.start)) picked[picked.length - 1] = m;
                continue;
            }
            picked.push(m);
        }
        return picked;
    }

    // 注文专用：找出「中文 / 阿拉伯章号 + 阿拉伯节号」的省略写法。
    // 例：“这由六14～15得着证实” → 本章＝六章、节＝14～15；“见四43注2” → 四43。
    // 只认紧跟阿拉伯节号的写法（注文里几乎只有经文引用这么写），不触碰正文里的裸中文数字。
    findNoteChapterVerseRefs(text, coveredRanges, resolveCtx) {
        const matches = [];
        // 只匹配「中文数字章 + 阿拉伯数字节」：注文里几乎是经节专用的写法。
        // 纯阿拉伯连写（如“2026”“1500人”）风险太高，交给其它阶段处理，这里不碰。
        const re = /([一二三四五六七八九十百零〇]{1,4})[\s　]*(\d{1,3})(?:[\s　]*[～~\-－至–—‐][\s　]*(\d{1,3}))?([上中下])?/g;
        let m;
        while ((m = re.exec(text)) !== null) {
            const start = m.index;
            const end = m.index + m[0].length;
            // 前面紧挨着数字 / 中文数字时不从这里起跳，避免把「三十四15」切成「四15」；
            // 后面紧接中文数字也不算（说明还在一个数词里）
            const prev = start > 0 ? text[start - 1] : '';
            if (/[0-9]/.test(prev) || /[一二三四五六七八九十百零〇]/.test(prev)) { re.lastIndex = start + 1; continue; }
            const afterCh = text[end] || '';
            if (/[一二三四五六七八九十百零〇]/.test(afterCh)) { re.lastIndex = start + 1; continue; }
            if (this.isCovered(start, coveredRanges)) { re.lastIndex = end; continue; }
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) { re.lastIndex = start + 1; continue; }
            const chapter = parseNumber(m[1]);
            const verse = parseInt(m[2], 10);
            if (isNaN(chapter) || chapter < 1 || chapter > book.maxChapters) { re.lastIndex = start + 1; continue; }
            if (isNaN(verse) || verse < 1 || verse > 176) { re.lastIndex = start + 1; continue; }
            let verseEnd = null;
            if (m[3]) {
                const v2 = parseInt(m[3], 10);
                if (!isNaN(v2) && v2 > verse && v2 <= 176) verseEnd = v2;
            }
            matches.push({
                text: text.slice(start, end), start, end,
                bookId: book.id, bookName: book.fullName, bookShortName: book.shortName,
                allRefs: [{ chapter: chapter, verse: verse, verseEnd: verseEnd, suffix: m[4] || null, endChapter: null, endVerse: null }]
            });
            re.lastIndex = end;
        }
        return matches;
    }

    // 判断书卷名是否是「前一个常用词的词尾」而非独立书卷名。
    // ① 左邻字 + 书卷名首字构成常见双字词（「使徒」「大约」「将来」「东西」…）→ 是正文。
    //    对多字别名同样检查**首字**：别名按长度降序先匹配，「大约三1」里的「约三」
    //    （约翰三书）会被当成书卷名；只看单字守卫会漏掉这条路径。
    // ② 兜底：单字书卷名左邻是汉字、后面紧跟**全角空格**（中文纲目用它分隔标题与
    //    经文范围）时，多半也是前一个词的词尾（「基督徒　三1」）。合法引用
    //    「参看约 3:16」用的是半角空格，且左邻多为引导字，均不受影响。
    isBookNameInProseWord(text, idx, name) {
        if (idx <= 0) return false;
        const prev = text[idx - 1];
        if (!/[\u4e00-\u9fff]/.test(prev)) return false;
        const head = name[0];
        if (BOOK_NAME_PROSE_WORDS.has(prev + head)) {
            // 例外：左邻是「参看 / 参见 / 参阅」的末字时，整串是「引导词 + 书卷名」的合法引用
            // （「参看来三1」），不按「看来」这类词尾跳过；单字「参 / 见」不豁免，
            // 否则「参加三1」「比赛三1」「读书三1」会被误认成书卷名。
            if (!/(?:^|[\s　\p{P}\p{S}])参[看见阅]$/u.test(text.slice(0, idx))) return true;
        }
        if (name.length === 1) {
            const next = text[idx + 1] || '';
            if (next === '　' && !BOOK_REF_GUIDE_CHARS.has(prev)) return true;
        }
        return false;
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
                // 只有切过去后能解析出**节号**才认为是「基础书卷 + 章 + 节」的写法。
                // 若只解析出章号（如“新约二约组成”里的“约二”），那多半是普通语词，
                // 保持原书卷（约翰贰书）；而约翰贰书后面没有节号，整处自然不成引用。
                if (trial && trial.verse != null) {
                    book = base;
                    bookName = baseName;
                    pos = startPos + baseName.length;
                }
            }
        }
        while (pos < text.length && /\s/.test(text[pos])) pos++;
        const first = this.parseSingleRef(text, pos, book);
        if (!first) return null;
        // 常用汉字/动词黑名单：这些单字书卷名在日常文本里几乎只作普通字/动词出现（如「拿」=拿取），
        // 单字 + 整章（无节号、非跨章范围）时几乎必是正文而非引用（如「拿一」=拿一块），不作为经文出处；
        // 带节号（拿一1）仍正常识别。如需为其它字关闭单字弱匹配，往此集合加一字即可。
        if (BOOK_NAME_DENYLIST.has(book.shortName) && first.verse == null && first.endChapter == null) return null;
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
                const rangeEnd = this.parseRangeEnd(text, pos, book, refs[refs.length - 1].chapter, refs[refs.length - 1].verse == null);
                if (rangeEnd) {
                    const lastRef = refs[refs.length - 1];
                    if (rangeEnd.crossChapter) {
                        lastRef.endChapter = rangeEnd.chapter;
                        // endVerse 为空表示“到某章整章”（如“创一～二”“启二一～二二”）
                        lastRef.endVerse = rangeEnd.verse != null ? rangeEnd.verse : null;
                    } else {
                        lastRef.verseEnd = rangeEnd.verse;
                    }
                    pos = rangeEnd.endPos;
                    // 吞掉范围结束后的“节”字（如“一章二十五至二十八节”）
                    if (text[pos] === '节') pos++;
                    // 再吞掉范围结束后的上/中/下（如“弗一15～20上”“弗一16下～20节上”）
                    const endSfx = text.slice(pos).match(/^[上中下]/);
                    if (endSfx) pos += 1;
                    continue;
                }
            }
            // 检查并列分隔符（含省略号 …；不跨行）；记录分隔前位置，后续解析失败时回退，避免把标点包进高亮
            const sepStart = pos;
            const listSep = text.slice(pos).match(VERSE_LIST_SEP_RE);
            if (!listSep) { pos = beforeGuide; break; }
            const spaceSep = /^[ \t　]+$/.test(listSep[0]);
            pos += listSep[0].length;
            // 「1 第二代…」：空格后的序数词是正文，不是并列经节
            if (this.isProseContinuation(text, pos, spaceSep)) { pos = beforeGuide; break; }
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
        // 格式2.6: 跨越整章的区间（如“三～五十章”“一百二十至一百三十四篇”）。
        // 必须放在“连写”之前：否则“一百二十至一百三十四篇”会被连写拆成「一百二」章「十」节。
        const chRange = parseChapterRangeRef(text, pos, book);
        if (chRange) {
            return { chapter: chRange.chapter, verse: null, verseEnd: null, suffix: null, endChapter: chRange.endChapter, endVerse: null, endPos: chRange.endPos };
        }
        // 格式3: chapterverse 连写（智能区分章节）
        const m3 = parseConnectedChapterVerse(text, pos, book);
        if (m3) {
            // 连写也只解出章时同样要做右边界检查（模式4-pre 会给出「整体即章号」的结果），
            // 否则「新约二约组成」里的“二”会被当作约翰福音二章。
            if (m3.verse == null && !this.isChapterOnlyBoundary(text, pos + m3.consumed)) return null;
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
                // 只写章没写节时，章号后面必须是能断句的位置，否则多半是普通语词被当成了引用：
                // 「新约二约组成」的“约二”、“大约三万人”的“约三”都会命中这里，却不是经文出处。
                // 而真正说全章的写法（“创一～二”“创世记一章”“见创一。”）都能通过这道边界检查。
                if (this.isChapterOnlyBoundary(text, pos + m4[0].length)) {
                    return { chapter, verse: null, verseEnd: null, suffix: null, endChapter: null, endVerse: null, endPos: pos + m4[0].length };
                }
            }
        }
        return null;
    }

    // 整章引用（只写章号）的右边界：后面必须是「章 / 篇」标记、空白、范围符、标点或文末。
    // 紧跟普通汉字或数字说明这里还在一个词里（“约二约”“约三万人”），不当作经文出处。
    isChapterOnlyBoundary(text, pos) {
        if (pos >= text.length) return true;
        const ch = text[pos];
        if (/[\s　]/.test(ch)) return true;
        if (/[章篇]/.test(ch)) return true;
        if (/[～~\-－至–—‐]/.test(ch)) return true;
        if (/[，。、；：,;:！？!?（）〔〕()《》「」『』【】\[\]"“”'’…·]/.test(ch)) return true;
        // “诗一〇二所说”“弗三章说”等：后面紧跟引用引导词也算断句成功（允许一个“所 / 之”）
        const after = (/[所之]/.test(ch) ? text.slice(pos + 1) : text.slice(pos));
        return REFERENCE_GUIDE_WORDS.some(w => after.startsWith(w));
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

    // 空格也是并列分隔符（VERSE_LIST_SEP_RE），但中文正文里更常见的用法是
    // 「段落序号 + 空格 + 内容」，如「1 第二代没有…」「二 二人同行」。这类位置上的
    // 「第N」是序数词、裸中文数字会被连写解析成整章，都不该吞进当前引用串。
    // 只在「分隔符纯为空白」时由各并列循环调用，避免影响顿号/逗号/连词的合法并列：
    // 带「节」（第二节 / 16节说）、后接经文量词（章/篇）、数字、标点、范围、后缀或
    // 文末的，一律返回 false 照常解析。
    isProseContinuation(text, pos, spaceSep) {
        const m = text.slice(pos).match(/^(第\s*)?([一二三四五六七八九十百零〇]+|\d+)(节)?/);
        if (!m || m[3]) return false;
        const rest = text.slice(pos + m[0].length).replace(/^[ \t　]*/, '');
        const next = rest[0] || '';
        // 后接「章 / 篇」是「第三章三节」这类合法章节写法，让位给其它解析模式
        if (/[章篇]/.test(next)) return false;
        // 「第N」不带「节」＝序数词（第二代 / 第三代 / 第十），与 parseBareVerse 一致，
        // 无论前面是空白、顿号、逗号还是连词，都不能当并列经节。
        if (m[1]) return true;
        // 「裸数字 + 紧跟汉字」（二人 / 三代）只在分隔符纯为空白时拦，
        // 否则会误伤「16、17说」这类合法的并列经节后接行文。
        if (!spaceSep) return false;
        if (!next || !/[\p{L}]/u.test(next)) return false;
        if (/[章节篇上中下:：\d一二三四五六七八九十百零〇～~\-－至–—‐，、,;；]/u.test(next)) return false;
        return true;
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
            const mCn = text.slice(pos).match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+)[节]?/);
            // 并列项里的数字若紧跟页码 / 册数等量词（「一节和一九九页」），不是同章经节
            if ((mNum && this.isNonVerseCount(text, pos, pos + mNum[0].length)) ||
                (mCn && this.isNonVerseCount(text, pos, pos + mCn[0].length))) return null;
            if (mNum && !afterSeparator.test(text.slice(pos + mNum[0].length))) {
                const r = applyVerse(mNum[1], mNum[0].length);
                if (r) return r;
            }
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

    // prevChapterOnly：起点只写了章、没写节（如“创一～二”“启二一～二二”）
    parseRangeEnd(text, pos, book, currentChapter, prevChapterOnly) {
        // 跨整章的范围：起点是整章引用时，右侧数字应解释为**结束章**（连同整章），
        // 而不是同章内的结束节——否则“创一～二”只会显示创世记一章的头两节。
        if (prevChapterOnly) {
            const mc = text.slice(pos).match(/^([一二三四五六七八九十百零〇]+|\d+)[章篇]?/);
            if (mc) {
                const chapter = parseNumber(mc[1]);
                if (!isNaN(chapter) && chapter > currentChapter && chapter <= book.maxChapters) {
                    return { crossChapter: true, chapter, verse: null, endPos: pos + mc[0].length };
                }
            }
            // 不是合法的结束章（≤ 当前章，或超出本书卷）时不再回退成“节”，避免误判成“1:1-2”
            return null;
        }
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

    findBracketRefs(text, coveredRanges, strongMatches, resolveCtx, dormantChapter) {
        const matches = [];
        const candidates = [];
        const pattern = /[（〔(]([^）〕)]+)[）〕)]/g;
        let m;
        while ((m = pattern.exec(text)) !== null) {
            candidates.push({ start: m.index, end: m.index + m[0].length, content: m[1] });
        }
        // 新增成对括号 / 引号：严格配对扫描，内容须是纯节号形态，避免普通引文被误判
        for (const [open, close] of EXTRA_VERSE_BRACKETS) {
            const re = new RegExp(open + '([^' + close + ']+)' + close, 'g');
            let em;
            while ((em = re.exec(text)) !== null) {
                candidates.push({ start: em.index, end: em.index + em[0].length, content: em[1], extra: true });
            }
        }
        candidates.sort((a, b) => a.start - b.start);
        for (const cand of candidates) {
            const start = cand.start;
            const end = cand.end;
            if (cand.extra && !isPureVerseBracketContent(cand.content)) continue;
            if (this.isCovered(start, coveredRanges)) continue;
            // 括号内容若本身以书卷名开头（允许前面有“参/参看”），说明其中包含强引用，
            // 交给阶段1按书卷名解析；这里只处理依附上下文的弱引用括号
            if (this.bracketHasBookName(cand.content)) continue;
            // 跳过纲目序号括号（如“（一）”“（四）”）——裸中文数字视为结构标记，非经文出处
            const bareCn = cand.content.trim().replace(/^(?:参看|参考|参)/, '');
            if (/^[一二三四五六七八九十百零〇]+$/.test(bareCn)) continue;
            // 按本括号所在位置取上下文：优先沿用其左侧最近引用（含跨段落的书卷上下文）
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) continue;
            const initialChapter = c.chapter != null ? c.chapter : dormantChapter;
            const refContent = cand.content;
            // 括号弱引用不得越过括号中已有的强引用：
            // 「(二9，出十五23～25，歌二3…)」里后半串各自带书卷名，已由阶段1 解析成独立引用，
            // 若这里继续并到本条，会把出埃及记十五章说成创世记十五章。
            const list = this.parseWeakRefList(refContent, book, initialChapter, coveredRanges, start + 1);
            const refs = list.refs;
            if (refs && refs.length > 0) {
                const contentStart = start + 1;
                // 未被别的引用截断时保持原来的整括号高亮；截断后只高亮真正解析到的那一段
                const tail = refContent.slice(list.consumed);
                const full = (tail == null || tail.trim() === '');
                // 原有三种括号保持「整括号」高亮；新增的中文括号 / 引号本身不是出处，
                // 只高亮其中的内容（与弱引用阶段原有行为一致，引号不跟着变成链接）。
                const lead = list.firstStart || 0;
                let s0, e0;
                if (lead > 0) {
                    // 括号里前面还有未解析出的说明文字：只高亮真正解析到的经节段，
                    // 不把「见本书说明，」或整个括号包进链接（否则像误识别了书名）
                    s0 = contentStart + lead;
                    e0 = contentStart + list.consumed;
                } else if (full) {
                    s0 = cand.extra ? contentStart : start;
                    e0 = cand.extra ? contentStart + list.consumed : end;
                } else {
                    s0 = contentStart;
                    e0 = contentStart + list.consumed;
                }
                matches.push({
                    text: text.slice(s0, e0), start: s0, end: e0,
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

    // 解析括号内 / 逗号分隔的若干并处：逐段解析，遇到「已经属于另一处引用的段落」
    // （absOffset + coveredRanges）或「另一个书卷」就停止——括号里的串经常是
    // 「本卷简称用法 + 其它卷的完整引用」混排（如“(二9，出十五23～25，歌二3)”），
    // 不加这道闸门会把整个括号并成一条、全部挂到第一个书卷名下。
    // 返回 { refs, consumed }：consumed 是实际解析到的内容偏移（相对 content 起点）。
    parseWeakRefList(content, book, initialLastChapter, coveredRanges, absOffset) {
        content = normalizeFullWidthDigits(content);
        const refs = [];
        let lastChapter = initialLastChapter !== undefined ? initialLastChapter : null;
        let currentBook = book;
        let consumed = 0;
        // 第一个真正解析出经节的段在 content 中的起点。前面若有未解析的说明文字
        // （「（见本书说明，16节）」），高亮不能从括号内容开头算起。
        let firstStart = null;
        // 某段是正文序号时记下，避免末尾「整体解析」兜底又把它捡回来
        let sawProseSegment = false;
        const segRe = /[^，、,;]+/g;
        let sm;
        while ((sm = segRe.exec(content)) !== null) {
            const seg = sm[0];
            const segStart = sm.index;
            const trimmed = seg.trim();
            if (!trimmed) continue;
            const leadLen = seg.length - seg.trimStart().length;
            // 这一段落在已有引用的区间内 → 它是别的书卷 / 别处的独立引用，交还给那一条
            if (coveredRanges && absOffset != null && this.isCovered(absOffset + segStart + leadLen, coveredRanges)) break;
            const ref = this.parseWeakRef(trimmed, currentBook, lastChapter);
            if (ref) {
                // 括号内没走阶段3/6 的正文守卫：「（1 第二代…）」里的 1 是段落序号，
                // 裸数字后紧跟正文文字，不当经节。带「节」/ 范围 / 后缀的照常放行。
                if (this.looksLikeProseNumber(trimmed, 0, ref.consumed, !!ref.verseEnd, !!ref.suffix)) {
                    sawProseSegment = true;
                    continue;
                }
                // 段首写出了另一个书卷名（如“歌二3”）——本条挂的是当前书卷，不能吞进来
                if (ref.book && ref.book.id !== currentBook.id) {
                    if (refs.length === 0) currentBook = ref.book;
                    else break;
                }
                refs.push({ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix, endChapter: ref.endChapter || null, endVerse: ref.endVerse || null });
                if (firstStart == null) firstStart = segStart + leadLen;
                lastChapter = ref.chapter;
                consumed = segStart + leadLen + ref.consumed;
                if (ref.book) currentBook = ref.book;
            }
        }
        // 如果分割后没有结果，尝试整体解析（处理 "四34，十七4" 这种整体格式）
        if (refs.length === 0 && !sawProseSegment) {
            const ref = this.parseWeakRef(content, currentBook, lastChapter);
            if (ref) {
                refs.push({ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix, endChapter: ref.endChapter || null, endVerse: ref.endVerse || null });
                consumed = ref.consumed;
                firstStart = 0;
            }
        }
        return { refs: refs, consumed: consumed, firstStart: firstStart == null ? 0 : firstStart };
    }

    // 数字后紧跟「页 / 册 / 卷 / 版 / 年 / 人 …」等非经文量词时，它是页码、册数、
    // 版次或数量，不是经节号（「新约总论第五册，一九九页」≠ 启 14:199）。
    // 只作用于「纯数字（可带节）」形态，带章:节 / 上中下后缀的引用不受影响；
    // 括号内弱引用没走 looksLikeProseNumber，靠这道守卫兜住书目 / 页码信息。
    isNonVerseCount(text, start, end) {
        const raw = text.slice(start, end);
        if (!/^(?:第)?(?:[一二三四五六七八九十百零〇]+|\d+)节?$/.test(raw)) return false;
        const after = text.slice(end).replace(/^[ \t　]*/, '');
        return !!after && NON_VERSE_UNITS.has(after[0]);
    }

    // 裸节号（只写节号，章号沿用上下文）。支持中文与阿拉伯数字，也支持
    // 「17节」「18节上」「16下～20节上」「19～20节上」「20节下～22节中」这类
    // 恢复本纲目常见写法——旧实现会在后缀 / “节”字处截断，只剩 1:16、1:20 甚至
    // 退化成连写被切成 1:7。
    // 注意：数字后面若紧跟 章/篇/冒号 或另一个数字，说明它其实是章号或连写的
    // 前半截，必须让位给「X章Y节」/ 连写解析。
    parseBareVerse(text, pos, lastChapter, book) {
        if (lastChapter == null) return null;
        const remaining = text.slice(pos);
        const m = remaining.match(/^(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)节?/);
        if (!m) return null;
        // 「第N」不带「节」只是序数词（「第二个警告」「第一，」「第三，」），不是经节。
        // 合法的「第二节 / 第16节」带「节」字；「第三章 / 三章第三节」由模式B处理。
        // 不放行会把「第二」误判成当前章的第 2 节。
        if (/^第/.test(m[0]) && !/节$/.test(m[0])) return null;
        // 页码 / 册数 / 版次等数量信息不是经节（「一九九页」≠ 第199节）
        if (this.isNonVerseCount(text, pos, pos + m[0].length)) return null;
        const verse = parseNumber(m[1]);
        if (isNaN(verse) || verse < 1 || verse > 200) return null;
        const after = remaining.slice(m[0].length);
        // 「节」字已经出现时（如纲目结尾的「一 探远信徒—4节：」），后面的冒号只是句读标点，
        // 不应把这次引用挡掉。这条拒绝规则本是为「4:5」这类章:节写法准备的，那时「节」并未出现。
        if (!/节$/.test(m[0]) && /^[章篇:：\d一二三四五六七八九十百零〇]/.test(after)) return null;
        let p = pos + m[0].length;
        let suffix = null, verseEnd = null;
        // ① 先后缀后范围：「16下～20节上」「20节下～22节中」
        const sm = text.slice(p).match(/^([上中下])[\s　]*[～~\-－至–—‐][\s　]*([一二三四五六七八九十百零〇]+|\d+)节?([上中下])?/);
        if (sm) {
            const v2 = parseNumber(sm[2]);
            if (!isNaN(v2) && v2 > verse) { suffix = sm[1]; verseEnd = v2; p += sm[0].length; }
        }
        // ② 先范围（可带收尾的“节”与后缀）：「19～20节上」
        if (verseEnd == null) {
            const rg = text.slice(p).match(/^[\s　]*[～~\-－至–—‐][\s　]*([一二三四五六七八九十百零〇]+|\d+)节?([上中下])?/);
            if (rg) {
                const v2 = parseNumber(rg[1]);
                if (!isNaN(v2) && v2 > verse) { verseEnd = v2; p += rg[0].length; }
            }
        }
        // ③ 只剩后缀：「18节上」「十七节下」
        if (suffix == null) {
            const sfx = text.slice(p).match(/^([上中下])/);
            if (sfx) { suffix = sfx[1]; p += 1; }
        }
        if (p <= pos) return null;
        return { chapter: lastChapter, verse, verseEnd, suffix, endChapter: null, endVerse: null, book: book, consumed: p - pos };
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
        // 是否因“段首书卷名”切换了书卷。单字书卷名（拿/创/但/约/罗/书/民/诗…）大多也是常用汉字或动词，
        // 若其后是“继承章号 + 裸节号”（mode C），极易把正文误判为引用（如“拿一块”被认作拿鸿/约拿书 9:1）。
        // 多章书卷的合法弱引用都带显式章号（腓二5 / 罗九21 / 拿一1），不依赖继承章号；
        // 单章书卷（俄/犹）走 mode B3 处理。故切换至多章书卷时停用 mode C，避免误识别，其余路径不受影响。
        const switchedToMultiChapter = currentBook !== book && currentBook.maxChapters > 1;
        // 「章 X 节 Y」之后若紧跟范围分隔符 + 数字，补出结束节（如「罗马书八28-30」「约3:16-17」）
        const extendRange = (consumed, verse) => {
            let p = consumed;
            let verseEnd = null;
            const rg = text.slice(p).match(/^[\s　]*[～~\-－至–—‐][\s　]*(\d+)/);
            if (rg) {
                const v2 = parseNumber(rg[1]);
                if (!isNaN(v2) && v2 > verse) { verseEnd = v2; p += rg[0].length; }
            }
            return { verseEnd: verseEnd, consumed: p };
        };
        // 模式A: 章:节
        const m1 = remaining.match(/^([一二三四五六七八九十百零〇]+|\d+)[:：]\s*([一二三四五六七八九十百零〇]+|\d+)/);
        if (m1) {
            const chapter = parseNumber(m1[1]);
            const verse = parseNumber(m1[2]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= currentBook.maxChapters && !isNaN(verse) && verse >= 1) {
                const rg = extendRange(pos + m1[0].length, verse);
                return { chapter, verse, verseEnd: rg.verseEnd, suffix: null, book: currentBook, consumed: rg.consumed };
            }
        }
        // 模式B: 章节节（中文量词）
        const m2 = remaining.match(/^([一二三四五六七八九十百零〇]+|\d+)[章篇]\s*(?:第\s*)?([一二三四五六七八九十百零〇]+|\d+)[节]?/);
        if (m2) {
            const chapter = parseNumber(m2[1]);
            const verse = parseNumber(m2[2]);
            if (!isNaN(chapter) && chapter >= 1 && chapter <= currentBook.maxChapters && !isNaN(verse) && verse >= 1) {
                const rg = extendRange(pos + m2[0].length, verse);
                return { chapter, verse, verseEnd: rg.verseEnd, suffix: null, book: currentBook, consumed: rg.consumed };
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
        // 模式B4: 跨越整章的范围（如“三～五十章”“三章～五十章”“一至三篇”）。
        // 这里的两个数字都是**章号**，不是“同一章里的第 N 至第 M 节”，区别在于范围末尾有没有「章 / 篇」。
        // 例：创世记注文里的“三～五十章陈明八大人物的传记”＝创三章至创五十章。
        const chRange = parseChapterRangeRef(text, pos, currentBook);
        if (chRange) {
            return { chapter: chRange.chapter, verse: null, verseEnd: null, suffix: null, endChapter: chRange.endChapter, endVerse: null, book: currentBook, consumed: chRange.endPos };
        }
        // 模式C: 只有节号（优先当 lastChapter 已知）。
        // 切换至多章书卷时停用：避免“单字书卷名（动词/常用字）+ 继承章号 + 裸节号”误判（如 拿9:1）。
        if (lastChapter !== null && !switchedToMultiChapter) {
            const bare = this.parseBareVerse(text, pos, lastChapter, currentBook);
            if (bare) return bare;
        }
        // 模式D: 连写（使用智能解析）。remaining 已是切片，offset 传 0
        const m6 = parseConnectedChapterVerse(remaining, 0, currentBook);
        if (m6) {
            // 连写解析出的数字若紧跟量词（「二〇五页」被拆成 20:5），同样是页码不是经文
            if (this.isNonVerseCount(text, pos, pos + m6.consumed)) return null;
            let p = pos + m6.consumed;
            const rangeMatch = remaining.substring(m6.consumed).match(/^[至～~\-－–—‐]\s*([一二三四五六七八九十百零〇]+|\d+)/);
            let verseEnd = null;
            if (rangeMatch) {
                verseEnd = parseNumber(rangeMatch[1]);
                if (!isNaN(verseEnd) && verseEnd >= m6.verse) p += rangeMatch[0].length;
                else verseEnd = null;
            }
            const ref = { chapter: m6.chapter, verse: m6.verse, verseEnd, suffix: null, book: currentBook, consumed: p };
            // 切换至多章书卷后只得到「整章」引用（无节号、也非跨章范围），多半是正文里的单字书卷名
            // 被当成了书卷（如「约一」「诗一」「拿一」），不再作为经文出处；带节号（腓二5 / 拿一1）仍正常。
            if (switchedToMultiChapter && ref.verse == null && ref.endChapter == null) return null;
            return ref;
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
                let ref = this.parseWeakRef(trimmed.slice(p), book, c.chapter);
                // 行首的裸数字若后面紧跟文字（“第五日神说”），是正文不是经节
                if (ref && this.looksLikeProseNumber(trimmed, 0, ref.consumed, !!ref.verseEnd, !!ref.suffix)) ref = null;
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
                        const listSep = trimmed.slice(p).match(VERSE_LIST_SEP_RE);
                        if (!listSep) break;
                        const q = p + listSep[0].length;
                        // 「1 第二代…」：空格后的序数词是正文，不是并列经节
                        if (this.isProseContinuation(trimmed, q, /^[ \t　]+$/.test(listSep[0]))) break;
                        const next = this.parseContinuationItem(trimmed, q, effBook, refs[refs.length - 1].chapter);
                        if (!next || next.endPos <= q) break;
                        // 分隔符后面是另一处已解析的引用（多半带自己的书卷名）时不再吞进来，
                        // 否则会把“，出十五23～25”并到前一个书卷名下
                        if (coveredRanges.some(([s]) => s >= lineStart + q && s < lineStart + next.endPos)) break;
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
        // 中间的 (?:…)? 支持同章节范围写法「X章Y至Z节」（如「五章二十至二十一节」= 5:20-21）
        const pattern = /([一二三四五六七八九十百零〇\d]+)章(?:第)?([一二三四五六七八九十百零〇\d]+)(?:[～~\-－至–—‐]\s*(?:第)?([一二三四五六七八九十百零〇\d]+))?节/g;
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
            // 同章内的节范围（m[3] 存在即「Y至Z」写法）
            let verseEnd = null;
            if (m[3] != null) {
                const v2 = parseNumber(m[3]);
                if (!isNaN(v2) && v2 > verse) verseEnd = v2;
            }
            let p = start + m[0].length;
            const refs = [{ chapter, verse, verseEnd, suffix: null }];
            // 向后扩展 “、X章Y节” 或 “、X节”（同章延续）
            while (true) {
                // 标点分隔符保留原有的可跨行空白语义；中文并列连词不跨行
                const sep = text.slice(p).match(VERSE_LIST_SEP_RE) || text.slice(p).match(/^[，、,;；]\s*/);
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
        // 前面必须是行首、空白或任意标点 / 符号（同阶段6，不再逐个枚举分隔符）；
        // 中文数字章 + 阿拉伯节；后面不跟数字（避免吃掉更长连写）
        const re = /(^|[\s　\p{P}\p{S}])([一二三四五六七八九十百零〇]+)(\d+)(?![\d一二三四五六七八九十百零〇])/gu;
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
    findWeakContinuationRefs(text, coveredRanges, resolveCtx, dormantChapter, pickCtx) {
        const matches = [];
        // 边界字符：任意空白、任意 Unicode 标点（\p{P}：中英文句读、括号、引号、破折号、斜杠、连接符等）
        // 与任意 Unicode 符号（\p{S}：─━⌈⌊等制图符、箭头、货币符等）。不再逐个枚举，换任何一种标点
        // 都能触发弱引用识别（如「─五11」「，五11」「。五11」「/五11」「<五11」「【五11】」「⌈五11⌋」）
        const re = /(^|[\s　\p{P}\p{S}])(?![\s　])/gu;
        let runningChapter = null;
        // 本阶段内已解析出的引用（位置升序）。它们也要参与后续候选的上下文：
        // 共享时间线要等本阶段结束才统一并入，若不单独记录，同一趟扫描里先解析出的
        // 章/卷会被后面候选用旧时间线覆盖掉（如纲目「四4～6」之后的「4节」退回上一章）。
        const trail = [];
        const trailCtx = (pos) => {
            // 注文模式下沿用与各阶段一致的上下文规则（同句之内才继承，否则回到注文所属书卷 / 章）
            if (pickCtx) return pickCtx(trail, pos);
            let bookId = null, chapter = null;
            for (const e of trail) {
                if (e.start >= pos) break;
                if (e.bookId != null) bookId = e.bookId;
                if (e.chapter != null) chapter = e.chapter;
            }
            return { bookId: bookId, chapter: chapter };
        };
        let m;
        while ((m = re.exec(text)) !== null) {
            let start = m.index + m[1].length;
            // 跳过引导分隔符后连续的破折号（如“——五11”里的第二个破折号），从真正内容位置开始解析，
            // 否则第二个破折号会被当成内容开头，导致弱引用解析失败、范围被丢弃
            while (start < text.length && /[–—‐\-－]/.test(text[start])) start++;
            if (this.isCovered(start, coveredRanges)) { re.lastIndex = start + 1; continue; }
            // 按本处所在位置取上下文：书卷沿用左侧最近引用（可跨行、跨段落），章号沿用其结束章。
            // 本阶段左侧已解析出的结果更新，优先于共享时间线。
            const c = resolveCtx(start);
            const tc = trailCtx(start);
            const ctxBookId = tc.bookId != null ? tc.bookId : c.bookId;
            const ctxChapter = tc.chapter != null ? tc.chapter : c.chapter;
            const book = ctxBookId != null ? BOOK_ID_MAP[ctxBookId] : null;
            if (!book) { re.lastIndex = start + 1; continue; }
            if (ctxChapter != null) runningChapter = ctxChapter;
            // 章上下文被句号清掉时，只有「明确的经节标记」才允许复用前文最后提到的章：
            // ① 自身带 节 / 上中下 / 范围（如“—17节”“—16下～20节上”）
            // ② 被括号 / 引号 / 破折号包裹（如“——16”“【16】”“「16」”）
            // 空格后的裸数字（如“　3”）不算明确标记，仍按旧规则不沿用，避免正文数字被误认
            if (runningChapter == null && dormantChapter != null) {
                const probe = this.parseWeakRef(text.slice(start), book, dormantChapter);
                if (probe && probe.consumed > 0) {
                    const slice = text.slice(start, start + probe.consumed);
                    if (/[节上中下～~\-－至–—‐]/.test(slice) || this.isWrappedByPunct(text, start, start + probe.consumed)) {
                        runningChapter = dormantChapter;
                    }
                }
            }
            const ref = this.parseWeakRef(text.slice(start), book, runningChapter);
            if (!ref || ref.consumed <= 0) { re.lastIndex = start + 1; continue; }
            // 弱引用内部可能显式切换了书卷（如“　俄3”依附约叁上下文），归属应以切换后的书卷为准
            const effBook = ref.book || book;
            let end = start + ref.consumed;
            let refs = [{ chapter: ref.chapter, verse: ref.verse, verseEnd: ref.verseEnd, suffix: ref.suffix, endChapter: ref.endChapter || null, endVerse: ref.endVerse || null }];
            // 向后吞并列延续项（如“　一2，一3，二4”“　一1，二3～5”），让同行弱引用一次成串高亮
            while (true) {
                const listSep = text.slice(end).match(VERSE_LIST_SEP_RE);
                if (!listSep) break;
                const q = end + listSep[0].length;
                // 「1 第二代…」：空格后的序数词是正文，不是并列经节
                if (this.isProseContinuation(text, q, /^[ \t　]+$/.test(listSep[0]))) break;
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
            // 括号 / 引号包裹的裸中文数字不作经文出处：
            // 纲目标记“（一）”“（四）”、行文中被引号引起来的“一”“三一”等，都是普通文字。
            const isBareCn = /^[一二三四五六七八九十百零〇]+$/.test(matchedSlice);
            const prevCh = start > 0 ? text[start - 1] : '';
            const closeM = text.slice(end).match(/^[\s　]*(.)/);
            const closeCh = closeM ? closeM[1] : '';
            const OPEN_CH = '（〔(【「『“‘"\'';
            const CLOSE_CH = '）〕)】」』”’"\'';
            if (isBareCn && OPEN_CH.indexOf(prevCh) !== -1 && CLOSE_CH.indexOf(closeCh) !== -1) { re.lastIndex = start + 1; continue; }
            // 纲目行首序号（如“一、基督在复活里…”“二、三一神…”“十一、倪的行事为人”）：
            // 若本次解析出的只是一个**裸中文数字**（没有节号 / 范围 / 上中下后缀），
            // 且紧跟着顿号，那它是纲目编号而不是经文出处，跳过以免误高亮。
            // 只认顿号、不认逗号：逗号是合法的并列延续分隔符（如“一2，一3，二4”）。
            const initSlice = text.slice(start, start + ref.consumed);
            if (/^[一二三四五六七八九十百零〇]+$/.test(initSlice) &&
                (text[start + ref.consumed] || '') === '、') { re.lastIndex = start + 1; continue; }
            // 裸数字最容易误伤（纲目标记“一”、正文“第五日”“31 岁”）：后面紧跟文字就不算经节。
            // 反过来，被 【】「」『』（）—— 之类符号包裹的节号后面是标点，能正常被认出来。
            if (this.looksLikeProseNumber(text, start, end, !!ref.verseEnd, !!ref.suffix)) { re.lastIndex = start + 1; continue; }
            matches.push({
                text: text.slice(start, end), start, end,
                bookId: effBook.id, bookName: effBook.fullName, bookShortName: effBook.shortName,
                allRefs: refs
            });
            const refEndCh = this.refEndChapter(refs[refs.length - 1]);
            if (refEndCh != null) runningChapter = refEndCh;
            trail.push({ start: start, end: end, bookId: effBook.id, chapter: refEndCh });
            re.lastIndex = end;
        }
        return matches;
    }

    // [start, end) 是否被成对的括号 / 引号包裹（如【16】「16」『16』（16））
    // 或前面带破折号（如“——16”）。这类位置上的数字几乎不可能是正文，可以放心当经节。
    isWrappedByPunct(text, start, end) {
        const prev = start > 0 ? text[start - 1] : '';
        const next = text[end] || '';
        if (!prev) return false;
        if (/[（〔(【「『“‘]/.test(prev) && /[）〕)】」』”’]/.test(next)) return true;
        if (/[–—‐\-－]/.test(prev)) return true;
        return false;
    }

    // 裸数字（中文 / 阿拉伯）若既没带范围也没带上中下后缀，后面又紧接文字，
    // 说明它只是正文里的一部分（“第五日”“31 岁”“1.标题”），不作经文出处。
    looksLikeProseNumber(text, start, end, hasRange, hasSuffix) {
        if (hasRange || hasSuffix) return false;
        const rawSlice = text.slice(start, end);
        // 明确写了「节」的是经文标记（如「九节接着说」「五20节」），节号后面紧跟汉字也属于正常行文，
        // 不作正文处理。真正需要拦的是没有「节」字的「第五日神说」「31 岁」这类。
        if (/节/.test(rawSlice)) return false;
        const slice = rawSlice.replace(/^第/, '').replace(/节$/, '');
        const pureNum = /^[一二三四五六七八九十百零〇]+$/.test(slice) || /^\d+$/.test(slice);
        if (!pureNum) return false;
        const afterSlice = text.slice(end);
        // 只跳过空格/制表符，换行保留下来作为“行尾边界”判断依据
        const skipSpace = afterSlice.match(/^[ \t　]*/);
        const nextChar = afterSlice.slice(skipSpace ? skipSpace[0].length : 0)[0];
        if (!nextChar) return false;
        // 紧跟汉字 / 字母 / 数字 → 正文。紧跟英文句点 → 列表编号（“1.神爱世人”）
        if (/[\p{L}\p{N}]/u.test(nextChar) || nextChar === '.') return true;
        // 「1、」「12、」等中文列表编号：纯数字后紧跟顿号，是段落序号不是经节。
        // 合法的并列经节（「一2、一3」「16、17」）会被整串吞并，rawSlice 不是纯数字，不受影响。
        if (nextChar === '、') return true;
        // 「1)」「1）」等编号：仅当前面有配对开括号（「（16）」「【16】」这类明确经节标记）
        // 时才放行，否则视为列表编号。
        if (/[）)\]〕】」』]/.test(nextChar)) {
            const prevChar = start > 0 ? text[start - 1] : '';
            if (!/[（(\[〔【「『]/.test(prevChar)) return true;
        }
        return false;
    }

    // 阶段7：动词引导的裸“N节”（如“看以西结二十八章，从十二节末句读起，到十七节”）。
    // 这类节号前面是汉字（“从”“到”），不属于任何边界字符，前面六个阶段都抓不到；
    // 动词本身不进入高亮，只把“十二节”“十七节”标成经文。
    findVerbLeadVerseRefs(text, coveredRanges, resolveCtx, dormantChapter) {
        const matches = [];
        const re = /(从|到|由)([一二三四五六七八九十百零〇]+|\d+)\s*节/g;
        let m;
        while ((m = re.exec(text)) !== null) {
            const start = m.index + m[1].length;
            const end = m.index + m[0].length;
            if (this.isCovered(start, coveredRanges)) { re.lastIndex = end; continue; }
            const c = resolveCtx(start);
            const book = c.bookId != null ? BOOK_ID_MAP[c.bookId] : null;
            if (!book) { re.lastIndex = end; continue; }
            let chapter = c.chapter != null ? c.chapter : dormantChapter;
            if (chapter == null) { re.lastIndex = end; continue; }
            const verse = parseNumber(m[2]);
            if (!(verse >= 1 && verse <= 200)) { re.lastIndex = end; continue; }
            matches.push({
                text: text.slice(start, end), start, end,
                bookId: book.id, bookName: book.fullName, bookShortName: book.shortName,
                allRefs: [{ chapter, verse, verseEnd: null, suffix: null, endChapter: null, endVerse: null }]
            });
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

    // opts.host 存在时：本次构建的是宿主弹窗里的「新一层」——注解里点出处时原地展开，
    // 不再关掉旧弹窗另开一个（旧做法会把新弹窗定位到已移除的锚点上，于是出现在左上角）
    showVerseTooltip(targetEl, match, opts) {
        // 兜底：任何导致索引缺失的路径（数据刚下载完、版本切换等）在此补建
        this.ensureVerseIndex();
        const host = (opts && opts.host) || null;
        const depth = (opts && opts.depth) || 0;
        let shell = host;
        if (!host) {
            // 同一时间只显示一个弹窗
            document.querySelectorAll('.bible-inline-tooltip').forEach(el => el.remove());
            // 宿主外壳：容纳多层经文视图，位置固定不动，层切换只换内容
            shell = document.createElement('div');
            shell.className = 'bible-inline-tooltip bible-inline-tooltip-host';
            shell._navStack = [];
            shell._levels = [];
            shell._anchor = targetEl;
            document.body.appendChild(shell);
            // 按住标题行可以把这个弹窗拖到别处（层切换 / 重建内容时外壳不变，不会失效）
            this.enableTooltipDrag(shell);
            // 记住「用同一锚点重开弹窗」的入口：切换注解时正文要重新渲染，且保持当前所在的层级
            this._tooltipRefresh = async () => { await this.rebuildTooltipStack(shell); };
        }
        const tooltip = document.createElement('div');
        tooltip.className = 'bible-inline-tooltip bible-inline-tooltip-level';
        // 本弹窗的「引用键」：同一处经文引用共用一组候选（关闭再打开仍保留），
        // 不同引用各自独立统计，勾选顺序互不影响
        const sessionKey = this.tooltipRefKey(match);
        this.openTooltipPool(sessionKey);
        // 收集弹窗中要显示的经文（每处一节，便于单独勾选与跳转）
        const refs = match.allRefs || [{ chapter: match.chapter, verse: match.verse, verseEnd: match.verseEnd, suffix: match.suffix, endChapter: match.endChapter, endVerse: match.endVerse }];
        const verses = [];
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
                        for (const item of (this.verseIndex.get(key) || [])) {
                            verses.push({ chapter: ch, verse: v, item: item });
                        }
                    }
                }
            } else if (endChapter) {
                // 跨整章的范围且没有结束节（如“创一～二”“启二一～二二”）→ 列出区间内每整章的经文
                for (let ch = chapter; ch <= endChapter; ch++) {
                    const total = this.getChapterVerseCount(match.bookId, ch);
                    for (let v = 1; v <= total; v++) {
                        const key = `${match.bookId}-${ch}-${v}`;
                        for (const item of (this.verseIndex.get(key) || [])) {
                            verses.push({ chapter: ch, verse: v, item: item });
                        }
                    }
                }
            } else if (verse && verseEnd && verseEnd >= verse) {
                for (let v = verse; v <= verseEnd; v++) {
                    const key = `${match.bookId}-${chapter}-${v}`;
                    for (const item of (this.verseIndex.get(key) || [])) {
                        verses.push({ chapter: chapter, verse: v, item: item });
                    }
                }
            } else if (verse) {
                const key = `${match.bookId}-${chapter}-${verse}`;
                for (const item of (this.verseIndex.get(key) || [])) {
                    verses.push({ chapter: chapter, verse: verse, item: item });
                }
            } else {
                // 只写了章没写节（如“以西结二十八章”“创世记一章”）→ 展开整章，不再只显示前三节
                const total = this.getChapterVerseCount(match.bookId, chapter);
                for (let v = 1; v <= total; v++) {
                    const key = `${match.bookId}-${chapter}-${v}`;
                    for (const item of (this.verseIndex.get(key) || [])) {
                        verses.push({ chapter: chapter, verse: v, item: item });
                    }
                }
            }
        }

        // 顶部经文出处（双击跳转到圣经阅读视图）
        let refText = match.bookShortName;
        const first = refs[0];
        refText += first.chapter;
        // 上/中/下 紧跟在起始节后面更直观：“弗1:16下-20”而不是“弗1:16-20下”
        if (first.verse) refText += `:${first.verse}${first.suffix || ''}`;
        if (first.verseEnd) refText += `-${first.verseEnd}`;
        if (first.endChapter && first.endVerse) refText += `～${first.endChapter}:${first.endVerse}`;
        else if (first.endChapter) refText += `～${first.endChapter}`;   // 到某章整章：“创一～二”
        if (refs.length > 1) refText += ` 等${refs.length}处`;

        // 标题行：经文出处（双击跳转）+ 保留候选 + 候选计数 + 清空
        const headerRow = tooltip.createDiv({ cls: 'bible-inline-tooltip-header' });
        // 返回上一层：只有从注解 / 串珠里的出处继续点开而产生的更深层级才出现
        const backBtn = headerRow.createEl('button', { cls: 'bible-inline-tooltip-btn bible-inline-tooltip-back', text: '‹ 返回' });
        backBtn.title = '返回上一层（也可点击弹窗空白处返回）';
        backBtn.style.display = depth > 0 ? 'inline-block' : 'none';
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.tooltipPopLevel(shell);
        });
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
        // 抓取用户当前高亮的文字（如注解/串珠正文），点击复制时优先采用
        let _tooltipCopyText = '';
        copyBtn.addEventListener('mousedown', () => {
            try { const s = window.getSelection(); _tooltipCopyText = s ? s.toString() : ''; } catch (_) { _tooltipCopyText = ''; }
        });
        const projBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn bible-inline-tooltip-proj', text: '投影' });
        projBtn.title = '投影选中的内容（逐节 / 并列 / 混合）';
        // 「注解」开关：显示 / 隐藏恢复本注解与串珠上标
        const notesBtn = toolbar.createEl('button', { cls: 'bible-inline-tooltip-btn bible-inline-tooltip-notes-toggle', text: '注解' });
        notesBtn.title = '显示 / 隐藏恢复本注解与串珠';
        const syncNotesBtn = () => {
            const on = !!this.settings.showNotes;
            notesBtn.classList.toggle('active', on);
            notesBtn.setText(on ? '✓ 注解' : '注解');
            return on;
        };
        // 登记给快捷键入口用：用快捷键切换时也能把该按钮翻过来
        this._syncNotesToolbar = syncNotesBtn;
        syncNotesBtn();
        notesBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const willShow = !this.settings.showNotes;
            if (willShow && !this.notesData) notesBtn.setText('注解…');
            // 切换后 refreshNotesViews 会重建弹窗（正文重新带上 / 去掉上标），不必在这里重复渲染
            await this.setShowNotes(willShow);
            if (notesBtn.isConnected) syncNotesBtn();
        });

        const contentEl = tooltip.createDiv({ cls: 'bible-inline-tooltip-content' });
        // 更深的层级：点击本层任意「空白处」（标题栏 / 工具条 / 内容区的非交互区域）
        // 即退回上一层。有文字选区时不触发，避免「选中注文再复制」被误判成返回
        if (depth > 0) {
            tooltip.addEventListener('click', (e) => {
                // 刚刚拖过弹窗：这一次 click 是拖动收尾，不当作「点击空白处返回上一层」
                if (shell._dragJustMoved) { shell._dragJustMoved = false; return; }
                const t = e.target;
                if (!t || !t.closest) return;
                if (t.closest('button') || t.closest('input') || t.closest('label') || t.closest('a')) return;
                if (t.closest('.bible-inline-tooltip-verse')) return;
                if (t.closest('.bible-note-panel')) return;
                if (t.closest('.bible-inline-ref')) return;
                if (t.closest('.bible-note-mark')) return;
                try {
                    const sel = window.getSelection();
                    if (sel && !sel.isCollapsed && String(sel.toString() || '').trim()) return;
                } catch (_) { /* 取不到选区就按没有选区处理 */ }
                this.tooltipPopLevel(shell);
            });
        }

        // 记住弹窗字体大小
        const applyFontSize = (size) => {
            const s = Math.min(32, Math.max(10, size));
            if (this.settings.tooltipFontSize !== s) {
                this.settings.tooltipFontSize = s;
                this.saveSettings();
            }
            fontLabel.setText(s + 'px');
            contentEl.style.fontSize = s + 'px';
            // 字体变化后尽量保持弹窗在可视区域内（多层时位置由外壳承担）
            if (shell && shell.parentElement) {
                const r = shell.getBoundingClientRect();
                if (r.bottom > window.innerHeight - 10) {
                    shell.style.top = Math.max(10, window.innerHeight - r.height - 10) + 'px';
                }
                if (r.top < 10) shell.style.top = '10px';
            }
        };
        applyFontSize(this.settings.tooltipFontSize || 14);
        fontMinusBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); applyFontSize((this.settings.tooltipFontSize || 14) - 1); });
        fontPlusBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); applyFontSize((this.settings.tooltipFontSize || 14) + 1); });

        // 每处经文：候选框 + 出处（双击跳转）+ 内容
        const rows = [];
        // 注解 / 串珠的候选框上下文：与弹窗里的经文共用同一套序号 / 复制 / 投影
        const noteCtx = {
            sessionKey: sessionKey,
            getView: () => view,
            refresh: () => { refreshOrders(); refreshTooltipNotePanels(); }
        };
        if (verses.length === 0) {
            contentEl.createDiv({ cls: 'bible-inline-tooltip-verse', text: '未找到经文' });
        }
        // 超大范围（如“创三～五十章”＝48 整章上千节）一次性铺开会把界面拖住，
        // 这里限制渲染行数，余下的给出提示，需要通读时可双击标题直接跳到阅读视图。
        const MAX_TOOLTIP_ROWS = 400;
        const renderVerses = verses.length > MAX_TOOLTIP_ROWS ? verses.slice(0, MAX_TOOLTIP_ROWS) : verses;
        // 注解 / 串珠面板：每一节经文都自带一个隐藏的面板容器，紧跟在该节经文之后，
        // 这样点哪一节的 ¹ / ᵃ 上标，注解就展开在那一节下方（而不是统一堆到弹窗末尾）。
        // 同时只允许展开一个：点开新的一处会先收起旧的，避免多处同时展开堆叠
        let openedNotePanel = null;
        const closeOpenedNotePanel = () => {
            if (openedNotePanel) {
                openedNotePanel.style.display = 'none';
                openedNotePanel.removeAttribute('data-note-key');
                openedNotePanel = null;
            }
        };
        for (const v of renderVerses) {
            const row = contentEl.createDiv({ cls: 'bible-inline-tooltip-verse' });
            // 本节的注解 / 串珠面板容器：位置紧跟本节经文，默认隐藏（隐藏时不占位）
            const verseNotePanel = contentEl.createDiv({ cls: 'bible-note-panel' });
            verseNotePanel.style.display = 'none';
            // 候选框：与圣经搜索 / 圣经阅读一致——未选中是空框，选中后直接显示选中顺序数字
            const box = row.createDiv({ cls: 'bible-inline-tooltip-checkbox' });
            box.title = '点击选中 / 取消此节经文';
            const numEl = row.createEl('span', {
                cls: 'bible-inline-tooltip-verse-num',
                text: v.chapter + ':' + v.verse + (v.item.part || '')
            });
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
            const textEl = row.createEl('span', { cls: 'bible-inline-tooltip-verse-text' });
            // 恢复本注解 / 串珠：经文内嵌 ¹ ᵃ 上标，点击展开对应注解或串珠
            const nd = this.getVerseNotes(match.bookId, v.chapter, v.verse, v.item.part);
            // 经文里已内嵌 ¹ ᵃ 注 / 串上标（每条注 / 串都能点到），不再额外给「注N·串N」按钮
            if (nd && nd.m && nd.m.length) {
                this.renderTextWithMarkers(textEl, v.item.content, nd.m, (kind, label) => {
                    // key 带上章/节/上(下)半节，避免不同经的「注1」「串1」被误判为同一面板
                    const key = v.chapter + ':' + v.verse + (v.item.part || '') + ':' + kind + ':' + label;
                    if (verseNotePanel.style.display === 'block' && verseNotePanel.getAttribute('data-note-key') === key) {
                        // 收起注解/串珠面板时同步取消该条的选中：点击标记收起即视为「取消」该注解，
                        // 否则面板收起后序号看不见、但「保留候选」计数仍把它算进去，造成不一致
                        const wantKey = (kind === 'n' ? 'note' : 'chain') + ':' + v.item.bookId + ':' +
                            v.chapter + ':' + v.verse + ':' + (v.item.part || '') + ':' + label;
                        const selItem = this.getTooltipPool().map(p => p.item).find(it => it && it.noteKey === wantKey)
                            || (view ? view.candidatePool.map(p => p.item).find(it => it && it.noteKey === wantKey) : null);
                        if (selItem) {
                            this.tooltipPoolRemove(selItem);
                            if (view) view.poolSyncDeselect(selItem, false);
                        }
                        verseNotePanel.style.display = 'none';
                        verseNotePanel.removeAttribute('data-note-key');
                        openedNotePanel = null;
                        if (view) view.updateKeepCandidatesUI();
                        if (noteCtx && noteCtx.refresh) noteCtx.refresh();
                        return;
                    }
                    // 展开新的一处前先收起当前已展开的那处（可能是同一节的另一条，也可能是别的节的）
                    closeOpenedNotePanel();
                    verseNotePanel._noteCtx = { nd: nd, v: v, kind: kind, label: label };
                    this.fillTooltipNotePanel(verseNotePanel, nd, v, kind, label, noteCtx);
                    verseNotePanel.setAttribute('data-note-key', key);
                    verseNotePanel.style.display = 'block';
                    openedNotePanel = verseNotePanel;
                });
            } else {
                textEl.setText(v.item.content);
            }
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
        if (verses.length > MAX_TOOLTIP_ROWS) {
            const moreEl = contentEl.createDiv({ cls: 'bible-inline-tooltip-more' });
            moreEl.setText(`…以下另有 ${verses.length - MAX_TOOLTIP_ROWS} 节未列出（共 ${verses.length} 节）。范围较长，建议双击上方经文出处跳转到圣经阅读视图查看。`);
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
            refreshTooltipNotePanels();        // 经文勾选变化时同步刷新注解/串珠候选框的选中序号
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
            refreshTooltipNotePanels();        // 并列状态变化也同步刷新注解/串珠候选框
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

        // 刷新弹窗中展开的注解 / 串珠面板（选中序号变化时同步候选框显示）
        const refreshTooltipNotePanels = () => {
            const panels = tooltip.querySelectorAll('.bible-note-panel');
            for (const p of panels) {
                const c = p._noteCtx;
                if (!c) continue;
                if (p.style.display === 'none') continue;
                this.fillTooltipNotePanel(p, c.nd, c.v, c.kind, c.label, noteCtx);
            }
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
            // 「取消」要同时清掉本弹窗里选中的注解 / 串珠——它们与经文共用同一候选库，
            // 否则点「取消」后经文被取消、注/串却仍残留勾选与序号
            if (!next) {
                for (const p of this.getTooltipPool().slice()) {
                    if (p.item && (p.item.type === 'note' || p.item.type === 'chain')) {
                        this.tooltipPoolRemove(p.item);
                        if (view) view.poolSyncDeselect(p.item, false);
                    }
                }
                if (view) view.updateKeepCandidatesUI();
            }
            // 上面清掉注/串后必须重算标题栏计数：setRowChecked 内部的 refreshOrders 跑在清注/串之前，
            // 若不清掉这步，「保留候选 (1)」会残留在已取消的状态上（重新打开弹窗才复位），因此需补一次
            refreshOrders();
            refreshTooltipNotePanels();
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
            refreshTooltipNotePanels();                 // 同步刷新展开中的注解 / 串珠候选框，清掉残留的选中序号
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
            .map(p => {
                const it = p.item;
                if (it.type === 'note' || it.type === 'chain') return (it.ref || '') + '\n' + it.content;
                return `${p.bookShortName || match.bookShortName}${p.chapter}:${p.verse} ${it.content}`;
            }).join('\n');
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
            const hl = (_tooltipCopyText || '').trim();
            _tooltipCopyText = '';
            if (hl) { doCopyText(hl, 1); return; }
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

        // 本层的「投影快捷键」入口：全局 Q/W/E 监听只调用当前激活层的这一个
        const projector = (mode) => {
            const list = keepOn() ? buildGlobalList() : ownList();
            if (list.length === 0) { new Notice('请先勾选要投影的经文'); return; }
            this.projectTooltipSelection(view || this.getSearchView(), list, mode);
        };
        const level = {
            el: tooltip,
            match: match,
            sessionKey: sessionKey,
            refKey: sessionKey,
            // 这一层是由哪个元素点开的：用于「再点同一处出处就关闭弹窗」的判定。
            // 嵌套层的锚点是外壳锚点，所以由调用方通过 opts.sourceEl 指定真实来源元素
            sourceEl: (opts && opts.sourceEl) || targetEl,
            projector: projector,
            syncNotes: syncNotesBtn,
            depth: depth
        };
        shell.appendChild(tooltip);
        if (!host) {
            // 首层：定位外壳（之后切换层不再移动弹窗，避免内容跳动）
            const rect = targetEl.getBoundingClientRect();
            const shellRect = shell.getBoundingClientRect();
            let left = rect.left;
            let top = rect.bottom + 8;
            if (left + shellRect.width > window.innerWidth - 20) left = window.innerWidth - shellRect.width - 20;
            if (left < 10) left = 10;
            if (top + shellRect.height > window.innerHeight - 20) top = rect.top - shellRect.height - 8;
            shell.style.left = left + 'px';
            shell.style.top = top + 'px';
            shell._navStack = [level];
            shell._levels = [match];
            this.tooltipActivateLevel(shell, level);
            this.clampTooltipIntoView(shell);
        }
        // 移动端适配：不再依赖悬停关闭，改为“点击弹窗以外区域”关闭
        // （由 onload 中注册的 document 级 click 处理器统一处理）
        return level;
    }

    // ==================== 经文弹窗：层栈导航（注解里点出处，原地展开而不是另开浮层）====================
    // 弹窗外壳 .bible-inline-tooltip-host 里按顺序叠放若干「层」，每层是一份完整的经文视图
    // （标题行 + 工具条 + 内容）。_navStack 记录已打开的层，只有最后一层可见。

    // 点击弹窗以外的任何区域即关闭弹窗。
    // 注册在捕获阶段（见 onload），因此注解 / 串珠面板内部的 stopPropagation 不会挡住它：
    // 否则「弹窗浮在注解面板旁边、再点面板」时弹窗关不掉。
    // 例外（视为「弹窗内」不关闭）：弹窗自身、经文引用（点了要开新弹窗或压新层）、串珠出处、弹窗菜单。
    handleTooltipOutsideClick(evt) {
        const t = evt && evt.target;
        if (!t || typeof t.closest !== 'function') return;
        try {
            if (t.closest('.bible-inline-tooltip')) return;
            if (t.closest('.bible-inline-ref')) return;
            if (t.closest('.bible-note-ref-addr')) return;
            if (t.closest('.bible-tooltip-menu')) return;
        } catch (e) { return; }
        if (!document.querySelector('.bible-inline-tooltip')) return;   // 没有弹窗就不必清理
        this.removeCurrentTooltip();
    }

    // 找到元素所属的经文弹窗外壳（自身就是外壳时也返回自身）
    findTooltipShell(el) {
        if (!el || !el.closest) return null;
        return el.closest('.bible-inline-tooltip-host') || null;
    }

    // 压入新一层：在现有弹窗里显示新的经文出处
    async tooltipPushLevel(shell, match, sourceEl) {
        if (!shell || !shell.isConnected) return null;
        const stack = shell._navStack || (shell._navStack = []);
        if (stack.length >= 8) { new Notice('经文弹窗层级太深，请先返回上一层'); return null; }
        if (stack.length) stack[stack.length - 1].el.style.display = 'none';
        const lv = this.showVerseTooltip(shell._anchor, match, { host: shell, depth: stack.length, sourceEl: sourceEl || shell._anchor });
        stack.push(lv);
        shell._levels = shell._levels || [];
        shell._levels.push(match);
        this.tooltipActivateLevel(shell, lv);
        this.clampTooltipIntoView(shell);
        return lv;
    }

    // 退回上一层
    tooltipPopLevel(shell) {
        if (!shell || !shell.isConnected) return;
        const stack = shell._navStack || [];
        if (stack.length <= 1) return;               // 首层没有上一层，交给「点击弹窗外部」关闭
        const top = stack.pop();
        if (top && top.el) top.el.remove();
        if (shell._levels && shell._levels.length) shell._levels.pop();
        const cur = stack[stack.length - 1];
        if (cur && cur.el) cur.el.style.display = 'block';
        this.tooltipActivateLevel(shell, cur);
        this.clampTooltipIntoView(shell);
    }

    // 切换当前激活层：候选库、投影入口、注解开关按钮都跟着指向这一层
    tooltipActivateLevel(shell, level) {
        if (!level) return;
        shell._currentLevel = level;
        this.openTooltipPool(level.sessionKey);
        this.currentTooltipProjector = level.projector || null;
        if (level.syncNotes) this._syncNotesToolbar = level.syncNotes;
    }

    // 内容高度变化后，把弹窗收进可视区域
    clampTooltipIntoView(shell) {
        if (!shell || !shell.parentElement) return;
        const r = shell.getBoundingClientRect();
        let top = parseFloat(shell.style.top || '0');
        if (!isFinite(top)) top = r.top;
        if (r.bottom > window.innerHeight - 10) top = Math.max(10, window.innerHeight - r.height - 10);
        if (top < 10) top = 10;
        shell.style.top = top + 'px';
        let left = parseFloat(shell.style.left || '0');
        if (!isFinite(left)) left = r.left;
        if (left + r.width > window.innerWidth - 20) left = Math.max(10, window.innerWidth - r.width - 20);
        if (left < 10) left = 10;
        shell.style.left = left + 'px';
    }

    // 按住标题行拖动经文弹窗。绑定在外壳上（层切换 / 注解开关重建内容时外壳不变），
    // 所以只要绑一次；拖动结束后抑制紧随其后的 click，避免被当成「点击空白处返回上一层」。
    enableTooltipDrag(shell) {
        if (!shell || shell._dragEnabled) return;
        shell._dragEnabled = true;
        // 用 Pointer Events：一套逻辑同时覆盖鼠标 / 触摸 / 触控笔。
        // 标题栏的 touch-action:none 已阻止浏览器把触屏拖动当成页面滚动。
        shell.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            const t = e.target;
            if (!t || !t.closest) return;
            // 拖动手柄 = 从外壳顶边一直到工具条底边的整条顶部区域（含外壳自身的顶部内边距）。
            // 用几何区域判断而不是依赖具体元素，这样标题栏上方那 12px 留白、整条标题行、整条工具条
            // 全部都能拖动，鼠标和触屏一致。是否真的拖动由「位移是否超过阈值」决定，纯点击（不移动）
            // 仍会正常触发按钮自身行为，拖动结束后的首次点击也会被 _dragJustMoved 吞掉，不会误触按钮。
            const rect = shell.getBoundingClientRect();
            const yFromTop = e.clientY - rect.top;
            if (yFromTop < 0) return;
            // 找到当前可见的那一层（其它层可能是 display:none 的隐藏层，坐标无效）
            const levels = Array.from(shell.querySelectorAll(':scope > .bible-inline-tooltip-level'));
            const visible = levels.find(l => l.style.display !== 'none') || levels[levels.length - 1] || shell;
            const toolbar = visible.querySelector('.bible-inline-tooltip-toolbar');
            const header = visible.querySelector('.bible-inline-tooltip-header');
            const boundaryEl = toolbar || header;
            let boundary = rect.height;
            if (boundaryEl && boundaryEl.getBoundingClientRect) {
                boundary = boundaryEl.getBoundingClientRect().bottom - rect.top;
            }
            if (yFromTop > boundary + 8) return;   // 落在正文区域，不拖动
            const start = shell.getBoundingClientRect();
            const offX = e.clientX - start.left;
            const offY = e.clientY - start.top;
            // 出处文字本身支持双击跳转，别在按下时就 preventDefault，否则可能吃掉双击
            const onRefText = !!t.closest('.bible-inline-tooltip-ref');
            let moved = false;
            let dragEvt = null;
            const onMove = (ev) => {
                // 指针已松开（如在窗口外松开）但没收到 pointerup：按结束处理
                if (ev.buttons === 0 && ev.pointerType === 'mouse') { onUp(); return; }
                const dx = ev.clientX - (start.left + offX);
                const dy = ev.clientY - (start.top + offY);
                if (!moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
                if (!moved) {
                    moved = true;
                    dragEvt = ev;
                    shell.classList.add('bible-inline-tooltip-dragging');
                    try { const sl = window.getSelection(); if (sl && sl.removeAllRanges) sl.removeAllRanges(); } catch (_) { /* 无选区 */ }
                }
                ev.preventDefault();
                // 夹在视口内，避免拖到看不见的地方
                const w = shell.offsetWidth || start.width;
                const h = shell.offsetHeight || start.height;
                const left = Math.min(Math.max(6, start.left + dx), Math.max(6, window.innerWidth - w - 6));
                const top = Math.min(Math.max(6, start.top + dy), Math.max(6, window.innerHeight - h - 6));
                shell.style.left = left + 'px';
                shell.style.top = top + 'px';
            };
            const onUp = () => {
                document.removeEventListener('pointermove', onMove, true);
                document.removeEventListener('pointerup', onUp, true);
                document.removeEventListener('pointercancel', onUp, true);
                shell.classList.remove('bible-inline-tooltip-dragging');
                if (!moved) return;
                shell._dragJustMoved = true;
                // 兜底清除：拖动后没有产生 click 时，别让标记留到下一次点击
                setTimeout(() => { shell._dragJustMoved = false; }, 0);
            };
            document.addEventListener('pointermove', onMove, true);
            document.addEventListener('pointerup', onUp, true);
            document.addEventListener('pointercancel', onUp, true);
            // 触屏不要吞掉双击跳转的判定，只在不点出处文字时阻止默认滚动
            if (!onRefText && e.pointerType !== 'touch') e.preventDefault();
        });
    }

    // 切换注解开关等需要重渲染的场景：按栈里的出处依次重建，保持当前层级
    async rebuildTooltipStack(shell) {
        if (!shell || !shell.isConnected) return;
        const matches = (shell._levels || []).slice();
        if (!matches.length) return;
        try { shell.empty(); } catch (_) { shell.innerHTML = ''; }
        const srcEls = (shell._navStack || []).map(l => l.sourceEl);   // 保留各层的来源元素（用于再点关闭）
        shell._navStack = [];
        for (let i = 0; i < matches.length; i++) {
            const lv = this.showVerseTooltip(shell._anchor, matches[i], { host: shell, depth: i, sourceEl: srcEls[i] || shell._anchor });
            (shell._navStack = shell._navStack || []).push(lv);
            if (i < matches.length - 1) lv.el.style.display = 'none';
        }
        const cur = shell._navStack[shell._navStack.length - 1];
        this.tooltipActivateLevel(shell, cur);
        this.clampTooltipIntoView(shell);
    }

    // 一处经文引用的唯一键：同一处引用（书卷 + 章 / 节 / 范围）得到同一个键，
    // 既作为候选池的 key，也用于判断「再点同一处出处」时要不要关闭弹窗
    tooltipRefKey(match) {
        const refs = match.allRefs || [{
            chapter: match.chapter, verse: match.verse, verseEnd: match.verseEnd,
            suffix: match.suffix, endChapter: match.endChapter, endVerse: match.endVerse
        }];
        return 'tt|' + match.bookId + '|' + refs.map(r =>
            `${r.chapter}:${r.verse == null ? '' : r.verse}${r.verseEnd ? '-' + r.verseEnd : ''}${r.endChapter ? '~' + r.endChapter + (r.endVerse ? ':' + r.endVerse : '') : ''}`
        ).join(',');
    }

    // 点击经文出处时的统一入口：同一处出处再点一次即关闭弹窗，否则就地压栈 / 新开弹窗
    async toggleTooltipFromElement(el, match) {
        const key = this.tooltipRefKey(match);
        let shell = null;
        try { shell = document.querySelector('.bible-inline-tooltip-host'); } catch (e) { shell = null; }
        if (shell && shell.isConnected) {
            const stack = shell._navStack || [];
            const top = stack[stack.length - 1];
            // 当前显示的就是这一处出处 ⇒ 再点即关闭。
            // 来源元素可能因为正文重渲染而换了对象，所以只要旧对象已脱离文档也认作同一处
            if (top && top.refKey === key) {
                const src = top.sourceEl;
                if (!src || src === el || src.isConnected === false) {
                    this.removeCurrentTooltip();
                    return;
                }
            }
        }
        await this.navigateTooltipFromElement(el, match);
    }

    // 点击经文出处时的统一入口：在弹窗里就原地压栈，否则照旧新开弹窗
    async navigateTooltipFromElement(el, match) {
        const shell = (el && el.isConnected) ? this.findTooltipShell(el) : null;
        // 注解数据首次用到时才读，读完后继续（与阅读模式一致）
        if (this.settings.showNotes && !this.notesData && !this._notesLoading) await this.loadNotesData();
        if (shell && shell.isConnected) { await this.tooltipPushLevel(shell, match, el); return; }
        // 元素已从文档中移除（例如双击跳转时弹窗被关掉）：不再开新弹窗，否则会定位到左上角
        if (!el || el.isConnected === false) return;
        this.showVerseTooltip(el, match);
    }

    removeCurrentTooltip() {
        document.querySelectorAll('.bible-inline-tooltip').forEach(el => el.remove());
        this.currentTooltipProjector = null;
        this._syncNotesToolbar = null;
        this._tooltipRefresh = null;
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
