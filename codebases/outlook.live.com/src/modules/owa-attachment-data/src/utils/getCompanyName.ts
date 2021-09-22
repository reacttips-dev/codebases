import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function getCompanyName(): string {
    return getUserConfiguration().SessionSettings.CompanyName;
}
