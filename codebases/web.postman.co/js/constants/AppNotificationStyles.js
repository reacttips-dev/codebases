const AppNotificationStyles = {
  Containers: {
    DefaultStyle: {
      zIndex: 210,
      width: 360
    },
    tr: { bottom: '30px', top: 'unset' }
  },
  MessageWrapper: {
    DefaultStyle: {
      display: 'inline-block',
      paddingRight: '10px'
    }
  },
  NotificationItem: {
    DefaultStyle: {
      textAlign: 'inherit',
      wordBreak: 'break-word',
      margin: '0',
      overflowY: 'hidden',
      transition: 'all 0.3s ease-in-out',
      cursor: 'default'
    },

    success: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none'
    },

    error: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none'
    },

    warning: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none'
    },

    info: {
      borderTop: 'none',
      backgroundColor: 'none',
      boxShadow: 'none'
    }
  },
  ActionWrapper: { DefaultStyle: { display: 'inline-block' } },
  Action: {
    DefaultStyle: {
      backgroundColor: 'transparent',
      borderRadius: '0',
      padding: '0',
      fontWeight: 'bold',
      margin: '0 0 0 5px',
      border: 0,
      textDecoration: 'underline'
    },

    success: {
      backgroundColor: 'transparent',
      color: '#468847'
    },

    error: {
      backgroundColor: 'transparent',
      color: '#B94A48'
    },

    warning: {
      backgroundColor: 'transparent',
      color: '#C09853'
    },

    info: {
      backgroundColor: 'transparent',
      color: '#3A87AD'
    }
  },
  Dismiss: { DefaultStyle: { display: 'none' } }
};

export default AppNotificationStyles;
