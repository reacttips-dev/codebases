import React, {useState, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {BASE_TEXT} from '../../style/typography';
import {TARMAC, WHITE, FOCUS_BLUE, PUMPKIN} from '../../style/colors';
import glamorous from 'glamorous';
import useStickyTracking from '../../utils/hooks/sticky';
import PillLabel from '../buttons/base/pill-label';

const defaultActiveStyles = {
  color: FOCUS_BLUE,
  borderColor: FOCUS_BLUE
};

export const activeStyles = {
  ...defaultActiveStyles,
  ' svg path': {
    stroke: FOCUS_BLUE
  }
};

const Container = glamorous.div(
  {
    height: 95,
    display: 'flex',
    position: 'sticky',
    top: 0,
    backgroundColor: WHITE,
    width: '100%'
  },
  ({isStuck}) => ({zIndex: isStuck ? 1001 : 100})
);

const Nav = glamorous.nav({
  display: 'flex',
  margin: '15px 0 0 0',
  ' > a:last-of-type': {
    marginRight: 0
  }
});

const Content = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  margin: '0 auto'
});

const Item = glamorous.a(
  {
    ...BASE_TEXT,
    color: TARMAC,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 20,
    marginBottom: -2,
    borderBottom: `2px solid transparent`,
    ' > svg': {
      height: 34
    }
  },
  ({itemWidth, active, activeStyles}) => {
    const styles = active ? activeStyles : {};
    return {
      width: itemWidth,
      ...styles,
      '&:hover': {...activeStyles},
      '&:focus': {...activeStyles}
    };
  }
);

const Name = glamorous.div({
  marginTop: 4,
  fontSize: 14,
  '>span': {
    marginLeft: 0
  }
});

const Aside = glamorous.div({});

const NavigationBar = forwardRef(({items, itemWidth = 100, children, onItemClick}, ref) => {
  const [activeItem, setactiveItem] = useState(null);
  const isStuck = useStickyTracking(ref);

  return (
    <Container data-testid="navigationBar" innerRef={ref} isStuck={isStuck}>
      <Content>
        <Nav>
          {items.map((item, index) => {
            const {name, slug, icon, activeStyles, count} = item;
            return (
              <Item
                active={slug === activeItem}
                key={index}
                itemWidth={itemWidth}
                activeStyles={activeStyles}
                href={slug ? `#${slug}` : false}
                onClick={() => {
                  setactiveItem(slug);
                  if (onItemClick) {
                    onItemClick(item);
                  }
                }}
              >
                {icon}
                <Name>
                  {name}{' '}
                  {typeof count === 'number' && count > 0 && (
                    <PillLabel flavour={PUMPKIN} invert>
                      {count}
                    </PillLabel>
                  )}
                </Name>
              </Item>
            );
          })}
        </Nav>
        <Aside>{children}</Aside>
      </Content>
    </Container>
  );
});

NavigationBar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.element,
      slug: PropTypes.string
    })
  ),
  itemWidth: PropTypes.number,
  children: PropTypes.any,
  onItemClick: PropTypes.func
};

export default NavigationBar;
