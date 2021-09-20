import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { DescriptionIcon } from '@trello/nachos/icons/description';
import { forTemplate } from '@trello/i18n';
import {
  MarkdownContentType,
  TrelloMarkdown,
} from 'app/src/components/TrelloMarkdown';
import {
  FriendlyLinksRenderer,
  FRIENDLY_LINKS_CONTAINER_CLASS,
} from 'app/gamma/src/components/friendly-links-renderer';
import { CardBackSectionHeading } from './CardBackSectionHeading';
import { Gutter } from './Gutter';

import styles from './DescriptionSection.less';

const format = forTemplate('card_detail');

const MAX_DESCRIPTION_LENGTH = 1800;

interface DescriptionSectionProps {
  description: string;
  descriptionData?: string | null;
}

export const DescriptionSection = ({
  description,
  descriptionData,
}: DescriptionSectionProps) => {
  const [isOpen, setIsOpen] = useState(
    description.length <= MAX_DESCRIPTION_LENGTH,
  );

  const showMore = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const customEmojis = {
    textData: JSON.parse(descriptionData || '{ "emoji": {} }'),
  };

  return (
    <div>
      <CardBackSectionHeading
        title={format('description')}
        icon={<DescriptionIcon size="large" />}
      />
      <Gutter>
        <div
          className={classNames(
            styles.descriptionContent,
            isOpen && styles.open,
          )}
        >
          <button className={styles.descriptionMask} onClick={showMore}>
            <div className={styles.showMoreButton}>
              {format('show-full-description')}
            </div>
          </button>
          <div className={styles.description}>
            <FriendlyLinksRenderer>
              <div className={FRIENDLY_LINKS_CONTAINER_CLASS}>
                <TrelloMarkdown
                  contentType={MarkdownContentType.Description}
                  text={description}
                  options={customEmojis}
                />
              </div>
            </FriendlyLinksRenderer>
          </div>
        </div>
      </Gutter>
    </div>
  );
};
