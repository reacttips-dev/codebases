
module.exports = function isEmail (string) {
    return (/.+\@.+\..+/).test(string);
};