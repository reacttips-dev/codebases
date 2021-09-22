import ar from './ar';
import en from './en';
import es from './es';
import fr from './fr';
import de from './de';
import ptBR from './pt_br';
import ru from './ru';
import ja from './ja';
import { LocaleDataSet, LocaleFileType } from '../types';
import { SupportedLocales } from '../../supportedLocales';

function objectifyTimeFormats(timeFormats: LocaleFileType): LocaleDataSet {
  return {
    days: {
      ddd: [timeFormats.d, timeFormats.dd],
      dd: [timeFormats.dmid, timeFormats.ddmid],
      d: [timeFormats.dmicro, timeFormats.ddmicro],
    },
    hours: {
      hhh: [timeFormats.h, timeFormats.hh],
      hh: [timeFormats.hmid, timeFormats.hhmid],
      h: [timeFormats.hmicro, timeFormats.hhmicro],
    },
    minutes: {
      mmm: [timeFormats.m, timeFormats.mm],
      mm: [timeFormats.mmid, timeFormats.mmmid],
      m: [timeFormats.mmicro, timeFormats.mmmicro],
    },
    seconds: {
      sss: [timeFormats.s, timeFormats.ss],
      ss: [timeFormats.smid, timeFormats.ssmid],
      s: [timeFormats.smicro, timeFormats.ssmicro],
    },
  };
}

const LocalesMap: Record<SupportedLocales, LocaleDataSet> = {
  en: objectifyTimeFormats(en),
  ar: objectifyTimeFormats(ar),
  es: objectifyTimeFormats(es),
  es_LA: objectifyTimeFormats(es),
  fr_FR: objectifyTimeFormats(fr),
  fr: objectifyTimeFormats(fr),
  de: objectifyTimeFormats(de),
  pt_BR: objectifyTimeFormats(ptBR),
  pt_br: objectifyTimeFormats(ptBR),
  ru: objectifyTimeFormats(ru),
  ja: objectifyTimeFormats(ja),
};

export default LocalesMap;
