/**
 * Load up React-Intl and also add the localization definitions
 * for the locales that we support.
 *
 * When we support many languages, we may want to load these dynamically
 * but for now fixing these in only adds 2.4KB and ensures they are not
 * requested repeatedly.
 *
 * Locale data is taken from node_modules/react-intl/dist/locale-data.
 */

import ReactIntl from 'react-intl';

/* eslint-disable */
ReactIntl.__addLocaleData({
  locale: 'en',
  pluralRuleFunction: function (n, ord) {
    var s = String(n).split('.'),
      v0 = !s[1],
      t0 = Number(s[0]) == n,
      n10 = t0 && s[0].slice(-1),
      n100 = t0 && s[0].slice(-2);
    if (ord)
      return n10 == 1 && n100 != 11 ? 'one' : n10 == 2 && n100 != 12 ? 'two' : n10 == 3 && n100 != 13 ? 'few' : 'other';
    return n == 1 && v0 ? 'one' : 'other';
  },
  fields: {
    year: {
      displayName: 'Year',
      relative: { 0: 'this year', 1: 'next year', '-1': 'last year' },
      relativeTime: {
        future: { one: 'in {0} year', other: 'in {0} years' },
        past: { one: '{0} year ago', other: '{0} years ago' },
      },
    },
    month: {
      displayName: 'Month',
      relative: { 0: 'this month', 1: 'next month', '-1': 'last month' },
      relativeTime: {
        future: { one: 'in {0} month', other: 'in {0} months' },
        past: { one: '{0} month ago', other: '{0} months ago' },
      },
    },
    day: {
      displayName: 'Day',
      relative: { 0: 'today', 1: 'tomorrow', '-1': 'yesterday' },
      relativeTime: {
        future: { one: 'in {0} day', other: 'in {0} days' },
        past: { one: '{0} day ago', other: '{0} days ago' },
      },
    },
    hour: {
      displayName: 'Hour',
      relativeTime: {
        future: { one: 'in {0} hour', other: 'in {0} hours' },
        past: { one: '{0} hour ago', other: '{0} hours ago' },
      },
    },
    minute: {
      displayName: 'Minute',
      relativeTime: {
        future: { one: 'in {0} minute', other: 'in {0} minutes' },
        past: { one: '{0} minute ago', other: '{0} minutes ago' },
      },
    },
    second: {
      displayName: 'Second',
      relative: { 0: 'now' },
      relativeTime: {
        future: { one: 'in {0} second', other: 'in {0} seconds' },
        past: { one: '{0} second ago', other: '{0} seconds ago' },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'ar',
  pluralRuleFunction: function (n, ord) {
    var s = String(n).split('.'),
      t0 = Number(s[0]) == n,
      n100 = t0 && s[0].slice(-2);
    if (ord) return 'other';
    return n == 0
      ? 'zero'
      : n == 1
      ? 'one'
      : n == 2
      ? 'two'
      : n100 >= 3 && n100 <= 10
      ? 'few'
      : n100 >= 11 && n100 <= 99
      ? 'many'
      : 'other';
  },
  fields: {
    year: {
      displayName: 'السنة',
      relative: { 0: 'السنة الحالية', 1: 'السنة التالية', '-1': 'السنة الماضية' },
      relativeTime: {
        future: {
          zero: 'خلال {0} من السنوات',
          one: 'خلال {0} من السنوات',
          two: 'خلال سنتين',
          few: 'خلال {0} سنوات',
          many: 'خلال {0} سنة',
          other: 'خلال {0} من السنوات',
        },
        past: {
          zero: 'قبل {0} من السنوات',
          one: 'قبل {0} من السنوات',
          two: 'قبل سنتين',
          few: 'قبل {0} سنوات',
          many: 'قبل {0} سنة',
          other: 'قبل {0} من السنوات',
        },
      },
    },
    month: {
      displayName: 'الشهر',
      relative: { 0: 'هذا الشهر', 1: 'الشهر التالي', '-1': 'الشهر الماضي' },
      relativeTime: {
        future: {
          zero: 'خلال {0} من الشهور',
          one: 'خلال {0} من الشهور',
          two: 'خلال شهرين',
          few: 'خلال {0} شهور',
          many: 'خلال {0} شهرًا',
          other: 'خلال {0} من الشهور',
        },
        past: {
          zero: 'قبل {0} من الشهور',
          one: 'قبل {0} من الشهور',
          two: 'قبل شهرين',
          few: 'قبل {0} أشهر',
          many: 'قبل {0} شهرًا',
          other: 'قبل {0} من الشهور',
        },
      },
    },
    day: {
      displayName: 'يوم',
      relative: { 0: 'اليوم', 1: 'غدًا', 2: 'بعد الغد', '-1': 'أمس', '-2': 'أول أمس' },
      relativeTime: {
        future: {
          zero: 'خلال {0} من الأيام',
          one: 'خلال {0} من الأيام',
          two: 'خلال يومين',
          few: 'خلال {0} أيام',
          many: 'خلال {0} يومًا',
          other: 'خلال {0} من الأيام',
        },
        past: {
          zero: 'قبل {0} من الأيام',
          one: 'قبل {0} من الأيام',
          two: 'قبل يومين',
          few: 'قبل {0} أيام',
          many: 'قبل {0} يومًا',
          other: 'قبل {0} من الأيام',
        },
      },
    },
    hour: {
      displayName: 'الساعات',
      relativeTime: {
        future: {
          zero: 'خلال {0} من الساعات',
          one: 'خلال {0} من الساعات',
          two: 'خلال ساعتين',
          few: 'خلال {0} ساعات',
          many: 'خلال {0} ساعة',
          other: 'خلال {0} من الساعات',
        },
        past: {
          zero: 'قبل {0} من الساعات',
          one: 'قبل {0} من الساعات',
          two: 'قبل ساعتين',
          few: 'قبل {0} ساعات',
          many: 'قبل {0} ساعة',
          other: 'قبل {0} من الساعات',
        },
      },
    },
    minute: {
      displayName: 'الدقائق',
      relativeTime: {
        future: {
          zero: 'خلال {0} من الدقائق',
          one: 'خلال {0} من الدقائق',
          two: 'خلال دقيقتين',
          few: 'خلال {0} دقائق',
          many: 'خلال {0} دقيقة',
          other: 'خلال {0} من الدقائق',
        },
        past: {
          zero: 'قبل {0} من الدقائق',
          one: 'قبل {0} من الدقائق',
          two: 'قبل دقيقتين',
          few: 'قبل {0} دقائق',
          many: 'قبل {0} دقيقة',
          other: 'قبل {0} من الدقائق',
        },
      },
    },
    second: {
      displayName: 'الثواني',
      relative: { 0: 'الآن' },
      relativeTime: {
        future: {
          zero: 'خلال {0} من الثواني',
          one: 'خلال {0} من الثواني',
          two: 'خلال ثانيتين',
          few: 'خلال {0} ثوانِ',
          many: 'خلال {0} ثانية',
          other: 'خلال {0} من الثواني',
        },
        past: {
          zero: 'قبل {0} من الثواني',
          one: 'قبل {0} من الثواني',
          two: 'قبل ثانيتين',
          few: 'قبل {0} ثوانِ',
          many: 'قبل {0} ثانية',
          other: 'قبل {0} من الثواني',
        },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'de',
  pluralRuleFunction: function (n, ord) {
    var s = String(n).split('.'),
      v0 = !s[1];
    if (ord) return 'other';
    return n == 1 && v0 ? 'one' : 'other';
  },
  fields: {
    year: {
      displayName: 'Jahr',
      relative: { 0: 'dieses Jahr', 1: 'nächstes Jahr', '-1': 'letztes Jahr' },
      relativeTime: {
        future: { one: 'in {0} Jahr', other: 'in {0} Jahren' },
        past: { one: 'vor {0} Jahr', other: 'vor {0} Jahren' },
      },
    },
    month: {
      displayName: 'Monat',
      relative: { 0: 'diesen Monat', 1: 'nächsten Monat', '-1': 'letzten Monat' },
      relativeTime: {
        future: { one: 'in {0} Monat', other: 'in {0} Monaten' },
        past: { one: 'vor {0} Monat', other: 'vor {0} Monaten' },
      },
    },
    day: {
      displayName: 'Tag',
      relative: { 0: 'heute', 1: 'morgen', 2: 'übermorgen', '-1': 'gestern', '-2': 'vorgestern' },
      relativeTime: {
        future: { one: 'in {0} Tag', other: 'in {0} Tagen' },
        past: { one: 'vor {0} Tag', other: 'vor {0} Tagen' },
      },
    },
    hour: {
      displayName: 'Stunde',
      relativeTime: {
        future: { one: 'in {0} Stunde', other: 'in {0} Stunden' },
        past: { one: 'vor {0} Stunde', other: 'vor {0} Stunden' },
      },
    },
    minute: {
      displayName: 'Minute',
      relativeTime: {
        future: { one: 'in {0} Minute', other: 'in {0} Minuten' },
        past: { one: 'vor {0} Minute', other: 'vor {0} Minuten' },
      },
    },
    second: {
      displayName: 'Sekunde',
      relative: { 0: 'jetzt' },
      relativeTime: {
        future: { one: 'in {0} Sekunde', other: 'in {0} Sekunden' },
        past: { one: 'vor {0} Sekunde', other: 'vor {0} Sekunden' },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'es',
  pluralRuleFunction: function (n, ord) {
    if (ord) return 'other';
    return n == 1 ? 'one' : 'other';
  },
  fields: {
    year: {
      displayName: 'Año',
      relative: { 0: 'este año', 1: 'el próximo año', '-1': 'el año pasado' },
      relativeTime: {
        future: { one: 'dentro de {0} año', other: 'dentro de {0} años' },
        past: { one: 'hace {0} año', other: 'hace {0} años' },
      },
    },
    month: {
      displayName: 'Mes',
      relative: { 0: 'este mes', 1: 'el próximo mes', '-1': 'el mes pasado' },
      relativeTime: {
        future: { one: 'dentro de {0} mes', other: 'dentro de {0} meses' },
        past: { one: 'hace {0} mes', other: 'hace {0} meses' },
      },
    },
    day: {
      displayName: 'Día',
      relative: { 0: 'hoy', 1: 'mañana', 2: 'pasado mañana', '-1': 'ayer', '-2': 'antes de ayer' },
      relativeTime: {
        future: { one: 'dentro de {0} día', other: 'dentro de {0} días' },
        past: { one: 'hace {0} día', other: 'hace {0} días' },
      },
    },
    hour: {
      displayName: 'Hora',
      relativeTime: {
        future: { one: 'dentro de {0} hora', other: 'dentro de {0} horas' },
        past: { one: 'hace {0} hora', other: 'hace {0} horas' },
      },
    },
    minute: {
      displayName: 'Minuto',
      relativeTime: {
        future: { one: 'dentro de {0} minuto', other: 'dentro de {0} minutos' },
        past: { one: 'hace {0} minuto', other: 'hace {0} minutos' },
      },
    },
    second: {
      displayName: 'Segundo',
      relative: { 0: 'ahora' },
      relativeTime: {
        future: { one: 'dentro de {0} segundo', other: 'dentro de {0} segundos' },
        past: { one: 'hace {0} segundo', other: 'hace {0} segundos' },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'fr',
  pluralRuleFunction: function (n, ord) {
    if (ord) return n == 1 ? 'one' : 'other';
    return n >= 0 && n < 2 ? 'one' : 'other';
  },
  fields: {
    year: {
      displayName: 'année',
      relative: { 0: 'cette année', 1: 'l’année prochaine', '-1': 'l’année dernière' },
      relativeTime: {
        future: { one: 'dans {0} an', other: 'dans {0} ans' },
        past: { one: 'il y a {0} an', other: 'il y a {0} ans' },
      },
    },
    month: {
      displayName: 'mois',
      relative: { 0: 'ce mois-ci', 1: 'le mois prochain', '-1': 'le mois dernier' },
      relativeTime: {
        future: { one: 'dans {0} mois', other: 'dans {0} mois' },
        past: { one: 'il y a {0} mois', other: 'il y a {0} mois' },
      },
    },
    day: {
      displayName: 'jour',
      relative: { 0: 'aujourd’hui', 1: 'demain', 2: 'après-demain', '-1': 'hier', '-2': 'avant-hier' },
      relativeTime: {
        future: { one: 'dans {0} jour', other: 'dans {0} jours' },
        past: { one: 'il y a {0} jour', other: 'il y a {0} jours' },
      },
    },
    hour: {
      displayName: 'heure',
      relativeTime: {
        future: { one: 'dans {0} heure', other: 'dans {0} heures' },
        past: { one: 'il y a {0} heure', other: 'il y a {0} heures' },
      },
    },
    minute: {
      displayName: 'minute',
      relativeTime: {
        future: { one: 'dans {0} minute', other: 'dans {0} minutes' },
        past: { one: 'il y a {0} minute', other: 'il y a {0} minutes' },
      },
    },
    second: {
      displayName: 'seconde',
      relative: { 0: 'maintenant' },
      relativeTime: {
        future: { one: 'dans {0} seconde', other: 'dans {0} secondes' },
        past: { one: 'il y a {0} seconde', other: 'il y a {0} secondes' },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'id',
  pluralRuleFunction: function (n, ord) {
    if (ord) return 'other';
    return 'other';
  },
  fields: {
    year: {
      displayName: 'Tahun',
      relative: { 0: 'tahun ini', 1: 'tahun depan', '-1': 'tahun lalu' },
      relativeTime: { future: { other: 'Dalam {0} tahun' }, past: { other: '{0} tahun yang lalu' } },
    },
    month: {
      displayName: 'Bulan',
      relative: { 0: 'bulan ini', 1: 'Bulan berikutnya', '-1': 'bulan lalu' },
      relativeTime: { future: { other: 'Dalam {0} bulan' }, past: { other: '{0} bulan yang lalu' } },
    },
    day: {
      displayName: 'Hari',
      relative: { 0: 'hari ini', 1: 'besok', 2: 'lusa', '-1': 'kemarin', '-2': 'kemarin lusa' },
      relativeTime: { future: { other: 'Dalam {0} hari' }, past: { other: '{0} hari yang lalu' } },
    },
    hour: {
      displayName: 'Jam',
      relativeTime: { future: { other: 'Dalam {0} jam' }, past: { other: '{0} jam yang lalu' } },
    },
    minute: {
      displayName: 'Menit',
      relativeTime: { future: { other: 'Dalam {0} menit' }, past: { other: '{0} menit yang lalu' } },
    },
    second: {
      displayName: 'Detik',
      relative: { 0: 'sekarang' },
      relativeTime: { future: { other: 'Dalam {0} detik' }, past: { other: '{0} detik yang lalu' } },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'ja',
  pluralRuleFunction: function (n, ord) {
    if (ord) return 'other';
    return 'other';
  },
  fields: {
    year: {
      displayName: '年',
      relative: { 0: '今年', 1: '翌年', '-1': '昨年' },
      relativeTime: { future: { other: '{0} 年後' }, past: { other: '{0} 年前' } },
    },
    month: {
      displayName: '月',
      relative: { 0: '今月', 1: '翌月', '-1': '先月' },
      relativeTime: { future: { other: '{0} か月後' }, past: { other: '{0} か月前' } },
    },
    day: {
      displayName: '日',
      relative: { 0: '今日', 1: '明日', 2: '明後日', '-1': '昨日', '-2': '一昨日' },
      relativeTime: { future: { other: '{0} 日後' }, past: { other: '{0} 日前' } },
    },
    hour: { displayName: '時', relativeTime: { future: { other: '{0} 時間後' }, past: { other: '{0} 時間前' } } },
    minute: { displayName: '分', relativeTime: { future: { other: '{0} 分後' }, past: { other: '{0} 分前' } } },
    second: {
      displayName: '秒',
      relative: { 0: '今すぐ' },
      relativeTime: { future: { other: '{0} 秒後' }, past: { other: '{0} 秒前' } },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'ko',
  pluralRuleFunction: function (n, ord) {
    if (ord) return 'other';
    return 'other';
  },
  fields: {
    year: {
      displayName: '년',
      relative: { 0: '올해', 1: '내년', '-1': '작년' },
      relativeTime: { future: { other: '{0}년 후' }, past: { other: '{0}년 전' } },
    },
    month: {
      displayName: '월',
      relative: { 0: '이번 달', 1: '다음 달', '-1': '지난달' },
      relativeTime: { future: { other: '{0}개월 후' }, past: { other: '{0}개월 전' } },
    },
    day: {
      displayName: '일',
      relative: { 0: '오늘', 1: '내일', 2: '모레', '-1': '어제', '-2': '그저께' },
      relativeTime: { future: { other: '{0}일 후' }, past: { other: '{0}일 전' } },
    },
    hour: { displayName: '시', relativeTime: { future: { other: '{0}시간 후' }, past: { other: '{0}시간 전' } } },
    minute: { displayName: '분', relativeTime: { future: { other: '{0}분 후' }, past: { other: '{0}분 전' } } },
    second: {
      displayName: '초',
      relative: { 0: '지금' },
      relativeTime: { future: { other: '{0}초 후' }, past: { other: '{0}초 전' } },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'pt',
  pluralRuleFunction: function (n, ord) {
    var s = String(n).split('.'),
      t0 = Number(s[0]) == n;
    if (ord) return 'other';
    return t0 && n >= 0 && n <= 2 && n != 2 ? 'one' : 'other';
  },
  fields: {
    year: {
      displayName: 'Ano',
      relative: { 0: 'este ano', 1: 'próximo ano', '-1': 'ano passado' },
      relativeTime: {
        future: { one: 'Dentro de {0} ano', other: 'Dentro de {0} anos' },
        past: { one: 'Há {0} ano', other: 'Há {0} anos' },
      },
    },
    month: {
      displayName: 'Mês',
      relative: { 0: 'este mês', 1: 'próximo mês', '-1': 'mês passado' },
      relativeTime: {
        future: { one: 'Dentro de {0} mês', other: 'Dentro de {0} meses' },
        past: { one: 'Há {0} mês', other: 'Há {0} meses' },
      },
    },
    day: {
      displayName: 'Dia',
      relative: { 0: 'hoje', 1: 'amanhã', 2: 'depois de amanhã', '-1': 'ontem', '-2': 'anteontem' },
      relativeTime: {
        future: { one: 'Dentro de {0} dia', other: 'Dentro de {0} dias' },
        past: { one: 'Há {0} dia', other: 'Há {0} dias' },
      },
    },
    hour: {
      displayName: 'Hora',
      relativeTime: {
        future: { one: 'Dentro de {0} hora', other: 'Dentro de {0} horas' },
        past: { one: 'Há {0} hora', other: 'Há {0} horas' },
      },
    },
    minute: {
      displayName: 'Minuto',
      relativeTime: {
        future: { one: 'Dentro de {0} minuto', other: 'Dentro de {0} minutos' },
        past: { one: 'Há {0} minuto', other: 'Há {0} minutos' },
      },
    },
    second: {
      displayName: 'Segundo',
      relative: { 0: 'agora' },
      relativeTime: {
        future: { one: 'Dentro de {0} segundo', other: 'Dentro de {0} segundos' },
        past: { one: 'Há {0} segundo', other: 'Há {0} segundos' },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'ru',
  pluralRuleFunction: function (n, ord) {
    var s = String(n).split('.'),
      i = s[0],
      v0 = !s[1],
      i10 = i.slice(-1),
      i100 = i.slice(-2);
    if (ord) return 'other';
    return v0 && i10 == 1 && i100 != 11
      ? 'one'
      : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14)
      ? 'few'
      : (v0 && i10 == 0) || (v0 && i10 >= 5 && i10 <= 9) || (v0 && i100 >= 11 && i100 <= 14)
      ? 'many'
      : 'other';
  },
  fields: {
    year: {
      displayName: 'Год',
      relative: { 0: 'в этому году', 1: 'в следующем году', '-1': 'в прошлом году' },
      relativeTime: {
        future: { one: 'через {0} год', few: 'через {0} года', many: 'через {0} лет', other: 'через {0} года' },
        past: { one: '{0} год назад', few: '{0} года назад', many: '{0} лет назад', other: '{0} года назад' },
      },
    },
    month: {
      displayName: 'Месяц',
      relative: { 0: 'в этом месяце', 1: 'в следующем месяце', '-1': 'в прошлом месяце' },
      relativeTime: {
        future: {
          one: 'через {0} месяц',
          few: 'через {0} месяца',
          many: 'через {0} месяцев',
          other: 'через {0} месяца',
        },
        past: { one: '{0} месяц назад', few: '{0} месяца назад', many: '{0} месяцев назад', other: '{0} месяца назад' },
      },
    },
    day: {
      displayName: 'День',
      relative: { 0: 'сегодня', 1: 'завтра', 2: 'послезавтра', '-1': 'вчера', '-2': 'позавчера' },
      relativeTime: {
        future: { one: 'через {0} день', few: 'через {0} дня', many: 'через {0} дней', other: 'через {0} дней' },
        past: { one: '{0} день назад', few: '{0} дня назад', many: '{0} дней назад', other: '{0} дня назад' },
      },
    },
    hour: {
      displayName: 'Час',
      relativeTime: {
        future: { one: 'через {0} час', few: 'через {0} часа', many: 'через {0} часов', other: 'через {0} часа' },
        past: { one: '{0} час назад', few: '{0} часа назад', many: '{0} часов назад', other: '{0} часа назад' },
      },
    },
    minute: {
      displayName: 'Минута',
      relativeTime: {
        future: {
          one: 'через {0} минуту',
          few: 'через {0} минуты',
          many: 'через {0} минут',
          other: 'через {0} минуты',
        },
        past: { one: '{0} минуту назад', few: '{0} минуты назад', many: '{0} минут назад', other: '{0} минуты назад' },
      },
    },
    second: {
      displayName: 'Секунда',
      relative: { 0: 'сейчас' },
      relativeTime: {
        future: {
          one: 'через {0} секунду',
          few: 'через {0} секунды',
          many: 'через {0} секунд',
          other: 'через {0} секунды',
        },
        past: {
          one: '{0} секунду назад',
          few: '{0} секунды назад',
          many: '{0} секунд назад',
          other: '{0} секунды назад',
        },
      },
    },
  },
});
ReactIntl.__addLocaleData({
  locale: 'zh',
  pluralRuleFunction: function (n, ord) {
    if (ord) return 'other';
    return 'other';
  },
  fields: {
    year: {
      displayName: '年',
      relative: { 0: '今年', 1: '明年', '-1': '去年' },
      relativeTime: { future: { other: '{0}年后' }, past: { other: '{0}年前' } },
    },
    month: {
      displayName: '月',
      relative: { 0: '本月', 1: '下个月', '-1': '上个月' },
      relativeTime: { future: { other: '{0}个月后' }, past: { other: '{0}个月前' } },
    },
    day: {
      displayName: '日',
      relative: { 0: '今天', 1: '明天', 2: '后天', '-1': '昨天', '-2': '前天' },
      relativeTime: { future: { other: '{0}天后' }, past: { other: '{0}天前' } },
    },
    hour: { displayName: '小时', relativeTime: { future: { other: '{0}小时后' }, past: { other: '{0}小时前' } } },
    minute: { displayName: '分钟', relativeTime: { future: { other: '{0}分钟后' }, past: { other: '{0}分钟前' } } },
    second: {
      displayName: '秒钟',
      relative: { 0: '现在' },
      relativeTime: { future: { other: '{0}秒钟后' }, past: { other: '{0}秒钟前' } },
    },
  },
});

export default ReactIntl;

// all exports from node_modules/react-intl/src/react-intl
export const {
  IntlMixin,
  FormattedDate,
  FormattedTime,
  FormattedRelative,
  FormattedNumber,
  FormattedMessage,
  FormattedHTMLMessage,
  __addLocaleData,
} = ReactIntl;
