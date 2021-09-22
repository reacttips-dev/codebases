import React from 'react';
import PropTypes from 'prop-types';

import { Item } from 'bundles/course-v2/types/Item';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';

import _t from 'i18n!nls/course-home';

type ButtonSpacingTypes = 'cozy' | 'comfy' | 'roomy';

type Props = {
  item: Item;
  overrideLabel: string;
  buttonSpacing?: ButtonSpacingTypes;
  ariaLabel?: string | undefined;
};

const Action: React.SFC<{
  resourcePath: string;
  pathname: string;
  buttonSpacing: ButtonSpacingTypes;
  ariaLabel?: string | undefined;
}> = ({ resourcePath, pathname, children, buttonSpacing, ariaLabel }) => {
  const inCourse = pathname.includes('/learn');

  if (inCourse) {
    return (
      <TrackedLink2
        href={resourcePath}
        trackingName="next_step_action"
        className={`link-button primary ${buttonSpacing}`}
        aria-label={ariaLabel}
      >
        {children}
      </TrackedLink2>
    );
  }

  return (
    <a href={resourcePath} className={`link-button primary ${buttonSpacing}`}>
      {children}
    </a>
  );
};

class ItemButton extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const { item, overrideLabel, buttonSpacing = 'cozy', ariaLabel } = this.props;
    const {
      router: {
        location: { pathname },
      },
    } = this.context;

    return (
      <div className="rc-ItemButton align-self-center">
        <Action
          resourcePath={item.resourcePath}
          pathname={pathname}
          buttonSpacing={buttonSpacing}
          ariaLabel={ariaLabel}
        >
          {!!overrideLabel && overrideLabel}
          {/*
          // @ts-expect-error TSMIGRATION */}
          {!overrideLabel && !item.hasStarted && _t('Start')}
          {/*
          // @ts-expect-error TSMIGRATION */}
          {!overrideLabel && item.hasStarted && _t('Resume')}
        </Action>
      </div>
    );
  }
}

export default ItemButton;
