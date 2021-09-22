(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.primitives.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Int64 = /** @class */ (function () {
    // BUG!!: need implement, currently, just handle 32bits number
    function Int64(numberStr) {
        this.low = 0;
        this.high = 0;
        this.low = parseInt(numberStr, 10);
        if (this.low < 0) {
            this.high = -1;
        }
    }
    Int64.prototype.Equals = function (numberStr) {
        var tmp = new Int64(numberStr);
        return this.low === tmp.low && this.high === tmp.high;
    };
    return Int64;
}());
exports.Int64 = Int64;
var UInt64 = /** @class */ (function () {
    // BUG!!: need implement, currently, just handle 32bits number
    function UInt64(numberStr) {
        this.low = 0;
        this.high = 0;
        this.low = parseInt(numberStr, 10);
    }
    UInt64.prototype.Equals = function (numberStr) {
        var tmp = new UInt64(numberStr);
        return this.low === tmp.low && this.high === tmp.high;
    };
    return UInt64;
}());
exports.UInt64 = UInt64;
var Number = /** @class */ (function () {
    function Number() {
    }
    Number.ToByte = function (value) {
        return this.ToUInt8(value);
    };
    Number.ToInt16 = function (value) {
        var signMask = (value & 0x8000) << 16 >> 16;
        return (value & 0x7fff) | signMask;
    };
    Number.ToInt32 = function (value) {
        var signMask = (value & 0x80000000);
        return (value & 0x7fffffff) | signMask;
    };
    Number.ToUInt8 = function (value) {
        return value & 0xff;
    };
    Number.ToUInt32 = function (value) {
        return value & 0xffffffff;
    };
    return Number;
}());
exports.Number = Number;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* Enums.ts
* Author: Abhilash Panwar (abpanwar)
* Copyright: Microsoft 2016
* Common enum values used in the SDK.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var AWTPiiKind;
(function (AWTPiiKind) {
    AWTPiiKind[AWTPiiKind["NotSet"] = 0] = "NotSet";
    AWTPiiKind[AWTPiiKind["DistinguishedName"] = 1] = "DistinguishedName";
    AWTPiiKind[AWTPiiKind["GenericData"] = 2] = "GenericData";
    AWTPiiKind[AWTPiiKind["IPV4Address"] = 3] = "IPV4Address";
    AWTPiiKind[AWTPiiKind["IPv6Address"] = 4] = "IPv6Address";
    AWTPiiKind[AWTPiiKind["MailSubject"] = 5] = "MailSubject";
    AWTPiiKind[AWTPiiKind["PhoneNumber"] = 6] = "PhoneNumber";
    AWTPiiKind[AWTPiiKind["QueryString"] = 7] = "QueryString";
    AWTPiiKind[AWTPiiKind["SipAddress"] = 8] = "SipAddress";
    AWTPiiKind[AWTPiiKind["SmtpAddress"] = 9] = "SmtpAddress";
    AWTPiiKind[AWTPiiKind["Identity"] = 10] = "Identity";
    AWTPiiKind[AWTPiiKind["Uri"] = 11] = "Uri";
    AWTPiiKind[AWTPiiKind["Fqdn"] = 12] = "Fqdn";
    // Supports scrubbing of the last octet in a IPV4 address. E.g. 10.121.227.147 becomes 10.121.227.*
    AWTPiiKind[AWTPiiKind["IPV4AddressLegacy"] = 13] = "IPV4AddressLegacy";
})(AWTPiiKind = exports.AWTPiiKind || (exports.AWTPiiKind = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* AWTBondSerializer.ts
* Author: Brent Erickson (brericks) and Abhilash Panwar (abpanwar)
* Copyright: Microsoft 2016
* Class to handler bond serialization.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Bond = __webpack_require__(9);
var Enums_1 = __webpack_require__(1);
var Utils = __webpack_require__(3);
var AWTBondSerializer = /** @class */ (function () {
    function AWTBondSerializer() {
    }
    AWTBondSerializer.getPayloadBlob = function (requestDictionary, tokenCount) {
        var stream = new Bond.IO.MemoryStream();
        var writer = new Bond.CompactBinaryProtocolWriter(stream);
        // Begin ClientCollector request
        //Write TokenToDataPackagesMap
        writer.WriteFieldBegin(Bond.BondDataType.BT_MAP, 3);
        writer.WriteMapContainerBegin(tokenCount, Bond.BondDataType.BT_STRING, Bond.BondDataType.BT_LIST);
        Object.keys(requestDictionary).forEach(function (token) {
            //write token
            writer.WriteString(token);
            var dataPackage = requestDictionary[token];
            // Write list of DataPackages
            writer.WriteContainerBegin(1, Bond.BondDataType.BT_STRUCT);
            // Source
            writer.WriteFieldBegin(Bond.BondDataType.BT_STRING, 2);
            writer.WriteString('act_default_source');
            // DataPackageId
            writer.WriteFieldBegin(Bond.BondDataType.BT_STRING, 5);
            writer.WriteString(Utils.newGuid());
            // Timestamp
            writer.WriteFieldBegin(Bond.BondDataType.BT_INT64, 6);
            writer.WriteInt64(Utils.numberToBondInt64(Date.now()));
            // Records
            writer.WriteFieldBegin(Bond.BondDataType.BT_LIST, 8);
            writer.WriteContainerBegin(dataPackage.length, Bond.BondDataType.BT_STRUCT);
            for (var i = 0; i < dataPackage.length; ++i) {
                writer.WriteBlob(dataPackage[i]);
            }
            writer.WriteStructEnd(false);
        });
        // End ClientCollector
        writer.WriteStructEnd(false);
        return stream.GetBuffer();
    };
    // As per mappings at https://skype.visualstudio.com/SCC/F.S4L.FUNDAMENTALS/_git/infrastructure_data_clienttelemetry?
    // path=%2Fclienttelemetry%2Fsrc%2Fbond%2FDataPackage.bond&version=GBdev2&_a=contents
    // Requires that the values of AWTEventData.properties must all be AWTEventProperty
    AWTBondSerializer.getEventBlob = function (eventData) {
        var stream = new Bond.IO.MemoryStream();
        var writer = new Bond.CompactBinaryProtocolWriter(stream);
        // ID
        writer.WriteFieldBegin(Bond.BondDataType.BT_STRING, 1);
        writer.WriteString(eventData.id);
        // Timestamp
        writer.WriteFieldBegin(Bond.BondDataType.BT_INT64, 3);
        writer.WriteInt64(Utils.numberToBondInt64(eventData.timestamp));
        // Type
        writer.WriteFieldBegin(Bond.BondDataType.BT_STRING, 5);
        writer.WriteString(eventData.type);
        // Event Type
        writer.WriteFieldBegin(Bond.BondDataType.BT_STRING, 6);
        writer.WriteString(eventData.name);
        var propsString = [];
        var piiProps = [];
        // Iterate across event data properties and separate based on pii
        Object.keys(eventData.properties).forEach(function (key) {
            var property = eventData.properties[key];
            if (property.pii === Enums_1.AWTPiiKind.NotSet) {
                propsString.push(key);
            }
            else {
                piiProps.push(key);
            }
        });
        //Extension map
        if (propsString.length) {
            writer.WriteFieldBegin(Bond.BondDataType.BT_MAP, 13);
            writer.WriteMapContainerBegin(propsString.length, Bond.BondDataType.BT_STRING, Bond.BondDataType.BT_STRING);
            propsString.forEach(function (name) {
                writer.WriteString(name);
                writer.WriteString(eventData.properties[name].value);
            });
        }
        // Pii
        if (piiProps.length) {
            writer.WriteFieldBegin(Bond.BondDataType.BT_MAP, 30);
            writer.WriteMapContainerBegin(piiProps.length, Bond.BondDataType.BT_STRING, Bond.BondDataType.BT_STRUCT);
            piiProps.forEach(function (name) {
                writer.WriteString(name);
                // PII Data
                // O365 scrubber type
                writer.WriteFieldBegin(Bond.BondDataType.BT_INT32, 1);
                writer.WriteInt32(1);
                // PII Kind
                writer.WriteFieldBegin(Bond.BondDataType.BT_INT32, 2);
                writer.WriteInt32(eventData.properties[name].pii);
                // Value
                writer.WriteFieldBegin(Bond.BondDataType.BT_STRING, 3);
                writer.WriteString(eventData.properties[name].value);
                writer.WriteStructEnd(false);
            });
        }
        writer.WriteStructEnd(false);
        return stream.GetBuffer();
    };
    AWTBondSerializer.base64Encode = function (data) {
        return Bond.Encoding.Base64.GetString(data);
    };
    return AWTBondSerializer;
}());
exports.default = AWTBondSerializer;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Utils.ts
* Author: Brent Erickson (brericks) and Abhilash Panwar (abpanwar)
* Copyright: Microsoft 2016
* Common functions used in the SDK.
*/
var microsoft_bond_primitives_1 = __webpack_require__(0);
var GuidRegex = /[xy]/g;
function numberToBondInt64(value) {
    // Construct bond timestamp for aria
    var bond_value = new microsoft_bond_primitives_1.Int64('0');
    bond_value.low = value & 0xffffffff;
    bond_value.high = Math.floor(value / 0x100000000);
    return bond_value;
}
exports.numberToBondInt64 = numberToBondInt64;
function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
        var r = (Math.random() * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.newGuid = newGuid;
function isPii(value) {
    if (!isNaN(value) && value !== null && value >= 0 && value <= 13) {
        return true;
    }
    return false;
}
exports.isPii = isPii;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Version.ts
* Author: Abhilash Panwar (abpanwar)
* Copyright: Microsoft 2016
* Class for SDK version.
*/
exports.Version = '1.2.2';
exports.FullVersionString = 'AWT-Web-CJS-' + exports.Version;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AriaSDK.ts
* Author: Abhilash Panwar (abpanwar)
* Copyright: Microsoft 2016
*/
var Enums_1 = __webpack_require__(1);
exports.AWTPiiKind = Enums_1.AWTPiiKind;
var AWT_1 = __webpack_require__(13);
exports.AWT = AWT_1.default;
exports.AWT_COLLECTOR_URL_UNITED_STATES = 'https://us.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_GERMANY = 'https://de.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_JAPAN = 'https://jp.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_AUSTRALIA = 'https://au.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_EUROPE = 'https://eu.pipe.aria.microsoft.com/Collector/3.0/';


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* bond_const.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Tool     : bondc, Version=3.0.1, Build=bond-git.debug.not
//     Template : Microsoft.Bond.Rules.dll#TypeScript.tt
//     File     : bond_const.ts
//
//     Changes to this file may cause incorrect behavior and will be lost when
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
var BondDataType;
(function (BondDataType) {
    BondDataType[BondDataType["BT_STOP"] = 0] = "BT_STOP";
    BondDataType[BondDataType["BT_STOP_BASE"] = 1] = "BT_STOP_BASE";
    BondDataType[BondDataType["BT_UINT8"] = 3] = "BT_UINT8";
    BondDataType[BondDataType["BT_UINT32"] = 5] = "BT_UINT32";
    BondDataType[BondDataType["BT_UINT64"] = 6] = "BT_UINT64";
    BondDataType[BondDataType["BT_STRING"] = 9] = "BT_STRING";
    BondDataType[BondDataType["BT_STRUCT"] = 10] = "BT_STRUCT";
    BondDataType[BondDataType["BT_LIST"] = 11] = "BT_LIST";
    BondDataType[BondDataType["BT_MAP"] = 13] = "BT_MAP";
    BondDataType[BondDataType["BT_INT32"] = 16] = "BT_INT32";
    BondDataType[BondDataType["BT_INT64"] = 17] = "BT_INT64";
    BondDataType[BondDataType["BT_UNAVAILABLE"] = 127] = "BT_UNAVAILABLE";
})(BondDataType = exports.BondDataType || (exports.BondDataType = {}));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.encoding.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var microsoft_bond_primitives_1 = __webpack_require__(0);
var Utf8 = /** @class */ (function () {
    function Utf8() {
    }
    Utf8.GetBytes = function (value) {
        var array = [];
        for (var i = 0; i < value.length; ++i) {
            var char = value.charCodeAt(i);
            if (char < 0x80) {
                array.push(char);
            }
            else if (char < 0x800) {
                array.push(0xc0 | (char >> 6), 0x80 | (char & 0x3f));
            }
            else if (char < 0xd800 || char >= 0xe000) {
                array.push(0xe0 | (char >> 12), 0x80 | ((char >> 6) & 0x3f), 0x80 | (char & 0x3f));
            }
            else {
                char = 0x10000 + (((char & 0x3ff) << 10) | (value.charCodeAt(++i) & 0x3ff));
                array.push(0xf0 | (char >> 18), 0x80 | ((char >> 12) & 0x3f), 0x80 | ((char >> 6) & 0x3f), 0x80 | (char & 0x3f));
            }
        }
        return array;
    };
    return Utf8;
}());
exports.Utf8 = Utf8;
var Base64 = /** @class */ (function () {
    function Base64() {
    }
    Base64.GetString = function (inArray) {
        var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var output = [];
        var paddingBytes = inArray.length % 3;
        var toBase64 = function (num) {
            return [lookup.charAt((num >> 18) & 0x3F),
                lookup.charAt((num >> 12) & 0x3F),
                lookup.charAt((num >> 6) & 0x3F),
                lookup.charAt(num & 0x3F)].join('');
        };
        for (var i = 0, length_1 = inArray.length - paddingBytes; i < length_1; i += 3) {
            var temp = (inArray[i] << 16) + (inArray[i + 1] << 8) + (inArray[i + 2]);
            output.push(toBase64(temp));
        }
        switch (paddingBytes) {
            case 1:
                var temp = inArray[inArray.length - 1];
                output.push(lookup.charAt(temp >> 2));
                output.push(lookup.charAt((temp << 4) & 0x3F));
                output.push('==');
                break;
            case 2:
                var temp2 = (inArray[inArray.length - 2] << 8) + (inArray[inArray.length - 1]);
                output.push(lookup.charAt(temp2 >> 10));
                output.push(lookup.charAt((temp2 >> 4) & 0x3F));
                output.push(lookup.charAt((temp2 << 2) & 0x3F));
                output.push('=');
                break;
        }
        return output.join('');
    };
    return Base64;
}());
exports.Base64 = Base64;
var Varint = /** @class */ (function () {
    function Varint() {
    }
    Varint.GetBytes = function (value) {
        var array = [];
        while (value & 0xffffff80) {
            array.push((value & 0x7f) | 0x80);
            value >>>= 7;
        }
        array.push(value & 0x7f);
        return array;
    };
    return Varint;
}());
exports.Varint = Varint;
var Varint64 = /** @class */ (function () {
    function Varint64() {
    }
    Varint64.GetBytes = function (value) {
        var low = value.low;
        var high = value.high;
        var array = [];
        while (high || (0xffffff80 & low)) {
            array.push((low & 0x7f) | 0x80);
            low = ((high & 0x7f) << 25) | (low >>> 7);
            high >>>= 7;
        }
        array.push(low & 0x7f);
        return array;
    };
    return Varint64;
}());
exports.Varint64 = Varint64;
var Zigzag = /** @class */ (function () {
    function Zigzag() {
    }
    Zigzag.EncodeZigzag32 = function (value) {
        value = microsoft_bond_primitives_1.Number.ToInt32(value);
        return ((value << 1) ^ (value >> (4 /*sizeof(int)*/ * 8 - 1)));
    };
    Zigzag.EncodeZigzag64 = function (value) {
        var low = value.low;
        var high = value.high;
        var tmpH = (high << 1) | (low >>> 31);
        var tmpL = low << 1;
        if (high & 0x80000000) {
            tmpH = ~tmpH;
            tmpL = ~tmpL;
        }
        var res = new microsoft_bond_primitives_1.UInt64('0');
        res.low = tmpL;
        res.high = tmpH;
        return res;
    };
    return Zigzag;
}());
exports.Zigzag = Zigzag;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.io.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var microsoft_bond_primitives_1 = __webpack_require__(0);
var MemoryStream = /** @class */ (function () {
    function MemoryStream() {
        this._buffer = [];
    }
    /*override*/
    MemoryStream.prototype.WriteByte = function (byte) {
        this._buffer.push(microsoft_bond_primitives_1.Number.ToByte(byte));
    };
    /*override*/
    MemoryStream.prototype.Write = function (buffer, offset, count) {
        while (count--) {
            this.WriteByte(buffer[offset++]);
        }
    };
    /**
     * Returns the array of unsigned bytes from which this stream was created.
     */
    MemoryStream.prototype.GetBuffer = function () {
        return this._buffer;
    };
    return MemoryStream;
}());
exports.MemoryStream = MemoryStream;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var bond_const_1 = __webpack_require__(6);
exports.BondDataType = bond_const_1.BondDataType;
var Encoding = __webpack_require__(7);
exports.Encoding = Encoding;
var IO = __webpack_require__(8);
exports.IO = IO;
var microsoft_bond_primitives_1 = __webpack_require__(0);
exports.Int64 = microsoft_bond_primitives_1.Int64;
exports.UInt64 = microsoft_bond_primitives_1.UInt64;
exports.Number = microsoft_bond_primitives_1.Number;
var CompactBinaryProtocolWriter = /** @class */ (function () {
    function CompactBinaryProtocolWriter(stream) {
        this._stream = stream;
    }
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteBlob = function (blob) {
        this._stream.Write(blob, 0, blob.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteContainerBegin = function (size, elementType) {
        this.WriteUInt8(elementType);
        this.WriteUInt32(size);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteMapContainerBegin = function (size, keyType, valueType) {
        this.WriteUInt8(keyType);
        this.WriteUInt8(valueType);
        this.WriteUInt32(size);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteFieldBegin = function (type, id) {
        if (id <= 5) {
            this._stream.WriteByte(type | (id << 5));
        }
        else if (id <= 0xff) {
            this._stream.WriteByte(type | (6 << 5));
            this._stream.WriteByte(id);
        }
        else {
            this._stream.WriteByte(type | (7 << 5));
            this._stream.WriteByte(id);
            this._stream.WriteByte(id >> 8);
        }
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteInt32 = function (value) {
        value = Encoding.Zigzag.EncodeZigzag32(value);
        this.WriteUInt32(value);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteInt64 = function (value) {
        this.WriteUInt64(Encoding.Zigzag.EncodeZigzag64(value));
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteString = function (value) {
        if (value === '') {
            this.WriteUInt32(0 /*length*/);
        }
        else {
            var array = Encoding.Utf8.GetBytes(value);
            this.WriteUInt32(array.length);
            this._stream.Write(array, 0, array.length);
        }
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteStructEnd = function (isBase) {
        this.WriteUInt8(isBase ? bond_const_1.BondDataType.BT_STOP_BASE : bond_const_1.BondDataType.BT_STOP);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteUInt32 = function (value) {
        var array = Encoding.Varint.GetBytes(microsoft_bond_primitives_1.Number.ToUInt32(value));
        this._stream.Write(array, 0, array.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteUInt64 = function (value) {
        var array = Encoding.Varint64.GetBytes(value);
        this._stream.Write(array, 0, array.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype.WriteUInt8 = function (value) {
        this._stream.WriteByte(microsoft_bond_primitives_1.Number.ToUInt8(value));
    };
    return CompactBinaryProtocolWriter;
}());
exports.CompactBinaryProtocolWriter = CompactBinaryProtocolWriter;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SecToMsMultiplier = 1000;
var AWTKillSwitch = /** @class */ (function () {
    function AWTKillSwitch() {
        this._killedTokenDictionary = {};
    }
    AWTKillSwitch.prototype.setKillSwitchTenants = function (killTokens, killDuration) {
        var _this = this;
        if (killTokens && killDuration) {
            try {
                var killedTokens = killTokens.split(',');
                if (killDuration === 'this-request-only') {
                    return killedTokens;
                }
                var durationMs_1 = parseInt(killDuration, 10) * SecToMsMultiplier;
                killedTokens.forEach(function (token) {
                    _this._killedTokenDictionary[token] = Date.now() + durationMs_1;
                });
            }
            catch (ex) {
                return [];
            }
        }
        return [];
    };
    AWTKillSwitch.prototype.isTenantKilled = function (tenantToken) {
        if (this._killedTokenDictionary[tenantToken] !== undefined && this._killedTokenDictionary[tenantToken] > Date.now()) {
            return true;
        }
        delete this._killedTokenDictionary[tenantToken];
        return false;
    };
    return AWTKillSwitch;
}());
exports.default = AWTKillSwitch;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AWTBondSerializer_1 = __webpack_require__(2);
var AWTRecordBatcher = /** @class */ (function () {
    function AWTRecordBatcher(_maxRequestSize, _outboundQueue) {
        this._maxRequestSize = _maxRequestSize;
        this._outboundQueue = _outboundQueue;
        this._currentBatch = {};
        this._currentBatchSize = 0;
    }
    AWTRecordBatcher.prototype.addEventToBatch = function (event) {
        var serializedEvent = AWTBondSerializer_1.default.getEventBlob(event);
        if (serializedEvent.length > this._maxRequestSize) {
            //single event too big
            return;
        }
        if (this._currentBatchSize + serializedEvent.length > this._maxRequestSize) {
            this.flushBatch();
        }
        else {
            if (this._currentBatch[event.tenantToken] === undefined) {
                this._currentBatch[event.tenantToken] = [];
            }
            this._currentBatch[event.tenantToken].push(serializedEvent);
            this._currentBatchSize += serializedEvent.length;
        }
    };
    AWTRecordBatcher.prototype.flushBatch = function () {
        if (this._currentBatchSize > 0) {
            this._outboundQueue.push(this._currentBatch);
            this._currentBatch = {};
            this._currentBatchSize = 0;
        }
    };
    return AWTRecordBatcher;
}());
exports.default = AWTRecordBatcher;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTRetryPolicy.ts
* Author: Abhilash Panwar (abpanwar)
* Copyright: Microsoft 2016
* Class for retry policy.
*/
var RandomizationLowerThreshold = 0.8;
var RandomizationUpperThreshold = 1.2;
var BaseBackoff = 3000;
var MaxBackoff = 120000;
var AWTRetryPolicy = /** @class */ (function () {
    function AWTRetryPolicy() {
    }
    AWTRetryPolicy.shouldRetryForStatus = function (httpStatusCode) {
        /* The below expression reads that we should only retry for:
            - HttpStatusCodes that are smaller than 300.
            - HttpStatusCodes greater or equal to 500 (except for 501-NotImplement
              and 505-HttpVersionNotSupport).
            - HttpStatusCode 408-RequestTimeout.
           This is based on Microsoft.WindowsAzure.Storage.RetryPolicies.ExponentialRetry class */
        return !((httpStatusCode >= 300 && httpStatusCode < 500 && httpStatusCode !== 408)
            || (httpStatusCode === 501)
            || (httpStatusCode === 505));
    };
    AWTRetryPolicy.getMillisToBackoffForRetry = function (retriesSoFar) {
        var waitDuration = 0;
        var minBackoff = BaseBackoff * RandomizationLowerThreshold;
        var maxBackoff = BaseBackoff * RandomizationUpperThreshold;
        var randomBackoff = Math.floor(Math.random() * (maxBackoff - minBackoff)) + minBackoff;
        waitDuration = Math.pow(4, retriesSoFar) * randomBackoff;
        return Math.min(waitDuration, MaxBackoff);
    };
    return AWTRetryPolicy;
}());
exports.default = AWTRetryPolicy;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = __webpack_require__(1);
var AWTTransmissionManager_1 = __webpack_require__(14);
var Utils = __webpack_require__(3);
var Version = __webpack_require__(4);
var AllTokens = 'allTkns';
var EventNameAndTypeRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|_){2,98}[a-zA-Z0-9]$/;
var EventNameDotRegex = /\./g;
var PropertyNameRegex = /^[a-zA-Z0-9](([a-zA-Z0-9|_|\.]){0,98}[a-zA-Z0-9])?$/;
var AWT = /** @class */ (function () {
    function AWT() {
    }
    AWT.initialize = function (tenantToken, configuration) {
        if (configuration === void 0) { configuration = {}; }
        if (this._isInitialized) {
            // tslint:disable-next-line
            throw 'Already Initialized';
        }
        this._defaultTenantToken = tenantToken;
        this._overrideValuesFromConfig(configuration);
        //Create sender
        AWTTransmissionManager_1.default.initialize(this._config);
        this._isInitialized = true;
    };
    AWT.flush = function (callback) {
        if (this._isInitialized && !this._isDestroyed) {
            AWTTransmissionManager_1.default.flush(callback);
        }
    };
    AWT.flushAndTeardown = function () {
        if (this._isInitialized && !this._isDestroyed) {
            this._isDestroyed = true;
            AWTTransmissionManager_1.default.flushAndTeardown();
        }
    };
    AWT.setContext = function (name, property, tenantToken) {
        if (tenantToken === void 0) { tenantToken = AllTokens; }
        property = this._sanitizeProperty(name, property);
        if (property === null) {
            return;
        }
        if (!this._contextProperties[tenantToken]) {
            this._contextProperties[tenantToken] = {};
        }
        this._contextProperties[tenantToken][name] = property;
    };
    AWT.logEvent = function (event) {
        var _this = this;
        if (this._isInitialized) {
            if (!event.name || !event.properties) {
                return;
            }
            event.name = event.name.toLowerCase();
            event.name.replace(EventNameDotRegex, '_');
            var typePrefix = '';
            if (!event.type) {
                event.type = 'custom';
            }
            else {
                event.type.toLowerCase();
                typePrefix = 'custom.';
            }
            if (!EventNameAndTypeRegex.test(event.name) || !EventNameAndTypeRegex.test(event.type)) {
                return;
            }
            event.type = typePrefix + event.type;
            if (isNaN(event.timestamp)) {
                event.timestamp = (new Date()).getTime();
            }
            if (!event.tenantToken) {
                event.tenantToken = this._defaultTenantToken;
            }
            event.id = Utils.newGuid();
            Object.keys(event.properties).forEach(function (name) {
                event.properties[name] = _this._sanitizeProperty(name, event.properties[name]);
                if (event.properties[name] === null) {
                    delete event.properties[name];
                }
            });
            this._addContextIfAbsent(event, event.tenantToken);
            this._addContextIfAbsent(event, AllTokens);
            if (Object.keys(event.properties).length === 0) {
                return;
            }
            this._setDefaultProperty(event, 'EventInfo.InitId', this._getInitId(event.tenantToken));
            this._setDefaultProperty(event, 'EventInfo.Sequence', this._getSequenceId(event.tenantToken));
            this._setDefaultProperty(event, 'EventInfo.SdkVersion', Version.FullVersionString);
            this._setDefaultProperty(event, 'EventInfo.Name', event.name);
            this._setDefaultProperty(event, 'EventInfo.Time', (new Date(event.timestamp)).toISOString());
            AWTTransmissionManager_1.default.sendEvent(event);
        }
    };
    AWT._overrideValuesFromConfig = function (config) {
        if (config.collectorUrl) {
            this._config.collectorUrl = config.collectorUrl;
        }
        if (config.sendingTimer > 1000) {
            this._config.sendingTimer = config.sendingTimer;
        }
    };
    AWT._getInitId = function (tenantToken) {
        if (this._initIdMap[tenantToken] === undefined) {
            this._initIdMap[tenantToken] = Utils.newGuid();
        }
        return this._initIdMap[tenantToken];
    };
    AWT._getSequenceId = function (tenantToken) {
        if (this._sequenceIdMap[tenantToken] === undefined) {
            this._sequenceIdMap[tenantToken] = 0;
        }
        return (++this._sequenceIdMap[tenantToken]).toString();
    };
    AWT._setDefaultProperty = function (event, name, value) {
        event.properties[name] = { value: value, pii: Enums_1.AWTPiiKind.NotSet };
    };
    AWT._addContextIfAbsent = function (event, tenantToken) {
        if (this._contextProperties[tenantToken]) {
            var context_1 = this._contextProperties[tenantToken];
            Object.keys(context_1).forEach(function (name) {
                if (!event.properties[name]) {
                    event.properties[name] = context_1[name];
                }
            });
        }
    };
    AWT._sanitizeProperty = function (name, property) {
        if (typeof property === 'string' || typeof property === 'number' || typeof property === 'boolean') {
            property = { value: property };
        }
        if (!PropertyNameRegex.test(name) || property === undefined || property === null
            || property.value === null || property.value === undefined || property.value === '') {
            return null;
        }
        if (typeof property.pii === 'undefined') {
            property.pii = Enums_1.AWTPiiKind.NotSet;
        }
        property.value = property.value.toString();
        return Utils.isPii(property.pii) ? property : null;
    };
    AWT._isInitialized = false;
    AWT._isDestroyed = false;
    AWT._contextProperties = {};
    AWT._sequenceIdMap = {};
    AWT._initIdMap = {};
    AWT._config = {
        collectorUrl: 'https://browser.pipe.aria.microsoft.com/Collector/3.0/',
        sendingTimer: 1000
    };
    return AWT;
}());
exports.default = AWT;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AWTRecordBatcher_1 = __webpack_require__(11);
var AWTBondSerializer_1 = __webpack_require__(2);
var AWTRetryPolicy_1 = __webpack_require__(12);
var AWTKillSwitch_1 = __webpack_require__(10);
var Version = __webpack_require__(4);
var FlushCheckTimer = 250;
var RequestSizeLimitBytes = 2936012; //approx 2.8 Mb
var MaxRetries = 4;
var AWTTransmissionManager = /** @class */ (function () {
    function AWTTransmissionManager() {
    }
    AWTTransmissionManager.initialize = function (config) {
        this._inboundQueues.push([]);
        this._recordBatcher = new AWTRecordBatcher_1.default(RequestSizeLimitBytes, this._outboundQueue);
        this._newEventsAllowed = true;
        if (typeof Uint8Array === 'undefined') {
            this._urlString += '&content-encoding=base64';
        }
        this._sendingTimer = config.sendingTimer;
        this._urlString = config.collectorUrl + this._urlString + '&x-apikey=';
    };
    //Push the event into the inbound queue and return
    AWTTransmissionManager.sendEvent = function (event) {
        var _this = this;
        if (this._newEventsAllowed) {
            //Add event to the last inbound queue
            this._inboundQueues[this._inboundQueues.length - 1].push(event);
            if (!this._running && this._timeout < 0 && !this._isCurrentlyFlushing) {
                this._timeout = setTimeout(function () { return _this._batchAndSendEvents(false); }, this._sendingTimer);
            }
        }
    };
    AWTTransmissionManager.flushAndTeardown = function () {
        this._newEventsAllowed = false;
        this._batchAndSendEvents(true);
    };
    AWTTransmissionManager.flush = function (callback) {
        this._inboundQueues.push([]);
        if (!this._isCurrentlyFlushing) {
            this._isCurrentlyFlushing = true;
            this._flush(callback);
        }
        else {
            this._flushQueue.push(callback);
        }
    };
    AWTTransmissionManager._batchAndSendEvents = function (isTeardown) {
        this._running = true;
        while (this._inboundQueues[0].length > 0 && this._outboundQueue.length < 1) {
            this._recordBatcher.addEventToBatch(this._inboundQueues[0].pop());
        }
        if (this._outboundQueue.length === 0) {
            this._recordBatcher.flushBatch();
        }
        this._sendRequest(this._outboundQueue.pop(), 0, isTeardown);
    };
    AWTTransmissionManager._retryRequestIfNeeded = function (conn, request, tokenCount, apikey, retryCount) {
        var _this = this;
        var shouldRetry = true;
        if (conn && typeof conn.status !== 'undefined') {
            var killedTokens = this._killSwitch.setKillSwitchTenants(conn.getResponseHeader('kill-tokens'), conn.getResponseHeader('kill-duration-seconds'));
            killedTokens.forEach(function (key) {
                delete request[key];
                tokenCount--;
            });
            if (!AWTRetryPolicy_1.default.shouldRetryForStatus(conn.status) || tokenCount <= 0) {
                shouldRetry = false;
            }
        }
        if (shouldRetry && retryCount < MaxRetries) {
            setTimeout(function () { return _this._sendRequest(request, retryCount + 1, false); }, AWTRetryPolicy_1.default.getMillisToBackoffForRetry(retryCount));
        }
        else {
            this._handleRequestFinished(null);
        }
    };
    AWTTransmissionManager._sendRequest = function (request, retryCount, isTeardown) {
        var _this = this;
        try {
            var conn_1 = new XMLHttpRequest();
            var tokenCount_1 = 0;
            var apikey_1 = '';
            Object.keys(request).forEach(function (token) {
                if (!_this._killSwitch.isTenantKilled(token)) {
                    if (apikey_1.length > 0) {
                        apikey_1 += ',';
                    }
                    apikey_1 += token;
                    tokenCount_1++;
                }
                else {
                    delete request[token];
                }
            });
            conn_1.open('POST', this._urlString + apikey_1, !isTeardown);
            if (!isTeardown) {
                conn_1.ontimeout = function () {
                    _this._retryRequestIfNeeded(conn_1, request, tokenCount_1, apikey_1, retryCount);
                };
                conn_1.onerror = function () {
                    _this._retryRequestIfNeeded(conn_1, request, tokenCount_1, apikey_1, retryCount);
                };
                conn_1.onload = function () {
                    _this._handleRequestFinished(conn_1);
                };
            }
            if (tokenCount_1 > 0) {
                var blob = AWTBondSerializer_1.default.getPayloadBlob(request, tokenCount_1);
                if (typeof Uint8Array === 'undefined') {
                    conn_1.send(AWTBondSerializer_1.default.base64Encode(blob));
                }
                else {
                    conn_1.send(new Uint8Array(blob));
                }
            }
            else if (isTeardown) {
                this._handleRequestFinished(null);
            }
        }
        catch (e) {
            this._handleRequestFinished(null);
        }
    };
    AWTTransmissionManager._handleRequestFinished = function (conn) {
        var _this = this;
        if (conn) {
            this._killSwitch.setKillSwitchTenants(conn.getResponseHeader('kill-tokens'), conn.getResponseHeader('kill-duration-seconds'));
        }
        if (this._inboundQueues[0].length > 0) {
            this._timeout = setTimeout(function () { return _this._batchAndSendEvents(false); }, this._sendingTimer);
        }
        else {
            this._timeout = -1;
            this._running = false;
        }
    };
    AWTTransmissionManager._flush = function (callback) {
        var _this = this;
        if (!this._running) {
            if (this._timeout > -1) {
                clearTimeout(this._timeout);
                this._timeout = -1;
            }
            if (this._inboundQueues[0].length > 0) {
                this._batchAndSendEvents(false);
            }
        }
        this._checkPrimaryInboundQueueEmpty(function () {
            //Move the next queue to be primary
            _this._inboundQueues.shift();
            if (callback !== null && callback !== undefined) {
                callback();
            }
            if (_this._flushQueue.length > 0) {
                setTimeout(function () { return _this._flush(_this._flushQueue.shift()); }, _this._sendingTimer);
            }
            else {
                _this._isCurrentlyFlushing = false;
                if (_this._inboundQueues[0].length > 0) {
                    _this._timeout = setTimeout(function () { return _this._batchAndSendEvents(false); }, _this._sendingTimer);
                }
            }
        });
    };
    AWTTransmissionManager._checkPrimaryInboundQueueEmpty = function (callback) {
        var _this = this;
        if (this._inboundQueues[0].length === 0) {
            this._checkOutboundQueueEmptyAndSent(callback);
        }
        else {
            setTimeout(function () { return _this._checkPrimaryInboundQueueEmpty(callback); }, FlushCheckTimer);
        }
    };
    AWTTransmissionManager._checkOutboundQueueEmptyAndSent = function (callback) {
        var _this = this;
        if (!this._running) {
            callback();
        }
        else {
            setTimeout(function () { return _this._checkOutboundQueueEmptyAndSent(callback); }, FlushCheckTimer);
        }
    };
    AWTTransmissionManager._outboundQueue = [];
    AWTTransmissionManager._inboundQueues = [];
    AWTTransmissionManager._newEventsAllowed = false;
    AWTTransmissionManager._killSwitch = new AWTKillSwitch_1.default();
    AWTTransmissionManager._isCurrentlyFlushing = false;
    AWTTransmissionManager._flushQueue = [];
    AWTTransmissionManager._running = false;
    AWTTransmissionManager._timeout = -1;
    AWTTransmissionManager._urlString = '?qsp=true&content-type=application%2Fbond-compact-binary&client-id=NO_AUTH&sdk-version='
        + Version.FullVersionString;
    return AWTTransmissionManager;
}());
exports.default = AWTTransmissionManager;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ })
/******/ ]);
});
//# sourceMappingURL=aria-webjs-compact-sdk-1.2.2.js.map