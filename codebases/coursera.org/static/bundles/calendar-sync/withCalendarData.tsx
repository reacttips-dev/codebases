import React from 'react';

import waitForGraphQL from 'js/lib/waitForGraphQL';
import gql from 'graphql-tag';
import user from 'js/lib/user';

import { compose, branch, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import { naptime } from '@coursera/graphql-utils';

type Props = {
  RenderComponent: React.ComponentType;
  createCalendarMutation: (_: any) => Promise<any>;
  url: string;
  userId: number | string;
  data: {
    refetch?: () => void;
  };
};

const withMutation = graphql(
  naptime`
    mutation($body: BodyInput) {
      LearnerCalendarsV1Resource {
        create(body: $body)
      }
    }
  `,
  { name: 'createCalendarMutation' }
);

class WithCalendarDataWrapper extends React.PureComponent<Props> {
  componentDidMount() {
    const { createCalendarMutation, data, userId, url } = this.props;

    if (!url) {
      // if there is no calendar, make POST to create calendar
      const body = {
        // To prevent any type issues (and to remain compatible with type checking), we must
        // force the userId to be a number by parsing a string representation of it
        userId: Number.parseInt(userId.toString(), 10),
        shouldDisplayContent: true,
      };

      createCalendarMutation({
        variables: {
          body: JSON.stringify(body),
        },
      }).then(() => {
        data?.refetch?.();
      });
    }
  }

  render() {
    const { RenderComponent, url, ...props } = this.props;

    // The URL passed to us from the server will inherently contain
    // a web protocol (http/https) prefix. In order to append our own
    // (for specialty URLs such as webcal), we must strip out this prefix
    const trimmedUrl = url ? url.replace(/^https?:\/\//g, '') : url;

    let rest = { ...props, calendar: null };

    if (url !== null) {
      const google = `https://calendar.google.com/calendar/r/week?cid=http://${trimmedUrl}`;
      const webcal = `webcal://${trimmedUrl}`;

      rest = {
        ...rest,
        // @ts-expect-error TSMIGRATION
        calendar: {
          google,
          webcal,
          ics: url,
        },
      };
    }

    return <RenderComponent {...rest} />;
  }
}

export default (Component: React.ComponentType) => {
  const WithCalendarData = (props: $TSFixMe) => <WithCalendarDataWrapper RenderComponent={Component} {...props} />;

  return compose(
    withProps(() =>
      ((userId) => ({
        userId,
        userIdString: userId.toString(),
      }))(user.get().id)
    ),
    waitForGraphQL(
      gql`
        query CalendarSettingsQuery($userIdString: String!) {
          LearnerCalendarsV1Resource {
            get(id: $userIdString) {
              id
              shouldDisplayContent
              url
            }
          }
        }
      `,
      {
        props: ({ data }) => {
          // @ts-expect-error TSMIGRATION
          const { LearnerCalendarsV1Resource } = data;

          if (LearnerCalendarsV1Resource) {
            const { get } = LearnerCalendarsV1Resource;

            if (!get) {
              return {
                data,
              };
            }

            const { id, shouldDisplayContent, url } = get;

            return {
              data,
              id,
              shouldDisplayContent,
              url,
            };
          }
          return {};
        },
      }
    ),
    // @ts-expect-error TSMIGRATION
    branch(({ url }) => !url, withMutation)
  )(WithCalendarData);
};
