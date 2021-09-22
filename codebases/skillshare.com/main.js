import App from 'core/src/base/app';
// Extend global SS.events object with backbone events
SS.events = {};
_.extend(SS.events, Backbone.Events);
// Kick off our app
App.initialize();
