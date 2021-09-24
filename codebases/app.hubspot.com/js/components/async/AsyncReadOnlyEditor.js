'use es6';

import Loadable from 'UIComponents/decorators/Loadable';
export default Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "draft-sales-modal-bundle" */
    'SequencesUI/components/edit/cards/ReadOnlyEditor');
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  }
});