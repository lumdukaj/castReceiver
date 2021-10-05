const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  entry: "./src/js/vpReceiver.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "vpReceiver.js",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};
