export {update_suffix_array};
var i;
const LARR = "\u2190" //←
const suf_arr_table_id = "SUFARRTABLE";
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
    katex.render("i", td, {
        throwOnError: false
    });

    td = row.insertCell();
    td.appendChild(document.createTextNode(NBSP));

    // td.appendChild(tnode);
    td = row.insertCell();
    katex.render("T_{i}", td, {
        throwOnError: false
    });
    td.style.textAlign = "left";

    td = row.insertCell();
    td.appendChild(document.createTextNode(NBSP+NBSP));

    td = row.insertCell();
    katex.render("S[i]", td, {
        throwOnError: false
    });

    td = row.insertCell();
    td.appendChild(document.createTextNode(NBSP));

    td = row.insertCell();
    katex.render("T_{S[i]}", td, {
        throwOnError: false
    });
    td.style.textAlign = "left";

    // Add padding for the offset alignment of pattern to text
     for (i = 0; i <= search_text.length; i++) {
        row =  table.insertRow()
        td = row.insertCell();
        td.appendChild(document.createTextNode(i));

        td = row.insertCell();
        td = row.insertCell();
        // Inefficient solution to get the suffix index from the array of strings.
        // as if it was a pointer.
        td.appendChild(document.createTextNode(unsorted_suffix_array[i]));

        td = row.insertCell();
        td = row.insertCell();
        // Inefficient solution to get the suffix index from the array of strings.
        // as if it was a pointer.
        td.appendChild(document.createTextNode(search_text.length - sorted_suffix_array[i].length));

        td = row.insertCell();
        td = row.insertCell();
        td.appendChild(document.createTextNode(sorted_suffix_array[i]));


        if ((i < min) || (i > max)) {
            td.className = "incorrect-td";
        }


        if (i == mid) {
            if (sorted_suffix_array[i].startsWith(search_pattern))  {
                td.className = "correct-td";
            } else {
                td.className = "incorrect-td";
            }
            td = row.insertCell();
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.appendChild(document.createTextNode("mid"));
        }
        if (i == min) {
            td = row.insertCell();
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.appendChild(document.createTextNode("min"));
        }

        if (i == max) {
            td = row.insertCell();
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.appendChild(document.createTextNode("max"));
        }

    }
    table.id = suf_arr_table_id;
    document.getElementById(suf_arr_table_id).replaceWith(table);
}
