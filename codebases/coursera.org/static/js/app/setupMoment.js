// setup locale for Moment lib
import moment from 'moment';
import language from 'js/lib/language';

const setupMoment = () => {
  moment.locale(language.getMomentLanguage());
};

export default setupMoment;
