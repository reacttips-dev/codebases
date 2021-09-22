import CLPUserLabelStore from '../../store/schema/clp/CLPUserLabelStore';
import CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import * as Schema from 'owa-graph-schema';

export default function buildCLPStoreWithChildren(
    queryResponse: Schema.MipData
): CLPUserLabelStore {
    return {
        clpLabels: queryResponse.clpLabels
            ? sortUserLabels(assignLabelsChildrenFromResponse(queryResponse.clpLabels))
            : [],
        learnMoreUrl: queryResponse.learnMoreUrl ?? '',
        hasMandatoryLabel: !!queryResponse.hasMandatoryLabel,
    };
}

function assignLabelsChildrenFromResponse(clpLabels: Schema.MipLabel[]): CLPLabel[] {
    const childLabels = clpLabels.filter(label => !!label.parentId);
    const parentLabels = clpLabels.filter(label => !label.parentId);
    return parentLabels.map(label => {
        const matchingChildren = childLabels.filter(child => child.parentId == label.id);
        return {
            ...label,
            children: matchingChildren as CLPLabel[],
        };
    });
}

function sortUserLabels(clpLabels: CLPLabel[]): CLPLabel[] {
    if (!clpLabels) {
        return null;
    }
    clpLabels.sort(compareLabels);
    clpLabels.forEach(label => {
        if (label.children) {
            label.children.sort(compareLabels);
        }
    });

    return clpLabels;
}

function compareLabels(labelA: CLPLabel, labelB: CLPLabel): number {
    return labelA.settingOrder - labelB.settingOrder;
}
