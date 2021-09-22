/* eslint-disable no-restricted-syntax, guard-for-in */
import $ from 'jquery';

import _ from 'underscore';
import TransloadIT from 'js/lib/transloadit';
import LucidJS from 'js/vendor/lucid.v2-7-0';
import config from 'js/app/config';
import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

const assetCreationAttemptsAPI = API('/api/assetCreationAttempts.v1/', { type: 'rest' });

const _private = {
  opts: {
    autosubmit: false,
    params: {
      wait: true,
    },
  },
};
let key = '';
let templateId = '';

if (config.environment === 'development') {
  key = 'dd78c51087d911e4809901402446d7f6';
  templateId = 'fe02424095ce11e4ac73b3e1af312e96';
} else if (config.environment === 'staging') {
  key = 'dd78c51087d911e4809901402446d7f6';
  templateId = 'd6e7f8109ddc11e4b54c35ba355a9c94';
} else {
  key = '05912e90e83346abb96c261bf458b615';
  templateId = '9fe2b030809a11e4943d19e60b9af16b';
}

/**
 * @constructor
 * @param {object} el - form element that will capture file upload.
 */
const AssetManagerUploader = function (el) {
  this.emitter = LucidJS.emitter(this);
  this.transloaditUploader = TransloadIT(el, _private.opts);
  this.attemptId = '';
  this.attempts = null;

  /**
   * Set up emitter.
   * Emits all events emitted by the TransloadIT library, as well as:
   * complete: file has been uploaded to asset manager
   * failed: file has not been uploaded due to an error caused by the user (invalid attempt id, etc)
   * error: file has not been uploaded for some other reason (failed ajax call, etc)
   * NOTE: Not piping here because I don't want all events to be piped through - the current lucidjs library we use
   * does not support this!
   */
  const updateAttemptRequest = function (attemptUpdate, attemptId, emitter, emitterCallback) {
    const uri = new URI(attemptId);

    return Q(assetCreationAttemptsAPI.put(uri.toString(), { data: attemptUpdate }))
      .then(emitterCallback)
      .catch((error) => {
        emitter.trigger('error', { message: 'Could not reach asset service', error, attemptId });
      });
  };

  const prepareAttemptWithAssembly = function (assembly, attempt) {
    const assets = [];
    // Parse Transloadit response.
    for (const assemblyStep in assembly.results) {
      var stepResult;
      const assemblyResults = assembly.results[assemblyStep];

      if (!attempt || assemblyResults.length === 1) {
        stepResult = assemblyResults[0];
      } else {
        let attemptName = attempt.name;
        // normalize method not supported in old browsers and safari yet
        if (attemptName.normalize) {
          attemptName = attemptName.normalize();
        }
        // Using Unicode Normalization Form of the string
        // Supporting files with accent marks or special chars in their name
        stepResult = _(assembly.results[assemblyStep]).where({
          name: attemptName,
        })[0];
      }

      assets.push({
        filename: stepResult.name,
        mime: stepResult.mime,
        url: stepResult.url,
        sslUrl: stepResult.ssl_url,
        size: stepResult.size,
        duration: stepResult.meta.duration,
        pageCount: stepResult.meta.page_count,
        audioBitRate: stepResult.meta.audio_bitrate,
      });
    }

    return {
      typeName: 'successful',
      transloaditData: JSON.stringify(assembly),
      assets,
    };
  };

  const propagateEvents = (eventName) => {
    this.transloaditUploader.on(eventName, (assembly) => {
      this.emitter.trigger(eventName, assembly);
    });
  };
  const eventsToPropogate = ['start', 'select', 'progress', 'upload', 'upload-complete', 'result', 'cancel'];
  eventsToPropogate.forEach(propagateEvents);

  this.transloaditUploader.on('success', (assembly) => {
    let attemptWithAssembly;
    const isBulkUpload = !_(this.attempts).isEmpty();

    if (isBulkUpload) {
      this.emitter.trigger('upload-result', assembly);

      const attemptPromises = [];
      const attemptResults = {
        success: [],
        error: [],
      };

      _(this.attempts).forEach((attempt) => {
        attemptWithAssembly = prepareAttemptWithAssembly(assembly, attempt);
        attemptPromises.push(
          updateAttemptRequest(attemptWithAssembly, attempt.attemptId, this.emitter)
            .then(() => attemptResults.success.push(attempt))
            .catch(() => attemptResults.error.push(attempt))
        );
      });

      Q.all(attemptPromises).done(() => {
        this.emitter.trigger('all-complete', attemptResults);
      });
    } else {
      attemptWithAssembly = prepareAttemptWithAssembly(assembly);
      updateAttemptRequest(attemptWithAssembly, this.attemptId, this.emitter, (response) => {
        this.emitter.trigger('complete', response.elements[0]);
      });
    }
  });

  this.transloaditUploader.on(
    'error',
    function (assembly) {
      const attempt = {
        typeName: 'failed',
        errorMessage: assembly.error,
        transloaditData: JSON.stringify(assembly),
      };
      updateAttemptRequest(
        attempt,
        this.attemptId,
        this.emitter,
        function () {
          this.emitter.trigger('failed', {
            message: 'Could not finish upload attempt: ' + assembly.error + ' assetId: ' + this.assetId,
          });
        }.bind(this)
      );
    }.bind(this)
  );
};

/**
 * @param {object} attempt - Attempt object from asset manager service
 * @param {object} [fileMetadata={}] - key-value pairs of any metadata about
 * @param {string} customTemplateId - Id for custom transloadit template
 *   file that should be passed to asset manager service.
 * Attempts to upload file to the asset manager.
 */
AssetManagerUploader.prototype.attempt = function (attempt, fileMetadata, customTemplateId = templateId) {
  fileMetadata = fileMetadata || {};
  const transloaditTemplateId =
    !['development', 'staging'].includes(config.environment) && customTemplateId ? customTemplateId : templateId;
  // Performs call to asset upload endpoint to indicate if the upload attempt was successful or failed.
  // Quick check to make sure we have some sort of id.
  if (_(attempt).has('id')) {
    this.attemptId = attempt.id;
    this.transloaditUploader.customize({
      autosubmit: false,
      params: {
        wait: true,
        auth: { key },
        notify_url: '',
        template_id: transloaditTemplateId,
        fields: {
          attemptId: this.attemptId,
        },
      },
    });

    this.transloaditUploader.submit();
  } else {
    this.emitter.trigger('failed', { message: 'No attempt ID provided.' });
  }
};

AssetManagerUploader.prototype.bulkAttempt = function (attempts) {
  this.attempts = attempts;

  if (!_(attempts).isEmpty()) {
    this.transloaditUploader.customize({
      autosubmit: false,
      params: {
        wait: true,
        auth: { key },
        notify_url: '',
        template_id: templateId,
        fields: {
          attempts,
        },
      },
    });

    this.transloaditUploader.submit();
  } else {
    this.emitter.trigger('failed', { message: 'No attempt provided.' });
  }
};

export default AssetManagerUploader;
