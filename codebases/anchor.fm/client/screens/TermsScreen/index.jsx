import React from 'react';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { DMCA } from './components/DMCA';
import { Footer } from '../../components/Footer';

function getPageContent(pathname) {
  switch (pathname) {
    case '/privacy':
      return <PrivacyPolicy pathname={pathname} />;
    case '/dmca':
      return <DMCA pathname={pathname} />;
    case '/tos':
    default:
      return <TermsOfService pathname={pathname} />;
  }
}

export function TermsScreen({ location: { pathname } }) {
  return (
    <React.Fragment>
      {getPageContent(pathname)}
      <Footer />
    </React.Fragment>
  );
}
