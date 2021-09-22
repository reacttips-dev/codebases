const transformToUnorderedList = (list: string[]) => {
    const bulletPointsHtml = list.map((text) => `<li>${text}</li>`).join("");
    return `<ul>${bulletPointsHtml}</ul>`;
};

export {transformToUnorderedList};
