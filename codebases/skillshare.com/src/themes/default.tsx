var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var colors = {
    teal: '#17c5cb',
    turquoise: '#017a84',
    mint: '#51cb8c',
    heather: '#656868',
    silver: '#e7e9ec',
    white: '#fff',
    black: '#000',
    scarlet: '#ed5a4f',
    butterscotch: '#ffc43d',
    facebook: '#3b5998',
    twitter: '#55acee',
    instagram: '#517fa4',
    youtube: '#cd201f',
    linkedInBlue: '#466bc9',
    facebookDark: '#324b80',
    twitterDark: '#398ecf',
    inherit: 'inherit',
    transparent: 'transparent',
    wanderGreen: '#00ff84',
    violet: '#3722d3',
    navy: '#002333',
    blue: '#00b7ff',
    charcoal: '#394649',
    concrete: '#dcdee1',
    canvas: '#f4f4f4',
    red: '#ff4a4a',
    yellow: '#ffe03d',
};
var normalTypography = {
    color: colors.navy,
    family: '"GT Walsheim Pro", Arial, sans-serif',
    size: '15px',
};
var displayTypography = __assign(__assign({}, normalTypography), { size: '48px', weight: 'bold', height: '52px' });
var h1Typography = __assign(__assign({}, normalTypography), { size: '36px', weight: 'bold', height: '44px' });
var h2Typography = __assign(__assign({}, normalTypography), { size: '26px', height: '32px', weight: 'bold' });
var h3Typography = __assign(__assign({}, normalTypography), { size: '22px', height: '28px', weight: 'bold' });
var h4Typography = __assign(__assign({}, normalTypography), { size: '18px', height: '22px', weight: 'bold' });
var body1Typography = __assign(__assign({}, normalTypography), { size: '18px', height: '24px', weight: 'normal' });
var body2Typography = __assign(__assign({}, normalTypography), { size: '15px', height: '20px', weight: 'normal' });
var captionTypography = __assign(__assign({}, normalTypography), { size: '13px', height: '18px', weight: 'normal' });
var body1BoldTypography = __assign(__assign({}, body1Typography), { weight: 'bold' });
var body2BoldTypography = __assign(__assign({}, body2Typography), { weight: 'bold' });
var captionBoldTypography = __assign(__assign({}, captionTypography), { weight: 'bold' });
var titleTypography = __assign(__assign({}, body2Typography), { weight: 'bold' });
var subtitleTypography = __assign(__assign({}, normalTypography), { height: '18px', weight: 'normal' });
var labelTypography = __assign(__assign({}, normalTypography), { size: '12px', height: '16px', textTransform: 'uppercase', weight: 'bold' });
var smallNavLinkTypography = __assign(__assign({}, normalTypography), { size: '13px' });
var largeNavLinkTypography = __assign(__assign({}, normalTypography), { weight: 'normal', size: '18px' });
var typographies = {
    normal: normalTypography,
    display: displayTypography,
    h1: h1Typography,
    h2: h2Typography,
    h3: h3Typography,
    h4: h4Typography,
    body1: body1Typography,
    body1Bold: body1BoldTypography,
    body2: body2Typography,
    body2Bold: body2BoldTypography,
    caption: captionTypography,
    captionBold: captionBoldTypography,
    title: titleTypography,
    subtitle: subtitleTypography,
    label: labelTypography,
    links: {
        nav: {
            large: largeNavLinkTypography,
            small: smallNavLinkTypography,
        },
    },
};
export var DefaultTheme = {
    colors: colors,
    typographies: typographies,
    themeName: 'Default',
};
//# sourceMappingURL=default.js.map