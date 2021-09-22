import escape from 'lodash/escape';

import type { SubmissionPart } from 'bundles/assess-common/types/NaptimeSubmission';

export function getBlankSubmissionPart(typeName: string, defaultText?: string): SubmissionPart {
  switch (typeName) {
    case 'fileUpload':
      if (defaultText === undefined) {
        return {
          typeName: 'fileUpload',
          definition: {
            caption: '',
            fileUrl: '',
            title: '',
          },
        };
      } else {
        return {
          typeName: 'fileUpload',
          definition: {
            caption: '',
            fileUrl: 'https://www.example.com',
            title: defaultText,
          },
        };
      }

    case 'url':
      if (defaultText === undefined) {
        return {
          typeName: 'url',
          definition: {
            caption: '',
            url: '',
            title: '',
          },
        };
      } else {
        return {
          typeName: 'url',
          definition: {
            caption: '',
            url: 'https://www.example.com',
            title: defaultText,
          },
        };
      }

    case 'plainText':
      if (defaultText === undefined) {
        return {
          typeName: 'plainText',
          definition: {
            plainText: '',
          },
        };
      } else {
        return {
          typeName: 'plainText',
          definition: {
            plainText: defaultText,
          },
        };
      }

    case 'richText':
      return {
        typeName: 'richText',
        definition: {
          richText: {
            // TODO (jcheung) re-enable cml data type once BE Vericite supports scanning CML
            typeName: 'html',
            definition: defaultText != null ? escape(defaultText) : '',
            // typeName: 'cml',
            // definition: {
            //   dtdId: 'peerSubmission/1',
            //   value: `<co-content><text>${escape(defaultText)}</text></co-content>`,
            // },
          },
        },
      };

    case 'offPlatform':
      return {
        typeName: 'offPlatform',
        definition: {},
      };

    default:
      throw new Error(`Unrecognized submission part type ${typeName}.`);
  }
}
