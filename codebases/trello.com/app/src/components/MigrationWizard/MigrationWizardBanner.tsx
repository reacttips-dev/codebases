import React, { useContext } from 'react';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardVeryHeavyUsageBanner } from './MigrationWizardVeryHeavyUsageBanner';
import { PreMigrationBannerForGoldUsers } from './PreMigrationBannerForGoldUsers';
import { MigrationWizardDesktopBanner } from './MigrationWizardDesktopBanner';
import { MigrationWizardPostMigrationBanner } from './MigrationWizardPostMigrationBanner';
import { MigrationWizardPreMigrationBanner } from './MigrationWizardPreMigrationBanner';
import { MigrationWizardExperience } from './types';

interface MigrationWizardBannerProps {}

export const MigrationWizardBanner: React.FC<MigrationWizardBannerProps> = () => {
  const { experience } = useContext(MigrationWizardContext);
  let banner;

  switch (experience) {
    case MigrationWizardExperience.GoldUserWithTeamlessBoards:
      banner = <PreMigrationBannerForGoldUsers />;
      break;
    case MigrationWizardExperience.VeryHeavyUsage:
      banner = <MigrationWizardVeryHeavyUsageBanner />;
      break;
    case MigrationWizardExperience.Desktop:
      banner = <MigrationWizardDesktopBanner />;
      break;
    case MigrationWizardExperience.Post:
      banner = <MigrationWizardPostMigrationBanner />;
      break;
    case MigrationWizardExperience.Advanced:
    case MigrationWizardExperience.Pre:
      banner = <MigrationWizardPreMigrationBanner />;
      break;
    default:
      banner = null;
  }

  return banner;
};
