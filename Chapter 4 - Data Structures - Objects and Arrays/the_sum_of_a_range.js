/*
1 - The Sum Of A Range (30/12/2019)

Write a range function that takes two arguments, start and end, and returns an array containing all the numbers from start up to (and including) end.

Next, write a sum function that takes an array of numbers and returns the sum of these numbers. Run the example program and see whether it does indeed return 55.

As a bonus assignment, modify your range function to take an optional third argument that indicates the “step” value used when building the array. If no step is given, the elements go up by increments of one, corresponding to the old behavior. The function call range(1, 10, 2) should return [1, 3, 5, 7, 9]. Make sure it also works with negative step values so that range(5, 2, -1) produces [5, 4, 3, 2].
*/

// JS allows us to reference the values of parameters declared before an optional parameter.
// This allows us to programmatically change the value of step based on the values of `start` & `end` parameters.
function range(start, end, step=(start <= end)? 1: -1) {
	let array = [];
	
	if (step > 0) {
		// Due to step value being positive, it is necessary that start value must be lesser than or equal to end value 
		// to ensure the function works properly.
		if (start > end) {
			return undefined;
		}

		for (let n = start; n <= end; n += step) {
			array.push(n);
		}
	}
	else if (step < 0) {
		// Due to step value being negative, it is necessary that start value must be greater than or equal to end value 
		// to ensure the function works properly.
		if (start < end) {
			return undefined;
		}

		for (let n = start; n >= end; n += step) {
			array.push(n);
		}
	}
	// If step value is 0, then return undefined.
	else {
		return undefined;
	}
	
	return array;
}


function sum(array) {
    let result = 0;

    for (num of array) {
        result += num;
    }

    return result;
}


console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(8, 5));
// → [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(range(10, 1, 1));
// → undefined
console.log(range(1, 10, -1));
// → undefined
console.log(range(1, 10, 0));
// → undefined
console.log(range(1, 1));
// → [1]
console.log(sum(range(1, 10)));
// → 55
