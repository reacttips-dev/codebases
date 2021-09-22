import * as ISurveyComponent from "../Api/ISurveyComponent";
import * as IPrompt from "./../Api/IPrompt";
import { IPromptComponent } from "./../Api/IPromptComponent";

class PromptComponent implements IPromptComponent {
	public static make(data: PromptComponent.PromptComponentData): IPromptComponent {
		try {
			return new PromptComponent(data);
		} catch (e) {
			return null;
		}
	}

	private data: PromptComponent.PromptComponentData;
	private selectedButton: IPrompt.PromptButton;

	public constructor(data: PromptComponent.PromptComponentData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.question) {
			throw new Error("data.question must not be null or empty");
		}
		if (!data.title) {
			throw new Error("data.title must not be null or empty");
		}
		if (!data.yesButtonLabel) {
			throw new Error("data.yesButtonLabel must not be null or empty");
		}
		if (!data.noButtonLabel) {
			throw new Error("data.noButtonLabel must not be null or empty");
		}

		this.data = data;
		this.selectedButton = IPrompt.PromptButton.Unselected;
	}

	// @Override
	public getType(): ISurveyComponent.Type {
		return ISurveyComponent.Type.Prompt;
	}

	// @Override
	public getTitle(): string {
		return this.data.title;
	}

	// @Override
	public getQuestion(): string {
		return this.data.question;
	}

	// @Override
	public getYesButtonText(): string {
		return this.data.yesButtonLabel;
	}

	// @Override
	public getNoButtonText(): string {
		return this.data.noButtonLabel;
	}

	// @Override
	public setButtonSelected(selected: IPrompt.PromptButton): void {
		if (selected) {
			this.selectedButton = selected;
		}
	}

	// @Override
	public getButtonSelected(): IPrompt.PromptButton {
		return this.selectedButton;
	}

	// @Override
	public getDomElements(doc: Document): Element[]  {
		if (!doc) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurveyComponent.DOM_PROMPT_TAGNAME);
		element.appendChild(doc.createTextNode(this.promptButtonToString(this.getButtonSelected())));

		return [element];
	}

	// @Override
	public getJsonElements(): object {
		const result: object = {};
		result[ISurveyComponent.JSON_PROMPT_KEYNAME] = this.promptButtonToString(this.getButtonSelected());
		return result;
	}

	// @Override
	public getComponentJson(): object {
		return {
			[ISurveyComponent.JSON_TITLE_KEYNAME]: this.getTitle(),
			[ISurveyComponent.JSON_QUESTION_KEYNAME]: this.getQuestion(),
			[ISurveyComponent.JSON_PROMPTYESTEXT_KEYNAME]: this.getYesButtonText(),
			[ISurveyComponent.JSON_PROMPTNOTEXT_KEYNAME]: this.getNoButtonText(),
		};
	}

	private promptButtonToString(value: IPrompt.PromptButton): string {
		switch (value) {
			case IPrompt.PromptButton.Unselected:
				return "Unselected";
			case IPrompt.PromptButton.Yes:
				return "Yes";
			case IPrompt.PromptButton.No:
				return "No";
			default:
				return "Unknown";
		}
	}
}

module PromptComponent {
	export class PromptComponentData {
		public question: string;
		public title: string;
		public yesButtonLabel: string;
		public noButtonLabel: string;
	}
}

export = PromptComponent;
