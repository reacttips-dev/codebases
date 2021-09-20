import { itemRotation } from './itemRotation';
import * as Colors from '@trello/colors/colors';

type LabelColor =
  | 'green'
  | 'blue'
  | 'pink'
  | 'lime'
  | 'sky'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'red'
  | 'black';

type ColorShade =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

const labelRotationColors: Record<LabelColor, Record<ColorShade, string>> = {
  green: {
    '100': Colors.Green100,
    '200': Colors.Green200,
    '300': Colors.Green300,
    '400': Colors.Green400,
    '500': Colors.Green500,
    '600': Colors.Green600,
    '700': Colors.Green700,
    '800': Colors.Green800,
    '900': Colors.Green900,
  },
  blue: {
    '100': Colors.TrelloBlue100,
    '200': Colors.TrelloBlue200,
    '300': Colors.TrelloBlue300,
    '400': Colors.TrelloBlue400,
    '500': Colors.TrelloBlue500,
    '600': Colors.TrelloBlue600,
    '700': Colors.TrelloBlue700,
    '800': Colors.TrelloBlue800,
    '900': Colors.TrelloBlue900,
  },
  pink: {
    '100': Colors.Pink100,
    '200': Colors.Pink200,
    '300': Colors.Pink300,
    '400': Colors.Pink400,
    '500': Colors.Pink500,
    '600': Colors.Pink600,
    '700': Colors.Pink700,
    '800': Colors.Pink800,
    '900': Colors.Pink900,
  },
  lime: {
    '100': Colors.Lime100,
    '200': Colors.Lime200,
    '300': Colors.Lime300,
    '400': Colors.Lime400,
    '500': Colors.Lime500,
    '600': Colors.Lime600,
    '700': Colors.Lime700,
    '800': Colors.Lime800,
    '900': Colors.Lime900,
  },
  sky: {
    '100': Colors.Sky100,
    '200': Colors.Sky200,
    '300': Colors.Sky300,
    '400': Colors.Sky400,
    '500': Colors.Sky500,
    '600': Colors.Sky600,
    '700': Colors.Sky700,
    '800': Colors.Sky800,
    '900': Colors.Sky900,
  },
  yellow: {
    '100': Colors.Yellow100,
    '200': Colors.Yellow200,
    '300': Colors.Yellow300,
    '400': Colors.Yellow400,
    '500': Colors.Yellow500,
    '600': Colors.Yellow600,
    '700': Colors.Yellow700,
    '800': Colors.Yellow800,
    '900': Colors.Yellow900,
  },
  orange: {
    '100': Colors.Orange100,
    '200': Colors.Orange200,
    '300': Colors.Orange300,
    '400': Colors.Orange400,
    '500': Colors.Orange500,
    '600': Colors.Orange600,
    '700': Colors.Orange700,
    '800': Colors.Orange800,
    '900': Colors.Orange900,
  },
  purple: {
    '100': Colors.Purple100,
    '200': Colors.Purple200,
    '300': Colors.Purple300,
    '400': Colors.Purple400,
    '500': Colors.Purple500,
    '600': Colors.Purple600,
    '700': Colors.Purple700,
    '800': Colors.Purple800,
    '900': Colors.Purple900,
  },
  red: {
    '100': Colors.Red100,
    '200': Colors.Red200,
    '300': Colors.Red300,
    '400': Colors.Red400,
    '500': Colors.Red500,
    '600': Colors.Red600,
    '700': Colors.Red700,
    '800': Colors.Red800,
    '900': Colors.Red900,
  },
  black: {
    '100': Colors.N100,
    '200': Colors.N200,
    '300': Colors.N300,
    '400': Colors.N400,
    '500': Colors.N500,
    '600': Colors.N600,
    '700': Colors.N700,
    '800': Colors.N800,
    '900': Colors.N900,
  },
};

const defaultShadeOrder: ColorShade[] = [
  '500',
  '700',
  '900',
  '200',
  '400',
  '600',
  '800',
  '100',
  '300',
];

const createLabelColorRotation = (
  labelColor: LabelColor,
  shadeOrder: ColorShade[] = defaultShadeOrder,
): Generator<string> => {
  return itemRotation(
    shadeOrder.map((colorShade) => {
      const color = labelRotationColors[labelColor][colorShade];
      return color;
    }),
  );
};

/*
 * Creates an object mapping label colors to color generators to represent
 * that label on dashboard charts
 *
 * These rotations solve a problem on the dashboard where we need to represent
 * multiple labels that are the same color on the same chart, e.g. two `green`
 * labels shown next to each other on a pie chart would appear to just be one big
 * pie section if they were shown as the same color.
 *
 * We solve this by rotating through different shades of label colors, and this function
 * provides generators to facilitate that
 */
export const labelColorRotations: () => Record<
  string,
  Generator<string>
> = () => ({
  green: createLabelColorRotation('green'),
  blue: createLabelColorRotation('blue'),
  pink: createLabelColorRotation('pink'),
  lime: createLabelColorRotation('lime'),
  sky: createLabelColorRotation('sky'),
  yellow: createLabelColorRotation('yellow'),
  orange: createLabelColorRotation('orange'),
  purple: createLabelColorRotation('purple'),
  red: createLabelColorRotation('red'),
  black: createLabelColorRotation('black', [
    '900',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
  ]),
});
