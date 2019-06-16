const webpack = require('webpack');
<<<<<<< HEAD
const myEnv = require('dotenv').config();
=======
>>>>>>> e2a7fca227fda25372cdabf99a5da9800a406a1d
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build'
  },
  devServer: {
    publicPath: '/build',
    proxy: {
      '/api': 'http://localhost:3000'
    },
    hot: true
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [
<<<<<<< HEAD
    new webpack.DefinePlugin({
      GAPI_KEY: JSON.stringify(myEnv.parsed.GAPI_KEY),
    }),
=======
>>>>>>> e2a7fca227fda25372cdabf99a5da9800a406a1d
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'styles.css',
      chunkFilename: 'styleId.css'
    })
  ]
};
