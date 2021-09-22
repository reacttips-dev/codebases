import createLoadableComponent from 'js/lib/createLoadableComponent';

const LoadableLazyBuildCompilationMessage = createLoadableComponent(() =>
  import('bundles/webpack/lazybuild/components/LazyBuildCompilationMessage')
);

const createLazyBuildAsyncHandler = ({ moduleName }) => {
  class BuildOnRouteWrapper extends React.Component {
    render() {
      return <LoadableLazyBuildCompilationMessage {...this.props} moduleName={moduleName} />;
    }
  }

  return (nextState, cb) => {
    cb(null, BuildOnRouteWrapper);
  };
};

export default createLazyBuildAsyncHandler;
