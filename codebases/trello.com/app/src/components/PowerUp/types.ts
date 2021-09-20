/* eslint-disable @trello/disallow-filenames */
interface IconProps {
  url: string;
}

export interface HeroImageUrl {
  '@1x': string;
  '@2x': string;
}

export interface BadgeProps {
  button?: JSX.Element;
  usage?: number;
  promotional: boolean;
  staffPick: boolean;
  integration: boolean;
}

export interface AtomProps {
  button?: JSX.Element;
  className?: string;
  icon: IconProps;
  name: string;
  subtitle?: string;
  usage?: number;
  promotional: boolean;
  staffPick: boolean;
  integration: boolean;
}

export interface DescriptionAtomProps extends AtomProps {
  overview: string;
}

export interface FeaturedAtomProps extends DescriptionAtomProps {
  heroImageUrl: HeroImageUrl | undefined | null;
}

export interface ListingAtomProps extends AtomProps {}

export type PowerUpAtomProps =
  | AtomProps
  | DescriptionAtomProps
  | FeaturedAtomProps;

export enum PowerUpItemType {
  Basic,
  Description,
  Featured,
  Listing,
  Integration,
}
