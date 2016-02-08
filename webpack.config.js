const webpack = require('webpack'),
        merge = require('webpack-merge'),
         argv = require('yargs').argv,
         path = require('path');

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
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /.css$/, loaders: ['style', 'css'], include: PATHS.src },
            { test: /.jsx?$/, loaders: ['babel?cacheDirectory'], include: PATHS.src }
        ]
    }
};

// Dev
if (argv.dev) {
    process.env.BABEL_ENV = 'dev';

    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.build,
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: false,
            stats: 'errors-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

// Build
else {
    module.exports = merge(common, {

    });
}
