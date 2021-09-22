import _ from 'lodash';
import _t from 'i18n!nls/page';
import user from 'js/lib/user';
import { graphql } from 'react-apollo';
import { compose, withProps, branch, renderComponent } from 'recompose';

import epic from 'bundles/epic/client';
import inServerContext from 'bundles/ssr/util/inServerContext';

import { getRootDomain, getDegreeDomain, getCertificateDomain } from 'bundles/browse/components/PageHeader/constants';
import { injectSubdomainsToDomains } from 'bundles/browse/utils';

import { programAndDegreeMembershipQuery, graphqlProgramOptions } from 'bundles/page/common/queries';
import {
  ProgramCurriculumDomainsQuery,
  EnterpriseProgramsQuery,
} from 'bundles/program-home/utils/ProgramHomeGraphqlQueries';
import { DomainGetAllQuery } from 'bundles/browse/components/Queries';

import { REFER_A_FRIEND_PAGE_URL } from 'bundles/referral/constants';
import { enableNavInCourseHomeCtas } from 'bundles/referral/utils/utils';

import ErrorMessage from 'bundles/coursera-ui/components/extended/ErrorMessage';

export const isAuthoringPathname = (pathname: $TSFixMe) => {
  return (
    pathname &&
    // 2020-Feb-14: A valid path to the admin app is also `/admin`.
    (pathname === '/admin' ||
      pathname === '/admin-v2' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/admin-v2') ||
      pathname.startsWith('/groups/') ||
      pathname.startsWith('/teach/') ||
      pathname.startsWith('/teach-partner/') ||
      pathname.startsWith('/teach-program/') ||
      pathname.startsWith('/teach-specialization'))
  );
};

