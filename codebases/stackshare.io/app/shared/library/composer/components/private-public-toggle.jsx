import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import TriangleIcon from '../../../../shared/library/icons/triangle.svg';
import PopoverWithAnchor from '../../../../shared/library/popovers/base-v2';
import {FOCUS_BLUE, TARMAC, WHITE_SMOKE} from '../../../../shared/style/colors';
import {BOTTOM} from '../../../../shared/constants/placements';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {FEED, FEED_PUBLIC} from '../../../../data/feed/constants';
import PublicIcon from '../../icons/public.svg';
import PrivateIcon from '../../icons/private.svg';
import {GUNSMOKE} from '../../../style/colors';

const Container = glamorous.div({
  ...BASE_TEXT
});

const Disabled = glamorous.div({
  cursor: 'not-allowed',
  ' div': {
    cursor: 'not-allowed'
  }
});

const ItemDetails = glamorous.div({
  fontWeight: 'normal',
  padding: '5px 0',
  fontSize: 12,
  marginLeft: 18,
  color: GUNSMOKE
});

const Item = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  paddingTop: 5,
  ' > svg ': {
    marginRight: 5,
    height: 12,
    width: 12,
    ' path': {
      fill: FOCUS_BLUE
    }
  }
});

const Dropdown = glamorous.div({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: TARMAC,
  '> svg': {
    marginLeft: 10,
    marginTop: 7
  }
});

const Content = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '5px 0',
  padding: '0 10px',
  cursor: 'pointer',
  '&:hover': {
    background: WHITE_SMOKE
  }
});

const ContentContainer = glamorous.div({
  width: '100%'
});

const PrivatePublicToggle = ({defaultSetting, setIsPrivate, state}) => {
  const [activeOption, setActiveOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const node = useRef();
  useEffect(() => {
    setActiveOption('Private');
    setIsPrivate(true);
    if (location.pathname.split('/').pop() === FEED) {
      setActiveOption('Private');
      setDisabled(false);
      setIsPrivate(true);
    }
    if (location.pathname.includes(FEED_PUBLIC)) {
      setActiveOption('Public');
      setDisabled(false);
      setIsPrivate(false);
    }
    if (location.pathname.includes('feed/advice')) {
      setActiveOption('Private');
      setDisabled(false);
      setIsPrivate(true);
    }
    if (location.pathname.includes('feed/advice/public')) {
      setActiveOption('Public');
      setDisabled(false);
      setIsPrivate(false);
    }
    if (state.selectedStructure === 'giveAdvice' && state.private === true) {
      setActiveOption('Private');
      setDisabled(true);
      setIsPrivate(true);
    }

    if (state.selectedStructure === 'giveAdvice' && state.private === false) {
      setActiveOption('Public');
      setDisabled(true);
      setIsPrivate(false);
    }

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [defaultSetting, window.location.pathname, state.private]);

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      return;
    }
    setShowOptions(false);
  };

  const data = [{name: 'Private'}, {name: 'Public'}];

  const onOptionClick = e => {
    switch (e) {
      case 'Private':
        setActiveOption('Private');
        setShowOptions(false);
        setIsPrivate(true);
        break;
      case 'Public':
        setActiveOption('Public');
        setShowOptions(false);
        setIsPrivate(false);
        break;
    }
  };
  return (
    <Container innerRef={node}>
      {disabled && (
        <Disabled>
          <Dropdown onClick={() => setShowOptions(true)}>
            {activeOption === 'Public' && (
              <Item>
                <PublicIcon /> Public
              </Item>
            )}
            {activeOption === 'Private' && (
              <Item>
                <PrivateIcon />
                Private
              </Item>
            )}
          </Dropdown>
        </Disabled>
      )}
      {!disabled && (
        <PopoverWithAnchor
          customStyle={{textAlign: 'left', padding: 0}}
          placement={BOTTOM}
          hidden={!showOptions}
          anchor={
            <Dropdown onClick={() => setShowOptions(true)}>
              {activeOption === 'Public' && (
                <Item>
                  <PublicIcon /> Public
                </Item>
              )}
              {activeOption === 'Private' && (
                <Item>
                  <PrivateIcon />
                  Private
                </Item>
              )}
              <TriangleIcon />
            </Dropdown>
          }
        >
          <ContentContainer>
            {data.map(i => (
              <Content key={i.name}>
                <div onClick={() => onOptionClick(i.name)}>
                  {i.name === 'Public' && (
                    <>
                      <Item>
                        <PublicIcon /> Public
                      </Item>
                      <ItemDetails>Visible to all</ItemDetails>
                    </>
                  )}
                  {i.name === 'Private' && (
                    <>
                      <Item>
                        <PrivateIcon />
                        Private
                      </Item>
                      <ItemDetails>Visible to your company</ItemDetails>
                    </>
                  )}
                </div>
              </Content>
            ))}
          </ContentContainer>
        </PopoverWithAnchor>
      )}
    </Container>
  );
};

PrivatePublicToggle.propTypes = {
  setIsPrivate: PropTypes.func,
  defaultSetting: PropTypes.string,
  state: PropTypes.object
};

export default PrivatePublicToggle;
