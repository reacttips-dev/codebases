import {
    createGADataset
} from '~/lib/ga-helpers'

import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

export const gaCategory = 'homepage'
export const gaEvent = 'top_carousel'

export const gaLabels = {
    ClickArrowLeft: 'click_left_arrow',
    ClickArrowRight: 'click_right_arrow',
    ClickSlot: 'click_slot_',
    ClickTalentName: 'click_talent_name_'
}

export const gaDataset = createGADataset(gaCategory, gaEvent)

const trackSliderEvent = gaLabel => trackGAEvent(gaCategory, gaEvent, gaLabel)

export const trackCardClick = index =>
    trackSliderEvent(`${gaLabels.ClickSlot}${index}`)