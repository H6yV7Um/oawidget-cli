/**
 * @file reload(hot reload / auto reload)
 * @author X-Jray(z.xuanjian@gmail.com)
 */

const hotClient = require('webpack-hot-middleware/client');

hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload();
    }
});
