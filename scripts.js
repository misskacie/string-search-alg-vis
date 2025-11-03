// Todo: Make this entire file less messy...
var vis_step = 0;
var max_vis_step = 0;
var found; var steps; 
var search_pattern;
var search_text;
var failure_func;
var failure_steps;
var mode;
var bad_shift_array;
const CELL_PAD = "5pt";

let DARR = "\u2193" // ↓
let UARR = "\u2191" // ↑

function update_failure_func(){
    let table = document.createElement('table');
    let row1 =  table.insertRow()
    let row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td2.style.padding = CELL_PAD;
    td1.appendChild(document.createTextNode("P[]"));
    td2.appendChild(document.createTextNode("F[]"));
    
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < search_pattern.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td2.style.padding = CELL_PAD;
        td1.appendChild(document.createTextNode(search_pattern[i]));
        td2.appendChild(document.createTextNode(failure_func[i]));
        
    }
    table.id = "KMPFAILURE";
    document.getElementById("KMPFAILURE").replaceWith(table);
}

function update_kmp_vis() {
    let table = document.createElement('table');
    let kmp_s = steps[vis_step][0];
    let kmp_i = steps[vis_step][1];

    let row1 = table.insertRow();
    let row2 = table.insertRow();
    for (i = 0; i < search_text.length; i++) {
        td1 = row1.insertCell();
        
        td2 = row2.insertCell();
        td1.style.maxWidth = "0pt";
        
        let text1 = "", text2 = "";
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
        td.style.padding = CELL_PAD;
        td.style.width = String(100/search_text.length) + "%";
        td.appendChild(document.createTextNode(search_text[i]));
        if (i == kmp_s+kmp_i) {
            if (search_text[kmp_s + kmp_i] == search_pattern[kmp_i]) {
            td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
        } else if (i < kmp_i+kmp_s && i >= kmp_s) {
           td.style.backgroundColor = '#00FF00'; 
        }
    }

    row =  table.insertRow()
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < steps[vis_step][0]; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(""));
    }


    for (i = 0; i < search_pattern.length; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(search_pattern[i]));
        td.style.padding = CELL_PAD;
        td.style.width = String(100/search_text.length) + "%";
        if (i == kmp_i) {
            if (search_text[kmp_s + kmp_i] == search_pattern[kmp_i]) {
            td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
        } else if (i < kmp_i) {
           td.style.backgroundColor = '#00FF00'; 
        }
        
        
    }

    row1 = table.insertRow();
    row2 = table.insertRow();
    for (i = 0; i < search_text.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td2.style.maxWidth = "0pt";

        let text1 = "", text2 = "";
        if (kmp_s + kmp_i == i) {
            text1 = UARR;
            text2 = "i="+String(kmp_i);
        } 
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
        
    }

    let kmp_box = document.getElementById("KMPTABLE");
    table.id = "KMPTABLE";
    kmp_box.replaceWith(table);
}

const next_step_btn = document.getElementById("next-step-btn");
const prev_step_btn = document.getElementById("prev-step-btn");

function next_vis_step() {
    prev_step_btn.disabled = false;
    if (vis_step < max_vis_step) {
        vis_step += 1;
        if (mode == "KMP") {
            update_kmp_vis();
        } else if (mode == "BMH") {
            update_bmh_vis();
        }
        
    }

    if (vis_step == max_vis_step) {
        next_step_btn.disabled = true;
    }   
}

function prev_vis_step() {
    next_step_btn.disabled = false;
    if (vis_step > 0) {
        vis_step -= 1;
        if (mode == "KMP") {
            update_kmp_vis();
        } else if (mode == "BMH") {
            update_bmh_vis();
        }
    } 
    if (vis_step == 0) {
        prev_step_btn.disabled = true;
    }    
}

function get_kmp_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
   
    [found, steps] = kmp_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;
    
    mode = "KMP"; 
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    update_kmp_vis();
    update_failure_func();
}

function get_kmp_failure_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
   
    [found, steps] = kmp_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;
    
    
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    update_failure_func();
}


function kmp_search(pattern, text) {
    failure_func = kmp_failure_function(pattern);
    var s = 0;
    var i = 0;

    steps = [];
    found = [];
    
    while (s <= text.length - pattern.length) {
        steps.push([s,i]);
        if(text[s+i] == pattern[i]) {
            i = i + 1;
            if (i == pattern.length) {
                found.push(s);
                return [found, steps];
            }
        } else {
            
            s = s + i - failure_func[i];
            i = Math.max(failure_func[i], 0)
        }
    }
    return [found, steps];
}

