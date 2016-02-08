import path from 'path'
import { argv } from 'yargs'
import webpack from 'webpack'
import merge from 'webpack-merge'
import CleanPlugin from 'clean-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

const common = {
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        app: PATHS.src
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.[hash].js'
    },
    module: {
        loaders: [
            { test: /.jsx?$/, loaders: ['babel?cacheDirectory'], include: PATHS.src }
        ]
    },
    plugins: [
        new HtmlPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'starter-react',
            appMountId: 'app',
            inject: false,
            minify: { removeComments: true, collapseWhitespace: true }
        })
    ],
    postcss: () => [autoprefixer]
};

let config = null;

// Dev
if (argv.dev) {
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
                { test: /.css$/, loaders: ['style', 'css', 'postcss', 'sass'], include: PATHS.src }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

// Build
else if (argv.build) {
    config = merge(common, {
        module: {
            loaders: [
                {
                    test: /.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css', 'postcss', 'sass'),
                    include: PATHS.src
                }
            ]
        },
        plugins: [
            new CleanPlugin([PATHS.build], {
                verbose: false
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new ExtractTextPlugin('[name].[hash].css')
        ]
    });
}

export default config
