import path from 'path'
import { argv } from 'yargs'
import webpack from 'webpack'
import merge from 'webpack-merge'
import CleanPlugin from 'clean-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import autoprefixer from 'autoprefixer'
import HtmlPluginRemove from 'html-webpack-plugin-remove'

let config = null;

// ----------------------------------------------------------------------
// Paths
// ----------------------------------------------------------------------
const PATHS = {
    src: path.join(__dirname, 'src'),
    style: path.join(__dirname, 'src/main.scss'),
    build: path.join(__dirname, 'build')
};

// ----------------------------------------------------------------------
// Config: Common
// ----------------------------------------------------------------------
const common = {
    // Allow importing of .jsx files without using file extension
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        app: PATHS.src,
        style: PATHS.style
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        loaders: [
            // Babel Loader
            {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory'],
                include: PATHS.src,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // Generate index.html file
        new HtmlPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'starter-react',
            appMountId: 'app',
            inject: false,
            minify: { removeComments: true, collapseWhitespace: true }
        }),
        // Remove style.[hash].js file from generated html, which is created
        // by specifiying a seperate chunk for styles
        new HtmlPluginRemove(/<script.*?src="style\..*?\.js".*?<\/script>/)
    ],
    postcss: () => [autoprefixer]
};

// ----------------------------------------------------------------------
// Config: Development
// ----------------------------------------------------------------------
if (argv.dev) {
    // Set babel environment to "dev" to enable hot module replacement
    process.env.BABEL_ENV = 'dev';

    config = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: false,
            stats: 'errors-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        module: {
            loaders: [
                // Sass Loader
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'postcss', 'sass'],
                    include: PATHS.src,
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

// ----------------------------------------------------------------------
// Config: Build / Production
// ----------------------------------------------------------------------
else if (argv.build) {
    config = merge(common, {
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[id].[chunkhash].js'
        },
        module: {
            loaders: [
                // Sass Loader
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', 'css!sass!postcss'),
                    include: PATHS.src,
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            // Clean "build" dir.
            new CleanPlugin([PATHS.build], {
                verbose: false
            }),
            // Set node environment to "production" to force react to
            // remove type checks, etc.
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            // Minify js
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            // Extract css out of "style" chunk
            new ExtractTextPlugin('[name].[chunkhash].css'),
            // Gzip all files in "build" dir.
            new CompressionPlugin()
        ]
    });
}

export default config
