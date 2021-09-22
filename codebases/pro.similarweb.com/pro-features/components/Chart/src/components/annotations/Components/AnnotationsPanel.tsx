import React from "react";
import {
    ActionBarContainer,
    AnnotationButton,
    AnnotationCard,
    AnnotationCardHeader,
    AnnotationCardHeaderLeftPanel,
    AnnotationCardEditButton,
    AnnotationCardContent,
    AnnotationsPanelContainer,
    HeaderTextPanel,
    CloseIconButton,
    AnnotationsPanelHeader,
} from "./StyledComponents";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { getShortFormatedDate } from "../Helpers/DataHelper";
import { i18nFilter } from "filters/ngFilters";
import { IAnnotation } from "../Data/Annotation";

export interface IAnnotationsPanelProps {
    headerText: string;
    annotations: IAnnotation[];
    onEditClick: (annotation: IAnnotation) => void;
    onAddClick: () => void;
    onCloseClick: () => void;
}
/*
 * This is the panel that display annotations list.
 * It is used to display annotation cards list when clicking on an annotation count cell
 * (that display number of annotations for a data point under the xAxis).
 * It will display an edit Link for user own annotations in the list.
 */
export const AnnotationsPanel: React.FunctionComponent<IAnnotationsPanelProps> = ({
    headerText,
    annotations,
    onEditClick,
    onAddClick,
    onCloseClick,
}) => {
    const translate = i18nFilter();
    return (
        <AnnotationsPanelContainer>
            <AnnotationsPanelHeader>
                <HeaderTextPanel>{headerText}</HeaderTextPanel>
                <CloseIconButton
                    type="flat"
                    onClick={onCloseClick}
                    iconName="clear"
                    placement="left"
                    iconSize="xs"
                />
            </AnnotationsPanelHeader>
            <ScrollArea
                style={{ maxHeight: 320, minHeight: 0 }}
                verticalScrollbarStyle={{ borderRadius: 5 }}
                horizontal={false}
                minScrollSize={48}
            >
                {annotations.map((annotation /* , index */) => {
                    return (
                        <AnnotationCard key={annotation.id}>
                            <AnnotationCardHeader>
                                <AnnotationCardHeaderLeftPanel>{`${
                                    annotation.userFullName
                                } - ${getShortFormatedDate(
                                    annotation.timestamp,
                                )}`}</AnnotationCardHeaderLeftPanel>
                                {annotation.editable ? (
                                    <AnnotationCardEditButton
                                        type="flat"
                                        onClick={() => onEditClick(annotation)}
                                        label={translate("chart.annotations.edit.button.label")}
                                    />
                                ) : null}
                            </AnnotationCardHeader>
                            <AnnotationCardContent>{annotation.text}</AnnotationCardContent>
                        </AnnotationCard>
                    );
                })}
            </ScrollArea>
            <ActionBarContainer>
                <AnnotationButton
                    type="flat"
                    onClick={onAddClick}
                    label={translate("chart.annotations.add.button.label")}
                />
            </ActionBarContainer>
        </AnnotationsPanelContainer>
    );
};
