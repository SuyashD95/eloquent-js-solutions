/*

2 - Robot Efficiency (12/1/2020)

Can you write a robot that finishes the delivery task faster than goalOrientedRobot? If you observe that robot’s behavior, what obviously stupid things does it do? How could those be improved?

If you solved the previous exercise, you might want to use your compareRobots function to verify whether you improved the robot.

*/

function optimizedRobot({place, parcels}, route) {
    let shortest_route = route;

    if (route.length == 0) {
        let routes = [];
        const PICK_UP = "Pick Up";
        const DELIVER = "Delivery";

        for (let parcel of parcels) {
            if (parcel.place != place) {
                route = findRoute(roadGraph, place, parcel.place);
                routes.push({
                    path: route, 
                    steps: route.length, 
                    action_type: PICK_UP
                });
            }
            else {
                route = findRoute(roadGraph, place, parcel.address);
                routes.push({
                    path: route, 
                    steps: route.length, 
                    action_type: DELIVER
                });
            }
        }
      
        if (routes.some(route => route.action_type == PICK_UP)) {
            shortest_route = routes.filter(route => {
                return route.action_type == PICK_UP;
            }).reduce((minimum_route, route) => {
                return route.steps < minimum_route.steps ? route : minimum_route;
            }).path;
        }
        else {
            shortest_route = routes.reduce((minimum_route, route) => {
                return route.steps < minimum_route.steps ? route : minimum_route;
            }).path;
        }
    } 

    return {
        direction: shortest_route[0],
        memory: shortest_route.slice(1)
    };
}

compareRobots(goalOrientedRobot, [], optimizedRobot, []);
//-> Average Turns Taken By Robot 1 to complete 100 tasks: 14.04.
//-> Average Turns Taken By Robot 2 to complete 100 tasks: 11.55.