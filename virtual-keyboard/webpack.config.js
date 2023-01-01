const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
    // 변환하고자 하는 최초 파일
  entry: "./src/js/index.js",
  // 변환해서 나오는 결과 파일
  output: {
    // 웹팩으로 빌드했을 때의 파일 이름
    filename: "bundle.js",
    // 파일 절대 경로 
    path: path.resolve(__dirname, "./dist"),
    // 번들될 파일에 이미 다른 파일이 있다면 삭제하고 새로 만들기
    clean: true,
  },
  // 빌드한 파일과 원본 파일을 연결 시켜준다.
  devtool: 'source-map',
  // 코드 난독화 여부에 따라 production | development 
  mode: "development",
  devServer: {
    host: "localhost",
    port: 8080,
    // 새창 열기
    open: true,
    // html 변화가 있을 때마다 reload를 해줘라.
    watchFiles: 'index.html',
  },
  plugins: [
    // HTML 파일 생성 단순화
    new HtmlWebpackPlugin({
      title: "keyboard",
      template: "./index.html",
      // JS가 body에 inject된다.
      inject: "body",
    }),
    // CSS 파일을 별도 파일로 추출
    new MiniCssExtractPlugin({ filename: "style.css" }),
    new FaviconsWebpackPlugin({
      logo: './favicon.ico',
      cache: true,
    })
  ],
  module: {
    rules: [
      {
        // 확장자가 .css인 파일은 모두 읽겠다.
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      }
    ],
  },
  optimization: {
    minimizer: [
      // JS 압축
      new TerserPlugin(),
    // CSS 압축
      new CssMinimizerPlugin()
    ]
  },
};