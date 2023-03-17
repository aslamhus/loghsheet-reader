import path from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';

export default merge(common, {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    chunkFilename: '[id][hash].js',
  },
  output: {
    hotUpdateChunkFilename: 'hmr/[id].[fullhash].hot-update.js',
    hotUpdateMainFilename: 'hmr/[runtime].[fullhash].hot-update.json',
  },
  devtool: 'eval-source-map',
  devServer: {
    devMiddleware: {
      // publicPath: 'auto',

      publicPath: 'auto',
      serverSideRender: false,
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    open: ['/index.html'],
    compress: true,
    hot: true,

    host: 'local.aslamhusain',
    port: 9000,
  },
  plugins: [
    new BrowserSyncPlugin(
      {
        proxy: 'http://local.aslamhusain:8888/logsheet-reader/',
        port: 3003,
        startPath: './index.html',
        files: [
          {
            match: ['**/*.php'],
            fn: async function (event, file) {
              if (event === 'change') {
                console.log('********', file);
                const bs = await import('browser-sync');
                bs.get('bs-webpack-plugin');
                console.log('browser sync reload');

                // only reload files that match .php extension
                // bs.reload('*.php');
              }
            },
          },
        ],
      },
      {
        reload: false,
      }
    ),
  ],
});
