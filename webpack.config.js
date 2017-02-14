const pkg = require('./package.json')
const path = require('path')
const git = require('git-rev-sync')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const HtmlPluginRemove = require('html-webpack-plugin-remove')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

let config = null;

// ----------------------------------------------------------------------
// Paths
// ----------------------------------------------------------------------
const PATHS = {
    src: path.join(__dirname, 'src'),
    style: path.join(__dirname, 'src/index.scss'),
    build: path.join(__dirname, 'build')
};

// ----------------------------------------------------------------------
// Config: Common
// ----------------------------------------------------------------------
const common = {
    // Allow importing of .jsx files without using file extension
    resolve: {
        extensions: ['.js', '.jsx']
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
        rules: [
            // Babel Loader
            {
                test: /\.jsx?$/,
                loader: 'babel-loader?cacheDirectory',
                include: PATHS.src,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // Generate index.html file
        new HtmlPlugin({
            template: path.join(PATHS.src, 'index.html'),
            minify: { removeComments: true, collapseWhitespace: true }
        }),
        // Remove style.[hash].js file from generated html, which is created
        // by specifiying a seperate chunk for styles
        new HtmlPluginRemove(/<script type="text\/javascript" src="style\..*?\.js".*?<\/script>/)
    ]
};

// ----------------------------------------------------------------------
// Config: Development
// ----------------------------------------------------------------------
if (isDevelopment) {
    // Set babel environment to "dev" to enable hot module replacement
    process.env.BABEL_ENV = 'dev';

    config = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            stats: 'errors-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        module: {
            rules: [
                // Sass Loader
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
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
else if (isProduction) {
    config = merge(common, {
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[id].[chunkhash].js'
        },
        module: {
            rules: [
                // Sass Loader
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: ['css-loader', 'postcss-loader', 'sass-loader']
                    }),
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
            // Minify js
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            // Extract css out of "style" chunk
            new ExtractTextPlugin({
                filename: '[name].[chunkhash].css',
                allChunks: true
            }),
            // Gzip all files in "build" dir.
            new CompressionPlugin(),
            // Zip all emitted files
            new ZipPlugin({
                filename: `${pkg.name}-${git.short()}.zip`,
                exclude: [
                    /.*\.map.*/,
                    /style\..+js.*/
                ]
            })
        ]
    });
}

module.exports = config
