/*
 
 Chapter 12 - A Programming Language (29/1/2020)

 Objective: Build a programming language called Egg. It will be tiny,
 simple language—but one that is powerful enough to express any computation 
 you can think of. It will allow simple abstraction based on functions. 
 
 NOTES
 =====

 Parser
 ------

 The most immediately viisble part of a programming language is its `syntax`,
 or notation. A `parser` is a program that reads a piece of text and produces
 a data structure that reflects the structure of the program contained in
 that text. If the text does not form a valid program, the parser should point
 out the error.

 About the syntax of the Egg language
 ------------------------------------

 * Everything in Egg is an expression.

 * An expression can be the name of a binding, a number, a string or an
   `application`.

 * Applications are used for function calls but also for constructs such
   as `if` or `while`.

 * To keep the parser simple, strings in Egg do not support anything like
   backslash escapes. A string is simply a sequence of characters that are
   not double quotes, wrapped in double quotes.

 * A number is a sequence of digits.
 
 * Binding names can consist of any character that is not whitespace and that
   does not have a special meaning in the syntax.

 * Applications are written the way, they are in JavaScript, by putting parentheses
   after an expression and having any number of arguments between those parentheses,
   separated by commas.

 * Egg, like JavaScript, allows any amount of whitespace between its elements.

 * The uniformity of the Egg language means that things that are operators in JavaScript
   (such as `>`)  are normal bindings in this language, applied just like other functions.
   And, since the syntax has no concept of a block, we need a `do` construct to represent
   doing multiple things in sequence.
   
 A simple program written in Egg language
 ----------------------------------------

 do(define(x, 10),
    if(>(x, 5),
       print("large"),
       print("small")))

 Representation of an Expression Object used by Parser (to describe a program)
 -----------------------------------------------------

 * Each of the Expression objects has a `type` property indicating the
   kind of expression it is and other properties to describe its content.

 * Expressions of type "value" represent literal strings or numbers. Their
   `value` property contains the string or number value that they represent.

 * Expressions of type "word" are used for identifiers (names). Such objects
   have a `name` property that holds the identifier's name as a string.

 * Finally, "apply" expressions represent applications. They have an
   `operator` property that refers to the expression that is being applied, as
   well as an `args` property that holds an array of argument expressions.

 A Simple Example of an Expression Object
 ----------------------------------------

 The >(x, 5) part of the previous program would be represented like this:

 {
    type: "apply",
    operator: {type: "word", name: ">"},
    args: [
        {type: "word", name: "x"},
        {type: "value", value: 5}
    ]
 }

 Representation of a Whole Program by using Syntax Trees
 -------------------------------------------------------

 * If you imagine the objects as dots and the links between them as lines between 
   those dots, it has a treelike shape. The fact that expressions contain other expressions, 
   which in turn might contain more expressions, is similar to the way tree branches split 
   and split again. 

   + do
   |
   |-->+ define
   |   |-->+ x
   |   |-->+ 10
   |
   |-->+ if
       |-->+ >
       |   |-->+ x
       |   |-->+ 5
       |
       |-->+ print
       |   |-->+ "large"
       |
       |-->+ print
           |-->+ "small" 

 * We need to write a parser function that it recursive in a way that reflects the
   recursive nature of the language.  
*/

/*
 * Building the Parser for Egg
 * ---------------------------
 *
 * To parse an expression, we need to use 4 functions:
 *  
 * 1. skipSpace(string)
 * 2. parseApply(expr, program)
 * 3. parseExpression(program)
 * 4. parse(program)
 */


function skipSpace(string) {
    /*
     * This function cut the whitespace off the start of the program
     * string. If no characters (other than whitespaces are found),
     * it returns an empty String.
     */
    
    // Using regex to find the index of the first non-whitespace character
    // in the `string`.
    let first = string.search(/\S/);

    if (first == -1) 
        return "";
    
    // Extraction starts from the character at `first` till the end of the 
    // `string`.
    return string.slice(first);
}


