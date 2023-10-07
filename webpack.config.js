const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // 访问内置的插件
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

// __webpack_public_path__ = 'https://123.com'; // eslint-disable-line

module.exports = {
  entry: {
    page1: "./src/page1/index.js",
    page2: "./src/page2/index.js",
  },
  // output: {
  //     filename: 'bundle.js',
  //     path: path.resolve(__dirname, "./build")
  // },
  // output: {
  //     filename: '[name].js',
  //     path: path.resolve(__dirname, './build/pages')
  // },
  output: {
    filename: "pages/[name]/[name].js",
    // 必须是绝对路径
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "./build"),
    assetModuleFilename: "img/[name].[hash:6][ext]",
    publicPath: "https://cdn.example.com/assets/",
    chunkFilename: "[name].chunk.js",
    // publicPath: "./",
  },
  // webpack插件打包优化
  optimization: {
    minimizer: [
      // 代码压缩插件
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    chunkIds: "natural",
    // chunkIds: "named"
    // chunckIds: "deterministic"
    splitChunks: {
      // async 异步代码
      // inital 同步导入
      // all 异步/同步导入
      // chunks: "async"
      chunks: "all",
      miniSize: 20000,
      // maxSize: 0
      // minChucks
      // cacheGroups
      default: {
        priority: -20,
        minChucks: 2,
        filename: "common_[id].js",
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      BASE_URL: "./",
    }),
    new HtmlWebpackPlugin({
      title: "lm webpack",
      template: "./src/index.html", // 自定义模板引擎
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/public",
          globOptions: {
            ignore: ["**/index.html", "**/.DS_Stroe", "**/abc.text"],
          },
        },
      ],
    }),
    new ESLintPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  // 模块怎么被解析
  // webpack能解析三种文件路径
  // 绝对路径 / 相对路径 / 模块路径
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", "jsx", "tsx"],
    alias: {
      "@": path.resolve(__dirname, "./src/pages"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配资源
        // loader: "css-loader"
        use: [
          // {
          //     loader: "css-loader"
          // }
          // 注意编写顺序
          "style-loader",
          // "css-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          // "postcss-loader"
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer"), require("postcss-preset-env")],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/, // 匹配资源
        // loader: "css-loader"
        use: [
          // {
          //     loader: "css-loader"
          // }
          // 注意编写顺序
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      //   {
      //     test: /\.(png|jpe?g|gif|svg)$/,
      //     use: [
      //       {
      //         loader: "file-loader",
      //         options: {
      //           name: "[name].[hash:6].[ext]",
      //           outputPath: "img",
      //         //   limt: 10 * 1024
      //         },
      //       },
      //     ],
      //   },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        // type: "asset/resource", // file-loader的效果
        // type: "assets/inline",
        // generator: {
        //     filename: "img/[name].[hash:6][ext]"
        // }
        type: "asset",
        generator: {
          filename: "img/[name].[hash:6][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024,
          },
        },
      },
      {
        test: /\.ttf|eot|woff?$/i,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash:6][ext]",
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          // 'eslint-loader'
        ],
        // options: {
        //   presets: ["@babel/preset-env", {
        //     target: "chrome 88"
        //   }]
        // }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          // tsc (typescript compiler)
          loader: "ts-loader",
        },
      },
    ],
  },
  // 专门为webpack-dev-server
  // devServer专门为开发过程中，开启一个本地服务
  devServer: {
    hot: true,
    // hotOnly: true, // 更新部分内容，只修改对应的块
    // host: '',
    // contentBase: "", // 给具体的目录提供一个服务
    // publicPath: "/",
    // watchContentBase: true,
    port: "8080",
    open: true,
    compress: true, // 对应的 compress-Encoding: 'gzip'
    proxy: {
      // "/api": "http://localhost:8888"
      "/why": {
        target: "http://localhost:8888",
        pathRewrite: {
          "^/why": "",
        },
        secure: false,
        changeOrigin: true,
      },
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /abc/,
          to: "index.html",
        },
      ],
    },
  },
  // historyApiFallback: {
  //     rewrites:[
  //         {
  //             from: /abc/, to: 'index.html'
  //         }
  //     ]
  // },
  // mode: "production",
  mode: "development",
  // devtool: 'eval',
  // false不生成sourcemap // none在production不生产sourcemap
  // 不生成sourcemap的值的三种情况: none、false、eval
  // inline-source-map
  devtool: "eval-source-map",
  watch: true,
  cache: true,
};
