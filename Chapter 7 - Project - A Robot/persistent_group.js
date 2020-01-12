/*

3 - Persistent Group (12/1/2020)

Most data structures provided in a standard JavaScript environment aren’t very well suited for persistent use. Arrays have slice and concat methods, which allow us to easily create new arrays without damaging the old one. But Set, for example, has no methods for creating a new set with an item added or removed.

Write a new class PGroup, similar to the Group class from Chapter 6, which stores a set of values. Like Group, it has add, delete, and has methods.

Its add method, however, should return a new PGroup instance with the given member added and leave the old one unchanged. Similarly, delete creates a new instance without a given member.

The class should work for values of any type, not just strings. It does not have to be efficient when used with large amounts of values.

The constructor shouldn’t be part of the class’s interface (though you’ll definitely want to use it internally). Instead, there is an empty instance, PGroup.empty, that can be used as a starting value.

Why do you need only one PGroup.empty value, rather than having a function that creates a new, empty map every time?

*/

class PGroup {
    constructor(array) {
        this.group = array;
        // Making the `group` instance property immutable as a safeguard
        // against accidental mutations/modifications to the property.
        Object.freeze(this.group);
    }

    add(value) {
        if (!this.has(value)) {
            return new PGroup(this.group.concat(value));
        }
        
        return this;
    }

    delete(value) {
        if (this.has(value)) {
            return new PGroup(this.group.filter(element => element !== value));
        }
        
        return this;
    }

    has(value) {
        return this.group.includes(value);
    }
}

// To add a property (empty) to a constructor that is not a method, you have to 
// add it to the constructor after the class definition, as a regular property.
//
// We need only one empty instance because all empty groups are the same and 
// instances of the class don’t change. We can create many different groups from 
// that single empty group without affecting it.
PGroup.empty = new PGroup([]);


let a = PGroup.empty.add("a");
console.log("a:", a);
// → a: {group: ["a"]}

let ab = a.add("b");
console.log("a after add operation:", a);
console.log("ab:", ab);
// → a after add operation: {group: ["a"]}
// → ab: {group: ["a", "b"]}

let b = ab.delete("a");
console.log("ab after delete operation:", ab);
console.log("b:", ab);
// → ab after delete operation: {group: ["a", "b"]}
// → b: {group: ["a", "b"]}

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false