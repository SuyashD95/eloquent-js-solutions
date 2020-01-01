/*
3. Chessboard (30/12/2019)

Write a program that creates a string that represents an 8×8 grid, using newline characters to separate lines. At each position of the grid there is either a space or a "#" character. The characters should form a chessboard.

Passing this string to console.log should show something like this:

 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # #

When you have a program that generates this pattern, define a binding size = 8 and change the program so that it works for any size, outputting a grid of the given width and height.
*/

let size = 8;
let nextLetter = ' ';  // Represents topmost left square
let string = '';

// Create a string of length (size^2 + size) characters depicting a chessboard pattern.
for (let n = 1; n <= (size * size); n++) {
	string += nextLetter;

	// If a string has become `size` chars long, move to the new row;
	// Otherwise, alternate between ' ' & '#' based on the current value of nextLetter.
	if (n % size == 0) {
		string += '\n';
      	
      	// Perform another alternation of the value of nextLetter if size is an odd number,
        // to ensure that the new row starts with the letter opposite to the one in current row.
      	// This is not required when size's value is an even number.
      	if (size % 2 == 1) {
      		nextLetter = (nextLetter == ' ')? '#': ' ';
        }
	}
	else {
		nextLetter = (nextLetter == ' ')? '#': ' ';
	}
}

console.log(string);