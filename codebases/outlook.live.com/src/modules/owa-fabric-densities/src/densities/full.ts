const btnstyle = {
    root: {
        padding: '0px 4px',
        height: '34px',
    },
    icon: {
        fontSize: '16px',
    },
    menuIcon: {
        fontSize: '12px',
    },
};

export const fullDensity = {
    fonts: {
        xSmall: { fontSize: '10px', fontWeight: 'regular' },
        small: { fontSize: '12px', fontWeight: 'regular' },
        smallPlus: { fontSize: '12px', fontWeight: 'regular' },
        medium: { fontSize: '14px', fontWeight: 'regular' },
        mediumPlus: { fontSize: '16px', fontWeight: 'semibold' },
        large: { fontSize: '18px', fontWeight: 'regular' },
        xLarge: { fontSize: '20px', fontWeight: 'semibold' },
    },
    components: {
        DefaultButton: {
            styles: btnstyle,
        },
        SecondaryButton: {
            styles: btnstyle,
        },
        CommandBarButton: {
            styles: btnstyle,
        },
        Checkbox: {
            styles: {
                checkbox: {
                    height: '20px',
                    width: '20px',
                },
                checkmark: {},
            },
        },
        CommandBar: {
            styles: {
                root: {},
            },
        },
        Dropdown: {},
        Toggle: {
            styles: {
                pill: {
                    width: '40px',
                    height: '20px',
                },
                thumb: {
                    width: '12px',
                    height: '12px',
                },
            },
        },
        Icon: {
            styles: {
                root: {
                    fontSize: '16px',
                    // For some reason, only in IE11, and only when deploying (not in gulp dev),
                    // Fabric's `display: inline-block` style takes precedence over any custom
                    // style we apply to the display property for icons. This causes visual regressions
                    // in IE11 that look really bad.
                    display: null,
                },
            },
        },
    },
};
