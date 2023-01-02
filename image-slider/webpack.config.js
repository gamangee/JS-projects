const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  devtool: 'source-map',
  mode: "development",
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
    watchFiles: 'index.html'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Image Slider",
      template: "index.html",
      inject: "body",
      favicon: "./favicon.ico"
    }),
    new MiniCssExtractPlugin({ filename: "style.css" }),
    new FaviconsWebpackPlugin({
        logo: './favicon.ico',
        cache: true,
      })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        // 확장자가 .jpeg인 파일을
        test: /\.jpeg$/,
        // webpack 안에 내장되어 있는 loader로 이미지를 읽겠다.
        type:'asset/inline'
      }
  ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  }
};