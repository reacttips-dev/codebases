import { LabelColors } from 'Types/types';

type NullableString = undefined | null | string;
type NullableColor = undefined | null | LabelColors;

// Broken conditional type to narrow return type of function with a union-typed argument:
// https://github.com/microsoft/TypeScript/issues/24929
export class LabelColorEnum {
	public static fromEnumToJS(enumValue: NullableString): LabelColors {
		if (enumValue == null) {
			// GraphQL returned unexpected value for the color - let's fallback to gray color
			return LabelColors.Gray;
		}

		return enumValue.toLowerCase() as LabelColors;
	}

	public static fromJSToEnum(jsValue: NullableColor): NullableString {
		if (jsValue == null) {
			return jsValue;
		}

		return jsValue.toUpperCase();
	}
}
