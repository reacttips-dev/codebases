import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {WHITE, CATHEDRAL, CONCRETE} from '../../../style/colors';
import {FONT_FAMILY, WEIGHT, BASE_TEXT} from '../../../style/typography';
import {truncateText} from '../../../utils/truncate-text';
import DefaultStackIcon from '../../icons/default-stack-icon.svg';

const StackIcon = glamorous(DefaultStackIcon)(
  {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  ({hidden}) => ({
    zIndex: hidden ? -1 : 1
  })
);

const Container = glamorous.div({
  ...BASE_TEXT,
  width: '100%',
  borderRadius: 3.3,
  boxShadow: '0 1px 0 0 #e1e1e1',
  border: 'solid 0.9px #e1e1e1',
  backgroundColor: WHITE,
  cursor: 'pointer',
  ':hover': {
    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.31)'
  }
});

const IconContainer = glamorous.div(
  {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gridGap: 15,
    borderRadius: 3,
    backgroundColor: '#f3f3f3',
    padding: '20px 25px',
    zIndex: 1
  },
  ({iconContainerHeight}) => ({
    height: iconContainerHeight ? iconContainerHeight : '75%'
  })
);

const Title = glamorous.div('title', {
  fontFamily: FONT_FAMILY,
  fontWeight: WEIGHT.BOLD,
  fontSize: 13,
  lineHeight: '18px',
  color: CATHEDRAL,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  padding: '0 10px',
  margin: '10px 0',
  textAlign: 'center',
  boxSizing: 'content-box',
  borderBottomRightRadius: 2,
  borderBottomLeftRadius: 2
});

const Count = glamorous.div({
  fontFamily: FONT_FAMILY,
  fontWeight: WEIGHT.BOLD,
  marginTop: 2,
  color: CONCRETE,
  fontSize: 11,
  textTransform: 'uppercase'
});

const MoreStacks = glamorous.div({
  height: '100%',
  width: '100%',
  borderRadius: 6,
  background: WHITE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11.9,
  fontWeight: 600,
  lineHeight: 0.96,
  letterSpacing: 0.34
});

const StackAppsCard = ({name = '', count = 0, item, iconContainerHeight = 0}) => {
  const [hasMoreThanSeven, setHasMoreThanSeven] = useState(false);
  const [items, setItems] = useState([...item.stacks.edges]);

  useEffect(() => {
    if (count > 7) {
      setHasMoreThanSeven(true);
    } else {
      const arr = [...items];
      for (let i = count; i < 8; i++) {
        arr.push({});
      }
      setItems(arr);
    }
  }, [count]);

  return (
    <Container onClick={() => window.open(item.canonicalUrl, '_self')}>
      <IconContainer iconContainerHeight={iconContainerHeight}>
        {hasMoreThanSeven ? (
          <>
            {item.stacks.edges.slice(0, 7).map((_, index) => (
              <StackIcon key={index} />
            ))}
            <MoreStacks>+ {count - 7}</MoreStacks>
          </>
        ) : (
          items.map((val, index) =>
            val.node ? <StackIcon key={index} /> : <StackIcon key={index} hidden={true} />
          )
        )}
      </IconContainer>
      <Title>
        {truncateText(name, 27, '...', true)}
        <Count>
          {count} stack{count === 1 ? '' : 's'}
        </Count>
      </Title>
    </Container>
  );
};

StackAppsCard.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  item: PropTypes.object,
  iconContainerHeight: PropTypes.string
};

export default StackAppsCard;
