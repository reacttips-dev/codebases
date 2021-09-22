import { icons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";

const LABEL_TEXT = colorsPalettes.carbon[500];
const LABEL_TEXT_HOVERED = colorsPalettes.blue[400];
const LABEL_BACKGROUND = colorsPalettes.carbon[0];
const LABEL_ICON_BORDER = colorsPalettes.midnight[50];
const LABEL_SHADOW = rgba(colorsPalettes.carbon[100], 0.2);
const LABEL_SHADOW_HOVER = colorsPalettes.carbon[200];
const LABEL_ICON_COLOR = colorsPalettes.carbon[500];

export interface IDataLabelWithIconParams {
    icon: string;
    color: string;
    link: string;
    name: string;
    singleLob?: boolean;
}

function getIconDataLabel(icon) {
    const styles = `
        <style type="text/css">
        .DataLabelWithIcon-Label {
            pointer-events: all;
            width: 24px;
            height: 24px;
            box-shadow: 0 2px 4px ${LABEL_SHADOW};
            padding: 4px;
            box-sizing: border-box;
            background: ${LABEL_BACKGROUND};
            border: 1px solid ${LABEL_ICON_BORDER};
            border-radius: 5px;
            transition: box-shadow 0.25s, transform 0.25s ease-in-out;
        }
        .DataLabelWithIcon-Label:hover {
            transform: scale(1.2);
            box-shadow: 0 2px 6px ${LABEL_SHADOW_HOVER};
        }
        </style>
    `;
    return `${styles}<div class="DataLabelWithIcon-Label">
        <img src="${icon}" style="width: 16px; margin: 0; padding: 0;" />
    </div>`;
}

function getColorDataLabel(color) {
    const styles = `
        <style type="text/css">
        .DataLabelWithIcon-Label {
            pointer-events: all;
            width: 24px;
            height: 24px;
            margin: 0 auto;
            border-radius: 50%;
        }
        .DataLabelWithIcon-Label:hover {
            box-shadow: 0 2px 6px ${LABEL_SHADOW_HOVER};
        }
        </style>
    `;

    return `${styles}<div class="DataLabelWithIcon-Label" style="background: ${color}"></div>`;
}

export const dataLabelWithIcon = ({
    icon,
    color,
    link,
    name,
    singleLob,
}: IDataLabelWithIconParams) => {
    const iconMarkup = icon ? getIconDataLabel(icon) : getColorDataLabel(color);
    const styles = `
        <style type="text/css">
        .DataLabelWithIcon {
            pointer-events: none;
            margin: 0 auto 4px;
            cursor: default;
            width: 24px;
            height: 24px;
        }
        .DataLabelWithIcon:hover + .DataLabelWithIcon-LabelText {
            color: ${LABEL_TEXT_HOVERED};
        }
        .DataLabelWithIcon-LabelText {
            pointer-events: all;
            font-weight: normal;
            font-family: 'Roboto', serif;
            font-size: 12px;
            color: ${LABEL_TEXT};
            transition: color .25s;
        }
        .DataLabelWithIcon-LabelIcon {
            width: 12px;
            height: 12px;

            margin-right: 3px;
        }
        .DataLabelWithIcon-LabelIcon path {
            fill: ${LABEL_ICON_COLOR};
        }
        .DataLabelWithIcon-LabelContainer {
            display: flex;
        }
        </style>
    `;

    return `${styles}
        <div class="DataLabelWithIcon">
            ${
                link
                    ? `<a style="pointer-events: all; cursor: pointer;" href="${link}" target="_self">${iconMarkup}</a>`
                    : iconMarkup
            }
        </div>
        <div class="DataLabelWithIcon-LabelContainer">
            ${
                singleLob !== undefined
                    ? `<span class="DataLabelWithIcon-LabelIcon">${
                          singleLob ? icons.globe : icons.folder
                      }</span>`
                    : ""
            }
            <span class="DataLabelWithIcon-LabelText">${name}</span>
        </div>
    `;
};
