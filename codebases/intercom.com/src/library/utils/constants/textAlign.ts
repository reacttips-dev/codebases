export enum TextAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

export function getTextAlignByKey(textAlignStr: keyof typeof TextAlign): TextAlign {
  return TextAlign[textAlignStr]
}
