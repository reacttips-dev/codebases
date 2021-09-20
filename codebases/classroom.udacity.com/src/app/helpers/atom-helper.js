const AtomHelper = {
    /**
     * Get the total number of questions within an array of atoms.
     */
    getQuestionCount(atoms) {
        var count = 0;

        _.map(atoms, (atom) => {
            count += AtomHelper.isAtomQuestion(atom) ? 1 : 0;
        });

        return count;
    },

    /**
     * Return TRUE or FALSE if the given atom is a question.
     */
    isAtomQuestion(atom) {
        return _.isObject(atom.question);
    },

    /**
     * Returns the readable index of which question is presented in an array of
     * atoms.
     */
    getQuestionNumber(nodeKey, atoms) {
        var questions = _.filter(atoms, AtomHelper.isAtomQuestion);
        return _.findIndex(questions, {
            key: nodeKey
        }) + 1;
    },

    /**
     * Return an object with both the given atom index and the total question
     * count.
     */
    getQuestionNumberAndCount(nodeKey, atoms) {
        var index = AtomHelper.getQuestionNumber(nodeKey, atoms);
        var count = AtomHelper.getQuestionCount(atoms);

        return {
            index: index,
            count: count
        };
    },

    findItemIndexById(list, item) {
        return _.findIndex(list, {
            id: (item || {}).id
        });
    },

    validListSize(list, size) {
        return _.size(_.compact(list)) !== size;
    },
};

export default AtomHelper;