function parseExpression(program) {
    /*
     * Detects the type of expression based on the given patterns (of text) 
     * for different expr. objects.
     *
     * It takes in a String object as its only parameter, which consists of a
     * source code of a complete program written in Egg language.
     * 
     * And, returns an object containing the data structure for the expression 
     * (Expression Object) at the start of the string, along with the part of the 
     * string left after parsing the given expression.
     *
     * The function could also throw a `SyntaxError` if the expression in the 
     * program is ill-formed & doesn't conform to the syntactical rules of the
     * Egg language.
     */
    
    // Skip any leading space at the start of `program`.
    program = skipSpace(program);

    // Declare these bindings with `let` to ensure that they are available throughout
    // the scope of this function.
    let match;
    let expr;

    const stringRegex = /^"([^"]*)"/;
    const numberRegex = /^\d+\b/;
    const wordRegex = /^[^\s(),#"]+/;

    // Use regexes to spot the three atomic elements that Egg supports:
    // strings, numbers, and words.
    // 
    // The parser constructs different kinds of expression objects depending
    // on which one it matches. If the input does not match any one of these
    // three (valid) forms, it is not a valid expression, and the parser throws
    // a `SyntaxError`.
    // 
    // A `match` could either be `null` type if the exec() function fails to find
    // a match in the given string (`program`) or a Match object containing an 
    // array of strings (and `index` property denoting the position where the
    // match was first found).
    // 
    // The index 0 of the Match object is always used to store the whole match of
    // a given regexp while the strings stored from index 1 onwards (if any) represent
    // the text captured by the regexp sub-groups (enclosed within parentheses).
    
    if (match = stringRegex.exec(program)) {
        // By using the exec() function, extract the string that was captured
        // by the first (& only) parenthesized group of the `stringRegex` and
        // store it at position 1 of the resultant array of strings in `match`
        // (since index 0 is used to store the whole match which also includes
        // the enclosing double quotes).
        // 
        // And, we are only interested in the actual text enclosed inside the
        // double quotation marks ("<actual text>").
        expr = {type: "value", value: match[1]};
    }
    else if (match = numberRegex.exec(program)) {
        // Extract the `match`ed text which represents a sequence of digits
        // and convert (cast) it to a Number object.
        expr = {type: "value", value: Number(match[0])};
    }
    else if (match = wordRegex.exec(program)) {
        // Extract the `match`ed text which satisfies all the rules of the 
        // expression being considered a "word" type.
        expr = {type: "word", name: match[0]};
    }
    else {
        throw new SyntaxError("Unexpected syntax: " + program);
    }

    // Cut off the part that was matched from the `program` string.
    // `match[0].length` denotes the next character after extracting
    // out `match` from `program`.
    let unmatched_text = program.slice(match[0].length);

    // Pass `unmatched_text` along with the object (`expr`) for the expression, 
    // to parseApply(), which checks whether the expression is an application. 
    // 
    // If so, it parses a parenthesized list of arguments.
    return parseApply(expr, unmatched_text);
}
 

function parseApply(expr, program) {
    /*
     * If the first non-whitespace character in the program is not an opening 
     * parenthesis, this is not an application, and `parseApply` returns the 
     * expression (`expr`) it was given.
     * 
     * Otherwise, it skips the opening parenthesis and creates the syntax tree object 
     * for this application expression. It then recursively calls parseExpression() to 
     * parse each argument until a closing parenthesis is found. 
     * 
     * The recursion is indirect, through parseApply() and parseExpression() calling 
     * each other.
     */
    
    // Skip any leading space at the start of `program`.
    program = skipSpace(program);

    // Returns the current character of the program that
    // is being parsed.
    const current_char = () => program[0];

    const start_of_application = "(";
    const end_of_application = ")";
    const start_of_next_argument = ",";

    // The expression is not an application.
    if (current_char() != start_of_application) {
        return {expr: expr, rest: program};
    }

    // Skip to the next non-whitespace character denoting
    // the start of an application's arguments.
    program = skipSpace(program.slice(1));

    // Create an Expression object of type "apply" with the
    // passed in `expr` as the value for the `operator` property.
    // 
    // Also, create an empty Array to store the values of the 
    // application's argument(s).
    expr = {type: "apply", operator: expr, args: []};

    // Continue the loop till the application has been completely
    // parsed (happens when parser reaches a closing parenthesis).
    while (current_char() != end_of_application) {
        // Use parseExpression() to return back the Expression object
        // for the argument and push it to the list of argument(s) found
        // for the application. 
        // 
        // Also, move the parser to the next non-whitespace character.
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);

        // The application contains another argument to be parsed (found
        // when parser reads a comma in the source code (,), not enclosed within
        // a pair of double quotes ("")).
        if (current_char() == start_of_next_argument) {
            program = skipSpace(program.slice(1));
        }
        // Otherwise, throw a `SyntaxError` due to a presence of an illegal character
        // that indicates that the expression is ill-formed and doesn't follow the
        // syntactical rules set for the Egg language.
        else if (current_char() != ")") {
            throw new SyntaxError("Expected ',' or ')'");
        }
    }

    // Because an application expression can itself be applied (such as in multiplier(2)(1)), 
    // `parseApply` must, after it has parsed an application, call itself again to check 
    // whether another pair of parentheses follows.
    return parseApply(expr, program.slice(1));
}


