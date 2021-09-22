import ApiItemTypeEnum from './ApiItemTypeEnum';
import type { AppointmentComposeAdapter } from 'owa-addins-adapters';
import type InitialAppointmentComposeData from './InitialAppointmentComposeData';

export default async function getInitialAppointmentComposeData(
    adapter: AppointmentComposeAdapter,
    data: InitialAppointmentComposeData
): Promise<InitialAppointmentComposeData> {
    data.itemType = ApiItemTypeEnum.AppointmentCompose;
    data.seriesId = await adapter.getSeriesId();
    return data;
}
