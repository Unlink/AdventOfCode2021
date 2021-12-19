(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/15/input");
  var raw = (await result.text()).trim();
  /*raw = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;*/
  
	var cave = raw.split("\n").map(x => x.split("").map(y => parseInt(y)));
  
  var repeats = 5;
  var extendedCave = Array(repeats * cave.length)
  		.fill(null)
  		.map(() => Array(repeats * cave[0].length).fill(1))
  		.map((r, y) => r.map((v, x) => {
        return ((cave[y % cave.length][x % cave[0].length] + (parseInt(y / cave.length) + parseInt(x / cave[0].length)) - 1) % 9) + 1;
      }));
  
  var caveData = cave.map(x => x.map(y => [y, 99999999, null]));
  caveData = extendedCave.map(x => x.map(y => [y, 99999999, null]));
  
  //console.log(extendedCave)
  
  var toExplore = [[0,0]];
  
  caveData[0][0][1] = 0;
  
  let explore = ((from, to) => {
    if (caveData[to[0]][to[1]][1] > caveData[from[0]][from[1]][1] + caveData[to[0]][to[1]][0]) {
      caveData[to[0]][to[1]][1] = caveData[from[0]][from[1]][1] + caveData[to[0]][to[1]][0];
      caveData[to[0]][to[1]][2] = from;
      return to;
    }
  });
  while (toExplore.length > 0) {
    toExplore.sort((a, b) => caveData[b[0]][b[1]][1] - caveData[a[0]][a[1]][1]);
    var p = toExplore.pop();
    let x, y, n;
    [y, x] = p
    
    //console.log(caveData[y][x][1])
    if (y == (caveData.length - 1) && x == (caveData[0].length - 1)) {
      console.log(caveData[caveData.length - 1][caveData[0].length - 1])
      break;
    }
    if (x - 1 >= 0 && (n = explore(p, [y, x-1])) != undefined) {
      toExplore.push(n)
    }
    if (y - 1 >= 0 && (n = explore(p, [y-1, x])) != undefined) {
      toExplore.push(n)
    }
    if (x + 1 < caveData[y].length && (n = explore(p, [y, x+1])) != undefined) {
      toExplore.push(n)
    }
    if (y + 1 < caveData.length && (n = explore(p, [y+1, x])) != undefined) {
      toExplore.push(n)
    }
  }
  console.log("done");
  
})();