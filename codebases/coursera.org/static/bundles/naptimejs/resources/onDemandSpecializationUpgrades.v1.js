import NaptimeResource from './NaptimeResource';

class OnDemandSpecializationUpgrades extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandSpecializationUpgrades.v1';

  static createStayAction(body) {
    return this.action('decline', body, {});
  }
}

export default OnDemandSpecializationUpgrades;
