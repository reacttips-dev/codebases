import { truncToPlace } from 'bundles/primitive-formatting';

export function getDisplayDecimalGrade(grade: number) {
  // render up to 2 decimal places
  return truncToPlace(grade, 2);
}

export function getDisplayGradeWeight(gradeWeight: number) {
  // translate from a 10000 scale to a percentage
  const percentage = gradeWeight / 100;
  // render up to 2 decimal places
  return truncToPlace(percentage, 2);
}

export function getDecimalGradeFromPercent(percentGrade: number, precision = 4) {
  // convert percentage to grade with at least 4 decimal places
  const decimalGrade = percentGrade / 100;
  return truncToPlace(decimalGrade, precision);
}

export function getPercentGradeFromDecimal(decimalGrade: number, precision = 2) {
  // convert percentage to grade with at least 2 decimal places
  const percentage = decimalGrade * 100;
  return truncToPlace(percentage, precision);
}

export function getDecimalGradeFromGradeWeight(gradeWeight: number) {
  // translate from a 0-10000 scale to 0-1
  const decimal = gradeWeight / 10000;
  // render up to 4 decimal places
  return truncToPlace(decimal, 4);
}

export function getDisplayGradeWeightFromDecimal(decimalGrade: number) {
  // translate from a 0-1 scale to 0-10000
  const gradeWeight = decimalGrade * 10000;
  // render up to 2 decimal places
  return truncToPlace(gradeWeight, 2);
}

export function getBoundedGrade(grade: number, maxGrade: number) {
  if (grade > maxGrade && maxGrade) {
    return maxGrade;
  } else if (grade < 0) {
    return 0;
  } else {
    return grade;
  }
}

export default {
  getDisplayDecimalGrade,
  getDisplayGradeWeight,
  getDecimalGradeFromPercent,
  getPercentGradeFromDecimal,
  getDecimalGradeFromGradeWeight,
  getDisplayGradeWeightFromDecimal,
  getBoundedGrade,
};
