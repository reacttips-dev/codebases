// Meta component to not use react-router links when HF is remote
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { ABSOLUTE_URL_RE } from 'common/regex';

const checkIfExternalAbsoluteUrl = (to, origin) => {
  if (to) {
    const url = to.match(ABSOLUTE_URL_RE);
    return url && url?.[1] !== origin;
  }
};

export const HFLink = ({ isRemote, origin, to, children, forwardRef, ...otherProps }) => {
  if (isRemote || checkIfExternalAbsoluteUrl(to, origin)) {
    const { innerRef } = otherProps;
    delete otherProps.innerRef; // innerRef is only valid on react-router links, so make sure we delete it and just pass to the regular `ref` field
    return <a href={to || null} ref={forwardRef || innerRef} {...otherProps}>{children}</a>;
  }
  return <Link to={to} ref={forwardRef} {...otherProps}>{children}</Link>;
};

function mapStateToProps(state) {
  return {
    isRemote: state.headerFooter.isRemote,
    origin: state.url.host
  };
}

const ConnectedHFLink = connect(mapStateToProps, {})(HFLink);
export default withErrorBoundary('HFLink', ConnectedHFLink);
