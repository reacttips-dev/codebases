import { get } from './tempStorage';
export default function isLocal() {
  return get('NAVIGATION_ASSET_ENV') === 'local';
}