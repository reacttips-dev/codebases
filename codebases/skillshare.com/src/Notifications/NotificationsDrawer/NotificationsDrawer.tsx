import React, { useEffect, useRef } from 'react';
import { Box, createStyles, Drawer, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { CloseIcon } from '../../Icons';
import { NotificationsTabs } from '../NotificationsTabs';
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing;
    return createStyles({
        paper: {
            backgroundColor: grey[100],
            width: 546,
            '& .MuiTabs-root': {
                paddingLeft: spacing(2),
            },
        },
        closeIcon: {
            cursor: 'pointer',
        },
    });
});
export function NotificationsDrawer(props) {
    var classes = useStyles();
    var opened = useRef(false);
    useEffect(function () {
        if (props.open) {
            opened.current = true;
        }
    }, [props.open]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Drawer, { ModalProps: {
                keepMounted: true,
            }, classes: { paper: classes.paper }, anchor: "right", open: props.open, onClose: props.toggleDrawer },
            React.createElement(Box, { display: "block", textAlign: "right", paddingTop: 2, paddingRight: 2 },
                React.createElement(CloseIcon, { "data-testid": "close-drawer", className: classes.closeIcon, onClick: props.toggleDrawer })),
            (opened.current || props.open) && React.createElement(NotificationsTabs, null))));
}
//# sourceMappingURL=NotificationsDrawer.js.map