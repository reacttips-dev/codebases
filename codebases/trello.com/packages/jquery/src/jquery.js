// Because vendor.js is going to export us as "jquery" for all.js, we can't
// just require('jquery') here, because that will try to require ourself.
const $ = require('jquery/dist/jquery.js');

window.jQuery = $;
window.$ = $;

require('../vendor/jquery.ui.core.js');
require('../vendor/jquery.ui.widget.js');
require('../vendor/jquery.ui.mouse.js');
require('../vendor/jquery.ui.position.js');
require('../vendor/jquery.ui.draggable.js');
require('../vendor/jquery.ui.droppable.js');
require('../vendor/jquery.ui.sortable.js');
require('../vendor/jquery.cookie.js');
require('../vendor/jquery.crop.js');
require('../vendor/jquery.mousewheel.js');
require('../vendor/jquery.autosize.js');
require('../vendor/jquery.dragscrollable.js');

// Apparently those stupid files don't close over the jQuery variable.
// So we can't delete it after we're done.
// delete window.jQuery;
// delete window.$;

module.exports = $;
