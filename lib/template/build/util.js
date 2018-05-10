/**
 * @file utils
 * @author X-Jray(z.xuanjian@gmail.com)
 */

function getIP() {
    const ifaces = require('os').networkInterfaces();
    let ip = '127.0.0.1';
    for (let dev in ifaces) {
        if (ifaces.hasOwnProperty(dev)) {
            ifaces[dev].forEach(details => {
                if (ip === '127.0.0.1' && details.family === 'IPv4') {
                    ip = details.address;
                }
            });
        }
    }

    return ip;
}

module.exports = {
    getIP
};
