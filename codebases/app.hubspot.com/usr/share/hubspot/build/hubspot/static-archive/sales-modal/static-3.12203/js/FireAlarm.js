'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import FireAlarmApp from 'FireAlarmUi/js/FireAlarmApp';
import { TEMPLATES_SEQUENCES_APPNAME } from './constants/FireAlarmAppNames';
export default createReactClass({
  displayName: "FireAlarm",
  componentDidMount: function componentDidMount() {
    var config = {
      appName: this.props.appName || TEMPLATES_SEQUENCES_APPNAME,
      containers: {
        default: {
          parent: document.getElementById('sales-modal-fire-alarm-container')
        }
      }
    };
    this.initialFireAlarmConfig = window.hubspot[FireAlarmApp.HUBSPOT_FIREALARM_KEY];
    var fireAlarm = new FireAlarmApp(window.hubspot, config);
    window.hubspot[FireAlarmApp.HUBSPOT_FIREALARM_KEY] = fireAlarm;
    fireAlarm.start();
  },
  componentWillUnmount: function componentWillUnmount() {
    window.hubspot[FireAlarmApp.HUBSPOT_FIREALARM_KEY] = this.initialFireAlarmConfig;
  },
  render: function render() {
    return /*#__PURE__*/_jsx("div", {
      id: "sales-modal-fire-alarm-container"
    });
  }
});