/**
 * RatingControl.ts
 *
 * A module for a rating control.
 */

import { AttributeName, Classes, Tags } from "./UiConstants";
import * as Renderer from "./Renderer";

let starId: string = "obf-star";

let starDefinition: Renderer.IUIAsJson = {
	children: [
		{
			attributes: [
				{ name: AttributeName.Id, value: starId },
				{ name: AttributeName.X, value: "0" },
				{ name: AttributeName.Y, value: "0" },
				{ name: AttributeName.Width, value: "105" },
				{ name: AttributeName.Height, value: "100" },
				{
					name: AttributeName.Points,
					value: "52.5, 80.3 84, 100 76.3, 63 105, 38 67.2, 35 52.5, 0 37.8, 35 0, 38 28.7, 63 20, 100 52.5, 80.3",
				},
			],
			id: starId,
			tag: Tags.Polygon,
		},
	],
	tag: Tags.Defs,
};

let firstStar: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.xlinkHref, value: `#${starId}` }],
	tag: Tags.Use,
};

let secondStar: Renderer.IUIAsJson = {
	attributes: [
		{ name: AttributeName.xlinkHref, value: `#${starId}` },
		{ name: AttributeName.Transform, value: "translate(105 0)" },
	],
	tag: Tags.Use,
};

let thirdStar: Renderer.IUIAsJson = {
	attributes: [
		{ name: AttributeName.xlinkHref, value: `#${starId}` },
		{ name: AttributeName.Transform, value: "translate(210 0)" },
	],
	tag: Tags.Use,
};

let fourthStar: Renderer.IUIAsJson = {
	attributes: [
		{ name: AttributeName.xlinkHref, value: `#${starId}` },
		{ name: AttributeName.Transform, value: "translate(315 0)" },
	],
	tag: Tags.Use,
};

let fifthStar: Renderer.IUIAsJson = {
	attributes: [
		{ name: AttributeName.xlinkHref, value: `#${starId}` },
		{ name: AttributeName.Transform, value: "translate(420 0)" },
	],
	tag: Tags.Use,
};

let emptyStars: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.ViewBox, value: "0 0 525 100" }],
	children: [starDefinition, firstStar, secondStar, thirdStar, fourthStar, fifthStar],
	classes: [Classes.RatingGraphic],
	tag: Tags.Svg,
};

let oneFilledStar: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.ViewBox, value: "0 0 105 100" }],
	children: [starDefinition, firstStar],
	classes: [Classes.RatingGraphic, Classes.RatingGraphicFilled],
	tag: Tags.Svg,
};

let twoFilledStar: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.ViewBox, value: "0 0 210 100" }],
	children: [starDefinition, firstStar, secondStar],
	classes: [Classes.RatingGraphic, Classes.RatingGraphicFilled],
	tag: Tags.Svg,
};

let threeFilledStar: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.ViewBox, value: "0 0 315 100" }],
	children: [starDefinition, firstStar, secondStar, thirdStar],
	classes: [Classes.RatingGraphic, Classes.RatingGraphicFilled],
	tag: Tags.Svg,
};

let fourFilledStar: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.ViewBox, value: "0 0 420 100" }],
	children: [starDefinition, firstStar, secondStar, thirdStar, fourthStar],
	classes: [Classes.RatingGraphic, Classes.RatingGraphicFilled],
	tag: Tags.Svg,
};

let fiveFilledStar: Renderer.IUIAsJson = {
	attributes: [{ name: AttributeName.ViewBox, value: "0 0 525 100" }],
	children: [starDefinition, firstStar, secondStar, thirdStar, fourthStar, fifthStar],
	classes: [Classes.RatingGraphic, Classes.RatingGraphicFilled],
	tag: Tags.Svg,
};

export function generate(id: string): Renderer.IUIAsJson {
	return {
		children: [
			emptyStars,
			{
				attributes: [
					{ name: AttributeName.Type, value: "radio" },
					{ name: AttributeName.Name, value: id },
					{ name: AttributeName.Value, value: "1" },
				],
				tag: Tags.Input,
			},
			oneFilledStar,
			{
				attributes: [
					{ name: AttributeName.Type, value: "radio" },
					{ name: AttributeName.Name, value: id },
					{ name: AttributeName.Value, value: "2" },
				],
				tag: Tags.Input,
			},
			twoFilledStar,
			{
				attributes: [
					{ name: AttributeName.Type, value: "radio" },
					{ name: AttributeName.Name, value: id },
					{ name: AttributeName.Value, value: "3" },
				],
				tag: Tags.Input,
			},
			threeFilledStar,
			{
				attributes: [
					{ name: AttributeName.Type, value: "radio" },
					{ name: AttributeName.Name, value: id },
					{ name: AttributeName.Value, value: "4" },
				],
				tag: Tags.Input,
			},
			fourFilledStar,
			{
				attributes: [
					{ name: AttributeName.Type, value: "radio" },
					{ name: AttributeName.Name, value: id },
					{ name: AttributeName.Value, value: "5" },
				],
				tag: Tags.Input,
			},
			fiveFilledStar,
		],
		classes: [Classes.Rating],
		id: id,
		tag: Tags.Span,
	};
}
