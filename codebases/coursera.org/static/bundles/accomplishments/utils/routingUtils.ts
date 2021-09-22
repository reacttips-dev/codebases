import config from 'js/app/config';
import path from 'js/lib/path';
import URI from 'jsuri';
import { S12nProductVariant } from 'bundles/accomplishments/types';

const courseCertUrl = '/account/accomplishments';
const professionalCertUrl = '/account/accomplishments/professional-cert';
const specializationUrl = '/account/accomplishments/specialization';

export function getCertificateSharingLink(isSpecialization: boolean, verifyCode: string): string {
  if (isSpecialization) {
    return path.join(config.url.base, specializationUrl, 'certificate', verifyCode);
  } else {
    return path.join(config.url.base, courseCertUrl, 'certificate', verifyCode);
  }
}

export function getCourseCertificateRecordsLink(verifyCode: string): string {
  return path.join(config.url.base, courseCertUrl, 'records', verifyCode);
}

export function getCourseCertificateVerifyLink(verifyCode: string): string {
  return path.join(config.url.base, courseCertUrl, 'verify', verifyCode);
}

export function getSpecializationCertificateRecordsLink(
  productVariant: S12nProductVariant,
  verifyCode: string
): string {
  const isProfessionalCert = productVariant === S12nProductVariant.ProfessionalCertificateS12n;
  return isProfessionalCert
    ? path.join(config.url.base, professionalCertUrl, verifyCode)
    : path.join(config.url.base, specializationUrl, verifyCode);
}

export function getCertificateDownloadLink(
  userId: string,
  isSpecialization: boolean,
  verifyCode: string,
  isSpark: boolean
): string {
  if (isSpark) {
    if (isSpecialization) {
      const uri = path.join(
        config.url.base,
        '/api/legacyCertificates.v1/spark/s12nCertificate',
        verifyCode + '~' + userId,
        'pdf'
      );
      return new URI(uri).toString();
    } else {
      return path.join(config.url.base, `/api/legacyCertificates.v1/spark/verifiedCertificate/${verifyCode}/pdf`);
    }
  } else {
    return path.join(config.url.base, 'api/certificate.v1/pdf', verifyCode);
  }
}

export function getCourseLink(courseSlug: string) {
  return path.join(config.url.base, '/', 'learn', courseSlug);
}

export function getSpecializationLink(s12nSlug: string) {
  return path.join(config.url.base, '/', 'specializations', s12nSlug);
}

export default {
  getCertificateSharingLink,
  getCourseCertificateRecordsLink,
  getCourseCertificateVerifyLink,
  getSpecializationCertificateRecordsLink,
  getCertificateDownloadLink,
  getCourseLink,
  getSpecializationLink,
};
