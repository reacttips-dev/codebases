import { isCdsTypographyMigrationEnabled } from 'bundles/authoring/featureFlags';

const getStatusPillStyle: () => CSSProperties = () =>
  Object.freeze({
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: 'bold',
    fontSize: isCdsTypographyMigrationEnabled() ? '0.75rem' : '0.625rem',
    lineHeight: isCdsTypographyMigrationEnabled() ? '1rem' : '1.125rem',
  });

export default getStatusPillStyle;
