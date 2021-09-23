import PropTypes from 'prop-types';
import * as UpgradeProducts from 'self-service-api/constants/UpgradeProducts';
export var upgradeDataPropsInterface = {
  upgradeData: PropTypes.shape({
    app: PropTypes.string,
    screen: PropTypes.string,
    upgradeProduct: PropTypes.oneOf(Object.values(UpgradeProducts))
  })
};