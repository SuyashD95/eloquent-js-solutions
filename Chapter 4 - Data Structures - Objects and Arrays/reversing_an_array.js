/*
2 - Reversing An Array (30/12/2019)

Arrays have a reverse method that changes the array by inverting the order in which its elements appear. For this exercise, write two functions, reverseArray and reverseArrayInPlace. The first, reverseArray, takes an array as argument and produces a new array that has the same elements in the inverse order. The second, reverseArrayInPlace, does what the reverse method does: it modifies the array given as argument by reversing its elements. Neither may use the standard reverse method.

Thinking back to the notes about side effects and pure functions in the previous chapter, which variant do you expect to be useful in more situations? Which one runs faster?
*/

function reverseArray(array) {
	let reversedArray = [];

	for (let element of array) {
		reversedArray.unshift(element);
	}

	return reversedArray;
}


// Clever Solution using the properties of Array objects.
function reverseArrayInPlace(array) {
	for (let index = 0; index < array.length; index++) {
		let lastValue = array.pop();
		// Without removing any existing element, insert the 
        // popped out element at ith position of array.
		array.splice(index, 0, lastValue);
	}
}

// Brute force approach to manually swap the elements.
function reverseArrayInPlace(array) {
	const lastIndex = array.length - 1;
	
	for (let index = 0; index < Math.floor(array.length / 2); index++) {
		// Swap elements of first & last elements, then second & second-last elements and so on...
		let firstValue = array[index];
		array[index] = array[lastIndex - index];
		array[lastIndex - index] = firstValue;
	}
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]