/* eslint-disable camelcase, guard-for-in, no-param-reassign, consistent-return, no-plusplus */
import $ from 'jquery';

import _ from 'underscore';
import LucidJS from 'js/vendor/lucid.v2-7-0';
import DataAttributes from 'js/lib/data.attributes';

const _private = {
  defaults: {
    'attribute.data': 'data-transloadit',
    service: 'https://api2.transloadit.com/',
    interval: 2500,
    pollTimeout: 8000,
    pollInterval: 300,
    poll404Retries: 15,
    pollConnectionRetries: 3,
    autosubmit: true,
    exclude: '',
    fields: false,
    hide: true,
    params: null,
  },

  get(el, options) {
    const uploader = $(el).data('transloadit.me');
    if (uploader && window.Modal && uploader.constructor === window.Modal.prototype.constructor) {
      if (options) {
        return uploader.customize(options);
      } else {
        return uploader;
      }
    } else {
      return null;
    }
  },

  make(el, options) {
    const $el = $(el);
    let uploader = _private.get(options);

    // if popup hasn't been created, make one!
    if (!uploader) {
      uploader = new TransloadIT($el, options);
      $el.data('transloadit.me', uploader);
    }

    return uploader;
  },

  uuid() {
    let uuid = '';
    let i;
    for (i = 0; i < 32; i += 1) {
      uuid += Math.floor(Math.random() * 16).toString(16);
    }
    return uuid;
  },

  addIfNotPresent(collection, objToAdd) {
    if (!_.some(collection, (obj) => _.isEqual(obj, objToAdd))) {
      collection.push(objToAdd);
    }
  },

  poll(query) {
    const that = this;
    let i = 0;

    if (this.ended) {
      return;
    }

    this.pollStarted = +new Date();

    $.ajax({
      dataType: 'jsonp',
      url: 'https://' + this.instance + '/assemblies/' + this.assemblyId + (query || '?seq=' + this.seq),
      timeout: that.options.pollTimeout,
      callbackParameter: 'callback',
      success(assembly) {
        if (that.ended) {
          return;
        }

        that.assembly = assembly;
        if (assembly.error === 'ASSEMBLY_NOT_FOUND') {
          that.pollRetries += 1;

          if (that.pollRetries > that.options.poll404Retries) {
            that.emitter.trigger('error', { message: 'can not find upload server', assembly });
            that.reset();
            return;
          }

          setTimeout(function () {
            _private.poll.call(that);
          }, 400);
          return;
        } else if (assembly.error) {
          that.emitter.trigger('error', { message: 'assembly error', assembly });
          that.reset();
          return;
        }

        that.seq = assembly.last_seq;

        if (!that.started) {
          that.started = true;
          that.trigger('start', assembly);
        }

        that.pollRetries = 0;
        const isUploading = assembly.ok === 'ASSEMBLY_UPLOADING';
        const isCanceled = assembly.ok === 'ASSEMBLY_CANCELED';
        const isComplete = assembly.ok === 'ASSEMBLY_COMPLETED';

        if (isUploading) {
          that.emitter.trigger('progress', assembly);
        }

        if (assembly.uploads && assembly.uploads.length) {
          for (i = 0; i < assembly.uploads.length; i++) {
            // user may want to know when each individual upload completed
            that.emitter.trigger('upload', assembly.uploads[i], assembly);
            _private.addIfNotPresent(that.uploads, assembly.uploads[i]);
          }

          // user may want to know when all uploads are completed
          if (that.filesToUpload.length > 0 && that.filesToUpload.length === that.uploads.length) {
            that.emitter.trigger('progress', assembly); // in case 100% hasn't been reached
            that.emitter.trigger('upload-complete', that.uploads, assembly);
          }
        }

        for (const step in assembly.results) {
          that.results[step] = that.results[step] || [];
          for (i = 0; i < assembly.results[step].length; i++) {
            that.emitter.trigger('result', step, assembly.results[step][i], assembly);
            _private.addIfNotPresent(that.results[step], assembly.results[step][i]);
          }
        }

        if (isCanceled) {
          that.ended = true;
          that.emitter.trigger('cancel', assembly);
          return;
        }

        that.bytesReceivedBefore = assembly.bytes_received;

        if (isComplete) {
          that.ended = true;
          assembly.uploads = that.uploads;
          assembly.results = that.results;
          that.emitter.trigger('success', assembly);
          return;
        }

        const ping = that.pollStarted - +new Date();
        const timeout = ping < that.options.interval ? that.options.interval : ping;

        that.timer = setTimeout(function () {
          _private.poll.call(that);
        }, timeout);
        that.lastPoll = +new Date();
      },
      error(xhr, status) {
        if (that.ended) {
          return;
        }

        that.pollRetries += 1;
        if (that.pollRetries > that.options.pollConnectionRetries) {
          const err = {
            error: 'CONNECTION_ERROR',
            message: 'There was a problem connecting to the upload server',
            reason: 'JSONP request status: ' + status,
          };
          that.emitter.trigger('error', err);
          that.reset();
          return;
        }

        setTimeout(function () {
          _private.poll.call(that);
        }, 350);
      },
    });
  },

  clone($obj) {
    const $result = $obj.clone();
    const myTextareas = $obj.filter('textarea');
    const resultTextareas = $result.filter('textarea');

    for (let i = 0, l = myTextareas.length; i < l; ++i) {
      $(resultTextareas[i]).val($(myTextareas[i]).val());
    }

    return $result;
  },

  checkFileTypes() {
    const that = this;
    const accepts = that.$files.attr('accept') || '';

    if (!accepts) {
      return true; // no filter then pass
    }

    let acceptedTypes = [];
    _(accepts.split(',')).each(function (accept) {
      if (accept === 'video/*') {
        acceptedTypes = acceptedTypes.concat([
          'video/mp4',
          'video/m4v',
          'video/flv',
          'video/avi',
          'video/mpg',
          'video/mov',
          'video/wmv',
          'video/h264',
          'video/mkv',
        ]);
      } else if (accept === 'image/*') {
        acceptedTypes = acceptedTypes.concat(['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/ico']);
      } else {
        acceptedTypes.push(accept);
      }
    });

    that.$files = that.$files.filter(function () {
      const regExps = _(accepts.split(',')).map(function (accept) {
        return new RegExp(accept);
      });

      const acceptedExts = _(acceptedTypes).map(function (acceptedType) {
        return acceptedType.split('/').pop();
      });

      const getExt = function (fileName) {
        if (fileName.indexOf('.') !== -1) {
          return fileName.split('.').pop().toLowerCase();
        } else {
          return '';
        }
      };

      const hasAcceptedExt = function (fileName) {
        const fileExt = getExt(fileName);
        return _(acceptedExts).contains(fileExt) || _(acceptedExts).contains('.' + fileExt);
      };

      const checkExt = function (fileName) {
        const acceptedExt = hasAcceptedExt(fileName);
        if (!acceptedExt) {
          let message = '';
          const ext = getExt(fileName);
          if (ext) {
            message = `Sorry, we do not accept ${getExt(fileName)} files here.`;
          } else {
            message = 'Sorry, we do not accept this type of file here.';
            message += ' Please use a valid filetype or extension and try again!';
            that.emitter.trigger('error', {
              message,
            });
          }
        }
        return acceptedExt;
      };

      if (this.files) {
        const fileTests = _(this.files).map(function (file) {
          // `file.type` is sometimes missing:
          // https://coursera.atlassian.net/browse/CAPTIONS-158?focusedCommentId=27772#comment-27772
          if (
            file.type &&
            _(regExps).some(function (regExp) {
              return regExp.test(file.type);
            })
          ) {
            return true;
          }
          return checkExt(file.name);
        });
        return _(fileTests).every(_.identity);
      } else {
        return checkExt(this.value);
      }
    });

    return false;
  },

  detectFileInputs() {
    this.$files = this.$form.find('input[type=file]').not(this.options.exclude);

    this.$files = this.$files.filter(function () {
      return !_.isEmpty(this.value);
    });
  },

  validate() {
    const params = this.options.params || this.$form.find('input[name=params]').val();

    if (!params) {
      this.emitter.trigger('error', { message: 'no params where found' });
      return false;
    }

    if (_.isString(params)) {
      try {
        return JSON.parse(params);
      } catch (e) {
        this.emitter.trigger('error', { message: 'input[name=params] contains invalid JSON' });
        return false;
      }
    } else {
      return params;
    }
  },

  getBoredInstance() {
    const that = this;
    this.instance = null;

    $.ajax({
      dataType: 'jsonp',
      url: this.options.service + 'instances/bored',
      timeout: that.options.pollTimeout,
      callbackParameter: 'callback',
      success(instance) {
        if (!instance || !instance.api2_host) {
          that.emitter.trigger('error', { message: 'no instance found' });
          that.reset();
          return;
        } else if (instance && instance.error) {
          that.emitter.trigger('error', { message: instance.error });
          that.reset();
          return;
        }

        that.instance = instance.api2_host;
        _private.begin.call(that);
      },
      error(xhr, status) {
        const err = {
          error: 'CONNECTION_ERROR',
          message: 'There was a problem connecting to the upload server',
          reason: 'JSONP request status: ' + status,
        };
        that.emitter.trigger('error', err);
        that.reset();
      },
    });
  },

  begin() {
    const that = this;

    this.started = false;
    this.ended = false;
    this.bytesReceivedBefore = 0;
    this.pollRetries = 0;
    this.seq = 0;
    this.uploads = [];
    this.results = {};
    this.filesToUpload = [];

    this.assemblyId = _private.uuid();

    this.$fileClones = $().not(document);

    if (this.$files) {
      this.$files.each(function () {
        const $clone = $(this).clone(true);
        that.$fileClones = that.$fileClones.add($clone);
        $clone.insertAfter(this);
        if (this.multiple === true) {
          _.each(this.files, function (file) {
            that.filesToUpload.push(file);
          });
        } else {
          that.filesToUpload.push($clone.val());
        }
      });
    }

    this.$iframe = $('<iframe id="transloadit-' + this.assemblyId + '" name="transloadit-' + this.assemblyId + '"/>')
      .insertAfter(this.$form)
      .hide();

    const $uploadForm = $('<form enctype="multipart/form-data" />')
      .attr('action', 'https://' + this.instance + '/assemblies/' + this.assemblyId + '?redirect=false')
      .attr('target', 'transloadit-' + this.assemblyId)
      .attr('method', 'POST')
      .append(this.$files)
      .insertAfter(this.$form)
      .hide();

    let fieldsFilter = '[name=params], [name=signature]';

    if (this.options.fields === true) {
      fieldsFilter = '*';
    } else if (typeof this.options.fields === 'string') {
      fieldsFilter += ', ' + this.options.fields;
    }

    let $clones = _private.clone(this.$form.find(':input[type!=file]').filter(fieldsFilter));
    $clones = $clones.add('<input>');
    $clones.attr({ name: 'params' });
    $clones.attr({ value: JSON.stringify(this.options.params) });
    $clones.prependTo($uploadForm);

    $uploadForm.submit();

    this.lastPoll = +new Date();
    setTimeout(function () {
      _private.poll.call(that);
    }, this.options.pollInterval);
  },
};

