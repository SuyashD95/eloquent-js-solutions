/*

Chapter 7 - Project: A Robot (11/1/2020)

Objective: Build an automaton, a little program that performs a task in a
virtual world. Our automaton will be a mail-delivery robot picking up and
dropping off parcels.

*/

// Utility Code

// Create an Array containing the list of roads that exists between
// multiple locations (places) in Meadowfield.
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
];


function buildGraph(edges) {
    /* 
     * `graph` is a map-like Object which does not derive properties from
     * any prototype including Object.prototype.
     *  
     * `graph` represents the network of roads in the village. It contains a
     * mapping of places with an array of roads which connect them to other places
     * in the village.
     */

    let graph = Object.create(null);

    function addEdge(from, to) {
        /* 
         * Add a new property with an edge connecting to the destination 
         * if no place exists matching the source location;
         * 
         * Otherwise, add the destination to an existing array containing the roads
         * from the given source location.
         */
 
        if (graph[from] == null) {
            graph[from] = [to];
        } 
        else {
            graph[from].push(to);
        }
    }

    // Loop over an array containing a series of routes (as strings) and add them as
    // edges of the `graph` object.
    // 
    // The arrow function in the `map` function splits the string into
    // a source-destination pair.
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }

    return graph;
}

// Create a Graph object that can be used to organize & reference the
// network of roads that exist in Meadowfield village.
//
// Since `roadGraph` has been declared constant in the global scope, it is
// a read-only Object that can be referenced by all the classes/functions.
const roadGraph = buildGraph(roads);

