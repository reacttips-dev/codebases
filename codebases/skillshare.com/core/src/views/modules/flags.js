import 'jquery-cookie';

export default function getTreatment(name) {
  if (!SS.serverBootstrap.flags) {
    return false;
  }
  return SS.serverBootstrap.flags[name];
}

export function getAllFlagTreatments() {
  if (!SS.serverBootstrap.flags) {
    return {};
  }

  return SS.serverBootstrap.flags;
}

// gr_mui_auth
export function shouldMUIAuth() {
  return getTreatment('gr_mui_auth') == 'on';
}

export function shouldRenderPictureInPicture() {
  return getTreatment('learning_user_pip') === 'on';
}

export function isMultiLanguageSubtitlesEnabled() {
  return getTreatment('lx_ml_sbs') === 'on';
}

export function deferredVideoPlayerTestIsActive() {
  return getTreatment('lx_growth_vpdl') === 'on';
}

// sft_bk_invite
// sft_bk_resend
// sft_bk_export
// sft_bk_remove
export function shouldRenderSftDropdown() {
  return getTreatment('sft_bk_invite') === 'on'
    || getTreatment('sft_bk_resend') === 'on'
    || getTreatment('sft_bk_export') === 'on'
    || getTreatment('sft_bk_remove') === 'on';
}

export function shouldRenderClassCreatorUpdates() {
  return getTreatment('lx_cc_sqs') === 'on';
}

export function shouldRenderLihVideoPromo() {
  return getTreatment('disc_lih_video_promo') === 'on';
}

export function shouldRenderMuiBanner() {
  return getTreatment('disc_mui_promo_banner') === 'on';
}

// disc_onboard_selection
export function shouldShowOnboardingSelection() {
  return getTreatment('disc_onboard_selection') === 'on';
}

export function shouldTurnOnCaptionsByDefault() {
  return getTreatment('lx_translated_subtitles_on_by_default') === 'on';
}

export function shouldRenderLocdAboveTheFold() {
  return getTreatment('gr_locd_atf') === 'on';
}
