#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "需要先安装 Node.js 20 或更高版本。"
  read -r -p "按回车键退出。"
  exit 1
fi

if [ ! -d node_modules ]; then
  npm ci --omit=dev --no-audit --no-fund
fi

(sleep 1; open "http://127.0.0.1:4180/") &
HOST=127.0.0.1 PORT=4180 npm start
