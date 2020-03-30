const path = require('path');

module.exports = {
  publicPath: '',
  chainWebpack: (config) => {
    if (process.env.VUE_ENV === 'el') config.target('electron-renderer');
    config.resolve.alias
      .set('~', path.join(__dirname, '/'))
      .set('@', path.join(__dirname, '/src'));
  },
  devServer: {
    port: 8888,
    proxy: process.env.VUE_ENV === 'el' ? {} : {
      '/api': {
        target: 'http://127.0.0.1:8000',
        secure: false,
        ignorePath: false,
      },
    },
  },
  productionSourceMap: false,
};
