import React, { useMemo } from 'react';
import { Accordion as ChakraAccordion, AccordionButton as ChakraAccordionButton, AccordionIcon as ChakraAccordionIcon, AccordionItem as ChakraAccordionItem, AccordionPanel as ChakraAccordionPanel, useMultiStyleConfig, } from '@chakra-ui/react';
import { UserBar } from '../UserBar';
export const AccordionGroup = (props) => {
    const styles = useMultiStyleConfig('Accordion', {});
    return (React.createElement(ChakraAccordion, Object.assign({ sx: { ...styles.container, boxShadow: props === null || props === void 0 ? void 0 : props.boxShadow }, allowToggle: true }, props)));
};
export const AccordionButton = (props) => (React.createElement(ChakraAccordionButton, Object.assign({}, props)));
export const AccordionIcon = props => React.createElement(ChakraAccordionIcon, Object.assign({}, props));
export const AccordionItem = ({ title, titleProps, subtitle, subtitleProps, header, children, panelProps, headerProps, icon, iconProps, onClick, ...props }) => {
    const styles = useMultiStyleConfig('Accordion', {});
    // UserBar title props
    const userBarTitleProps = useMemo(() => ({
        sx: styles.title,
        // If subtitle is passed
        // show smaller title
        fontSize: 'md',
        fontWeight: 'medium',
        lineHeight: '18px',
        ...titleProps,
    }), [titleProps, styles.title]);
    // UserBar subtitle props
    const userBarSubTitleProps = useMemo(() => ({
        sx: styles.subtitle,
        marginTop: 1,
        ...subtitleProps,
    }), [subtitleProps, styles.subtitle]);
    return (React.createElement(ChakraAccordionItem, Object.assign({ sx: styles.item }, props), ({ isExpanded }) => (React.createElement(React.Fragment, null,
        React.createElement(AccordionButton, Object.assign({ sx: styles.button, "data-testid": "accordion-header", onClick: onClick }, headerProps),
            header || (React.createElement(UserBar, { "data-testid": "accordion-userbar", withPicture: !!icon, picture: icon, title: title, titleProps: userBarTitleProps, subtitle: typeof subtitle === 'object'
                    ? React.cloneElement(subtitle, {
                        isExpanded,
                    })
                    : subtitle, subtitleProps: userBarSubTitleProps, maxW: "full" })),
            React.createElement(AccordionIcon, Object.assign({ sx: styles.toggleIcon }, iconProps))),
        children && (React.createElement(AccordionPanel, Object.assign({ "data-testid": "accordion-content" }, panelProps), children))))));
};
export const Accordion = (props) => {
    const { defaultIndex, groupProps, ...rest } = props;
    return (React.createElement(AccordionGroup, Object.assign({ defaultIndex: defaultIndex }, groupProps),
        React.createElement(AccordionItem, Object.assign({}, rest))));
};
export const AccordionPanel = (props) => (React.createElement(ChakraAccordionPanel, Object.assign({}, props)));
export default Accordion;
//# sourceMappingURL=index.js.map