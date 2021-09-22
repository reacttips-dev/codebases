// This file was automatically generated from hostaccountmethods.schema.d.ts
// and contains types and methods for calling PIE

import * as PIEBridge from '@microsoft/pie.sharedbridge';

export function GetPIEScriptVersion(): number {
    return 0.3;
}

export enum AccountSwitchType {
    NextBoot = 'NextBoot',
    Reload = 'Reload',
    Reflow = 'Reflow',
}

export interface SelectedAccountResult {
    isAccountSelected: boolean;
    stableAccountObjectId?: string;
}

export interface AccountSelectedParams {
    displayName: string;
    emailAddress: string;
    stableAccountObjectId: string;
    accountSwitchType?: AccountSwitchType;
}

export interface AccountRemovedParams {
    displayName: string;
    emailAddress: string;
    stableAccountObjectId: string;
}

export interface AccountAddedParams {
    displayName: string;
    emailAddress: string;
    stableAccountObjectId: string;
}

export class JsonPostProcessing {
    public static AccountSwitchTypeValue(json: string): AccountSwitchType {
        return json as AccountSwitchType;
    }

    public static SelectedAccountResultValue(json: any): SelectedAccountResult {
        const value = json as SelectedAccountResult;
        return value;
    }

    public static AccountSelectedParamsValue(json: any): AccountSelectedParams {
        const value = json as AccountSelectedParams;
        if (value.accountSwitchType !== undefined) {
            value.accountSwitchType = JsonPostProcessing.AccountSwitchTypeValue(
                value.accountSwitchType
            );
        }
        return value;
    }

    public static AccountRemovedParamsValue(json: any): AccountRemovedParams {
        const value = json as AccountRemovedParams;
        return value;
    }

    public static AccountAddedParamsValue(json: any): AccountAddedParams {
        const value = json as AccountAddedParams;
        return value;
    }
}

export async function accountSelected(
    displayName: string,
    emailAddress: string,
    stableAccountObjectId: string,
    accountSwitchType?: AccountSwitchType
): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('Accounts', 0.2);
    const args = {
        displayName: displayName,
        emailAddress: emailAddress,
        stableAccountObjectId: stableAccountObjectId,
        accountSwitchType: accountSwitchType,
    } as AccountSelectedParams;
    return PIEBridge.HostBridge.invokeHost('Accounts.accountSelected', args, undefined);
}

export async function getSelectedAccount(): Promise<SelectedAccountResult> {
    await PIEBridge.throwIfVersionIsNotSupported('Accounts', 0.2);
    return PIEBridge.HostBridge.invokeHost(
        'Accounts.getSelectedAccount',
        {},
        JsonPostProcessing.SelectedAccountResultValue
    );
}

export async function accountRemoved(
    displayName: string,
    emailAddress: string,
    stableAccountObjectId: string
): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('Accounts', 0.2);
    const args = {
        displayName: displayName,
        emailAddress: emailAddress,
        stableAccountObjectId: stableAccountObjectId,
    } as AccountRemovedParams;
    return PIEBridge.HostBridge.invokeHost('Accounts.accountRemoved', args, undefined);
}

export async function accountAdded(
    displayName: string,
    emailAddress: string,
    stableAccountObjectId: string
): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('Accounts', 0.2);
    const args = {
        displayName: displayName,
        emailAddress: emailAddress,
        stableAccountObjectId: stableAccountObjectId,
    } as AccountAddedParams;
    return PIEBridge.HostBridge.invokeHost('Accounts.accountAdded', args, undefined);
}
