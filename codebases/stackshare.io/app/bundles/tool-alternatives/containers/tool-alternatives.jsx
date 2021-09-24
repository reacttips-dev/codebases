import React, {Fragment, useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Header from '../../../shared/library/header';
import Circular, {LARGE} from '../../../shared/library/indicators/indeterminate/circular';
import {MAX_PAGE_WIDTH} from '../../../shared/style/dimensions';
import {ASH, CONCRETE, PAGE_BACKGROUND, WHITE} from '../../../shared/style/colors';
import ToolBreadCrumbs from '../components/breadcrumbs';
import Alternatives from '../components/alternatives';
import SecondaryFooter from '../../site/components/second-footer';
import {toolFooterPresenter} from '../utils';
import {flexBox, INITIAL, COLUMN, CENTER} from '../styles';
import {SigninDesktopModal} from '../../../shared/library/modals/signin';
import CtaPanel from '../../../shared/library/cta-panel';
import {BASE_TEXT} from '../../../shared/style/typography';
import Advert from '../../../shared/library/advert';
import * as AD_THEMES from '../../../shared/library/advert/themes';
import {adProperty, AD_LAYER, AD_CATEGORY, AD_FUNCTION} from '../../../shared/utils/ad';
import Description from '../components/description';
import TopAlternatives from '../components/top-alternatives';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import {PrivateModeContext} from '../../../shared/enhancers/private-mode-enchancer';

export const Spinner = glamorous.div({
  margin: '100px 0',
  ...flexBox(CENTER)
});

const Page = glamorous.div({
  width: '100%',
  background: PAGE_BACKGROUND,
  ...flexBox(CENTER, COLUMN, CENTER)
});

const TopContentContainer = glamorous.div({
  width: '100%',
  background: WHITE
});

const TopContent = glamorous.div({
  width: '100%',
  height: '100%',
  maxWidth: MAX_PAGE_WIDTH,
  paddingLeft: 15,
  paddingRight: 15,
  margin: '0 auto',
  ...flexBox(INITIAL, COLUMN)
});

const CtaWrap = glamorous.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  marginTop: 40
});

const Divider = glamorous.div({
  borderBottom: `2px solid ${ASH}`,
  width: '100%'
});

const Content = glamorous.main({
  width: '100%',
  height: '100%',
  padding: '20px 15px 0',
  maxWidth: MAX_PAGE_WIDTH,
  minHeight: '100vh',
  ...flexBox(INITIAL, COLUMN)
});

const AdContainer = glamorous.div({
  width: 260,
  marginLeft: 20,
  marginBottom: 25
});

const AdLayout = glamorous.div({
  display: 'flex',
  position: 'relative'
});

const Aside = glamorous.aside({
  display: 'flex',
  marginLeft: 'auto',
  minWidth: 280
});

const HeadingContainer = glamorous.div();

const NoAlternatives = glamorous.div({
  ...flexBox(CENTER),
  paddingTop: 100,
  ' > div': {
    ...BASE_TEXT,
    color: CONCRETE,
    fontStyle: 'italic'
  }
});

const ToolAlternatives = ({contentGroup, description, loading, signin, tool, title}) => {
  const currentUser = useContext(CurrentUserContext);
  const enableSignup = !currentUser;
  const privateMode = useContext(PrivateModeContext);

  if (loading) {
    return (
      <Spinner>
        <Circular size={LARGE} />
      </Spinner>
    );
  }
  if (tool) {
    const {imageUrl, pressUrl, twitterUsername, websiteUrl, path, slug} = tool;
    const adLayer = adProperty(tool, AD_LAYER);
    const adCategory = adProperty(tool, AD_CATEGORY);
    const adFunction = adProperty(tool, AD_FUNCTION);
    const noAlternatives = tool.alternativeTools.count === 0;
    return (
      <Page>
        <TopContentContainer>
          <TopContent>
            <ToolBreadCrumbs tool={tool} />
            <Header
              logo={imageUrl}
              description={description}
              title={title}
              name={tool.name}
              openSource={pressUrl}
              twitter={twitterUsername}
              website={websiteUrl}
              toolProfile={path}
              jobsPath={privateMode ? null : tool.slug}
              altHeading={true}
            />
            <CtaWrap>
              <CtaPanel
                service={tool}
                isStuck={false}
                privateMode={privateMode}
                currentUser={currentUser}
              />
            </CtaWrap>
          </TopContent>
        </TopContentContainer>
        <Divider />
        <Content>
          {noAlternatives ? (
            <NoAlternatives>
              <div>No related alternatives found</div>
            </NoAlternatives>
          ) : (
            <Fragment>
              <AdLayout>
                <HeadingContainer>
                  <Description tool={tool} />
                  <TopAlternatives tool={tool} enableSignup={enableSignup} />
                </HeadingContainer>
                <Aside>
                  <AdContainer>
                    <Advert
                      placement="tool-alternatives-banner"
                      objectType="Tool"
                      objectId={slug}
                      contentGroupPage={contentGroup}
                      requestPath={path}
                      layer={adLayer}
                      category={adCategory}
                      primaryFunction={adFunction}
                      theme={AD_THEMES.COLUMN}
                    />
                  </AdContainer>
                </Aside>
              </AdLayout>
              <Alternatives
                {...tool}
                description={description}
                enableSignup={enableSignup}
                showJobs={false}
                privateMode={privateMode}
              />
            </Fragment>
          )}
        </Content>
        <SecondaryFooter
          sections={toolFooterPresenter(tool)}
          altLink={'/alternatives'}
          altTitle={'Alternatives'}
        />
        {signin && <SigninDesktopModal redirect={`${path}/alternatives`} />}
      </Page>
    );
  }
  return null;
};

ToolAlternatives.propTypes = {
  contentGroup: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
  signin: PropTypes.bool,
  tool: PropTypes.object,
  title: PropTypes.string
};

export default ToolAlternatives;
