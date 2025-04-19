
(() => {
    function isNumber(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }


    if (globalThis.heroJS == undefined)
        globalThis.heroJS = {};

    globalThis.heroJS.isNumber = isNumber;
})();

