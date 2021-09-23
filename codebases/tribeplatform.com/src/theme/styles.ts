import { textStyles } from './foundations/typography';
const styles = {
    global: () => ({
        body: {
            color: 'label.primary',
            bg: 'bg.secondary',
            lineHeight: 'base',
            overflow: 'hidden auto',
            '--tribe-opacity-none': 1,
            '--tribe-opacity-disabled': 0.5,
            '--tribe-opacity-invisible': 0,
        },
        a: {
            ...textStyles['regular/medium'],
            cursor: 'pointer',
            color: 'accent.base',
        },
        h1: {
            ...textStyles['semantic/h1'],
        },
        h2: {
            ...textStyles['semantic/h2'],
        },
        h3: {
            ...textStyles['semantic/h3'],
        },
        h4: {
            ...textStyles['semantic/h4'],
        },
        h5: {
            ...textStyles['semantic/h5'],
        },
        h6: {
            ...textStyles['semantic/h6'],
        },
        p: {
            ...textStyles['regular/medium'],
        },
        li: {
            ...textStyles['regular/medium'],
        },
        '.composer h2': {
            ...textStyles['semibold/xlarge'],
            lineHeight: '28px',
            marginTop: 4,
        },
        '.composer h3': {
            ...textStyles['medium/large'],
            lineHeight: '28px',
            marginTop: 3,
        },
        '.composer p': {
            ...textStyles['regular/medium'],
            lineHeight: '24px',
            marginTop: 2,
        },
        '.composer ul, .composer ol': {
            marginTop: 2,
            paddingLeft: '8px',
        },
        '.composer li': {
            ...textStyles['regular/medium'],
            lineHeight: '24px',
            marginTop: 1,
        },
        '.ql-syntax, code': {
            color: 'label.primary',
            bg: 'bg.secondary',
            padding: '10px',
            borderRadius: '3px',
            whiteSpace: 'pre-wrap',
            marginTop: 1,
        },
        code: { padding: '3px 5px' },
        div: {
            _focus: {
                outline: 'none',
            },
        },
        ':root': {
            '--tribe-opacity-disabled': '0.4',
        },
    }),
};
export default styles;
//# sourceMappingURL=styles.js.map