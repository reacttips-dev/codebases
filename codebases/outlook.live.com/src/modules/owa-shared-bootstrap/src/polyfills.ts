import './bootstrapWebpack'; // Important that this come first, to bootstrap webpack settings
import 'owa-polyfills';
import { patchMobX } from 'owa-mobx4-adapter';

// Monkey-patch MobX to proxy stale objects to the store
patchMobX();
