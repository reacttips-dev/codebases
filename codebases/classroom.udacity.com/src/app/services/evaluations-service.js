import ApiService from './api-service';

/*
  Example submission payload:

  var submission = {
    model: 'Submission',
    operation: 'GRADE',
    parts: [
      {
        model: 'SubmissionPart',
        marker: 'check1',
        content: true
      }
    ]
  }
*/

function gradeQuizAtom({
    nodeKey,
    nodeId,
    rootKey,
    rootId,
    userResponse
}) {
    return ApiService.post('/v1/evaluations/evaluate', {
        node_id: nodeId,
        node_key: nodeKey,
        root_key: rootKey,
        root_id: rootId,
        user_response: userResponse,
    }).then((data) => data.evaluation);
}

export default {
    gradeCheckboxQuizAtom({
        nodeKey,
        nodeId,
        rootKey,
        rootId,
        selectedIds
    }) {
        return gradeQuizAtom({
            nodeKey,
            nodeId,
            rootKey,
            rootId,
            userResponse: {
                selected_ids: selectedIds,
            },
        });
    },

    gradeMatchingQuizAtom({
        nodeKey,
        nodeId,
        rootKey,
        rootId,
        answerIds
    }) {
        return gradeQuizAtom({
            nodeKey,
            nodeId,
            rootKey,
            rootId,
            userResponse: {
                answer_ids: answerIds,
            },
        });
    },

    gradeRadioQuizAtom({
        nodeKey,
        nodeId,
        rootKey,
        rootId,
        selectedId
    }) {
        return gradeQuizAtom({
            nodeKey,
            nodeId,
            rootKey,
            rootId,
            userResponse: {
                selected_id: selectedId,
            },
        });
    },

    gradeValidatedQuizAtom({
        nodeId,
        rootKey,
        rootId,
        answer
    }) {
        return gradeQuizAtom({
            nodeId,
            rootKey,
            rootId,
            userResponse: {
                text: answer,
            },
        });
    },

    test({
        evaluationId,
        parts,
        clientExecution,
        atomKey,
        atomId,
        rootKey,
        rootId,
    }) {
        return this._evaluate(
            _.extend({
                evaluationId,
                parts,
                clientExecution,
                atomKey,
                atomId,
                rootKey,
                rootId,
            }, {
                operation: 'TEST'
            })
        ).then((data) => {
            var output = data.execution._output_attachments;
            var fileAttachments = data.execution._ordered_file_attachments || [];

            return {
                stderr: _.get(output, 'stderr._content._plaintext'),
                stdout: _.get(output, 'stdout._content._plaintext'),
                imageUrls: _.map(fileAttachments, (file) =>
                    _.get(file, '_content._serving_url')
                ),
            };
        });
    },

    grade({
        evaluationId,
        parts,
        clientExecution,
        atomKey,
        atomId,
        rootKey,
        rootId,
    }) {
        return this._evaluate(
            _.extend({
                evaluationId,
                parts,
                clientExecution,
                atomKey,
                atomId,
                rootKey,
                rootId,
            }, {
                operation: 'GRADE'
            })
        ).then((data) => {
            var evaluation = data.evaluation;
            if (!_.isEmpty(evaluation.evaluation_items)) {
                evaluation.comment =
                    evaluation.comment || evaluation.evaluation_items[0].comment;
            }
            return evaluation;
        });
    },

    _evaluate({
        evaluationId,
        operation,
        parts,
        clientExecution,
        atomKey,
        atomId,
        rootKey,
        rootId,
    }) {
        var submission = {
            model: 'Submission',
            operation,
            parts: _.map(parts, (content, marker) => {
                return {
                    model: 'SubmissionPart',
                    marker,
                    content,
                };
            }),
        };

        if (clientExecution) {
            submission['client_execution'] = clientExecution;
            submission['client_execution']['raw_result'] = JSON.stringify(
                clientExecution['raw_result']
            );
        }

        return ApiService.post('/v1/evaluations/evaluate', {
            evaluation_id: evaluationId,
            submission,
            atomKey,
            atomId,
            rootKey,
            rootId,
        });
    },
};