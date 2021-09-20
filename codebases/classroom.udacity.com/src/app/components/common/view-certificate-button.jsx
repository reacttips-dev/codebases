import { Button } from '@udacity/veritas-components';
import { __ } from 'services/localization-service';

const getCertificateUrl = (key) => {
  return `${CONFIG.graduationUrl}/${key}`;
};

const ViewCertificateButton = ({ programKey }) => {
  return (
    <Button
      target="_blank"
      href={getCertificateUrl(programKey)}
      label={__('View Certificate')}
      variant="secondary"
    />
  );
};

export default ViewCertificateButton;