export const isAdminPathname = (pathname: $TSFixMe) => {
  return (
    pathname &&
    // 2020-Feb-14: A valid path to the admin app is also `/admin`.
    (pathname === '/admin' ||
      pathname === '/admin-v2' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/admin-v2'))
  );
};

export const getAccountDropdownOptions = ({ thirdPartyOrganizations, isStaff }: $TSFixMe) => {
  const locale = _t.getLocale();
  const navButtons = [];
  if (isStaff) {
    navButtons.push({
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      href: '/admin/',
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      label: _t('Educator Admin'),
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: 'admin',
    });
  }

  const shouldHideLearnerHelpLink = () => {
    if (thirdPartyOrganizations && thirdPartyOrganizations.length === 1) {
      const thirdPartyOrganizationId = thirdPartyOrganizations[0].id;
      return (epic.get('Enterprise', 'hideLearnerHelpLink') || []).includes(thirdPartyOrganizationId);
    }
    return false;
  };

  if (!_.isEmpty(thirdPartyOrganizations)) {
    thirdPartyOrganizations.forEach(({ name, slug }: $TSFixMe) => {
      navButtons.push({
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
        href: `/o/${slug}/admin`,
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
        label: `${name} ${_t('Admin')}`,
        // @ts-ignore ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
        name: slug,
      });
    });
  }
  navButtons.push({
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    href: `/user/${user.get().external_id}`,
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    label: _t('Profile'),
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    name: 'profile',
  });
  navButtons.push({
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    href: '/my-purchases',
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    label: _t('My Purchases'),
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    name: 'my-purchases',
  });
  if (enableNavInCourseHomeCtas() === true) {
    navButtons.push({
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      href: REFER_A_FRIEND_PAGE_URL,
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: 'referFriend',
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      label: _t('Get 50% Off'),
    });
  }
  navButtons.push({
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    href: '/account-settings',
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    label: _t('Settings'),
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    name: 'account-settings',
  });
  navButtons.push({
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    href: '/updates',
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    label: _t('Updates'),
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    name: 'updates',
  });
  navButtons.push({
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    href: '/accomplishments',
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    label: _t('Accomplishments'),
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    name: 'accomplishments',
  });
  if (isStaff) {
    navButtons.push({
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      href: `https://partner.coursera.help/hc/${locale}`,
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      label: _t('Educator Resource Center'),
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: 'partner-resource-center',
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      htmlAttributes: { target: '_blank' },
    });
    navButtons.push({
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      href: `https://learner.coursera.help/hc/${locale}`,
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      label: _t('Learner Help Center'),
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: 'learner-help-center',
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      htmlAttributes: { target: '_blank' },
    });
  } else if (!shouldHideLearnerHelpLink()) {
    navButtons.push({
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      href: `https://learner.coursera.help/hc/${locale}`,
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      label: _t('Help Center'),
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      name: 'learner-help-center',
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
      htmlAttributes: { target: '_blank' },
    });
  }

  return navButtons;
};

export const withDomainsGraphql = graphql(DomainGetAllQuery, {
  // `shouldSkipOptionalExternalDataFetch` is a PageHeader prop passed in by critical pages like payments
  // that want to avoid unncessary calls to prevent slow loading / SSR errors from graphql timeouts
  //
  // `shouldRenderEnterpriseProgramsAndProgramCurriculumDomains` is a prop passed in by the Enterprise version of this
  // HOC to suppress this one without using `branch(..)`, which causes tree thrashing.
  skip: (props: $TSFixMe) =>
    props.shouldRenderEnterpriseProgramsAndProgramCurriculumDomains === true ||
    !!props.currentProgram ||
    props.shouldSkipOptionalExternalDataFetch,
  options: {
    fetchPolicy: 'cache-first',
  },
  props: ({ data: { DomainsV1Resource } }: $TSFixMe) => {
    const domains = (DomainsV1Resource && DomainsV1Resource.domains && DomainsV1Resource.domains.elements) || [];
    return { domains };
  },
});

export const withOldMegaMenuSectionData = withProps((props: $TSFixMe) => {
  let { domains } = props;

  // adding Degrees and Certificates sections
  domains = domains?.concat([
    {
      id: getRootDomain().id,
      name: getRootDomain().name,
    },
    {
      id: getDegreeDomain().id,
      name: getDegreeDomain().name,
    },
    {
      id: getCertificateDomain().id,
      name: getCertificateDomain().name,
    },
  ]);
  return {
    domains: domains?.filter((x: $TSFixMe) => !!x),
  };
});

export const withError = branch((props: $TSFixMe) => props.error, renderComponent(ErrorMessage));

export const withProgramCurriculumDomainsGraphql = graphql(ProgramCurriculumDomainsQuery, {
  skip: (props: $TSFixMe) => !props.currentProgram || !props.programId,
  props: ({
    data: { ProgramCurriculumDomainsV1Resource: DomainsV1, SubdomainsV1Resource: SubdomainsV1, error },
  }: $TSFixMe) => {
    if (error) {
      return { error: true };
    }
    const domains = (DomainsV1 && DomainsV1.get && DomainsV1.get.domains) || [];
    const subdomains = (SubdomainsV1 && SubdomainsV1.getAll && SubdomainsV1.getAll.elements) || [];
    // due to the complexity in the BE implementations, it is easier to getAll, filter, and inject the subdomains in FE
    return { domains: injectSubdomainsToDomains(domains, subdomains) };
  },
});

export const withEnterpriseProgramsAndProgramCurriculumDomains = compose(
  withProps((props: $TSFixMe) => ({ programId: props.switcherSelections?.programId ?? props.programId ?? undefined })),
  graphql(EnterpriseProgramsQuery, {
    skip: (props: $TSFixMe) => !!props.currentProgram || !props.programId,
    props: ({ data }: $TSFixMe) => {
      if (data?.error) {
        return { error: true };
      }
      const currentProgram = data?.EnterpriseProgramsV1?.get?.elements?.[0];
      return { currentProgram };
    },
  }),
  withError,
  withProgramCurriculumDomainsGraphql,
  withError
);

// @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ options: () => { variables: { ... Remove this comment to see the full error message
export const withDegreesAndPrograms = graphql(programAndDegreeMembershipQuery, graphqlProgramOptions);

// Use `skip` to avoid using `branch(..)` this high up, since swapping these HOCs causes tree thrashing.
export const populateWithDegreesAndProgramsOnClientside = () => {
  const frozenEmptyArray = Object.freeze([]);

  // Use `skip` to avoid using `branch(..)` this high up, since swapping these HOCs causes tree thrashing.
  return compose(
    // @ts-ignore TSMIGRATION
    graphql(programAndDegreeMembershipQuery, {
      ...graphqlProgramOptions,
      // Defer membership queries to client-side so it wouldn't make SSR fail and
      // pages (i.e. payments) that don't care about program and degrees can specify to skip the fetch
      skip: ({ shouldSkipOptionalExternalDataFetch }: $TSFixMe) => {
        return !(user.isAuthenticatedUser() && !inServerContext && !shouldSkipOptionalExternalDataFetch);
      },
    }),
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ programMemberships, programs,... Remove this comment to see the full error message
    withProps(({ programMemberships, programs, degreeMemberships, degrees }) => ({
      programMemberships: programMemberships ?? frozenEmptyArray,
      programs: programs ?? frozenEmptyArray,
      degreeMemberships: degreeMemberships ?? frozenEmptyArray,
      degrees: degrees ?? frozenEmptyArray,
    }))
  );
};

// Pass a flag to avoid using `branch(..)` this high up, since swapping these HOCs causes tree thrashing.
export const withDomains = compose(
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ switcherSelections }: { switc... Remove this comment to see the full error message
  withProps(({ switcherSelections }) => {
    const shouldRenderEnterpriseProgramsAndProgramCurriculumDomains = Boolean(switcherSelections?.programId);
    return { shouldRenderEnterpriseProgramsAndProgramCurriculumDomains };
  }),
  withEnterpriseProgramsAndProgramCurriculumDomains,
  withDomainsGraphql
);
