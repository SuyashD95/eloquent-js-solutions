/*

3 - Iterable Groups (6/1/2019)

Make the Group class from the previous exercise iterable. Refer to the section about the iterator interface earlier in the chapter if you aren’t clear on the exact form of the interface anymore.

If you used an array to represent the group’s members, don’t just return the iterator created by calling the Symbol.iterator method on the array. That would work, but it defeats the purpose of this exercise.

It is okay if your iterator behaves strangely when the group is modified during iteration.

*/

class Group {

    constructor() {
        this.values = [];
    }

    add(value) {
        if (!this.has(value)) {
            this.values.push(value);
        }
    }

    delete(value) {
        if (this.has(value)) {
            const removeDelete = this.values.indexOf(value);
            delete this.values[removeDelete];
        }
    }

    has(value) {
        for (let member of this.values) {
            if (member === value) {
                return true;
            }
        }
        return false;        
    }

    static from(iterable) {
        let group = new Group();
        for (let element of iterable) {
            group.add(element);
        }
        return group;
    }
  
    [Symbol.iterator]() {
        // Makes Group class iterable and thus, can be utilized in for/of loops.
        return new GroupIterator(this);
    }
}

class GroupIterator {

    constructor(group) {
        this.currentIndex = 0;
        this.group = group;
    }

    next() {
        // next() returns an object containing two properties: `value` (Any type) & `done` (boolean).
        
        if (this.currentIndex == this.group.values.length) {
            return {done: true};  // Equivalent to {value: undefined, done: true}
        }
        else {
            let value = this.group.values[this.currentIndex];
            this.currentIndex += 1;

            return {value, done: false};
        }
    }
}

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c