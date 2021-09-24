export default class RuleChecker {
  constructor(rules) {
    this.rules = rules;
    this.checked = [];
  }
  reset() {
    this.checked = [];
  }

  check(facts) {
    for (let i = 0; i < this.rules.length; i++) {
      const {name, condition, fail} = this.rules[i];

      // If we've checked this rule already, skip to the next rule.
      // RuleChecker is forgiving for now; this behavior can be optional
      // in the future.
      if (this.checked.includes(name)) continue;
      this.checked.push(name);

      if (eval(condition(facts))) {
        continue;
      } else {
        return fail(facts);
      }
    }
    return null;
  }
}
