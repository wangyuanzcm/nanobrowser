# Nanobrowser 页面埋点与交互映射指南

本文档阐述如何在前端项目对可交互元素进行“提示型埋点”，并通过映射文件（Map）与浏览器插件配合，从而让小参数量模型也能快速、稳定地识别应执行的交互动作。

## 目标与收益

- 明确交互元素的业务语义与目标动作，减少模型对页面结构的“自由猜测”与试错成本
- 为复杂控件（如日期/时间选择器、级联下拉等）提供确定性的快路径，提升成功率与速度
- 在不改变现有 UI 的前提下，通过非侵入式属性与页面内 JSON，显式声明“该点位怎么交互”

## 埋点规范（data-nb-*）

为关键交互元素添加以下属性（任选其一或组合使用）：

- `data-nb-id`: 业务唯一标识，如 `login_submit`、`birth_date`
- `data-nb-action`: 推荐动作，如 `click`、`input_text`、`select_dropdown_option`、`set_date_picker_value`
- `data-nb-role`: 元素角色，如 `submit-button`、`search-input`、`date-picker`、`dropdown`
- `data-nb-target`: 目标值或选项文本，如期望填充的内容、要选择的选项
- `data-nb-format`: 值格式提示，如日期 `YYYY-MM-DD`、时间 `HH:mm:ss`

命名建议：

- `data-nb-id` 使用稳定的业务 ID，避免随 DOM 变化的索引号
- `data-nb-action` 与扩展的动作命名保持一致（见“动作与示例”）
- 对日期/时间选择器务必提供 `data-nb-role="date-picker"` 与 `data-nb-format`

示例（HTML）：

```html
<!-- 登录按钮 -->
<button id="submitBtn"
        data-nb-id="login_submit"
        data-nb-action="click"
        data-nb-role="submit-button">登录</button>

<!-- 出生日期输入（日期选择器） -->
<input id="birthDate"
       data-nb-id="birth_date"
       data-nb-action="set_date_picker_value"
       data-nb-role="date-picker"
       data-nb-format="YYYY-MM-DD" />

<!-- 城市下拉选择 -->
<select id="citySelect"
        data-nb-id="city_select"
        data-nb-action="select_dropdown_option"
        data-nb-role="dropdown">
  <option>北京</option>
  <option>上海</option>
  <option>深圳</option>
  <option>杭州</option>
  <option>成都</option>
  <option>武汉</option>
</select>
```

## 交互映射 Map 文件（可选）

当交互逻辑复杂（需要步进、确认按钮、特定面板选择等）时，建议在页面内提供映射 JSON，进一步提高确定性。

两种方式：

1) DOM Script：`<script type="application/json" id="nanobrowser-map">...</script>`
2) 全局变量：`window.__nbActionMap = { ... }`

结构建议（示例）：

```json
{
  "elements": {
    "birth_date": {
      "selector": "#birthDate",
      "action": "set_date_picker_value",
      "format": "YYYY-MM-DD",
      "confirm": true,
      "panelSelectors": [
        ".ant-picker-dropdown",
        ".el-date-editor__editor-wrapper",
        ".date-picker-popup"
      ]
    },
    "login_submit": {
      "selector": "#submitBtn",
      "action": "click"
    },
    "city_select": {
      "selector": "#citySelect",
      "action": "select_dropdown_option",
      "optionsSource": "innerText"
    }
  }
}
```

字段说明：

- `selector`: 用于兜底定位元素的选择器（与 `data-nb-id` 对应）
- `action`: 推荐动作（与 `data-nb-action` 对应）
- `format`: 值格式（如日期、时间格式）
- `confirm`: 是否需要确认按钮完成选择
- `panelSelectors`: 打开后用于定位面板的选择器集合
- `optionsSource`: 下拉选项来源（如从 `innerText` 读取）

## 浏览器插件对接流程（建议）

1) 采集埋点属性：
   - 构建页面状态时收集元素的常用属性及 `data-nb-*`
   - 参考：交互元素文本生成 `chrome-extension/src/background/browser/dom/views.ts:210`

2) 读取 Map：
   - 通过 `chrome.scripting.executeScript` 从页面读取 `#nanobrowser-map` 的 JSON 或 `window.__nbActionMap`
   - 参考：脚本调用 `chrome-extension/src/background/browser/dom/service.ts:138`

