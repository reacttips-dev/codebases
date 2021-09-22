import { action } from 'satcheljs';
import type { PartialTheme } from '@fluentui/theme';
import type { DensityMode } from '../store/schema/ExtendedTheme';

export default action(
    'MUTATE_FABRIC_DENSITY',
    (densityMode: DensityMode, density: PartialTheme) => ({ densityMode, density })
);
