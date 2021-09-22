export const MEET_NOW_OWS_SERVICE_PATH = 'ows/beta/TeamsMeeting/meetnow';
export const SKYPE_CONSUMER_MEET_NOW_URI = 'https://go.skype.com/meetnow.outlook.web';

/*
    We need to show something during Meet Now loading.
    So, I have a static HTML page in loadingStatic.html.
    I then minify that manually by removing all whitespace and paste it here.
    If you change loadingStatic.html, you MUST change this string or else your changes won't propogate.
    This pattern should not be repeated unless you have a very good reason to.
*/
export const LOADING_STATIC_PAGE =
    "<style>body{background-color:#f7f7f7;font-size:24px;color:#605e5c;font-family:'Segoe UI Web (West European)',Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif}#flexContainer{display:flex;height:100%;padding:0;margin:0;align-items:center;flex-direction:column;justify-content:center}#imgContainer{width:120px;height:120px;margin-bottom:5px;display:flex;flex-direction:column-reverse;align-items:center;justify-content:baseline}#spinner{box-sizing:border-box;border-radius:50%;border:1.5px solid;border-color:#0078d4 #c7e0f4 #c7e0f4;animation-name:speen;animation-duration:1.3s;animation-iteration-count:infinite;animation-timing-function:cubic-bezier(.53,.21,.29,.67);height:40px;width:40px}@keyframes speen{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style><div id=flexContainer><div id=imgContainer><div id=spinner></div></div><div id=textContainer><span id=textContent>Starting your meeting...</span></div></div>";
export const LOADING_PAGE_TEXT_ID = 'textContent';
export const LOADING_PAGE_SPINNER_ID = 'spinner';
