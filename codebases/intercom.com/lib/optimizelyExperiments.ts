export const VBP_MAY2021_VARIATIONS: { [key: string]: string } = {
  control: 'VBP 1.2',
  /* eslint-disable @typescript-eslint/camelcase */
  variation_1: 'VBP 1.2',
  variation_2: 'PPP',
  variation_3: 'VBP 2.0',
  /* eslint-enable @typescript-eslint/camelcase */
}

export const VBP_MAY2021_EXPERIMENT_NAME = 'vbp_2_0_starter'

/**
 * These keys correspond to Optimizely experiments that should be ran on EVERY PAGE of the site.
 * A test can be safely added or removed from this list at any time, before or after de/activation.
 */
export const FULL_SITE_EXPERIMENTS = [VBP_MAY2021_EXPERIMENT_NAME, 'email_verification_test']

/**
 * For these experiments, an impression WILL get sent to Optimizely. This should be used sparingly—
 * we are already over our Optimizely limit for the year of 2020. Only enable experiments that are
 * relatively rarely encountered.
 *
 * WiderFunnel will be the main folks adding experiments to this list. Intercomrades can view
 * experiment results inside of GtmTracking tables.
 */
export const SEND_OPTIMIZELY_IMPRESSIONS = [
  'wf_e41_trial_or_demo_chooser',
  'wf_e38_solutions_pages_content_bundle_vs_single_asset',
]
