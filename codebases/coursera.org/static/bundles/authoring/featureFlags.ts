import epicClient from 'bundles/epic/client';

// https://tools.coursera.org/epic/experiment/3SLHwL_8EeuCulvkV0B8ig
export const isCdsTypographyMigrationEnabled = (): boolean => {
  return !!epicClient.get('Authoring', 'enableCdsTypographyMigration');
};

// https://tools.coursera.org/epic/experiment/F6z20NXPEeuXqA-RS-CLFQ
export const isCdsColorButtonMigrationEnabled = (): boolean => {
  return epicClient.get('Authoring', 'enableCdsColorButtonMigration');
};
