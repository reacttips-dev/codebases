import { ICommentComponent } from "./../Api/ICommentComponent";
import ISurveyComponent = require("./../Api/ISurveyComponent");

class CommentComponent implements ICommentComponent {
	public static make(data: CommentComponent.CommentComponentData): ICommentComponent {
		try {
			return new CommentComponent(data);
		} catch (e) {
			return null;
		}
	}

	private data: CommentComponent.CommentComponentData;
	private userComment: string;

	public constructor(data: CommentComponent.CommentComponentData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.question) {
			throw new Error("data.question must not be null or empty");
		}

		this.data = data;
		this.userComment = "";
	}

	// @Override
	public getType(): ISurveyComponent.Type {
		return ISurveyComponent.Type.Comment;
	}

	// @Override
	public getQuestion(): string {
		return this.data.question;
	}

	// @Override
	public setSubmittedText(userComment: string): void {
		this.userComment = userComment;
	}

	// @Override
	public getSubmittedText(): string {
		return this.userComment;
	}

	// @Override
	public getDomElements(doc: Document): Element[] {
		if (!doc) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurveyComponent.DOM_COMMENT_TAGNAME);
		element.appendChild(doc.createTextNode(this.getSubmittedText()));

		return [element];
	}

	// @Override
	public getJsonElements(): object {
		const result: object = {};
		result[ISurveyComponent.JSON_COMMENT_KEYNAME] = this.getSubmittedText();
		return result;
	}

	// @Override
	public getComponentJson(): object {
		return {
			[ISurveyComponent.JSON_QUESTION_KEYNAME]: this.getQuestion(),
		};
	}
}

module CommentComponent {
	export class CommentComponentData {
		public question: string;
	}
}

export = CommentComponent;
