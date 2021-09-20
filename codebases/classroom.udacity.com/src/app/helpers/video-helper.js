import NanodegreeHelper from 'helpers/nanodegree-helper';
import {
    i18n
} from 'services/localization-service';

const VideoHelper = {
    // When updating this function in classroom, update it in coco-web if necessary.
    isYoutubeBlocked(nanodegree) {
        const isChinaUser = i18n.getCountryCode() === 'CN';
        // Some of our big India enterprise customers are blocking Youtube
        const isIndiaUser = i18n.getCountryCode() === 'IN';
        const isEnterprise = NanodegreeHelper.isEnterprise(nanodegree);
        return isChinaUser || (isIndiaUser && isEnterprise);
    },

    isAlternativePlayer(nanodegree) {
        return this.isYoutubeBlocked(nanodegree);
    },
};

export default VideoHelper;