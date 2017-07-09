var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: process.env.ENV == 'production' ? 'source-map' : 'eval',
  entry: [
    './app/src/root.js'
  ],
  output: { path: process.env['APP_PATH'], filename: './app/dist/bundle.js' },
  plugins: process.env.ENV == 'production' ? [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ] : [
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [{
      test: /.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    },
    {
      test: /.less$/,
      loader: "style!css!less"
    }
    ]
  }
};
	