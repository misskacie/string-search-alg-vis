import {build_suffix_array, search_suffix_array} from "./suffix-array-alg.js";
import {update_suffix_array} from "./suffix-array-vis.js";
import {bmh_search, bmh_bad_shift_array} from "./bmh-alg.js";
import {add_bmh_shift_array_html, update_bmh_vis} from "./bmh-vis.js";
import {kmp_search, kmp_failure_function} from "./kmp-alg.js";
import {update_kmp_vis, update_failure_func} from "./kmp-vis.js";
import {update_failure_func_vis} from "./kmp-failure-vis.js";

var vis_step = 0;
var max_vis_step = 0;
var found;
var steps;
var search_pattern;
var search_text;
var unsorted_suffix_array, sorted_suffix_array;
var mode = "";

const root = document.documentElement;
const select_suf_arr_btn = document.getElementById("select-suf-arr-btn");
const select_bmh_btn = document.getElementById("select-bmh-btn");
const select_kmp_btn = document.getElementById("select-kmp-btn");
const select_kmp_failure_btn = document.getElementById("select-kmp-failure-btn");
const next_step_btn = document.getElementById("next-step-btn");
const prev_step_btn = document.getElementById("prev-step-btn");

const vis_step_slider = document.getElementById("vis-step-slider");
const vis_speed_slider = document.getElementById("vis-speed-slider");
const vis_padding_slider = document.getElementById("vis-padding-slider");
const vis_fontsize_slider = document.getElementById("vis-fontsize-slider");
const style_reset_btn = document.getElementById("style-reset-btn");

const play_btn = document.getElementById("play-btn");
const pause_btn = document.getElementById("pause-btn");
const reset_btn = document.getElementById("reset-btn");
const search_pattern_field = document.getElementById("search_pattern");
const search_text_field = document.getElementById("search_text");

const kmp_vis_div = document.getElementById("kmp-vis-div");
const kmp_failure_vis_div = document.getElementById("kmp-failure-vis-div");
const bmh_vis_div = document.getElementById("bmh-vis-div");
const suffix_array_vis_div = document.getElementById("suffix-array-vis-div");
const info_box_div = document.getElementById("info-box-div");

var failure_func, failure_steps;
/*

Refresh Functions

*/

function refresh_vis_frame() {
    vis_step_slider.max = max_vis_step;
    vis_step_slider.value = vis_step;

    prev_step_btn.disabled = false;
    next_step_btn.disabled = false;

    if (vis_step == max_vis_step) {
        next_step_btn.disabled = true;
    }

    if (vis_step == 0) {
        prev_step_btn.disabled = true;
    }

    if (mode == "KMP") {
        update_kmp_vis(steps, found, vis_step, search_pattern, search_text);
    } else if (mode == "KMP-FAILURE") {
        update_failure_func_vis(failure_func, failure_steps, vis_step, search_pattern);
    } else if (mode == "BMH") {
        update_bmh_vis(steps, found, vis_step, search_pattern, search_text);
    } else if (mode == "SUFARR") {
        let [min, mid, max] = steps[vis_step];
        update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern, min, mid, max);
    }
}

function on_alg_select() {
    stop_autoplay();
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    vis_step_slider.disabled = false;
    vis_speed_slider.disabled = false;
    vis_padding_slider.disabled = false;
    vis_fontsize_slider.disabled = false;

    play_btn.disabled = false;
    reset_btn.disabled = false;

    kmp_vis_div.hidden = true;
    kmp_failure_vis_div.hidden = true;
    bmh_vis_div.hidden = true;
    suffix_array_vis_div.hidden = true;
    info_box_div.hidden = true;

    select_bmh_btn.className = "btn btn-unselected";
    select_kmp_btn.className = "btn btn-unselected";
    select_kmp_failure_btn.className = "btn btn-unselected";
    select_suf_arr_btn.className = "btn btn-unselected";


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
    var failure_func, failure_steps;
    [failure_func, failure_steps] = kmp_failure_function(search_pattern);
    [found, steps] = kmp_search(search_pattern, search_text);

    max_vis_step = steps.length - 1;

    mode = "KMP";
    refresh_vis_frame();
    update_failure_func(failure_func, search_pattern);
    kmp_vis_div.hidden = false;
    select_kmp_btn.className = "btn btn-selected";
}

function vis_kmp_failure_func() {
    if (!on_alg_select()) {
        return;
    }
    [failure_func, failure_steps] = kmp_failure_function(search_pattern);

    max_vis_step = failure_steps.length - 1;

    mode = "KMP-FAILURE";
    refresh_vis_frame();
    update_failure_func_vis(failure_func, failure_steps, vis_step, search_pattern);
    kmp_failure_vis_div.hidden = false;
    select_kmp_failure_btn.className = "btn btn-selected";
}

function get_bmh_strings() {
    if (!on_alg_select()) {
        return;
    }

    const bad_shift_array = bmh_bad_shift_array(search_pattern);
    [found, steps] = bmh_search(search_pattern, search_text);
    max_vis_step = steps.length - 1;

    mode = "BMH";
    refresh_vis_frame();
    add_bmh_shift_array_html(bad_shift_array, search_pattern);
    bmh_vis_div.hidden = false;
    select_bmh_btn.className = "btn btn-selected";
}

