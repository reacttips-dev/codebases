import glamorous from 'glamorous';
import BaseHeading from './heading.jsx';
import {Z_INDEX} from '../../../../shared/library/overlays';
import {FOCUS_BLUE, TARMAC, ALABASTER} from '../../../../shared/style/colors';

const Container = glamorous.header(
  {
    display: 'flex',
    flexDirection: 'row',
    border: 'none'
  },
  ({overlay}) => ({
    zIndex: overlay ? Z_INDEX : 'initial',
    backgroundColor: overlay ? ALABASTER : 'initial',
    padding: overlay ? '20px 20px 0 20px' : 0,
    marginBottom: overlay ? 0 : 15
  })
);

const Heading = glamorous(BaseHeading)({
  marginBottom: 0,
  lineHeight: 1,
  fontSize: 20
});

const Col = glamorous.div({
  marginLeft: 10,
  display: 'flex',
  flexDirection: 'column',
  color: TARMAC
});

const Link = glamorous.a({
  cursor: 'pointer',
  color: TARMAC,
  fontSize: 12,
  ':visited': {
    color: TARMAC
  },
  ':hover': {
    color: FOCUS_BLUE
  }
});

const Tag = glamorous.span({
  color: TARMAC,
  fontSize: 12
});

export {Container, Heading, Col, Link, Tag};
