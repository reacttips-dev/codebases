import {
  INVITE_USER_DOCS,
  MOCK_DOCS,
  MONITORING_DOCS,
  LIVE_DOCS
} from '../../constants/AppUrlConstants';

const entityMap = {
  'invite': [
    {
      imageName: '1',
      caption: 'Share collections, environments, etc., in team workspaces and collaborate in real time.'
    },
    {
      imageName: '2',
      caption: 'Maintain a single source of truth for all your APIs, synced in real time.'
    },
    {
      imageName: '3',
      caption: 'Invite unlimited number of people.'
    }
  ],
  'documentation': [
    {
      imageName: '1',
      caption: 'Create detailed, web-viewable documentation for your API.'
    },
    {
      imageName: '2',
      caption: 'Include tests, examples, descriptions, and code snippets, available in multiple languages.'
    },
    {
      imageName: '3',
      caption: 'Customize the look with your own logo & colors.'
    }
  ],
  'monitor': [
    {
      imageName: '1',
      caption: 'Schedule your collection runs to check for their performance and response.'
    },
    {
      imageName: '2',
      caption: 'View all your past runs in a beautiful timeline.'
    },
    {
      imageName: '3',
      caption: 'Set integrations to receive alerts.'
    }
  ],
  'mock': [
    {
      imageName: '1',
      caption: 'Design APIs before you start developing them.'
    },
    {
      imageName: '2',
      caption: 'Simulate each endpoint and its corresponding response.'
    },
    {
      imageName: '3',
      caption: 'Share the mock server with your teammates privately.'
    }
  ]
};

/**
 *
 * @param {String} type
 */
function getSubtitleText (type) {
  let genText = (actionText) => `You need to be signed in to ${actionText}. Go ahead and
    create an account. It is free!`;

  switch (type) {
    case 'invite': return genText('invite someone');
    case 'monitor':
    case 'mock': return genText(`${type} your collections`);
    case 'documentation': return genText('create an API documentation');
  }
}

/**
 *
 * @param {String} type
 */
function getLearnMoreText (type) {
  switch (type) {
    case 'invite':
    case 'monitor':
    case 'mock': return 'Learn more';
    case 'documentation': return 'See live example';
  }
}

/**
 * @param {String} type
 */
function getCarouselTitle (type) {
  let genTitle = (text) => `${text} in Postman`;

  switch (type) {
    case 'invite': return genTitle('Collaborate');
    case 'monitor': return genTitle('Monitoring APIs');
    case 'mock': return genTitle('Mock APIs');
    case 'documentation': return genTitle('API documentation');
  }
}

/**
 * @param {String} type
 */
function getLearnMoreLink (type) {
  switch (type) {
    case 'invite': return INVITE_USER_DOCS;
    case 'monitor': return MONITORING_DOCS;
    case 'mock': return MOCK_DOCS;
    case 'documentation': return LIVE_DOCS;
  }
}

/**
 *
 * @param {String} type
 */
export function getType (type) {
  return entityMap[type] ? type : 'invite';
}

/**
 *
 * @param {String} type
 */
export function getEmptyStateDataForType (type) {
  type = getType(type);

  return {
    type,
    subtitle: getSubtitleText(type),
    carouselTitle: getCarouselTitle(type),
    carouselData: entityMap[type],
    learnMoreText: getLearnMoreText(type),
    learnMoreLink: getLearnMoreLink(type),
    hasLargeContent: ['invite', 'mock'].includes(type)
  };
}
