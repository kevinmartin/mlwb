const Express = require('express');
const webpack = require('webpack');
const config = require('../src/config');
const webpackConfig = require('./dev.config');
const compiler = webpack(webpackConfig);

const host = config.host || 'localhost';
const port = (Number(config.port) + 1) || 3001;
const serverOptions = {
	contentBase: 'http://' + host + ':' + port,
	quiet: true,
	noInfo: true,
	hot: true,
	inline: true,
	lazy: false,
	publicPath: webpackConfig.output.publicPath,
	headers: {
		'Access-Control-Allow-Origin': '*'
	},
	stats: {
		colors: true,
		errorDetails: true
	}
};

const app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, function onAppListening(err) {
	if (err) {
		console.error(err);
	} else {
		console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
	}
});
