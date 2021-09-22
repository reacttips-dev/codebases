import { editorToBodyType } from './preferredEditorTypes';
export function isConfigValid(config: any): boolean {
    return (
        typeof config === 'object' &&
        config !== null &&
        config.hasOwnProperty('Text') &&
        config.hasOwnProperty('HTML') &&
        Object.keys(config).every(key => editorToBodyType[config[key]] === key)
    );
}

export default isConfigValid;
