import _ from 'lodash';

import moment from 'moment';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import ProductOwnership from 'bundles/product/models/productOwnership';
import VerificationDisplay from 'bundles/verificationDisplay/models/verificationDisplay';

const SERIALIZED_PROPS: Array<keyof VerificationStore$DehydratedState> = ['loaded', 'rawVerificationDisplay'];

type VerificationStore$DehydratedState = {
  loaded: boolean;
  rawVerificationDisplay: any;
};

class VerificationStore extends BaseStore {
  static storeName = 'VerificationStore';

  static handlers = {
    LOAD_VERIFICATION_DISPLAY: 'handleLoadVerificationDisplay',
  };

  handleLoadVerificationDisplay(rawVerificationDisplay: any) {
    this.loaded = true;
    this.rawVerificationDisplay = rawVerificationDisplay;
    this.initializeVerificationDisplayModel();
    this.emitChange();
  }

  loaded = false;

  verificationDisplay: any;

  rawVerificationDisplay: any;

  dehydrate(): VerificationStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: VerificationStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
    this.initializeVerificationDisplayModel();
  }

  hasLoaded(): boolean {
    return this.loaded;
  }

  initializeVerificationDisplayModel(): void {
    if (this.rawVerificationDisplay) {
      this.verificationDisplay = new VerificationDisplay({
        ...this.rawVerificationDisplay,
        productOwnership: new ProductOwnership(this.rawVerificationDisplay.productOwnership),
      });
    } else {
      this.verificationDisplay = new VerificationDisplay();
    }
  }

  /**
   * @returns {VerificationDisplay} VerificationDisplay Model
   */
  getVerificationDisplay(): any {
    return this.verificationDisplay;
  }

  showAdvertising(): boolean {
    return !!this.verificationDisplay && this.verificationDisplay.showAdvertising();
  }

  showCCAdvertising(): boolean {
    return !!this.verificationDisplay && this.verificationDisplay.showCCAdvertising();
  }

  showS12nAdvertising(): boolean {
    return !!this.verificationDisplay && this.verificationDisplay.showS12nAdvertising();
  }

  isProductVerificationEnabled(): boolean {
    return this.verificationDisplay.get('isProductVerificationEnabled');
  }

  /**
   * @returns {bool} Returns true if the user has purchased a certificate for this course, regardless of whether it has
   * expired yet.
   */
  hasPurchasedCertificate(): boolean {
    if (this.verificationDisplay) {
      const ownership = this.verificationDisplay.get('productOwnership');
      return !!ownership && (!!ownership.get('owns') || !!ownership.get('expiredOwns'));
    }

    return false;
  }

  /**
   * @returns {bool} Returns true if the user currently owns a certificate for this course. Certificate purchases can
   * expire.
   */
  currentlyOwnsCertificate(): boolean {
    if (this.verificationDisplay) {
      const ownership = this.verificationDisplay.get('productOwnership');
      return !!ownership && !!ownership.get('owns');
    }

    return false;
  }

  /**
   * @returns Returns the timestamp of the ownership expiration
   */
  getExpirationDate(): any {
    if (this.verificationDisplay) {
      const ownership = this.verificationDisplay.get('productOwnership');
      return ownership && ownership.get('expiresAt');
    }

    return false;
  }

  /**
   * @returns {bool} Returns true if the user's ownership expires in next 30 days
   */
  expiresInNextMonth(): boolean {
    if (this.verificationDisplay) {
      const now = moment();
      const expiresAt = this.verificationDisplay.get('productOwnership.expiresAt');
      return expiresAt && moment(expiresAt).isBetween(now, now.add(30, 'days'));
    }

    return false;
  }
}

export default VerificationStore;
