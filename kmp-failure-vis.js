export {update_failure_func_vis};

let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑
let NBSP = "\u00A0" // non breaking space, so that spaces are preserved in copied string
var i, td, td1, td2;

const failure_table_id = "KMPFAILURETABLE";
const failure_pseudocode_table_id = "KMPFAILURE-PSEUDOCODE";

function update_failure_func_vis(failure_func, failure_steps, vis_step, search_pattern){
    let table = document.createElement('table');

    let kmp_s = failure_steps[vis_step][0];
    let kmp_c = failure_steps[vis_step][1];
    let highlight_index = failure_steps[vis_step][2];

    let row1 = table.insertRow();
    let row2 = table.insertRow();
    // Add space for the P[] and F[] labels
    td1 = row1.insertCell();
    td2 = row2.insertCell();

    // value of s can be 1 higher than search pattern length
    for (i = 0; i <= search_pattern.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.className = "zw-td";
        td2.className = "zw-td";
        let text1 = NBSP, text2 = NBSP;
        if (kmp_s == i) {
            text1 = "s="+String(kmp_s);
            text2 = DARR;
        } else if (kmp_c == i) {
            text1 = "c="+String(kmp_c);
            text2 = DARR;
        }

        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    row1 =  table.insertRow()
    row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.appendChild(document.createTextNode("P[]"));
    td2.appendChild(document.createTextNode("F[]"));

    // Add padding for the offset alignment of pattern to text
    // Add empty cells at end so s counter is not clipped
     for (i = 0; i < search_pattern.length + 3; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.style.minWidth = '1em'
        td2.className = "zw-td";
        let text1 = NBSP, text2 = NBSP;
        if (i < search_pattern.length) {
            text1 = search_pattern[i];
            // Only show built failure function parts
            if (i < kmp_s) {
                text2 = failure_func[i];
            }
        }

        if (i < kmp_c) {
            td1.className = "half-color-prefix-td";
        }
        if (kmp_c != 0 && i >= kmp_s - kmp_c - 1 && i < kmp_s - 1) {
            td1.className = "half-color-suffix-td";
        }
        if (i < kmp_c && i >= kmp_s - kmp_c - 1 && i < kmp_s - 1) {
            td1.className = "half-color-overlap-td";
        }

        if (search_pattern[kmp_c] == search_pattern[kmp_s -1]) {
            if (i == kmp_c) {
                if (td1.className == "half-color-suffix-td") {
                    td1.className = "half-color-overlap-correct-prefix-td";
                } else {
                    td1.className = "half-color-correct-prefix-td";
                }
            }
            if (i == kmp_s - 1) {
                td1.className = "half-color-correct-suffix-td";
            }
        } else {
            if (i == kmp_c) {
                if (td1.className == "half-color-suffix-td") {
                    td1.className = "half-color-overlap-incorrect-prefix-td";
                } else {
                    td1.className = "half-color-incorrect-prefix-td";
                }
            }
            if (i == kmp_s - 1) {
                td1.className = "half-color-incorrect-suffix-td";
            }
        }

        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }
    table.id = failure_table_id;
    document.getElementById(failure_table_id).replaceWith(table);

    // Add the pseudocode vis:
    table = document.createElement('table');
    table.id = failure_pseudocode_table_id;
    let row =  table.insertRow()
    let td = row.insertCell();
    let pseudocode_lines = [
        "\\texttt{function kmp\\_failure\\_func(pattern):}",
        "\\qquad \\texttt{(c, s)} \\leftarrow \\texttt{(0, 2)}",
        "\\qquad \\texttt{F[0], F[1]} \\leftarrow \\texttt{-1, 0}",
        "\\qquad \\texttt{while s < pattern\\_length}",
        "\\qquad \\qquad \\texttt{if pattern[c] = pattern[s-1]}",
        "\\qquad \\qquad \\qquad \\texttt{(c, F[s], s)} \\leftarrow \\texttt{(c+1, c+1, s+1)}",
        "\\qquad \\qquad \\texttt{else if c > 0}",
        "\\qquad \\qquad \\qquad \\texttt{c} \\leftarrow \\texttt{F[c]}",
        "\\qquad \\qquad \\texttt{else}",
        "\\qquad \\qquad \\qquad \\texttt{(F[s], s)} \\leftarrow \\texttt{(0, s+1)}",
        "\\qquad \\texttt{return F}"
    ]


    for (i = 0; i < pseudocode_lines.length; i++) {
        td.className = "pseudocode-td";
        katex.render(pseudocode_lines[i], td, {
            throwOnError: false
        });

        if ( (highlight_index == 0 && (i == 1 || i == 2))
            || (highlight_index == 1 && (i == 4 || i == 5 ))
            || (highlight_index == 2 && (i == 6 || i == 7 ))
            || (highlight_index == 3 && (i == 8 || i == 9 ))
            || (highlight_index == 4) && (i == 10)
        ) {

            td.className = "pseudocode-highlighted-td";
        }

        row = table.insertRow();
        td = row.insertCell();
    }
    document.getElementById(failure_pseudocode_table_id).replaceWith(table);
}


