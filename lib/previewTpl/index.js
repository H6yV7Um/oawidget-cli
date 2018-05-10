/**
 * @file preview
 * @author X-Jray(z.xuanjian@gmail.com)
 */

/* eslint-disable */
import SanApp from './App';

new SanApp().attach(document.querySelector('#app'));

if (module.hot) {
    module.hot.accept('./App', function (data) {
        document.querySelector('#app').innerHTML = '';
        new SanApp().attach(document.querySelector('#app'));
    });
}
