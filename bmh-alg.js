export {bmh_search, bmh_bad_shift_array};


// Assumes any character with no key in the map
// has shift length pattern.length, to support all unicode characters.
function bmh_bad_shift_array(pattern) {
    var shift_array = new Map();
    for (let i = 0; i < pattern.length - 1; i++) {
        shift_array.set(pattern[i], pattern.length - 1 - i);
    }
    return shift_array
}


function bmh_search(pattern, text) {
    var bad_shift_array = bmh_bad_shift_array(pattern);
    // console.log(bad_shift_array);
    var steps = [];
    var found = [];

    if (pattern.length == 0) {
        return [found, steps];
    } 

    let s = 0, i = pattern.length - 1;
    while (s <= text.length - pattern.length) {
        steps.push([s,i]);
        // console.log(steps);
        if (text[s + i] != pattern[i]) {
            const char = text[s + pattern.length - 1];
            if (bad_shift_array.has(char)) {
                s += bad_shift_array.get(char);
            } else {
                s += pattern.length;
            }
            i = pattern.length - 1;
        } else if (i == 0) {
            found.push(s);
            return [found, steps]; 
        } else {
            i = i - 1;
        }
    }
    return [found, steps]; 
}