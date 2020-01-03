/*

3 - Everything (3/1/2020)

Analogous to the some method, arrays also have an every method. This one returns true when the given function returns true for every element in the array. In a way, some is a version of the || operator that acts on arrays, and every is like the && operator.

Implement every as a function that takes an array and a predicate function as parameters. Write two versions, one using a loop and one using the some method.

*/

// Version 1 of every() written using Loops
function every(array, test) {
    for (let element of array) {
        if (!test(element)) {
            return false;
        }
    }

    return true;
}

// Version 2 of every() written using arr.some() method
function every2(array, test) {
    // To build every on top of some, we can apply De Morgan’s laws, 
    // which state that a && b equals !(!a || !b). 
    // 
    // This can be generalized to arrays, where all elements in 
    // the array match if there is no element in the array that 
    // does not match.
    return !array.some(element => !test(element));
}

console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true
console.log(every2([1, 3, 5], n => n < 10));
// → true
console.log(every2([2, 4, 16], n => n < 10));
// → false
console.log(every2([], n => n < 10));
// → true