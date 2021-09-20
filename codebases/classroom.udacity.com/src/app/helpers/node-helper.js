import SemanticTypes from 'constants/semantic-types';

const NodeHelper = {
    /**
     * Get the node after the `currentNode` in the `nodes` array
     */
    getNext(nodes, node) {
        var nodeIdx = _.findIndex(nodes, {
            key: _.get(node, 'key')
        });

        if (nodeIdx !== -1) {
            return nodes[nodeIdx + 1] || null;
        } else {
            return null;
        }
    },

    /**
     * Get all previous nodes before `currentNode` in the `nodes` array
     */
    getAllPrevious(nodes, node) {
        var nodeIdx = _.findIndex(nodes, {
            key: _.get(node, 'key')
        });

        if (nodeIdx > 0) {
            return nodes.slice(0, nodeIdx);
        } else {
            return [];
        }
    },

    /**
     * Get the node before the `currentNode` in the `nodes` array
     */
    getPrevious(nodes, node) {
        var nodeIdx = _.findIndex(nodes, {
            key: _.get(node, 'key')
        });

        if (nodeIdx > 0) {
            return nodes[nodeIdx - 1] || null;
        } else {
            return null;
        }
    },

    getCompletionPercentage(node) {
        return (
            (NodeHelper.getAggregatedStateValue(node, 'completion_amount') || 0) * 100
        );
    },

    hasStarted(node) {
        return NodeHelper.getCompletionPercentage(node) > 0;
    },

    getLastViewedAt(node) {
        var lastViewedAt = NodeHelper.getUserStateValue(node, 'last_viewed_at');
        if (lastViewedAt) {
            return new Date(lastViewedAt);
        } else {
            return null;
        }
    },

    getLastViewedChildKey(node) {
        return NodeHelper.getAggregatedStateValue(node, 'last_viewed_child_key');
    },

    getLastViewedChild(parent, children) {
        var child = _.find(children, {
            key: NodeHelper.getLastViewedChildKey(parent),
        });
        if (!child) {
            // TODO: Remove when we have an error reporting system
            console.warn(
                '[NodeHelper.getLastViewedChild] Could not find last viewed child for parent: ',
                parent
            );
        }
        return child || children[0];
    },

    isInteractiveAtom(atom) {
        return _.includes(
            ['QuizAtom', 'RadioQuizAtom', 'CheckboxQuizAtom', 'ReflectAtom'],
            (atom || {}).semantic_type
        );
    },

    isCompleted(node) {
        return !!(
            NodeHelper.getUserStateValue(node, 'completed_at') ||
            NodeHelper.getAggregatedStateValue(node, 'completed_at')
        );
    },

    isInProgress(node) {
        return NodeHelper.getCompletionPercentage(node) > 0;
    },

    getInstructor(rootNode) {
        if (SemanticTypes.isNanodegree(rootNode)) {
            return null;
        } else {
            var instructor = _.first(rootNode.instructors);
            return instructor || null;
        }
    },

    getSemanticType(rootNode) {
        return rootNode.semantic_type;
    },

    getSemanticTypeName(rootNode) {
        return SemanticTypes.isNanodegree(rootNode) ?
            'Nanodegree' :
            rootNode.semantic_type;
    },

    getInstructorImageUrl(rootNode) {
        return (NodeHelper.getInstructor(rootNode) || {}).image_url || '';
    },

    getInstructorDisplayName(rootNode) {
        return (NodeHelper.getInstructor(rootNode) || {}).first_name;
    },

    getUnstructuredData(node) {
        var data = NodeHelper.getUserStateValue(node, 'unstructured');

        return data === undefined ? null : JSON.parse(data);
    },

    isResourcesEmpty(resources) {
        return (!resources ||
            (_.isEmpty(resources.files) &&
                !resources.google_plus_link &&
                !resources.coaching_appointments_link &&
                !resources.career_resource_center_link)
        );
    },

    getUserStateValue(node, key) {
        return (node.user_state || {})[key];
    },

    getAggregatedStateValue(node, key) {
        return _.get(node, ['_aggregated_state', key]);
    },

    isGraduated(node) {
        return node.is_graduated === true;
    },

    getTitle(node) {
        if (_.isEmpty(node)) {
            return null;
        }

        var prefix = '[HIDDEN] ';
        return !node.is_public ? `${prefix}${node.title}` : node.title;
    },

    getPosition(nodes, node) {
        return _.findIndex(nodes, {
            key: _.get(node, 'key')
        });
    },

    includes(nodes, node) {
        return NodeHelper.getPosition(nodes, node) !== -1;
    },
};

export default NodeHelper;