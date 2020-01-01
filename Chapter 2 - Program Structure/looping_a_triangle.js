/* 
1. Looping A Triangle (30/12/2019)

Write a loop that makes seven calls to console.log to output the following triangle:

#
##
###
####
#####
######
#######

It may be useful to know that you can find the length of a string by writing .length after it.

    let abc = "abc";
    console.log(abc.length);
    // → 3
*/


for (let string = '#'; string.length != 7; string += '#') {
    console.log(string);
}