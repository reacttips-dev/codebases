(function() {
  var Clearbit, providePlugin,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  providePlugin = function(pluginName, pluginConstructor) {
    var tryApply = function() {
      var ga = window[window['GoogleAnalyticsObject'] || 'ga'];

      if (typeof ga === 'function') {
        ga('provide', pluginName, pluginConstructor);
        return true;
      } else {
        return false;
      }
    }

    if (tryApply()) {
      // Native support
    } else if (window.analytics && typeof window.analytics.ready === 'function') {
      // Segment support
      analytics.ready(tryApply);
    } else {
      console.error("Clearbit error: 'ga' variable not found.");
    }
  };

  Clearbit = (function() {
      function Clearbit(tracker, config) {
        this.tracker = tracker;
        this.config = config != null ? config : {};
        this.triggerEvent = bind(this.triggerEvent, this);
        this.setIPDimensions = bind(this.setIPDimensions, this);
        this.setDimensions = bind(this.setDimensions, this);
        this.set = bind(this.set, this);
        this.done = bind(this.done, this);
        this.mapping = this.config.mapping || {};
        this.done({"ip":"14.248.128.99","domain":null,"type":"isp","fuzzy":false,"company":null,"geoIP":{"city":"Hanoi","state":"Hanoi","stateCode":"HN","country":"Vietnam","countryCode":"VN"}});
      }
      Clearbit.prototype.done = function(response) {
          if (response) {
             this.setIPDimensions(response);
             if (response.company){
                 this.setDimensions(response.company);
            }
            return this.triggerEvent();
         }
       };
        Clearbit.prototype.set = function(key, value) {
         if (key && value) {
           return this.tracker.set(key, value);
         }
       };
        Clearbit.prototype.setIPDimensions = function(response) {
         if (typeof response.type !== 'undefined') {
           this.set(this.mapping.type, response.type)
         }
       }

    Clearbit.prototype.setDimensions = function(company) {
      var ref, ref1;
      this.set(this.mapping.companyName, company.name);
      this.set(this.mapping.companyDomain, company.domain);
      this.set(this.mapping.companyType, company.type);
      this.set(this.mapping.companyTags, (ref = company.tags) != null ? ref.join(',') : void 0);
      this.set(this.mapping.companyTech, (ref1 = company.tech) != null ? ref1.join(',') : void 0);
      this.set(this.mapping.companySector, company.category.sector);
      this.set(this.mapping.companyIndustryGroup, company.category.industryGroup);
      this.set(this.mapping.companyIndustry, company.category.industry);
      this.set(this.mapping.companySubIndustry, company.category.subIndustry);
      this.set(this.mapping.companySicCode, company.category.sicCode);
      this.set(this.mapping.companyNaicsCode, company.category.naicsCode);
      this.set(this.mapping.companyCountry, company.geo.countryCode);
      this.set(this.mapping.companyState, company.geo.stateCode);
      this.set(this.mapping.companyCity, company.geo.city);
      this.set(this.mapping.companyFunding, company.metrics.raised);
      this.set(this.mapping.companyEstimatedAnnualRevenue, company.metrics.estimatedAnnualRevenue);
      this.set(this.mapping.companyEmployeesRange, company.metrics.employeesRange);
      this.set(this.mapping.companyEmployees, company.metrics.employees);
      return this.set(this.mapping.companyAlexaRank, company.metrics.alexaGlobalRank);
    };

    Clearbit.prototype.triggerEvent = function() {
      return this.tracker.send(
        'event',
        'Clearbit',
        'Enriched',
        'Clearbit Enriched',
        {nonInteraction: true}
      );
    };

    return Clearbit;

  })();

  providePlugin('Clearbit', Clearbit);

  

  

}).call(this);
