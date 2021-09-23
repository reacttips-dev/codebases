/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

/*
S3 Uploader
===========

Upload data directly to S3 from the client.

Usage
-----

>     uploader = S3.uploader(JSON.parse(localStorage.S3Policy))
>     uploader.upload
>       key: "myfile.text"
>       blob: new Blob ["radical"]
>       cacheControl: 60 # default 0


The uploader automatically prefixes the key with the namespace specified in the
policy.

A promise is returned that is fulfilled with the url of the uploaded resource.

>     .then (url) -> # "https://s3.amazonaws.com/trinket/18894/myfile.txt"

The promise is rejected with an error if the upload fails.

A progress event is fired with the percentage of the upload that has completed.

The policy is a JSON object with the following keys:

- `accessKey`
- `policy`
- `signature`

Since these are all needed to create and sign the policy we keep them all
together.

Giving this object to the uploader method creates an uploader capable of
asynchronously uploading files to the bucket specified in the policy.

Notes
-----

The policy must specify a `Cache-Control` header because we always try to set it.

License
-------

The MIT License (MIT)

Copyright (c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

// eslint-disable-next-line func-names
module.exports = function(credentials) {
    const {
        policy,
        signature,
        accessKeyId
    } = credentials;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const {
        acl,
        bucket,
        namespace
    } = extractPolicyData(policy);

    const bucketUrl = `https://s3.amazonaws.com/${bucket}`;

    // eslint-disable-next-line func-names
    const urlFor = function(key) {
        const namespacedKey = `${namespace}${key}`;

        return `${bucketUrl}/${namespacedKey}`;
    };

    return {
        urlFor,

        upload({
            key,
            blob,
            cacheControl
        }, onProgress) {
            const namespacedKey = `${namespace}${key}`;
            // eslint-disable-next-line no-unused-vars
            const url = urlFor(key);

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return sendForm(
                bucketUrl,
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                objectToForm({
                    key: namespacedKey,
                    'Content-Type': blob.type || 'binary/octet-stream',
                    'Cache-Control': `max-age=${cacheControl || 31536000}`,
                    AWSAccessKeyId: accessKeyId,
                    'x-amz-security-token': credentials.sessionToken,
                    acl,
                    policy,
                    signature,
                    file: blob,
                }),
                onProgress,
            ).then(() => `${bucketUrl}/${encodeURIComponent(namespacedKey)}`);
        },
    };
};

// eslint-disable-next-line func-names
const getKey = function(conditions, key) {
    const results = conditions
        .filter((condition) => typeof condition === 'object')
        .map((object) => object[key])
        .filter((value) => value);

    return results[0];
};

const getNamespaceFromPolicyConditions = (conditions) =>
    // eslint-disable-next-line func-names
    conditions.filter(function(...args) {
        // eslint-disable-next-line no-unused-vars
        const [a, b, c] = Array.from(args[0]);
        return b === '$key' && (a === 'starts-with' || a === 'eq');
    })[0][2];
// eslint-disable-next-line no-var, vars-on-top, func-names
var extractPolicyData = function(policy) {
    const policyObject = JSON.parse(atob(policy));

    const {
        conditions
    } = policyObject;

    return {
        acl: getKey(conditions, 'acl'),
        bucket: getKey(conditions, 'bucket'),
        namespace: getNamespaceFromPolicyConditions(conditions),
    };
};

const isSuccess = (request) => request.status.toString()[0] === '2';

// eslint-disable-next-line vars-on-top, no-var
var sendForm = (url, formData, onProgress) =>
    // eslint-disable-next-line func-names
    new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest();

        request.open('POST', url, true);

        /* istanbul ignore if */
        if (request.upload != null) {
            request.upload.onprogress = onProgress;
        }

        // eslint-disable-next-line func-names, consistent-return, no-unused-vars
        request.onreadystatechange = function(e) {
            if (request.readyState === 4) {
                if (isSuccess(request)) {
                    return resolve(request);
                    // eslint-disable-next-line no-else-return
                } else {
                    return reject(request);
                }
            }
        };

        return request.send(formData);
    });
// eslint-disable-next-line no-var, vars-on-top, func-names
var objectToForm = function(data) {
    // eslint-disable-next-line no-unused-vars
    let formData;
    // eslint-disable-next-line no-return-assign, func-names, no-shadow
    return (formData = Object.keys(data).reduce(function(formData, key) {
        const value = data[key];

        if (value) {
            formData.append(key, value);
        }

        return formData;
    }, new FormData()));
};