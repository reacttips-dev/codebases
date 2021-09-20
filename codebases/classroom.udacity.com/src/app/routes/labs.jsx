import { makeIndexRoute, makeRoute } from './helpers';

import Instructions from 'components/labs/instructions';
import LabsContainer from 'components/labs/labs-container';
import LabsShow from 'components/labs/show';
import Overview from 'components/labs/overview';
import Reflection from 'components/labs/reflection';
import Workspace from 'components/labs/workspace';

export default makeRoute('lab', LabsContainer, {
  indexRoute: makeIndexRoute(LabsShow),
  childRoutes: [
    makeRoute('overview', Overview),
    makeRoute('instructions', Instructions),
    makeRoute('reflection', Reflection),
    makeRoute('workspace', Workspace),
  ],
});
