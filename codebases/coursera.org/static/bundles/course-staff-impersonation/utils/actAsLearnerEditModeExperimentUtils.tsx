import epic from 'bundles/epic/client';

const isImpersonationEditModeEnabled = (): boolean => epic.get('Degrees', 'enableImpersonationEditMode');

export default isImpersonationEditModeEnabled;
