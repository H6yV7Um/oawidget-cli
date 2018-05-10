# [How]运营活动组件开发

## 准备工作

```
// 1. 安装CLI工具
npm i -g oawidget-cli

// 2. 查看CLI工具帮助
oawidget-cli -h

```
Usage: oawidget <command> [options]

运营活动平台化-组件开发CLI工具

Commands:

    init <cmptName>     scaffold with specifed template, named as <cmptName>
    debug               launch a server for debugging
    publish             inspect xx.editor.js file, build source code then deploy component to `OAP SERVER`

Options:

    -h, --help                  output usage infomation
    -v, --version               output the version number
    -c, --config list           output config list
    -c, --config [key=value]    enable configure userName/token/uploadUrl
```

### 创建项目脚手架

```
// 组件名命名规范(首字母大写+驼峰命名), 如下例
// 公用组件
oawidget-cli init CommonButton
// 活动私有组件
oawidget-cli init LoginRedpackButton
```

脚手架目录结构

```
-- build
|
-- mock  // 本地mock时，在文件夹下添加mock js文件，若引入APIM，则rm该功能
|
-- node_modules
|
-- preview // 自动完成配置注入和组件引入，不用写preview代码，一键调试
|
-- src // 组件源码文件在这里编写
|    |
|    -- XunrenButton
|         |
|          -- XunrenButton.js // 组件js源码，需开发者编写
|          |
|          -- XunrenButton.editor.js // 对运营活动配置平台暴露的可编辑属性，需开发者编写
|          |
|          -- index.js // 组件入口文件，自动生成
|          |
|          -- index.styl // 组件样式文件，需开发者编写
|          |
|          -- xx.png|jpeg|jpg|webp //若小图（30K以下），可添加至这里；若大图，请一定作为配置项，到运营活动配置平台自行上传
|
-- test
|
-- .babelrc
|
-- .gitignore
|
__ package.json
|
-- README.md
```

### 介入开发

```
// cd [cmptName], 如下例
cd CommonButton
// 如果你在用sublime
subl ./
```

请确保在coding前，你已经对你要开发的组件有了完整的设计思路，这样，你就可以写 `CommonButton.eidtor.js`了，配置文件里设置暴露给平台供用户配置的属性

支持用户配置的数据类型：

- type: 'number', unit: 'px'
- type: 'text', unit: '' // input type=text
- type: 'color', unit: ''
- type: 'image', unit: ''
- type: 'action', unit: '' // 事件
- type: 'select', unit: '' // 列表
- type: 'time', unit: ''
- type: 'radio', unit: '' // 单选框
- type: 'checkbox', unit: '' // 多选框
- type: 'textarea', unit: '' // 多行文本框
- type: 'array', unit: '' // 数组

运营活动组件平台化的设计中，抽离了组件的运行时，以确保构成页面/活动的组件在平台化提供的统一san环境下运行。所以在组件开发环境下，开发者需要写的是 `plain Object`， 运行时会完成自动包装，成为真正的`San Component`。

目前样式的Scope隔离通过`namespace`方式实现， 组件最外层元素的 Class 与组件名相同，请勿自行随意修改。

### 开发调试

```
oawidget-cli debug
```

自动完成配置注入和组件引入，打开一个浏览器窗口，供开发者开发调试。

### 上传组件到平台组件中心

执行这个命令，你的组件就进入了平台组件中心。

```
oawidget-cli publish
```

若是第一次发布，请到 [运营活动编辑平台](http://eop.baidu.com)，查询你的 *用户名*、*token*，并作为认证码，按引导输入。
