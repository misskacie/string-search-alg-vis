export{update_bmh_vis, add_bmh_shift_array_html};
let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑
let NBSP = "\u00A0" // non breaking space, so that spaces are preserved in copied string
var i, td, td1, td2;
const vis_table_id = "BMHTABLE";
const shift_table_id = "BMHFAILURE";

function add_bmh_shift_array_html(bad_shift_array, search_pattern){
    let table = document.createElement('table');
    let row1 =  table.insertRow()
    let row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.appendChild(document.createTextNode("P[]"));
    td2.appendChild(document.createTextNode("L[]"));
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

    for (i = 0; i < search_text.length; i++) {
        td = row.insertCell();
        td.style.width = String(100/search_text.length) + "%";
        td.appendChild(document.createTextNode(search_text[i]));
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
        td.appendChild(document.createTextNode(search_pattern[i]));
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
}

