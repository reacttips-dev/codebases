import React, {useState, useEffect, useContext} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {FOCUS_BLUE} from '../../style/colors';
import Notice, {BAR, InfoIcon} from '../notices/notice';
import {withLocalStorage} from '../../enhancers/local-storage-enhancer';
import {CurrentUserContext} from '../../enhancers/current-user-enhancer';
import {PLANS} from '../../../bundles/private-payment/constants';

const NoticeContainer = glamorous.div(
  ({width = 315, fontSize = 12}) => ({
    width: width,
    borderRadius: 2,
    marginTop: 20,
    '& > aside > div > a': {
      height: 8,
      width: 8
    },
    '& > aside > div > div': {
      padding: 0,
      '& > div': {
        padding: 8,
        fontSize: fontSize,
        fontWeight: 600,
        letterSpacing: 0.16,
        color: FOCUS_BLUE,
        '& > a': {
          paddingLeft: 3,
          fontWeight: 900,
          textDecoration: 'underline'
        }
      }
    }
  }),
  ({discardOption}) =>
    discardOption
      ? {}
      : {
          '& > aside > div > div > div': {
            padding: '8px 30px',
            display: 'flex',
            justifyContent: 'center',
            '& > span': {
              paddingRight: 10
            }
          }
        }
);

let FREEMIUM_SEEN = 'FreemiumMessage';

const FreemiumMessage = ({
  companyId,
  companySlug,
  discardOption,
  fileName,
  width,
  fontSize,
  storageProvider
}) => {
  const [showNotice, setShowNotice] = useState(false);
  const currentUser = useContext(CurrentUserContext);
  const selectedCompany =
    currentUser &&
    currentUser.companies &&
    currentUser.companies.filter(item => item.id === companyId)[0];

  const isUserAdminAndIsInFreemium =
    selectedCompany &&
    selectedCompany.myRole === 'admin' &&
    selectedCompany.plans.some(item => item.slug === PLANS.FREE);

  const handleDismissNotice = () => {
    setShowNotice(false);
    storageProvider.setItem(FREEMIUM_SEEN + fileName, true);
  };

  useEffect(() => {
    if (!storageProvider.getBoolean(FREEMIUM_SEEN + fileName) || !discardOption) {
      setShowNotice(true);
    }
  }, []);

  return isUserAdminAndIsInFreemium && showNotice ? (
    <NoticeContainer width={width} fontSize={fontSize} discardOption={discardOption}>
      <Notice
        theme={BAR}
        fullWidth={true}
        icon={<InfoIcon />}
        title={
          discardOption ? (
            <>
              To sync more than 10 repos
              <a href={`/companies/${companySlug}/pricing/private`}>upgrade your plan</a>
            </>
          ) : (
            "Only 5 repositories would be sync'ed with the free plan"
          )
        }
        onDismiss={discardOption ? () => handleDismissNotice() : null}
      />
    </NoticeContainer>
  ) : (
    <></>
  );
};

FreemiumMessage.propTypes = {
  companyId: PropTypes.string,
  companySlug: PropTypes.string,
  discardOption: PropTypes.bool,
  fileName: PropTypes.string,
  fontSize: PropTypes.number,
  width: PropTypes.any,
  storageProvider: PropTypes.object
};

export default withLocalStorage('FreemiumMessage', '1')(FreemiumMessage);
