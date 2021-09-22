// Attribute names
export const ATTRIBUTE_SRC = 'src';
export const ATTRIBUTE_IMAGETYPE = 'data-imagetype';
export const ATTRIBUTE_CROSS_ORIGIN = 'crossorigin';

export const ATTRIBUTE_ITEMID = 'data-itemid';
export const ATTRIBUTE_INETID = 'data-inetid';

// The attribute that carries proxy end point
export const ATTRIBUTE_IMAGEPROXYENDPOINT = 'data-imageproxyendpoint';

// Attribute values
export const ATTRIBUTE_VALUE_USE_CREDENTIALS = 'use-credentials';

// Image type
export const IMAGETYPE_ATTACHMENTBYCID = 'AttachmentByCid';

// Load error
export const ERROR_ONERROR = 'OnError';
export const ERROR_NULL_ATTACHMENT_URL = 'NullAttachmentUrl';
export const ERROR_DOM_DETACHED = 'DOMDetached';
export const ERROR_IMAGE_MISMATCH = 'ImageMismatch';

// Load context, this normally indicates surface of the loading, i.e. RP, Draft, Compose
export const CONTEXT_READINGPANE = 'RP';

// Specifies how the load is fulfilled
// Load is fulfilled by a cached data uri
export const HOWLOAD_DATAURI = 'DataUri';

// Load is done through attachment cross domain
export const HOWLOAD_CROSSDOMAIN = 'CrossDomain';

// Load is done through attachment same domain
export const HOWLOAD_SAMEDOMAIN = 'SameDomain';

// Load is fulfilled by proxy
export const HOWLOAD_PROXY = 'Proxy';

export const DATAPOINT_PROXY_SKIP_CONSUMER_CHILD = 'ImageProxySkipForConsumerChild';
export const DATAPOINT_PROXY_CONNECTORS_AUTH_TOKEN_FALSE = 'ImageProxyConnectorsAuthTokenFalse';
