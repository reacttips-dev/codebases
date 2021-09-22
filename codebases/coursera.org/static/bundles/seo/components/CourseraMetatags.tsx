import { branch, withProps, compose } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import connectToFluxibleContext from 'js/lib/connectToFluxibleContext';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import SeoRulesStore from 'bundles/internal-seo/stores/SeoRulesStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getSeoRules } from 'bundles/internal-seo/actions/SeoMetatagsActions';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import connectToRouter from 'js/lib/connectToRouter';

import user from 'js/lib/user';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { mergeRules } from 'bundles/seo/utils/utils';
import type { CourseraMetatagsProps, OverrideRule } from 'bundles/seo/types';
import _tPage from 'i18n!nls/page';
import _tSeo from 'i18n!nls/seo';
import epicClient from 'bundles/epic/client';
import {
  META_DESC_MAX_LEN,
  generateMetaTitle,
  generateMetaNameAndProperties,
  generateLinkRelationAndProperties,
} from 'bundles/seo/utils/courseraMetatagsUtils';
import { defaultImageHref } from 'bundles/seo/common/constants';

type Translate = typeof _tPage;

declare const COURSERA_APP_NAME: string;

class CourseraMetatags extends React.Component<CourseraMetatagsProps> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    fluxibleContext: PropTypes.object,
  };

  static defaultProps = {
    descriptionLengthLimit: META_DESC_MAX_LEN,
    disableLanguageSubdomainsLinks: false,
    disableCourseraSuffix: false,
    disableCourseraDescriptionSuffix: false,
    disableCrawlerIndexing: false,
    useFollowForDisablingIndexing: false,
    disableDescLimit: false,
    imageHref: defaultImageHref,
  };

  constructor(props: CourseraMetatagsProps) {
    super(props);
    if (props.seoOverrideRule?.length) {
      this.overrideRule = mergeRules(props.seoOverrideRule);
    }
  }

  private overrideRule: OverrideRule | null = null;

  render() {
    const location = this.context.router.location;
    const _t: Translate = _tSeo.merge(_tPage);
    const metaTitle = generateMetaTitle(this.props.title, _t, this.props.disableCourseraSuffix, this.overrideRule);
    const metaNameAndProperties = generateMetaNameAndProperties(_t, this.props, location, this.overrideRule);

    const linkRelationAndProperties = generateLinkRelationAndProperties(this.props, location, this.overrideRule);

    const helmetMeta = {
      title: metaTitle,
      meta: metaNameAndProperties,
      link: linkRelationAndProperties,
    };

    return <Helmet {...helmetMeta} />;
  }
}

export default branch(
  () => user.isAuthenticatedUser(),
  withProps((props) => props),
  compose(
    withProps((props) => {
      return {
        ...(props as CourseraMetatagsProps),
        appName: COURSERA_APP_NAME,
      };
    }),
    branch(
      ({ appName }: { appName: string }) => {
        const enabledAppList = epicClient.get('Growth', 'seoOverrideEnabledApps');
        return enabledAppList.includes(appName);
      },
      compose(
        connectToRouter(({ location }) => ({ location })),
        // TODO: connectToStores<Props, InputProps, Stores>
        connectToStores<{}, {}>([SeoRulesStore], ({ SeoRulesStore: { seoRules } }, props) => ({
          ...props,
          seoRules,
        })),
        branch(
          ({ seoRules }: { seoRules: {} }) => !seoRules,
          connectToFluxibleContext<{ location: InjectedRouter['location'] }>(({ executeAction }, { location }) => {
            executeAction(getSeoRules.bind(null, location));
          }),
          withProps((props) => props)
        ),
        // TODO: connectToStores<Props, InputProps, Stores>
        connectToStores<{}, {}>(['SeoRulesStore'], (context, props) => {
          return {
            ...props,
            seoOverrideRule: context.SeoRulesStore.getData(),
          };
        })
      )
    )
  )
)(CourseraMetatags) as React.ComponentClass<CourseraMetatagsProps>;

export const BaseComponent = CourseraMetatags;
