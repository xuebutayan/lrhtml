var path = require('path');
var process = require('process');
var webpack = require('webpack');
//常量定义


const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.join(ROOT_PATH, './src');
const DIST_PATH = path.join(ROOT_PATH, './dist');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'app': SRC_PATH + '/js/index.js',
  },
  output: {
    path: DIST_PATH,
    filename: '[name]-[hash:5].js',
    //chunkFilename:"[id].chunk.js"
  },
  module: {
    rules:[
      {
        test: /\.scss$/i,
        use:ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.css$/i,
        use:ExtractTextPlugin.extract(['css-loader'])
      },
      {
        test:/\.(gif|jpg|png)$/,
        use:[{
          loader:'url-loader',
          options:{
            limit:1024,
            name:'/images/[name].[ext]'
          }
        }]
      },
      {
        test:/\.(woff|svg|eot|ttf)\??.*$/,
        use:[{
          loader:'file-loader',
          options:{
            name:'/css/fonts/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['env']
          }
        }
      },
      {
        test:/\.html$/,
        use:['html-loader']
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    }),
    new ExtractTextPlugin('[name]-[contenthash:5].css'),
    new HtmlWebpackPlugin({
      filename:DIST_PATH+'/index.html',
      template: SRC_PATH + '/index.html'
    }),
    new HtmlWebpackPlugin({
      filename:DIST_PATH+'/texiao_index.html',
      template: SRC_PATH + '/texiao_index.html'
    }),
    new HtmlWebpackPlugin({
      filename:DIST_PATH+'/news_index.html',
      template:SRC_PATH+'/news_index.html'
    }),
    new HtmlWebpackPlugin({
      filename:DIST_PATH+'/news_list.html',
      template:SRC_PATH+'/news_list.html'
    }),
    new HtmlWebpackPlugin({
      filename:DIST_PATH+'/news_content.html',
      template:SRC_PATH+'/news_content.html'
    }),
    new UglifyJSPlugin({
      uglifyOptions:{
        ie8:false,
        ecma:8,
        output:{
          comments:false,
          beautify:false
        }
      }
    })
  ],
  devtool:'inline-source-map',
  devServer: {
    contentBase: DIST_PATH,
    //hot: true
  }
}