function get_suffix_array_strings() {
    if (!on_alg_select()) {
        return;
    }
    [unsorted_suffix_array, sorted_suffix_array] = build_suffix_array(search_text);
    [steps, found] = search_suffix_array(search_pattern, search_text);
    let [min, mid, max] = steps[0];
    mode = "SUFARR";
    max_vis_step = steps.length - 1;

    refresh_vis_frame();


    const suffix_steps = [
        "Create array of pointers i to suffixes in text \\(T_{i}\\)  ",
        "Sort array of suffix pointers lexagraphically to get \\(S[i]\\)",
        "Binary search the sorted suffix array, looking for the pattern, comparing at worst \\(\\\\ \\)\\(\\texttt{pattern\\_length}\\) characters " +
        "each time, before determining the \\(\\texttt{pattern}\\) is not a prefix",
        "If all \\(\\texttt{pattern\\_length}\\) characters match, the pattern occurs at location \\(S[i]\\)"
    ];

    const info = document.createElement("ol");

    suffix_steps.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        info.appendChild(li);
        renderMathInElement(li);
    });
    info.id = "sufarrinfolist";
    document.getElementById("sufarrinfolist").replaceWith(info);

    suffix_array_vis_div.hidden = false;
    select_suf_arr_btn.className = "btn btn-selected";
}


/*

Frame Control Functions

*/

function next_vis_step() {
    if (vis_step < max_vis_step) {
        vis_step += 1;
        refresh_vis_frame();
    }

}

function prev_vis_step() {
    if (vis_step > 0) {
        vis_step -= 1;
        refresh_vis_frame();
    }
}

function reset_vis_step() {
    vis_step = 0;
    next_step_btn.disabled = false;
    prev_step_btn.disabled = true;
    refresh_vis_frame();
}

/*

Auto Play Functions

*/

let autoplayInterval = null;

function start_autoplay() {
    if (autoplayInterval !== null){
        return;
    }
    if (vis_step == max_vis_step) {
        reset_vis_step();
    }

    // reverse slider value mapping to make it more intuitive
    const delay = parseInt(vis_speed_slider.max, 10) - parseInt(vis_speed_slider.value, 10);

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

/*

Visualisation Control Input Handlers

*/

function setCookie(name, value) {
    // ;path=/ makes the cookie available across the entire website
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


select_kmp_btn.addEventListener("click", function(e) {
    get_kmp_strings();
});

select_kmp_failure_btn.addEventListener("click", function(e) {
    vis_kmp_failure_func();
});

select_bmh_btn.addEventListener("click", function(e) {
    get_bmh_strings();
});

select_suf_arr_btn.addEventListener("click", function(e) {
    get_suffix_array_strings();
});

next_step_btn.addEventListener("click", function(e) {
    stop_autoplay();
    next_vis_step();
});

prev_step_btn.addEventListener("click", function(e) {
    stop_autoplay();
    prev_vis_step();
});

reset_btn.addEventListener("click", function(e) {
    stop_autoplay();
    reset_vis_step();
});

play_btn.addEventListener("click", function(e) {
    start_autoplay();
});

pause_btn.addEventListener("click", function(e) {
    stop_autoplay();
});


vis_speed_slider.addEventListener("input", function(e) {
    if (autoplayInterval !== null) {
        stop_autoplay();
        start_autoplay();
    }
    localStorage.setItem("vis-speed",this.value);
});

vis_step_slider.addEventListener("input", function(e) {
    vis_step = parseInt(this.value);
    refresh_vis_frame();
});


style_reset_btn.addEventListener("click", function(e) {
    localStorage.setItem('--vis-padding', "0.3");
    localStorage.setItem('--td-font-size', "1.5");
    updateSavedStyles();
});

vis_padding_slider.addEventListener("input", function(e) {
    let value = `${this.value}em`;
    root.style.setProperty('--vis-padding', value);
    localStorage.setItem('--vis-padding', this.value);
});

vis_fontsize_slider.addEventListener("input", function(e) {
    let value = `${this.value}em`;
    root.style.setProperty('--td-font-size', value);
    localStorage.setItem('--td-font-size', this.value);
});

let sliders = [vis_speed_slider, vis_step_slider, vis_padding_slider, vis_fontsize_slider];
for (var slider of sliders) {
    // Allow for using mouse wheel to change vis_step
    slider.addEventListener("wheel", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.disabled) {
            // Determine scroll direction (deltaY < 0 for scroll up, > 0 for scroll down)
            if (e.deltaY < 0) {
                this.stepUp();
            } else {
                this.stepDown();
            }

            var event = new Event('input', {bubbles: true});
            this.dispatchEvent(event);
        }
    });
}

// Allow visulisation control with arrow keys
document.addEventListener('keydown', function(event) {
    const activeTag = document.activeElement.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return; // Do nothing if focused in these elements
    }

    if (event.code === 'ArrowLeft') {
        event.preventDefault();
        prev_vis_step();
    } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        next_vis_step();
    }
});


document.updateSavedStyles = updateSavedStyles;
function updateSavedStyles() {
    var value = localStorage.getItem('vis-speed');
    if (value != null) {
        vis_speed_slider.value = value;
    }

    var event = new Event('input', {bubbles: true});
    value = localStorage.getItem('--vis-padding');
    if (value != null) {
        vis_padding_slider.value = value;
        vis_padding_slider.dispatchEvent(event);
    }

    event = new Event('input', {bubbles: true});
    value = localStorage.getItem('--td-font-size');
    if (value != null) {
        vis_fontsize_slider.value = value
        vis_fontsize_slider.dispatchEvent(event);
    }
}
