import React from 'react';
import { Ad } from './types';
import {
  AmbassadorIcon,
  ListenerSupoortIcon,
  PremiumSponsorshipIcon,
  PodcastSubscriptionsIcon,
  SPANIcon,
} from '../Icons';

export const PODCAST_AD_TYPES: Ad[] = [
  {
    adType: {
      description:
        'Anchor ads play across Spotify and other listening platforms where your podcast is distributed.',
      type: (
        <>
          Ads by <span>Anchor</span>
        </>
      ),
    },
    body: {
      language:
        'Performance-based, host-read house ads spreading the word about Anchor to listeners.',
      svg: (screenType: string) => (
        <AmbassadorIcon aria-hidden={true} screen={screenType} />
      ),
    },
    stats: [
      {
        body: '50 Listeners',
        link: '',
        subtext: '',
        title: 'Qualification',
      },
      {
        body: 'Host',
        link: '',
        subtext: '',
        title: 'Who Reads the Ad',
      },
      {
        body: 'Get started',
        link: '/ads-by-anchor',
        subtext: 'Once you reach 50 listeners, click on the monetization tab.',
        title: 'How to Sign Up',
      },
    ],
    title: 'Ambassador Ads',
  },
  {
    adType: {
      description:
        'Anchor ads play across Spotify and other listening platforms where your podcast is distributed.',
      type: (
        <>
          Ads by <span>Anchor</span>
        </>
      ),
    },
    body: {
      language:
        'Become a part of the Spotify Audience Network, and get access to ads from third-party brands, targeted to your listeners. Sponsor-read ads are automatically inserted in host-selected ad slots.',
      svg: (screenType: string) => (
        <SPANIcon aria-hidden={true} screen={screenType} />
      ),
    },
    stats: [
      {
        body: 'Any creator can apply',
        link: '',
        subtext:
          'Selection criteria includes: unique listeners, listening hours, Spotify followers, content that fits within Spotify ad guidelines.',
        title: 'Qualification',
      },
      {
        body: 'Sponsor',
        link: '',
        subtext: '',
        title: 'Who Reads the Ad',
      },
      {
        body: 'Waitlist',
        link: '',
        subtext: 'In closed beta.',
        title: 'How to Sign Up',
      },
    ],
    title: 'Automated Ads',
  },
  {
    adType: {
      description:
        'Anchor ads play across Spotify and other listening platforms where your podcast is distributed.',
      type: (
        <>
          Ads by <span>Anchor</span>
        </>
      ),
    },
    body: {
      language:
        'Host-read ads for third-party brands. Available for creators with the highest listener engagement.',
      svg: (screenType: string) => (
        <PremiumSponsorshipIcon aria-hidden={true} screen={screenType} />
      ),
    },
    stats: [
      {
        body: '10,000 listeners',
        link: '',
        subtext: '',
        title: 'Qualification',
      },
      {
        body: 'Host',
        link: '',
        subtext: '',
        title: 'Who Reads the Ad',
      },
      {
        body: '-',
        link: '',
        subtext:
          'An Anchor partner manager will reach out if you qualify for Anchor Partner Ads.',
        title: 'How to Sign Up',
      },
    ],
    title: 'Premium Sponsorships',
  },
  {
    adType: {
      description: 'Set your price from a variety of options.',
      type: (
        <>
          <span>Fan-supported:</span>
        </>
      ),
    },
    body: {
      language:
        'Monthly paid podcast subscriptions allowing listeners to support creators directly in return for bonus content and perks.',
      svg: (screenType: string) => (
        <PodcastSubscriptionsIcon aria-hidden={true} screen={screenType} />
      ),
    },
    stats: [
      {
        body: 'No minimum listenership',
        link: '',
        subtext: '',
        title: 'Qualification',
      },
      {
        body: '-',
        link: '',
        subtext: '',
        title: 'Who Reads the Ad',
      },
      {
        body: 'Set up',
        link: '',
        subtext: 'Set up your Podcast Subscription to get started.',
        title: 'How to Sign Up',
      },
    ],
    title: 'Podcast Subscriptions',
  },
  {
    adType: {
      description: 'The listener decides how much to give monthly.',
      type: (
        <>
          <span>Fan-supported:</span>
        </>
      ),
    },
    body: {
      language:
        'Allows creators’ most loyal listeners to support their favorite shows via a monthly donation.',
      svg: (screenType: string) => (
        <ListenerSupoortIcon aria-hidden={true} screen={screenType} />
      ),
    },
    stats: [
      {
        body: 'No minimum listenership',
        link: '',
        subtext: '',
        title: 'Qualification',
      },
      {
        body: '-',
        link: '',
        subtext: '',
        title: 'Who Reads the Ad',
      },
      {
        body: 'Set up',
        link: '',
        subtext: 'Set up Listener Support via Anchor.',
        title: 'How to Sign Up',
      },
    ],
    title: 'Listener Support',
  },
];
