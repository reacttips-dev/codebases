/* eslint @trello/export-matches-filename:0 */
export enum ScreenBreakpoints {
  Small = 'only screen and (max-width: 750px)',
  Medium = 'only screen and (min-width: 751px) and (max-width: 900px)',
  MediumMin = 'only screen and (min-width: 751px)',
  Large = 'only screen and (min-width: 901px) and (max-width: 1280px)',
  LargeMin = 'only screen and (min-width: 901px)',
  ExtraLarge = 'only screen and (min-width: 1281px)',
}

export enum PlanComparisonBreakPoints {
  Mobile = 'only screen and (max-width: 920px)',
  Web = 'only screen and (min-width: 921px) and (max-width: 1150px)',
}
