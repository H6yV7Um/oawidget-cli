/**
 * @file 预览入口文件
 * @author X-Jray(z.xuanjian@gmail.com)
*/
/* eslint-disable */
import oapAppEntry from '@baidu/oap-app-entry';
import san from 'san';
import ${cmptName} from '../src/${cmptName}';

export default oapAppEntry({
    template: `
        <section>
            <${cmptTagName} props="{{props}}"></${cmptTagName}>
        </section>
    `,
    initData() {
        return {
            /* TO BE REPLACED */
            props: {name: 'oawidget'}
            /* TO BE REPLACED */
        }
    },
    components: {
        '${cmptTagName}': ${cmptName}.widget
    }
}, san, false);
