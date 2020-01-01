/* 
1. Minimum (30/12/2019)

The 2nd chapter introduced the standard function Math.min that returns its smallest argument. We can build something like that now. Write a function min that takes two arguments and returns their minimum.
*/

// 1 - Using function expressions
const min = function(x, y) {
    return (x < y)? x: y;
};

// 2 - Using function declarations
function min(x, y) {
    return (x < y)? x: y;
}

// 3 - Using arrow functions
const min = (x, y) => (x < y)? x: y;

// Test values
console.log(min(0, 10));
// -> 0
console.log(min(0, -10));
// -> -10