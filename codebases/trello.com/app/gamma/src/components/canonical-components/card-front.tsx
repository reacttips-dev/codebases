import { isHighDPI } from '@trello/browser';
import {
  CanonicalCard,
  CanonicalAvatar as Avatar,
} from '@atlassian/trello-canonical-components';
import { forTemplate } from '@trello/i18n';
import {
  biggestPreview,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';
import React from 'react';
import {
  BadgesModel,
  CoverPhotoModel,
  LabelModel,
  MemberModel,
  StickerModel,
  TeamModel,
  CoverColor,
  CardRole,
} from 'app/gamma/src/types/models';
import { formatHumanDate } from '@trello/dates';
import { getStringForCombinedDateBadge } from 'app/gamma/src/util/dates';
import {
  byAttributeCaseInsensitive,
  labelByColor,
} from 'app/gamma/src/util/sort';
import { HasNonNullKeys } from 'app/gamma/src/util/types';
import { LinkWrapper } from 'app/src/components/RouterLink/LinkWrapper';
import { CardTemplateBadge } from '@atlassian/trello-canonical-components/src/card-front/Badges';
import {
  Red400,
  TrelloBlue300,
  Green400,
  Orange400,
  Purple400,
  Yellow400,
  Pink400,
  Sky400,
  Lime400,
  N800,
} from '@trello/colors';
import {
  featureFlagClient,
  seesVersionedVariation,
} from '@trello/feature-flag-client';
import {
  CardLabel,
  labelColorToColorBlindPattern,
} from '@atlassian/trello-canonical-components/src/card-front/CardLabel';
import { LinkCard } from 'app/src/components/CardFronts/LinkCard';
import { noop } from 'app/src/noop';

const {
  ArchivedBadge,
  AttachmentsBadge,
  Card,
  CardBadges,
  CardCover,
  CardDetails,
  CardLabels,
  CardLink: CardLinkComponent,
  CardMembers,
  CardStickers,
  CardTitle,
  ChecklistBadge,
  CommentsBadge,
  DescriptionBadge,
  DueDateBadge,
  NotificationBadge,
  Sticker,
  SubscribedBadge,
  TrelloAttachmentsBadge,
  VotesBadge,
} = CanonicalCard;

const MAX_COVER_HEIGHT = 260;
const DEFAULT_CARD_WIDTH = 245;
const DEFAULT_STICKER_AREA_HEIGHT = 64;

const format = forTemplate('canonical_card');

const colorCoverColors: {
  [key in CoverColor]: string;
} = {
  red: Red400,
  blue: TrelloBlue300,
  green: Green400,
  orange: Orange400,
  purple: Purple400,
  yellow: Yellow400,
  pink: Pink400,
  sky: Sky400,
  lime: Lime400,
  black: N800,
};

const colorCoverColorBlindPattern: {
  [key in CoverColor]:
    | 'StripeDiagonal'
    | 'WaveSquare'
    | 'StripeVertical'
    | 'DotsChecker'
    | 'GrooveDiagonal'
    | 'StripeHorizontal'
    | 'BrickHorizontal'
    | 'BrickDiagonal'
    | 'Scale'
    | 'BrickVertical';
} = {
  red: 'DotsChecker',
  blue: 'StripeHorizontal',
  green: 'StripeDiagonal',
  orange: 'StripeVertical',
  purple: 'GrooveDiagonal',
  yellow: 'WaveSquare',
  pink: 'BrickHorizontal',
  sky: 'BrickDiagonal',
  lime: 'Scale',
  black: 'BrickVertical',
};

/*
 * Extract the height, img url, and background color/size for the card cover
 * from the CoverPhotoModel. Calculates the height dynamically based on the
 * cover dimensions and available space (which is not *actually* the available
 * space, but based on some given defaults). Has an escape hatch to override
 * the height with a fixed size for use-cases where that's needed - such as in
 * search results.
 */
const getCoverProps = (
  cover: CoverPhotoModel | null | undefined,
  {
    hasStickers,
    heightOverride,
    colorBlind,
  }: {
    hasStickers?: boolean;
    heightOverride?: number | undefined;
    colorBlind?: boolean;
  } = {},
): {
  height: number;
  img?: string;
  bgColor?: string | null;
  bgSize?: 'cover' | 'contain';
  sharedSourceUrl?: string;
} => {
  const details = {
    height: 0,
    img: '' as string | undefined,
    bgColor: '' as string | undefined | null,
    bgSize: 'cover' as 'cover' | 'contain' | undefined,
    sharedSourceUrl: '' as string | undefined,
    pattern: null as string | null,
  };

  if (!cover) {
    return details;
  }

  const preview = cover
    ? smallestPreviewBiggerThan(cover.previews, isHighDPI() ? 600 : 300) ||
      biggestPreview(cover.previews)
    : null;

  if (preview) {
    details.img = preview.url ? preview.url : cover.url;
    details.sharedSourceUrl = cover.sharedSourceUrl;
    details.bgColor = cover.edgeColor;

    const max = Math.min(preview.height, MAX_COVER_HEIGHT);
    const scaled = (preview.height * DEFAULT_CARD_WIDTH) / preview.width;
    if (scaled <= max) {
      details.height = scaled;
      details.bgSize = 'cover';
    } else {
      details.height = max;
      details.bgSize = 'contain' as 'cover' | 'contain';
    }
  }

  if (cover.color) {
    details.bgColor = colorCoverColors[cover.color as CoverColor];
    details.height = hasStickers ? 64 : 32;

    if (colorBlind) {
      details.bgSize = undefined;
      details.pattern = colorCoverColorBlindPattern[cover.color as CoverColor];
    }
  }

  // Let above run based on default sizing and *then* override
  details.height = heightOverride ? heightOverride : details.height;

  return details;
};

interface CardContentsProps {
  readonly name?: string;
  readonly badges?: BadgesModel;
  readonly team?: TeamModel | null;
  readonly members?: MemberModel[];
  readonly colorBlind?: boolean;
  readonly labels?: LabelModel[];
  readonly cover?: CoverPhotoModel | null;
  readonly coverHeight?: number;
  readonly archived?: boolean;
  readonly isTemplate?: boolean;
  readonly stickers?: StickerModel[];
  readonly numNotifications?: number;
  readonly expandLabels?: boolean;
  readonly replacements?: {
    CardTitle?: React.ReactElement;
  };
  readonly truncateNameForFullCover?: boolean;
  readonly cardRole?: CardRole | null;
}

export const CardContents: React.FunctionComponent<CardContentsProps> = ({
  name,
  team,
  members = [],
  labels = [],
  colorBlind,
  cover,
  coverHeight,
  archived,
  badges,
  isTemplate,
  stickers = [],
  expandLabels,
  numNotifications,
  replacements = {},
  cardRole,
}) => {
  const trelloAttachments =
    badges && badges.attachmentsByType
      ? badges.attachmentsByType.trello.board +
        badges.attachmentsByType.trello.card
      : 0;
  const attachments = badges ? badges.attachments - trelloAttachments : 0;
  const coverProps = getCoverProps(cover, {
    hasStickers: stickers.length > 0,
    heightOverride: coverHeight,
    colorBlind,
  });
  const deactivatedMembers = new Set(
    team && team.memberships
      ? team.memberships
          .filter((membership) => membership.deactivated)
          .map((membership) => membership.idMember)
      : [],
  );

  const shouldSeeCombinedbadges = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  const isLinkCard =
    featureFlagClient.get('wildcard.link-cards', false) && cardRole === 'link';

  if (isLinkCard && name) {
    return (
      <CardDetails>
        <LinkCard
          url={name}
          isEditable={false}
          openEditor={noop}
          hideCover={true}
          hideActions={true}
        />
      </CardDetails>
    );
  }

  return (
    <>
      {cover && cover.size !== 'full' && <CardCover {...coverProps} />}
      {stickers.length > 0 && (
        <CardStickers
          height={
            coverProps.height ? coverProps.height : DEFAULT_STICKER_AREA_HEIGHT
          }
        >
          {stickers.map((sticker) => (
            <Sticker
              key={sticker.id}
              left={sticker.left}
              top={sticker.top}
              alt={sticker.image}
              img={
                isHighDPI() && sticker.imageUrl2x
                  ? sticker.imageUrl2x
                  : sticker.imageUrl
              }
              rotate={sticker.rotate}
              zIndex={sticker.zIndex}
            />
          ))}
        </CardStickers>
      )}
      <CardDetails>
        {labels && labels.length > 0 && (
          <CardLabels>
            {labels
              .filter((label) => !!label.color)
              .sort(labelByColor)
              .map((label: HasNonNullKeys<LabelModel, 'color'>) => (
                <CardLabel
                  key={label.id}
                  color={label.color}
                  pattern={
                    colorBlind
                      ? labelColorToColorBlindPattern[label.color]
                      : null
                  }
                >
                  {expandLabels ? label.name || ' ' : null}
                </CardLabel>
              ))}
          </CardLabels>
        )}
        {replacements.CardTitle ? (
          replacements.CardTitle
        ) : (
          <CardTitle>{name}</CardTitle>
        )}
        <CardBadges>
          {isTemplate && (
            <CardTemplateBadge>
              {format('card template badge label')}
            </CardTemplateBadge>
          )}
          {!!numNotifications && (
            <NotificationBadge numUnread={numNotifications} />
          )}
          {badges && badges.subscribed && <SubscribedBadge />}
          {badges && badges.votes > 0 && !isTemplate && (
            <VotesBadge
              numVotes={badges.votes}
              voted={badges.viewingMemberVoted}
            />
          )}
          {badges && (badges.start || badges.due) && !isTemplate && (
            <DueDateBadge dueDate={badges.due} isComplete={badges.dueComplete}>
              {shouldSeeCombinedbadges &&
                getStringForCombinedDateBadge(badges.start, badges.due)}
              {!shouldSeeCombinedbadges &&
                badges.due &&
                formatHumanDate(badges.due)}
            </DueDateBadge>
          )}
          {badges && badges.description && <DescriptionBadge />}
          {badges && badges.comments > 0 && (
            <CommentsBadge numComments={badges.comments} />
          )}
          {attachments > 0 && <AttachmentsBadge numAttachments={attachments} />}
          {trelloAttachments > 0 && (
            <TrelloAttachmentsBadge numAttachments={trelloAttachments} />
          )}
          {badges && badges.checklistItems > 0 && (
            <ChecklistBadge
              numItems={badges.checklistItems}
              numComplete={badges.checklistItemsChecked}
              checkItemsEarliestDue={badges.checkItemsEarliestDue}
            />
          )}
          {archived && !isTemplate && (
            <ArchivedBadge>{format('archived card badge label')}</ArchivedBadge>
          )}
        </CardBadges>
        {members && members.length > 0 && (
          <CardMembers>
            {members
              .sort(byAttributeCaseInsensitive('name'))
              .reduceRight((result: JSX.Element[], member) => {
                result.push(
                  <Avatar
                    key={member.id}
                    avatarSource={member.avatarSource}
                    deactivated={
                      deactivatedMembers.has(member.id) ||
                      member.activityBlocked
                    }
                    img={member.avatars && member.avatars[30]}
                    initials={member.initials}
                    lightBackground
                  />,
                );

                return result;
              }, [])}
          </CardMembers>
        )}
      </CardDetails>
    </>
  );
};

export interface CardFrontProps extends CardContentsProps {
  className?: string;
  style?: React.CSSProperties;
}

export const CardFront = ({ className, style, ...props }: CardFrontProps) => (
  <Card
    className={className}
    style={style}
    cover={props.cover}
    colorBlind={props.colorBlind}
    coverHeight={props.coverHeight}
    truncateNameForFullCover={props.truncateNameForFullCover}
    hasStickers={!!props.stickers?.length}
  >
    <CardContents {...props} />
  </Card>
);

export interface CardLinkProps extends CardContentsProps {
  className?: string;
  url: string;
}

export const CardLink = ({ url, className, ...props }: CardLinkProps) => (
  <CardLinkComponent
    className={className}
    href={url}
    linkComponent={LinkWrapper}
    cover={props.cover}
    colorBlind={props.colorBlind}
    truncateNameForFullCover={props.truncateNameForFullCover}
    coverHeight={props.coverHeight}
    hasStickers={!!props.stickers?.length}
  >
    <CardContents {...props} />
  </CardLinkComponent>
);
