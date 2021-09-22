/**
 * ChoiceGroupControl.ts
 *
 * A module for rendering a choice group.
 */

import { AttributeName, AttributeValue, Classes, IDs, Tags } from "./UiConstants";
import * as Renderer from "./Renderer";
import * as Utils from "../Utils";

const { isNOU } = Utils;

export function generateRadioGroup(id: string, question: string, choices: [number, string][]): Renderer.IUIAsJson {
	let fieldSet: Renderer.IUIAsJson = {
			children: [],
			tag: Tags.FieldSet,
		};

	if (!isNOU(question)) {
		Array.prototype.push.apply(
			fieldSet.children,
			[{
				classes: [Classes.FontSubText],
				id: IDs.TFormRatingQuestion,
				innerText: question,
				tag: Tags.Legend,
				// Legacy Edge need aria-label for accessibility
				attributes: [{name: AttributeName.AriaLabel, value: question }],
			}]
		);
	}

	for (let choice of choices) {
		Array.prototype.push.apply(fieldSet.children, generateRadioButton(choice[0].toString(), choice[1], id));
	}

	return {
		children: [fieldSet],
		classes: [Classes.ChoiceGroup],
		id: id,
	};
}

function generateRadioButton(value: string, label: string, id: string): Renderer.IUIAsJson[] {
	return [
		{
			attributes: [
				{ name: AttributeName.Type, value: AttributeValue.Radio },
				{ name: AttributeName.Value, value: value },
				{ name: AttributeName.Name, value: id },
			],
			id: value,
			tag: Tags.Input,
		},
		{
			attributes: [{ name: AttributeName.For, value: value }],
			children: [
				{
					children: [{ tag: Tags.Span }],
					classes: [Classes.ChoiceGroupIcon],
					tag: Tags.Span,
				},
				{
					classes: ["obf-ChoiceGroupLabel"],
					innerHTML: label,
					tag: Tags.Span,
				},
			],
			classes: [Classes.FontSubText],
			tag: Tags.Label,
		},
	];
}
