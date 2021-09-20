import EventEmitter from 'events';
import PluginInterface from '../../plugins/PluginInterface';

class StatusBar extends EventEmitter {
  constructor () {
    super();
  }

  initialize () {
    PluginInterface.initialize();
  }

  register (property, handler, context) {
    this.properties[property] &&
      this.properties[property].handler(context, handler);
  }

  loadPlugins (plugins) {
    this.emit('loadedPlugins', plugins);
  }

  addItem (sbItem) {
    this.emit('add', sbItem);
    sbItem.initialize && sbItem.initialize();
  }
}

export default new StatusBar();
