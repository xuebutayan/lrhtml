var path = require('path');
//常量定义


const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.join(ROOT_PATH,'./src');
const DIST_PATH = path.join(ROOT_PATH,'./dist');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    'app': SRC_PATH + '/index.js'
  },
  output: {
    path: DIST_PATH,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.scss$/i,
      loader: ExtractTextPlugin.extract(['css-loader?minimize', 'sass-loader'])
    },
    {
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract(['css-loader'])
    },
    {
      test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
      loader:'url-loader?limit=1024&name=[path][name].[ext]'
    },
    {
      test:/\.html$/,
      loader:'raw-loader'
    }
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[contenthash:5].css'),
    new HtmlWebpackPlugin({
      filename:DIST_PATH+'/index.html',
      template: SRC_PATH + '/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false,
      except: ['$super', '$', 'exports', 'require']
    })
  ]
}