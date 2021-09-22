// Cloud Global Required Modules includes all of the scripts that must
// run before all of our SPA apps. This includes application context and monitoring 
// scripts.

;(function(){
  
  // Meta data attribute is the primary driver of global context of tools
  // being used to 
  window.inGlobalContext = window.inGlobalContext || {};
  window.inGlobalContext.appMetaData = {};
  
  var appMetaData = {};
  
  try {
    
    var appMetaDataElement = document.querySelector('meta[data-app-metadata]');
    var requiredMetaData = ['appName', 'tier', 'thirdParty'];
    var requiredThirdParty = [];
    
    if(appMetaDataElement){
      appMetaData = JSON.parse(appMetaDataElement.getAttribute('data-app-metadata'));
      
      if (appMetaData) {
        // validate required fields to inform developers of missing components
        requiredMetaData.forEach(function(reqField){
          if (appMetaData[reqField] === undefined){
            console.error('CRITICAL: JSON in <meta data-app-metadata="{ ..JSON.. }"> is missing field:', reqField);
          }
        });
        
        requiredThirdParty.forEach(function(reqField){
          if (!appMetaData.thirdParty || appMetaData.thirdParty[reqField] === undefined){
            console.error('CRITICAL: JSON in <meta data-app-metadata="{ ..JSON.. }"> is missing child field from thirdParty:', reqField);
          }
        });
      }else {
        console.error('CRITICAL: MISSING JSON FROM <meta data-app-metadata="{ ..JSON.. }">');
      }
    }else {
      console.error('CRITICAL: UNABLE TO FIND <meta data-app-metadata="{ ..JSON.. }">');
    }
  }catch(e){
    console.error(e);
    console.error('CRITICAL: UNABLE TO PARSE JSON FROM <meta data-app-metadata="{ ..JSON.. }">');
  }


  window.inGlobalContext.appMetaData = appMetaData;
  window.inGlobalContext.teamSubDomain = window.location.hostname.split('.').slice(0, -2).join('.');

  window.inGlobalContext.frame = {
    isInIframe: false,
    isFeatureFrame: false
  };

  try {
    if (self && parent && self !== parent) {
      window.inGlobalContext.frame.isInIframe = true;
      try {
        if (parent.inGlobalContext && parent.inGlobalContext.appShell && parent.inGlobalContext.appShell.frameManager && parent.inGlobalContext.appShell.frameManager.isFeatureFrame(self)) {
          window.inGlobalContext.frame.isFeatureFrame = true;
        }
      } catch (e) {}
    }
  } catch (e) {}

  // feature frames have third-party manager and rum passed into the frames
  if (!window.inGlobalContext.frame.isFeatureFrame) {
    // sets window.inGlobalContext.thirdPartyManager
    require('@invisionapp/third-party-manager/sync-modules');

    var thirdPartyManager = window.inGlobalContext.thirdPartyManager;
    thirdPartyManager.init();
    
    thirdPartyManager.load(thirdPartyManager.thirdParties.DATADOG, {
      tier: window.inGlobalContext.appMetaData.tier
    });

    // RUM Snippet - https://github.com/InVisionApp/rum
    require('@invisionapp/rum/dist/snippet');

    const rumConfig = appMetaData.rum || {};

    window.rum.config(Object.assign(rumConfig, {
      appName: appMetaData.appName,
      featureName: appMetaData.featureName || undefined,
      featureVersion: appMetaData.featureVersion || undefined,
    }));
  }

})();



