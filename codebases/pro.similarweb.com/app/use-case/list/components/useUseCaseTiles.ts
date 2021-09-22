import { swSettings } from "common/services/swSettings";
import { getUseCaseConfig } from "use-case/common/config/useCaseConfig";
import { ITile } from "use-case/common/types";

export const useUseCaseTiles = (): ITile[] => getUseCaseConfig(swSettings);
