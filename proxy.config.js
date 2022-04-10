// For more proxy options and examples view => https://github.com/chimurai/http-proxy-middleware

// Our local instance of json-server
const LOCAL_BACKEND_HOST = 'http://localhost:3000';

/** Configuration
 * Please note that you need to re-run npm start inorder for changes to be applied
 */

// Default proxy config
let PROXY_CONFIG = [
    {
        context: ['/api'],
        target: LOCAL_BACKEND_HOST,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            '^/api': '/' // rewrite path
        },
        // re-write request headers, useful for CORS
        // onProxyReq(proxyReq, req, res) {
        //   proxyReq.setHeader('origin', 'https://www.foo-bar.com');
        // }
    }
];

module.exports = PROXY_CONFIG;
