import React, {useState, useContext} from 'react';
import {RouteContext} from '../../../shared/enhancers/router-enhancer';
import {Query} from 'react-apollo';
import {company} from '../../../data/private-payment/queries';
import {PLANS} from './../constants';
import Demo from '../../../shared/library/icons/demo-icon.svg';

export const PrivatePaymentContext = React.createContext({});

export const plans = [
  {
    priority: 0,
    name: 'FREE',
    description: 'Free plan description',
    price: '$0',
    seats: '',
    features: [
      'Sync up to 10 repos',
      'Stack Alerts (Stack Changes)',
      'Automated Stack Decision creation',
      'Reporting dashboard',
      'Private Search'
    ],
    seatOptions: [],
    isActive: true,
    isFeatured: false,
    isPerMonth: false,
    slug: PLANS.FREE
  },
  {
    priority: 1,
    name: 'STARTUP',
    description: 'Startup plan description',
    price: '$3',
    seats: 'per seat per month',
    features: [
      'Sync up to 50 repos',
      'Stack Alerts (Stack Changes)',
      'Automated Stack Decision creation',
      'Reporting dashboard',
      'Private Search',
      '9-5 support with 24-hour first response time on business days',
      'Stack Applications',
      'Stack Tags'
    ],
    seatOptions: [],
    isActive: false,
    isFeatured: false,
    isPerMonth: false,
    slug: PLANS.STARTUP
  },
  {
    priority: 2,
    name: 'ENTERPRISE',
    description: 'Enterprise plan description',
    icon: Demo,
    seats: '',
    features: [
      'Sync unlimited repos',
      'Stack Alerts (Stack Changes)',
      'Automated Stack Decision creation',
      'Reporting dashboard',
      'Private Search',
      '24-hour support with four-hour first response time on business days',
      'Stack Applications',
      'Stack Tags',
      'Active Directory/Okta Single Sign-On (SSO)',
      'Tool Adoption Stages',
      '99% guaranteed uptime SLA',
      'Stack Watching'
    ],
    seatOptions: [
      // {
      //   title: 'Up to 20 seats',
      //   pricing: '$199/mo'
      // },
      // {
      //   title: 'Up to 50 seats',
      //   pricing: '$399/mo'
      // },
      // {
      //   title: 'Up to 100 seats',
      //   pricing: '$599/mo'
      // },
      // {
      //   title: 'Up to 250 seats',
      //   pricing: '$1249/mo'
      // },
      // {
      //   title: 'Up to 500 seats',
      //   pricing: '$1999/mo'
      // },
      // {
      //   title: 'Up to 1000 seats',
      //   pricing: '$2999/mo'
      // },
      // {
      //   title: 'More than 50 seats',
      //   pricing: (
      //     <a href="mailto:private@stackshare.io" title="Contact Us">
      //       Contact Us
      //     </a>
      //   )
      // }
    ],
    isActive: false,
    isFeatured: true,
    isPerMonth: false,
    slug: PLANS.ENTERPRISE
  }
];
// If you query the plans instead of keeping them static
// Please make the same change in private landing page too

// eslint-disable-next-line react/prop-types
const withPrivatePayment = Component => ({...restProps}) => {
  const {slug, signin} = useContext(RouteContext);
  const [currentPlan, setCurrentPlan] = useState(null);

  const context = {
    plans,
    currentPlan,
    setCurrentPlan
  };

  return (
    <Query query={company} variables={{id: slug}}>
      {({data: {company}, loading}) => {
        return (
          <PrivatePaymentContext.Provider value={{...context}}>
            <Component
              {...restProps}
              company={company}
              loading={loading}
              signin={signin}
              analyticsPayload={{name: slug}}
            />
          </PrivatePaymentContext.Provider>
        );
      }}
    </Query>
  );
};

export default withPrivatePayment;
