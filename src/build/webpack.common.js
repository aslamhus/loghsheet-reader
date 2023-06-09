import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'scripts/[name].bundle.js',
    publicPath: '/straight-no-chaser/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/backend',
          globOptions: {
            ignore: [
              // '**/backend/vendor',
              '**/backend/.prod.env',
              '**/backend/.dev.env',
              // '**/admin/index.php',
            ],
          },
          to: 'backend',
        },
        { from: './src/.htaccess' },
        // { from: './resources/class-materials', to: 'class-materials' },
        // { from: './resources/images', to: 'images' },
        // { from: './resources/stylesheets', to: 'stylesheets' },
        // { from: './resources/js', to: 'js' },
      ],
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name]-my-test.css',
    //   chunkFilename: 'chunk-[id]-my-test.css',
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },

      { test: /\.m?js/, type: 'javascript/auto' },

      {
        test: /\.?js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env'], ['@babel/preset-react']],
          //   plugins: [['@babel/plugin-transform-runtime', { regenerator: true }]],
        },
      },

      {
        test: /\.(scss|css)$/,
        use: [
          // we use single style tag in order to speed up innerHTML for PDF generation
          {
            loader: 'style-loader',
            options: {
              // attributes: { id: 'id' },
              // insert: function insertAtTop(element) {
              //   var parent = document.querySelector('head');
              //   element.id = 'my-test-id';
              //   parent.append(element);
              // },
              styleTagTransform: function (css, style) {
                // Do something ...

                const cssTitle = css.substring(0, 16);
                if (cssTitle == '/**PDF-STYLES**/') {
                  style.id = 'pdf-styles';
                }
                style.innerHTML = css;
                document.head.appendChild(style);
              },
            },
          },
          // MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       plugins: () => [require('autoprefixer')],
          //     },
          //   },
          // },
          // {
          //   loader: 'sass-loader',
          // },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|mp3)/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  resolve: {
    // extensions: ['js', 'ts'],
    alias: {
      // '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, '../App/utils'),
      '@images': path.resolve(__dirname, '../../images/'),
      '@api': path.resolve(__dirname, '../App/api'),
      '@components': path.resolve(__dirname, '../App/Components'),
    },
  },
};
