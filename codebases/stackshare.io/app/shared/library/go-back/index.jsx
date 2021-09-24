import React, {useContext} from 'react';
import glamorous from 'glamorous';
import BackArrowIcon from '../icons/back-arrow-icon.svg';
import {CHARCOAL, WHITE} from '../../style/colors';
import BaseText from '../typography/text';
import PropTypes from 'prop-types';
import {NavigationContext} from '../../enhancers/router-enhancer';
import {redirectTo} from '../../utils/navigation';

const Container = glamorous.div({
  margin: '10px 0',
  boxShadow: '0 1px 3px 0 #e1e1e1',
  backgroundColor: WHITE,
  padding: 15,
  borderRadius: 4,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ' svg': {
    marginRight: 7
  }
});

const Text = glamorous(BaseText)({
  fontSize: 14,
  fontWeight: 'bold',
  color: CHARCOAL
});

const BackLayer = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const Back = ({url, text, navigateContext = false, children}) => {
  const navigate = useContext(NavigationContext);
  return (
    <Container
      onClick={
        navigateContext
          ? () => {
              navigate(url);
            }
          : () => redirectTo(url)
      }
    >
      <BackLayer>
        <BackArrowIcon /> <Text>{text}</Text>
      </BackLayer>
      {children}
    </Container>
  );
};

Back.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
  navigateContext: PropTypes.bool,
  children: PropTypes.node
};

export default Back;
