/**
 * @file 预览入口文件
 * @author X-Jray(z.xuanjian@gmail.com)
*/

/* eslint-disable */
import oapAppEntry from '@baidu/oap-app-entry';
import ${cmptName} from 'SRC/${cmptName}';

export default oapAppEntry({
    template: `
        <section>
            <${cmptTagName} widgetId="w1" props="{{widgetsProps.w1}}"></${cmptTagName}>
        </section>
    `,
    initData() {
/* TO BE REPLACED */
        return {};
/* TO BE REPLACED */
    },
    components: {
        '${cmptTagName}': ${cmptName}.widget
    }
}, san, false);
