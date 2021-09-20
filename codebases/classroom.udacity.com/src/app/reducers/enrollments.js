import Actions from 'actions';

const enrollmentVersionValid = (enrollment) => {
    return (
        enrollment.root_node &&
        enrollment.root_node.version &&
        enrollment.root_node.version !== undefined &&
        enrollment.root_node.version !== null
    );
};

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.SET_ENROLLMENTS:
            const enrollments = action.payload;
            const enrollmentsMap = enrollments.reduce((accumulator, enrollment) => {
                if (
                    enrollment &&
                    enrollmentVersionValid(enrollment) &&
                    !(enrollment.key in accumulator)
                ) {
                    accumulator[enrollment.key] = {
                        id: enrollment.id,
                        key: enrollment.key,
                        version: enrollment.version,
                        locale: enrollment.locale ? enrollment.locale : null,
                        state: enrollment.state,
                        is_ready_for_graduation: enrollment.is_ready_for_graduation,
                        rootNode: {
                            semantic_type: enrollment.root_node.semantic_type,
                            version: enrollment.root_node.version,
                            locale: enrollment.root_node.locale ?
                                enrollment.root_node.locale :
                                null,
                        },
                    };
                }
                return accumulator;
            }, {});
            state = {
                ...state,
                ...enrollmentsMap,
            };
            break;
    }
    return state;
}