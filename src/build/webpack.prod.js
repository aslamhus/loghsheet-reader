import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default merge(common, {
  mode: 'production',
});
