//////////////////////////////////////////////// PLEASE READ //////////////////////////////////////
// Do not call this function directly, instead use colorCodeColorValueMap from category store /////
///////////////////////////////////////////////////////////////////////////////////////////////////

import CategoryColor from '../schema/CategoryColor';

export default function getColorCodeColorValueMap() {
    let colorCodeColorValueMap = {
        [CategoryColor.None]: {
            primaryColor: '#CCCCCC',
            secondaryColor: '#A6A6A6',
            iconColor: '#000000',
            textColor: '#000000',
        },
        [CategoryColor.Red]: {
            primaryColor: '#fce9ea',
            secondaryColor: '#F1919A',
            iconColor: '#E74856',
            textColor: '#D01B2A',
        },

        [CategoryColor.Orange]: {
            primaryColor: '#fff1e0',
            secondaryColor: '#ffba66',
            iconColor: '#FF8C00',
            textColor: '#A35A00',
        },

        [CategoryColor.Peach]: {
            primaryColor: '#fff5e8',
            secondaryColor: '#ffcd8f',
            iconColor: '#FFAB45',
            textColor: '#A35A00',
        },

        [CategoryColor.YellowLight]: {
            primaryColor: '#fffde0',
            secondaryColor: '#fff766',
            iconColor: '#FFF100',
            textColor: '#7A7400',
        },

        [CategoryColor.GreenLight]: {
            primaryColor: '#e9f9e8',
            secondaryColor: '#91e38d',
            iconColor: '#47D041',
            textColor: '#257E20',
        },

        [CategoryColor.TealLight]: {
            primaryColor: '#e6f8f9',
            secondaryColor: '#83dde0',
            iconColor: '#30C6CC',
            textColor: '#1D797C',
        },

        [CategoryColor.Olive]: {
            primaryColor: '#EEF5E4',
            secondaryColor: '#abcc7c',
            iconColor: '#73AA24',
            textColor: '#527A1A',
        },

        [CategoryColor.BlueSky]: {
            primaryColor: '#e0f7fd',
            secondaryColor: '#66d7f7',
            iconColor: '#00BCF2',
            textColor: '#007899',
        },

        [CategoryColor.PurpleLight]: {
            primaryColor: '#f0ecf6',
            secondaryColor: '#b7a2d4',
            iconColor: '#8764B8',
            textColor: '#7D57B2',
        },

        [CategoryColor.Pink]: {
            primaryColor: '#fef2f7',
            secondaryColor: '#f8bfd9',
            iconColor: '#F495BF',
            textColor: '#D8186E',
        },

        [CategoryColor.SteelLight]: {
            primaryColor: '#f3f5f6',
            secondaryColor: '#c6ced1',
            iconColor: '#A0AEB2',
            textColor: '#5E7373',
        },

        [CategoryColor.SteelGrey]: {
            primaryColor: '#D0E0E2',
            secondaryColor: '#6693a0',
            iconColor: '#004B60',
            textColor: '#004B60',
        },

        [CategoryColor.GreyLight]: {
            primaryColor: '#f6f5f5',
            secondaryColor: '#d0cecd',
            iconColor: '#B1ADAB',
            textColor: '#776E6E',
        },

        [CategoryColor.GreyDark]: {
            primaryColor: '#D4D4D4',
            secondaryColor: '#9e9c9b',
            iconColor: '#5D5A58',
            textColor: '#5D5A58',
        },

        [CategoryColor.Black]: {
            primaryColor: '#969696',
            secondaryColor: '#666666',
            iconColor: '#000000',
            textColor: '#000000',
        },

        [CategoryColor.RedDark]: {
            primaryColor: '#C09BA4',
            secondaryColor: '#ac6d77',
            iconColor: '#750B1C',
            textColor: '#750B1C',
        },

        [CategoryColor.OrangeDark]: {
            primaryColor: '#f9eae2',
            secondaryColor: '#df9670',
            iconColor: '#CA5010',
            textColor: '#B3480F',
        },

        [CategoryColor.BrownMedium]: {
            primaryColor: '#f5ece2',
            secondaryColor: '#cda16e',
            iconColor: '#AB620D',
            textColor: '#9D590B',
        },

        [CategoryColor.YellowDark]: {
            primaryColor: '#f7f3e0',
            secondaryColor: '#dac466',
            iconColor: '#C19C00',
            textColor: '#856A00',
        },

        [CategoryColor.GreenDark]: {
            primaryColor: '#C8DACC',
            secondaryColor: '#669377',
            iconColor: '#004B1C',
            textColor: '#004B1C',
        },

        [CategoryColor.TealDark]: {
            primaryColor: '#CEDCDE',
            secondaryColor: '#669396',
            iconColor: '#004B50',
            textColor: '#004B50',
        },

        [CategoryColor.OliveDark]: {
            primaryColor: '#C3DAC3',
            secondaryColor: '#6da66d',
            iconColor: '#0B6A0B',
            textColor: '#0b6a0b',
        },

        [CategoryColor.BlueDark]: {
            primaryColor: '#A6ACC4',
            secondaryColor: '#667996',
            iconColor: '#002050',
            textColor: '#002050',
        },

        [CategoryColor.PurpleDark]: {
            primaryColor: '#B5ACC8',
            secondaryColor: '#84729c',
            iconColor: '#32145A',
            textColor: '#32145A',
        },

        [CategoryColor.MagentaDark]: {
            primaryColor: '#D1B8D1',
            secondaryColor: '#9d669d',
            iconColor: '#5C005C',
            textColor: '#5C005C',
        },
    };

    return colorCodeColorValueMap;
}
