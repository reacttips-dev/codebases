/* eslint-disable no-useless-escape */
/* eslint-disable prefer-rest-params */
/* eslint-disable camelcase */
/* eslint-disable no-bitwise */
/* eslint-disable complexity */
const $ = require('jquery');
const _ = require('lodash');
const TranslatorClient = require('@pipedrive/translator-client');

let translate = new TranslatorClient({});

module.exports = {
	url: app.config.url,
	lang: 'en',
	data: null,
	notTranslated: [],

	setData: function(data) {
		this.data = data;
	},

	setLang: function(lang, translator) {
		translate = translator;
		this.lang = lang;
	},

	gettext: function(str, replacements) {
		if (typeof replacements === 'undefined') {
			return translate.gettext(str);
		}

		return translate.sprintf(translate.gettext(str), replacements);
	},

	ngettext: function(/* str, arg1, arg2, ... */) {
		return translate.ngettext.apply(translate, arguments);
	},

	pgettext: function(context, str, ...args) {
		return translate.pgettext(context, str, args);
	},

	npgettext: function(/* str, arg1, arg2, ... */) {
		return translate.npgettext.apply(translate, arguments);
	},

	translate: function(string, context) {
		if (this._debug) {
			return this.generateTxtKey(string);
		}

		if (this.lang === 'en-US') {
			return string;
		}

		if (typeof context === 'undefined') {
			context = '';
		}

		const hash = this.calculateHash(string + context);

		if (!_.isObject(this.data) || typeof this.data[hash] === 'undefined') {
			if ($.inArray(string, this.notTranslated) === -1) {
				this.notTranslated.push(string);
			}

			return string;
		}

		return this.data[hash];
	},

	/**
	 * l10n.get({ string: 'My string' })
	 * l10n.get({ string: ['My singular string', 'My plural string '], value: 2 })
	 * l10n.get('My string');
	 * l10n.get('My string', context);
	 * l10n.get('My %s string', 'fantastic', 'adv');
	 * l10n.get('My %s string', 'fantastic', null);
	 */

	get: function(object) {
		if (typeof object === 'undefined') {
			return '';
		}

		if (_.isString(object.lang)) {
			this.setLanguage(object.lang);
		}

		let context = '';

		if (_.isObject(object)) {
			let string, value;

			if (_.isString(object.context)) {
				context = object.context;
			}

			if (_.isString(object.string)) {
				string = object.string;
			}

			if (!_.isObject(object.value)) {
				value = object.value;
			} else if (_.isArray(object.value)) {
				value = object.value;
			}

			if ((value || value === 0) && _.isArray(object.string)) {
				string = object.string[_.isNumber(object.value) && object.value !== 1 ? 1 : 0];
			}

			return this.formatString(this.translate(string, context), value);
		}

		const args = _.initial(arguments);

		if (args.length === 0) {
			args[0] = this.translate(arguments[0]);
		} else {
			args[0] = this.translate(arguments[0], arguments[arguments.length - 1]);
		}

		return args.length > 1 ? this.formatString.apply(this, args) : args[0];
	},

	generateTxtKey: function(string) {
		return `txt_${string
			.replace(/[ _.:\/%\\]/gi, '_')
			.replace(/[^a-zA-Z 0-9-_]+/g, '')
			.toLowerCase()}`;
	},

	/**
	 * Supporting functionality
	 */

	/**
	 * @license
	 * http://kevin.vanzonneveld.net
	 * +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
	 * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	 * +   improved by: sowberry
	 * +    tweaked by: Jack
	 * +   bugfixed by: Onno Marsman
	 * +   improved by: Yves Sucaet
	 * +   bugfixed by: Onno Marsman
	 * +   bugfixed by: Ulrich
	 * +   bugfixed by: Rafal Kukawski
	 * +   improved by: kirilloid
	 * *     example 1: utf8_encode('Kevin van Zonneveld');
	 * *     returns 1: 'Kevin van Zonneveld'
	 */
	utf8_encode: function(argString) {
		if (argString === null || typeof argString === 'undefined') {
			return '';
		}

		const string = `${argString}`;

		let utftext = '';
		let start;
		let end;
		let stringl = 0;

		start = end = 0;
		stringl = string.length;
		for (let n = 0; n < stringl; n++) {
			const c1 = string.charCodeAt(n);

			let enc = null;

			if (c1 < 128) {
				end++;
			} else if (c1 > 127 && c1 < 2048) {
				enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
			} else {
				enc = String.fromCharCode(
					(c1 >> 12) | 224,
					((c1 >> 6) & 63) | 128,
					(c1 & 63) | 128
				);
			}

			if (enc !== null) {
				if (end > start) {
					utftext += string.slice(start, end);
				}

				utftext += enc;
				start = end = n + 1;
			}
		}

		if (end > start) {
			utftext += string.slice(start, stringl);
		}

		return utftext;
	},

	/**
	 * @license
	 * http://kevin.vanzonneveld.net
	 * +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
	 * + namespaced by: Michael White (http://getsprink.com)
	 * +      input by: Brett Zamir (http://brett-zamir.me)
	 * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	 * -    depends on: utf8_encode
	 * *     example 1: sha1('Kevin van Zonneveld');
	 * *     returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'
	 */
	calculateHash: function(str) {
		const rotate_left = function(n, s) {
			const t4 = (n << s) | (n >>> (32 - s));

			return t4;
		};
		const cvt_hex = function(val) {
			let str = '';
			let i;
			let v;

			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 0x0f;
				str += v.toString(16);
			}

			return str;
		};

		let blockstart;
		let i, j;

		const W = [];

		let H0 = 0x67452301;
		let H1 = 0xefcdab89;
		let H2 = 0x98badcfe;
		let H3 = 0x10325476;
		let H4 = 0xc3d2e1f0;
		let A, B, C, D, E;
		let temp;

		str = this.utf8_encode(str);
		const str_len = str.length;
		const word_array = [];

		for (i = 0; i < str_len - 3; i += 4) {
			j =
				(str.charCodeAt(i) << 24) |
				(str.charCodeAt(i + 1) << 16) |
				(str.charCodeAt(i + 2) << 8) |
				str.charCodeAt(i + 3);
			word_array.push(j);
		}

		switch (str_len % 4) {
			case 1:
				i = (str.charCodeAt(str_len - 1) << 24) | 0x0800000;
				break;
			case 2:
				i =
					(str.charCodeAt(str_len - 2) << 24) |
					(str.charCodeAt(str_len - 1) << 16) |
					0x08000;
				break;
			case 3:
				i =
					(str.charCodeAt(str_len - 3) << 24) |
					(str.charCodeAt(str_len - 2) << 16) |
					(str.charCodeAt(str_len - 1) << 8) |
					0x80;
				break;
			// case 0:
			default:
				i = 0x080000000;
		}

		word_array.push(i);

		while (word_array.length % 16 !== 14) {
			word_array.push(0);
		}

		word_array.push(str_len >>> 29);
		word_array.push((str_len << 3) & 0x0ffffffff);

		for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
			for (i = 0; i < 16; i++) {
				W[i] = word_array[blockstart + i];
			}
			for (i = 16; i <= 79; i++) {
				W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
			}

			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;

			for (i = 0; i <= 19; i++) {
				temp =
					(rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
					0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 20; i <= 39; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 40; i <= 59; i++) {
				temp =
					(rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8f1bbcdc) &
					0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 60; i <= 79; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			H0 = (H0 + A) & 0x0ffffffff;
			H1 = (H1 + B) & 0x0ffffffff;
			H2 = (H2 + C) & 0x0ffffffff;
			H3 = (H3 + D) & 0x0ffffffff;
			H4 = (H4 + E) & 0x0ffffffff;
		}

		temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

		return temp.toLowerCase();
	}
};
