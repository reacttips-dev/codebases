/* Defines the model for a Partner */

class Partner {
  id: string;

  name: string;

  shortName: string;

  squareLogo: string;

  rectangularLogo?: string;

  constructor({ id, name, shortName, squareLogo, rectangularLogo }: Partner) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.squareLogo = squareLogo;
    this.rectangularLogo = rectangularLogo;
  }
}

export default Partner;
