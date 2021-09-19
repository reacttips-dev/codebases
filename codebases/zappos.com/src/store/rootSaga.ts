import { createRootSaga } from 'helpers/SagaUtils';
import feedbackSagas from 'store/ducks/feedback/sagas';
import giftOptionsSagas from 'store/ducks/giftoptions/sagas';
import checkoutSagas from 'store/ducks/checkout/sagas';
import laSagas from 'store/ducks/loginAssistant/sagas';
import killswitchSagas from 'store/ducks/killswitch/sagas';
import pixelServerSagas from 'store/ducks/pixelServer/sagas';
import productDetailSagas from 'store/ducks/productDetail/sagas';
import rewardsSagas from 'store/ducks/rewards/sagas';
import sessionSagas from 'store/ducks/session/sagas';
import eventSagas from 'store/ducks/events/sagas';
import searchSagas from 'store/ducks/search/sagas';
import weblabSagas from 'store/ducks/weblab/sagas';
import exchangesSagas from 'store/ducks/exchanges/sagas';

const sagas = [
  ...eventSagas,
  ...pixelServerSagas,
  ...checkoutSagas,
  ...feedbackSagas,
  ...killswitchSagas,
  ...laSagas,
  ...giftOptionsSagas,
  ...rewardsSagas,
  ...sessionSagas,
  ...searchSagas,
  ...weblabSagas,
  ...exchangesSagas,
  productDetailSagas
];

const rootSaga = createRootSaga(sagas);

export default rootSaga;
