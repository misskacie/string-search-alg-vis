export {kmp_search, kmp_failure_function};

function kmp_search(pattern, text) {
    var failure_func = kmp_failure_function(pattern);
    var s = 0;
    var i = 0;
    
    var steps = [];
    var found = [];
    
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
    console.log([found,steps]);
    return [found, steps];
}

function kmp_failure_function(pattern) {
    var F = [-1,0];
    var s = 2;
    var c = 0;

    var failure_steps = [];

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