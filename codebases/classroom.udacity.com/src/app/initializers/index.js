/**
 * Build our CSS
 */
import 'styles/app.scss';
import '@udacity/veritas-components/dist/styles/index.css';
/**
 * Initializers
 */
import './provide';
import './newrelic';
import './ajax';
import './moment';
import './segment';
import './sentry';

if (ENV === 'production') {
    require('./production');
} else if (ENV === 'dev') {
    require('./dev');
    require('./intercom');
} else if (ENV === 'staging') {
    require('./intercom');
}