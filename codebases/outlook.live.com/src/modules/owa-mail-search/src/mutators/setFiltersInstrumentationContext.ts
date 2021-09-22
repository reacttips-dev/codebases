import { FiltersInstrumentationContext } from '../store/schema/FiltersInstrumentationContext';
import mailSearchStore from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setFiltersInstrumentationContext',
    (instrumentationContext: FiltersInstrumentationContext): void => {
        mailSearchStore.filtersInstrumentationContext = instrumentationContext;
    }
);
