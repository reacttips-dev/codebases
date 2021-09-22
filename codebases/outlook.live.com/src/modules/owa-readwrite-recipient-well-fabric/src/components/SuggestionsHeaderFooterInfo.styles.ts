import { FontSizes } from '@fluentui/style-utilities';
import type {
    SuggestionsHeaderFooterInfoStyleProps,
    SuggestionsHeaderFooterInfoStyles,
} from './SuggestionsHeaderFooterInfo.types';

export const getStyles = (
    props: SuggestionsHeaderFooterInfoStyleProps
): SuggestionsHeaderFooterInfoStyles => {
    const { theme } = props;
    const { palette } = theme;

    return {
        container: [
            {
                height: '48px',
                width: '100%',
                overflow: 'hidden',
                display: 'table',
            },
        ],
        textContainer: [
            {
                fontSize: FontSizes.small,
                width: 'calc(100% - 46px)',
                textAlign: 'left',
                display: 'table-cell',
                verticalAlign: 'middle',
                paddingLeft: '12px',
            },
        ],
        centered: [
            {
                width: '100%',
                textAlign: 'center',
                padding: 0,
            },
        ],
        iconContainer: [
            {
                paddingLeft: '12px',
                paddingTop: '14px',
                width: '32px',
                display: 'table-cell',
                textAlign: 'center',
            },
        ],
        searchIcon: [
            {
                fontSize: FontSizes.xLarge,
                color: palette.themePrimary,
            },
        ],
        useAddressContainer: [
            {
                height: '36px',
            },
        ],
        suggestedContactsText: [
            {
                fontSize: FontSizes.small,
                color: palette.themePrimary,
            },
        ],
        suggestedContactsHeaderBox: [
            {
                height: '30px',
            },
        ],
        headerBorder: [
            {
                borderBottom: '1px solid',
                borderColor: palette.neutralLight,
            },
        ],
        footerBorder: [
            {
                borderTop: '1px solid',
                borderColor: palette.neutralLight,
            },
        ],
        feedbackContainer: [
            {
                display: 'block',
                width: '100%',
                padding: '5px 5px 5px 12px',
                color: palette.themePrimary,
            },
        ],
        verticalCenter: [
            {
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
            },
        ],
        cancelIcon: [
            {
                fontSize: FontSizes.small,
                color: palette.neutralPrimary,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            },
        ],
    };
};
