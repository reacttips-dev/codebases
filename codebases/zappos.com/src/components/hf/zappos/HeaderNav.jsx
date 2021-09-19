/*
  Linter thinks there are undef classes but that's a lie.
  http://i.imgflip.com/2ecefi.jpg
  And purposely ignore dynamic classes coming from API.
*/
/* eslint-disable css-modules/no-undef-class*/
import { useMemo } from 'react';
import cn from 'classnames';

import { BLANK_IMAGE_PLACEHOLDER } from 'constants/appConstants';
import { evNavigationClick, evTopLevelNavigationClick } from 'events/headerFooter';
import useFocusTrap from 'hooks/useFocusTrap';
import useMartyContext from 'hooks/useMartyContext';
import Link from 'components/hf/HFLink';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { stripSpecialCharsDashReplace as strip } from 'helpers';
import { useTestNavigation } from 'hooks/useTestNavigation.js';
import { overwriteNavItem, overwriteSubNavItems } from 'helpers/HFHelpers.js';

import css from 'styles/components/hf/zappos/headerNav.scss';

const HeaderSubNav = ({
  data, isSubNavOpen, parentText, parentId, isMobile,
  handleSubNavClick, handleSubNavClose, navsThatHaveBeenOpened, testId
}) => {
  const hasBeenOpened = navsThatHaveBeenOpened.includes(parentId);
  const { componentName, heading, subNavMenu, bgcolor, maintext } = data || {};
  const toggleId = `${parentId}=${heading?.text}`;
  const ref = useFocusTrap({ active: isMobile && isSubNavOpen(toggleId), shouldFocusFirstElement: true });

  if (!data) {
    return null;
  }

  const makeSubNavMenu = () => {
    const hasSubNav = !!subNavMenu?.length;
    return (
      <>
        {heading.text &&
          <Link
            data-hfsubnav={toggleId}
            data-test-id={testId(`${parentText}-${heading.text}`)}
            onClick={e => {
              // mobile subnavs in brands tab are displayed differently =-[
              if (hasSubNav && parentText.toLowerCase() !== 'brands') {
                handleSubNavClick(e);
              }
              trackEvent('TE_HEADERFOOTER_MAIN_NAV', heading.gae || heading.text);
              trackLegacyEvent('Main-Nav', strip(parentText), strip(heading.gae || heading.text));
              track(() => ([
                evNavigationClick, {
                  valueClicked: heading.text,
                  parentDropdown: parentText
                }
              ]));
            }}
            aria-expanded={hasSubNav ? isSubNavOpen(toggleId) : null}
            className={cn(css.submenu, { [heading.type]: !!heading.type, [css.hasSubNav]: hasSubNav })}
            to={heading.link}
          >
            {heading.text}
          </Link>
        }
          <ul className={css.subcategory} ref={ref}>
            <li data-close><button type="button" onClick={handleSubNavClose} aria-label={`Close ${heading.text} submenu`}/></li>
            {subNavMenu.map(({ link, text, type, gae }) =>
              text && <li key={link + text + gae} className={cn(type)}>
                <Link
                  to={link}
                  data-test-id={testId(`${parentText}-${heading.text || ''}-${text || gae}`)}
                  onClick={() => {
                    trackEvent('TE_HEADERFOOTER_MAIN_NAV', gae || text);
                    trackLegacyEvent('Main-Nav', strip(parentText), strip(gae || text));
                    track(() => ([
                      evNavigationClick, {
                        valueClicked: text,
                        parentDropdown: parentText
                      }
                    ]));
                  }}>
                  {text}</Link>
              </li>
            )}
          </ul>
      </>
    );
  };

  const makeClickme = () => {
    const { image, retina, alt, link, maintext: compMainText, gae } = data.clickmes[0];
    const bgColorStyle = { background: bgcolor };

    return (
      <aside className={cn('hfImagesComponent', css.headernavClickmeContainer)}>
        <Link
          to={link}
          className={cn(css.clickme, css.headernavClickMe)}
          style={bgcolor ? bgColorStyle : null}
          data-test-id={testId(`${parentText}-${compMainText}`)}
          onClick={() => {
            trackEvent('TE_HEADERFOOTER_NAV_CLICKME', gae || compMainText);
            trackLegacyEvent('Global-Header-zapposheader', 'Clickmes', strip(gae || compMainText));
            track(() => ([
              evNavigationClick, {
                valueClicked: compMainText,
                parentDropdown: parentText
              }
            ]));
          }}>
          {image && <img
            src={hasBeenOpened ? image : BLANK_IMAGE_PLACEHOLDER}
            srcSet={hasBeenOpened && retina ? `${image}, ${retina} 2x` : null}
            alt={alt}/>}
          {compMainText && <p className={css.compHeading}>{compMainText}</p>}
        </Link>
      </aside>
    );
  };

  const makeImageGrid = () => (
    <div className={cn(data.type, css.imagesGridComponent)}>
      {/* ^Can't use css[data.type] localized classes above. Works locally but not with prod builds */}
      {maintext && <p className={css.compHeading}>{maintext}</p>}
      <div className={css.imagesContainer}>
        {data.images.map(({ src, href, alt, gae }) =>
          <div key={src}>
            <Link
              to={href}
              data-test-id={testId(`${parentText}-${maintext || ''}-${alt || gae}`)}
              onClick={() => {
                trackEvent('TE_HEADERFOOTER_NAV_IMAGESGRID', gae || alt);
                trackLegacyEvent('Global-Header-zapposheader', 'ImagesGrid', strip(gae || alt));
                track(() => ([
                  evNavigationClick, {
                    valueClicked: gae || alt,
                    parentDropdown: parentText
                  }
                ]));
              }}>
              <img alt={alt} src={hasBeenOpened ? src : BLANK_IMAGE_PLACEHOLDER}/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  switch (componentName) {
    case 'subNavMenu':
      return makeSubNavMenu();
    case 'clickmes':
      return makeClickme();
    case 'catskillsImageGrid':
    case 'imageGrid':
      return makeImageGrid();
    default:
      return null;
  }
};

export const HeaderNav = ({
  topLevelNavs, subNavs, isOpen, isRecognized, isSubNavOpen, isMobile,
  mobileStyles, desktopStyles, handleTopNavClick, handleTopNavCloseClick, handleSubNavClick,
  handleSubNavClose, openedSubNav, handleSearchSubmit, navsThatHaveBeenOpened, triggerAssignment, firstNavLinkRef
}) => {

  const navState = useTestNavigation(topLevelNavs, isRecognized, triggerAssignment);

  const { testId } = useMartyContext();

  if (!topLevelNavs) {
    return null;
  }

  return (
    topLevelNavs.map((nav, index) => {
      const { text, searchurl, link, nochildren } = overwriteNavItem(nav, navState, index);
      const subNav = overwriteSubNavItems(index, navState) || subNavs?.[`headermenu${index + 1}`]?.slotData;
      const hasDropDown = !nochildren && subNav && !!Object.keys(subNav).length;
      const parentId = `nav${text}`;

      let catStyles = null;
      if (!isMobile) {
        catStyles = desktopStyles?.categories?.[index];
      }

      const subNavProps = {
        isSubNavOpen,
        isMobile,
        parentText: text,
        parentId,
        handleSubNavClick,
        handleSubNavClose,
        navsThatHaveBeenOpened,
        subCatHeight: mobileStyles.subCatHeight,
        testId
      };

      return (
        <NavMenu
          key={text}
          catStyles={catStyles}
          hasDropDown={hasDropDown}
          handleSearchSubmit={handleSearchSubmit}
          handleTopNavClick={handleTopNavClick}
          handleTopNavCloseClick={handleTopNavCloseClick}
          isMobile={isMobile}
          isOpen={isOpen}
          link={link}
          openedSubNav={openedSubNav}
          parentId={parentId}
          searchurl={searchurl}
          subNav={subNav}
          subNavProps={subNavProps}
          text={text}
          firstNavLinkRef={firstNavLinkRef}
          index={index}
        />
      );
    })
  );
};

const NAV_MAX = 30;
const NAV_SECTIONS_PER_COL = 5;
/*
  Formatting the sub nav items into an array that's more easily consumed by the view.
  There are up to 6 columns in each sub nav. Each column can have up to five rows.
  A completely full nav would have an array of 6 indexes with each index being an array of 5 menues.
  For a total of 30 items(5 * 6 = 30)
  [
    [nav * 5] * 6
  ]
*/
export const getSubNavSections = subNavs => {
  const subNav = [];
  for (let i = 0; i < NAV_MAX; i++) {
    const nav = subNavs[`submenu-${i + 1}`];
    if (nav) {
      const sectionIndex = Math.floor(i / NAV_SECTIONS_PER_COL);
      subNav[sectionIndex] = (subNav[sectionIndex] || []).concat(nav);
    }
  }
  // Remove empty/skipped indexes of the array
  return subNav.filter(Boolean);
};

// There are a lot of different ways we can expect nav data. Trying my best to not use index while keeping the `key` prop unique
const getKeyForNav = nav => {
  if (nav.heading?.link) {
    const { link, gae } = nav.heading;
    return `${link}-${gae}`;
  }

  if (nav.subNavMenu?.[0]?.link) {
    const { link, gae } = nav.subNavMenu[0];
    return `${link}-${gae}`;
  }

  if (nav.clickmes?.[0].link) {
    const { link, gae } = nav.clickmes[0];
    return `${link}-${gae}`;
  }

  return nav.images?.[0].src;
};

const NavMenu = ({
  catStyles,
  hasDropDown,
  handleSearchSubmit,
  handleTopNavClick,
  handleTopNavCloseClick,
  isOpen,
  link,
  openedSubNav,
  parentId,
  searchurl,
  subNav,
  subNavProps,
  text,
  firstNavLinkRef,
  index
}) => {
  const { testId } = useMartyContext();
  const menuTrapRef = useFocusTrap({ active: isOpen(parentId), shouldFocusFirstElement: true });
  const subNavData = useMemo(() => getSubNavSections(subNav), [subNav]);

  return (
    <li className={css[parentId]}>
      {text &&
      <Link
        innerRef={index === 0 ? firstNavLinkRef : null}
        data-shyguy={parentId}
        data-test-id={testId(text)}
        className={cn(css.topNav, { [css.noArrow]: !hasDropDown })}
        onClick={e => {
          if (hasDropDown) {
            handleTopNavClick(e);
          }
          // Ensure we scroll submenu to the top on mobile
          if (menuTrapRef?.current) {
            menuTrapRef.current.scrollTop = 0;
          }
          trackEvent('TE_HEADERFOOTER_MAIN_NAV', text);
          track(() => ([
            evTopLevelNavigationClick, {
              valueClicked: text
            }
          ]));
        }}
        aria-expanded={hasDropDown ? isOpen(parentId) : null}
        to={link}>
        {text}
      </Link>
      }
      {hasDropDown &&
      <div
        className={cn(css.category, { [css.locked]: !!openedSubNav })}
        style={catStyles}
        data-test-id={testId(`${parentId}Dropdown`)}
        data-headercategory={parentId}
        ref={menuTrapRef}
      >
        <button
          type="button"
          data-close
          onClick={handleTopNavCloseClick}
          aria-label={`Close ${text} Menu`}
        >
          {text}
        </button>
        <div className={css.flexNavContainer}>
          {subNavData.map(nav =>
            <section key={getKeyForNav(nav[0])}>
              {nav.map(data =>
                <HeaderSubNav key={getKeyForNav(data)} {...subNavProps} data={data}/>
              )}
            </section>
          )}
          {searchurl &&
            <form
              onSubmit={handleSearchSubmit}
              className={css.nestedSearchbar}
              method="GET"
              action="/search"
              data-search-id={text}
              data-test-id={testId(`${parentId}SearchForm`)}
              data-search-category={searchurl !== 'global' ? searchurl : null}>
              <label htmlFor={`search${text}`}>{`Search Within ${text}`}</label>
              <input
                data-test-id={testId(`${parentId}SearchInput`)}
                required
                type="search"
                name="term"
                id={`search${text}`}
                placeholder={`Search Within ${text}`}
                autoComplete="off"/>
              <button data-test-id={testId(`${parentId}SearchSubmit`)} type="submit">Search</button>
            </form>
          }
        </div>
      </div>
      }
    </li>
  )
  ;
};

export default withErrorBoundary('HeaderNav', HeaderNav);
/* eslint-enable*/
