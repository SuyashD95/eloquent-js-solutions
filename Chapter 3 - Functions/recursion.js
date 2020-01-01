/* 
2. Recursion (30/12/2019)

We’ve seen that % (the remainder operator) can be used to test whether a number is even or odd by using % 2 to see whether it’s divisible by two. Here’s another way to define whether a positive whole number is even or odd:

Zero is even.

One is odd.

For any other number N, its evenness is the same as N - 2.

Define a recursive function isEven corresponding to this description. The function should accept a single parameter (a positive, whole number) and return a Boolean.

Test it on 50 and 75. See how it behaves on -1. Why? Can you think of a way to fix this?
*/

function isEven(n) {
	/* 
	isEven function will end up producing a Recursion Error when we input a negative number.
	Because, according to the recursive algorithm, at each recursive step, we lower the value of n by 2;

	Following the procedure on positive integers (whole nos.) would finally lead to n being either 0 or 1 
	(which will meet the base conditions) and hence, the function will return back successfully.

	But, in case of negative nos, we can never reach either 0 or 1 by subtracting 2 from n because it is already lower than either of the base condition nos.
	To fix this problem, we can simply return undefined if the n is a negative number.
	*/

	// Invalid Input: n is not a positive, whole number.
	if (n < 0) {
		return undefined;
	}
	else {	
		// Base Condition 1: 0 is Even.
		if (n == 0) {
			return true;
		}
		// Base Condition 2: 1 is Odd.
		if (n == 1) {
			return false;
		}

		// Recursive Step: N's eveness is same as N - 2.
		return isEven(n - 2);
	}
}

console.log(isEven(50));
// → true
console.log(isEven(75));
// → false
console.log(isEven(-1));
// → ??

/* 
isEven function will end up producing a Recursion Error when we input a negative number.
Because, according to the recursive algorithm, at each recursive step, we lower the value of n by 2;

Following the procedure on positive integers (whole nos.) would finally lead to n being either 0 or 1 
(which will meet the base conditions) and hence, the function will return back successfully.

But, in case of negative nos, we can never reach either 0 or 1 by subtracting 2 from n because it is already lower than either of the base condition nos.
To fix this problem, we can simply return undefined if the n is a negative number.
*/