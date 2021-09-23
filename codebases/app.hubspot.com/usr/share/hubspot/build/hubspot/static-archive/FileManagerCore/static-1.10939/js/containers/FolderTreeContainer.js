'use es6';

import { connect } from 'react-redux';
import { getFoldersById, getFolderTree, getSelectedFolderAncestors } from '../selectors/Folders';
import { fetchFoldersByParentId } from '../actions/FolderFetch';
import { fetchTeams } from '../actions/Teams';
import FolderTree from '../components/FolderTree';
import { getIsUngatedForPartitioning } from '../selectors/Auth';
import { getIsTeamsRequestSucceeded, getPortalTeams } from '../selectors/Teams';

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    tree: getFolderTree(state),
    ancestors: getSelectedFolderAncestors(state, props),
    folders: getFoldersById(state),
    isUngatedForPartitioning: getIsUngatedForPartitioning(state),
    isTeamsRequestSucceeded: getIsTeamsRequestSucceeded(state),
    teams: getPortalTeams(state)
  };
};

var mapDispatchToProps = {
  fetchFoldersByParentId: fetchFoldersByParentId,
  fetchTeams: fetchTeams
};
export default connect(mapStateToProps, mapDispatchToProps)(FolderTree);