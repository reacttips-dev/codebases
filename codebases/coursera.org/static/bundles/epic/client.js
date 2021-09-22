/**
 * Module singleton EpicClient.
 * @see clientFactory.js
 *
 * Documentation at https://coursera.atlassian.net/wiki/spaces/EN/pages/46334100/EPIC
 *
 * Only the parameters defined in epic_site.json can be overridden.
 * Please define the parameters in the epic_site if the parameter you
 * want to experiment is not defined yet.
 *
 * Usage:
 *   import epicClient from 'bundles/epic/client';
 *   const value = epicClient.get("replace by namespace", "replace by parameter name");
 *
 * WARNING: The get function may send an impression to eventing depending on
 * whether the parameter is overridden or not. So, please make sure
 * that the returned variable is used in the following code,
 * otherwise, you might have corrupted data for your experiments.
 */

import EpicClient from 'bundles/epic/lib/EpicClient';

import Multitracker from 'js/app/multitrackerSingleton';

// bundles/epic/data/overrides is injected by edge
import overrides from 'bundles/epic/data/overrides';

const epicClientSingleton = new EpicClient(Multitracker.pushV2.bind(Multitracker), overrides);

export default epicClientSingleton;