function parse(program) {
    /*
     * A convienent function that provides us a way to parse a given `program` (written in
     * Egg language) without worrying about the internal implementation of the Parser.
     *
     * The function verifies that it has reached the end of the input string (source code) 
     * after parsing the expression (an Egg program is a single expression), and that 
     * gives us the program’s data structure (syntax tree represented by a nested sequence 
     * of Expression objects).
     */
    let {expr, rest} = parseExpression(program);

    if (skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

/* 
 * Code to test the Parser
 * -----------------------
 */

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}


/*
 * Run an Egg Program
 * ------------------
 *
 * To run a program written in Egg language, we would need:
 *
 * 1. Evaluator (an Interpreter)
 * 2. Special Forms Object (if, while, define, do, functions)
 * 3. Environment (Scope)
 */


// `specialForms` an object (which does not have any prototype) and contains
// a set of properties which represent special language constructs used 
// in the Egg language.
// 
// The `specialForms` object is used to define special syntax in Egg. 
// It associates words with functions that evaluate such forms.
const specialForms = Object.create(null);


function evaluate(expr, scope) {
    /*
     * Evaluator reads a syntax tree represented by an Expression object 
     * (`expr`) & a `scope` object which is an environment where names of
     * bindings are associated with their values.
     *
     * This function will evaluate `expr` and return the value of the 
     * expression. 
     * 
     * This function will act like an interpreter for the Egg language which
     * will validate the semantic structure of a program. 
     */
    
    // Interpret/evaluate the code based on the expression types ("value", "word"
    // or "application").
    
    // A literal value expression produces its value. (For example, the expression 
    // 100 just evaluates to the number 100 or "text" just evaluates to text). 
    if (expr.type == "value") {
        return expr.value;
    }
    // For a binding, we must check whether it is actually defined in the scope 
    // and, if it is, fetch the binding’s value.
    else if (expr.type == "word") {
        if (expr.name in scope) {
            return scope[expr.name];
        }
        else {
            throw new ReferenceError(`Undefined binding: ${expr.name}`);
        }
    }
    // Applications are more involved. If they are a special form, like if, we 
    // do not evaluate anything and pass the argument expressions, along with 
    // the scope, to the function that handles this form.
    // 
    // If it is a normal call, we evaluate the operator, verify that it is a 
    // function, and call it with the evaluated arguments.
    else if (expr.type == "apply") {
        let {operator, args} = expr;

        if (operator.type == "word" && operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
        }
        else {
            let op = evaluate(operator, scope);

            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)));
            }
            else {
                throw new TypeError("Applying a non-function.");
            }
        }
    }
}


// The reason we need to represent `if` as a special form, rather than a regular 
// function, is that all arguments to functions are evaluated before the 
// function is called, whereas if should evaluate only either its second or its 
// third argument, depending on the value of the first.
//
// The same reasoning can be applied to other special programming constructs that
// are included in the Egg language.
specialForms.if = (args, scope) => {
    const [predicate, true_body, false_body] = args;

    if (args.length != 3) {
        throw new SyntaxError("Wrong number of args to if");
    }
    else if (evaluate(predicate, scope) !== false) {
        return evaluate(true_body, scope);
    }
    else {
        return evaluate(false_body, scope);
    }
}


