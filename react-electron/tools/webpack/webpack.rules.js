const inDev = process.env.NODE_ENV === 'development';

module.exports = [
  {
    // Add support for native node modules
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    // Webpack asset relocator loader
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    // Typescript loader
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    // Images Loader
    test: /\.(gif|jpe?g|tiff|png|webp|bmp)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          publicPath: 'images',
          outputPath: inDev ? 'images' : './main_window/images',
        },
      },
    ],
  },
];
