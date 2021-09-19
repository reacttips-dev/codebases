import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { evNavigationClick, evTopLevelNavigationClick } from 'events/headerFooter';
import { makeOpenLiveChat } from 'helpers/ClientUtils';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import useMartyContext from 'hooks/useMartyContext';
import DynamicBanner from 'components/hf/zappos/DynamicBanner';
import Link from 'components/hf/HFLink';
import FocusTrap from 'components/common/FocusTrap';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';
import { stripSpecialCharsDashReplace as strip } from 'helpers';

import css from 'styles/components/hf/zappos/topBar.scss';

export const TopBar = props => {
  const {
    testId,
    marketplace: {
      phoneNumber,
      phoneNumberTel,
      phoneNumberVip,
      phoneNumberVipTel,
      chatWindowName
    }
  } = useMartyContext();

  const {
    isOpen,
    handleTopNavClick,
    handleTopNavCloseClick,
    isTopBannerShowing,
    holmes,
    killswitch,
    content,
    tbContent,
    DynamicBanner,
    isVip,
    Link,
    customerServiceNumber,
    customerServiceDropdown,
    onOpenLiveChat = makeOpenLiveChat(chatWindowName)
  } = props;

  const { enableLiveChatForSoftAuthOnly = false, disableLiveChat = false } = killswitch;

  const onHelpClick = useCallback(evt => {
    const { target: { tagName, innerText } } = evt;
    if (tagName === 'A') {
      trackEvent('TE_HEADER_CUSTOMER_SERVICE', 'Phone');
      trackLegacyEvent('Global', 'Header', '24-7-Help');
      track(() => ([
        evTopLevelNavigationClick, {
          valueClicked: innerText || 'Header Phone'
        }
      ]));
    }
  }, []);

  const showLiveChat = disableLiveChat ? false : (enableLiveChatForSoftAuthOnly ? Boolean(holmes) : true);
  return (
    <div className={css.headerTopBar}>
      <div className="headerContainer">
        {customerServiceDropdown?.componentName === 'subNavMenu' &&
          <div className={css.dropdownList}>
            <Link
              data-test-id={testId('headerCustomerServiceToggle')}
              to={customerServiceDropdown.heading.link}
              rel="noopener noreferrer"
              target="_blank"
              onClick={e => {
                handleTopNavClick(e);
                track(() => ([
                  evTopLevelNavigationClick, {
                    valueClicked: customerServiceDropdown.heading.text
                  }
                ]));
              }}
              data-shyguy="customerServiceHeaderDropdown"
              aria-expanded={isOpen('customerServiceHeaderDropdown')}>
              {customerServiceDropdown.heading.text}
            </Link>
            <FocusTrap active={isOpen('customerServiceHeaderDropdown')}>
              {focusRef => (
                <ul
                  data-hfdropdown
                  data-test-id={testId('headerCustomerServiceDropdown')}
                  ref={focusRef}>
                  {customerServiceDropdown.subNavMenu.map(({ link, text, gae }) => {
                    const isChatLink = text?.toLowerCase().includes('chat');
                    if (isChatLink && showLiveChat) {
                      return (
                        <li key={text}>
                          <a
                            onClick={e => {
                              onOpenLiveChat(e);
                              trackEvent('TE_HEADER_CUSTOMER_SERVICE', strip(gae || text));
                              trackLegacyEvent('Main-Nav', 'CustomerService', strip(gae || text));
                              track(() => ([evNavigationClick, {
                                valueClicked: text,
                                parentDropdown: 'Customer Service'
                              }]));
                            }}
                            data-test-id={testId('headerLiveChat')}
                            id="liveChat"
                            href={link}>
                            {text}
                          </a>
                        </li>
                      );
                    } else if (!isChatLink) {
                      return (
                        <li key={text}>
                          <Link
                            to={link}
                            data-test-id={testId(strip(text))}
                            onClick={() => {
                              trackEvent('TE_HEADER_CUSTOMER_SERVICE', strip(gae || text));
                              trackLegacyEvent('Main-Nav', 'CustomerService', strip(gae || text));
                              track(() => ([
                                evNavigationClick, {
                                  valueClicked: text,
                                  parentDropdown: 'Customer Service'
                                }
                              ]));
                            }}>
                            {text}
                          </Link>
                        </li>
                      );
                    }
                  })}
                  <li className={css.close}>
                    <button
                      type="button"
                      data-close
                      onClick={handleTopNavCloseClick}
                      aria-label={'Close Customer Service Menu'}/>
                  </li>
                </ul>
              )}
            </FocusTrap>
          </div>
        }
        {customerServiceNumber?.componentName === 'pageContent' &&
          <HtmlToReact
            className={css.phoneNum}
            data-test-id={testId('headerPhone')}
            onClick={onHelpClick}>
            {customerServiceNumber.pageContent.body
              .replace(/{{number}}/g, isVip ? phoneNumberVip : phoneNumber)
              .replace(/href="numberTel"/g, `href="${isVip ? phoneNumberVipTel : phoneNumberTel}"`)}
          </HtmlToReact>
        }
        {isTopBannerShowing && <DynamicBanner content={content} displayPhraseData={tbContent?.chosenPhrase} />}
      </div>
    </div>
  );
};

TopBar.defaultProps = {
  DynamicBanner,
  Link
};

TopBar.propTypes = {
  holmes: PropTypes.oneOfType([ PropTypes.bool, PropTypes.object ]).isRequired
};

export default withErrorBoundary('TopBar', TopBar);
