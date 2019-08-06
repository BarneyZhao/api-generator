module.exports = {
  publicPath: '',
  chainWebpack: (config) => {
    config.target('electron-renderer');
  },
  devServer: {
    port: 8888,
  },
  productionSourceMap: false,
};
