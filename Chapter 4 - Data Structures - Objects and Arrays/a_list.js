/*

3 - A List (31/12/2019)

Objects, as generic blobs of values, can be used to build all sorts of data structures. A common data structure is the list (not to be confused with array). A list is a nested set of objects, with the first object holding a reference to the second, the second to the third, and so on.

let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};

A nice thing about lists is that they can share parts of their structure. For example, if I create two new values {value: 0, rest: list} and {value: -1, rest: list} (with list referring to the binding defined earlier), they are both independent lists, but they share the structure that makes up their last three elements. The original list is also still a valid three-element list.

Write a function arrayToList that builds up a list structure like the one shown when given [1, 2, 3] as argument. Also write a listToArray function that produces an array from a list. Then add a helper function prepend, which takes an element and a list and creates a new list that adds the element to the front of the input list, and nth, which takes a list and a number and returns the element at the given position in the list (with zero referring to the first element) or undefined when there is no such element.

If you haven’t already, also write a recursive version of nth.
*/

// Using recursion to convert to a list.
function arrayToList(array) {
    // Checking whether user has passed a non-empty array as an argument.
    if (!array.length) {
        return {};
    }

    // Create a node for the first element of the array.
    let list = {
        value: array[0]
    };

    // Base step: `array` only contains a single element.
    // It is both the HEAD & TAIL of the list.
    if (array.length == 1) {
        list.rest = null;
        return list;
    }

    // Recursive Step: Create a List with the remaining elements of `array`.
    list.rest = arrayToList(array.slice(1));

    return list;
}

function listToArray(list) {
    // Checking whether user has passed a non-empty array as an argument.
    if (!Object.keys(list).length) {
        return [];
    }
    
    let array = [list.value];
  
    // Base Step: Node is the TAIL of the List.
    if (list.rest === null) {
        return array;
    }

    // Recursive Step: Concatenate the array returned by calling the function itself
    // if the List node contains a reference to another List node via `rest` property.

    // Note about concat() method of an Array
    // The concat() method is immutable i.e., it does not alter `array`.
    // It just creates a new array containing the elements of the two arrays.
    return array.concat(listToArray(list.rest));
}

function prepend(element, list) {
    // Return a single node List if `list` is an empty List i.e., {}.
    if (list !== null && !Object.keys(list).length) {
        return {
            value: element,
            rest: null
        }
    }
  
    // Add the element to the front of (Linked) List, `list`.
    return {
        value: element,
        rest: list
    };
}

function nth(list, index) {
    // Return undefined if `list` is an empty List i.e., {}.
    if (!Object.keys(list).length) {
        return undefined;
    }

    // Create a helper arrow function to keep track of the current index
    // (while moving deeper into the `list`) & get the value at `index` (if it exists).
    const get_value = (list, index, current_index) => {     
        // Base Step 1: Current node is the HEAD of `list`.
        if (list.rest === null) {
            if (current_index == index) {
                return list.value;
            }
            else {
                return undefined;
            }
        }
        
        // Base Step 2: Current Node is at the index specified by `index`.
        if (current_index == index) {
            return list.value;
        }
        else {
            // Recursive Step: Invokes get_value() on the node referenced by `rest` 
            // with `current_index` being incremented by 1.
          
            // Alternate Approach: If increment operator (++) operates on `current_index`,
            // use the prefix version (`++current_index`) instead of the 
            // postfix version (`current_index++`).
            return get_value(list.rest, index, current_index += 1);
        }
    }
    
    return get_value(list, index, 0);
}

// PRACTICE: Define iterative version of the aforementioned functions. 

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 0));
// → 20