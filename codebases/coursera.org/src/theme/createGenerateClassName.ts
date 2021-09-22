import { createGenerateClassName } from '@material-ui/core/styles';

import { GenerateId } from 'jss';

export default (): GenerateId =>
  createGenerateClassName({
    disableGlobal: true,
    productionPrefix: 'cds-',
  });
