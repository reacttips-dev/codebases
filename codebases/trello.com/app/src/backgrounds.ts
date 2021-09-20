/* eslint-disable import/no-default-export, @trello/disallow-filenames */
const CC_LICENSE = 'http://creativecommons.org/licenses/by/2.0/deed.en';

enum BackgroundPackName {
  Photos = 'Photos',
  Patterns = 'Patterns and Textures',
  Unsplash = 'Unsplash',
}

interface BackgroundPack {
  name: BackgroundPackName;
}

enum BackgroundBrightness {
  Dark = 'dark',
  Light = 'light',
}

export enum BackgroundType {
  Color = 'default',
  Gradient = 'gradient',
  Premium = 'premium',
  Unsplash = 'unsplash',
}

export interface DefaultBackground {
  type: BackgroundType.Color;
  brightness: BackgroundBrightness;
  color: string;
}

export interface GradientBackground {
  type: BackgroundType.Gradient;
  path: string;
  color: string;
  emoji: string;
}
interface BackgroundScale {
  width: number;
  height: number;
  url: string;
}

interface BackgroundAttribution {
  url: string;
  name: string;
  license: string;
}

interface PremiumBackground {
  type: BackgroundType.Premium;
  pack: BackgroundPack;
  fullSizeUrl: string;
  attribution?: BackgroundAttribution;
  brightness?: BackgroundBrightness;
  scaled?: BackgroundScale[];
  discontinued?: boolean;
  tile?: boolean;
}

export type Background = DefaultBackground | PremiumBackground;

const BACKGROUNDPACKS: { [key: string]: BackgroundPack } = {
  photos: {
    name: BackgroundPackName.Photos,
  },
  patterns: {
    name: BackgroundPackName.Patterns,
  },
  unsplash: {
    name: BackgroundPackName.Unsplash,
  },
};

const colors: { [key: string]: DefaultBackground } = {
  blue: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#0079BF',
  },

  orange: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#D29034',
  },

  green: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#519839',
  },

  red: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#B04632',
  },

  purple: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#89609E',
  },

  pink: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#CD5A91',
  },

  lime: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#4BBF6B',
  },

  sky: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#00AECC',
  },

  grey: {
    type: BackgroundType.Color,
    brightness: BackgroundBrightness.Dark,
    color: '#838C91',
  },
};

// Gradients
const gradients: { [key: string]: GradientBackground } = {
  'gradient-snow': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-snow.svg'),
    color: '#009ED0',
    emoji: '❄️',
  },

  'gradient-ocean': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-ocean.svg'),
    color: '#054C81',
    emoji: '🌊',
  },

  'gradient-crystal': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-crystal.svg'),
    color: '#792D7D',
    emoji: '🔮',
  },

  'gradient-rainbow': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-rainbow.svg'),
    color: '#AF78CE',
    emoji: '🌈',
  },

  'gradient-peach': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-peach.svg'),
    color: '#EB5B7E',
    emoji: '🍑',
  },

  'gradient-flower': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-flower.svg'),
    color: '#CA80A5',
    emoji: '🌸',
  },

  'gradient-earth': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-earth.svg'),
    color: '#29A383',
    emoji: '🌎',
  },

  'gradient-alien': {
    type: BackgroundType.Gradient,
    path: require('resources/images/gradients/gradient-alien.svg'),
    color: '#344563',
    emoji: '👽',
  },

  'gradient-volcano': {
    type: BackgroundType.Gradient,
    color: '#6B474B',
    path: require('resources/images/gradients/gradient-volcano.svg'),
    emoji: '🌋',
  },
};

