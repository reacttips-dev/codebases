export function isAlphaCharacters(str: string): boolean {
  let code;
  let i;
  let len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) // lower alpha (a-z)
    ) {
      return false;
    }
  }
  return true;
}

export function extractFirstAndLastNames(namesArray: string[]): string[] {
  const first = 0;
  const last = namesArray.length - 1;
  const result: string[] = [];
  if (!namesArray || namesArray.length < 1) {
    return ['-', '-'];
  }

  if (namesArray[first] && !isAlphaCharacters(namesArray[first][0])) {
    namesArray.shift();
  }

  if (namesArray[last] && !isAlphaCharacters(namesArray[last])) {
    namesArray.pop();
  }

  if (namesArray.length - 1 !== last) {
    return extractFirstAndLastNames(namesArray);
  } else {
    if (namesArray[first]) {
      const firstName = namesArray[first];
      result.push(firstName);
    }

    if (first !== last && namesArray[last]) {
      const lastName = namesArray[last];
      result.push(lastName);
    }

    return result;
  }
}

export function initialsFromName(fullName: string): string {
  const namesArray = fullName.split(' ');
  const [firstName, lastName] = extractFirstAndLastNames(namesArray);
  const firstInitial = firstName ? firstName[0] : '';
  const lastInitial = lastName ? lastName[0] : '';
  return `${firstInitial}${lastInitial}`;
}
