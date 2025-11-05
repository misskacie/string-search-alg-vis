export {update_suffix_array};
var i;
const CELL_PAD = "5pt";
const LARR = "\u2190" //←
function update_suffix_array(unsorted_suffix_array, sorted_suffix_array, search_text, search_pattern, min, mid, max){
    // Add padding so Ed sizes the box correctly
    let pad_ed = document.getElementById("pad-ed");
    if (pad_ed){
        pad_ed.remove();
    }
    
    let table = document.createElement('table');
    let row =  table.insertRow()
    let td = row.insertCell();
    td.appendChild(document.createTextNode("\\(i\\)"));
    td.style.padding = CELL_PAD;
    td = row.insertCell();
    td.appendChild(document.createTextNode("\\(T_{i}\\)"));
    td.style.textAlign = "left";
    td.style.padding = CELL_PAD;

    td = row.insertCell();
    td.appendChild(document.createTextNode("\\(S[i]\\)"));
    td.style.padding = CELL_PAD;

    td = row.insertCell();
    td.appendChild(document.createTextNode("\\(T_{S[i]}\\)"));
    td.style.textAlign = "left";
    td.style.padding = CELL_PAD;
    
    // Add padding for the offset alignment of pattern to text
     for (i = 0; i <= search_text.length; i++) {
        row =  table.insertRow() 
        td = row.insertCell();
        td.style.padding = CELL_PAD;
        td.appendChild(document.createTextNode(i));

        td = row.insertCell();
        td.style.padding = CELL_PAD;
        td.style.textAlign = "left";
        // Inefficient solution to get the suffix index from the array of strings.
        // as if it was a pointer.
        td.appendChild(document.createTextNode(unsorted_suffix_array[i]));

        td = row.insertCell();
        td.style.padding = CELL_PAD;
        // Inefficient solution to get the suffix index from the array of strings.
        // as if it was a pointer.
        td.appendChild(document.createTextNode(search_text.length - sorted_suffix_array[i].length));

        td = row.insertCell();
        td.style.textAlign = "left";
        td.appendChild(document.createTextNode(sorted_suffix_array[i]));
    

        if ((i < min) || (i > max)) {
            td.style.backgroundColor = '#FF0000';
        }
        
        
        if (i == mid) {
            if (sorted_suffix_array[i].startsWith(search_pattern))  {
                td.style.backgroundColor = '#00FF00';
            } else {
                td.style.backgroundColor = '#FF0000';
            }
            td = row.insertCell();
            td.style.textAlign = "left";
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.style.textAlign = "left";
            td.appendChild(document.createTextNode("mid"));
        }
        if (i == min) {
            td = row.insertCell();
            td.style.textAlign = "left";
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.style.textAlign = "left";
            td.appendChild(document.createTextNode("min"));
        }

        if (i == max) {
            td = row.insertCell();
            td.style.textAlign = "left";
            td.appendChild(document.createTextNode(LARR));
            td = row.insertCell();
            td.style.textAlign = "left";
            td.appendChild(document.createTextNode("max"));
        }
        
    }
    table.id = "KMPFAILURE";
    document.getElementById("KMPFAILURE").replaceWith(table);
}
