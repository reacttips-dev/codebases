import { EnterpriseAdminUser } from './EnterpriseAdminUser';

/**
 * The singleton pattern here is redundant because of the webpack build system,
 * but makes the intent of this module more obvious.
 *
 * This model is being used as a persistent data store.
 */
const admin = new EnterpriseAdminUser();

export default admin;
