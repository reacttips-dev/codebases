import * as ISurveyComponent from "../Api/ISurveyComponent";
import { IInterceptComponent } from "./../Api/IInterceptComponent";

class InterceptComponent implements IInterceptComponent {
	public static make(data: InterceptComponent.InterceptComponentData): IInterceptComponent {
		try {
			return new InterceptComponent(data);
		} catch (e) {
			return null;
		}
	}

	private data: InterceptComponent.InterceptComponentData;

	public constructor(data: InterceptComponent.InterceptComponentData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.question) {
			throw new Error("data.question must not be null or empty");
		}
		if (!data.title) {
			throw new Error("data.title must not be null or empty");
		}
		if (!data.url) {
			throw new Error("data.url must not be null or empty");
		}

		this.data = data;
	}

	// @Override
	public getType(): ISurveyComponent.Type {
		return ISurveyComponent.Type.Intercept;
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
	public getUrl(): string {
		return this.data.url;
	}

	// @Override
	public getDomElements(doc: Document): Element[]  {
		if (!doc) {
			throw new Error("Document must not be null");
		}
		return [doc.createElement(ISurveyComponent.DOM_INTERCEPT_TAGNAME)];
	}

	// @Override
	public getJsonElements(): object {
		return {[ISurveyComponent.JSON_INTERCEPT_KEYNAME]: ""};
	}

	// @Override
	public getComponentJson(): object {
		return {
			[ISurveyComponent.JSON_TITLE_KEYNAME]: this.getTitle(),
			[ISurveyComponent.JSON_QUESTION_KEYNAME]: this.getQuestion(),
			[ISurveyComponent.JSON_INTERCEPTURL_KEYNAME]: this.getUrl(),
		};
	}
}

module InterceptComponent {
	export class InterceptComponentData {
		public question: string;
		public title: string;
		public url: string;
	}
}

export = InterceptComponent;
