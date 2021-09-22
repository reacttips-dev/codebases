import type GetRegionalConfigurationResponse from 'owa-service/lib/contract/GetRegionalConfigurationResponse';
import getRegionalConfigurationRequest from 'owa-service/lib/factory/getRegionalConfigurationRequest';
import getRegionalConfigurationOperation from 'owa-service/lib/operation/getRegionalConfigurationOperation';

export default function getRegionalConfiguration(): Promise<GetRegionalConfigurationResponse> {
    return getRegionalConfigurationOperation(getRegionalConfigurationRequest({}));
}
