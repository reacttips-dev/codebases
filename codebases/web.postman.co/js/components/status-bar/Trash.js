import React from 'react';
import TrashLabel from '../../../version-control/trash/components/TrashLabel.js';

export default {
  name: 'Trash',
  position: 'right',
  getComponent ({
    React,
    StatusBarComponents
  }) {
    return TrashLabel;
  }
};
