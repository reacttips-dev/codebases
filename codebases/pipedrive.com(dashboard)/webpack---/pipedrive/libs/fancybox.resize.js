 /*!
 * Buttons helper for fancyBox
 * version: 1.0.5 (Mon, 15 Oct 2012)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             buttons: {
 *                 position : 'top'
 *             }
 *         }
 *     });
 *
 */
 var $ = require('jquery');

 require('fancybox');

 //Shortcut for fancyBox object
 var F = $.fancybox;

 //Add helper object
 F.helpers.buttons = {
     defaults : {
         skipSingle : false, // disables if gallery contains single image
         position   : 'top', // 'top' or 'bottom'
         tpl        : '<a class="fancybox-item fancybox-toggle" title="Toggle size" href="javascript:;"></a>'
     },

     list : null,
     buttons: null,

     beforeLoad: function (opts, obj) {
         //Remove self if gallery do not have at least two items

         if (opts.skipSingle && obj.group.length < 2) {
             obj.helpers.buttons = false;
             obj.closeBtn = true;

             return;
         }

         //Increase top margin to give space for buttons
         obj.margin[ opts.position === 'bottom' ? 2 : 0 ] += 30;
     },

     onPlayStart: function () {
         if (this.buttons) {
             this.buttons.play.attr('title', 'Pause slideshow').addClass('btnPlayOn');
         }
     },

     onPlayEnd: function () {
         if (this.buttons) {
             this.buttons.play.attr('title', 'Start slideshow').removeClass('btnPlayOn');
         }
     },

     afterShow: function (opts, obj) {
         var buttons = this.buttons;

         if (!buttons) {
             $(opts.tpl).addClass(opts.position).appendTo(F.skin);
             $('.fancybox-toggle').click( F.toggle );
         }


         this.toggleButton = $('.fancybox-toggle');

         this.onUpdate(opts, obj);
     },

     onUpdate: function (opts, obj) {
         var toggle;

         if (!this.toggleButton) {
             return;
         }

         toggle = this.toggleButton.removeClass('btnDisabled btnToggleOn');

         //Size toggle button
         if (obj.canShrink) {
             toggle.addClass('btnToggleOn');

         } else if (!obj.canExpand) {
             toggle.addClass('btnDisabled');
         }
     },

     beforeClose: function () {
         if (this.list) {
             this.list.remove();
         }

         this.list    = null;
         this.buttons = null;
     }
 };
