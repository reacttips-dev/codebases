import { ISurveyMetadata } from "./ISurveyMetadata";
import * as Utils from "./Utils";

export class SurveyMetadata implements ISurveyMetadata {
	public static make(data: Metadata): ISurveyMetadata {
		try {
			return new SurveyMetadata(data);
		} catch (e) {
			return null;
		}
	}

	private data: Metadata;

	public constructor(data: Metadata) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.contentMetadata) {
			throw new Error("content metadata must not be null");
		}
		if (!Utils.isObject(data.contentMetadata)) {
			throw new Error("content metadata must be of object type");
		}

		this.data = data;
	}

	public getContentMetadata(): object {
		return this.data.contentMetadata;
	}
}

/**
 * Data class for serialization and deserialization. Do not add logic in here.
 */
export class Metadata {
	public contentMetadata: object;
}
