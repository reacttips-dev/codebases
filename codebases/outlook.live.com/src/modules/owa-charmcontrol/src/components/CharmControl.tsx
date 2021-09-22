import { observer } from 'mobx-react-lite';
import * as React from 'react';
import type CharmControlColorProps from './CharmControlColorProps';
import { changeSvgColor } from '../utils/CharmControlUtils';
import { getCharmForId, lazyLoadCharmSvgTextInMap } from 'owa-calendar-charms-store';
import isNewDefaultCharmIconEnabled from '../utils/isNewDefaultCharmIconEnabled';

export interface CharmControlProps {
    iconId: number;
    className?: string;
    colorProps?: CharmControlColorProps;
}

/*
 * <SVG> can't have its DOM elements modified when it comes from a CORS origin.
 * Because of this, we need to create a request, fetch the object as a string,
 * we apply some processing to it to set the appropiate charm color.
 * Then we insert it using dangerouslySetInnerHTML.
 */
export default observer(function CharmControl(props: CharmControlProps) {
    React.useEffect(() => {
        lazyLoadCharmSvgTextInMap.importAndExecute(props.iconId);
    }, [props.iconId]);
    /**
     * dangerouslySetInnerHTML needs that the code to be inserted is preceded by '__html:'
     */
    const prepareSvgForInnerHtmlInsertion = () => {
        let text = processSvgTag();
        return { __html: text };
    };
    /**
     * This function sets the SVG size, color and updates the CharmControl's state.
     */
    const processSvgTag = () => {
        let text = getCharmForId(props.iconId).SvgHtmlText;
        text = changeSvgColor(props.iconId, text, props.colorProps);
        return text;
    };

    const showDefaultCharmIcon = isNewDefaultCharmIconEnabled() && props.iconId === 0;

    return (
        /* tslint:disable:react-no-dangerous-html */
        /* eslint-disable react/no-danger */
        <div
            className={props.className}
            id={'CharmControlID' + props.iconId}
            dangerouslySetInnerHTML={
                showDefaultCharmIcon ? null : prepareSvgForInnerHtmlInsertion()
            }
        />
        /* eslint-enable react/no-danger */
        /* tslint:enable:react-no-dangerous-html */
    );
});
