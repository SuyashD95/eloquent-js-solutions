/*
    
1 - Flattening (3/1/2020)

Use the reduce method in combination with the concat method to “flatten” an array of arrays into a single array that has all the elements of the original arrays.
*/

const flatten = arrays => {
    return arrays.reduce((flatArray, currentArray) => {
         return flatArray.concat(currentArray);
    }, []);
};

let arrays = [[1, 2, 3], [4, 5], [6]];
console.log(flatten(arrays));
// → [1, 2, 3, 4, 5, 6]