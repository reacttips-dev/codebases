import {createSelector, Selector} from "reselect";
import {get} from "lodash-es";
import {State} from "store";
import {TranslationsState} from "../../../reducers/translationsReducer";

export const getIntl: Selector<State, TranslationsState> = (state: State) => state.intl;

export const getIntlLanguage = createSelector<State, TranslationsState, Language>([getIntl], (intl) =>
    get(intl, "language"),
);

export const getIntlLocale = createSelector<State, TranslationsState, Locale>([getIntl], (intl) => get(intl, "locale"));
