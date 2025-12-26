export {update_kmp_vis, update_failure_func};

let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑
let NBSP = "\u00A0" // non breaking space, so that spaces are preserved in copied string
var i, td, td1, td2;

const vis_table_id = "KMPTABLE";
const failure_table_id = "KMPFAILURE";

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

    for (i = 0; i <search_text.length; i++) {
        td = row.insertCell();
        td.style.width = String(100 / search_text.length) + "%";
        td.style.maxWidth = String(100 / search_text.length) + "%";
        td.appendChild(document.createTextNode(search_text[i]));
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
        if (i == kmp_i) {
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
}