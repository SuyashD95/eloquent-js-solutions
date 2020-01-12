/*

1 - Measuring A Robot (12/1/2020)

It’s hard to objectively compare robots by just letting them solve a few scenarios. Maybe one robot just happened to get easier tasks or the kind of tasks that it is good at, whereas the other didn’t.

Write a function compareRobots that takes two robots (and their starting memory). It should generate 100 tasks and let each of the robots solve each of these tasks. When done, it should output the average number of steps each robot took per task.

For the sake of fairness, make sure you give each task to both robots, rather than generating different tasks per robot.

*/

function runRobot(state, robot, memory) {
    /*
     * Return the no. of turns taken by a robot to pickup & deliver 
     * all the parcels.
     */
    for (let turn = 0;; turn++) {

        for (let parcel of state.parcels) {
            let {place:pickup, address} = parcel;
        }

        if (state.parcels.length == 0) {
            return turn;
        }

        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
    }
}

function compareRobots(robot1, memory1, robot2, memory2) {
    let totalTurnsRobot1 = 0;
    let totalTurnsRobot2 = 0;

    for (var task = 0; task < 100; task++) {
        let taskState = VillageState.random();

        totalTurnsRobot1 += runRobot(taskState, robot1, memory1);
        totalTurnsRobot2 += runRobot(taskState, robot2, memory2);
    }

    console.log(`Average Turns Taken By Robot 1 to complete ${task} tasks: ${totalTurnsRobot1 / task}.`)
    console.log(`Average Turns Taken By Robot 2 to complete ${task} tasks: ${totalTurnsRobot2 / task}.`)
}

compareRobots(routeRobot, [], goalOrientedRobot, []);
//-> Average Turns Taken By Robot 1 to complete 100 tasks: 18.69.
//-> Average Turns Taken By Robot 2 to complete 100 tasks: 15.27.
