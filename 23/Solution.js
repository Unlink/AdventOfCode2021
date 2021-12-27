(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/23/input");
  var raw = (await result.text()).trim();
  /*raw = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;*/
  
  let addition = `  #D#C#B#A#
  #D#B#A#C#`;
  
  
  
  let lines = raw.split("\n");
  if (addition != undefined) {
    lines.splice(3, 0, ...addition.split("\n"));
  }
	let hallway = lines[1].slice(1, -1).split("").map(x => null);
  let roomsOffsets = [2, 4, 6, 8];
  let mapA = (x => x.charCodeAt(0)-65);
  let mapB = ((x) => x == null ? "." : String.fromCharCode(x+65));
  let rooms = roomsOffsets.map(o => lines.slice(2, -1).map((l, i) => mapA(lines[i+2][o+1])));
  //console.log(hallway, rooms);
  //return;
  
  let toExplore = [];
  toExplore.push([0, hallway, rooms]);
  
  let doMoveToRoom = ((from, cost, hallway, rooms) => {
    let amp = hallway[from];
    let roomCost = rooms[amp].filter(x => x == null).length;
    let moveCost = cost + (Math.abs(roomsOffsets[amp] - from) + roomCost) * Math.pow(10, amp);
    let newHallway = hallway.map(x => x);
    newHallway[from] = null;
    let newRooms = rooms.map(x => x.map(y => y));
    newRooms[amp][roomCost-1] = amp;
    toExplore.push([moveCost, newHallway, newRooms]);
  });
  
  let doMoveFromRoom = ((room, dest, cost, hallway, rooms) => {
    let roomPos = rooms[room].filter(x => x == null).length;
    let moveCost = cost + (Math.abs(roomsOffsets[room] - dest) + roomPos + 1) * Math.pow(10, rooms[room][roomPos]);
    let newHallway = hallway.map(x => x);
    newHallway[dest] = rooms[room][roomPos];
    let newRooms = rooms.map(x => x.map(y => y));
    newRooms[room][roomPos] = null;
    toExplore.push([moveCost, newHallway, newRooms]);
  });
  
  let isFinish = ((rooms) => rooms.every((x, k) => x.every(z => z == k)));
  
  let print = ((hallway, rooms) => {
    let output = "#".repeat(hallway.length+2);
    output += "\n#"+hallway.map(x => mapB(x)).join("")+"#\n";
    for (let i=0; i<rooms[0].length; i++) {
      let pad = "  #";
      if (i == 0) {
        pad = "###";
      }
    	output += pad+mapB(rooms[0][i])+"#"+mapB(rooms[1][i])+"#"+mapB(rooms[2][i])+"#"+mapB(rooms[3][i])+(pad.split("").reverse().join())+"\n";
    }
    output += "  #########";
    console.log(output);
  });
  
  let solutionScore = ((rooms) => {
    return rooms.reduce((a, c, i) => a + (c[0] == i ? 2 : -1) + (c[1] == i ? 2 : -1), 0);
  });
  
  /*doMoveFromRoom(2, 3, ...toExplore.pop());
  console.log(toExplore);
  doMoveFromRoom(1, 5, ...toExplore.pop());
  console.log(toExplore);
  doMoveToRoom(5, ...toExplore.pop());
  console.log(toExplore);
  
  console.log(isFinish([[0, 2], [1, 1], [2, 2], [3, 3]]));
  */
  
  //Guess
  let min = 200000;
  let stepCounter = 0;
  while (toExplore.length > 0) {
    /*toExplore.sort((a, b) => {
      //return a[0] - b[0];
      
      let s1 = solutionScore(a[2]);
      let s2 = solutionScore(b[2]);
      
      if (s1 == s2) { 
      	return a[0] - b[0];
      }
      return s1 - s2;
    });*/
    
  	let [cost, hallway, rooms] = toExplore.pop();
    if (cost > min) {
      continue;
    }    
    if (stepCounter++ % 100000 == 0) {
      //print(hallway, rooms);
      console.log(min, cost, toExplore.length, solutionScore(rooms));
      //if (!confirm("aa")) return; 
    }
    if (isFinish(rooms)) {
      if (cost < min) {
        min = cost;
        console.log(cost, toExplore.length);
      }
    }
    //Try move from hallway to room
    for (let i=0; i<hallway.length; i++) {
      let amp = hallway[i];
      if (amp != null) {
        //Move to room is allowed
        if (rooms[amp].filter(x => x != null && x != amp).length == 0) {
          //Check path
          if (i < roomsOffsets[amp] && hallway.slice(i+1, roomsOffsets[amp]+1).every(x => x == null)) {
            //move to correct room
            //console.log("mooving from "+i+" to room");
            doMoveToRoom(i, cost, hallway, rooms);
          } 
          else if (i > roomsOffsets[amp] && hallway.slice(roomsOffsets[amp], i).every(x => x == null)) {
            //move to correct room
            //console.log("mooving from "+i+" to room");
            doMoveToRoom(i, cost, hallway, rooms);
          }
        }
      }
    }
    
    //Try move from room to hallway
    for (let i=0; i<roomsOffsets.length; i++) {
      if (rooms[i].filter(x => x != null && x != i).length > 0) {
        for (let j=0; j<hallway.length; j++) {
          //Can go there?
          if (!roomsOffsets.includes(j) && (j < roomsOffsets[i] ? hallway.slice(j , roomsOffsets[i]+1) : hallway.slice(roomsOffsets[i], j+1)).every(x => x == null)) {
            //console.log("mooving from room "+i+" to "+j);
            doMoveFromRoom(i, j, cost, hallway, rooms);
          }
        }
      }
    }
  }
  
  console.log("done");
  
  
  
})();