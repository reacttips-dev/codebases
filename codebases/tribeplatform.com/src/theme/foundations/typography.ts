export const fontSizes = {
    xs: '12px',
    sm: '13px',
    md: '15px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '36px',
    '4xl': '44px',
};
export const fontWeights = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
};
export const textStyles = {
    'regular/xsmall': {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.regular,
        lineHeight: '14px',
    },
    'regular/small': {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.regular,
        lineHeight: '18px',
    },
    'regular/medium': {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.regular,
        lineHeight: '18px',
    },
    'regular/large': {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.regular,
        lineHeight: '22px',
    },
    'regular/xlarge': {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.regular,
        lineHeight: '24px',
    },
    'regular/2xlarge': {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.regular,
        lineHeight: '30px',
    },
    'regular/3xlarge': {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.regular,
        lineHeight: '44px',
    },
    'regular/4xlarge': {
        fontSize: fontSizes['4xl'],
        fontWeight: fontWeights.regular,
        lineHeight: '54px',
    },
    'medium/xsmall': {
        fontWeight: fontWeights.medium,
        fontSize: fontSizes.xs,
        lineHeight: '14px',
    },
    'medium/small': {
        fontWeight: fontWeights.medium,
        fontSize: fontSizes.sm,
        lineHeight: '16px',
    },
    'medium/medium': {
        fontWeight: fontWeights.medium,
        fontSize: fontSizes.md,
        lineHeight: '18px',
    },
    'medium/large': {
        fontSize: fontSizes.lg,
        lineHeight: '22px',
        fontWeight: fontWeights.medium,
    },
    'medium/xlarge': {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.medium,
        lineHeight: '24px',
    },
    'medium/2xlarge': {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.medium,
        lineHeight: '30px',
    },
    'medium/3xlarge': {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.medium,
        lineHeight: '44px',
    },
    'medium/4xlarge': {
        fontSize: fontSizes['4xl'],
        fontWeight: fontWeights.medium,
        lineHeight: '54px',
    },
    'semibold/xsmall': {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.semibold,
        lineHeight: '14px',
    },
    'semibold/small': {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        lineHeight: '16px',
    },
    'semibold/medium': {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        lineHeight: '18px',
    },
    'semibold/large': {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.semibold,
        lineHeight: '22px',
    },
    'semibold/xlarge': {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        lineHeight: '24px',
    },
    'semibold/2xlarge': {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.semibold,
        lineHeight: '30px',
    },
    'semibold/3xlarge': {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.semibold,
        lineHeight: '44px',
    },
    'semibold/4xlarge': {
        fontSize: fontSizes['4xl'],
        fontWeight: fontWeights.semibold,
        lineHeight: '54px',
    },
    'bold/xsmall': {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        lineHeight: '14px',
    },
    'bold/small': {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        lineHeight: '16px',
    },
    'bold/medium': {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: '18px',
    },
    'bold/large': {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        lineHeight: '22px',
    },
    'bold/xlarge': {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        lineHeight: '24px',
    },
    'bold/2xlarge': {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.bold,
        lineHeight: '30px',
    },
    'bold/3xlarge': {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.bold,
        lineHeight: '44px',
    },
    'bold/4xlarge': {
        fontSize: fontSizes['4xl'],
        fontWeight: fontWeights.bold,
        lineHeight: '54px',
    },
};
textStyles['semantic/h1'] = textStyles['semibold/4xlarge'];
textStyles['semantic/h2'] = textStyles['semibold/3xlarge'];
textStyles['semantic/h3'] = textStyles['semibold/2xlarge'];
textStyles['semantic/h4'] = textStyles['semibold/xlarge'];
textStyles['semantic/h5'] = textStyles['semibold/medium'];
textStyles['semantic/h6'] = textStyles['semibold/small'];
textStyles['semantic/body/xlarge'] = {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: '30px',
};
textStyles['semantic/body/large'] = textStyles['regular/medium'];
textStyles['semantic/body/normal'] = textStyles['regular/small'];
textStyles['semantic/body/small'] = {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: '18px',
};
//# sourceMappingURL=typography.js.map