3) 合并策略与优先级：
   - 优先级：Map > `data-nb-*` > 常规启发式（标签、ARIA、可见性等）
   - 将提示信息合并到“交互元素列表”的文本，以便模型直接使用

4) 提示规范（系统提示调整）：
   - 在导航器系统提示中明确：当存在 `data-nb-*` 或 Map 提示时，严格依照提示选择元素与动作
   - 参考：系统提示模板 `chrome-extension/src/background/agent/prompts/templates/navigator.ts:1`

## 动作与示例

可配合的标准动作（部分）：

- `click_element`：点击元素
- `input_text`：向输入框键入文本
- `select_dropdown_option`：选择下拉选项（先 `getDropdownOptions` 再选择）
- `set_date_picker_value`：设置日期/时间选择器的值（快路径）
- `go_to_url`：导航到 URL
- `done`：任务完成输出

模型生成的动作序列应尽量根据提示直接命中目标元素与动作，避免多次试错。

## 日期/时间选择器快路径

- 推荐使用 `set_date_picker_value` 并遵循 `data-nb-format`（如 `YYYY-MM-DD`、`HH:mm:ss`）
- 优先走快路径：
  - 直接设置输入值并派发 `input/change/blur` 事件
  - 或在面板中选择目标日期/时间，必要时点击确认按钮
- 失败降级：再走“人类模拟流程”（依次尝试年份/月份/日期/时间选择，再确认）
- 参考：日期选择器实现入口 `chrome-extension/src/background/browser/page.ts:1027`

## 性能优化建议

- 等待参数调优：
  - 非导航动作下调 `minimumWaitPageLoadTime`（如 0.1–0.2s），导航/刷新保持或略减
  - `waitForNetworkIdlePageLoadTime` 可由 0.5s 调到 0.3s
  - 配置位置 `chrome-extension/src/background/browser/views.ts:80`
- 视窗范围与高亮：
  - `viewportExpansion=0`，仅展示视窗内元素，必要时适度扩展
  - 关闭 `displayHighlights` 可减少注入与清理成本（开发调试时开启）
  - 配置写入位置 `chrome-extension/src/background/index.ts:306`
- 缓存与变更检测：
  - 利用可交互元素哈希缓存，仅在 URL 或集合变更时重构树
  - 参考：可交互元素集合 `chrome-extension/src/background/browser/dom/clickable/service.ts:1`

## 安全与合规

- 遵循扩展的安全规则（登录/支付等敏感操作需要用户确认）
- Map 与埋点仅用于“提示”，不得绕过网站与浏览器安全策略
- 系统提示里已包含常见安全规范 `chrome-extension/src/background/agent/prompts/templates/common.ts:1`

## 推进步骤 Checklist

1) 在前端为关键交互元素添加 `data-nb-*` 属性
2) 为复杂控件提供 `nanobrowser-map` JSON（或 `window.__nbActionMap`）
3) 扩展侧收集 `data-nb-*` 并读取 Map，合并到交互元素文本
4) 在系统提示中说明“优先使用埋点提示”
5) 对日期/时间选择器接入快路径并保留降级方案
6) 调优等待参数，关闭非必要高亮，启用缓存减少重复构树

## 附：常见前端埋点示例

```html
<!-- 搜索输入框 -->
<input id="searchInput"
       data-nb-id="search_input"
       data-nb-action="input_text"
       data-nb-role="search-input"
       placeholder="搜索关键词" />

<!-- 搜索按钮 -->
<button id="searchBtn"
        data-nb-id="search_button"
        data-nb-action="click"
        data-nb-role="button">搜索</button>

<!-- 选择城市（含 Map 规则） -->
<select id="citySelect"
        data-nb-id="city_select"
        data-nb-action="select_dropdown_option"
        data-nb-role="dropdown">
  <option>北京</option>
  <option>上海</option>
  <option>深圳</option>
</select>

<script id="nanobrowser-map" type="application/json">
{
  "elements": {
    "city_select": {
      "selector": "#citySelect",
      "action": "select_dropdown_option",
      "optionsSource": "innerText"
    }
  }
}
</script>
```