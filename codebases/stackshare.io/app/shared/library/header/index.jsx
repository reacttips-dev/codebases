import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import Heading from '../typography/heading';
import VerfiedIcon from '../icons/verified.svg';
import Fork from '../icons/fork.svg';
import PackageIcon from '../icons/package.svg';
import {TARMAC, ASH} from '../../style/colors';
import {PHONE} from '../../style/breakpoints';
import Links from '../links';
import Views from '../views';
import {BASE_TEXT} from '../../style/typography';
import PrivatePublicIndicator from '../private-public-indicator';
import AdoptionStage from '../cards/adoption-stage';
import ShowTags from '../show-tags';

const Container = glamorous.div(
  {
    ...BASE_TEXT,
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px 0 10px 0',
    [PHONE]: {
      alignItems: 'center',
      flexDirection: 'column'
    }
  },
  ({customStyle}) => ({
    ...customStyle
  })
);

const BigText = glamorous.span(({fontSize}) => ({
  ...BASE_TEXT,
  fontSize: fontSize,
  color: TARMAC
}));

const AllDets = glamorous.div({
  width: '100%',
  maxWidth: '100%'
});

const Details = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  [PHONE]: {
    flexDirection: 'column',
    marginBottom: 15
  }
});

const LinksWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'flex-start',
  [PHONE]: {
    width: '100%'
  }
});
const Logo = glamorous.img({
  height: 110,
  width: 110,
  marginRight: 25,
  marginBottom: 10,
  borderRadius: 4,
  border: `1px solid ${ASH}`,
  [PHONE]: {
    marginRight: 0,
    height: 70,
    width: 70
  }
});

const MetaData = glamorous.div({
  width: '100%',
  maxWidth: 500,
  [PHONE]: {
    textAlign: 'center'
  }
});

const ToolWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  ' .fork': {
    marginTop: 5
  },
  [PHONE]: {
    justifyContent: 'center'
  }
});

const Description = glamorous.div({
  color: TARMAC,
  padding: '5px 0'
});

const ComponentWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  [PHONE]: {
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
    margin: '0 auto'
  }
});

const PrivPubContainer = glamorous.div({
  marginLeft: 5
});

const StyledVerfiedIcon = glamorous(VerfiedIcon)({
  marginLeft: 5,
  width: 15,
  height: 15
});

const StyledFork = glamorous(Fork)({
  marginLeft: 5,
  width: 15,
  height: 15
});

const ExtraComponent = glamorous.div({
  display: 'flex',
  [PHONE]: {
    display: 'none'
  }
});

const PackageWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 7,
  ' a': {
    display: 'flex'
  },
  [PHONE]: {
    justifyContent: 'center'
  }
});

const PackageText = glamorous.div({
  width: 70,
  height: 14,
  opacity: 0.66,
  borderRadius: 2.2,
  backgroundColor: '#333',
  marginRight: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const Package = glamorous.img({
  width: 76,
  height: 20,
  objectFit: 'contain'
});

const Header = ({
  logo,
  title,
  company,
  verified,
  description,
  twitter,
  website,
  packageUrl,
  openSource,
  viewCount = 0,
  component,
  isCompany,
  toolProfile,
  name,
  jobsPath,
  user,
  metaDataStyle,
  isPrivate,
  githubUrl,
  descFontSize = 13,
  customStyle,
  type,
  packageManager,
  adoptionStages,
  toolAdoptionStage,
  canEdit,
  toolSlug,
  showTags,
  stagePermission
}) => {
  const markup = {__html: description};
  return (
    <Container customStyle={customStyle}>
      <AllDets>
        <Details>
          <a href={website} target="_blank" rel="noopener noreferrer" title={`${title} website`}>
            <Logo src={logo} alt={`${title} logo`} />
          </a>
          <MetaData style={metaDataStyle}>
            {type === 'Package' && packageManager && (
              <PackageWrapper>
                <PackageText>
                  {' '}
                  <PackageIcon />
                </PackageText>
                {' / '}
                <a href={packageManager.slug} target="_blank" rel="noopener noreferrer">
                  <Package
                    src={packageManager.miniImageUrl}
                    alt={`${packageManager.slug} package`}
                  />
                </a>
              </PackageWrapper>
            )}
            <ToolWrapper>
              <Heading>{title}</Heading>

              {isPrivate ? (
                <PrivPubContainer>
                  <PrivatePublicIndicator typeIndicator="BlueRoundLarge" />
                </PrivPubContainer>
              ) : verified ? (
                <StyledVerfiedIcon />
              ) : (
                <></>
              )}
              {openSource && (
                <div className="fork">
                  <a
                    href={openSource}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    title={name ? `Open Source Repo of ${name}` : `Open Source Repo of ${title}`}
                  >
                    <StyledFork />
                  </a>
                </div>
              )}
              {stagePermission && (
                <AdoptionStage
                  adoptionStages={adoptionStages}
                  toolAdoptionStage={toolAdoptionStage}
                  canEdit={canEdit}
                  toolSlug={toolSlug}
                />
              )}
            </ToolWrapper>
            <Description>
              <BigText fontSize={descFontSize} dangerouslySetInnerHTML={markup} />
            </Description>
            {showTags && <ShowTags />}
          </MetaData>
        </Details>
      </AllDets>
      <LinksWrapper>
        <ComponentWrapper>
          <Links
            twitter={twitter}
            website={website}
            githubUrl={githubUrl}
            isCompany={isCompany}
            company={company ? company.path : null}
            toolProfile={toolProfile ? toolProfile : null}
            user={user}
            separatorForLast={!!viewCount}
            jobsPath={jobsPath}
            component={component}
            packageUrl={packageUrl}
            onClick={() => {}}
          />
          <ExtraComponent>
            {viewCount !== 0 && <Views viewCount={viewCount} />}
            {component && component}
          </ExtraComponent>
        </ComponentWrapper>
      </LinksWrapper>
    </Container>
  );
};

Header.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string,
  company: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  verified: PropTypes.bool,
  description: PropTypes.string,
  twitter: PropTypes.string,
  website: PropTypes.string,
  packageUrl: PropTypes.string,
  openSource: PropTypes.string,
  viewCount: PropTypes.number,
  component: PropTypes.any,
  isCompany: PropTypes.bool,
  toolProfile: PropTypes.string,
  name: PropTypes.string,
  jobsPath: PropTypes.string,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  metaDataStyle: PropTypes.object,
  isPrivate: PropTypes.bool,
  githubUrl: PropTypes.string,
  descFontSize: PropTypes.number,
  customStyle: PropTypes.object,
  type: PropTypes.string,
  packageManager: PropTypes.object,
  adoptionStages: PropTypes.array,
  toolAdoptionStage: PropTypes.object,
  canEdit: PropTypes.bool,
  toolSlug: PropTypes.string,
  showTags: PropTypes.bool,
  stagePermission: PropTypes.bool
};

export default Header;
