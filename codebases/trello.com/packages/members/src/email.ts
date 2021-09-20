// Based on Data Science's extraction of domain from primary user email
// https://github.com/trello/mode/search?q=split_part
export const getEmailDomain = (email?: string) => {
  return email?.split('@')[1] ?? '';
};
