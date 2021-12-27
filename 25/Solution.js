(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/25/input");
  var raw = (await result.text()).trim();
  
 /*raw = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;*/
  
  let map = raw.split("\n").map(x => x.split(""));
  let print = (map => console.log(map.reduce((a, c) => a + c.reduce((a2, c2) => a2+c2, "")+"\n",  "")));
  
  print(map);
  
  for (let i=0; i<1000; i++) {
    console.log(i+1);
  	let mooved = 0;  
    let newMap = map.map(x => x.map(y => y));
    
    
    //move left
    for (let y=0; y<map.length; y++) {
      for (let x=0; x<map[y].length; x++) {
      	if (map[y][x] == ">" && map[y][(x+1) % map[y].length] == ".") {
          newMap[y][x] = ".";
          newMap[y][(x+1) % map[y].length] = ">";
          mooved++;
        }
    	}
    }
    map = newMap;
    newMap = map.map(x => x.map(y => y));
    
    //move down
    for (let y=0; y<map.length; y++) {
      for (let x=0; x<map[y].length; x++) {
      	if (map[y][x] == "v" && map[(y+1) % map.length][x] == ".") {
          newMap[y][x] = ".";
          newMap[(y+1) % map.length][x] = "v";
          mooved++;
        }
    	}
    }
    map = newMap;
    print(map);
    if (mooved == 0) {
      break;
    }
  }
  
  
  console.log("done"); 
})();