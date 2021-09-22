const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

function calcTimeWarn(timeLimit?: number | null) {
  let warn = 0;
  if (timeLimit) {
    if (timeLimit > 0 && timeLimit <= 30 * MINUTE) {
      warn = 2 * MINUTE;
    } else if (timeLimit > 30 * MINUTE && timeLimit <= HOUR) {
      warn = 5 * MINUTE;
    } else if (timeLimit > HOUR) {
      warn = 10 * MINUTE;
    }
  }
  return warn;
}

const exported = {
  calcTimeWarn,
};

export default exported;
export { calcTimeWarn };
