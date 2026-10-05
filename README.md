## 安装方式说明

请从仓库 [Releases](https://github.com/bxyj86/SCML-DOL-robin-skip-class/releases/latest) 下载最新的 **`带罗宾逃课.zip`**（请不要下载 source code）。

解压后放进 DoL 的 `mods/` 目录。

正确的目录结构（`mods/` 下直接是 `带罗宾逃课/`）：

- `mods/带罗宾逃课/boot.json`
- `mods/带罗宾逃课/framework.js`
- `mods/带罗宾逃课/twee/`
- `mods/带罗宾逃课/lang/`

**依赖模组**（必须已安装）：

| 模组 | 版本 | 说明 |
|---|---|---|
| ModLoader | ≥2.0.0 | 基础模组加载器 |
| TweeReplacer | ^1.0.0 | 用于往原版 passage 插入链接 |
| **maplebirch（秋枫白桦框架）** | **≥5.2.3** | **本模组的核心运行依赖，负责加载 `framework.js`** |

> ⚠️ **务必确认秋枫白桦框架（maplebirch）已安装**，否则本模组的逻辑函数不会加载，会直接报错。

<details>
  <summary>点击查看本模组当前适配的游戏版本</summary>

  本体 **0.5.12.13**

  暂未适配其他版本。
</details>