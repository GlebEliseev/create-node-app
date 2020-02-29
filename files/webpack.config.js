const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|)$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
      }
    ]
  },
  resolve: { extensions: ["*", ".js"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  }
};
