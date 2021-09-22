import * as ISurveyComponent from "../Api/ISurveyComponent";
import { IMultipleChoiceComponent } from "./../Api/IMultipleChoiceComponent";

class MultipleChoiceComponent implements IMultipleChoiceComponent {
	public static make(data: MultipleChoiceComponent.MultipleChoiceComponentData): IMultipleChoiceComponent {
		try {
			return new MultipleChoiceComponent(data);
		} catch (e) {
			return null;
		}
	}

	private data: MultipleChoiceComponent.MultipleChoiceComponentData;
	private optionStates: boolean[];

	public constructor(data: MultipleChoiceComponent.MultipleChoiceComponentData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.question) {
			throw new Error("data.question must not be null or empty");
		}
		if (!data.availableOptions || data.availableOptions.length < 2) {
			throw new Error("data.availableOptions must not be null or have less than two choices");
		}

		data.availableOptions.forEach((option) => {
			if (!option) {
				throw new Error("Option values must not contain null or empty");
			}
		});

		this.data = data;
		this.optionStates = new Array<boolean>(data.availableOptions.length);
		// Initialize with all false values
		for (let i = 0; i < this.optionStates.length; i++) {
			this.optionStates[i] = false;
		}
	}

	public getType(): ISurveyComponent.Type {
		return ISurveyComponent.Type.MultipleChoice;
	}

	public getQuestion(): string {
		return this.data.question;
	}

	public getAvailableOptions(): string[] {
		return this.data.availableOptions;
	}

	public getOptionSelectedStates(): boolean[] {
		return this.optionStates;
	}

	public getMinNumberofSelectedOptions(): number {
		return this.data.minNumberOfSelectedOptions;
	}

	public getMaxNumberofSelectedOptions(): number {
		return this.data.maxNumberOfSelectedOptions;
	}

	public setOptionSelectedStates(selectedStates: boolean[]): void {
		for (let i = 0; i < selectedStates.length; i ++) {
			this.optionStates[i] = selectedStates[i];
		}
	}

	public ValidateMinNumberofSelectedOptions(): boolean {
		let result: number = 0;
		this.optionStates.forEach((element) => {
			if (element) {
				result++;
			}
		});

		return (result >= this.getMinNumberofSelectedOptions());
	}

	public ValidateMaxNumberofSelectedOptions(): boolean {
		let result: number = 0;
		this.optionStates.forEach((element) => {
			if (element) {
				result++;
			}
		});

		return (result <= this.getMaxNumberofSelectedOptions());
	}

	public getDomElements(doc: Document): Element[] {
		if (!doc) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurveyComponent.DOM_MULTIPLECHOICE_TAGNAME);

		element.appendChild(doc.createTextNode(this.getOptionSelectedStates().toString()));

		return [element];
	}

	// @Override
	public getJsonElements(): object {
		const result: object = {};
		result[ISurveyComponent.JSON_MULTIPLECHOICE_KEYNAME] = this.getOptionSelectedStates().toString();

		return result;
	}

	// @Override
	public getComponentJson(): object {
		return {
			[ISurveyComponent.JSON_QUESTION_KEYNAME]: this.getQuestion(),
			[ISurveyComponent.JSON_RATINGOPTIONS_KEYNAME]: this.getAvailableOptions(),
		};
	}
}

module MultipleChoiceComponent {
	export class MultipleChoiceComponentData {
		public question: string;
		public availableOptions: string[];
		public minNumberOfSelectedOptions: number;
		public maxNumberOfSelectedOptions: number;
	}
}

export = MultipleChoiceComponent;
