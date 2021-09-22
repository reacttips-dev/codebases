import { jssPreset } from '@material-ui/core/styles';

import { create, JssOptions, Jss } from 'jss';
import rtl from 'jss-rtl';

const jss = (options?: Partial<JssOptions>): Jss =>
  create({
    ...options,
    plugins: [...jssPreset().plugins, rtl()],
  });

export default jss;
