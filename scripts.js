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
var unsorted_suffix_array, sorted_suffix_array;
var mode = "";

const next_step_btn = document.getElementById("next-step-btn");
const prev_step_btn = document.getElementById("prev-step-btn");
const vis_step_slider = document.getElementById("vis-step-slider");
const vis_speed_select = document.getElementById("vis-speed-select")
const play_btn = document.getElementById("play-btn");
const pause_btn = document.getElementById("pause-btn");
const reset_btn = document.getElementById("reset-btn");
const search_pattern_field = document.getElementById("search_pattern");
const search_text_field = document.getElementById("search_text");

window.next_vis_step = next_vis_step;
window.prev_vis_step = prev_vis_step;
window.reset_vis_step = reset_vis_step;
window.get_kmp_strings = get_kmp_strings;
window.get_bmh_strings = get_bmh_strings;
window.get_suffix_array_strings = get_suffix_array_strings;
window.start_autoplay = start_autoplay;
window.stop_autoplay = stop_autoplay;
window.update_vis_step_slider = update_vis_step_slider;

/*

Refresh Functions

*/

function refresh_vis_frame() {
    vis_step_slider.max = max_vis_step;
    vis_step_slider.value = vis_step;

    if (mode == "KMP") {
        update_kmp_vis(steps, found, vis_step, search_pattern, search_text);
    } else if (mode == "BMH") {
        update_bmh_vis(steps, found, vis_step, search_pattern, search_text);
    } else if (mode == "SUFARR") {
        let [min, mid, max] = steps[vis_step];
        update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern, min, mid, max);
    }
}

function on_alg_select() {
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    vis_step_slider.disabled = false;
    vis_speed_select.disabled = false;
    play_btn.disabled = false;
    reset_btn.disabled = false;
    vis_step = 0;

    search_pattern = search_pattern_field.value;
    search_text = search_text_field.value;
    if (search_pattern.length == 0 || search_text.length == 0) {
        return false;
    }
    return true;
}

/*

Algorithm Selection Button Handlers

*/

function get_kmp_strings() {
    if (!on_alg_select()) {
        return;
    }
    const failure_func = kmp_failure_function(search_pattern);
    [found, steps] = kmp_search(search_pattern, search_text);

    max_vis_step = steps.length - 1;

    mode = "KMP";
    // clear the suffix info
    let infolist = document.createElement('ol');
    infolist.id = "infolist";
    document.getElementById("infolist").replaceWith(infolist);

    //update_kmp_vis(steps, found, vis_step, search_pattern, search_text);
    refresh_vis_frame();
    update_failure_func(failure_func, search_pattern);
}

function get_bmh_strings() {
    if (!on_alg_select()) {
        return;
    }

    const bad_shift_array = bmh_bad_shift_array(search_pattern);
    [found, steps] = bmh_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;

    mode = "BMH";
    // clear the suffix info
    let infolist = document.createElement('ol');
    infolist.id = "infolist";
    document.getElementById("infolist").replaceWith(infolist);

    //update_bmh_vis(steps, found, vis_step, search_pattern, search_text);
    refresh_vis_frame();
    add_bmh_shift_array_html(bad_shift_array, search_pattern);
}

function get_suffix_array_strings() {
    if (!on_alg_select()) {
        return;
    }
    [unsorted_suffix_array, sorted_suffix_array] = build_suffix_array(search_text);
    [steps, found] = search_suffix_array(search_pattern, search_text);
    let [min, mid, max] = steps[0];
    //update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern,min,mid,max);
    mode = "SUFARR";
    max_vis_step = steps.length - 1;

    refresh_vis_frame();


    const suffix_steps = [
        "Create array of pointers i to suffixes in text \\(T_{i}\\)  ",
        "Sort array of suffix pointers lexagraphically to get \\(S[i]\\)",
        "Binary search the sorted suffix array, looking for the pattern, comparing at worst \\(m\\) characters each time, before determining a string is not a prefix",
        "If all \\(m\\) characters match, the pattern occurs at location \\(S[i]\\)"
    ];


    const info = document.createElement("ol");

    suffix_steps.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        info.appendChild(li);
        renderMathInElement(li);
    });
    info.id = "infolist";
    document.getElementById("infolist").replaceWith(info);

    // clear the kmp table
    let table = document.createElement('table');
    table.id = "KMPTABLE";
    document.getElementById("KMPTABLE").replaceWith(table);
}

/*

Visualisation Control Button Handlers

*/

function next_vis_step() {
    prev_step_btn.disabled = false;
    if (vis_step < max_vis_step) {
        vis_step += 1;
        refresh_vis_frame();
    }

    if (vis_step == max_vis_step) {
        next_step_btn.disabled = true;
    }
}

function prev_vis_step() {
    next_step_btn.disabled = false;
    if (vis_step > 0) {
        vis_step -= 1;
        refresh_vis_frame();
    }
    if (vis_step == 0) {
        prev_step_btn.disabled = true;
    }
}

function reset_vis_step() {
    stop_autoplay();
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;

    refresh_vis_frame();
}

// Allow for using mouse wheel to change vis_step
vis_step_slider.addEventListener("wheel", function(e) {
    // Force vis_step updater to run
    var event = new Event('input', {bubbles: true});
    vis_step_slider.dispatchEvent(event);

    e.preventDefault();
    e.stopPropagation();

    // Determine scroll direction (deltaY < 0 for scroll up, > 0 for scroll down)
    if (e.deltaY < 0) {
        vis_step_slider.stepUp();
    } else {
        vis_step_slider.stepDown();
    }
});


function update_vis_step_slider(step) {
    vis_step = parseInt(step, 10);
    refresh_vis_frame();
}

/*

Auto Play Functions

*/

let autoplayInterval = null;

vis_speed_select.addEventListener("input", function(e) {
    if (autoplayInterval != null) {
        stop_autoplay();
        start_autoplay();
    }
});


function start_autoplay() {
    if (autoplayInterval !== null){
        return;
    }
    if (vis_step == max_vis_step) {
        reset_vis_step();
    }

    const delay = parseInt(vis_speed_select.value, 10);

    play_btn.disabled = true;
    pause_btn.disabled = false;

    autoplayInterval = setInterval(() => {
        next_vis_step();

        if (next_step_btn.disabled) {
            stop_autoplay();
        }
    }, delay);
}

function stop_autoplay() {
    if (autoplayInterval !== null) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }

    play_btn.disabled = false;
    pause_btn.disabled = true;
}
