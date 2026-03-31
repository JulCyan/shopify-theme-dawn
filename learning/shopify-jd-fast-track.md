# Shopify JD Fast Track (Dawn 实战版)

> 目标：不做泛学，直接打通「能开发、能联调、能发布、能讲清楚」的 Shopify 实战闭环。  
> 当前起点：高级前端，做过类 Shopify 拖拽设计器，理解 section/block，已学到你文档的第 5 阶段。

## 0. JD 对齐地图

### A. Shopify 主题开发与维护
- Liquid + HTML + CSS + JS：通过自定义 section 完成模块开发。
- 日常定制与故障排查：用 Theme Editor + 本地日志快速定位。
- 响应式兼容：桌面/移动双端验收。

### B. 性能优化与 SEO 基础
- 图片懒加载、合理 `sizes/srcset`、关键内容语义化标签。
- 可访问性字段（alt、aria）、标题层级和结构化内容意识。

### C. 第三方应用与兼容性
- app block / snippet 插槽预留。
- 脚本冲突定位流程（加载顺序、命名空间、事件冲突）。

### D. Shopify 无头开发
- Storefront API + GraphQL 最小链路跑通。
- 产品查询 -> 购物车创建 -> 加购变更（最小可运行脚本）。

## 1. 学习方式：每次只做一个可验收改动

每个改动必须同时满足：
- 能在 `shopify theme dev` 看到结果。
- 能在 Theme Editor 中配置并保存。
- 有明确“完成定义（DoD）”。

## 2. 提交节奏（建议 5 个 commits）

## Commit 1 - 学习主线和验收标准
- 产出：本文件。
- DoD：你可以按文件直接执行，不需要再二次拆解任务。

## Commit 2 - 自定义营销模块（section + blocks + schema）
- 产出：`sections/jd-marketing-hero.liquid`。
- 练习点：
  - section settings（标题、副标题、背景图、按钮）。
  - blocks（特性卡片，可增删改排序）。
  - `block.shopify_attributes` 高亮与编辑器联动。
- DoD：首页可直接添加该 section，并动态编辑。

## Commit 3 - 性能与 SEO 强化
- 产出：同模块中的图像加载策略与语义结构升级。
- 练习点：
  - `image_tag` + `loading` + `fetchpriority` + `sizes`。
  - heading 层级控制、alt 文本兜底、按钮语义。
- DoD：Lighthouse 中可见可解释的优化动作（不追求一次满分）。

## Commit 4 - 真实数据接入 + metafield
- 产出：`sections/jd-featured-products.liquid`。
- 练习点：
  - `collection` + `product` 对象读取。
  - 商品卡中输出 `product.metafields.custom.*` 示例。
  - 区分三类数据：section 配置 / Shopify 对象 / metafield。
- DoD：可在编辑器选择 collection，页面展示真实商品数据。

## Commit 5 - Storefront API 最小无头链路
- 产出：`headless-playground/` 下脚本与 README。
- 练习点：
  - GraphQL 请求产品。
  - 创建 cart 并添加商品变体。
  - 用环境变量管理 token/domain。
- DoD：本地命令可跑，输出结构化 JSON 结果。

## 3. 每天执行模板（45~90 分钟）

1. 打开 `shopify theme dev`，先确认本地预览会话在线。  
2. 只做一个可验收点（不要并行开多个模块）。  
3. 在 Theme Editor 录一段 30 秒操作录像（证明配置生效）。  
4. 提交 commit，写清楚“做了什么 + 为什么 + 怎么验收”。  
5. 结束前做一次移动端快速检查（至少 iPhone 宽度断点）。

## 4. 快速排障清单

- 改了代码没生效：
  - 先看是否在 `shopify theme dev` 对应会话。
  - 用无痕窗口排除 preview 缓存干扰。
- Editor 里看不到配置项：
  - 检查 `{% schema %}` JSON 是否合法。
  - 检查 `presets` 是否配置。
- block 操作异常：
  - 确认循环中包含 `{{ block.shopify_attributes }}`。
- 图片性能差：
  - 检查是否使用 `image_url` 与 `image_tag`，并设置合理 `sizes`。

## 5. 你这个画像的最佳策略

- 你的优势是组件抽象和编辑器思维，不要从语法入门，直接从“可配置模块系统”切入。  
- 先把 Theme 线做深（能扛日常开发/维护/优化），再把无头线做窄而深（Storefront API 关键链路）。  
- 只要上面 5 个 commit 跑完，你就已经是“可上手交付”的 Shopify 前端，不是纯学习状态。