function randomPick(array) {
    /*
     * Return a randomly selected element from a given `array`.
     */
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function findRoute(graph, from, to) {
    /*
     * Find the shortest route between `from` and `to` places. The path is found
     * using the breadth-first search approach and the returned path is the first
     * one which reaches the destination from the given starting location.
     */
    
    // A `work` list is an array of places that should be explored next, along with
    // the route that got us there. It starts with just the start position and an
    // empty route.
    let work = [{at: from, route: []}];

    for (let i = 0; i < work.length; i++) {
        // The search operates by taking the next item in the `work` list.
        let {at, route} =  work[i];

        // Explore all the places that can be reached via roads originating from
        // the `at` place.
        for (let place of graph[at]) {
            // If one of them is the goal, a finished route can be returned. 
            if (place == to) {
                return route.concat(place);
            }

            // Otherwise, if we haven’t looked at this place before, a new item 
            // is added to the `work` list.
            if (!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

// End of Utilitarian Code


// VillageState Class

class VillageState {
    /*
    * This class models the current state of the mail-delivery robot.
    * 
    * The class holds information about the current place (location)
    * of the Robot as well as an Array containing instances of Parcels
    * currently being carried by him (i.e., parcels that have been picked up
    * but still needs to be delivered to their proper destination) as well as
    * parcels that still needs to be picked up by the Robot.
    *
    * Hence, the `parcels` represents all the parcels needs to be picked up &
    * delivered by the robot to mark the process of mail-delivery as completed
    * and terminal condition for a simulation.
    * 
    * This will include all the parcels that are either being carried over
    * from the previous state or have just been picked up by the robot to be
    * delivered to their specified address.
    */

    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        /* 
         * Moves the Robot to the destination if a road exists between the current
         * place and the designated destination. Otherwise, returns back the original 
         * instance (containing info about current state).
         * 
         * This function returns a new `VillageState` instance if it's possible for
         * the Robot to directly move to the specified destination.
         * 
         * Therefore, `move` is a pure function because it does not modify the object
         * representing robot's current state. This also allows us to easily keep a track 
         * of the little automaton's movements.
         */

        // If no road exists between the current place and the destination,
        // return back the orginal state (bound to `this`) which called the
        // `move` function.
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        }
        // Otherwise, return a new state of the Robot, after moving to & (possibly)
        // delivering the parcel at its specified destination. 
        // 
        // The new `villageState` instance will have the `destination` as its new `place`
        // and will need to create a new set of Parcels representing the (remaining) parcels
        // that are still in robot's possession after delivering the ones that were 
        // addressed to their `destination`.
        else {
            // Initialize a new set of parcels, using the map function to model
            // the process of moving the parcels (under robot's custody) to the
            // new place.
            // 
            // Once moved (new set of parcels have been created) to the new place
            // (`destination`), use the filter() function to model the process of
            // delivering the parcels at their specified address (which is same as
            // `destination`). 
            // 
            // `p` represents each parcel that are currently carried by the robot
            // or still needs to be picked up by him.
            let parcels = this.parcels.map(p => {
                // Do not modify the Parcel instance if the robot has yet not picked
                // up the `parcel`.
                if (p.place != this.place) {
                    return p;
                }
                // Otherwise, change the `place` property of the Parcel object to point to
                // the `destination` of any parcel(s), picked up by the robot (at current place) or
                // is already in robot's possession.
                return { 
                    place: destination, 
                    address: p.address
                };
            }).filter(p => p.place != p.address);

            // Return a new instance of `VillageState` representing the next
            // state of the automaton after a valid movement to `destination` 
            // and delivering the parcels (to their specified `address`),
            // and containing a (new) set of (yet undelivered) parcels.
            return new VillageState(destination, parcels);
        }
    }
}

VillageState.random = function(parcelCount = 5) {
    /*
     * `random` is a static method of `VillageState` which is responsible to 
     * return a new `VillageState` object which is used as a starting point for
     * a Robot object to start the journey of picking up & delivering all the 
     * parcels in Meadowfield.
     *
     * `parcelCount` lists the total no. of parcels that needs to be picked up & delivered
     * delivered by the Robot.
     * 
     * The returned instance (of `VillageState`) has two instance properties in
     * the form of `place` & 'parcels'.
     *
     * The `place` property will act as the starting place, will always reference
     * the "Post Office" of the village.
     *
     * And, the `parcels` property will be an array of Parcel objects (with each
     * parcel containing properties to reference to their respective pickup place & receiving
     * address). The robot needs to ensure all the parcel objects are delivered 
     * i.e., the length of `parcels` Array needs to be 0, to consider the journey
     */
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;  // Still needs to be initialized.
        
        // Use a do/while loop to prevent creation of any Parcel object 
        // whose pickup and drop points are referencing the same place 
        // (i.e., they are sent from the same place that they are addressed 
        // to).
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);

        parcels.push({place, address});
    }

    return new VillageState("Post Office", parcels);
};

// End of VillageState Class


// Demonstration that the above code is behaving in an expected manner.
let first = new VillageState(
    "Post Office", 
    [{place: "Post Office", address: "Alice's House"}]
);

let next = first.move("Alice's House");

// A matching result would mean:
// The robot is correctly simulating movement to a new place.
console.log(next.place);
// → Alice's House

// The robot is correctly simulating delivery of parcels to their
// specified address.
console.log(next.parcels);
// → []

// The move() function does not modify/mutate the original state i.e.,
// it continues to be pure.
console.log(first.place);
// → Post Office

// MAIN EXECUTABLE FUNCTION

function runRobot(state, robot, memory) {
    /*
     * `runRobot` is the executable function which takes in an object of
     * Robot (or functions implmenting a similar interface) in the form of 
     * `robot`, a starting `VillageState` instance which is given to the 
     * `robot` and a `memory` object which keeps a history of robot's actions 
     * to deliver all the parcels to their respective addresses.
     *
     * This function is used to simulate the whole process of the automaton
     * picking up the individual parcels by visiting every location and
     * delivering them to their specified addresses.
     */

    // Continue with simulation until all the parcels have been delivered.
    for (let turn = 0;; turn++) {

        // A series of print statements for debugging purposes.
        console.log(`On turn ${turn} at ${state.place}:\n\nParcels:`);
        for (let parcel of state.parcels) {
            let {place:pickup, address} = parcel;
            console.log(`Parcel ${state.parcels.indexOf(parcel) + 1}: from ${pickup} to ${address}`)
        }
        console.log('\n');

        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }

        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Action: Moved to ${action.direction}\n`);
    }
}


// Implementation of randomRobot

function randomRobot(state) {
    /*
     * `randomRobot` utilizes a naive strategy of just walking in a 
     * random direction every turn.
     * 
     * Using this strategy, it is very much possible for the robot to
     * eventually run into all the parcels (by reaching their pickup places)
     * and then also at some point, will reach the palce where they should
     * be delivered.
     *
     * Since this robot doesn't need to remember anything, it omits the `memory`
     * property in its returned object (`action`).
     *
     * Returns an `action` object with a randomly selected place that
     * can be legally travelled to & from the current place (because a
     * road exists between the two aforementioned locations).
     */
    
    return {direction: randomPick(roadGraph[state.place])};
}

// End of Implementation of randomRobot


// SIMULATION of RandomRobot

runRobot(VillageState.random(), randomRobot);

// Result: Due to the naive approach taken by randomRobot, the robot
// takes a lot of turns to deliver the parcels because it isn't planning
// ahead very well (doesn't use memory).

// End of SIMULATION of RandomRobot


// Implementation of routeRobot

// One possible route which covers every place in Meadowfield.
const mailRoute = [
    "Alice's House", "Cabin",         "Alice's House", "Bob's House",
    "Town Hall",     "Daria's House", "Ernie's House",
    "Grete's House", "Shop",          "Grete's House", "Farm", 
    "Marketplace",   "Post Office"
];

function routeRobot(state, memory) {
    /*
     * `randomRobot` utilizes a strategy similar to the way real-world 
     * mail delivery works.
     *
     * The robot travels through a route (that passes all places in the village)
     * twice, at which point it is guaranteed to be done. This is because, in the
     * first pass, it could pickup all the parcels in the village (as well as 
     * make some deliveries) and in the second pass, it will deliver the parcels
     * left under his possession after the first pass. The robot doesn't need 
     * to do any pickups in the second pass.
     *
     * No matter what, the robot will take a maximum of 26 turns (twice the 13-step
     * `mailRoute`) to complete the objective, but in most cases, it will be usually less. 
     *
     * Returns an `action` object where `direction` references the place where robot
     * will travel next and `memory` will reference an array representing the remaining
     * places that needs to be visited after robot moves to the `direction` place.
     */
    
    if (memory.length == 0) {
        memory = mailRoute;
    }

    return {
        direction: memory[0],
           memory: memory.slice(1)
    };
}

// End of Implementation of routeRobot


// SIMULATION of routeRobot

runRobot(VillageState.random(), routeRobot, []);

// End of SIMULATION of routeRobot


// Implementation of goalOrientedRobot

function goalOrientedRobot({place, parcels}, route) {
    /*
     * The robot tries to actively decide on the shortest route between places to pick up
     * & deliver parcels.
     *
     * This robot uses its memory value as a list of directions to move in, just like the 
     * route-following robot. Whenever that list is empty, it has to figure out 
     * what to do next. 
     * 
     * It takes the first undelivered parcel in the set and, if that parcel hasn’t been 
     * picked up yet, plots a route toward it. 
     * 
     * If the parcel has been picked up, it still needs to be delivered, so the robot creates 
     * a route toward the delivery address instead.
     *
     * Returns an `action` object where `direction` property references the place where
     * the robot will travel next and the `memory` property will reference an array 
     * representing the remaining places that needs to be visited in the route, 
     * after robot moves to the `direction` place.
     */
    
    // If no route is decided, then find the shortest route to the pickup point of the
    // first parcel in `parcels` (if its yet to be picked). Otherwise, if the parcel has 
    // already been picked, then find the shortest route to the parcel's address.
    // 
    // Skip the step of finding a route, if a robot is already travelling through a route.
    if (route.length == 0) {
        console.log("Decision: Robot decides on a new route.\n");

        let parcel = parcels[0];

        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
            console.log(`Route to PICK UP Parcel 1 at ${parcel.place}: ${route}`);
        }
        else {
            route = findRoute(roadGraph, place, parcel.address);
            console.log(`Route to DELIVER Parcel 1 to ${parcel.address}: ${route}`);
        }
    } else {
        console.log("Decision: Robot continues to move in the already decided route");
    }

    return {
        direction: route[0],
        memory: route.slice(1);
    }
}

// End of Implementation of goalOrientedRobot


// SIMULATION of goalOrientedRobot

runRobot(VillageState.random(), goalOrientedRobot, []);

// End of SIMULATION of goalOrientedRobot