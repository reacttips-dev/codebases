export default class BuilderStore {
  constructor(globalStore, opts = {}) {
    this.opts = opts;

    this.globalStore = globalStore;

    if (globalStore.popularTools instanceof Array) return;

    /* $.get('/api/v1/services/popular_services', {limit: 500}, response => {
      if (response) {
        this.popularTools = response
        if (globalStore[this.opts.selectedToolsField].length === 0) {
          this.addDefaultTools(opts.defaultTools)
        }
        $(document).trigger('builder.popularTools.loaded')
      }
    })*/
    this.globalStore.popularTools = [];
    this.popularTools = [];
    $(document).trigger('builder.popularTools.loaded');
  }

  addDefaultTools(defaultTools = []) {
    defaultTools.forEach(item => {
      let regex = new RegExp(item, 'i');
      let tool = this.popularTools.find(t => {
        return regex.test(t.name);
      });
      if (tool) this.addSelectedTool(tool);
    });
    $(document).trigger('builder.tool.added');
  }

  searchPopularTools(query) {
    if (query === '') return [];

    let popularTools = this.globalStore.popularTools || this.popularTools;
    let regex = new RegExp(query.replace(' ', '.*\\s.*'), 'i');
    return popularTools.filter(t => {
      return regex.test(t.name);
    });
  }
}
