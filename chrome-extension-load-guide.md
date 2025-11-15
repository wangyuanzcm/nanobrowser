# 在Chrome浏览器中加载和调试NanoBrowser扩展

## 一、加载扩展到Chrome浏览器

1. **打开Chrome扩展管理页面**
   - 在Chrome浏览器地址栏中输入：`chrome://extensions/`
   - 或者点击Chrome菜单 > 更多工具 > 扩展程序

2. **启用开发者模式**
   - 在扩展管理页面的右上角，找到并开启「开发者模式」开关
   - 开启后会显示三个按钮：「加载已解压的扩展程序」、「打包扩展程序」和「更新」

3. **加载扩展**
   - 点击「加载已解压的扩展程序」按钮
   - 在文件选择对话框中，导航到项目的`dist`目录（`d:\github_repo\nanobrowser\dist`）
   - 选中该目录并点击「选择文件夹」按钮
   - 扩展将被加载到Chrome浏览器中

4. **确认扩展已加载**
   - 扩展应该出现在扩展列表中
   - 可以看到扩展的名称、版本和ID等信息

## 二、使用扩展

1. **扩展图标**
   - 扩展加载成功后，图标应该出现在Chrome工具栏中
   - 点击图标可以打开扩展的侧边栏（side-panel）

2. **访问扩展页面**
   - 扩展选项页面：点击扩展管理页面中的「详情」按钮，然后点击「扩展选项」
   - 侧边栏页面：点击扩展图标或在浏览器地址栏中输入`chrome://side-panel/`并选择NanoBrowser扩展

## 三、开发模式下的扩展更新

- 当你在开发环境中（使用`pnpm dev`命令）修改代码时，扩展会自动重新加载
- HMR（热模块替换）已经配置好，可以看到实时的更改
- 有时可能需要手动刷新扩展：在扩展管理页面点击「刷新」图标

## 四、调试扩展

### 4.1 调试背景脚本（Background Script）

1. 在扩展管理页面（`chrome://extensions/`）中找到NanoBrowser扩展
2. 点击「背景页面」链接或「查看视图：service worker」按钮
3. 这将打开Chrome开发者工具，可以：
   - 查看控制台输出（Console）
   - 设置断点（Sources）
   - 监控网络请求（Network）
   - 检查存储数据（Application > Storage）

### 4.2 调试内容脚本（Content Script）

1. 打开扩展正在运行的网页
2. 右键点击页面并选择「检查」或按`F12`打开开发者工具
3. 在开发者工具中：
   - 切换到「Console」标签可以查看内容脚本的输出
   - 切换到「Sources」标签，展开「Content scripts」部分找到扩展的脚本
   - 可以设置断点和单步调试

### 4.3 调试弹出页面（Popup）和侧边栏（Side Panel）

1. **调试侧边栏**：
   - 打开扩展的侧边栏
   - 在侧边栏内右键点击并选择「检查」或按`F12`
   - 这将打开专门用于侧边栏的开发者工具窗口

2. **调试选项页面**：
   - 打开扩展的选项页面
   - 按`F12`或右键点击并选择「检查」
   - 可以使用标准的开发者工具进行调试

### 4.4 使用console.log进行调试

在你的代码中添加`console.log()`语句：

```javascript
// 在background.js中
console.log('Background script initialized');

// 在content script中
console.log('Content script injected into page:', window.location.href);

// 在任何组件中
console.log('Component state:', this.state);
```

这些日志会显示在相应的开发者工具控制台中。

### 4.5 调试技巧

1. **使用debugger语句**：在代码中添加`debugger;`语句，当开发者工具打开时，代码会在此处暂停执行

2. **使用Chrome DevTools Features**：
   - 元素检查（Elements）：查看和修改DOM
   - 网络监控（Network）：查看API请求和响应
   - 存储（Application > Storage）：检查localStorage、sessionStorage和IndexedDB
   - 性能分析（Performance）：分析扩展的性能问题

3. **检查扩展错误**：
   - 在扩展管理页面查看错误图标
   - 点击错误图标查看详细的错误信息

## 五、常见问题排查

1. **扩展无法加载**：
   - 检查manifest.json文件是否有语法错误
   - 确认所有必需的文件都在dist目录中

2. **功能不工作**：
   - 检查权限设置是否正确
   - 查看控制台错误信息
   - 确认内容脚本正确注入

3. **开发模式更新问题**：
   - 如果自动更新不工作，尝试手动刷新扩展
   - 检查HMR连接状态：在开发者工具控制台中查看HMR相关日志