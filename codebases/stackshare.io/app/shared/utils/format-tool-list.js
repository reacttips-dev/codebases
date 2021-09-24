export const formatToolList = _tools => {
  const tools = _tools.filter(tool => !tool.empty && !tool.loading);
  return tools
    .map((tool, index) =>
      index === tools.length - 1
        ? `and ${tool.name}`
        : `${tool.name}${tools.length > 2 ? ',' : ''} `
    )
    .join('');
};
