/** Definition of a formatting function.
 * Ex: x => x + " hours"
 * @param value The value to be formatted.
 * @returns A localized and culture-aware string that represents the specified value.
 */
export type FormatHandler = (value: number) => string;

/** Interface that describes a formatter object. */
export interface Formatter {
    format: FormatHandler;
}

/**
 * Interface that describes an arbitrary unit of measurement,
 * such as days, hours, minutes, seconds, kilometers, meters, centimeters and so on.
 *
 * The magnitude of a unit is relative to an arbitrary scale of measurement.
 * For example, a "MinutesAsSecond" would have magnitude 60, while
 * a "MinutesAsMilliseconds" would have magnitude 60000.
 */
export interface Unit extends Formatter {
    readonly magnitude: number;
}

/** Optional parameters for the measurement formatting function */
export interface FormattingOptions {
    /** Formatting function or string used when the measurement being formatted is zero.
     *  By default, we format zero using the first unit in the units parameter. */
    zero?: FormatHandler | string;

    /** Separator to use between the strings of each unit.
     *  By default, a space is used as separator. */
    separator?: string;

    /** Maximum number of units to include in the formatted results. Defaults to all units. */
    maxUnits?: number;

    /** Maximum number of fractional digits (after the decimal point) in the last unit.
     *  Defaults to zero, in which case the decimal point does not show up. Must be non-negative.
     *  The number formatted by the last unit is rounded to this number of digits. */
    maxFractionalDigits?: number;
}

/**
 * Factory that creates a formatting function which formats measurement
 * values acoording to a given set of measurements units and formatting options.
 *
 * Formatting functions can be taylor-made for specific scenarios.
 * For example, one caller might require a formatting function that display time
 * duration as days and hours, while another might want to display hours and minutes.
 * Each can create a formatting function with just the units and options required.
 *
 * The expected usage is for an application to create and export such
 * formatting functions in one or more modules, then invoke the formatting
 * functions with different values thruought the lifetime of the application.
 *
 * @param units
 * A set of units to consider when formatting a value.
 * All units must have magnitudes relative to the same scale of measurement
 * and this scale should be used when passing values to the formatting function.
 * Ex: [hours, minutes, seconds] or [kilometers, meters, centimeters].
 * By default, the first unit in this list dictates how zero is formatted.
 * The formatted value will be based on the descending order of magnitude of these units.
 *
 * @param options
 * A set of options that controls how measurements are formatted.
 *
 * @returns
 * A formatting function that formats measurement values acoording to
 * the given set of measurements units and formatting options.
 * The magnitude of the given units determines the scale of the value being formatted
 * (ex: meters or kilometers, seconds or milliseconds).
 */
export default function createMeasurementFormatter(
    units: Unit[],
    options: FormattingOptions = {}
): FormatHandler {
    // Capture and validate the options used to create the formatting function
    const zero = options.zero || units[0].format;
    const separator = options.separator == void 0 ? ' ' : options.separator;
    const maxUnits = Math.floor(options.maxUnits == void 0 ? Infinity : options.maxUnits);
    if (maxUnits < 1) {
        throw new Error('options.maxUnits');
    }

    const maxFractionalDigits = Math.floor(options.maxFractionalDigits || 0);
    if (maxFractionalDigits < 0) {
        throw new Error('options.maxFractionalDigits');
    }

    const absoluteLastUnitIndex = units.length - 1;
    const tentativeLastUnitIndex = maxUnits - 1;

    // Copy and sort the units array by magniture in descending order
    units = units.slice().sort((x, y) => y.magnitude - x.magnitude);

    // Return the reusable formatting function, so we don't need to
    // reprocess the array and options on each and every call.
    return (measurement: number) => {
        // Special case when measurement is zero.
        // Ex: show 0m instead of 0cm, or 0 minutes instead of 0 seconds.
        if (measurement == 0) {
            return typeof zero === 'string' ? zero : zero(0);
        }

        // Compute and append the string for each unit of measure.
        let formattedValues: string[] = [];
        for (let i = 0; i <= absoluteLastUnitIndex; i++) {
            // True if this is absolutely the last unit in the array.
            // The last unit is mandatory if no other unit contributed to the string.
            let isAbsoluteLastUnit = i == absoluteLastUnitIndex;

            // True if this might be the last unit we add to the formatted string (we might skip it too).
            let isTentativeLastUnit = formattedValues.length == tentativeLastUnitIndex;

            // Scale the current measurement by the magnitude of the current unit
            let unit = units[i];
            let value = measurement / unit.magnitude;

            // Format this unit with a rounded value if it is the absolute last one
            // or if we think it might be the last one, based on maxUnits.
            let useRoundedValue = isAbsoluteLastUnit || (isTentativeLastUnit && value >= 1);

            // Either round the value or floor it, depending if it is the last unit to be added or not.
            if (useRoundedValue) {
                let mult = Math.pow(10, maxFractionalDigits);
                value = Math.round(value * mult) / mult;
            } else {
                value = Math.floor(value);
            }

            // Only append this unit if the value is relevant or
            // if we are at the absolute last unit without anything else.
            let valueIsRelevant = value >= 1;
            let valueIsMandatory = isAbsoluteLastUnit && formattedValues.length == 0;
            if (valueIsRelevant || valueIsMandatory) {
                // Format and store the new string.
                // Break if we reached the desired number of units in the output.
                const formattedValue = unit.format(value);
                if (formattedValues.push(formattedValue) == maxUnits) {
                    break;
                }

                // Remaining units will process the left-overs, if there is any.
                measurement %= unit.magnitude;
                if (measurement == 0) {
                    break;
                }
            }
        }

        // We assume concatenation of formatted strings is ok in all languages
        // This was the case in the previous OwaDateTime functionality.
        return formattedValues.join(separator);
    };
}
