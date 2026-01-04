export {update_suffix_array};
var i;
const LARR = "\u2190" //←
const suf_arr_table_id = "SUFARRTABLE";
const suf_arr_curr_table_id = "SUFFARR-CURR-TABLE";

let NBSP = "\u00A0" // non breaking space, so that spaces are preserved in copied string
function update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern, min, mid, max){
    // Add padding so Ed sizes the box correctly
    let pad_ed = document.getElementById("pad-ed");
    if (pad_ed){
        pad_ed.remove();
    }

    let table = document.createElement('table');
    table.className = "suffix-table";
    let row =  table.insertRow()
    let td = row.insertCell();
    td.className = "suffix-array-td";
    katex.render("i", td, {
        throwOnError: false
    });

    td = row.insertCell();
    td.className = "suffix-array-td";
    td.appendChild(document.createTextNode(NBSP));

    // td.appendChild(tnode);
    td = row.insertCell();
    td.className = "suffix-array-td";
    katex.render("T_{i}", td, {
        throwOnError: false
    });

    td = row.insertCell();
    td.className = "suffix-array-td";
    td.appendChild(document.createTextNode(NBSP+NBSP));

    td = row.insertCell();
    td.className = "suffix-array-td";
    katex.render("S[i]", td, {
        throwOnError: false
    });

    td = row.insertCell();
    td.className = "suffix-array-td";
    td.appendChild(document.createTextNode(NBSP));

    td = row.insertCell();
    td.className = "suffix-array-td";
    katex.render("T_{S[i]}", td, {
        throwOnError: false
    });

    // add 6 empty columns so screen width does not change if mid, min , max, are all on one row
    for (i = 0; i < 6; i++) {
        td = row.insertCell();
        // 1 Space for arrow and 3 chars of space for min, mid, max
        let text = i % 2 == 0 ? NBSP : NBSP + NBSP + NBSP;
        td.appendChild(document.createTextNode(text));
    }

    // Add padding for the offset alignment of pattern to text
     for (i = 0; i <= search_text.length; i++) {
        row =  table.insertRow()
        td = row.insertCell();
        td.className = "suffix-array-td";
        td.appendChild(document.createTextNode(i));

        td = row.insertCell();
        td.className = "suffix-array-td";
        td = row.insertCell();
        td.className = "suffix-array-td";
        // Inefficient solution to get the suffix index from the array of strings.
        // as if it was a pointer.
        td.appendChild(document.createTextNode(unsorted_suffix_array[i]));

        td = row.insertCell();
        td.className = "suffix-array-td";
        td = row.insertCell();
        td.className = "suffix-array-td";
        // Inefficient solution to get the suffix index from the array of strings.
        // as if it was a pointer.
        td.appendChild(document.createTextNode(search_text.length - sorted_suffix_array[i].length));

        td = row.insertCell();
        td.className = "suffix-array-td";
        td = row.insertCell();
        td.className = "suffix-array-td";
        td.appendChild(document.createTextNode(sorted_suffix_array[i]));


        if ((i < min) || (i > max)) {
            td.className = "suffix-array-td incorrect-td";
        }


        if (i == mid) {
            if (sorted_suffix_array[i].startsWith(search_pattern))  {
                td.className = "suffix-array-td correct-td";
            } else {
                td.className = "suffix-array-td incorrect-td";
            }
            td = row.insertCell();
            td.className = "suffix-array-td";
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.className = "suffix-array-td";
            td.appendChild(document.createTextNode("mid"));
        }
        if (i == min) {
            td = row.insertCell();
            td.className = "suffix-array-td";
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.className = "suffix-array-td";
            td.appendChild(document.createTextNode("min"));
        }

        if (i == max) {
            td = row.insertCell();
            td.className = "suffix-array-td";
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.className = "suffix-array-td";
            td.appendChild(document.createTextNode("max"));
        }

    }
    table.id = suf_arr_table_id;
    document.getElementById(suf_arr_table_id).replaceWith(table);

    show_match_with_current_suffix(sorted_suffix_array[mid], search_pattern);





}


function show_match_with_current_suffix(curr_suffix, search_pattern) {
    let table = document.createElement('table');
    table.id = suf_arr_curr_table_id;
    let row1 = table.insertRow();
    let row2 = table.insertRow();
    let incorrect_found = false;
    let max_len = Math.max(curr_suffix.length, search_pattern.length);

    let td1 = row1.insertCell();
    let td2 = row2.insertCell();
    td2.style.height = "2.5em";

    // td1.appendChild(document.createTextNode("prefix"));
    katex.render("\\small{T_{S[\\text{mid}]}}", td1, {
        throwOnError: false
    });
    td2.appendChild(document.createTextNode("pattern"));

    for (i = 0; i < max_len; i++) {
        let td1 = row1.insertCell();
        let td2 = row2.insertCell();
        td2.className = "zw-td";

        let text1 = NBSP, text2 = NBSP;
        // add empty spaces if length is too short
        if (i < curr_suffix.length) {
            text1 = curr_suffix[i];
        }
        if (i < search_pattern.length) {
            text2 = search_pattern[i];
        }

        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
        if (!incorrect_found && i < search_pattern.length) {
            if (curr_suffix[i] == search_pattern[i]) {
                td1.className = "correct-td";
                td2.className = "correct-td";
            } else {
                td1.className = "incorrect-td";
                td2.className = "incorrect-td";
                incorrect_found = true;
            }
        }
    }


    document.getElementById(suf_arr_curr_table_id).replaceWith(table);
}