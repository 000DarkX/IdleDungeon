/**
 *  part of HeroJS v*
 * @param {*} obj object to be traverse
 * @param {*} value a string telling how to traverse the obj
 * @param {*} sep seperator used in the value to represent a new object
 * @param {*} useDefault use default value or not
 * @param {*} defaultValue the default value when no object is there
 * @returns value or object 
 */
export function traverse(obj, value, sep=".",  useDefault=true, defaultValue={}) 
{
    if (value.length == 0) return obj;

    const s = value.split(sep);
    let result = obj;

    for (let i = 0; i < s.length; ++i) {
        const tmp = result[s[i]];
        if (tmp == undefined) {
            if (useDefault == false) {
                return result;
            }
            if (i + 1 >= s.length) {
                result[s[i]] = defaultValue;
            } else {
                result[s[i]] = {};
            }
        }
        result = result[s[i]];
    }

    return result;
}

/**
 *  part of HeroJS v*
 * @param {*} obj object to be traverse
 * @param {*} value a string telling how to traverse the obj
 * @param {*} sep seperator used in the value to represent a new object
 * @param {*} useDefault use default value or not
 * @param {*} defaultValue the default value when no object is there
 * @returns set value
 */
export function traverse_set(obj, value, setval, sep=".", useDefault=true, defaultValue={})
{
    if (value.length == 0) return obj;

    const s = value.split(sep);
    let result = obj;

    for (let i = 0; i < s.length - 1; ++i) {
        const tmp = result[s[i]];
        if (tmp == undefined) {
            if (useDefault == false) {
                return result;
            }
            result[s[i]] = defaultValue;
        }
        result = result[s[i]];
    }

    return result[s[s.length-1]] = setval;
}