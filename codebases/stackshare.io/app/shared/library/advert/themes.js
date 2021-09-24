import {grid} from '../../utils/grid';

export const ROW = 'row';
export const COLUMN = 'column';
export const SLIM = 'slim';
export const SHORT = 'short';
export const VENDOR_CTA = 'vendor_cta';

export const THEMES = {
  [ROW]: {
    Content: {
      flex: 4,
      flexDirection: ROW
    },
    LogoContainer: {
      marginLeft: 70
    },
    Info: {
      marginLeft: 20
    },
    ButtonContainer: {
      flex: 1
    },
    Card: {
      boxShadow: '0 4px 13px 0 rgba(0, 0, 0, 0.05)'
    },
    CompCard: {
      boxShadow: '0 4px 13px 0 rgba(0, 0, 0, 0.05)'
    }
  },
  [COLUMN]: {
    Container: {
      padding: 0,
      margin: 0
    },
    Card: {
      flexDirection: COLUMN,
      borderRadius: 0,
      paddingBottom: 0,
      margin: 0,
      boxShadow: '0 4px 13px 0 rgba(0, 0, 0, 0.05)'
    },
    CompCard: {
      flexDirection: COLUMN,
      borderRadius: 0,
      paddingBottom: 0,
      margin: 0,
      boxShadow: '0 4px 13px 0 rgba(0, 0, 0, 0.05)'
    },
    Content: {
      flexDirection: COLUMN
    },
    LogoContainer: {
      marginTop: grid(2),
      marginLeft: 0,
      border: 'none'
    },
    Logo: {
      width: 70,
      height: 70
    },
    Info: {
      textAlign: 'center'
    },
    Name: {
      marginTop: grid(2)
    },
    Description: {
      marginTop: grid(2),
      padding: '0 50px'
    },
    ButtonContainer: {
      marginTop: grid(2),
      marginBottom: 20
    }
  },
  [SLIM]: {
    Container: {
      padding: 0,
      margin: 0
    },
    LogoContainer: {
      marginLeft: 37,
      padding: 8
    },
    Logo: {
      width: 34,
      height: 34
    },
    Info: {
      marginLeft: 12
    },
    Description: {
      maxWidth: 200
    },
    ButtonContainer: {
      marginRight: 20,
      ' > button': {
        width: 100,
        height: 26,
        padding: 0
      }
    },
    Ribbon: {
      fontSize: 8,
      padding: '2px 0',
      top: 14,
      width: 103
    }
  },
  [SHORT]: {
    Container: {
      margin: '10px 0 6px'
    },
    CompCard: {
      paddingTop: grid(1),
      paddingBottom: grid(1),
      paddingLeft: grid(4),
      paddingRight: grid(1)
    },
    LogoContainer: {
      padding: 5
    },
    Logo: {
      width: 25,
      height: 25
    },
    Info: {
      textAlign: 'left',
      marginRight: 'auto',
      marginLeft: 10,
      maxWidth: 320
    },
    Name: {
      fontSize: 12
    },
    Description: {
      fontSize: 11
    },
    ButtonContainer: {
      marginRight: 20,
      ' > button': {
        width: 102,
        height: 26,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px 13px',
        marginTop: 2
      }
    },
    Ribbon: {
      top: 10,
      right: 42,
      padding: '2px 0',
      fontSize: 6
    }
  }
};
