import glamorous from 'glamorous';

export const ArrowContainer = glamorous.div(
  {
    position: 'absolute',
    width: 20,
    height: 10,
    '&[data-placement*="top"]': {
      bottom: 0,
      marginBottom: -5
    },
    '&[data-placement*="bottom"]': {
      transform: 'rotate(180deg)',
      top: 0,
      marginTop: -6
    },
    '&[data-placement*="right"]': {
      transform: 'rotate(90deg)',
      left: 0,
      marginLeft: -11
    },
    '&[data-placement*="left"]': {
      transform: 'rotate(-90deg)',
      right: 0,
      marginRight: -11
    }
  },
  ({arrowColor}) => {
    if (arrowColor)
      return {
        '& svg > path:first-child': {
          fill: arrowColor
        }
      };
  }
);

export default ArrowContainer;
