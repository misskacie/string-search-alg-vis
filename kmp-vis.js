export {update_kmp_vis, update_failure_func};

let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑
let NBSP = "\u00A0" // non breaking space, so that spaces are preserved in copied string
var i, td, td1, td2;

const vis_table_id = "KMPTABLE";
const failure_table_id = "KMPFAILURE";
const kmp_pseudocode_table_id = "KMP-PSEUDOCODE";

function update_failure_func(failure_func, search_pattern){
    let table = document.createElement('table');
    let row1 =  table.insertRow()
    let row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.appendChild(document.createTextNode("P[]"));
    td2.appendChild(document.createTextNode("F[]"));

    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < search_pattern.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.appendChild(document.createTextNode(search_pattern[i]));
        td2.appendChild(document.createTextNode(failure_func[i]));

    }
    table.id = failure_table_id;
    document.getElementById(failure_table_id).replaceWith(table);
}

function update_kmp_vis(steps, found, vis_step, search_pattern, search_text) {
    // Add padding so Ed sizes the box correctly
    let pad_ed = document.getElementById("pad-ed");
    if (pad_ed){
        pad_ed.remove();
    }

    let table = document.createElement('table');
    let kmp_s = steps[vis_step][0];
    let kmp_i = steps[vis_step][1];

    let row1 = table.insertRow();
    let row2 = table.insertRow();
    for (i = 0; i <= kmp_s; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.className = "zw-td";
        td2.className = "zw-td";
        let text1 = NBSP, text2 = NBSP;
        if (kmp_s == i) {
            text1 = "s="+String(kmp_s);
            text2 = DARR;
        }

        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let row =  table.insertRow()

    // Add empty cells at end so i counter is not clipped
    for (i = 0; i < search_text.length + search_pattern.length + 3; i++) {
        td = row.insertCell();
        td.style.width = String(100 / search_text.length) + "%";
        td.style.maxWidth = String(100 / search_text.length) + "%";
        let text = NBSP;
        if (i < search_text.length) {
            text = search_text[i]
        }
        td.appendChild(document.createTextNode(text));
        if (i - kmp_s < search_pattern.length) {
            if (i == kmp_s+kmp_i) {
                if (search_text[kmp_s + kmp_i] == search_pattern[kmp_i]) {
                    td.className = "correct-td";
                } else {
                    td.className = "incorrect-td";
                }
            } else if (i < kmp_i+kmp_s && i >= kmp_s) {
                td.className = "correct-td";
            }
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
        td.appendChild(document.createTextNode(search_pattern[i]));
        if (i == kmp_i && i < search_pattern.length) {
            if (search_text[kmp_s + kmp_i] == search_pattern[kmp_i]) {
                td.className = "correct-td";
            } else {
                td.className = "incorrect-td";

            }
        } else if (i < kmp_i) {
            td.className = "correct-td";
        }
    }


    row1 = table.insertRow();
    row2 = table.insertRow();
    for (i = 0; i <= kmp_s + kmp_i; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();

        td1.className = "zw-td";
        td2.className = "zw-td";

        let text1 = NBSP, text2 = NBSP;
        if (kmp_s + kmp_i == i) {
            text1 = UARR;
            text2 = "i="+String(kmp_i);
        }
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));

    }

    let kmp_box = document.getElementById(vis_table_id);
    table.id = vis_table_id;
    kmp_box.replaceWith(table);


    // Add the pseudocode vis:
    table = document.createElement('table');
    table.id = kmp_pseudocode_table_id;
    row = table.insertRow()
    td = row.insertCell();
    let pseudocode_lines = [
        "\\texttt{function kmp\\_search(pattern, text):}",
        "\\qquad \\texttt{F} \\leftarrow \\texttt{kmp\\_failure\\_func(pattern)}",
        "\\qquad \\texttt{(s, i)} \\leftarrow \\texttt{(0, 0)}",
        "\\qquad \\texttt{while s < text\\_length - pattern\\_length}",
        "\\qquad \\qquad \\texttt{if text[s+i] = pattern[i]}",
        "\\qquad \\qquad \\qquad \\texttt{i} \\leftarrow \\texttt{i+1}",
        "\\qquad \\qquad \\qquad \\texttt{if i = m}",
        "\\qquad \\qquad \\qquad \\qquad \\texttt{return s}",
        "\\qquad \\qquad \\texttt{else}",
        "\\qquad \\qquad \\qquad \\texttt{s} \\leftarrow \\texttt{s+i-F[i]}",
        "\\qquad \\qquad \\qquad \\texttt{i} \\leftarrow \\texttt{max(F[i],0)}",
        "\\qquad \\texttt{return not\\_found}"
    ]

    let highlight_index = steps[vis_step][2];

    for (i = 0; i < pseudocode_lines.length; i++) {
        td.className = "pseudocode-td";
        katex.render(pseudocode_lines[i], td, {
            throwOnError: false
        });

        if ( (highlight_index == 0 && (i == 4 || i == 5))
            || (highlight_index == 1 && (i == 6 || i == 7 ))
            || (highlight_index == 2 && (i == 8 || i == 9 || i == 10 ))
            || (highlight_index == 3 && (i == 11))
        ) {

            td.className = "pseudocode-highlighted-td";
        }

        row = table.insertRow();
        td = row.insertCell();
    }
    document.getElementById(kmp_pseudocode_table_id).replaceWith(table);
}