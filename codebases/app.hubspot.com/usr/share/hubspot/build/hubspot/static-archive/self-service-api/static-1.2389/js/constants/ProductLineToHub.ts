import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _productLineToHub, _hubToProductLine;

import * as Hubs from './Hubs';
import * as ProductLines from './ProductLines';
export var productLineToHub = (_productLineToHub = {}, _defineProperty(_productLineToHub, ProductLines.MARKETING, Hubs.HUB_MARKETING), _defineProperty(_productLineToHub, ProductLines.SALES, Hubs.HUB_SALES), _defineProperty(_productLineToHub, ProductLines.SERVICE, Hubs.HUB_SERVICE), _defineProperty(_productLineToHub, ProductLines.CMS, Hubs.HUB_CMS), _defineProperty(_productLineToHub, ProductLines.OPERATIONS, Hubs.HUB_OPERATIONS), _productLineToHub);
export var hubToProductLine = (_hubToProductLine = {}, _defineProperty(_hubToProductLine, Hubs.HUB_MARKETING, ProductLines.MARKETING), _defineProperty(_hubToProductLine, Hubs.HUB_SALES, ProductLines.SALES), _defineProperty(_hubToProductLine, Hubs.HUB_SERVICE, ProductLines.SERVICE), _defineProperty(_hubToProductLine, Hubs.HUB_CMS, ProductLines.CMS), _defineProperty(_hubToProductLine, Hubs.HUB_OPERATIONS, ProductLines.OPERATIONS), _hubToProductLine);