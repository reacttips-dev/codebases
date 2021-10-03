export default class VariableFont {
  constructor(openTypeFont) {
    this.openTypeFont = openTypeFont;
    this.ascender = 0;
    this.descender = 0;
    this.encoding = {};
    this.glyphNames = {};
    this.glyphs = {};
    this.kerningPairs = {};
    this.numGlyphs = 0;
    this.numberOfHMetrics = 0;
    this.outlinesFormat = "truetype";
    this.substitution = {};
    this.unitsPerEm = 0;
    this.names = {};
    this.url = "";
    Object.assign(this, openTypeFont);
    this.prototype = openTypeFont;
    if (this.tables) {
      var fvar = this.tables["fvar"];
      if (fvar && fvar.axes && fvar.axes.length > 0) {
        // eslint-disable-next-line no-unused-vars
        var sortedInstances = fvar.instances.sort(function (a, b) {
          var condition = 0;
          var tags = Object.keys(a.coordinates);
          var i = 0;
          while (condition === 0 && i < tags.length) {
            condition =
              a.coordinates[tags[i]] > b.coordinates[tags[i]]
                ? 1
                : b.coordinates[tags[i]] > a.coordinates[tags[i]]
                ? -1
                : 0;
            i++;
          }
          return condition;
        });
      }
      if (this.names.fontFamily == null) {
        this.names.fontFamily = this.names.preferredFamily;
      }
    }
  }

  getFvarTable = () => {
    return this.tables["fvar"];
  };

  getTable = (tableName) => {
    return this.tables[tableName];
  };

  getFontVariant = () => {
    let os2Table = this.getTable("os2");
    if (!os2Table) {
      return;
    }

    if (
      this.isFontItalic() &&
      this.isFontWeightRegular(os2Table?.usWeightClass)
    ) {
      return `italic`;
    }

    if (this.isFontItalic()) {
      return `${os2Table?.usWeightClass}italic`;
    }

    if (this.isFontWeightRegular(os2Table?.usWeightClass)) {
      return `regular`;
    }

    return `${os2Table?.usWeightClass}`;
  };

  /**
   * Get Axes info. from fvar table.
   */
  getAxes = () => {
    var fvar = this.getFvarTable();
    if (fvar) {
      return fvar.axes;
    }
    return null;
  };
  /**
   * Get number of axes in fvar table.
   */
  getAxesCount = () => {
    var fvar = this.getFvarTable();
    if (fvar) {
      if (fvar.axes && fvar.axes.length > 0) {
        return fvar.axes.length;
      }
    }
    return 0;
  };
  /**
   * Get axis name string from fvar table.
   */
  getAxis = (i) => {
    var fvar = this.getFvarTable();
    if (fvar) {
      return fvar.axes[i];
    }
    return null;
  };
  /**
   * Get axis name string from fvar table.
   */
  getAxisName = (i) => {
    var fvar = this.getFvarTable();
    if (fvar) {
      return fvar.axes[i].name.en;
    }
    return null;
  };
  /**
   * Get instances from fvar table.
   */
  getInstances = () => {
    var fvar = this.getFvarTable();
    if (fvar) {
      return fvar.instances;
    }
    return null;
  };
  /**
   * Get number of instances in fvar table.
   */
  getInstancesCount = () => {
    var fvar = this.getFvarTable();
    if (fvar) {
      if (fvar.instances && fvar.instances.length > 0) {
        return fvar.instances.length;
      }
    }
    return 0;
  };
  /**
   * Get named instance string from fvar table.
   */
  getInstanceName = (i) => {
    var fvar = this.getFvarTable();
    if (fvar) {
      return fvar.instances[i].name.en;
    }
    return null;
  };
  /**
   * Get named instance string from fvar table.
   */
  getNamedInstance = (i) => {
    var fvar = this.getFvarTable();
    if (fvar) {
      return fvar.instances[i];
    }
    return null;
  };
  /**
   * Get the font-variation-settings string for a named instance string from fvar table.
   */
  getNamedInstanceSetting = (i) => {
    var fvar = this.getFvarTable();
    if (fvar) {
      var settings = [];
      var values = fvar.instances[i].coordinates;
      for (var k = 0; k < fvar.axes.length; k++) {
        settings.push(
          "'" + fvar.axes[k].tag + "' " + values[fvar.axes[k].tag].toString()
        );
      }
      return settings.join();
    }
    return null;
  };

  getFontFamily = () => {
    return this?.names?.preferredFamily?.en;
  };

  getFamily = () => {
    return this?.names?.fontFamily?.en;
  };

  getFontSubFamily = () => {
    return this?.names?.fontSubfamily?.en;
  };

  getFontRevision = () => {
    const headTable = this.getTable("head");
    if (!headTable) {
      return 0;
    }
    return headTable?.fontRevision;
  };

  getFontLastModified = () => {
    const headTable = this.getTable("head");
    if (!headTable) {
      return null;
    }
    const modifiedTimeStamp = headTable?.modified;

    const modifiedDate = new Date(modifiedTimeStamp);

    return `${modifiedDate.getFullYear()}-${
      modifiedDate.getMonth() + 1
    }-${modifiedDate.getDate()}`;
  };

  getMetaInformation = () => {
    let payload = {};
    const family = this.getFontFamily();
    payload["family"] = family ? family : this.getFamily();
    payload["variant"] = this.getFontVariant();
    payload["version"] = this.getFontRevision();
    payload["lastModified"] = this.getFontLastModified();
    return payload;
  };

  isFontItalic = () => {
    const fontSubfamily = this.getFontSubFamily();
    if (!fontSubfamily) {
      return false;
    }
    return fontSubfamily.includes("Italic") || fontSubfamily.includes("italic");
  };

  isFontWeightRegular = (fontWeight) => {
    return Number(fontWeight) === 400;
  };
}
