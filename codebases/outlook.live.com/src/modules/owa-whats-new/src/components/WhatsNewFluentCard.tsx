import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { getStore } from '../store/store';
import { Icon } from '@fluentui/react/lib/Icon';
import { toggleWhatsNewCardHoverStatus } from '../mutators/toggleWhatsNewCardHoverStatus';
import { logWhatsNewCardRead } from '../utils/logDatapoint';
import { WhatsNewCardStatus } from '../store/schema/WhatsNewCardStatus';
import type { WhatsNewCardProperty } from '../store/schema/WhatsNewCardProperty';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { postReadCount } from '../services/postReadCount';
import { whatsNew_Card_NonPremiumRibbon_Default } from '../strings.locstring.json';
import loc from 'owa-localize';
import { ControlIcons } from 'owa-control-icons';
import { WhatsNewCardType } from '../store/schema/WhatsNewCardType';
import { Depths } from '@fluentui/theme';

import Styles from './WhatsNewFluentCard.scss';
import ClassNames from 'classnames';

export default observer(function WhatsNewFluentCard(props: WhatsNewCardProperty) {
    React.useEffect(() => {
        if (getStore().cards[props.identity].autoExpandFlexPane) {
            postReadCount([props.identity]);
        }
    }, []);
    const headerElement = React.useRef<HTMLElement>();
    const isRead = {
        get(): boolean {
            return getStore().cards[props.identity].status === WhatsNewCardStatus.Read;
        },
    };
    const onMouseEnter = () => {
        let store = getStore();
        toggleWhatsNewCardHoverStatus(store.cards[props.identity], true);
    };
    const onMouseLeave = () => {
        let card = getStore().cards[props.identity];
        toggleWhatsNewCardHoverStatus(card, false);
        if (card.status === WhatsNewCardStatus.Unread) {
            logWhatsNewCardRead(card.identity);
        }
    };
    let store = getStore();
    return (
        props.identity in getStore().cards && (
            <li
                className={Styles.whatsNewCard}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
                <div
                    className={ClassNames([
                        Styles.whatsNewCardContent,
                        isRead.get()
                            ? Styles.whatsNewCardReadState
                            : Styles.whatsNewCardUnreadState,
                    ])}
                    style={
                        store.cards[props.identity].isHovered
                            ? { boxShadow: Depths.depth16 }
                            : { boxShadow: Depths.depth4 }
                    }>
                    {store.cards[props.identity].featureType !== WhatsNewCardType.Free && (
                        <div className={Styles.premiumHeader}>
                            <Icon
                                className={Styles.premiumHeaderIcon}
                                iconName={ControlIcons.Diamond}
                            />
                            <div className={Styles.premiumHeaderText}>
                                {loc(whatsNew_Card_NonPremiumRibbon_Default)}
                            </div>
                        </div>
                    )}
                    <div
                        className={Styles.whatsNewCardHeader}
                        ref={header => (headerElement.current = header)}>
                        <div className={Styles.whatsNewCardHeaderFlex}>
                            {props.spriteStyleIcon && (
                                <i
                                    className={ClassNames([
                                        ...props.spriteStyleIcon,
                                        Styles.whatsNewCardHeaderIcon,
                                    ])}
                                />
                            )}

                            {props.iconName && (
                                <Icon
                                    className={Styles.whatsNewCardHeaderIcon}
                                    iconName={props.iconName}
                                />
                            )}

                            {props.svgIcon && (
                                <div
                                    className={ClassNames(
                                        Styles.whatsNewCardHeaderSvg,
                                        props.svgIconStyle
                                    )}>
                                    {props.svgIcon}
                                </div>
                            )}

                            <div
                                className={Styles.whatsNewCardHeaderTitle}
                                id={props.identity}
                                tabIndex={0}>
                                {props.title}
                                {props.animation && (
                                    <Icon
                                        className={Styles.whatsNewCardGifIcon}
                                        iconName={ControlIcons.GIF}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={Styles.whatsNewCardBody}>{props.body}</div>
                    {props.animation && (
                        <Callout
                            className={Styles.whatsNewCardCallout}
                            directionalHint={DirectionalHint.leftTopEdge}
                            isBeakVisible={true}
                            target={headerElement.current}
                            hidden={!store.cards[props.identity].isHovered}
                            preventDismissOnScroll={true}
                            preventDismissOnResize={true}
                            preventDismissOnLostFocus={true}
                            gapSpace={20}>
                            {props.animation}
                        </Callout>
                    )}
                </div>
            </li>
        )
    );
});
