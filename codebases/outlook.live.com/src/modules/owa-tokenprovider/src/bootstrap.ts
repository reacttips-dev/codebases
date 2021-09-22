import { bootstrapServiceRequest } from './bootstrapServiceRequest';

let serviceRequestInitialized = false;

/**
 * Initializes the service requests with the correct base path.
 * The function will be used by Jsmvvm to initalize the service request.
 */
export function bootstrap() {
    if (!serviceRequestInitialized) {
        bootstrapServiceRequest();
        serviceRequestInitialized = true;
    }
}
