const filteredUsersForDuplicates = (arr) => {
    return arr.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        }
        return acc;
    }, []);
};

export default filteredUsersForDuplicates;