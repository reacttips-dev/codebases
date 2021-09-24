import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import SimpleButton from '../base/simple';
import {addToolToStack} from '../../../../data/shared/mutations';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import Circular, {BUTTON} from '../../indicators/indeterminate/circular';
import {userStacks} from '../../../../data/shared/queries';

const ADDING = 'adding';
const ADD = 'add';
const ADDED = 'added';

const Button = glamorous(SimpleButton)({
  flexGrow: 0,
  flexShrink: 0
});

const addTool = (client, serviceId, stackId, setState) => () => {
  setState(ADDING);
  client
    .mutate({
      mutation: addToolToStack,
      variables: {id: serviceId, stackId},
      refetchQueries: [{query: userStacks}]
    })
    .then(() => setState(ADDED))
    .catch(() => setState(ADDED));
};

const AddButton = ({added, serviceId, stackId}) => {
  const [state, setState] = useState(added ? ADDED : ADD);
  const client = useContext(ApolloContext);

  const disabled = state === ADDED || state === ADDING;
  return (
    <Button
      disabled={disabled}
      onClick={disabled ? null : addTool(client, serviceId, stackId, setState)}
    >
      {state === ADDED && 'Added'}
      {state === ADD && 'Add'}
      {state === ADDING && <Circular size={BUTTON} />}
    </Button>
  );
};

AddButton.propTypes = {
  added: PropTypes.bool,
  serviceId: PropTypes.any,
  stackId: PropTypes.any
};

export default AddButton;