function kmp_failure_function(pattern) {
    var F = [-1,0];
    var s = 2;
    var c = 0;

    failure_steps = [];

    while (s < pattern.length) {
        failure_steps.push([s,c])
        if (pattern[c] == pattern[s-1]) {
            c = c + 1;
            F[s] = c;
            s = s + 1;
        } else if (c > 0) {
            c = F[c]
        } else {
            F[s] = 0
            s = s + 1
            
        }
    }

    return F; 
}


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
        bad_shift_array = bmh_bad_shift_array(pattern);
        // console.log(bad_shift_array);
        steps = [];
        found = [];

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


function get_bmh_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
    // console.log(search_pattern, search_text);
    [found, steps] = bmh_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;
    
    // console.log(steps);
    // console.log(found);
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    mode = "BMH";
    update_bmh_vis();
    add_bmh_shift_array_html();
}

function add_bmh_shift_array_html(){
    let table = document.createElement('table');
    let row1 =  table.insertRow()
    let row2 = table.insertRow()
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.appendChild(document.createTextNode("P[]"));
    td2.appendChild(document.createTextNode("L[]"));
    td2.style.padding = CELL_PAD;
    // Add padding for the offset alignment of pattern to text
    for (const [key, value] of bad_shift_array.entries()) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td2.style.padding = CELL_PAD;
        td1.appendChild(document.createTextNode(key));
        td2.appendChild(document.createTextNode(value));
    }
    td1 = row1.insertCell();
    td2 = row2.insertCell();
    td1.style.maxWidth = "0pt";
    td2.style.padding = CELL_PAD;
    td1.appendChild(document.createTextNode('rest'));
    td2.appendChild(document.createTextNode(search_pattern.length));

    table.id = "KMPFAILURE";
    document.getElementById("KMPFAILURE").replaceWith(table);
}


function update_bmh_vis() {
    let table = document.createElement('table');
    let bmh_s = steps[vis_step][0];
    let bmh_i = steps[vis_step][1];
    let row1 = table.insertRow();
    let row2 = table.insertRow();
    for (i = 0; i < search_text.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.style.maxWidth = "0pt";
        let text1 = "", text2 = "";
        if (bmh_s == i) {
            text1 = "s="+String(bmh_s);
            text2 = DARR;
        } 
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let row =  table.insertRow()

    for (i = 0; i <search_text.length; i++) {
        td = row.insertCell();
        td.style.padding = CELL_PAD;
        td.style.width = String(100/search_text.length) + "%";
        td.appendChild(document.createTextNode(search_text[i]));
        if (i == bmh_s+bmh_i) {
            if (search_text[bmh_s + bmh_i] == search_pattern[bmh_i]) {
            td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
        } else if (i < search_pattern.length+bmh_s && i >= bmh_s + bmh_i) {
           td.style.backgroundColor = '#00FF00'; 
        }
    }

    row =  table.insertRow()
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i < steps[vis_step][0]; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(""));
    }


    for (i = 0; i < search_pattern.length; i++) {
        td = row.insertCell();
        td.appendChild(document.createTextNode(search_pattern[i]));
        td.style.padding = CELL_PAD;
        td.style.width = String(100/search_text.length) + "%";
        if (i == bmh_i) {
            if (search_text[bmh_s + bmh_i] == search_pattern[bmh_i]) {
            td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
        } else if (i >= bmh_i) {
           td.style.backgroundColor = '#00FF00'; 
        }
        
        
    }

    row1 = table.insertRow();
    row2 = table.insertRow();
    for (i = 0; i < search_text.length; i++) {
        td1 = row1.insertCell();
        td2 = row2.insertCell();
        td1.style.width = String(100/search_text.length) + "%";
        td2.style.maxWidth = "0pt";
        // td2.style.textAlign = "right";
        let text1 = "", text2 = "";
        if (bmh_s + bmh_i == i) {
            text1 = UARR;
            text2 = "i="+String(bmh_i);
        } 
        td1.appendChild(document.createTextNode(text1));
        td2.appendChild(document.createTextNode(text2));
    }

    let bmh_box = document.getElementById("KMPTABLE");
    table.id = "KMPTABLE";
    bmh_box.replaceWith(table);
}