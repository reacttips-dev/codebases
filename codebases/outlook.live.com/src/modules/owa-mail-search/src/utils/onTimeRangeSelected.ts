import { setDateRangeFromDropdownOption } from '../mutators/timeFilterMutators';
import { startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import type { TimeDropdownValue } from '../selectors/getTimeFilterDropdownValue';

export default function onTimeRangeSelected(value: TimeDropdownValue): void {
    setDateRangeFromDropdownOption(value);
    startSearch('InteractiveFilter', SearchScenarioId.Mail, false /* explicitSearch */);
}
