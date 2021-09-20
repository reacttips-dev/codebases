import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollectionSidebarModel,
{
  CollectionModel,
  FolderModel,
  RequestModel,
  ResponseModel,
  PersistentState
} from '../CollectionSidebarModel';

/**
 * Collection Sidebar List Item Interface
 *
 * This class implements the common code that is required by all the sidebar list items
 * Collection/Folder/Request/Responses
 */
export default class ICollectionSidebarListItem extends Component {
  constructor (props) {
    super(props);

    // A reference to the inline input defined in the component
    this.inlineInputRef = null;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate (nextProps) {
    if (!this.props.isFocused && nextProps.isFocused) {
      if (!this.$node) {
        return;
      }

      if (this.$node.scrollIntoViewIfNeeded) {
        this.$node.scrollIntoViewIfNeeded();
      } else {
        this.$node.scrollIntoView && this.$node.scrollIntoView();
      }
    }
  }

  componentWillUnmount () {
    this.props.persistentState.cancelHoverUpdate();

    (this.is_editing_reaction_dispose) && this.is_editing_reaction_dispose();

    this.props.persistentState.clearInputRef();
  }

  onInlineInputToggle (active) {
    const { persistentState } = this.props;

    // If the toggle input has become inactive then clear the cache
    if (!active) {
      persistentState.clearEditStateCache();
    } else {
      // If inline input because active then focus on it and select all values
      persistentState.focusOnInput();
    }
  }

  onInlineInputSubmit (name) {
    const { item } = this.props;

    item.commitRename(name);
  }

  onItemClick (e) {
    // Get the item and the model from the props
    const { item, model } = this.props;

    // Set the current item to be the active item
    model.focusItem(item);

    // If the item is not already expanded then expand it as well
    !model.isOpen(item.id) && model.expandItem(item);

    // Finally open the item in a tab
    item.openInTab(e);
  }

  setInlineInputRef (ref) {
    this.props.persistentState.setInputRef(ref);
  }

  handleMouseHover (hover) {
    this.props.persistentState.setHovered(hover);
  }

  handleActionSelect (action) {
    const { item } = this.props;

    item.handleAction(action);
  }

  handleDropdownToggle (value) {
    this.props.persistentState.setDropdownOpen(value);
  }

  handleItemToggle (e) {
    const { model, item } = this.props;

    // Stop propagation of `click` event from the icon button
    // so that list item's `onClick` handler doesn't get triggered
    // and it does not open the list item in the workbench.
    e && e.stopPropagation();
    model.toggleItem(item);
  }

  showActiveIndent (index) {
    const { show, depth } = this.props.activeIndent;

    // If show
    return show && (index === Number(depth));
  }

  // The class by itself renders nothing at all
  render (className, dom) {
    const onMouseOver = this.handleMouseHover.bind(this, true),
      onMouseLeave = this.handleMouseHover.bind(this, false);

    return (
      <div
        ref={(node) => { this.$node = node; }}
        className={className}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {dom}
      </div>
    );
  }
}

ICollectionSidebarListItem.defaultProps = {
  isFocused: false,
  activeIndent: {
    show: false,
    depth: 0
  }
};


ICollectionSidebarListItem.propTypes = {
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,
  item: PropTypes.oneOfType([
    PropTypes.instanceOf(CollectionModel),
    PropTypes.instanceOf(FolderModel),
    PropTypes.instanceOf(RequestModel),
    PropTypes.instanceOf(ResponseModel)
  ]).isRequired,
  persistentState: PropTypes.instanceOf(PersistentState).isRequired,
  activeIndent: PropTypes.object,
  isFocused: PropTypes.bool
};
