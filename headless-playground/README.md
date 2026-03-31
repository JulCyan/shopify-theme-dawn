# Storefront API Playground

这个目录提供一个最小可运行的 Shopify 无头链路脚本，覆盖：
- GraphQL 查询产品
- 使用变体创建 cart
- 输出结构化结果，便于联调与排障

## 1. 准备环境变量

复制 `.env.example`，并填写你的店铺域名与 Storefront token。

PowerShell 示例：

```powershell
$env:SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
$env:SHOPIFY_STOREFRONT_TOKEN="your_storefront_api_access_token"
$env:SHOPIFY_API_VERSION="2025-10"
```

## 2. 运行脚本

```powershell
node .\headless-playground\storefront-flow.mjs
```

## 3. 验收标准（DoD）

- 能返回 `products` 查询结果并选中一个 variant。  
- 能成功执行 `cartCreate`。  
- 输出中包含 `checkoutUrl` 与 `cart.lines`。  

## 4. 你可以继续扩展的方向

- 增加 `cartLinesAdd` / `cartLinesUpdate` 流程。
- 增加客户登录与 customer access token 流程。
- 用 Next.js/Remix 包一层服务端请求与缓存策略。
