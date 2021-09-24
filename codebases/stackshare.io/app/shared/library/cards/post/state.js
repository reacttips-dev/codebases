const initialState = () => ({
  commentsVisible: true,
  composerExpanded: false,
  newComment: '',
  activeReplies: new Set(),
  showDeleteModal: false,
  editMode: false,
  editModePermalink: false,
  showFirstRun: false,
  showUpvoteHint: false,
  showAdviceComposer: false
});

export default initialState;
