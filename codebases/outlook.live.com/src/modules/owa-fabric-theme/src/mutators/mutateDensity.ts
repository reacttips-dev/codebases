import { mutator } from 'satcheljs';
import store from '../store/store';
import changeFabricDensityAction from '../actions/changeDensity';

export default mutator(changeFabricDensityAction, actionMessage => {
    const { densityMode, density } = actionMessage;
    store().density = {
        tokens: density.tokens,
        components: {
            ...(density.components || {}),
            CommandBar: { styles: { root: { backgroundColor: store().palette?.neutralLighter } } },
        },
    };
    store().densityMode = densityMode;
});
