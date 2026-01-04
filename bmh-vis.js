export{update_bmh_vis, add_bmh_shift_array_html};
let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑
let NBSP = "\u00A0" // non breaking space, so that spaces are preserved in copied string
var i, td, td1, td2;
const vis_table_id = "BMHTABLE";
const shift_table_id = "BMHFAILURE";
const bmh_pseudocode_table_id = "BMH-PSEUDOCODE";

function add_bmh_shift_array_html(bad_shift_array, search_pattern){
    let table = document.createElement('table');
    let row1 =  table.insertRow()
    let row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.appendChild(document.createTextNode("char"));
    td2.appendChild(document.createTextNode("L[char]"));
    // Add padding for the offset alignment of pattern to text
    for (const [key, value] of bad_shift_array.entries()) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.appendChild(document.createTextNode(key));
        td2.appendChild(document.createTextNode(value));
    }
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.style.maxWidth = "0pt";
    td1.appendChild(document.createTextNode('rest'));
    td2.appendChild(document.createTextNode(search_pattern.length));

    table.id = shift_table_id;
    document.getElementById(shift_table_id).replaceWith(table);
}


function update_bmh_vis(steps, found, vis_step, search_pattern, search_text) {
    // Add padding so Ed sizes the box correctly
    let pad_ed = document.getElementById("pad-ed");
    if (pad_ed){
        pad_ed.remove();
    }
    let table = document.createElement('table');
    let bmh_s = steps[vis_step][0];
    let bmh_i = steps[vis_step][1];
    let row1 = table.insertRow();
    let row2 = table.insertRow();
    for (i = 0; i <= bmh_s; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.className = "zw-td";
        td2.className = "zw-td";
        let text1 = NBSP, text2 = NBSP;
        if (bmh_s == i) {
            text1 = "s="+String(bmh_s);
            text2 = DARR;
        }
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let row =  table.insertRow()

    for (i = 0; i < search_text.length+ search_pattern.length + 3; i++) {
        td = row.insertCell();
        td.style.width = String(100/search_text.length) + "%";
        let text = NBSP;
        if (i < search_text.length) {
            text = search_text[i].replaceAll(" ", NBSP);
        }
        td.appendChild(document.createTextNode(text));
        if (i == bmh_s+bmh_i) {
            if (search_text[bmh_s + bmh_i] == search_pattern[bmh_i]) {
                td.className = "correct-td";
            } else {
                td.className = "incorrect-td";
            }
        } else if (i < search_pattern.length+bmh_s && i >= bmh_s + bmh_i) {
            td.className = "correct-td";
        }
    }

    row =  table.insertRow()
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < steps[vis_step][0]; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(NBSP));
        td.className = "zw-td";
    }


    for (i = 0; i < search_pattern.length; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(search_pattern[i].replaceAll(" ", NBSP)));
        td.className = "zw-td";
        if (i == bmh_i) {
            if (search_text[bmh_s + bmh_i] == search_pattern[bmh_i]) {
                td.className = "correct-td";
            } else {
                td.className = "incorrect-td";
            }
        } else if (i >= bmh_i) {
            td.className = "correct-td";
        }


    }

    row1 = table.insertRow();
    row2 = table.insertRow();
    for (i = 0; i <= bmh_s + bmh_i; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.className = "zw-td";
        td2.className = "zw-td";
        let text1 = NBSP, text2 = NBSP;
        if (bmh_s + bmh_i == i) {
            text1 = UARR;
            text2 = "i="+String(bmh_i);
        }
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let bmh_box = document.getElementById(vis_table_id);
    table.id = vis_table_id;
    bmh_box.replaceWith(table);


    // Add the pseudocode vis:
    table = document.createElement('table');
    table.id = bmh_pseudocode_table_id;
    row = table.insertRow()
    td = row.insertCell();
    let pseudocode_lines = [
        "\\texttt{function bmh\\_search(pattern, text):}",
        "\\qquad \\texttt{L} \\leftarrow \\texttt{create\\_shift\\_array(pattern)}",
        "\\qquad \\texttt{(s, i)} \\leftarrow \\texttt{(0, pattern\\_length - 1)}",
        "\\qquad \\texttt{while s < text\\_length - pattern\\_length}",
        "\\qquad \\qquad \\texttt{if text[s + i] != pattern[i]}",
        "\\qquad \\qquad \\qquad \\texttt{s} \\leftarrow \\texttt{L[text[s + pattern\\_length - 1]]}",
        "\\qquad \\qquad \\qquad \\texttt{i} \\leftarrow \\texttt{pattern\\_length - 1)}",
        "\\qquad \\qquad \\texttt{else if i = 0}",
        "\\qquad \\qquad \\qquad  \\texttt{return s}",
        "\\qquad \\qquad \\texttt{else}",
        "\\qquad \\qquad \\qquad \\texttt{i} \\leftarrow \\texttt{i - 1}",
        "\\qquad \\texttt{return not\\_found}",
        "~",
        "\\texttt{function create\\_shift\\_array(pattern):}",
        "\\qquad // \\texttt{ for alphabet } \\sigma \\texttt{ such as ASCII } \\sigma=\\texttt{256}",
        "\\qquad \\texttt{for v} \\leftarrow \\texttt{0 to } \\sigma \\texttt{ - 1}",
        "\\qquad \\qquad \\texttt{L[v]} \\leftarrow \\texttt{pattern\\_length}",
        "\\qquad \\texttt{for i} \\leftarrow \\texttt{0 to pattern\\_length - 2}",
        "\\qquad \\qquad \\texttt{L[pattern[i]]} \\leftarrow \\texttt{pattern\\_length - i - 1}",

    ]

    let highlight_index = steps[vis_step][2];

    for (i = 0; i < pseudocode_lines.length; i++) {
        td.className = "pseudocode-td";
        katex.render(pseudocode_lines[i], td, {
            throwOnError: false
        });

        if ( (highlight_index == 0 && (i == 4 || i == 5 || i == 6))
            || (highlight_index == 1 && (i == 7 || i == 8 ))
            || (highlight_index == 2 && (i == 9 || i == 10 ))
            || (highlight_index == 3 && (i == 11))
        ) {

            td.className = "pseudocode-highlighted-td";
        }

        row = table.insertRow();
        td = row.insertCell();
    }
    document.getElementById(bmh_pseudocode_table_id).replaceWith(table);
}

