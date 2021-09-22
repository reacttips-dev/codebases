import ExpressionPage from '../store/schema/ExpressionPage';
import type ExpressionPickerViewState from '../store/schema/ExpressionPickerViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateExpressionPage',
    (state: ExpressionPickerViewState, pivotKey: string) => {
        if (state.page.toString() != pivotKey) {
            switch (pivotKey) {
                case '0':
                    state.page = ExpressionPage.All;
                    break;
                case '1':
                    state.page = ExpressionPage.Emojis;
                    break;
                case '2':
                    state.page = ExpressionPage.Gifs;
                    break;
            }
        }
    }
);
