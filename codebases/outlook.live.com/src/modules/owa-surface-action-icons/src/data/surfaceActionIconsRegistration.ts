/* tslint:disable */
import type SurfaceActionIcons from './SurfaceActionIcons';

export type SurfaceActionIconsSubset = { [icon in SurfaceActionIcons]: string };

export let SurfaceActionIconsDefinitions: SurfaceActionIconsSubset = {
    InsertSignatureLine: '\uf677',
    ArrangeByFrom: '\uf678',
    Phishing: '\uf679',
    CreateMailRule: '\uf67A',
    Encryption: '\uf69D',
    ReadOutLoud: '\uf112',
};

export default {
    fontFileName: 'surfaceActionIcons',
    icons: SurfaceActionIconsDefinitions,
};
