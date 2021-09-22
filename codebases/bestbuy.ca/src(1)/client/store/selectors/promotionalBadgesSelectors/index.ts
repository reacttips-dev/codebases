import {Selector} from "reselect";
import {State} from "store";
import {PromotionalBadges} from "../../../models";

export const getPromotionalBadges: Selector<State, PromotionalBadges> = (state: State) => state.promotionalBadges;
