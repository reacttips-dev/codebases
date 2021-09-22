export const mapToValues = (data: {}, acc: {}, fieldName: string) => {
    acc[fieldName] = data[fieldName].value;
    return acc;
};
