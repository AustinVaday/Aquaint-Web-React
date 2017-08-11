const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
    entry: './client/index.js',
    output: {
	path: path.resolve(__dirname, 'dist'),
	// below line only works for webpack 1.0
	// path: './dist', 
	filename: 'index_bundle.js'
    },
    module: {
	loaders: [
	    { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
	    { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
	]
    },
    devServer: {
	host: 'localhost',
	port: 8080,
	disableHostCheck: false,
	// client-side dynamic routing by react-router
	// 404s will fallback to /index.html
	historyApiFallback: true,
    },
    plugins: [HtmlWebpackPluginConfig]
}
