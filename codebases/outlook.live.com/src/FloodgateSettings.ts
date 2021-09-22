/**
 * General floodgate settings
 */
export class FloodgateSettings {
	/**
	 * Convert to Json
	 */
	public static toJson(object: FloodgateSettings): string {
		return JSON.stringify(object);
	}

	/**
	 * Load from Json
	 */
	public static fromJson(json: string): FloodgateSettings {
		return JSON.parse(json);
	}
}
