/*!
 * LucidJS
 *
 * Lucid is an easy to use event emitter library. LucidJS allows you to create your own event system and even pipe in
 * events from one emitter to another.
 *
 * Copyright 2012, Robert William Hurst
 * Licenced under the BSD License.
 * See https://raw.github.com/RobertWHurst/LucidJS/master/license.txt
 */
(function(factory) {

  //AMD
  if(typeof define === 'function' && define.amd) {
    define(factory);

  //NODE
  } else if((typeof module == 'object' || typeof module == 'function') && module.exports) {
    module.exports = factory();

  //GLOBAL
  } else {
    window.LucidJS = factory();
  }

})(function() {
  var api;

  //return the api
  api = {
    "emitter": EventEmitter
  };

  //indexOf pollyfill
  [].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;});

  return api;

  /**
   * Creates a event emitter.
   */
  function EventEmitter(object) {
    var emitter = object || {}, listeners = {}, setEvents = {}, pipes = [];

    //augment an object if it isn't already an emitter
    if(
      !emitter.on &&
      !emitter.once &&
      !emitter.trigger &&
      !emitter.set &&
      !emitter.pipe &&
      !emitter.listeners
    ) {
      emitter.on = on;
      emitter.off = off;
      emitter.once = once;
      emitter.trigger = trigger;
      emitter.set = set;
      emitter.set.clear = clearSet;
      emitter.pipe = pipe;
      emitter.pipe.clear = clearPipes;
      emitter.listeners = getListeners;
      emitter.listeners.clear = clearListeners;
    } else {
      return emitter;
    }

    if(emitter.addEventListener || emitter.attachEvent) {
      handleNode(emitter);
    }

    return emitter;

    /**
     * Binds listeners to events.
     * @param event
     * @return {Object}
     */
    function on(event     ) {
      var args, binding = {}, aI, sI;
      args = Array.prototype.slice.apply(arguments, [1]);

      //recurse over a batch of events
      if(typeof event === 'object' && typeof event.push === 'function') { return batchOn(event, args); }

      //trigger the listener event
      if(event.slice(0, 7) !== 'emitter' && (listeners['emitter'] || listeners['emitter.listener'])) {
        for(aI = 0; aI < args.length; aI += 1) {
          trigger('emitter.listener', event, args[aI]);
        }
      }

      //create the event
      if(!listeners[event]) { listeners[event] = []; }

      //add each callback
      for(aI = 0; aI < args.length; aI += 1) {
        if(typeof args[aI] !== 'function') { throw new Error('Cannot bind event. All callbacks must be functions.'); }
        listeners[event].push(args[aI]);
      }

      binding.clear = clear;

      return binding;

      function clear() {
        if(!listeners[event]) { return; }
        for(aI = 0; aI < args.length; aI += 1) {
          listeners[event].splice(listeners[event].indexOf(args[aI]), 1);
        }
        if(listeners[event].length < 1) { delete listeners[event]; }
      }

      function batchOn(events, args) {
        var eI, binding = {}, bindings = [];
        for(eI = 0; eI < events.length; eI += 1) {
          args.unshift(events[eI]);
          bindings.push(on.apply(this, args));
          args.shift();
        }

        binding.clear = clear;

        return binding;

        function clear() {
          var bI;
          for(bI = 0; bI < bindings.length; bI += 1) {
            bindings[bI].clear();
          }
        }
      }
    }

    /**
     * Unbinds listeners to events.
     * @param event
     * @return {Object}
     */
    function off(event     ) {
      var args = Array.prototype.slice.apply(arguments, [1]), aI, sI;

      //recurse over a batch of events
      if(typeof event === 'object' && typeof event.push === 'function') {
        for(sI = 0; sI < event.length; sI += 1) {
          off.apply(null, [event[sI]].concat(args));
        }
        return;
      }

      if(!listeners[event]) { throw new Error('Tried to remove an event from a non-existant event of type "'+event+'".'); }

      //remove each callback
      for(aI = 0; aI < args.length; aI += 1) {
        if(typeof args[aI] !== 'function') { throw new Error('Tried to remove a non-function.'); }
        var listenerIndex = listeners[event].indexOf(args[aI]);
        listeners[event].splice(listenerIndex, 1);
      }
    }

    /**
     * Binds listeners to events. Once an event is fired the binding is cleared automatically.
     * @param event
     * @return {Object}
     */
    function once(event     ) {
      var binding, args = Array.prototype.slice.apply(arguments, [1]), result = true, cleared = false;

      binding = on(event, function(    ) {
        var aI, eventArgs = Array.prototype.slice.apply(arguments);

        if(!binding) {
          if(cleared) { return; }
          cleared = true;
          setTimeout(function(){ binding.clear(); }, 0);
        } else {
          binding.clear();
        }

        for(aI = 0; aI < args.length; aI += 1) {
          if(args[aI].apply(this, eventArgs) === false) {
            result = false;
          }
        }

        return result;
      });

      return binding;
    }

    /**
     * Triggers events. Passes listeners any additional arguments.
     *  Optimized for 6 arguments.
     * @param event
     * @return {Boolean}
     */
    function trigger(event, a1, a2, a3, a4, a5, a6, a7, a8, a9, la) {
      var longArgs, lI, eventListeners, result = true;

      if(typeof la !== 'undefined') {
        longArgs = Array.prototype.slice.apply(arguments, [1]);
      }

      if(typeof event === 'object' && typeof event.push === 'function') {
        if(longArgs) {
          return batchTrigger.apply(null, arguments);
        } else {
          return batchTrigger(event, a1, a2, a3, a4, a5, a6, a7, a8, a9);
        }
      }

      event = event.split('.');
      while(event.length) {
        if(longArgs){
          if(triggerOnly.apply(this, [event.join('.')].concat(longArgs)) === false){
            result = false;
          }
        } else {
          if(triggerOnly(event.join('.'), a1, a2, a3, a4, a5, a6, a7, a8, a9) === false){
            result = false;
          }
        }
        
        event.pop();
      }

      return result;
    }

    /**
     * Private method, triggers the event without triggering any subevents
     */
    function triggerOnly(event, a1, a2, a3, a4, a5, a6, a7, a8, a9, la) {
      var longArgs, lI, eventListeners = listeners[event], result = true;
      
      if(typeof la !== 'undefined') {
        longArgs = Array.prototype.slice.apply(arguments, [1]);
      }

      if(event.substr(0,7) !== 'emitter' && (listeners['emitter'] || listeners['emitter.event'])) {
        if(longArgs) {
          trigger.apply(this, [].concat('emitter.event', event, longArgs));
        } else {
          trigger('emitter.event', event, a1, a2, a3, a4, a5, a6, a7, a8, a9);
        }
      }

      if(eventListeners) {
        eventListeners = [].concat(eventListeners);
        for(lI = 0; lI < eventListeners.length; lI += 1) {
          if(longArgs) {
            if(eventListeners[lI].apply(this, longArgs) === false) {
              result = false;
            }
          } else {
            if(eventListeners[lI](a1, a2, a3, a4, a5, a6, a7, a8, a9) === false) {
              result = false;
            }
          }
        }
      }
      return result;
    }

    /**
     * Triggers a batch of events. Passes listeners any additional arguments.
     *  Optimized for 6 arguments.
     */
    function batchTrigger(events, a1, a2, a3, a4, a5, a6, a7, a8, a9, la) {
      var longArgs, eI, result = true;

      if(typeof la !== 'undefined') {
        longArgs = Array.prototype.slice.apply(arguments, [1]);
      }

      for(eI = 0; eI < events.length; eI += 1) {
        if(longArgs) {
          args.unshift(events[eI]);
          if(trigger.apply(this, args) === false) { result = false; }
          args.shift();
        } else {
          if(trigger(events[eI], a1, a2, a3, a4, a5, a6, a7, a8, a9) === false) { result = false; }
        }

      }
      return result;
    }

    /**
     * Sets events. Passes listeners any additional arguments.
     *  Optimized for 6 arguments.
     */
    function set(event, a1, a2, a3, a4, a5, a6, a7, a8, a9, la) {
      var args, binding, _clear;

      if(la) { args = Array.prototype.slice.apply(arguments, [1]); }

      if(typeof event === 'object' && event.push) {
        if(args) { return batchSet.apply(null, args); }
        else { return batchSet(event, a1, a2, a3, a4, a5, a6, a7, a8, a9); }
      }

      binding = on(['emitter.listener', 'pipe.listener'], function(_event, listener) {
        var lI;

        if(event === _event) {
          if(args) { listener.apply(null, args); }
          else { listener(a1, a2, a3, a4, a5, a6, a7, a8, a9); }
        }
      });

      if(args) { trigger.apply(null, arguments); }
      else { trigger(event, a1, a2, a3, a4, a5, a6, a7, a8, a9); }

      if(!setEvents[event]) { setEvents[event] = []; }
      setEvents[event].push(binding);

      _clear = binding.clear;
      binding.clear = clear;

      return binding;

      function clear() {
        trigger('emitter.unset', event);
        setEvents[event].splice(setEvents[event].indexOf(binding), 1);
        _clear();
      }
    }

    function batchSet(events, a1, a2, a3, a4, a5, a6, a7, a8, a9, la) {
      var binding = {}, args, eI, bindings = [];

      if(la) { args = Array.prototype.slice.apply(arguments, [1]); }

      for(eI = 0; eI < events.length; eI += 1) {
        if(args) {
          bindings.push(set.apply(null, [events[eI]].concat(args)));
        } else {
          bindings.push(set(events[eI], a1, a2, a3, a4, a5, a6, a7, a8, a9));
        }
      }

      binding.clear = clear;
      return binding;

      function clear() {
        var bI;
        for(bI = 0; bI < bindings.length; bI += 1) {
          bindings[bI].clear();
        }
      }
    }

    /**
     * Clears a set event, or all set events.
     * @param event
     */
    function clearSet(event) {
      var bI;
      if(event && setEvents[event]) {
        for(bI = 0; bI < setEvents[event].length; bI += 1) {
          setEvents[event][bI].clear();
        }
        delete setEvents[event];
      } else if (!event) {
        for(event in setEvents) {
          if(!setEvents.hasOwnProperty(event)) { continue; }
          clearSet(event);
        }
      }
    }

    /**
     * Pipes events from another emitter.
     * @param event [optional]
     * @return {Object}
     */
    function pipe(event    ) {
      var binding = {}, emitters, eI, emitter, bindings = [],
      setEvents = [], eventCaptures = [], sendListeners = [];

      emitters = Array.prototype.slice.apply(arguments, [1]);

      if(typeof event === 'object') {
        if(event.on) { emitters.unshift(event); event = false; }
        else { return batchPipe.apply(null, arguments); }
      }

      for(eI = 0; eI < emitters.length; eI += 1) {
        emitter = emitters[eI];
        eventCaptures.push(emitter.on('emitter.event', captureEvent));
        sendListeners.push(on('emitter.listener', sendListener));
      }

      binding.clear = clear;
      return binding;

      function captureEvent(event     ) {
        var setEvent = false, args;
        args = Array.prototype.slice.apply(arguments, [1]);
        emitter.once(event, function() { setEvent = true; });
        if(event.substr(0, 4) !== 'pipe' && (listeners['pipe'] || listeners['pipe.event'])) {
          trigger('pipe.event', event, args);
        }
        if(setEvent) { setEvents.push(set.apply(null, [event].concat(args))); }
        else { triggerOnly.apply(null, [event].concat(args)); }
      }

      function sendListener(event, listener) {
        emitter.trigger('pipe.listener', event, listener);
      }

      function clear() {
        var bI, sI, eI, sII;
        for(bI = 0; bI < bindings.length; bI += 1) {
          bindings[bI].clear();
        }
        for(sI = 0; sI < bindings.length; sI += 1) {
          setEvents[sI].clear();
        }
        for(eI = 0; eI < eventListeners.length; eI += 1) {
          bindings[eI].clear();
        }
        for(sII = 0; sII < sendListeners.length; sII += 1) {
          setEvents[sII].clear();
        }
      }
    }

    function batchPipe(events    ) {
      var binding = {}, eI, bindings = [], emitters;
      emitters = Array.prototype.slice.apply(arguments, [1]);
      for(eI = 0; eI < events.length; eI += 1) {
        bindings.push(pipe.apply(null, [events[eI]].concat(emitters)));
      }

      binding.clear = clear;
      return binding;

      function clear() {
        var bI;
        for(bI = 0; bI < bindings.length; bI += 1) {
          bindings[bI].clear();
        }
      }
    }

    /**
     * Clears pipes based on the events they transport.
     * @param event
     */
    function clearPipes(event) {
      var pI, bI, binding;

      for(pI = 0; pI < pipes.length; pI += 1) {
        if(event) {
          if(pipes[pI].type === 2) { continue; }
          if(pipes[pI].events.indexOf(event) === -1) { continue; }
          pipes[pI].events.splice(pipes[pI].events.indexOf(event), 1);
        }
        if(pipes[pI].type === 2) { pipes[pI].listenerBinding.clear(); }
        for(bI = 0; bI < pipes[pI].bindings.length; bI += 1) {
          if(event && pipes[pI].bindings[bI].event !== event) { continue; }
          pipes[pI].bindings[bI].clear();
          pipes[pI].bindings.splice(bI, 1);
          bI -= 1;
        }
        if(pipes[pI].bindings.length < 1) {
          pipes.splice(pI, 1);
          pI -= 1;
        }
      }
    }

    /**
     * Gets listeners for events.
     * @param event
     * @return {*}
     */
    function getListeners(event) {
      if(event) {
        return listeners[event];
      } else {
        return listeners;
      }
    }

    /**
     * Clears listeners by events.
     * @param event
     */
    function clearListeners(event) {
      if(event) {
        delete listeners[event];
      } else {
        listeners = {};
      }
    }

    /**
     * Clears the emitter
     */
    function clear() {

      if(listeners['emitter'] || listeners['emitter.clear']) {
        trigger('emitter.clear');
      }

      listeners = {};

      clearSet();
      clearPipes();

      delete emitter.on;
      delete emitter.once;
      delete emitter.trigger;
      delete emitter.set;
      delete emitter.pipe;
      delete emitter.listeners;
      delete emitter.clear;
    }

    /**
     * Binds the emitter's event system to the DOM event system
     * @param node
     */
    function handleNode(node) {
      var handledEvents = [], listenerBinding, DOMEventListeners = [];

      listenerBinding = on('emitter.listener', function(event) {
        if(handledEvents.indexOf(event) > -1) { return; }
        handledEvents.push(event);

        try {

          //W3C
          if(node.addEventListener) {
            node.addEventListener(event, nodeListener, false);
            DOMEventListeners.push({
              "event": event,
              "listener": nodeListener
            });
          }

          //MICROSOFT
          else if(node.attachEvent) {
            node.attachEvent('on' + event, nodeListener);
            DOMEventListeners.push({
              "event": event,
              "listener": nodeListener
            });
          }

        } catch(e) {
          console.error(e);
        }

        function nodeListener(eventObj    ) {
          var args = Array.prototype.slice.apply(arguments);
          args.unshift([event, 'dom.' + event]);
          if(trigger.apply(this, args) === false) {
            eventObj.preventDefault();
            eventObj.stopPropagation();
          }
        }
      });

      emitter.clearNodeEmitter = clearNodeEmitter;

      function clearNodeEmitter() {
        var DI;
        for(DI = 0; DI < DOMEventListeners.length; DI += 1) {
          try {

            //W3C
            if(node.removeEventListener) {
              node.removeEventListener(DOMEventListeners[DI].event, DOMEventListeners[DI].listener, false);
            }

            //MICROSOFT
            else if(node.detachEvent) {
              node.detachEvent('on' + DOMEventListeners[DI].event, DOMEventListeners[DI].listener);
            }

          } catch(e) {
            console.error(e);
          }
        }

        handledEvents = [];
        listenerBinding.clear();
      }
    }
  }
});
