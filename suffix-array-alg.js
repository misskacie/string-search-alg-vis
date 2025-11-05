export {build_suffix_array, search_suffix_array};
var i;
function build_suffix_array(text) {
    var unsorted_suffix_array = [];
    for (i = text.length; i >= 1; i--) {
        unsorted_suffix_array.push(text.slice(-i));
    }
    unsorted_suffix_array.push('');
    // unsorted_suffix_array.reverse();
    var sorted_suffix_array = unsorted_suffix_array.toSorted();
    return [unsorted_suffix_array, sorted_suffix_array];
}

function search_suffix_array(pattern, text) {
    const [unsorted_suffix_array, sorted_suffix_array] = build_suffix_array(text);
    // binary search
    var steps = [];
    var found = false;
    let start = 0, end = sorted_suffix_array.length - 1;
    while (start <= end) { 
        let mid = Math.floor((start + end) / 2);
        steps.push([start,mid, end]);
        if (sorted_suffix_array[mid].startsWith(pattern)) {
            found = true;
            return [steps, found];
        } else if (sorted_suffix_array[mid] < pattern) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return [steps, found];
}
