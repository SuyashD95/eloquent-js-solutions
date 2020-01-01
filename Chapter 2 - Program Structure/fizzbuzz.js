/*
2. FizzBuzz (30/12/2019)

Write a program that uses console.log to print all the numbers from 1 to 100, with two exceptions. For numbers divisible by 3, print "Fizz" instead of the number, and for numbers divisible by 5 (and not 3), print "Buzz" instead.

When you have that working, modify your program to print "FizzBuzz" for numbers that are divisible by both 3 and 5 (and still print "Fizz" or "Buzz" for numbers divisible by only one of those).

(This is actually an interview question that has been claimed to weed out a significant percentage of programmer candidates. So if you solved it, your labor market value just went up.)
*/

// 1 - Simple Solution
for (let n = 1; n <= 100; n++) {
    if (n % 3 == 0 && n % 5 == 0) {
        console.log('FizzBuzz');
    }
    else if (n % 3 == 0) {
        console.log('Fizz');
    }
    else if (n % 5 == 0) {
        console.log('Buzz');
    }
    else {
        console.log(n);
    }
}

// 2 - Clever Solution
for (let n = 1; n <= 100; n++) {
    // Insert word(s) into `output` string, using conditionals.
    let output = '';

    if (n % 3 == 0) {
        output += 'Fizz';
    }
    
    if (n % 5 == 0) {
        output += 'Buzz';
    }

    // Using OR operator to shortcircuit expression
    console.log(output || n);    
}