const TransloadIT = function (el, options) {
  const that = this;

  this.$form = $(el);
  this.customize(options);

  this.assemblyId = null;
  this.instance = null;
  this.timer = null;
  this.uploads = [];
  this.results = {};
  this.ended = null;
  this.pollStarted = null;
  this.pollRetries = 0;
  this.seq = 0;
  this.started = false;
  this.assembly = null;
  this.params = null;
  this.bytesReceivedBefore = 0;
  this.lastPoll = 0;
  this.$files = null;
  this.$fileClones = null;
  this.$iframe = null;

  this.emitter = LucidJS.emitter(this);

  this.$form.find('input[type="file"]').on('change', function () {
    that.params = that.options.params = _private.validate.call(that);

    // fail if no params
    if (that.params === false) {
      that.reset();
      return false;
    }

    _private.detectFileInputs.call(that);

    if (that.$files.length) {
      _private.checkFileTypes.call(that);
      const fail = that.emitter.trigger('select') === false;
      // if we are autosubmitting, clear form if it fails
      if (that.options.autosubmit) {
        if (fail) that.reset();
        else that.submit();
      }
      return false;
    } else {
      that.emitter.trigger('error', { message: 'no file was selected for uploading' });
      that.reset();
      return false;
    }
  });

  if (this.options.hide) {
    // replace any file inputs if they have attribute.text
    this.$form.find('input[type="file"]').each(function () {
      const $input = $(this);
      const $parent = $input.parent();
      $parent.css({ overflow: 'hidden', cursor: 'pointer' });
      if (!/block|inline-block/.test($parent.css('display'))) {
        $parent.css({ display: 'inline-block' });
      }
      if (/|static|inline/.test($parent.css('position'))) {
        $parent.css({ position: 'relative' });
      }
      $input.css({
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        'font-size': '100px',
        cursor: 'pointer',
      });
    });
  }
};

