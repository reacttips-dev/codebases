import { ControlIcons } from 'owa-control-icons';

export enum FilePickerViewType {
    List,
    Tile,
    Groups,
}

export const viewTypeIcon: {
    [filePickerViewType: number]: () => string;
} = {
    [FilePickerViewType.List]: () => ControlIcons.List,
    [FilePickerViewType.Tile]: () => ControlIcons.ViewAll,
};
