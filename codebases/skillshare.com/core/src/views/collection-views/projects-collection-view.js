import CollectionView from 'core/src/views/base/collection-view';
import ProjectItemView from 'core/src/views/item-views/project-column-item-view';
import Mustache from 'mustache';

const ProjectsCollectionView = CollectionView.extend({
  itemView: ProjectItemView,

  initialize: function(options) {
    _.extend(this, _.pick(options, ['data', 'prependTemplate', 'appendTemplate']));
    CollectionView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    if (this.prependTemplate) {
      const prependHtml = Mustache.render(this.prependTemplate, this.data);
      this.$el.prepend(prependHtml);
    }

    if (this.appendTemplate) {
      const appendHtml = Mustache.render(this.appendTemplate, this.data);
      this.$el.append(appendHtml);
    }

    CollectionView.prototype.afterRender.apply(this, arguments);
  },
});

export default ProjectsCollectionView;

