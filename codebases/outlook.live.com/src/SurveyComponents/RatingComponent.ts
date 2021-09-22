import * as ISurveyComponent from "../Api/ISurveyComponent";
import { IRatingComponent } from "./../Api/IRatingComponent";

class RatingComponent implements IRatingComponent {
	public static make(data: RatingComponent.RatingComponentData): IRatingComponent {
		try {
			return new RatingComponent(data);
		} catch (e) {
			return null;
		}
	}

	private data: RatingComponent.RatingComponentData;
	private selectedIndex: number;

	public constructor(data: RatingComponent.RatingComponentData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.question) {
			throw new Error("data.question must not be null or empty");
		}
		if (!data.ratingValuesAscending || data.ratingValuesAscending.length < 2) {
			throw new Error("data.ratingValuesAscending must not be null or have less than two choices");
		}

		data.ratingValuesAscending.forEach((rating) => {
			if (!rating) {
				throw new Error("rating values must not contain null or empty");
			}
		});

		this.data = data;
		this.selectedIndex = -1;
	}

	public getType(): ISurveyComponent.Type {
		return ISurveyComponent.Type.Rating;
	}

	public getQuestion(): string {
		return this.data.question;
	}

	public getRatingValuesAscending(): string[] {
		return this.data.ratingValuesAscending;
	}

	public getSelectedRating(): string {
		if (!this.isRatingIndexValid(this.selectedIndex)) {
			return "";
		}

		return this.data.ratingValuesAscending[this.selectedIndex];
	}

	public setSelectedRatingIndex(selected: number): void {
		if (this.isRatingIndexValid(selected)) {
			this.selectedIndex = selected;
		} else {
			this.selectedIndex = -1;
		}
	}

	public getSelectedRatingIndex(): number {
		return this.selectedIndex;
	}

	public getDomElements(doc: Document): Element[] {
		if (!doc) {
			throw new Error("Document must not be null");
		}

		const element: Element = doc.createElement(ISurveyComponent.DOM_RATING_TAGNAME);

		if (!this.isRatingIndexValid(this.getSelectedRatingIndex())) {
			element.appendChild(doc.createTextNode("Not rated"));
		} else {
			// Enforce six digits after the decimal
			element.appendChild(doc.createTextNode(this.getNormalizedRatingScore().toFixed(6)));
		}

		return [element];
	}

	// @Override
	public getJsonElements(): object {
		const result: object = {};

		if (!this.isRatingIndexValid(this.getSelectedRatingIndex())) {
			result[ISurveyComponent.JSON_RATING_KEYNAME] = "Not rated";
		} else {
			result[ISurveyComponent.JSON_RATING_KEYNAME] = this.getNormalizedRatingScore();
		}

		return result;
	}

	// @Override
	public getComponentJson(): object {
		return {
			[ISurveyComponent.JSON_QUESTION_KEYNAME]: this.getQuestion(),
			[ISurveyComponent.JSON_RATINGOPTIONS_KEYNAME]: this.getRatingValuesAscending(),
		};
	}

	public getNormalizedRatingScore(): number {
		if (!this.isRatingIndexValid(this.getSelectedRatingIndex())) {
			return -1;
		}

		if (this.data.isZeroBased) {
			return (this.selectedIndex) / (this.data.ratingValuesAscending.length - 1);
		} else {
			return (this.selectedIndex + 1.0) / this.data.ratingValuesAscending.length;
		}
	}

	private isRatingIndexValid(index: number): boolean {
		return (index >= 0 && index < this.data.ratingValuesAscending.length);
	}

}

module RatingComponent {
	export class RatingComponentData {
		public question: string;
		public ratingValuesAscending: string[];
		public isZeroBased: boolean;
	}
}

export = RatingComponent;
