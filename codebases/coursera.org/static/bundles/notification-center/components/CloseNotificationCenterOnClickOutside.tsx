import React from 'react';

type Props = {
  onClick: () => void;
  getNotificationCenterRef: () => HTMLElement | null | undefined;
};

// Triggers the click handler when clicking outside the element returned as a ref.
// Used to close the NotificationListView when clicking outside of it.
class CloseNotificationCenterOnClickOutside extends React.Component<Props> {
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick = (event: MouseEvent) => {
    const ref = this.props.getNotificationCenterRef();
    if (event.target !== ref && !ref?.contains(event.target as Node)) {
      this.props.onClick();
    }
  };

  render() {
    return null;
  }
}

export default CloseNotificationCenterOnClickOutside;
