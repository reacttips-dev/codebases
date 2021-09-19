import { RecoAction } from 'actions/recos';
import { FETCH_RECOS, RECEIVE_RECOS } from 'constants/reduxActions';
import { normalizeToPatronLikeProduct } from 'helpers/RecoUtils';
import { AllJanusSlotNames, JanusData, JanusSlot } from 'types/mafia';

export type JanusRecos = Partial<Record<string, JanusData | Record<string, JanusData>>>;

const DEFAULT_RECO_TITLE = 'Recommendations For You';
function extractDataFromWidget(widget: JanusSlot): JanusData {
  return {
    title: widget.title || DEFAULT_RECO_TITLE,
    recos: (widget.sims || widget.recs || []).map(reco => {
      const { recoName } = widget;
      const normalized = normalizeToPatronLikeProduct(reco, recoName);
      return { ...normalized, recoName };
    })
  };
}

export interface RecosState {
  isLoading?: boolean;
  lastReceivedRecoKey?: string;
  janus?: JanusRecos;
}

export default function recos(state: Readonly<RecosState> = { }, action: RecoAction): RecosState {

  switch (action.type) {
    case FETCH_RECOS:
      return { ...state, isLoading: true };
    case RECEIVE_RECOS:
      const { key, data } = action;
      const keys = Object.keys(data) as AllJanusSlotNames[];
      // if one widget was requested put the info in the top level for ease of use.
      // TODO I, MT, did not make this decision ^^^^, I merely am typing this file lol
      const newEntry: JanusRecos = {};
      if (keys.length === 1) {
        const reco = data[keys[0]];
        if (reco) {
          newEntry[key] = extractDataFromWidget(reco);
        }
      } else {
        // otherwise nest key = { widgetId: { title, recos } }
        const newData: Record<string, JanusData> = {};
        keys.forEach(prop => {
          const reco = data[prop];
          if (reco) {
            newData[prop] = extractDataFromWidget(reco);
          }
        });
        newEntry[key] = newData;
      }

      const filteredRecos = state.janus || {};
      const newRecoContents = { ...filteredRecos, ...newEntry };
      return { ...state, isLoading: false, janus: { ...newRecoContents }, lastReceivedRecoKey: key };
    default:
      return state;
  }
}

/** Type predicate to determine if the type of JanusRecos in practical usage has nested widget keys */
export function areRecosFlattened(recos: JanusData | Record<string, JanusData>): recos is JanusData {
  return !!(recos as JanusData).recos;
}
