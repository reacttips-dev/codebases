import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import { getOwaResourceUrl } from 'owa-resource-url';
import {
    officeCardHeader,
    officeCardTitleTopLeft,
    officeCardTitleTopRight,
    officeCardDoneButtonText,
} from './OfficeAppsCards.locstring.json';
import { DefaultButton } from '@fluentui/react/lib/Button';
import loc, { isCurrentCultureRightToLeft } from 'owa-localize';

const inOrbitBaseImage = 'resources/img/app-icons-in-orbit-base.svg';
const suiteExcelImage = 'resources/img/apps-suite-icon-excel.svg';
const suiteOneDriveImage = 'resources/img/apps-suite-icon-onedrive.svg';
const suiteOneNoteImage = 'resources/img/apps-suite-icon-onenote.svg';
const suitePowerPointImage = 'resources/img/apps-suite-icon-powerpoint.svg';
const suiteSkypeImage = 'resources/img/apps-suite-icon-skype.svg';
const suiteWordImage = 'resources/img/apps-suite-icon-word.svg';
const waffleUpArrow = 'resources/img/waffle-up-arrow.svg';

import styles from './OfficeAppsCard.scss';

const OfficeAppsCard = observer(function OfficeAppsCard(props: { onDismiss: () => void }) {
    const onDialogDismiss = React.useCallback(() => {
        props.onDismiss();
    }, []);

    const isCultureRtl = isCurrentCultureRightToLeft();

    return (
        <>
            <Dialog
                isOpen={true}
                type={DialogType.close}
                onDismiss={onDialogDismiss}
                dialogContentProps={{
                    showCloseButton: true,
                }}
                modalProps={{
                    isDarkOverlay: true,
                    containerClassName: styles.officeAppDialogContainer,
                }}
                title={
                    <div className={styles.officeAppHeader}>
                        <div className={styles.officeCardTitle}>{loc(officeCardHeader)}</div>
                        <div className={styles.officeCardDesc}>
                            {isCultureRtl
                                ? loc(officeCardTitleTopRight)
                                : loc(officeCardTitleTopLeft)}
                        </div>
                    </div>
                }>
                <div className={styles.appIconsInOrbit}>
                    <div className={styles.visualization}>
                        <div className={styles.appTilesTrack}>
                            <img
                                className={styles.outlookLogo}
                                src={getOwaResourceUrl(inOrbitBaseImage)}
                            />
                            <img
                                className={styles.appTile}
                                data-tile="word"
                                src={getOwaResourceUrl(suiteWordImage)}
                            />
                            <img
                                className={styles.appTile}
                                data-tile="powerpoint"
                                src={getOwaResourceUrl(suitePowerPointImage)}
                            />
                            <img
                                className={styles.appTile}
                                data-tile="onedrive"
                                src={getOwaResourceUrl(suiteOneDriveImage)}
                            />
                            <img
                                className={styles.appTile}
                                data-tile="onenote"
                                src={getOwaResourceUrl(suiteOneNoteImage)}
                            />
                            <img
                                className={styles.appTile}
                                data-tile="skype"
                                src={getOwaResourceUrl(suiteSkypeImage)}
                            />
                            <img
                                className={styles.appTile}
                                data-tile="excel"
                                src={getOwaResourceUrl(suiteExcelImage)}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.doneButtonContainer}>
                    <DefaultButton onClick={onDialogDismiss}>
                        {loc(officeCardDoneButtonText)}
                    </DefaultButton>
                </div>
            </Dialog>
            <div className={isCultureRtl ? styles.waffleArrowRTL : styles.waffleArrow}>
                <img className={styles.waffleArrowImage} src={getOwaResourceUrl(waffleUpArrow)} />
            </div>
        </>
    );
});

export default function mountOfficeAppCard(onDismiss?: () => void) {
    let officeAppCardDiv = document.createElement('div');
    officeAppCardDiv.id = 'officeAppCardDiv';
    document.body.appendChild(officeAppCardDiv);

    function onOfficeCardDismiss() {
        ReactDOM.unmountComponentAtNode(officeAppCardDiv);
        document.body.removeChild(officeAppCardDiv);
        if (onDismiss) {
            onDismiss();
        }
    }

    ReactDOM.render(
        <React.StrictMode>
            <OfficeAppsCard onDismiss={onOfficeCardDismiss} />
        </React.StrictMode>,
        officeAppCardDiv
    );
}
