import Actions from 'actions';

/* Bind action creators to dispatch. This is intended to be used as the `mapDispatchToProps`, example:

    ```
    var mapDispatchToProps = actionsBinder('fetchNanodegree', 'addAlert')
    ```

    And now in the connected component, `this.props.fetchNanodegree()` and `this.props.addAlert()`
    are available.
*/
export function actionsBinder(...actionNames) {
    return (dispatch) => {
        return _.reduce(
            actionNames,
            (bound, actionName) => {
                var actionCreator = Actions[actionName];
                if (!_.isFunction(actionCreator)) {
                    throw `Unknown action creator: ${actionName}`;
                }

                bound[actionName] = function() {
                    return dispatch(actionCreator.apply(Actions, arguments));
                };

                return bound;
            }, {}
        );
    };
}