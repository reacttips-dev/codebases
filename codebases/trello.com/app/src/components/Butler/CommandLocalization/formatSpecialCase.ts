import moment, { MomentInputObject, localeData } from 'moment';
import { Time } from '@atlassian/butler-command-parser';
import { forNamespace } from '@trello/i18n';
import { Stickers } from 'app/scripts/data/stickers';
import { LocalizeButlerCommandError } from './LocalizeButlerCommandError';

const StandardStickers = Stickers.standard;
const formatLabelColor = forNamespace('labels');

let stickers: string[];

export type SpecialCaseValue = string | number | Time | MomentInputObject;

/**
 * Special case keys are prepended with `*`, and require custom formatting.
 */
export const formatSpecialCase = (
  key: string,
  value: SpecialCaseValue,
): string => {
  switch (key) {
    case 'color':
      return formatLabelColor(value as string);
    case 'date': {
      const { month = 1, day = 1, year } = value as MomentInputObject;
      // NOTE: The command parser 1-indexes months.
      const date = moment({ month: month - 1, day, year });
      return date.format(localeData().longDateFormat(year ? 'LL' : 'LLLL'));
    }
    case 'month':
      return localeData().months()[(value as number) - 1];
    case 'ordinal':
      return localeData().ordinal(value as number);
    case 'sticker':
      if (!stickers) {
        stickers = StandardStickers.stickers.map(({ image }) => image);
      }
      return stickers[value as number];
    case 'time': {
      const { HOUR, MINUTES, AM, PM } = value as Time;
      // AM/PM is optional, but moment's formatter seems to be able to interpret
      // inputs even with missing values.
      const time = `${HOUR}:${MINUTES ?? 0} ${AM || PM}`.trimEnd();
      return moment(time, 'h:m a').format(localeData().longDateFormat('LT'));
    }
    case 'weekday':
      return localeData().weekdays()[value as number];
    default:
      throw new LocalizeButlerCommandError(`*${key}`, { value: String(value) });
  }
};
