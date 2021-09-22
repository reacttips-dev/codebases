// Render-props component that store updated responses for CA form parts in Apollo store
// and provides function to update them.
// It requires two parameters:
// * id: unique id of form part.
// * response: object representing value of the form part. Might be any shape depending on the
//   form part type.
// Calls child function with the object with following fields:
// * newResponse: original response if it is not changed or updated response stored in Apollo
//   store.
// * handleChangeResponse: function that could be used to store updated response. The parameter
//   of this function should be the same structure than the original response.
// Example:
// <ChangedResponse id="formId" response={{ answer: 'Original Value' }}>
//   {({ newResponse, handleChangeResponse }) => (
//     <input
//       value={newResponse.answer}
//       onChange={e => handleChangeResponse({ answer: e.target.value })}
//     />
//   )}
// </ChangedResponse>
// Real world example: static/bundles/compound-assessments/components/tunnelvision/FormPart.jsx
// It will save updated responses in Apollo store with the following cache key:
// `ChangedResponse:[id]`
// You can get updated response anywhere with `ChangedResponse` component. Or you can use the
// following query:
// query ChangedResponseQuery($id: String!) {
//   ChangedResponse @client {
//     get(id: $id) @client {
//       id
//       response
//     }
//   }
// }
// In order to use this query you need to cover it with CA LocalStateConsumer:
// static/bundles/compound-assessments/components/local-state/LocalStateConsumer.jsx

import React from 'react';

import { Query } from 'react-apollo';
import { isEqual } from 'lodash';

import LocalStateConsumer from '../LocalStateConsumer';
import { updateChangedResponse } from './resolvers';
import { changedResponseQuery } from './queries';
import {
  ChangedResponseQueryResponse,
  ChangedResponseQueryVariables,
  ChangedResponseQueryRenderProps,
  Response,
} from './types';

import formChangedResponseId from './utils/formChangedResponseId';

type RenderProps = {
  newResponse: Response;
  handleChangeResponse: (x0: Response) => void;
};

type InputProps = {
  id: string;
  localScopeId?: string | null;
  response: Response;
  children: (x0: RenderProps) => JSX.Element;
};

type Props = InputProps & Pick<ChangedResponseQueryRenderProps, 'data' | 'client' | 'loading'>;

class InnerChangedResponse extends React.Component<Props> {
  componentDidMount() {
    this.setCacheInitialValue();
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.response, this.props.response)) {
      this.setCacheInitialValue();
    }
  }

  handleChangeResponse = (changedResponse: Response) => {
    const { id, client } = this.props;

    // Directly write data and don't use Mutation with resolvers because we
    // need data to be changed syncronously to avoid jumping cursor in form fields.
    // The correct write with Mutation component and resolver makes data updates
    // async and it makes cursor jump when you type text in form field.
    return updateChangedResponse(id, changedResponse, client);
  };

  setCacheInitialValue() {
    const { response, data } = this.props;
    const localResponse = data?.ChangedResponse?.get?.response;
    if (!localResponse) {
      this.handleChangeResponse(response);
    }
  }

  render() {
    const { response, children, data, loading } = this.props;
    const localResponse = loading ? undefined : data?.ChangedResponse?.get?.response;

    const newResponse = localResponse || response;

    return children({ newResponse, handleChangeResponse: this.handleChangeResponse });
  }
}

const ChangedResponse = ({ id: responseId, localScopeId, response, children }: InputProps) => {
  const id = formChangedResponseId(responseId, localScopeId);

  return (
    <LocalStateConsumer>
      <Query<ChangedResponseQueryResponse, ChangedResponseQueryVariables>
        query={changedResponseQuery}
        variables={{ id }}
      >
        {({ data, client, loading }: ChangedResponseQueryRenderProps) => (
          // `loading` is only ever true if there is no value in the local cache
          <InnerChangedResponse response={response} data={data} client={client} loading={loading} id={id}>
            {children}
          </InnerChangedResponse>
        )}
      </Query>
    </LocalStateConsumer>
  );
};

export default ChangedResponse;
