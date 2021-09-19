import React, { useEffect } from 'react';
import template from 'lodash.template';

import LandingSlot from 'containers/LandingSlot';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/search/noSearchResults.scss';

const NoSearchResults = ({ fetchLandingPageInfo, filters: { originalTerm }, landingPage: { isLoaded, pageInfo: { slotData } = {}, slotOrder }, isVip }) => {
  const { testId, marketplace } = useMartyContext();

  useEffect(() => {
    fetchLandingPageInfo('no-search-results');
  }, [fetchLandingPageInfo]);

  const makeDynamicBelowTheFoldContent = () => {
    const {
      phoneNumber,
      phoneNumberVip,
      error: {
        contactVerbiage
      } = {}
    } = marketplace;
    const number = isVip ? phoneNumberVip : phoneNumber;
    const contactMessage = contactVerbiage && template(contactVerbiage)({ phoneNumber: number });
    return (
      <>
        {slotOrder.map(slotName => (
          <LandingSlot
            key={slotName}
            slotName={slotName}
            data={slotData[slotName]}
            onComponentClick={f => f}/>
        ))}

        {contactMessage &&
        <p
          className={css.contact}
          data-test-id={testId('contactUs')}
          dangerouslySetInnerHTML={{ __html: contactMessage }}/>
        }
      </>);
  };

  return (
    <div className={css.container} data-test-id={testId('noSearchResults')}>
      <div className={css.noResults}>
        <h1 data-test-id={testId('noResultsHeader')}>No Results Found</h1>
        <p data-test-id={testId('noResultsMessage')}>{originalTerm && `We couldn't find any results for ${originalTerm}.`} Try a different search or browse the categories below:</p>
      </div>

      { isLoaded && makeDynamicBelowTheFoldContent()}
    </div>
  );
};

export default NoSearchResults;
