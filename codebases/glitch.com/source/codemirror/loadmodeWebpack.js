import EventEmitter from 'events';
import CodeMirror from 'codemirror';
import MODE_MAP from './MODE_MAP';

const loadedEmitter = new EventEmitter();

CodeMirror.requireMode = function requireMode(mode, cont) {
    if (typeof mode !== 'string') {
        mode = mode.name;
    }
    if (Object.prototype.hasOwnProperty.call(CodeMirror.modes, mode)) {
        return;
    }
    if (mode in MODE_MAP === false) {
        return;
    }

    const event = `loaded.${mode}`;

    if (loadedEmitter.listenerCount(event) === 0) {
        MODE_MAP[mode]().then(() => {
            loadedEmitter.emit(event);
        });
    }

    loadedEmitter.once(event, cont);
};

CodeMirror.autoLoadMode = function autoLoadMode(instance, mode) {
    CodeMirror.requireMode(mode, () => {
        instance.setOption('mode', instance.getOption('mode'));
    });
};