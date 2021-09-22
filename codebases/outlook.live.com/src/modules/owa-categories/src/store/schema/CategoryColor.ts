export interface CategoryColorValue {
    primaryColor: string;
    secondaryColor: string;
    iconColor: string;
    textColor: string;
}

enum CategoryColor {
    None = -1,
    Red = 0,
    Orange = 1,
    Peach = 2,
    YellowLight = 3,
    GreenLight = 4,
    TealLight = 5,
    Olive = 6,
    BlueSky = 7,
    PurpleLight = 8,
    Pink = 9,
    SteelLight = 10,
    SteelGrey = 11,
    GreyLight = 12,
    GreyDark = 13,
    Black = 14,
    RedDark = 15,
    OrangeDark = 16,
    BrownMedium = 17,
    YellowDark = 18,
    GreenDark = 19,
    TealDark = 20,
    OliveDark = 21,
    BlueDark = 22,
    PurpleDark = 23,
    MagentaDark = 24,
}

export default CategoryColor;
