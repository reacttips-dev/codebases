const parts = ['container', 'title', 'icon'];
const baseStyle = {
    container: {
        px: 4,
        py: 3,
        alignItems: 'start',
        textAlign: 'left',
        fontSize: 'md',
    },
    title: {
        fontWeight: 'semibold',
        lineHeight: 'base',
        mr: 2,
    },
    description: {
        fontWeight: 'regular',
        fontSize: 'sm',
    },
    icon: {
        mr: 4,
        w: 4,
        h: 6,
    },
};
const colors = {
    error: {
        container: {
            bg: 'danger.lite',
        },
        icon: {
            color: 'danger.base',
        },
    },
    success: {
        container: {
            bg: 'success.lite',
        },
        icon: {
            color: 'success.base',
        },
    },
    warning: {
        container: {
            bg: 'warning.lite',
        },
        icon: {
            color: 'warning.base',
        },
    },
    info: {
        container: {
            bg: 'border.lite',
        },
        icon: {
            color: 'border.base',
        },
    },
    neutral: {
        container: {
            bg: 'bg.base',
        },
        icon: {
            color: 'label.primary',
        },
    },
};
function variantSubtle(props) {
    const { status } = props;
    return {
        container: {
            bg: colors[status].container.bg,
        },
        icon: {
            color: colors[status].icon.color,
        },
    };
}
function variantLeftAccent(props) {
    const { status } = props;
    return {
        container: {
            pl: 3,
            bg: colors[status].container.bg,
        },
        icon: {
            color: colors[status].icon.color,
        },
    };
}
function variantTopAccent(props) {
    const { status } = props;
    return {
        container: {
            pt: 2,
            bg: colors[status].container.bg,
        },
        icon: {
            color: colors[status].icon.color,
        },
    };
}
function variantSolid(props) {
    const { status } = props;
    return {
        container: {
            bg: colors[status].container.bg,
            color: 'label.button',
        },
    };
}
function variantNeutral() {
    return {
        container: {
            bg: 'bg.secondary',
        },
        icon: {
            color: 'label.primary',
        },
    };
}
const variantOutline = {
    container: {
        px: 4,
        pl: 4,
        pr: 8,
        bg: 'bg.base',
        color: 'tertiary',
    },
    title: {
        color: 'label.primary',
    },
    description: {
        color: 'tertiary',
        lineHeight: 'tall',
    },
    icon: {
        color: 'tertiary',
        mr: 3,
    },
};
const variants = {
    subtle: variantSubtle,
    'left-accent': variantLeftAccent,
    'top-accent': variantTopAccent,
    solid: variantSolid,
    outline: variantOutline,
    neutral: variantNeutral,
};
const defaultProps = {
    variant: 'subtle',
};
export default {
    parts,
    baseStyle,
    variants,
    defaultProps,
};
//# sourceMappingURL=style.js.map