/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import { Link, Typography } from '@coursera/cds-core';
import { ChevronNextIcon } from '@coursera/cds-icons';

import { TrackedLink2, TrackingProps } from 'bundles/page/components/TrackedLink2';

import { Box } from '@coursera/coursera-ui';

import 'css!./__styles__/Breadcrumbs';

const styles = {
  icon: () =>
    css({
      alignSelf: 'center',
    }),
};

type Location =
  | string
  | {
      pathname: string;
      query?: { [key: string]: boolean | string | number };
      hash?: string;
    };

type NavItem = {
  title: string | JSX.Element;
  trackingName?: string;
  location?: Location;
};

type Props = {
  navItems: Array<NavItem>;
  fontSize?: number;
  ariaLabel?: string;
};

type BreadCrumbNavLinkProps = TrackingProps;

const BreadCrumbNavLink: React.SFC<BreadCrumbNavLinkProps> = ({ ...props }) => {
  return (
    <Link component={TrackedLink2} {...props} variant="quiet" typographyVariant="body2" iconPosition="after">
      {props.children}
    </Link>
  );
};

const Breadcrumbs: React.SFC<Props> = ({ navItems, fontSize = 12, ariaLabel }) =>
  navItems.length > 0 ? (
    <div className="rc-Breadcrumbs" role="navigation" aria-label={ariaLabel || 'breadcrumb'}>
      <Box
        justifyContent="start"
        alignItems="center"
        flexWrap="wrap"
        tag="ol"
        style={{
          margin: 'auto',
          padding: 0,
        }}
      >
        {navItems.map((item, i) => (
          <li key={`bc-item-${item.title}`} className="breadcrumb-item" style={{ fontSize }}>
            {item.location && item.trackingName ? (
              <BreadCrumbNavLink
                href={item.location}
                trackingName={item.trackingName}
                className="breadcrumb-title"
                {...(i === navItems.length - 1 ? { ariaCurrent: 'page' } : {})}
              >
                {item.title}
              </BreadCrumbNavLink>
            ) : (
              <Typography
                className="breadcrumb-title"
                aria-current={i === navItems.length - 1 ? 'page' : undefined}
                component="span"
                variant="body2"
              >
                {item.title}
              </Typography>
            )}
            {navItems.length - 1 !== i && (
              <div key={`bc-arrow-${item.title}`} className="breadcrumb-arrow">
                <ChevronNextIcon css={styles.icon()} size="small" />
              </div>
            )}
          </li>
        ))}
      </Box>
    </div>
  ) : null;

export default Breadcrumbs;
