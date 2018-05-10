/**
 * @file ${cmptName} editor
 * @author ${yourName}(${yourName}@baidu.com)
 */

export default {
    name: '${cmptName}',
    // 必填! 组件中文名称
    displayName: '',
    // 必填! 截取组件375*667(iphone6)预览图, 并填写组件地址, 上传至http://cms.m.baidu.com/pocms/icms/index
    imgViewSrc: '',
    // 必填! 公用组件填1, 用户上传组件填2
    type: 2,
    // 填写apim平台token
    apimToken: '',
    // 填写apim平台token
    apimPort: 9090,
    // 属性配置组
    propertiesGroup: [
/* Replace It !! 写下你的组件配置
        {
            text: '布局',
            properties: [
                {
                    name: 'width',
                    text: '宽度',
                    type: 'number',
                    value: 20
                },
                {
                    name: 'height',
                    text: '高度',
                    type: 'number',
                    value: 80
                }
            ]
        },
        {
            text: '样式',
            properties: [
                {
                    name: 'backgroundImage',
                    text: '背景图',
                    type: 'image',
                    value: ''
                }
            ]
        }
*/
    ],
    // 配置你的数据源
    widgetDatas: [
/* Replace It !! 写下你的数据配置
        // 支持本地mock(mock@@{"errno":0,"data":{"list":["first"]}} jsonp@@http://eopa.baidu.com/api/xx/yy?callback=cb)
        {
            name: 'novelList',
            text: '中奖记录',
            descr: '中奖记录',
            value: 'get@@https://eopa.baidu.com/api/lottery/v2/winners/6b0ef2f2'
        }
*/
    ],
    widgetLogs: [
/* Replace It !! 写下你的日志配置
        {
            name: 'click',
            text: '点击日志',
            value: '{"page": 'xxx', "type": "yyy"}'
        }
*/
    ],
    widgetEvents: [
/* Replace It !! 写下你的日志配置
        {
            name: 'click',
            text: '点击事件',
            descr: '当点击时触发',
            type: 'action',
            value: '{"id": "xxx", "action": "show"}'
        }
*/
    ]
};
