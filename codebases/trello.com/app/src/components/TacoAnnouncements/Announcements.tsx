import React, { useEffect } from 'react';
import { Announcement } from './Announcement';
import { AnnouncementsFooter } from './AnnouncementsFooter';
import { useAnnouncementsQuery } from './AnnouncementsQuery.generated';
import { useDismissAnnouncementMutation } from './DismissAnnouncementMutation.generated';
import {
  markAsRead,
  isUnread,
  concatAnnouncements,
  Announcement as AnnouncementType,
} from './helpers';
import { Analytics } from '@trello/atlassian-analytics';

interface AnnouncementsProps {
  announcements: AnnouncementType[];
  onDismissAnnouncements: () => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements: unreadAnnouncements,
  onDismissAnnouncements,
}) => {
  /*
   * Kick off a query to the ALL announcements API to get all
   * announcements the user can see when we open the popover,
   * and supplement the unread announcements with them once
   * they are returned
   */
  const { data } = useAnnouncementsQuery({
    variables: {
      filter: 'all',
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const allAnnouncements = concatAnnouncements(
    unreadAnnouncements,
    data?.announcements ?? [],
  );

  /*
   * When this popover is shown, flag all announcements as read
   * in localStorage, and dismiss the announcement on the server
   * so it will no longer be returned by the announcements API.
   * Also set the tacoShow storage timestamp for 1 hour in the
   * future.
   */
  const [dismissAnnouncement] = useDismissAnnouncementMutation();
  useEffect(() => {
    const dismissAllAnnouncements = async () => {
      const dismissPromises = allAnnouncements.reduce(
        (result, announcement) => {
          if (isUnread(announcement.id)) {
            markAsRead(announcement.id);
            Analytics.sendDismissedComponentEvent({
              componentType: 'announcement',
              componentName: 'tacoAnnouncement',
              source: 'tacoAnnouncementInlineDialog',
              attributes: {
                announcementId: announcement.id,
              },
            });

            result.push(
              dismissAnnouncement({
                variables: {
                  announcementId: announcement.id,
                },
              }),
            );
          }
          return result;
        },
        [] as ReturnType<typeof dismissAnnouncement>[],
      );

      /*
       * If there are any new announcements that just got dismissed,
       * call back up to the button component to refetch it's query
       * in order to put Taco into his crouched position
       */
      if (dismissPromises.length > 0) {
        await Promise.all(dismissPromises);
        onDismissAnnouncements();
      }
    };

    dismissAllAnnouncements();
  }, [allAnnouncements, dismissAnnouncement, onDismissAnnouncements]);

  return (
    <>
      {allAnnouncements.map((announcement) => (
        <Announcement key={announcement.id} {...announcement} />
      ))}
      <AnnouncementsFooter highlightedUrl={allAnnouncements[0]?.url} />
    </>
  );
};
