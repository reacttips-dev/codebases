import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {WHITE, ASH, CATHEDRAL} from '../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {PHONE, TABLET} from '../../../style/breakpoints';

const Wrapper = glamorous.a({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px 10px 20px',
  backgroundColor: WHITE,
  height: 67,
  borderRadius: 3,
  marginBottom: 15,
  marginRight: 18,
  flexShrink: 0,
  textDecoration: 'none',
  ':hover': {
    backgroundColor: WHITE
  },
  [PHONE]: {
    padding: '10px 5px'
  }
});

const Divider = glamorous.div({
  ...BASE_TEXT,
  color: CATHEDRAL,
  fontSize: 11,
  height: 21,
  width: 21,
  border: `1px solid ${ASH}`,
  borderRadius: '50%',
  boxSizing: 'content-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginRight: 5,
  marginLeft: 5
});

const Service = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [PHONE]: {
    maxWidth: 70
  }
});

const Logo = glamorous.img({
  height: 27,
  width: 27
});

const Name = glamorous.div({
  ...BASE_TEXT,
  fontSize: 11,
  fontWeight: WEIGHT.BOLD,
  color: CATHEDRAL,
  textAlign: 'center',
  marginTop: 5,
  textOverflow: 'ellipsis',
  width: 80,
  [TABLET]: {
    width: 60
  },
  whiteSpace: 'nowrap',
  overflow: 'hidden'
});

export default class Stackup extends Component {
  static propTypes = {
    services: PropTypes.arrayOf(PropTypes.object),
    path: PropTypes.string
  };
  render() {
    const {services, path} = this.props;
    const items = services.map(({id, name, imageUrl, thumbUrl}, index) => {
      const image = thumbUrl ? thumbUrl : imageUrl;
      return (
        <React.Fragment key={id}>
          <Service>
            <Logo src={image} alt={name} />
            <Name title={name}>{name}</Name>
          </Service>

          {index < services.length - 1 && <Divider>VS</Divider>}
        </React.Fragment>
      );
    });
    return <Wrapper href={path}>{items}</Wrapper>;
  }
}
