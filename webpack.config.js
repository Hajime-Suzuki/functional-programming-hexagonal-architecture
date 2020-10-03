/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const slsw = require('serverless-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.json', '.ts'],
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@resources': path.resolve(__dirname, './src/driven-adapters'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  externals: [nodeExternals()],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { transpileOnly: true, configFile: 'tsconfig.json' },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: true,
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,tsx}',
      },
    }),
  ],
}
