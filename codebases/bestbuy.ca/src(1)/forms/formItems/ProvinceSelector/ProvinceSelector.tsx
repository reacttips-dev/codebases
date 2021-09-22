import * as React from "react";
import { Select } from "../select";
import { en, fr } from "./translations";
export class ProvinceSelector extends React.Component {
    render() {
        const messages = this.props.locale === "en-CA" ? en : fr;
        if (this.props.locale === "fr-CA") {
            return (React.createElement(Select, Object.assign({}, this.props),
                React.createElement("option", { value: "" }, messages.provinceOptionPrompt),
                React.createElement("option", { value: "AB" }, messages.provinceOptionAlberta),
                React.createElement("option", { value: "BC" }, messages.provinceOptionBritishColumbia),
                React.createElement("option", { value: "PE" }, messages.provinceOptionPrinceEdwardIsland),
                React.createElement("option", { value: "MB" }, messages.provinceOptionManitoba),
                React.createElement("option", { value: "NB" }, messages.provinceOptionNewBrunswick),
                React.createElement("option", { value: "NS" }, messages.provinceOptionNovaScotia),
                React.createElement("option", { value: "NU" }, messages.provinceOptionNunavut),
                React.createElement("option", { value: "ON" }, messages.provinceOptionOntario),
                React.createElement("option", { value: "QC" }, messages.provinceOptionQuebec),
                React.createElement("option", { value: "SK" }, messages.provinceOptionSaskatchewan),
                React.createElement("option", { value: "NL" }, messages.provinceOptionNewfoundland),
                React.createElement("option", { value: "NT" }, messages.provinceOptionNorthwestTerritories),
                React.createElement("option", { value: "YT" }, messages.provinceOptionYukon)));
        }
        else {
            return (React.createElement(Select, Object.assign({}, this.props),
                React.createElement("option", { value: "" }, messages.provinceOptionPrompt),
                React.createElement("option", { value: "AB" }, messages.provinceOptionAlberta),
                React.createElement("option", { value: "BC" }, messages.provinceOptionBritishColumbia),
                React.createElement("option", { value: "MB" }, messages.provinceOptionManitoba),
                React.createElement("option", { value: "NB" }, messages.provinceOptionNewBrunswick),
                React.createElement("option", { value: "NL" }, messages.provinceOptionNewfoundland),
                React.createElement("option", { value: "NS" }, messages.provinceOptionNovaScotia),
                React.createElement("option", { value: "NT" }, messages.provinceOptionNorthwestTerritories),
                React.createElement("option", { value: "NU" }, messages.provinceOptionNunavut),
                React.createElement("option", { value: "ON" }, messages.provinceOptionOntario),
                React.createElement("option", { value: "PE" }, messages.provinceOptionPrinceEdwardIsland),
                React.createElement("option", { value: "QC" }, messages.provinceOptionQuebec),
                React.createElement("option", { value: "SK" }, messages.provinceOptionSaskatchewan),
                React.createElement("option", { value: "YT" }, messages.provinceOptionYukon)));
        }
    }
}
export default ProvinceSelector;
//# sourceMappingURL=ProvinceSelector.js.map