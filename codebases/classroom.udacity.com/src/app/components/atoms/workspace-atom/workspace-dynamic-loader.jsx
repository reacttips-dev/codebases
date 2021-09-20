import PartnerWorkspace from './partner-workspace';
import UdacityWorkspace from './udacity-workspace';
import { addReducer } from 'store';

class WorkspaceDynamicLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // The `Provisioner` component and `getLinkToMostRecentFiles` and `isEmptyArchivesError` functions are
      // imported dynamically: see `componentDidMount`
      Provisioner: null,
      getLinkToMostRecentFiles: null,
      isEmptyArchivesError: null,
    };
  }
  async componentDidMount() {
    if (this._isPartnerWorkspace()) {
      // TBD: update to provide getLinkToMostRecentFiles and isEmptyArchivesError for nebulix
      return;
    }

    // load the ureact-workspace module and dependencies dynamically see [React
    // Code Splitting Docs](https://reactjs.org/docs/code-splitting.html)
    const workspace = await import('@udacity/ureact-workspace');
    addReducer('workspaces', workspace.reducer);
    this.setState({
      Provisioner: workspace.Provisioner,
      getLinkToMostRecentFiles: workspace.getLinkToMostRecentFiles,
      isEmptyArchivesError: workspace.isEmptyArchivesError,
    });
  }

  _isPartnerWorkspace = () => {
    const { atom } = this.props;

    return atom.configuration.blueprint.kind === 'partner-workspace';
  };

  render() {
    const { atom } = this.props;

    if (this._isPartnerWorkspace()) {
      return <PartnerWorkspace atom={atom} />;
    } else {
      return (
        <UdacityWorkspace
          {...this.props}
          Provisioner={this.state.Provisioner}
          getLinkToMostRecentFiles={this.state.getLinkToMostRecentFiles}
          isEmptyArchivesError={this.state.isEmptyArchivesError}
        />
      );
    }
  }
}

export default WorkspaceDynamicLoader;
