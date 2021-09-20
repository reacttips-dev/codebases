import React from 'react';
import styled from 'styled-components';
import { Flex, Heading, Text, ResponsiveContainer } from '@postman/aether';
import Link from '../../../../../../../appsdk/components/link/Link';

import InputButton from './InputButton';
import { STYLED_CONSTANTS } from '../StyledConstants';
import ThemeManager from '../../../../../../../js/controllers/theme/ThemeManager';

import FooterIllustrationUrl from '../../../../../../../assets/images/empty-state/homepage-footer-illustration.svg';
import TwitterIconUrl from '../../../../../../../assets/images/thumbnails/twitter.svg';
import TwitchIconUrl from '../../../../../../../assets/images/thumbnails/twitch.svg';
import LinkedInIconUrl from '../../../../../../../assets/images/thumbnails/linkedin.svg';
import GithubIconUrl from '../../../../../../../assets/images/thumbnails/github.svg';
import YouTubeIconUrl from '../../../../../../../assets/images/thumbnails/youtube.svg';
import APIPlatformUrl from '../../../../../../../assets/images/thumbnails/api-platform.svg';

const sectionLinksRowOne = [
  [
    {
      label: 'Product',
      children: [
        { to: '/product/what-is-postman/', label: 'What is Postman?' },
        { to: '/product/api-repository/', label: 'API Repository' },
        { to: '/product/tools/', label: 'Tools' },
        { to: '/product/intelligence/', label: 'Intelligence' },
        { to: '/product/workspaces/', label: 'Workspace' },
        { to: '/product/integrations/', label: 'Integrations' },
        { to: '/postman-enterprise/', label: 'Enterprise' },
        { to: '/pricing/', label: 'Plans and pricing' },
        { to: '/downloads/', label: 'Download the app' },
        { to: '/support/', label: 'Support center' }
      ]
    }
  ],
  [
    {
      label: 'Company',
      children: [
        { to: '/company/about-postman/', label: 'About' },
        {
          to: '/company/careers/',
          label: (
            <span>
              <span>Careers and Culture</span>
            </span>
          )
        },
        { to: '/company/contact-us/', label: 'Contact Us' },
        { to: '/company/press-media/', label: 'Press & Media' }
      ]
    },
    {
      label: 'Security and terms',
      children: [
        { to: '/security/', label: 'Security' },
        { to: '/legal/privacy-policy/', label: 'Privacy policy' },
        { to: '/legal/terms/', label: 'Terms' }
      ]
    }
  ]
];

const socialLinks = [
  [
    {
      label: 'Social',
      children: [
        { label: 'Twitter', iconName: 'twitter', rel: 'noopener noreferrer', to: 'https://twitter.com/getpostman', url: TwitterIconUrl },
        { label: 'LinkedIn', iconName: 'linkedin', rel: 'noopener noreferrer', to: 'https://www.linkedin.com/company/postman-platform', url: LinkedInIconUrl },
        { label: 'Github', iconName: 'github', rel: 'noopener noreferrer', to: 'https://github.com/postmanlabs', url: GithubIconUrl },
        { label: 'YouTube', iconName: 'youtube', rel: 'noopener noreferrer', to: 'https://www.youtube.com/postman', url: YouTubeIconUrl },
        { label: 'Twitch', iconName: 'twitch', rel: 'noopener noreferrer', to: 'https://www.twitch.tv/getpostman', url: TwitchIconUrl }
      ]
    }
  ]
];

const StyledFooter = styled.footer`
  .footer {
    &-signup {
      background-color: var(--background-color-secondary);
      align-items: center;
      padding: calc(2 * var(--spacing-xxl)) max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));
    }

    &-signup-section {

      @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.sm}px) {
        max-width: unset;
      }

      @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.sm}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
        max-width: 50%;
      }
    }

    &-illustration {
      img {
        width: 584px;
        height: 160px;
        max-width: 100%;
        margin-left: auto;
        @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.sm}px) {
          width: 100%;
          height: 100px;
          margin-top: var(--spacing-xxxl);
        }

        @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.sm}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
          width: 400px;
          height: 100px;
          margin-left: auto;
        }
      }
    }

    &-links {
      padding-top: calc(3 * var(--spacing-xl));
      padding-right: max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));
      padding-bottom: calc(3 * var(--spacing-xxl));
      padding-left: max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));

      @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.sm}px) {
        padding: var(--spacing-xl) var(--spacing-xl);
      }

      @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.sm}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
        padding: var(--spacing-xl) var(--spacing-xl);
      }

      & .tag-hiring {
        background: var(--background-color-info);
        border-radius: 30px;
        padding: 1px var(--spacing-s);
        font-weight: var(--text-weight-medium);
      }

      & .social-icon {
        margin-right: var(--spacing-s);
        width: var(--size-xs);
        height: var(--size-xs);
      }

      & .footer-link {
        width: fit-content;

        &-text {
          &:hover {
            color: var(--content-color-link);
          }
        }
      }

      & .api-platform {
        height: auto;
        padding-left: var(--spacing-xxl);

        &-image {
          @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.md}px) {
            filter: grayscale(100%);
            transition: all 0.2s ease-in-out 0s;

            &:hover {
              filter: grayscale(0);
            }
          }
        }
      }
    }
  }
`;

const getUrl = (link) => {
  return _.startsWith(link, 'https') ? link : (pm.webUrl + link);
};


