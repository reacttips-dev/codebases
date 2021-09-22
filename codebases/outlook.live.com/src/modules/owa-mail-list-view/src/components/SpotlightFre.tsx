import { Image } from '@fluentui/react/lib/Image';
import { Link } from '@fluentui/react/lib/Link';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { getOwaResourceUrl } from 'owa-resource-url';
import { Lightable, lighted, LightningId } from 'owa-lightning-v2';
import loc from 'owa-localize';
import * as React from 'react';
import { lazyGetSpotlightCount } from 'owa-mail-spotlight';
import {
    spotlightFreTitle,
    spotlightFreDescription,
    spotlightCtaButtonLabel,
} from './SpotlightFre.locstring.json';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { getIsLightBaseTheme, getIsDarkBaseTheme } from 'owa-theme';
import { getIsMsHighContrast } from 'owa-high-contrast';

import styles from './SpotlightFre.scss';

import SPOTLIGHT_FRE_LIGHT_SVG from '../svg/spotlight/spotlightFRE_light.svg';
import SPOTLIGHT_FRE_LIGHT_GRAYSCALE_SVG from '../svg/spotlight/spotlightFRE_light_grayscale.svg';
import SPOTLIGHT_FRE_DARK_SVG from '../svg/spotlight/spotlightFRE_dark.svg';
import SPOTLIGHT_FRE_DARK__GRAYSCALE_SVG from '../svg/spotlight/spotlightFRE_dark_grayscale.svg';
import SPOTLIGHT_FRE_HC_SVG from '../svg/spotlight/spotlightFRE_hc.svg';

export default observer(function SpotlightFre() {
    /**
     * Callback for when user clicks the "Got It" button in the FRE which means
     * we shouldn't show it again to this user in the future.
     */
    const onGotItClicked = () => {
        lighted(LightningId.SpotlightFre);
        logUsage('Spotlight_TeachingMomentDismissed');
    };

    const getSpotlightCount = lazyGetSpotlightCount.tryImportForRender();
    if (!getSpotlightCount || getSpotlightCount() === 0) {
        return null;
    }

    const when = lightup => lightup();

    return (
        <Lightable lid={LightningId.SpotlightFre} when={when}>
            <div className={styles.spotlightFreOuterContainer}>
                <div className={styles.spotlightFreContainer}>
                    <Image
                        title={loc(spotlightFreTitle)}
                        className={styles.spotlightFreImage}
                        shouldFadeIn={false}
                        src={getOwaResourceUrl(getSvgForTheme())}
                    />
                    <span className={styles.spotlightFreTitle}>{loc(spotlightFreTitle)}</span>
                    <span className={styles.spotlightFreDescription}>
                        {loc(spotlightFreDescription)}
                    </span>
                    <Link styles={{ root: styles.spotlightCta }} onClick={onGotItClicked}>
                        {loc(spotlightCtaButtonLabel)}
                    </Link>
                </div>
            </div>
        </Lightable>
    );
});

function getSvgForTheme() {
    if (getIsMsHighContrast()) {
        return SPOTLIGHT_FRE_HC_SVG;
    }

    // colorful theme svg
    if (getIsLightBaseTheme()) {
        return SPOTLIGHT_FRE_LIGHT_SVG;
    }

    // dark theme svg
    if (getIsDarkBaseTheme()) {
        return SPOTLIGHT_FRE_DARK_SVG;
    }

    // dark theme grayscale svg
    if (getIsDarkTheme()) {
        return SPOTLIGHT_FRE_DARK__GRAYSCALE_SVG;
    }

    // colorful theme grayscale svg
    return SPOTLIGHT_FRE_LIGHT_GRAYSCALE_SVG;
}
