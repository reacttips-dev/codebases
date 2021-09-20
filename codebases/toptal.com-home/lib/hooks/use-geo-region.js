import {
    useState,
    useEffect
} from 'react'

import {
    isFinished
} from '~/lib/fetch-status'

import {
    useGeoData
} from './use-geo-data'

const regionMap = [{
        region: 'africa',
        countries: [
            'Angola',
            'Benin',
            'Botswana',
            'Burkina Faso',
            'Burundi',
            'Cameroon',
            'Cape Verde',
            'Central African Republic',
            'Chad',
            'Congo',
            'Congo, The Democratic Republic of the',
            "Côte D'Ivoire",
            'Equatorial Guinea',
            'Eritrea',
            'Ethiopia',
            'Gabon',
            'Gambia',
            'Ghana',
            'Guinea',
            'Guinea-Bissau',
            'Kenya',
            'Lesotho',
            'Liberia',
            'Madagascar',
            'Malawi',
            'Mali',
            'Mauritius',
            'Mayotte',
            'Mozambique',
            'Namibia',
            'Niger',
            'Nigeria',
            'Rwanda',
            'Saint Helena',
            'Sao Tome and Principe',
            'Senegal',
            'Seychelles',
            'Sierra Leone',
            'South Africa',
            'South Sudan',
            'Swaziland',
            'Tanzania, United Republic of',
            'Togo',
            'Uganda',
            'Western Sahara',
            'Zambia',
            'Zimbabwe',
            'Réunion',
            'Democratic Republic of the Congo',
            'Republic of the Congo',
            'Libyan Arab Jamahiriya',
            'Tanzania'
        ]
    },
    {
        region: 'asia_and_pacific',
        countries: [
            'Afghanistan',
            'American Samoa',
            'Antarctica',
            'Asia/Pacific Region',
            'Azerbaijan',
            'Bangladesh',
            'Bhutan',
            'British Indian Ocean Territory',
            'Brunei Darussalam',
            'Cambodia',
            'China',
            'Christmas Island',
            'Cocos (Keeling) Islands',
            'Cook Islands',
            'Fiji',
            'French Polynesia',
            'French Southern Territories',
            'Guam',
            'Heard Island and McDonald Islands',
            'Hong Kong',
            'India',
            'Indonesia',
            'Japan',
            'Kazakhstan',
            'Kiribati',
            'Kyrgyzstan',
            "Lao People's Democratic Republic",
            'Macau',
            'Malaysia',
            'Maldives',
            'Marshall Islands',
            'Micronesia, Federated States of',
            'Mongolia',
            'Myanmar',
            'Nauru',
            'Nepal',
            'New Caledonia',
            'Niue',
            'Norfolk Island',
            'North Korea',
            'Northern Mariana Islands',
            'Pakistan',
            'Palau',
            'Papua New Guinea',
            'Philippines',
            'Pitcairn Islands',
            'Reunion',
            'Samoa',
            'Singapore',
            'Solomon Islands',
            'South Korea',
            'Sri Lanka',
            'Syrian Arab Republic',
            'Taiwan',
            'Tajikistan',
            'Thailand',
            'Timor-Leste',
            'Tokelau',
            'Tonga',
            'Turkmenistan',
            'Tuvalu',
            'United States Minor Outlying Islands',
            'Uzbekistan',
            'Vanuatu',
            'Vietnam',
            'Wallis and Futuna',
            'Macao',
            'Brunei',
            'Laos',
            'Pitcairn'
        ]
    },
    {
        region: 'australia_and_new_zealand',
        countries: ['Australia', 'New Zealand']
    },
    {
        region: 'british_isles',
        countries: ['Ireland', 'Isle of Man', 'United Kingdom']
    },
    {
        region: 'eastern_europe',
        countries: [
            'Albania',
            'Belarus',
            'Bosnia and Herzegovina',
            'Bulgaria',
            'Croatia',
            'Czech Republic',
            'Estonia',
            'Georgia',
            'Hungary',
            'Latvia',
            'Lithuania',
            'Macedonia',
            'Moldova, Republic of',
            'Montenegro',
            'Poland',
            'Romania',
            'Serbia',
            'Slovakia',
            'Slovenia',
            'Ukraine',
            'Moldova',
            'Kosovo',
            'Russian Federation',
            'Russia'
        ]
    },
    {
        region: 'latin_america',
        countries: [
            'Anguilla',
            'Antigua and Barbuda',
            'Argentina',
            'Aruba',
            'Bahamas',
            'Barbados',
            'Belize',
            'Bolivia',
            'Bouvet Island',
            'Brazil',
            'Cayman Islands',
            'Chile',
            'Colombia',
            'Costa Rica',
            'Cuba',
            'Dominica',
            'Dominican Republic',
            'Ecuador',
            'El Salvador',
            'Falkland Islands (Malvinas)',
            'French Guiana',
            'Grenada',
            'Guadeloupe',
            'Guatemala',
            'Guyana',
            'Haiti',
            'Honduras',
            'Jamaica',
            'Martinique',
            'Mexico',
            'Montserrat',
            'Netherlands Antilles',
            'Nicaragua',
            'Panama',
            'Paraguay',
            'Peru',
            'Puerto Rico',
            'Saint Barthelemy',
            'Saint Kitts and Nevis',
            'Saint Lucia',
            'Saint Martin',
            'Saint Vincent and the Grenadines',
            'South Georgia and the South Sandwich Islands',
            'Suriname',
            'Trinidad and Tobago',
            'Turks and Caicos Islands',
            'Uruguay',
            'Venezuela',
            'Virgin Islands, British',
            'Virgin Islands, U.S.',
            'Saint Martin (French Part)',
            'Saint Barthélemy',
            'Bonaire, Sint Eustatius and Saba',
            'Curaçao',
            'Sint Maarten (Dutch Part)'
        ]
    },
    {
        region: 'middle_east',
        countries: [
            'Algeria',
            'Bahrain',
            'Comoros',
            'Djibouti',
            'Mauritania',
            'Morocco',
            'Palestinian Territory',
            'Somalia',
            'Sudan',
            'Tunisia',
            'Palestine',
            'Israel',
            'Egypt',
            'Iran, Islamic Republic of',
            'Iraq',
            'Jordan',
            'Kuwait',
            'Lebanon',
            'Libya',
            'Oman',
            'Qatar',
            'Saudi Arabia',
            'United Arab Emirates',
            'Yemen',
            'Iran',
            'Syria'
        ]
    },
    {
        region: 'north_america',
        countries: [
            'Bermuda',
            'Canada',
            'Saint Pierre and Miquelon',
            'United States'
        ]
    },
    {
        region: 'northern_europe',
        countries: [
            'Aland Islands',
            'Denmark',
            'Faroe Islands',
            'Finland',
            'Greenland',
            'Iceland',
            'Norway',
            'Svalbard and Jan Mayen',
            'Sweden',
            'Åland Islands'
        ]
    },
    {
        region: 'southern_europe',
        countries: [
            'Armenia',
            'Cyprus',
            'Gibraltar',
            'Greece',
            'Holy See (Vatican City State)',
            'Italy',
            'Malta',
            'Monaco',
            'Portugal',
            'San Marino',
            'Spain',
            'Turkey'
        ]
    },
    {
        region: 'western_europe',
        countries: [
            'Andorra',
            'Austria',
            'Belgium',
            'France',
            'France, Metropolitan',
            'Germany',
            'Guernsey',
            'Jersey',
            'Liechtenstein',
            'Luxembourg',
            'Netherlands',
            'Switzerland'
        ]
    }
]
export const DEFAULT_REGION = 'global'

export function useGeoRegion(url) {
    const [region, setRegion] = useState(null)
    const [geoData, geoDataFetchStatus] = useGeoData(url)

    useEffect(() => {
        if (!isFinished(geoDataFetchStatus)) {
            return
        }
        let newRegion = DEFAULT_REGION
        if (geoData ? .country) {
            regionMap.some(group => {
                if (group.countries.includes(geoData.country)) {
                    newRegion = group.region
                    return true
                }
            })
        }
        setRegion(newRegion)
    }, [setRegion, geoData, geoDataFetchStatus])

    return [region, geoDataFetchStatus]
}