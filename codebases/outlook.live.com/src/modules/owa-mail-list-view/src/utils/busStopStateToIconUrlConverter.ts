import ___svg_svgNew_darkMode_listview_bus_stop_top_tick_darkSvg from '../svg/svg-new/darkMode/listview_bus_stop_top_tick_dark.svg';
import ___svg_darkMode_listview_bus_stop_top_tick_darkSvg from '../svg/darkMode/listview_bus_stop_top_tick_dark.svg';
import ___svg_svgNew_darkMode_listview_bus_stop_bottom_fill_darkSvg from '../svg/svg-new/darkMode/listview_bus_stop_bottom_fill_dark.svg';
import ___svg_darkMode_listview_bus_stop_bottom_fill_darkSvg from '../svg/darkMode/listview_bus_stop_bottom_fill_dark.svg';
import ___svg_svgNew_darkMode_listview_bus_stop_line_darkSvg from '../svg/svg-new/darkMode/listview_bus_stop_line_dark.svg';
import ___svg_darkMode_listview_bus_stop_line_darkSvg from '../svg/darkMode/listview_bus_stop_line_dark.svg';
import ___svg_svgNew_darkMode_listview_bus_stop_single_tick_darkSvg from '../svg/svg-new/darkMode/listview_bus_stop_single_tick_dark.svg';
import ___svg_darkMode_listview_bus_stop_single_tick_darkSvg from '../svg/darkMode/listview_bus_stop_single_tick_dark.svg';
import ___svg_svgNew_darkMode_listview_bus_stop_middle_unfilled_darkSvg from '../svg/svg-new/darkMode/listview_bus_stop_middle_unfilled_dark.svg';
import ___svg_darkMode_listview_bus_stop_middle_unfilled_darkSvg from '../svg/darkMode/listview_bus_stop_middle_unfilled_dark.svg';
import ___svg_svgNew_listview_bus_stop_top_tickSvg from '../svg/svg-new/listview_bus_stop_top_tick.svg';
import ___svg_listview_bus_stop_top_tickSvg from '../svg/listview_bus_stop_top_tick.svg';
import ___svg_svgNew_listview_bus_stop_bottom_filledSvg from '../svg/svg-new/listview_bus_stop_bottom_filled.svg';
import ___svg_listview_bus_stop_bottom_filledSvg from '../svg/listview_bus_stop_bottom_filled.svg';
import ___svg_svgNew_listview_bus_stop_lineSvg from '../svg/svg-new/listview_bus_stop_line.svg';
import ___svg_listview_bus_stop_lineSvg from '../svg/listview_bus_stop_line.svg';
import ___svg_svgNew_listview_bus_stop_single_tickSvg from '../svg/svg-new/listview_bus_stop_single_tick.svg';
import ___svg_listview_bus_stop_single_tickSvg from '../svg/listview_bus_stop_single_tick.svg';
import ___svg_svgNew_listview_bus_stop_middle_unfillledSvg from '../svg/svg-new/listview_bus_stop_middle_unfillled.svg';
import ___svg_listview_bus_stop_middle_unfillledSvg from '../svg/listview_bus_stop_middle_unfillled.svg';
import { BusStopState } from 'owa-mail-list-store';
import { getOwaResourceUrl } from 'owa-resource-url';
import getIsDarkModeEnabledInUserSettings from 'owa-dark-mode-option/lib/selectors/getIsDarkModeEnabledInUserSettings';

export default function busStopStateToIconUrlConverter(
    state: BusStopState,
    isSingleLineView: boolean
): string {
    let toSource;
    const isThreeColumnWithPreview = !isSingleLineView;

    if (getIsDarkModeEnabledInUserSettings()) {
        switch (state) {
            case BusStopState.BusStart:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_darkMode_listview_bus_stop_top_tick_darkSvg
                    : ___svg_darkMode_listview_bus_stop_top_tick_darkSvg;
                break;
            case BusStopState.BusEnd:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_darkMode_listview_bus_stop_bottom_fill_darkSvg
                    : ___svg_darkMode_listview_bus_stop_bottom_fill_darkSvg;
                break;
            case BusStopState.NoStop:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_darkMode_listview_bus_stop_line_darkSvg
                    : ___svg_darkMode_listview_bus_stop_line_darkSvg;
                break;
            case BusStopState.CheckMark:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_darkMode_listview_bus_stop_single_tick_darkSvg
                    : ___svg_darkMode_listview_bus_stop_single_tick_darkSvg;
                break;
            case BusStopState.BusStop:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_darkMode_listview_bus_stop_middle_unfilled_darkSvg
                    : ___svg_darkMode_listview_bus_stop_middle_unfilled_darkSvg;
                break;
            case BusStopState.None:
            default:
                return undefined;
        }
    } else {
        switch (state) {
            case BusStopState.BusStart:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_listview_bus_stop_top_tickSvg
                    : ___svg_listview_bus_stop_top_tickSvg;
                break;
            case BusStopState.BusEnd:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_listview_bus_stop_bottom_filledSvg
                    : ___svg_listview_bus_stop_bottom_filledSvg;
                break;
            case BusStopState.NoStop:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_listview_bus_stop_lineSvg
                    : ___svg_listview_bus_stop_lineSvg;
                break;
            case BusStopState.CheckMark:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_listview_bus_stop_single_tickSvg
                    : ___svg_listview_bus_stop_single_tickSvg;
                break;
            case BusStopState.BusStop:
                toSource = isThreeColumnWithPreview
                    ? ___svg_svgNew_listview_bus_stop_middle_unfillledSvg
                    : ___svg_listview_bus_stop_middle_unfillledSvg;
                break;
            case BusStopState.None:
            default:
                return undefined;
        }
    }
    return getOwaResourceUrl(toSource);
}
