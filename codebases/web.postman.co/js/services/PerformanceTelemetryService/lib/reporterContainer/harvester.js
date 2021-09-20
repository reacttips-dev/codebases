import coreContainer from '../coreContainer';
import eventQueue from './eventQueue';
import addEventToVendorQueue from './addEventToVendorQueue';

/**
 * Helper function used to instantiate the harvester
 *
 */
function initializeHarvester () {
  const { harvestStart, harvestInterval, rateLimit } = coreContainer.initialization.getClientInformation();

  setTimeout(() => {
    // Do an initial harvesting after an interval of `harvestStart`
    harvestEvents(rateLimit);

    // Setup a recurring harvesting cycle at every `harvestInterval`
    setInterval(() => {
      harvestEvents(rateLimit);
    }, harvestInterval);
  }, harvestStart);

  // For pending events before unload, harvest one final time during unload and push the events to vendor
  // The vendor sends any events captured here to the backend through the beacon API
  window.addEventListener('beforeunload', function () {
    harvestEvents(rateLimit);
  });
}

/**
 * Helper function used to harvest events up to the rate limit
 *
 */
function harvestEvents (rateLimit) {

  // Harvest events up to the rateLimit and keep rest of the events pending till next cycle
  for (let i = 0; i < rateLimit; i++) {
    if (eventQueue.isEmpty()) {
      break;
    }
    let event = eventQueue.dequeue();
    addEventToVendorQueue(event);
  }
}

export default initializeHarvester;
