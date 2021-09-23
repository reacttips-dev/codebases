import { generateStripe, getColor, mode } from '@chakra-ui/theme-tools';
const parts = ['track', 'filledTrack', 'label'];
function filledStyle(props) {
    const { theme: t, isIndeterminate, hasStripe, value } = props;
    const stripeStyle = mode(generateStripe(), generateStripe('1rem', 'rgba(0,0,0,0.1)'))(props);
    let bgColor = 'accent.base';
    if (value < 20) {
        bgColor = 'danger.base';
    }
    else if (value < 40) {
        bgColor = 'warning.base';
    }
    const gradient = `linear-gradient(
    to right,
    transparent 0%,
    ${getColor(t, bgColor)} 50%,
    transparent 100%
  )`;
    const addStripe = !isIndeterminate && hasStripe;
    return {
        ...(addStripe && stripeStyle),
        ...(isIndeterminate ? { bgImage: gradient } : { bgColor }),
    };
}
const baseStyleLabel = {
    lineHeight: '1',
    fontSize: '0.25em',
    fontWeight: 'bold',
    color: 'white',
};
function baseStyleTrack() {
    return {
        bg: 'bg.secondary',
        borderRadius: 'md',
    };
}
function baseStyleFilledTrack(props) {
    return {
        transition: 'all 0.3s',
        ...filledStyle(props),
    };
}
const baseStyle = (props) => ({
    label: baseStyleLabel,
    filledTrack: baseStyleFilledTrack(props),
    track: baseStyleTrack(),
});
const sizes = {
    xs: {
        track: { h: '0.25rem' },
    },
    sm: {
        track: { h: '0.5rem' },
    },
    md: {
        track: { h: '0.75rem' },
    },
    lg: {
        track: { h: '1rem' },
    },
};
const defaultProps = {
    size: 'md',
};
export default {
    parts,
    sizes,
    baseStyle,
    defaultProps,
};
//# sourceMappingURL=Progress.style.js.map