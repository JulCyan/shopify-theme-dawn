# Third-party App Compatibility Playbook

这个文档用于演练 JD 中的「第三方 Shopify 应用集成与兼容排障」。

## 1. 目标

- 安全注入第三方脚本，避免重复加载。
- 监听脚本就绪状态，减少“初始化时序”问题。
- 提供统一排障路径，快速定位兼容性问题。

## 2. 可复用加载器

已提供 snippet：`snippets/jd-third-party-script-loader.liquid`

调用示例：

```liquid
{% render 'jd-third-party-script-loader',
  script_url: section.settings.app_script_url,
  script_id: 'reviews-sdk',
  init_event: 'reviews:ready'
%}
```

事件监听示例：

```javascript
window.addEventListener('reviews:ready', function (event) {
  console.log('App ready:', event.detail);
});

window.addEventListener('reviews:ready:error', function (event) {
  console.error('App load failed:', event.detail);
});
```

## 3. 兼容性排障顺序

1. 是否重复注入脚本（看 DOM 中同 id script 是否重复）。  
2. 是否脚本已加载但初始化太早（监听 `:ready` 后再 init）。  
3. 是否命名空间冲突（全局变量重名、事件名过泛）。  
4. 是否被 CSP 或 ad blocker 拦截（Network/Console 联合排查）。  
5. 是否移动端特定交互冲突（触摸事件与外部脚本事件绑定）。  

## 4. 面试表达模板

- 我们在主题里采用“可观测的脚本加载器”，先保证不重复注入，再通过 ready/error 事件做初始化与降级。  
- 遇到兼容问题，按“加载是否成功 -> 初始化时机 -> 全局冲突 -> 设备差异”分层定位，能快速把问题收敛到具体模块。  
