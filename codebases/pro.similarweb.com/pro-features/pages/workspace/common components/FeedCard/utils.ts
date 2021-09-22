import * as numeral from "numeral";
export const formatChange = (change) =>
    numeral(Math.abs(change) / 100)
        .format("0[.][00]a%")
        .toUpperCase();