specialForms.while = (args, scope) => {
    const [predicate, loop_body] = args;

    if (args.length != 2) {
        throw new SyntaxError("Wrong number of args to while");
    }

    while (evaluate(predicate, scope) !== false) {
        evaluate(loop_body, scope);
    }

    // Since `undefined` does not exist in Egg, we return `false`
    // for lack of a meaningful result.
    return false;
}


// Another basic building block is do, which executes all its arguments 
// from top to bottom. Its value is the value produced by the last 
// argument.
specialForms.do = (args, scope) => {
    let value = false;

    for (let arg of args) {
        value = evaluate(arg, scope);
    }

    return value;
}

// To be able to create bindings and give them new values, we also create 
// a form called `define`. 
// 
// It expects a word as its first argument and an expression producing the 
// value to assign to that word as its second argument. 
// 
// Since define, like everything, is an expression, it must return a value. 
specialForms.define = (args, scope) => {
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of define");
    }

    const name = args[0].name;
    const expr = args[1];

    let value = evaluate(expr, scope);
    scope[name] = value;
    
    return value;
}


/*
 * The Environment (Scopes)
 * ---------------
 * The scope accepted by evaluate is an object with properties whose names 
 * correspond to binding names and whose values correspond to the values 
 * those bindings are bound to.
 */

// Global Scope (a type of Scope object)
const topScope = Object.create(null);

// To be able to use constructs (like `if`), we must have access to Boolean values. 
// Since there are only two Boolean values, we do not need special syntax for them. 
// We simply bind two names to the values `true` and `false` and use them.
topScope.true = true;
topScope.false = false;


// Testing Booleans in Egg by evaluating a simple expression that negates a Boolean
// value.
let prog = parse(`if(true, false, true)`);
console.log(evaluate(prog, topScope));
// → false


// To supply basic arithmetic and comparison operators, we will also add some function 
// values to the scope.
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    topScope[op] = Function("a, b", `return a ${op} b;`)
}


// A way to output values is also useful, so we’ll wrap `console.log` in a function and 
// call it `print`.
topScope.print = value => {
    console.log(value);
    return value;
};


// The `run` function provides a convenient way to parse a program and run it in a fresh scope.
function run(program) {
    return evaluate(parse(program), Object.create(topScope));
}

// We’ll use object prototype chains to represent nested scopes so that the program can add bindings 
// to its local scope without changing the top-level scope.

// A Simple Program to print sum of numbers 1 to 10 (used as Test)
// ------------------------------------------------

run(`
do(define(total, 0)
   define(count, 1),
   while(<(count, 11),
         do(define(total, +(total, count)),
            define(count, +(count, 1)))),
   print(total))
`);
// → 55


/*
 * Functions
 * ---------
 *
 * Functions in Egg get their own local scope. The function produced by the fun form creates 
 * this local scope and adds the argument bindings to it. It then evaluates the function body 
 * in this scope and returns the result.
 */

// `fun` construct treats its last argument as the function’s body and uses all arguments 
// before that as the names of the function’s parameters.
specialForms.fun = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError("Functions need a body");
    }

    let body = args[args.length - 1];
    // Get the names of parameters of the function.
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != word) {
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });

    return function() {
        if (arguments.length != params.length) {
            throw new TypeError("Wrong number of arguments");
        }

        // Create a local scope to store the arguments of a function.
        let localScope = Object.create(scope);
        for (let i = 0; i  < arguments.length; i++) {
            localScope[params[i]] = arguments[i];
        }

        return evaluate(body, localScope);
    };
};


/*
 * Testing functions in Egg
 * ------------------------
 */

run(`
do(define(plusOne, fun(a, +(a, 1))),
   print(plusOne(10)))
`);
// → 11

run(`
do(define(pow, fun(base, exp,
     if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
   print(pow(2, 10)))
`);
// → 1024