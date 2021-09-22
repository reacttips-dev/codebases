const formatStringList = (strings: string[]): string => {
  if (strings.length === 1) {
    return strings[0];
  }
  return [strings.slice(0, strings.length - 1).join(', '), strings[strings.length - 1]].join(' & ');
};

export const formatPartnerNames = (partnerNames: string[]): string => {
  return formatStringList(partnerNames);
};

export const formatInstructorNames = (instructorNames: string[]): string => {
  return formatStringList(instructorNames);
};
