/*

4 - Borrowing A Method (6/1/2019)

Earlier in the chapter I mentioned that an object’s hasOwnProperty can be used as a more robust alternative to the in operator when you want to ignore the prototype’s properties. But what if your map needs to include the word "hasOwnProperty"? You won’t be able to call that method anymore because the object’s own property hides the method value.

Can you think of a way to call hasOwnProperty on an object that has its own property by that name?

*/

let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
console.log(Object.hasOwnProperty.call(map, "one"));
// → true