import Utils from 'core/src/base/utils';
import PopoverView from 'core/src/views/modules/popover';
import a2cPopoverTemplate from 'text!core/src/templates/popovers/add-to-calendar-popover.mustache';

const AddToCalendarPopover = PopoverView.extend({

  template: a2cPopoverTemplate,

  templateData: function() {
    return {
      icons: this.options.icons,
    };
  },

  initialize: function (options = {}) {
    PopoverView.prototype.initialize.apply(this, arguments);
    this.options = options;

    const minutesDuration = this.getDurationInMinutes(this.options.duration);

    const date = this.roundStartTime(new Date());
    date.setDate(date.getDate() + 1);
    const description = this.cleanDescription(this.options.description);

    this.event = {
      start: date,
      title: this.options.title,
      duration: minutesDuration,
      description: description,
      eventLocation: this.options.baseUrl,
    };

    this.MS_IN_MINUTES = 60 * 1000;

    _.bindAll(this, 'onGoogleCalendarEvent', 'onYahooCalendarEvent', 'onDataCalendarEvent');
  },

  afterRender: function(...args) {
    _.bindAll(this, 'onOpen');
    this.listenTo(this, 'popover:open', this.onOpen);

    PopoverView.prototype.afterRender.apply(this, args);
  },

  onOpen: function(){

    this.visibleEl.find('.google-cal').on('click', this.onGoogleCalendarEvent);
    this.visibleEl.find('.yahoo-cal').on('click', this.onYahooCalendarEvent);
    this.visibleEl.find('.apple-cal').on('click', this.onDataCalendarEvent);
    this.visibleEl.find('.outlook-cal').on('click', this.onDataCalendarEvent);

    this.mixPanelTrack('Opened Add To Calendar Popover');

  },

  onGoogleCalendarEvent: function(){
    const startTime = this.formatTime(this.event.start);
    const endTime = this.calculateEndTime();
    const location = `${this.event.eventLocation}?via=calendar-google`;

    const href = encodeURI(`https://www.google.com/calendar/render?action=TEMPLATE&text=${this.event.title}&dates=${startTime}/${endTime}&details=${this.event.description}<p><a href='${location}'>${this.event.eventLocation}</a></p>&location=${location}&sprop=&sprop=name:`);

    this.openLink(href);

    this.mixPanelTrack('Added Class To Google Calendar');
  },

  onYahooCalendarEvent: function(){
    const location = `${this.event.eventLocation}?via=calendar-yahoo`;
    const eventDuration = this.event.end
      ? ((this.event.end.getTime() - this.event.start.getTime())/ (this.MS_IN_MINUTES))
      : this.event.duration;

    // Yahoo dates are bizarre, we need to convert the duration from minutes to hh:mm
    const yahooHourDuration = eventDuration < 600
      ? '0' + Math.floor((eventDuration / 60))
      : Math.floor((eventDuration / 60)) + '';

    const yahooMinuteDuration = eventDuration % 60 < 10
      ? `0${eventDuration % 60}`
      : String(eventDuration % 60);

    const yahooEventDuration = `${yahooHourDuration}${yahooMinuteDuration}`;//yahooHourDuration + yahooMinuteDuration;

    // Remove timezone from event time
    const st = this.formatTime(this.event.start);

    const href = encodeURI(`http://calendar.yahoo.com/?v=60&view=d&type=20&title=${this.event.title}&st=${st}&dur=${yahooEventDuration}&desc=${this.event.description}&in_loc=${location}`);

    this.openLink(href);

    this.mixPanelTrack('Added Class To Yahoo Calendar');

  },

  onDataCalendarEvent: function(e){
    const calendarTag = $(e.currentTarget).data('calendar') || 'Desktop';
    const startTime = this.formatTime(this.event.start);
    const endTime = this.calculateEndTime();
    const location = `${this.event.eventLocation}?via=calendar-${calendarTag}`;

    const href = encodeURI('data:text/calendar;charset=utf8,' + [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `URL:${location}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${this.event.title}`,
      `DESCRIPTION:${this.event.description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'].join('\n'));

    this.openLink(href);

    this.mixPanelTrack(`Added Class To ${calendarTag} Calendar`);
  },

  formatTime: function(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  },

  calculateEndTime: function() {
    const endTime = new Date(this.event.start.getTime() + (this.event.duration * this.MS_IN_MINUTES));
    return this.formatTime(endTime);
  },

  getDurationInMinutes: function(ssDuration) {
    const timeArray = (ssDuration || '0').replace('m', '').split('h');

    if(timeArray.length > 1){
      return (parseInt(timeArray[0].trim(), 10) * 60) + parseInt(timeArray[1].trim(), 10);
    }

    return parseInt(timeArray[0], 10);
  },

  roundStartTime: function(date) {
    date.setHours(date.getHours() + Math.ceil(date.getMinutes()/60));
    date.setMinutes(0);
    return date;
  },

  cleanDescription: function(description) {
    let newDescription = '';
    if(typeof description === 'string'){
      newDescription = description.replace(/<(?:.|\n)*?>/gm, '').substring(0, 1000);
      if(newDescription.length === 1000) {
        const descArray = newDescription.split(' ');
        descArray.pop();
        newDescription = `${descArray.join(' ')}...`;
      }
    }
    return newDescription;
  },

  openLink: function(href) {
    window.open(href, '_blank');
  },
  mixPanelTrack: function(msg) {
    try{
      SS.EventTracker.track(msg, {}, SS.EventTracker.classDetails({'from_page': Utils.getPathname()}));
    }catch(err){
      // eslint-disable-next-line no-console
      console.log(`Tracking error: ${err}!`);
    }
  },

});

export default AddToCalendarPopover;
