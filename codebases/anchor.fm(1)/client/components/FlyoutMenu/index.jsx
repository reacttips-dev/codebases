import React from 'react';
import PropTypes from 'prop-types';

import Link from '../Link';
import Box from '../../shared/Box/index.tsx';
import Pressable from '../../shared/Pressable/index.tsx';
import { MenuItem } from './components/MenuItem';

import styles from './styles.sass';
import { DistributionMenuItem } from './components/DistributionMenuItem';

const getAlignmentStyles = align => {
  switch (align) {
    case 'left':
      return { left: 0 };
    case 'right':
    default:
      return { right: 0 };
  }
};

const FlyoutMenu = ({
  renderHeader,
  renderFooter,
  menuItems,
  align,
  onClickMenuItem,
  width,
  onClickFooter,
  shouldShowDistributionItem,
}) => (
  <Box
    color="#ffffff"
    position="absolute"
    width={width || 270}
    dangerouslySetInlineStyle={{
      borderRadius: '6px',
      boxShadow: '0 0 9px 0 rgba(0, 0, 0, 0.17)',
      zIndex: 100,
      ...getAlignmentStyles(align),
    }}
  >
    {renderHeader && (
      <Box
        dangerouslySetInlineStyle={{
          borderBottom: '2px solid #dfe0e1',
        }}
        height={70}
        paddingLeft={14}
        paddingRight={14}
        display="flex"
        alignItems="center"
      >
        {renderHeader}
      </Box>
    )}
    {shouldShowDistributionItem && (
      <DistributionMenuItem onClickMenuItem={onClickMenuItem} />
    )}
    <Box paddingTop={14} paddingBottom={14}>
      {menuItems.map(item => {
        const { to, href, onClick, label, icon, target, isDownloadLink } = item;
        if (onClick) {
          return (
            <Pressable
              fullWidth
              key={label}
              isEventBubblingAllowed
              isDefaultBehaviorAllowed
              onPress={e => {
                onClickMenuItem();
                onClick(e);
              }}
            >
              {() => (
                <div className={styles.link}>
                  <MenuItem label={label} icon={icon} />
                </div>
              )}
            </Pressable>
          );
        }
        return (
          <Link
            to={to}
            href={href}
            key={label}
            onClick={onClickMenuItem}
            className={styles.link}
            target={target}
            isDownloadLink={isDownloadLink}
          >
            <MenuItem label={label} icon={icon} />
          </Link>
        );
      })}
    </Box>
    {renderFooter && (
      <Box
        dangerouslySetInlineStyle={{
          borderTop: '2px solid #dfe0e1',
        }}
        height={70}
        display="flex"
        alignItems="center"
      >
        <Pressable
          onPress={() => {
            onClickFooter();
            onClickMenuItem();
          }}
          fullWidth
          isEventBubblingAllowed
          isDefaultBehaviorAllowed
        >
          {() => renderFooter}
        </Pressable>
      </Box>
    )}
  </Box>
);

FlyoutMenu.defaultProps = {
  shouldShowDistributionItem: false,
  renderHeader: null,
  renderFooter: null,
  align: 'right',
  width: null,
  onClickFooter: () => {},
};
FlyoutMenu.propTypes = {
  shouldShowDistributionItem: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
  renderHeader: PropTypes.element,
  renderFooter: PropTypes.element,
  onClickMenuItem: PropTypes.func.isRequired,
  onClickFooter: PropTypes.func,
  width: PropTypes.number,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      iconType: PropTypes.string,
      href: PropTypes.string,
      to: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.shape({
        backgroundColor: PropTypes.string,
        iconColor: PropTypes.string,
        padding: PropTypes.number,
        type: PropTypes.string,
        width: PropTypes.number,
      }),
      target: PropTypes.string,
    })
  ).isRequired,
};

export { FlyoutMenu };
