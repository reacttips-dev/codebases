import { connect } from 'react-redux';

/**
 * Store connected component that only renders its children if the user has a session.
 */
export const SessionRequired = ({ children, hasSession }) => (hasSession ? children : null);

export function mapStateToProps(state) {
  return {
    hasSession:  !!state.cookies['session-id']
  };
}

export default connect(mapStateToProps, {})(SessionRequired);
