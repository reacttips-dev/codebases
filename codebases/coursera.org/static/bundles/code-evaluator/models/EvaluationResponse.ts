import _ from 'lodash';

export type StringOutputContents = {
  message: string;
};

export type TestCaseOutputContents = {
  message: string;
  isCorrect: boolean;
};

export type ImageDataOutputContents = {
  // This is actually an enum on the backend, but a string here because don't want to depend on this type changing when
  // that backend type changes.
  imageType: string;
  data: string;
};

// TODO (dwinegar) convert these to exact object types when available.

type StringOutput = {
  'org.coursera.eval.evaluation.StringOutput': StringOutputContents;
  'org.coursera.eval.evaluation.TestCaseOutput': undefined;
  'org.coursera.eval.evaluation.ImageDataOutput': undefined;
};
type TestCaseOutput = {
  'org.coursera.eval.evaluation.StringOutput': undefined;
  'org.coursera.eval.evaluation.TestCaseOutput': TestCaseOutputContents;
  'org.coursera.eval.evaluation.ImageDataOutput': undefined;
};

type ImageDataOutput = {
  'org.coursera.eval.evaluation.StringOutput': undefined;
  'org.coursera.eval.evaluation.TestCaseOutput': undefined;
  'org.coursera.eval.evaluation.ImageDataOutput': ImageDataOutputContents;
};

type EvaluationSuccessResultContents = {
  output: StringOutput | TestCaseOutput | ImageDataOutput;
};

type EvaluationSuccessResult = {
  'org.coursera.eval.evaluation.EvaluationSuccessResult': EvaluationSuccessResultContents;
  'org.coursera.eval.evaluation.RuntimeErrorResult': undefined;
  'org.coursera.eval.client.TimeoutErrorResult': undefined;
  'org.coursera.eval.client.ErrorCodeResult': undefined;
};

type RuntimeErrorResultContents = {
  errors: Array<{ message: string; code: string }>;
};

type RuntimeErrorResult = {
  'org.coursera.eval.evaluation.EvaluationSuccessResult': undefined;
  'org.coursera.eval.evaluation.RuntimeErrorResult': RuntimeErrorResultContents;
  'org.coursera.eval.client.TimeoutErrorResult': undefined;
  'org.coursera.eval.client.ErrorCodeResult': undefined;
};

type TimeoutErrorResultContents = {
  timeout: number;
};

type TimeoutErrorResult = {
  'org.coursera.eval.evaluation.EvaluationSuccessResult': undefined;
  'org.coursera.eval.evaluation.RuntimeErrorResult': undefined;
  'org.coursera.eval.client.TimeoutErrorResult': TimeoutErrorResultContents;
  'org.coursera.eval.client.ErrorCodeResult': undefined;
};

type ErrorCodeResultContents = {
  errors: Array<{ code: string }>;
};

type ErrorCodeResult = {
  'org.coursera.eval.evaluation.EvaluationSuccessResult': undefined;
  'org.coursera.eval.evaluation.RuntimeErrorResult': undefined;
  'org.coursera.eval.client.TimeoutErrorResult': undefined;
  'org.coursera.eval.client.ErrorCodeResult': ErrorCodeResultContents;
};

type LogUrls = {
  id: string;
  stderrUrl: string;
  stdoutUrl: string;
  wrapperUrl: string;
};

type Hint = {
  startPosition: number;
  endPosition: number;
  text: string;
};

export type EvaluationResult = EvaluationSuccessResult | ErrorCodeResult | TimeoutErrorResult | RuntimeErrorResult;

export type RawEvaluationResponse = {
  id: string;
  result: EvaluationResult;
  logUrls?: LogUrls;
  hints?: Array<Hint>;
  hasSuccessResult?: boolean;
};

class EvaluationResponse {
  id: string;

  hints: Array<Hint>;

  rawResponse: RawEvaluationResponse;

  successResult?: EvaluationSuccessResultContents;

  runtimeErrorResult?: RuntimeErrorResultContents;

  errorCodeResult?: ErrorCodeResultContents;

  timeoutErrorResult?: TimeoutErrorResultContents;

  constructor({ id, result, logUrls, hints = [] }: RawEvaluationResponse) {
    this.id = id;
    this.rawResponse = {
      id,
      result,
      logUrls,
      hints,
    };
    this.hints = hints;

    this.successResult = result['org.coursera.eval.evaluation.EvaluationSuccessResult'];
    this.runtimeErrorResult = result['org.coursera.eval.evaluation.RuntimeErrorResult'];

    this.errorCodeResult = result['org.coursera.eval.client.ErrorCodeResult'];
    this.timeoutErrorResult = result['org.coursera.eval.client.TimeoutErrorResult'];
  }

  hasIdenticalOutput(otherEvaluationResponse: EvaluationResponse | null): boolean {
    if (otherEvaluationResponse == null) {
      return false;
    }

    const otherRawResult = otherEvaluationResponse.rawResponse.result;
    const thisRawResult = this.rawResponse.result;

    return _.isEqual(otherRawResult, thisRawResult);
  }

  get stringOutput(): StringOutputContents | undefined {
    return this.successResult && this.successResult.output['org.coursera.eval.evaluation.StringOutput'];
  }

  get testCaseOutput(): TestCaseOutputContents | undefined {
    return this.successResult && this.successResult.output['org.coursera.eval.evaluation.TestCaseOutput'];
  }

  get imageDataOutput(): ImageDataOutputContents | undefined {
    return this.successResult && this.successResult.output['org.coursera.eval.evaluation.ImageDataOutput'];
  }

  /*
   * returns the raw result, for test case serialization.
   */
  getEvaluationResult(): EvaluationResult {
    return this.rawResponse.result;
  }

  toJSON(): RawEvaluationResponse {
    return {
      id: this.id,
      result: this.rawResponse.result,
      logUrls: this.rawResponse.logUrls,
      hints: this.rawResponse.hints,
    };
  }
}

export default EvaluationResponse;