const photos: { [key: string]: PremiumBackground } = {
  mountain: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Light,
    fullSizeUrl: require('resources/images/backgrounds/mountain/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1696,
        url: require('resources/images/backgrounds/mountain/large.jpg'),
      },
      {
        width: 1024,
        height: 724,
        url: require('resources/images/backgrounds/mountain/medium.jpg'),
      },
      {
        width: 320,
        height: 227,
        url: require('resources/images/backgrounds/mountain/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/62681247@N00/6575973407/',
      name: 'jqmj (Queralt)',
      license: CC_LICENSE,
    },
  },

  cosmos: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/cosmos/full.jpg'),
    scaled: [
      {
        width: 2047,
        height: 1638,
        url: require('resources/images/backgrounds/cosmos/large.jpg'),
      },
      {
        width: 1600,
        height: 1280,
        url: require('resources/images/backgrounds/cosmos/medium.jpg'),
      },
      {
        width: 320,
        height: 256,
        url: require('resources/images/backgrounds/cosmos/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/gsfc/6945160410/',
      name: 'NASA Goddard Space Flight Center',
      license: CC_LICENSE,
    },
  },

  rain: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/rain/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/rain/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/rain/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/rain/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/vinothchandar/5243641910/',
      name: 'Vinoth Chandar',
      license: CC_LICENSE,
    },
  },

  dew: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Light,
    fullSizeUrl: require('resources/images/backgrounds/dew/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1594,
        url: require('resources/images/backgrounds/dew/large.jpg'),
      },
      {
        width: 1024,
        height: 680,
        url: require('resources/images/backgrounds/dew/medium.jpg'),
      },
      {
        width: 320,
        height: 212,
        url: require('resources/images/backgrounds/dew/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/jenny-pics/5584430423/',
      name: 'Jenny Downing',
      license: CC_LICENSE,
    },
  },

  'snow-bokeh': {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/snow-bokeh/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: require('resources/images/backgrounds/snow-bokeh/large.jpg'),
      },
      {
        width: 1024,
        height: 681,
        url: require('resources/images/backgrounds/snow-bokeh/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/snow-bokeh/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/tabor-roeder/5337595458/',
      name: 'Phil Roeder',
      license: CC_LICENSE,
    },
  },

  city: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/city/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1594,
        url: require('resources/images/backgrounds/city/large.jpg'),
      },
      {
        width: 1024,
        height: 680,
        url: require('resources/images/backgrounds/city/medium.jpg'),
      },
      {
        width: 320,
        height: 212,
        url: require('resources/images/backgrounds/city/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/nosha/2907855809/',
      name: 'Nathan Siemers',
      license: CC_LICENSE,
    },
  },

  canyon: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Light,
    fullSizeUrl: require('resources/images/backgrounds/canyon/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: require('resources/images/backgrounds/canyon/large.jpg'),
      },
      {
        width: 1024,
        height: 681,
        url: require('resources/images/backgrounds/canyon/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/canyon/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/wolfgangstaudt/2252688630/',
      name: 'Wolfgang Staudt',
      license: CC_LICENSE,
    },
  },

  ocean: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/ocean/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/ocean/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/ocean/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/ocean/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/mattphipps/4635112852/',
      name: 'MattJP',
      license: CC_LICENSE,
    },
  },

  river: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/river/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/river/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/river/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/river/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/22746515@N02/3114276532/',
      name: 'Bert Kaufmann',
      license: CC_LICENSE,
    },
  },

  fall: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    discontinued: true,
    fullSizeUrl: require('resources/images/backgrounds/fall/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1596,
        url: require('resources/images/backgrounds/fall/large.jpg'),
      },
      {
        width: 1024,
        height: 681,
        url: require('resources/images/backgrounds/fall/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/fall/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/mendhak/4107993637/',
      name: 'mendhak',
      license: CC_LICENSE,
    },
  },

  snow: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.photos,
    discontinued: true,
    fullSizeUrl: require('resources/images/backgrounds/snow/full.jpg'),
    scaled: [
      {
        width: 2400,
        height: 1600,
        url: require('resources/images/backgrounds/snow/large.jpg'),
      },
      {
        width: 1024,
        height: 683,
        url: require('resources/images/backgrounds/snow/medium.jpg'),
      },
      {
        width: 320,
        height: 213,
        url: require('resources/images/backgrounds/snow/small.jpg'),
      },
    ],
    attribution: {
      url: 'http://www.flickr.com/photos/zachd1_618/5386165480/',
      name: 'Zach Dischner',
      license: CC_LICENSE,
    },
  },
};

const patterns: { [key: string]: PremiumBackground } = {
  purty_wood_dark: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    tile: true,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/purty_wood_dark.png'),
    attribution: {
      url: 'http://subtlepatterns.com/purty-wood/',
      name: 'Richard Tabor',
      license: CC_LICENSE,
    },
  },

  'subtle-irongrip': {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    tile: true,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/subtle-irongrip.png'),
    attribution: {
      url: 'http://subtlepatterns.com/iron-grip/',
      name: 'Tony Kinard',
      license: CC_LICENSE,
    },
  },
  'red-sweater': {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    tile: true,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/red-sweater.png'),
    attribution: {
      url: 'http://subtlepatterns.com/wild-oliva/',
      name: 'Badhon Ebrahim',
      license: CC_LICENSE,
    },
  },

  hex: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    tile: true,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/hex.png'),
  },

  wave: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    tile: true,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/wave.png'),
  },

  bricks: {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    tile: true,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/bricks.png'),
  },

  'purple-blur': {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/purple-blur.png'),
  },

  'orange-blur': {
    type: BackgroundType.Premium,
    pack: BACKGROUNDPACKS.patterns,
    brightness: BackgroundBrightness.Dark,
    fullSizeUrl: require('resources/images/backgrounds/orange-blur.png'),
  },
};

export default {
  all: { ...colors, ...gradients, ...photos, ...patterns },
  colors,
  gradients,
  photos,
  patterns,
};
