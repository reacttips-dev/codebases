import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import { Link } from 'react-router';

type Props = {
  /**
   * Route name as described in `<Rote name="some-route-name" ... />`
   */
  name: string;
  /**
   * Params to generate url. It will use params from current route to generate url and
   * override it with passed params.
   */
  params?: { [x: string]: string | number };
  /**
   * Render link as `<span>` if this is the current route (params and name match).
   * Default: false.
   */
  noLinkToCurrent?: boolean;
  /**
   * Render link as `<span>` if true. Default: false
   */
  noLink?: boolean;
  query?: { [x: string]: string | number };
} & Omit<Link.LinkProps, 'to'>;

/**
 * Component for generating react-router Link by route name.
 *
 * Let's say we have following routes and we are currently in "teammate-review-cover":
 * ```
 * <Route path="teammate-review/:item_id(/:slug)" getComponent={TeammateReviewItem}>
 *   <IndexRoute name="teammate-review-cover" getComponent={TeammateReviewCover} />
 *   <Route path="review/:teammateId" name="teammate-review-review" getComponent={TeammateReview} />
 *   <Route path="grades" name="teammate-review-grades" getComponent={TeammateReviewGrades} />
 * </Route>
 * ```
 *
 * We can render the following links, item_id and slug will be taken from the current route:
 * ```
 * <LinkTo name="teammate-review-grades">Grades</LinkTo>
 * <LinkTo name="teammate-review-review" params={{ teammateId: 1 }}>Review Teammate 1</LinkTo>
 * ```
 *
 * You can also override current route params if you need to:
 * ```
 * <LinkTo name="teammate-review-grades" params={{ item_id: 'other-item' }}>Grades from other item</LinkTo>
 * ```
 *
 * You can use named import { LinkToUnlessCurrent } as shortcut for LinkTo with noLinkToCurrent.
 * */
class LinkTo extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  isLinkToCurrent = (name: string, params: { [x: string]: string | number }) => {
    const { router } = this.context;
    return isEqual(params, router.params) && name === router.routes[router.routes.length - 1].name;
  };

  render() {
    const { name, params: p, noLinkToCurrent, noLink, query, ...rest } = this.props;
    const { router } = this.context;
    const params = {
      ...router.params,
      ...p,
    };
    if (noLink || (noLinkToCurrent && this.isLinkToCurrent(name, params))) {
      // @ts-expect-error TSMIGRATION
      return <span {...rest} />;
    }
    return <Link to={{ name, params, query }} {...rest} />;
  }
}

export const LinkToUnlessCurrent = ({ name, params, ...rest }: Props) => (
  <LinkTo noLinkToCurrent {...{ name, params }} {...rest} />
);

export default LinkTo;
