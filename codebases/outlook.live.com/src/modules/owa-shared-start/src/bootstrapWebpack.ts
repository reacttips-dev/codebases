import { getScriptPath } from 'owa-config';

// Bootstrap the public path before webpack tries to load anything that depends on it.
__webpack_public_path__ = getScriptPath();
