    loaders: [
    {
      test: /\.scss$/i,
      loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
    },
    {
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract(['css-loader'])
    },
    /*{
      test: /\.(png|jpg)$/,
      loader: 'file-loader',
      options:{
        name:'[path][name].[ext]',
        outputPath:'images'
      }
    },*/
    {
      test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
      loader:'url-loader?limit=1024&name=[name].[ext]'

    },
    {
      test: /\.(jsx|js)$/,
      //include: constants.APP_PATH,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query:{
        presets:['env']
      }
    },
    {
      test:/\.html$/,
      loader:'html-loader'
    }
    ],