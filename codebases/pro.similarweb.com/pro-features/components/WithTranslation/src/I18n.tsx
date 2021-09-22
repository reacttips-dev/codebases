import React, { memo, ComponentType, FC, HTMLProps, useContext } from "react";
import { TranslationContext } from "./TranslationProvider";

interface I18nProps
    extends Omit<HTMLProps<HTMLSpanElement>, "translate" | "dangerouslySetInnerHTML"> {
    children: string | React.ReactNode;
    dataObj?: Record<string, any>;
    dangerouslySetInnerHTML?: boolean;
    component?: string | ComponentType<any>;
}

export const useTranslation = () => {
    const { t } = useContext(TranslationContext);

    return t;
};

const I18n: FC<I18nProps> = (props) => {
    const {
        dataObj,
        dangerouslySetInnerHTML,
        children,
        component: Component,
        ...restProps
    } = props;
    const { t } = useContext(TranslationContext);
    const text = children.toString().replace(/(^['"])|(['"])$/g, "");

    return dangerouslySetInnerHTML ? (
        <Component
            {...restProps}
            data-automation-i18n-key={text}
            dangerouslySetInnerHTML={{ __html: t(text, dataObj) }}
        />
    ) : (
        <Component {...restProps} data-automation-i18n-key={text}>
            {t(text, dataObj)}
        </Component>
    );
};

I18n.displayName = "I18n";

I18n.defaultProps = {
    component: "span",
    dangerouslySetInnerHTML: false,
    dataObj: undefined,
};

export default memo(I18n);
