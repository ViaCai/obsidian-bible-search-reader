#!/usr/bin/env bash
# release-check.sh — 发布后本地核对脚本
#
# 用法:
#   ./release-check.sh            # 读取 manifest.json 的 version 作为目标版本
#   ./release-check.sh 3.1.7      # 显式指定版本号
#
# 核对三项:
#   1. 本地 HEAD 是否等于该 tag 指向的 commit
#   2. tag 是否已推送到远程 (git ls-remote)
#   3. GitHub Release 是否已创建且含 main.js / manifest.json / styles.css 三个附件
#
# 退出码: 全部 OK 为 0; 任一 FAIL/WARN 为 1。

cd "$(dirname "$0")" || exit 1

VER="${1:-}"
if [ -z "$VER" ]; then
  VER="$(grep -o '"version"\s*:\s*"[^"]*"' manifest.json 2>/dev/null | head -1 | sed -E 's/.*"([0-9][0-9.]*).*/\1/')"
fi
if [ -z "$VER" ]; then
  echo "[FAIL] 无法确定版本号: 请在参数中指定, 或检查 manifest.json 的 version 字段"
  exit 1
fi

echo "=== 发布核对: v${VER} ==="
ALL_OK=1

# 1. 本地 HEAD == 该 tag 指向的 commit
LOCAL_HEAD="$(git rev-parse HEAD 2>/dev/null)"
TAG_COMMIT="$(git rev-list -n 1 "v${VER}" 2>/dev/null || git rev-list -n 1 "${VER}" 2>/dev/null)"
if [ -n "$TAG_COMMIT" ] && [ "$LOCAL_HEAD" = "$TAG_COMMIT" ]; then
  echo "[OK]   本地 HEAD ($LOCAL_HEAD) == tag ${VER} ($TAG_COMMIT)"
elif [ -n "$TAG_COMMIT" ]; then
  # 判断本地 HEAD 是否包含该 tag (即 HEAD 在 tag 之后还有提交), 还是 tag 未 fetch
  if git merge-base --is-ancestor "$TAG_COMMIT" "$LOCAL_HEAD" 2>/dev/null; then
    echo "[WARN] tag ${VER} ($TAG_COMMIT) 已合入本地, 但当前 HEAD ($LOCAL_HEAD) 在其之后还有提交 (发布后又改了代码, 属正常)"
  else
    echo "[WARN] 本地 HEAD ($LOCAL_HEAD) 与 tag ${VER} ($TAG_COMMIT) 不一致 (可能 tag 尚未 fetch 到本地)"
  fi
  ALL_OK=0
else
  echo "[WARN] 本地未找到 tag ${VER} (可能尚未 fetch, 或尚未打 tag)"
  ALL_OK=0
fi

# 2. tag 已推到远程
if git ls-remote --tags origin 2>/dev/null | grep -q "refs/tags/${VER}\$"; then
  echo "[OK]   tag ${VER} 已存在于远程"
else
  echo "[FAIL] tag ${VER} 未推送到远程 (git push origin ${VER})"
  ALL_OK=0
fi

# 3. GitHub Release 已建且含三个附件
if command -v gh >/dev/null 2>&1; then
  ASSETS="$(gh release view "${VER}" --json assets --jq '[.assets[].name] | join(", ")' 2>/dev/null)"
  if [ -n "$ASSETS" ]; then
    echo "[OK]   Release ${VER} 已存在, 附件: $ASSETS"
    case "$ASSETS" in
      *main.js*manifest.json*styles.css*) : ;;
      *) echo "[WARN] Release ${VER} 缺少预期附件 (期望 main.js / manifest.json / styles.css)"; ALL_OK=0 ;;
    esac
  else
    echo "[FAIL] Release ${VER} 不存在 (gh 未查到, 或 gh 未登录)"
    ALL_OK=0
  fi
else
  echo "[SKIP] 未安装 gh, 跳过 Release 校验"
fi

echo "=== 核对完成 ==="
if [ "$ALL_OK" -eq 1 ]; then
  echo "全部通过 ✅"
  exit 0
else
  echo "存在 WARN/FAIL, 请检查上方输出 ⚠️"
  exit 1
fi
