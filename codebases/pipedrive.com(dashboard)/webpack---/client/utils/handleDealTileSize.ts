import { debounce } from 'lodash';
import { bindActionCreators, Dispatch } from 'redux';
import { setDealTileSize, SetDealTileSizeAction } from '../actions/view';

export default (dispatch: Dispatch<SetDealTileSizeAction>) => {
	const actions = bindActionCreators({ setDealTileSize }, dispatch);
	const debouncedResize = debounce(() => {
		actions.setDealTileSize();
	}, 200);

	actions.setDealTileSize();

	window.addEventListener('resize', debouncedResize);
};
