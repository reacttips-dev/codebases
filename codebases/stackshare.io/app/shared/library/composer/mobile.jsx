import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import MobilePortal from '../modals/base/portal-mobile';
import MobileModal from '../modals/base/modal-mobile';
import Composer from './index';
import ComposerProvider, {DispatchContext, StateContext} from './state/provider';
import * as COMPOSER_ACTIONS from './state/actions';

// This context is used to provide an "overrides" callback function to child components
// that may need to open the mobile composer with certain prop overrides.
// If a provider for this context is inserted into the render tree it should provide a value in the shape:
//     (overrides) => { ... }
// This function can be used to set local state and render the composer with any necessary props coming from
// the `overrides` argument.
export const MobileComposerContext = React.createContext(null);

const LogicWrapper = ({children}) => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!state.selectedStructure) {
      dispatch({type: COMPOSER_ACTIONS.COMPOSER_ACTIVATE});
    }
  }, []);

  return children;
};

const MobileComposer = ({onDismiss, onSubmit, onMutationUpdate, post = null}) => {
  return (
    <MobilePortal>
      <MobileModal title="Composer" onDismiss={onDismiss} onDismissLabel="Cancel">
        <ComposerProvider post={post} debug>
          <LogicWrapper>
            <Composer
              analyticsPayload={{}}
              onMutationUpdate={onMutationUpdate}
              onSubmit={onSubmit}
            />
          </LogicWrapper>
        </ComposerProvider>
      </MobileModal>
    </MobilePortal>
  );
};

MobileComposer.propTypes = {
  onDismiss: PropTypes.func,
  onSubmit: PropTypes.func,
  onMutationUpdate: PropTypes.func,
  post: PropTypes.object
};

export default MobileComposer;
