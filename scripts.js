// Todo: Make this entire file less messy...
import {build_suffix_array, search_suffix_array} from "./suffix-array-alg.js";
import {update_suffix_array} from "./suffix-array-vis.js";
import {bmh_search, bmh_bad_shift_array} from "./bmh-alg.js";
import {add_bmh_shift_array_html, update_bmh_vis} from "./bmh-vis.js";

import {kmp_search, kmp_failure_function} from "./kmp-alg.js";
import {update_kmp_vis, update_failure_func} from "./kmp-vis.js";

var vis_step = 0;
var max_vis_step = 0;

var found; 
var steps; 

var search_pattern;
var search_text;

var unsorted_suffix_array, sorted_suffix_array
var mode;

const next_step_btn = document.getElementById("next-step-btn");
const prev_step_btn = document.getElementById("prev-step-btn");

window.next_vis_step = next_vis_step;
window.prev_vis_step = prev_vis_step;
window.get_kmp_strings = get_kmp_strings;
window.get_bmh_strings = get_bmh_strings;
window.get_suffix_array_strings = get_suffix_array_strings;

function next_vis_step() {
    prev_step_btn.disabled = false;
    if (vis_step < max_vis_step) {
        vis_step += 1;
        if (mode == "KMP") {
            update_kmp_vis(steps, found, vis_step, search_pattern, search_text);
        } else if (mode == "BMH") {
            update_bmh_vis(steps, found, vis_step, search_pattern, search_text);
        } else if (mode == "SUFARR") {
            let [min, mid, max] = steps[vis_step];
            update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern, min, mid, max);
            MathJax.typeset();
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
            update_kmp_vis(steps, found, vis_step, search_pattern, search_text);
        } else if (mode == "BMH") {
            update_bmh_vis(steps, found, vis_step, search_pattern, search_text);
    
        } else if (mode == "SUFARR") {
            let [min, mid, max] = steps[vis_step];
            update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern, min, mid, max);
            MathJax.typeset();
        }
    } 
    if (vis_step == 0) {
        prev_step_btn.disabled = true;
    }    
}

function get_kmp_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
    if (search_pattern.length == 0 || search_text.length == 0) {
        return;
    }

    const failure_func = kmp_failure_function(search_pattern);
    [found, steps] = kmp_search(search_pattern, search_text);

    max_vis_step = steps.length - 1;
    
    mode = "KMP"; 
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    // clear the suffix info
    let infolist = document.createElement('ol');
    infolist.id = "infolist";
    document.getElementById("infolist").replaceWith(infolist);

    update_kmp_vis(steps, found, vis_step, search_pattern, search_text);
    update_failure_func(failure_func);
}

function get_bmh_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
    if (search_pattern.length == 0 || search_text.length == 0) {
        return;
    }

    const bad_shift_array = bmh_bad_shift_array(search_pattern);
    [found, steps] = bmh_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;
    
    
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    mode = "BMH";
    // clear the suffix info
    let infolist = document.createElement('ol');
    infolist.id = "infolist";
    document.getElementById("infolist").replaceWith(infolist);

    update_bmh_vis(steps, found, vis_step, search_pattern, search_text);
    add_bmh_shift_array_html(bad_shift_array);
}

function get_suffix_array_strings() {
    search_pattern = document.getElementById("search_pattern").value;
    search_text = document.getElementById("search_text").value;
    [unsorted_suffix_array, sorted_suffix_array] = build_suffix_array(search_text);
    [steps, found] = search_suffix_array(search_pattern, search_text);
    let [min, mid, max] = steps[0];
    update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern,min,mid,max);
    mode = "SUFARR";
    vis_step = 0;
    max_vis_step = steps.length - 1;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;


    const suffix_steps = [
        "Create array \\(T_{i}\\) of pointers to suffixes in text ", 
        "Sort array of suffix pointers lexagraphically to get \\(T_{S[i]}\\)", 
        "Binary search the sorted suffix array, looking for the pattern, comparing at worst \\(m\\) characters each time, before determining a string is not a prefix",
        "If all \\(m\\) characters match, the pattern occurs at location \\(S[i]\\)"
    ];


    const info = document.createElement("ol");

    suffix_steps.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        info.appendChild(li);
    });
    info.id = "infolist";
    document.getElementById("infolist").replaceWith(info);

    // clear the kmp table
    let table = document.createElement('table');
    table.id = "KMPTABLE";
    document.getElementById("KMPTABLE").replaceWith(table);
    
    MathJax.typeset();
}