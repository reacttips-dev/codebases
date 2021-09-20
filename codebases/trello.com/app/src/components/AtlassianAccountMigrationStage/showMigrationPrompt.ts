export const showMigrationPrompt = (search: string) => {
  return new URLSearchParams(search).get('showAaMigrate') || '';
};
