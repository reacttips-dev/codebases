import createRuntimeProvidedResource from "@invisionapp/runtime-provided-resources/create-runtime-provided-resource";
import { GlobalSearch } from "./src";

createRuntimeProvidedResource({
  name: "global-search-ui",
  getResourceInterface: function () {
    return GlobalSearch;
  },
});