TransloadIT.prototype.submit = function () {
  _private.getBoredInstance.call(this);
};

TransloadIT.prototype.reset = function () {
  const $fileInput = this.$form.find('[type=file]');
  this.ended = true;
  $fileInput.wrap('<form>').closest('form').get(0).reset();
  $fileInput.unwrap();
};

TransloadIT.prototype.cancel = function () {
  // @todo this has still a race condition if a new upload is started
  // while a the cancel request is still being executed. Shouldn't happen
  // in real life, but needs fixing.

  if (!this.ended) {
    const that = this;

    if (this.$fileClones) {
      this.$fileClones.each(function (i) {
        const $original = $(that.$files[i]);
        const $clone = $(this);
        $original.insertAfter($clone);
        $clone.remove();
      });
    }

    clearTimeout(this.timer);

    _private.poll.call(this, '?method=delete');

    if (navigator.appName === 'Microsoft Internet Explorer') {
      this.$iframe[0].contentWindow.document.execCommand('Stop');
    }

    setTimeout(function () {
      if (that.$iframe) {
        that.$iframe.remove();
      }
    }, 500);
  }

  if ($.mask) {
    $.mask.close();
  }
};

TransloadIT.prototype.customize = function (settings) {
  this.options = _.extend({}, DataAttributes.parse(this.$form, _private.defaults, 'data-transloadit-'), settings);
  return this;
};

export default function (el, options) {
  return _private.get(el, options) || _private.make(el, options);
}
