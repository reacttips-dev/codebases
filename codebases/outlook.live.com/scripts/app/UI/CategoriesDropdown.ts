/**
 * CategoriesDropdown.ts
 *
 * A module to render the categories dropdown
 */

import * as UIStrings from "./../UIStrings/UIStrings";
import { Tags }  from "./UiConstants";
import { IUIAsJson } from "./Renderer";

/**
 * Generate custom categories drop-down list. The list will contain just the
 * placeholder string if customCategories contains no value.
 * @param customCategories category values
 */
export function generate(customCategories: string[]): IUIAsJson[] {
	let categories = customCategories ? customCategories : [];

	let result: IUIAsJson[] = [{
		attributes: [{ name: "selected", value: "true" }],
		innerText: UIStrings.getUIStrings().Form.CategoryPlaceholder,
		tag: Tags.Option,
	}];

	for (let category of categories) {
		result.push({
			innerText: category,
			tag: Tags.Option,
		});
	}

	return result;
}
