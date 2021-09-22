import type ItemCLPInfo from 'owa-mail-store/lib/store/schema/ItemCLPInfo';

export default function getInitialItemCLPInfo(): ItemCLPInfo {
    return {
        nonTenantLabelString: '',
        selectedLabel: null,
    };
}
