import { CaptionPosition, SecondaryImagePosition } from './index';

function getIsSecondaryLeft(
  secondaryImagePosition: SecondaryImagePosition
): boolean {
  return (
    secondaryImagePosition === SecondaryImagePosition.TOP_LEFT ||
    secondaryImagePosition === SecondaryImagePosition.BOTTOM_LEFT
  );
}

function getIsCaptionTop(captionPosition: CaptionPosition): boolean {
  return captionPosition === CaptionPosition.TOP;
}

function getAreas(areasArray: string[], hasPadding: boolean): string[] {
  return hasPadding ? [...areasArray, '.'] : areasArray;
}

function getColumns(
  secondaryPercentWidth: number,
  hasPadding: boolean
): string[] {
  const primaryPercentWidth =
    100 - secondaryPercentWidth * (hasPadding ? 3 : 2);
  const columns = [
    `repeat(2, ${secondaryPercentWidth}%)`,
    `${primaryPercentWidth}%`,
  ];
  return hasPadding ? [...columns, `${secondaryPercentWidth}%`] : columns;
}

export function getIsSecondaryTop(
  secondaryImagePosition: SecondaryImagePosition
): boolean {
  return (
    secondaryImagePosition === SecondaryImagePosition.TOP_LEFT ||
    secondaryImagePosition === SecondaryImagePosition.TOP_RIGHT
  );
}

export function getIsCaptionNextToSecondaryImage(
  secondaryImagePosition: SecondaryImagePosition,
  captionPosition: CaptionPosition
): boolean {
  return (
    (captionPosition === CaptionPosition.TOP &&
      secondaryImagePosition === SecondaryImagePosition.TOP_LEFT) ||
    (captionPosition === CaptionPosition.BOTTOM &&
      secondaryImagePosition === SecondaryImagePosition.BOTTOM_LEFT)
  );
}

export function getGrid(
  secondaryImagePosition: SecondaryImagePosition,
  captionPosition: CaptionPosition,
  isPrimaryPadded: boolean = false,
  secondaryImagePercentWidth: number = 10
): { areas: string[][]; columns: string[] } {
  /**
   * The structure is something like this:
   *
   * +-------------+
   * |             |
   * |  secondary  | caption
   * |             |
   * |      +----------------------------+
   * |      |      |                     |
   * |      |      |                     |
   * +-------------+                     |
   *        |                            |
   *  space |         primary            |
   *        |                            |
   *        |                            |
   *        |                            |
   *        |                            |
   *        +----------------------------+
   *
   * In order to create the space on the left of the primary, we split up the
   * "secondary" cell in two. We end up with three sections. Hence, you'll see
   * secondary repeated twice below, and a space (".") added before the primary.
   *
   * The below definitions all assume secondary is on the left, and we just flip
   * everything if it's not.
   *
   * The primary image padding is a bit of a peculiar case. If you put two of
   * these stacked images below each other, and one has the secondary on the left
   * and the other on the right, you'll need to add some padding on the side of
   * the second image for the primaries to align.
   */
  const columnsArray = getColumns(secondaryImagePercentWidth, isPrimaryPadded);
  const captionAndSecondary = getAreas(
    ['secondary', 'secondary', 'caption'],
    isPrimaryPadded
  );
  const primary = getAreas(['.', 'primary', 'primary'], isPrimaryPadded);
  const caption = getAreas(['.', 'caption', 'caption'], isPrimaryPadded);
  const secondary = getAreas(['secondary', 'secondary', '.'], isPrimaryPadded);
  const isCaptionTop = getIsCaptionTop(captionPosition);
  const isSecondaryTop = getIsSecondaryTop(secondaryImagePosition);
  const isSecondaryLeft = getIsSecondaryLeft(secondaryImagePosition);

  const getRow = (hasCaption: boolean, hasSecondary: boolean): string[] => {
    if (hasCaption && hasSecondary) {
      return captionAndSecondary;
    }
    if (hasCaption) {
      return caption;
    }
    if (hasSecondary) {
      return secondary;
    }
    return [];
  };

  const areasArray = [
    getRow(isCaptionTop, isSecondaryTop),
    primary,
    getRow(!isCaptionTop, !isSecondaryTop),
  ].filter(piece => piece.length > 0);

  const areas = isSecondaryLeft
    ? areasArray
    : areasArray.map(area => area.reverse());
  const columns = isSecondaryLeft ? columnsArray : columnsArray.reverse();

  return {
    columns,
    areas,
  };
}

export function areasToString(areas: string[][]): string {
  return areas.map(area => `'${area.join(' ')}'`).join('\n');
}

export function columnsToString(columns: string[]): string {
  return columns.join(' ');
}
