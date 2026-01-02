export {kmp_search, kmp_failure_function};

function kmp_search(pattern, text) {
    var failure_func, _;
    [failure_func, _] = kmp_failure_function(pattern);
    var s = 0;
    var i = 0;

    var steps = [];
    var found = [];

    while (s <= text.length - pattern.length) {
        if(text[s+i] == pattern[i]) {
            steps.push([s,i,0]);
            i = i + 1;
            if (i == pattern.length) {
                steps.push([s,i,1]);
                found.push(s);
                return [found, steps];
            }
        } else {

            steps.push([s,i,2]);
            s = s + i - failure_func[i];
            i = Math.max(failure_func[i], 0)
        }
    }

    steps.push([s,i,3]);
    return [found, steps];
}

function kmp_failure_function(pattern) {
    var F = [-1,0];
    var s = 2;
    var c = 0;

    var failure_steps = [];

    while (s < pattern.length) {
        if (pattern[c] == pattern[s-1]) {
            failure_steps.push([s,c,1]);
            c = c + 1;
            F[s] = c;
            s = s + 1;
        } else if (c > 0) {
            failure_steps.push([s,c,2]);
            c = F[c];
        } else {
            failure_steps.push([s,c,3]);
            F[s] = 0;
            s = s + 1;
        }
    }
    failure_steps.push([s,c,4]);

    return [F, failure_steps];
}