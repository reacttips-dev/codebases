import {blue, bluegrey, midnight, mint, orange, red, pink, purple, brown, carbon, green, sky, teal, torquoise, yellow, indigo} from "./colorsPalettes";
import {ColorsGroup} from "./ColorsGroup";

export const brand = new ColorsGroup('brand', {
    'midnight 500': midnight["500"],
    'bluegrey 100': bluegrey["100"],
    'blue 400': blue["400"],
    'orange 400': orange["400"],
    'mint 400': mint["400"],
})

export const a1 = new ColorsGroup('a1', {
    'blue 400': blue["400"],
})

export const a2 = new ColorsGroup('a2', {
    'blue 100': blue["100"],
    'blue 200': blue["200"],
    'sky 300': sky["300"],
    'blue 400': blue["400"],
    'blue 500': blue["500"],
})

export const b1 = new ColorsGroup('b1', {
    'blue 400': blue["400"],
    'sky 300': sky["300"],
})

export const b2 = new ColorsGroup('b2', {
    'midnight 400': midnight["400"],
    'midnight 300': midnight["300"],
})

export const b3 = new ColorsGroup('b3', {
    'midnight 50': midnight["50"],
})

export const c = new ColorsGroup('c', {
    'bluegrey 600': bluegrey["600"],
    'torquoise 300': torquoise["300"],
    'orange 300': orange["300"],
    'red 400': red["400"],
    'yellow 400': yellow["400"],
    'teal 400': teal["400"],
    'teal 600': teal["600"],
    'red 300': red["300"],
    'purple 400': purple["400"],
    'purple 500': purple["500"],
})

export const verdics = new ColorsGroup('verdics', {
    'red s100': red["s100"],
    'green s100': green["s100"],
})
