const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

// see this link for more info on what all of this means
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
module.exports = {
	// when adding "js" extension to asset types
	// and then enabling debug mode, it may cause a weird error:
	//
	// [0] npm run start-prod exited with code 1
	// Sending SIGTERM to other processes..
	//
	// debug: true,
	// webpack_assets_file_path: 'build/webpack-assets.json',
	// webpack_stats_file_path: 'build/webpack-stats.json',

	patch_require: true,

	assets: {
		images: {
			extensions: [
				'jpeg',
				'jpg',
				'png',
				'gif'
			],
			parser: WebpackIsomorphicToolsPlugin.url_loader_parser
		},
		fonts: {
			extensions: [
				'woff',
				'woff2',
				'ttf',
				'eot'
			],
			parser: WebpackIsomorphicToolsPlugin.url_loader_parser
		},
		svg: {
			extension: 'svg',
			parser: WebpackIsomorphicToolsPlugin.url_loader_parser
		},

		// this whole "bootstrap" asset type is only used once in development mode.
		// the only place it's used is the Html.js file
		// where a <style/> tag is created with the contents of the
		// './node_modules/bootstrap-loader/no-op.js' file.
		// (the aforementioned <style/> tag can reduce the white flash
		//  when refreshing page in development mode)
		//
		// hooking into 'js' extension require()s isn't the best solution
		// and I'm leaving this comment here in case anyone finds a better idea.
		bootstrap: {
			extension: 'js',
			include: ['./node_modules/bootstrap-loader/no-op.js'],
			filter: (module, regex, options, log) => {
				if (!options.development) {
					return null;
				} else if (module.name.indexOf('./~/bootstrap-loader/no-op.js') === -1) {
					return null;
				}

				return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
			},
			// in development mode there's webpack "style-loader",
			// so the module.name is not equal to module.name
			path: WebpackIsomorphicToolsPlugin.style_loader_path_extractor,
			parser: WebpackIsomorphicToolsPlugin.css_loader_parser
		},
		style_modules: {
			extension: 'scss',
			filter: (module, regex, options, log) => {
				if (options.development) {
					// in development mode there's webpack "style-loader",
					// so the module.name is not equal to module.name
					return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
				}

				// in production mode there's no webpack "style-loader",
				// so the module.name will be equal to the asset path
				return regex.test(module.name);
			},
			path: (module, options, log) => {
				if (options.development) {
					// in development mode there's webpack "style-loader",
					// so the module.name is not equal to module.name
					return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
				}

				// in production mode there's no webpack "style-loader",
				// so the module.name will be equal to the asset path
				return module.name;
			},
			parser: (module, options, log) => {
				if (options.development) {
					return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
				}

				// in production mode there's Extract Text Loader which extracts CSS text away
				return module.source;
			}
		}
	}
};
