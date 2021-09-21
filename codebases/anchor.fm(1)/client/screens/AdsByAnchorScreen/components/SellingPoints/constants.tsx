import React from 'react';
import {
  MixerIcon,
  MicIcon,
  ClockIcon,
  ListenerIcon,
} from 'client/screens/AdsByAnchorScreen/components/Icons';

const SELLING_POINTS = [
  {
    svg: <MixerIcon />,
    heading: 'Flexible options for every podcaster',
    copy:
      'Whatever your audience size or time investment, Anchor has a monetization solution for you. Mix and match options to maximize your earnings, and switch at any time to adapt to your goals.',
  },
  {
    svg: <MicIcon />,
    heading: 'Opening up monetization to more creators',
    copy:
      'Increase your revenue and advertisers, not your sales team. Get paired with world-class brands that want to reach your audience through the best audio ad technology.',
  },
  {
    svg: <ClockIcon />,
    heading: 'Save time and focus on what you love',
    copy:
      'Streamlined yet powerful solutions for the busy creator. Tell us where to place your ad and we’ll do the rest. All from one podcast management platform.',
  },
  {
    svg: <ListenerIcon />,
    heading: 'Without compromising on listener experience',
    copy:
      'For sponsor-read ads, the Spotify Audience Network delivers more relevant ads to each listener. Prefer host-read ads for your audience? We’ve got you covered.',
  },
];

export { SELLING_POINTS };