const Sections = ({ sections }) => (
  <Flex direction='column' gap='spacing-xxl'>
    {sections.map(({ label, children }) => (
      <div key={label}>
        <Heading type='h2' styleAs='h3' color='content-color-secondary' text={label} hasBottomSpacing />
        <Flex direction='column' className='section-link-items' gap='spacing-s'>
          {children.map(({ label, to, iconName, rel = '', url }) => (
            <Link key={label} to={getUrl(to)} rel={rel} className='footer-link'>
              <Flex alignItems='center'>
                {iconName && <img src={url} loading='lazy' alt='label' className='social-icon' />}
                  <Text type='body-large' color='content-color-secondary' className='footer-link-text'>
                    {label}
                  </Text>
              </Flex>
            </Link>
          ))}
        </Flex>
      </div>
    ))}
  </Flex>
);

const Footer = () => {
  const currentTheme = ThemeManager.getCurrentTheme();

  return (
    <StyledFooter>
      <Flex direction='column'>
        {/* Footer Sign-Up Section */}
        <ResponsiveContainer
          type='row'
          padding='spacing-xxxl spacing-zero'
          overflow='unset'
          className='footer-signup'
        >
          <ResponsiveContainer
            type='column'
            computer={5}
            tablet={12}
            mobile={12}
            overflow='unset'
            className='footer-signup-section'
          >
            <Flex gap='spacing-l' direction='column'>
              <Heading type='h2' styleA='h1' text='Get started with Postman' />
              <InputButton placeholder='jsmith@example.com' buttonText='Sign Up for Free' className='cta-footer' analyticsLabel='bottom' />
            </Flex>
          </ResponsiveContainer>
          <ResponsiveContainer
            type='column'
            computer={7}
            tablet={12}
            mobile={12}
            overflow='unset'
            className='footer-illustration'
          >
            {currentTheme === 'light' && <img src={FooterIllustrationUrl} alt='footer illustration' loading='lazy' />}
          </ResponsiveContainer>
        </ResponsiveContainer>

        {/* Footer Links Section */}
        <ResponsiveContainer
          type='row'
          padding={{
            paddingTop: 'spacing-xxl',
            paddingBottom: 'spacing-xxxl'
          }}
          overflow='unset'
          className='footer-links'
        >
          <ResponsiveContainer type='column' computer={4} tablet={4} hiddenFor={['mobile']} overflow='unset' className='api-platform'>
            <Flex alignItems='center' justifyContent='start'>
              <Flex direction='column' gap='spacing-xxl'>
                <img src={APIPlatformUrl} alt='postman' loading='lazy' width='152px' height='228px' className='api-platform-image' />
                <Text type='body-medium' color='content-color-tertiary'>
                  &copy; {new Date().getFullYear()} Postman, Inc.
                </Text>
              </Flex>
            </Flex>
          </ResponsiveContainer>
          <ResponsiveContainer type='column' computer={6} tablet={6} mobile={12} overflow='unset'>
            <ResponsiveContainer type='row' overflow='unset'>
              {sectionLinksRowOne.map((sections) => (
                <ResponsiveContainer
                  key={sections[0].label}
                  type='column'
                  computer={6}
                  tablet={6}
                  mobile={6}
                  overflow='unset'
                >
                  <Sections sections={sections} />
                </ResponsiveContainer>
              ))}
            </ResponsiveContainer>
          </ResponsiveContainer>

          <ResponsiveContainer type='column' computer={2} tablet={2} hiddenFor={['mobile']} overflow='unset'>
            <ResponsiveContainer type='row' overflow='unset'>
              {socialLinks.map((sections) => (
                <ResponsiveContainer
                  key={sections[0].label}
                  type='column'
                  overflow='unset'
                >
                  <Sections sections={sections} />
                </ResponsiveContainer>
              ))}
            </ResponsiveContainer>
          </ResponsiveContainer>
        </ResponsiveContainer>

        <ResponsiveContainer type='row' className='footer-links' hiddenFor={['computer', 'tablet']} overflow='unset'>
          <ResponsiveContainer type='column' mobile={6} overflow='unset'>
            <ResponsiveContainer type='row' overflow='unset'>
              {socialLinks.map((sections) => (
                <ResponsiveContainer
                  key={sections[0].label}
                  type='column'
                  overflow='unset'
                >
                  <Sections sections={sections} />
                </ResponsiveContainer>
              ))}
            </ResponsiveContainer>
          </ResponsiveContainer>

          <ResponsiveContainer type='column' mobile={6} overflow='unset'>
            <Flex>
              <img src={APIPlatformUrl} alt='postman' loading='lazy' width='109px' height='163px' className='api-platform-image' />
            </Flex>
          </ResponsiveContainer>
        </ResponsiveContainer>

        <ResponsiveContainer type='row' hiddenFor={['computer', 'tablet']} margin={{ marginBottom: 'spacing-xxxl' }}>
          <ResponsiveContainer type='column' mobile={12} overflow='unset'>
            <Flex justifyContent='center'>
              <Text type='body-medium' color='content-color-tertiary'>
                &copy; {new Date().getFullYear()} Postman, Inc.
              </Text>
            </Flex>
          </ResponsiveContainer>
        </ResponsiveContainer>
      </Flex>
    </StyledFooter>
  );
};

export default Footer;
