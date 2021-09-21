import actions from './actions';
import AnchorAPI from '../../../modules/AnchorAPI';

const {
  resetStore,
  setAdDetails,
  setIsShowing,
  setAdAudio,
  setIsHouseAd,
  setIsMidrollRequired,
  setCompanyUrl,
  setCpmInCents,
  setCompanyName,
  setIsPlayingAd,
  setExampleAdAudioUrl,
  setIsPlayingExampleAd,
  setIsAnchorPaymentsActivated,
  setIsShowingSubmissionProgressOverlay,
  setIsShowingSuccessConfirmationOverlay,
  setIsShowingRecordAgainConfirmationOverlay,
  setIsShowingNotInterestedConfirmationOverlay,
  setCampaignId,
  setAdScript,
  setCurrentTab,
  setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay,
  setIsShowingMidrollRequirementOverlay,
} = actions;

const openModalAndSetupForCampaign = ({
  id,
  script,
  details = null,
  companyUrl,
  cpmInCents,
  exampleAudioUrl,
  sponsorName,
  isHouseAd,
  isAnchorPaymentsActivated,
  isMidrollRequired,
}) => dispatch => {
  if (exampleAudioUrl) {
    dispatch(setExampleAdAudioUrl(exampleAudioUrl));
  }
  dispatch(setCampaignId(id));
  dispatch(setIsAnchorPaymentsActivated(isAnchorPaymentsActivated));
  dispatch(setIsHouseAd(isHouseAd));
  dispatch(setIsMidrollRequired(isMidrollRequired));
  dispatch(setAdDetails(details));
  dispatch(setAdScript(script));
  dispatch(setCompanyUrl(companyUrl));
  dispatch(setCpmInCents(cpmInCents));
  dispatch(setCompanyName(sponsorName));
  dispatch(setIsShowing(true));
};

const playExampleAd = () => dispatch => {
  dispatch(setIsPlayingExampleAd(true));
};
const pauseExampleAd = () => dispatch => {
  dispatch(setIsPlayingExampleAd(false));
};

const playAd = () => dispatch => {
  dispatch(setIsPlayingAd(true));
};

const pauseAd = () => dispatch => {
  dispatch(setIsPlayingAd(false));
};

const closeModalAndResetStore = () => dispatch => {
  dispatch(resetStore());
  dispatch(setIsShowing(false));
};

const fetchEnableSponsorshipsOnAllEpisodesAndCloseModal = () => (
  dispatch,
  getState
) => {
  const {
    global: {
      podcast: {
        podcast: { stationId: webStationId },
      },
    },
    adRecordingModalScreen: { isMidrollRequired },
  } = getState();
  return AnchorAPI.enableSponsorshipsOnAllEpisodes(webStationId)
    .then(() => {
      if (!isMidrollRequired) {
        dispatch(closeModalAndResetStore());
      } else {
        dispatch(
          setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay(false)
        );
        dispatch(setIsShowingMidrollRequirementOverlay(true));
      }
    })
    .catch(err => {});
};

const uploadAdAudioForCampaign = ({ campaignId, adAudio }) => (
  dispatch,
  getState
) => {
  const {
    global: {
      podcast: {
        podcast: { stationId: webStationId },
      },
    },
  } = getState();
  const uploadAdAudio = _adAudio => {
    const isRecording = _adAudio.type === 'recording';
    const isUploaded = _adAudio.type === 'upload';
    const audioBlobOrFile = isRecording
      ? _adAudio.blob
      : isUploaded
      ? _adAudio.file
      : null;
    if (!audioBlobOrFile)
      throw new Error('onSubmit: upload type must be Blob or File');
    return AnchorAPI.uploadAudioFile(
      audioBlobOrFile,
      percentOfUploadComplete => {
        console.log(`${percentOfUploadComplete}%`);
      },
      () => {
        console.log('processing did start...');
      }
    );
  };
  return uploadAdAudio(adAudio).then(uploadAdAudioResponseJSON => {
    const {
      audio: { audioId },
    } = uploadAdAudioResponseJSON;
    return AnchorAPI.publishExistingAudioAsAd({
      adCampaignId: campaignId,
      webAudioId: audioId,
      webStationId,
    })
      .then(publishAudioResponseJSON => {
        const { doShowActivateAllButton } = publishAudioResponseJSON;
        // TODO https://anchorfm.atlassian.net/browse/PODRACER-1954: Add Proper Polling to Wait for Newly Uploaded Ad Audio to Fully Process
        setTimeout(() => {
          dispatch(setIsShowingSubmissionProgressOverlay(false));
          if (doShowActivateAllButton) {
            dispatch(
              setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay(
                true
              )
            );
          } else {
            dispatch(setIsShowingSuccessConfirmationOverlay(true));
          }
        }, 5000);
      })
      .catch(err => {
        // TODO: Need to do something here
        console.log(err);
      });
  });
};

export default {
  fetchEnableSponsorshipsOnAllEpisodesAndCloseModal,
  uploadAdAudioForCampaign,
  openModalAndSetupForCampaign,
  closeModalAndResetStore,
  resetStore,
  setAdAudio,
  setCurrentTab,
  setAdDetails,
  setIsShowing,
  setCompanyUrl,
  setCpmInCents,
  setAdScript,
  playExampleAd,
  playAd,
  pauseExampleAd,
  pauseAd,
  setCompanyName,
  setExampleAdAudioUrl,
  setIsShowingSubmissionProgressOverlay,
  setIsShowingSuccessConfirmationOverlay,
  setIsShowingRecordAgainConfirmationOverlay,
  setIsShowingNotInterestedConfirmationOverlay,
  setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay,
  setIsShowingMidrollRequirementOverlay,
};
