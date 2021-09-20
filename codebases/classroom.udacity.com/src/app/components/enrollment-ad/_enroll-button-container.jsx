import EnrollButton from './_enroll-button';
import PropTypes from 'prop-types';
import React from 'react';
import useGetNanodegreeCatalog from 'hooks/use-get-nanodegree-catalog';

export const EnrollButtonContainer = ({ ndKey, ...props }) => {
  const nanodegree = useGetNanodegreeCatalog(ndKey);
  return <EnrollButton nanodegree={nanodegree} {...props} />;
};

EnrollButtonContainer.displayName =
  'components/enrollment-ad/_enroll-button-container';
EnrollButtonContainer.propTypes = {
  ndKey: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default EnrollButtonContainer;
