# Tianjiao Hao · Interactive Park Demo

这是一个由透明 PNG 分层搭建的可探索游园场景。完整地图母版 `map-reference.png` 只用于构图参考，不在页面中加载、裁切、作为背景或作为交互底图。

## 运行

依赖已安装时，运行 `pnpm dev` 并打开 http://127.0.0.1:5173/。生产版运行 `pnpm build`、`pnpm start`；`out/` 是静态导出。

## 场景与素材

| Component | 实际使用素材 | 层与动效 |
| --- | --- | --- |
| `SceneRoot` / `LandscapeAccentLayer` | `carousel.png`、`ferris-parts.png` 的非母版地形笔触；其余路径、折页线条由轻量 HTML/SVG 绘制 | 背景静止 |
| `CarouselScene` | `carousel.png` 静态底座；`carousel-horses.png` 马与中心结构；`carousel-canopy.png` 顶棚与旗 | 中心结构与马 135s 微幅透视式转动；马 17s 轻微浮动；顶棚 24s 漂移；旗 14s 轻摆 |
| `RollerCoasterScene` | `coaster-track.png`、`coaster-train.png` | 轨道静止；小车 48s 周期，约前三分之二时间停顿 |
| `FerrisWheelScene` | `ferris-parts.png` 中独立轮体、支架、座舱 | 支架静止；轮体与座舱 300s 转一周，座舱反向转动保持直立 |
| `SnackStallScene` | `snack-cart-body.png`、`balloons.png`、`popcorn.png`、`soda.png`、`ice-cream.png`、`hot-dog.png` | 车体静止；气球 19s 轻摆 |
| `ContactScene` | `contact-pavilion.png`，用 SVG clip 分成亭身与旗 | 亭身静止；旗 18s 轻摆 |

所有源文件按原字节保留在 `public/assets/`，`manifest.json` 记录来源。没有新生成插画、改色、锐化、加滤镜或阴影。完整设施图仍保留作参考，但首页没有渲染静态整图 fallback。项目中没有头像悬浮窗、chatbot、底部导航或模板控件。

## 独立物件与数据

每个物件都是带 `data-facility` 与 `data-object-id` 的独立按钮。关系集中在 `data/scene.ts`，内容集中在对应的 `data/*.ts`。

| Facility | 可独立点击的物件 → data id |
| --- | --- |
| Carousel | 四匹木马 → `education`、`languages`、`international`、`working-style`；中心小热区 → About overview |
| Roller Coaster | 三个站点 → `internship-global`、`internship-brand`、`internship-next`；移动小车 → Experience overview |
| Ferris Wheel | 五个座舱 → `market-entry`、`brand-story`、`campaign`、`research`、`launch`；轮心 → Selected Work overview |
| Snack Stall | 气球、爆米花、汽水、冰淇淋、热狗 → `travel`、`movies`、`photography`、`food`、`curiosity`；车体小热区 → Interests overview |
| Contact | 信箱、电话、信纸 → `email`、`linkedin`、`resume`；亭内小热区 → Contact overview |

这批内容是可替换示例，不代表已核实的真实履历。邮箱、LinkedIn 与简历地址仍为空值，没有伪造联系方式或数据。

## 交互与响应式

设施默认不显示名称。鼠标 hover 或键盘 focus 只显示轻量 HTML 注释。物件按钮支持鼠标、Tab/Enter 和手机 tap。点击后打开编辑式白纸侧页；Esc、关闭按钮、点击纸外区域可返回地图，并把焦点还给原物件。

桌面展示完整非对称场景；700px 以下调整为纵向游园路线，仍保留所有 object-level 入口。支持 `prefers-reduced-motion`，内容纸页展开时暂停场景动效。
