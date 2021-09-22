export type AriaRole =
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'button'
    | 'cell'
    | 'checkbox'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'feed'
    | 'figure'
    | 'form'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'note'
    | 'option'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem';

export const AriaRoles = {
    /** http://www.w3.org/TR/wai-aria/#alert */
    alert: 'alert' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#alertdialog */
    alertdialog: 'alertdialog' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#application */
    application: 'application' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#article */
    article: 'article' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#banner */
    banner: 'banner' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#button */
    button: 'button' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#cell */
    cell: 'cell' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#checkbox */
    checkbox: 'checkbox' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#columnheader */
    columnheader: 'columnheader' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#combobox */
    combobox: 'combobox' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#complementary */
    complementary: 'complementary' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#contentinfo */
    contentinfo: 'contentinfo' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#definition */
    definition: 'definition' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#dialog */
    dialog: 'dialog' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#directory */
    directory: 'directory' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#document */
    document: 'document' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#feed */
    feed: 'feed' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#figure */
    figure: 'figure' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#form */
    form: 'form' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#grid */
    grid: 'grid' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#gridcell */
    gridcell: 'gridcell' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#group */
    group: 'group' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#heading */
    heading: 'heading' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#img */
    img: 'img' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#link */
    link: 'link' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#list */
    list: 'list' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#listbox */
    listbox: 'listbox' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#listitem */
    listitem: 'listitem' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#log */
    log: 'log' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#main */
    main: 'main' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#marquee */
    marquee: 'marquee' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#math */
    math: 'math' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#menu */
    menu: 'menu' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#menubar */
    menubar: 'menubar' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#menuitem */
    menuitem: 'menuitem' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#menuitemcheckbox */
    menuitemcheckbox: 'menuitemcheckbox' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#menuitemradio */
    menuitemradio: 'menuitemradio' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#navigation */
    navigation: 'navigation' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#note */
    note: 'note' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#option */
    option: 'option' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#presentation */
    presentation: 'presentation' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#progressbar */
    progressbar: 'progressbar' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#radio */
    radio: 'radio' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#radiogroup */
    radiogroup: 'radiogroup' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#region */
    region: 'region' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#row */
    row: 'row' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#rowgroup */
    rowgroup: 'rowgroup' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#rowheader */
    rowheader: 'rowheader' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#scrollbar */
    scrollbar: 'scrollbar' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#search */
    search: 'search' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#searchbox */
    searchbox: 'searchbox' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#separator */
    separator: 'separator' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#slider */
    slider: 'slider' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#spinbutton */
    spinbutton: 'spinbutton' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#status */
    status: 'status' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#switch */
    switch: 'switch' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#tab */
    tab: 'tab' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#table */
    table: 'table' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#tablist */
    tablist: 'tablist' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#tabpanel */
    tabpanel: 'tabpanel' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#term */
    term: 'term' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#textbox */
    textbox: 'textbox' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#timer */
    timer: 'timer' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#toolbar */
    toolbar: 'toolbar' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#tooltip */
    tooltip: 'tooltip' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#tree */
    tree: 'tree' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#treegrid */
    treegrid: 'treegrid' as AriaRole,
    /** http://www.w3.org/TR/wai-aria/#treeitem */
    treeitem: 'treeitem' as AriaRole,
};
