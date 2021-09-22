import getLocalFieldsOrder from './getLocalFieldsOrder';
import type PersonaPostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';
import { isNullOrWhiteSpace } from 'owa-string-utils';

const CommaSeparator = ', ';

/**
 * Returns a string representaion of the postal address.
 * @param field1, field2, field3, field4, field5: the fields in the postal address. theu can be null or empty.
 * @param divider: the separator between the address fiends
 */
function computeAddress(
    field1: string,
    field2: string,
    field3: string,
    field4: string,
    field5: string,
    divider: string
): string[] {
    let address: string[] = [];

    // Field1 is in the first line
    if (!isNullOrWhiteSpace(field1)) {
        address[address.length] = field1;
    }

    // Field2, Field3 and Field4 are all in the second line
    let row2 = '';

    if (!isNullOrWhiteSpace(field2)) {
        row2 = field2;
    }

    if (!isNullOrWhiteSpace(field3)) {
        if (isNullOrWhiteSpace(row2)) {
            row2 = field3;
        } else {
            row2 = row2 + divider + field3;
        }
    }

    // (n-1)th field
    if (!isNullOrWhiteSpace(field4)) {
        if (isNullOrWhiteSpace(row2)) {
            row2 = field4;
        } else {
            row2 = row2 + divider + field4;
        }
    }

    if (!isNullOrWhiteSpace(row2)) {
        address[address.length] = row2;
    }

    // Last Field
    if (!isNullOrWhiteSpace(field5)) {
        address[address.length] = field5;
    }

    return address;
}

/**
 * Gets the display text from the location postal address detail
 * @param postalAddress: the location postal address
 */
export function getLocalizedAddressFromDetails(
    street: string,
    city: string,
    postalCode: string,
    state: string,
    country: string
): string {
    let displayAddress = '';
    let fieldsOrder = getLocalFieldsOrder();
    let address: string[] = [];
    let divider = CommaSeparator;

    switch (fieldsOrder) {
        case 'a_c_pc_pr_ctry':
            address = computeAddress(street, city, postalCode, state, country, divider);
            break;

        case 'a_c_pr_ctry_pc':
            address = computeAddress(street, city, state, country, postalCode, divider);
            break;

        case 'a_c_pr_pc_ctry':
            address = computeAddress(street, city, state, postalCode, country, divider);
            break;

        case 'a_ctry_c_pr_pc':
            address = computeAddress(street, country, city, state, postalCode, divider);
            break;

        case 'a_pc_c_pr_ctry':
            address = computeAddress(street, postalCode, city, state, country, divider);
            break;

        case 'a_pc_pr_c_ctry':
            address = computeAddress(street, postalCode, state, city, country, divider);
            break;

        case 'c_a_pc_pr_ctry':
            address = computeAddress(city, street, postalCode, state, country, divider);
            break;

        case 'ctry_pc_pr_c_a':
            address = computeAddress(country, postalCode, state, city, street, divider);
            break;

        case 'ctry_pr_c_pc_a':
            address = computeAddress(country, state, city, postalCode, street, divider);
            break;

        case 'pc_ctry_pr_c_a':
            address = computeAddress(postalCode, country, state, city, street, divider);
            break;

        case 'pc_pr_c_a_ctry':
            address = computeAddress(postalCode, state, city, street, country, divider);
            break;
    }

    displayAddress = address.join(divider);

    return displayAddress;
}

/**
 * Gets the display text from the location postal address
 * @param postalAddress: the location postal address
 */
export function getLocalizedAddress(postalAddress: PersonaPostalAddress): string {
    if (postalAddress) {
        return getLocalizedAddressFromDetails(
            postalAddress.Street,
            postalAddress.City,
            postalAddress.PostalCode,
            postalAddress.State,
            postalAddress.Country
        );
    }

    return '';
}
