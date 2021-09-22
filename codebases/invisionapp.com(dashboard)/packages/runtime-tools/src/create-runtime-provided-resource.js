/**
 * Creates a runtime provided resource that can be loaded in app-shell.
 * @param {Object}   resource
 *                   Resource object.
 * @param {String}   resource.name
 *                   Resource name.
 * @param {String}   [resource.version]
 *                   Resource version.
 * @param {Function} resource.getResourceInterface
 *                   Function returning the resource interface.
 */
function createRuntimeProvidedResource(resource) {
  window.inGlobalContext = window.inGlobalContext || {};
  window.inGlobalContext.runtimeProvidedResources = window.inGlobalContext.runtimeProvidedResources || [];
  window.inGlobalContext.runtimeProvidedResources.push({
    version: process.env.__RUNTIME_PROVIDED_RESOURCE_VERSION__, // eslint-disable-line no-undef
    ...resource,
  });
}

module.exports = createRuntimeProvidedResource;
