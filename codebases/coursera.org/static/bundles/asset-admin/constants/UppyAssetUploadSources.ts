// these values map to our BE at https://github.com/webedx-spark/infra-services/blob/main/libs/models/src/main/pegasus/org/coursera/assetservice/AssetSourceType.courier
const UppyAssetUploadSources = {
  'react:Dashboard': 'Local',
  GoogleDrive: 'GoogleDrive',
  OneDrive: 'OneDrive',
  Dropbox: 'Dropbox',
  Url: 'Url',
  Zoom: 'Zoom',
};

export default UppyAssetUploadSources;
