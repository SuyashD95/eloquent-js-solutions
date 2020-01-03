/*

2 - Your Own Loop (3/1/2020)

Write a higher-order function loop that provides something like a for loop statement. It takes a value, a test function, an update function, and a body function. Each iteration, it first runs the test function on the current loop value and stops if that returns false. Then it calls the body function, giving it the current value. Finally, it calls the update function to create a new value and starts from the beginning.

When defining the function, you can use a regular loop to do the actual looping.

*/

function loop(value, test, update, body) {
    // Takes in 3 single-parameter functions: `test`, `body` & `update`.
    // These functions operate on the argument passed to `value`.
    
    for (let n = value; test(n); n = update(n)) {
        body(n);
    }
}

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1