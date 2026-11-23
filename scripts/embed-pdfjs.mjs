#!/usr/bin/env node
/**
 * 把 lib/pdf.min.js 与 lib/pdf.worker.min.js 内联进 main.js。
 *
 * 为什么需要：
 *   Obsidian 官方插件市场（以及"手动下载三个文件"的安装方式）只会分发
 *   main.js / styles.css / manifest.json —— 插件目录里不会有 lib/。
 *   投影图表 PDF 依赖 pdf.js，若只在运行时读 lib/，新用户打开图表会失败。
 *   官方规范也要求依赖打包进 main.js，且禁止运行时下载远程代码。
 *
 * 做法：
 *   把两份 pdf.js 源码以 JSON 字符串字面量内联进 main.js 的一个函数体内
 *   （V8 对未调用的函数做懒解析，模块加载时不会创建这两个大字符串，
 *    首次打开图表时才还原）。
 *   运行时 loadChartPdfJs() 只执行这份内联副本，并在隔离作用域里求值，
 *   避免覆盖 Obsidian 自带 PDF 阅读器的 window.pdfjsLib。
 *   ⚠️ 不再从插件目录 lib/ 注入 <script>：官方审核把运行时创建脚本元素判为错误。
 *   lib/ 下的两个文件因此只是构建期源文件。
 *
 * 用法：node scripts/embed-pdfjs.mjs
 * 幂等：重复执行只会替换标记之间的内容，不会重复追加。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAIN = path.join(root, 'main.js');
const LIB_MAIN = path.join(root, 'lib', 'pdf.min.js');
const LIB_WORKER = path.join(root, 'lib', 'pdf.worker.min.js');

const START = '/* ===== BIBLE_INLINE_PDFJS_START';
const END = '/* ===== BIBLE_INLINE_PDFJS_END';
const ANCHOR = 'module.exports = BibleSearchPlugin;';

/** JSON 转义成可直接放进 JS 的字符串字面量（并规避 U+2028/2029 的兼容性问题） */
const esc = (s) => JSON.stringify(s).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

/**
 * 抹掉 pdf.js 里自带的 loadScript()。
 * pdf.js 的 display/utils 导出一个 loadScript()，函数体里写着 document.createElement("script")；
 * 它只服务于 PDF 表单 JS / XFA 那类场景，我们只渲染页面，永远不会调用。
 * 但内联进 main.js 后，官方审核的静态扫描仍然会把这段文本算作「运行时创建脚本元素」，
 * 于是把函数体换成直接 reject 的桩：行为不变，文本里不再出现脚本注入。
 * 找不到时返回原样（不因版本差异中断构建），只提示。
 */
function stubPdfjsLoadScript(src, label) {
    const KEY = 'loadScript=function loadScript(';
    const at = src.indexOf(KEY);
    if (at < 0) {
        console.log(`[embed-pdfjs] 提示：${label} 里没有 loadScript 导出，跳过。`);
        return src;
    }
    const brace = src.indexOf('{', at);
    if (brace < 0) return src;
    let depth = 0;
    let end = -1;
    for (let i = brace; i < src.length; i++) {
        const ch = src[i];
        if (ch === '{') depth += 1;
        else if (ch === '}') {
            depth -= 1;
            if (depth === 0) { end = i; break; }
        }
    }
    if (end < 0) return src;
    const body = src.slice(brace, end + 1);
    if (!body.includes('createElement("script")')) return src;
    const stub = '{return Promise.reject(new Error("loadScript is disabled in this build"))}';
    return src.slice(0, brace) + stub + src.slice(end + 1);
}

let mainSrc = fs.readFileSync(LIB_MAIN, 'utf8');
const workerSrc = fs.readFileSync(LIB_WORKER, 'utf8');
const libVersion = (mainSrc.match(/version\s*=\s*"([\d.]+)"/) || [])[1] || 'unknown';

if (!mainSrc.includes('pdfjsLib')) {
    console.error('[embed-pdfjs] 警告：lib/pdf.min.js 里没找到 pdfjsLib，确认文件是否正确。');
}

mainSrc = stubPdfjsLoadScript(mainSrc, 'lib/pdf.min.js');
const leftover = [mainSrc, workerSrc].filter((s) => s.includes('createElement("script")')).length;
if (leftover) {
    console.error('[embed-pdfjs] 失败：内联副本里仍有 createElement("script")，官方审核会判错。');
    process.exit(1);
}

const block = `${START}（由 scripts/embed-pdfjs.mjs 生成，请勿手改）===== */
/* 内联 PDF.js v${libVersion}（Apache-2.0，见 https://github.com/mozilla/pdf.js）。
   内联原因：Obsidian 官方插件市场只分发 main.js / styles.css / manifest.json，
   插件目录里没有 lib/，依赖必须打包进 main.js（规范亦禁止运行时下载远程代码）。
   两份源码置于函数体内，由 V8 懒解析：模块加载时不会创建这两段大字符串，
   首次打开图表时才还原，避免拖慢启动。pdf.js 自带的 loadScript()（会创建
   script 元素）已在构建时替换为桩，官方审核不会判「动态注入脚本」。 */
let __BIBLE_INLINE_PDFJS = null;
function bibleInlinePdfjs() {
    if (!__BIBLE_INLINE_PDFJS) {
        __BIBLE_INLINE_PDFJS = {
            main: ${esc(mainSrc)},
            worker: ${esc(workerSrc)}
        };
    }
    return __BIBLE_INLINE_PDFJS;
}
${END} ===== */
`;

let content = fs.readFileSync(MAIN, 'utf8');

// 1) 移除已有的旧块（幂等：插入与移除必须严格对称，否则每次都会多一个空行）
const s = content.indexOf(START);
const e = content.indexOf(END);
if (s >= 0 && e > s) {
    const endOfLine = content.indexOf('\n', e);
    let cut = endOfLine + 1;
    if (content[cut] === '\n') cut += 1;
    content = content.slice(0, s) + content.slice(cut);
}

// 2) 插到 module.exports 之前（block 自带结尾换行，此处不再补换行）
const anchorIdx = content.lastIndexOf(ANCHOR);
if (anchorIdx < 0) {
    console.error('[embed-pdfjs] 找不到锚点：' + ANCHOR);
    process.exit(1);
}
content = content.slice(0, anchorIdx) + block + content.slice(anchorIdx);

fs.writeFileSync(MAIN, content, 'utf8');

const mb = (n) => (n / 1048576).toFixed(2) + ' MB';
console.log('[embed-pdfjs] 完成');
console.log('  PDF.js 版本   :', libVersion);
console.log('  pdf.min.js    :', mb(Buffer.byteLength(mainSrc)));
console.log('  pdf.worker.js :', mb(Buffer.byteLength(workerSrc)));
console.log('  main.js 现为  :', mb(Buffer.byteLength(content)));
