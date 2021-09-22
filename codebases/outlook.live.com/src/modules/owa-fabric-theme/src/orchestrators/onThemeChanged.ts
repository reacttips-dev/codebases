import { orchestrator } from 'satcheljs';
import changeTheme from '../actions/changeTheme';
import mutateTheme from '../mutators/mutateTheme';
import updateFabricTheme from './updateFabricTheme';

orchestrator(changeTheme, actionMessage => {
    mutateTheme(actionMessage.themeSymbols, actionMessage.isDarkTheme);
    updateFabricTheme();
});
