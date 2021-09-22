import epic from 'bundles/epic/client';

const isAdminV2Enabled = (): boolean => epic.get('EducatorAdmin', 'enableAdminV2');

export default isAdminV2Enabled;
