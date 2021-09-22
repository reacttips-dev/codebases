// Temporary hardcoded stores list for initial implementation until actual
// store locater (api data) can be implemented.
export const STORES: Record<string, Record<string, Record<string, string>>> = {
    Alberta: {
        Calgary: {
            "Westhills Towne Centre": "12356455",
            "Beacon Hill Centre": "12356451",
            "Northland Village Shopping Centre": "12356449",
            "Shawnessy Towne Centre": "12356433",
            "Deerfoot Meadows Shopping Centre": "12356408",
            "Sunridge Power Centre": "12356406",
            "Best Buy Mobile - Market Mall": "12356350",
            "Best Buy Mobile - Southcentre Mall": "12356330",
            "Best Buy Mobile - Marlborough Mall": "12356312",
            "Best Buy Mobile - Sunridge Mall": "12356308",
            "Best Buy Mobile - Chinook Centre": "12356307",
            "Hanson Square": "12356303",
        },
        Edmonton: {
            "Skyview Power Centre": "12356412",
            "Clareview Towne Centre": "12356360",
            "Oliver Gates Shopping Centre": "12356359",
            "Best Buy Mobile - West Edmonton Mall": "12356348",
            "Best Buy Mobile - Londonderry Mall": "12356316",
            "Riocan Meadows": "12356297",
            "South Edmonton Common": "12356279",
            "Edmonton West": "12356278",
        },
        "Grande Prairie": {
            "Grande Prairie Power Centre": "12356296",
        },
        Lethbridge: {
            "Lethbridge SmartCentre": "12356456",
        },
        Lloydminster: {
            "Lloydminster Power Centre": "12356453",
        },
        "Medicine Hat": {
            "Medicine Hat Mall": "12356357",
        },
        "Red Deer": {
            "Southpoint Common": "12356420",
            "Best Buy Mobile - Parkland Mall": "12356329",
        },
    },
    "British Columbia": {
        Abbotsford: {
            "Sevenoaks Shopping Centre": "12356300",
        },
        Burnaby: {
            "Station Square": "12356446",
        },
        Chilliwack: {
            "Centre Point Plaza": "12356428",
        },
        Coquitlam: {
            "Coquitlam Centre": "12356418",
        },
        Courtenay: {
            "First Pro Courtenay": "12356431",
        },
        Duncan: {
            "Cowichan Commons": "12356432",
        },
        Kamloops: {
            "Aberdeen Mall": "12356356",
            "Best Buy Mobile - Aberdeen Mall": "12356317",
        },
        Kelowna: {
            "Orchard Park": "12356461",
        },
        Langley: {
            "First Pro Langley": "12356274",
        },
        Nanaimo: {
            "Country Club Shopping Centre": "12356353",
            "Best Buy Mobile - Woodgrove Centre": "12356340",
        },
        "Prince George": {
            "Brookwood Plaza": "12356425",
        },
        Richmond: {
            "Lansdowne Centre": "12356285",
        },
        Surrey: {
            "Central City": "12356436",
            "Grandview Corners": "12356426",
            "Scott Road Crossing": "12356370",
        },
        Vancouver: {
            Robson: "12356430",
            Cambie: "12356413",
            "Best Buy Mobile - Pacific Centre": "12356342",
            "South Vancouver": "12356301",
        },
        Vernon: {
            "First Pro Vernon": "12356429",
            "Best Buy Mobile - Village Green Mall": "12356331",
        },
        Victoria: {
            "Gateway Station": "12356427",
            Uptown: "12356354",
            "Best Buy Mobile - Mayfair Shopping Centre": "12356339",
        },
        "West Vancouver": {
            "Park Royal Shopping Centre": "12356355",
        },
    },
    Manitoba: {
        Brandon: {
            "Corral Centre": "12356435",
        },
        Winnipeg: {
            "Crossroad Station Shopping Centre": "12356409",
            "St. James Station Centre": "12356407",
            "Pembina Crossing": "12356358",
        },
    },
    "New Brunswick": {
        Fredericton: {
            "Fredericton Mall": "12356396",
        },
        Moncton: {
            Moncton: "12356366",
        },
        "Saint John": {
            "First Pro Saint John": "12356393",
        },
    },
    "Newfoundland and Labrador": {
        "St. John's": {
            "St. John's": "12356459",
        },
    },
    "Nova Scotia": {
        Dartmouth: {
            "Dartmouth Crossing": "12356290",
        },
        Halifax: {
            Halifax: "12356460",
        },
        Sydney: {
            "Mayflower Mall": "12356397",
            "Best Buy Mobile - Mayflower Mall": "12356338",
        },
    },
    Ontario: {
        Ajax: {
            "RioCan Harwood Centre": "12356462",
        },
        Ancaster: {
            "Meadowlands Centre": "12356292",
        },
        Aurora: {
            "SmartCentres Aurora East": "12356295",
        },
        Barrie: {
            "Park Place": "12356414",
        },
        Belleville: {
            "Quinte Crossroads": "12356298",
        },
        Brampton: {
            "Bramalea Centre Mall": "12356415",
        },
        Brantford: {
            "Parkway Mall": "12356384",
        },
        Burlington: {
            "Best Buy Mobile - Burlington Mall": "12356309",
            Burlington: "12356286",
        },
        Cambridge: {
            "SmartCentres Cambridge": "12356302",
        },
        Chatham: {
            "Pioneer Square": "12356387",
        },
        Cornwall: {
            "Brookdale Square": "12356400",
        },
        "East Gwillimbury": {
            Newmarket: "12356410",
        },
        "East York": {
            "First Pro Leaside": "12356276",
        },
        Etobicoke: {
            "SmartCentres Etobicoke": "12356283",
        },
        Guelph: {
            Guelph: "12356368",
        },
        Hamilton: {
            "Heritage Greene Town Centre": "12356294",
        },
        Kanata: {
            Kanata: "12356448",
        },
        Kingston: {
            "Riocan Centre Kingston": "12356438",
        },
        Kitchener: {
            Kitchener: "12356280",
        },
        London: {
            "North London": "12356291",
            London: "12356281",
        },
        Markham: {
            "Markville Shopping Centre": "12356282",
        },
        Milton: {
            "Milton Plaza": "12356299",
        },
        Mississauga: {
            "Heartland Town Centre": "12356463",
            "Winston Churchill": "12356386",
            "Best Buy Mobile - Erin Mills Town Centre": "12356344",
        },
        Nepean: {
            "Viewmount Centre": "12356465",
            "Barrhaven Town Centre": "12356401",
        },
        "North Bay": {
            "Northgate Shopping Centre": "12356398",
        },
        "North York": {},
        Oakville: {
            "Winston Park Retail Centre": "12356275",
        },
        Orangeville: {
            "Fairgrounds Shopping Centre": "12356382",
        },
        Orillia: {
            "Westridge Place": "12356389",
        },
        Orleans: {
            Orleans: "12356390",
        },
        Oshawa: {
            "First Pro Oshawa": "12356381",
        },
        Ottawa: {
            "Ottawa East": "12356284",
        },
        Peterborough: {
            Peterborough: "12356385",
        },
        Pickering: {},
        "Richmond Hill": {
            "Bayview Glen": "12356417",
        },
        Sarnia: {
            Sarnia: "12356372",
        },
        "Sault Ste. Marie": {
            "Sault Ste. Marie": "12356388",
        },
        Scarborough: {
            "Eglinton Corners": "12356439",
            "Scarborough Town Centre": "12356287",
        },
        "St. Catharines": {
            "First Pro Garden City": "12356411",
        },
        Sudbury: {
            "Silver Hills Centre": "12356454",
        },
        "Thunder Bay": {
            "Memorial Plaza": "12356365",
        },
        Timmins: {
            Timmins: "12356399",
        },
        Toronto: {
            "First Pro Downsview": "12356464",
            "Toronto Eaton Centre": "12356450",
            "Keele & St. Clair": "12356383",
            "Yonge & Eglinton": "12356364",
            "First Pro North York": "12356363",
            "Best Buy Mobile - Yorkdale Mall": "12356328",
        },
        Vaughan: {},
        Waterloo: {
            "Kingspoint Centre": "12356371",
        },
        Whitby: {
            Whitby: "12356419",
        },
        Windsor: {
            "Walker Road Shopping Centre": "12356288",
        },
        Woodbridge: {
            "First Pro Piazza Del Sole": "12356277",
        },
    },
    "Prince Edward Island": {
        Charlottetown: {
            "First Pro Charlottetown": "12356392",
        },
    },
    Quebec: {
        Anjou: {
            Anjou: "12356369",
        },
        Brossard: {
            "Quartier Dix30": "12356442",
        },
        Chicoutimi: {
            "Place du Royaume": "12356403",
        },
        Drummondville: {
            "Mega Centre Drummondville": "12356423",
        },
        Gatineau: {
            "Les Galeries Gatineau": "12356445",
        },
        Granby: {
            "Les Galeries Granby": "12356405",
        },
        "Greenfield Park": {
            "Greenfield Park": "12356367",
        },
        LaSalle: {
            "Carrefour Angrignon": "12356440",
        },
        Laval: {
            "Centre Laval": "12356441",
        },
        Mascouche: {
            "First Pro Mascouche": "12356394",
        },
        Montreal: {
            "Marche Central": "12356437",
            Centreville: "12356402",
            "Best Buy Mobile - Montreal Eaton Centre": "12356335",
            "Best Buy Mobile - Place Versailles": "12356334",
        },
        "Pointe Claire": {
            "Fairview Pointe-Claire Shopping Centre": "12356443",
        },
        Quebec: {
            "Les Galeries de la Capitale": "12356458",
            "Place Laurier": "12356457",
        },
        Rosemere: {
            "Place Rosemere": "12356289",
        },
        "Saint-Bruno": {
            "Les Promenades St-Bruno": "12356444",
        },
        "Saint-Jean-sur-Richelieu": {
            "Carrefour Richelieu": "12356424",
        },
        Sherbrooke: {
            "Carrefour de L'Estrie": "12356391",
        },
        "St. Jerome": {
            "SmartCentres St. Jerome": "12356404",
        },
        "Trois-RiviËres": {
            "Carrefour Trois-RiviËres-Ouest": "12356395",
        },
        "Vaudreuil-Dorion": {
            "Vaudreuil-Dorion": "12356421",
        },
    },
    Saskatchewan: {
        "Prince Albert": {
            "Cornerstone Prince Albert": "12356434",
        },
        Regina: {
            "Regina East Shopping Centre": "12356416",
        },
        Saskatoon: {
            "The Centre At Circle and Eighth": "12356447",
            "Preston Crossing Shopping Centre": "12356361",
        },
    },
};

export default STORES;
