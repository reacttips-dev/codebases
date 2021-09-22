const passingStates = {
  notPassed: 'notPassed',
  passed: 'passed',
};

class ItemGroupGrade {
  passingStates!: typeof passingStates;

  passingState!: keyof typeof ItemGroupGrade.passingStates;

  overallPassedCount!: number;

  overallGrade!: number;

  static get empty() {
    return {
      passingState: ItemGroupGrade.passingStates.notPassed,
      overallPassedCount: 0,
      overallGrade: 0,
    };
  }

  static get passingStates(): typeof passingStates {
    return passingStates;
  }

  constructor({
    passingState,
    overallPassedCount,
    overallGrade,
  }: {
    passingState: keyof typeof ItemGroupGrade.passingStates;
    overallPassedCount: number;
    overallGrade: number;
  }) {
    Object.assign(this, ItemGroupGrade.empty, {
      passingState,
      overallPassedCount,
      overallGrade,
    });
  }

  get isPassing(): boolean {
    return this.passingState === ItemGroupGrade.passingStates.passed;
  }
}

export default ItemGroupGrade;
