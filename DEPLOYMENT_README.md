# 照见实验场：公网部署包

这是从 `/Users/jiaqi/Desktop/黑客松` 当前工作树生成的生产运行包，制作时间为 2026-07-26，基线提交为 `baeabc8`，并包含提交之后当前工作树中的未提交体验。它不是源码备份；原项目仍是唯一制作源。

包内已经包含生产网页、MediaPipe 模型、WASM、二十八宿素材、老虎机素材和同源 Express API。部署后所有体验都由同一个 HTTPS 域名打开，摄像头权限可正常请求。

## 最快部署：Render 或 Railway

1. 解压本包，把整个文件夹放进一个新的 Git 仓库并推送到 GitHub。
2. Render：选择 `New > Blueprint` 或 Docker Web Service，指向这个仓库。健康检查填 `/api/health`。
3. Railway：选择 `Deploy from GitHub Repo`。仓库内的 `railway.toml` 与 `Dockerfile` 会自动生效。
4. 平台完成后，打开它提供的 `https://...` 地址。首页就是全部体验总入口。

部署必须使用 Web Service 或 Docker 服务，不能只上传到纯静态空间。`/api/*`、单页路由回退和可选匿名留影都由随包服务处理。

## Docker 部署

```bash
docker build -t zhaojian-exhibition .
docker run --rm -p 4180:4180 zhaojian-exhibition
```

打开 `http://127.0.0.1:4180/`。公网服务器应由反向代理或云平台提供 HTTPS。

## 不用 Docker 的 Node 部署

要求 Node.js 20+：

```bash
npm ci --omit=dev
HOST=0.0.0.0 PORT=4180 npm start
```

多数平台会自动注入 `PORT`，此时启动命令只需 `npm start`。本机也可双击 `本机验包.command`。

## 环境变量

- `PORT`：监听端口，默认 `4180`；公网平台通常自动提供。
- `HOST`：公网必须是 `0.0.0.0`，本包默认已设置。
- `EXHIBITION_ID`：健康接口显示的展项编号。
- `ARCHIVE_DIR`：匿名艺术化留影目录。需要长期保存时挂载持久磁盘，并改为如 `/data/archive`。
- `OPENAI_API_KEY` 与 `OPENAI_MODEL`：可选人物视觉回声与双未来文本。
- `DEEPSEEK_API_KEY`、`DEEPSEEK_MODEL` 与 `DEEPSEEK_BASE_URL`：可选九幕文本能力。

不要把真实 Key 写进本包或 Git。请在 Render、Railway 或服务器的 Secret/Environment 设置中配置。无 Key 时主体验仍可走完；人物回声和叙事使用本地策展降级，九幕中的模型步骤也会回到本地内容。

## 完整入口

- `/`：照见实验场总入口
- `/?zhaojian=1`：原「照见」
- `/?oracle=1&installation=1`：「或然·未然」展场版
- `/?rps=1`：动作预判石头剪刀布
- `/?slot=1`：「未定机」抓杆老虎机
- `/?constellations=1`：双星宿粒子试作
- `/?star-particles=1`：二十八宿粒子大图
- `/?stars=1`：二十八宿观测册
- `/?destiny=1`：「过去与现代」九幕主线

## 上线检查

1. 打开 `/api/health`，应返回 `{"ok":true,...}`。
2. 用 HTTPS 打开首页，确认不是空白页，并逐个点击九个入口。
3. 在手机上允许摄像头，确认浏览器地址栏显示安全连接。摄像头在普通 HTTP 公网地址上不会工作。
4. 检查 `/?oracle=1&installation=1`、`/?rps=1`、`/?slot=1` 和 `/?destiny=1` 的摄像头授权与拒绝降级路径。
5. 未配置持久磁盘时，云平台重启会清空服务端匿名留影；浏览器直接下载海报不受影响。

## 包内文件

- `dist/`：已经构建的全部前端与运行时资产。
- `server.mjs`：已打包的生产 API 与静态服务入口。
- `Dockerfile`、`render.yaml`、`railway.toml`：公网平台部署配置。
- `.env.example`：仅含配置名和空值。
- `CHECKSUMS.sha256`：关键文件校验清单。
- `THIRD_PARTY_NOTICES.md`：第三方来源与许可说明。

本包不含 `.env`、API Key、原始观众照片、生辰记录、`archive/` 留影、`node_modules`、原始研究资料或第三方参考仓库。
