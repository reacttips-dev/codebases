export var getTeacherUrl = function (teacher, via) {
    if (teacher.vanityUsername) {
        return "/user/" + teacher.vanityUsername + "?via=" + (via !== null && via !== void 0 ? via : 'card-search');
    }
    return "/profile/" + teacher.name.split(' ').join('-') + "/" + teacher.username + "?via=" + (via !== null && via !== void 0 ? via : 'card-search');
};
export var getUrlAndOverrideVia = function (url, newVia) {
    var URLInstance = new URL(url);
    if (newVia) {
        URLInstance.searchParams.set('via', newVia);
    }
    return URLInstance.href;
};
//# sourceMappingURL=url-formatter.js.map