(async function() {
  
  var result = await fetch("https://adventofcode.com/2021/day/5/input");
  var raw = (await result.text()).trim().split("\n");
/* raw = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.split("\n");*/
  var data = raw.map(x => x.split(" -> ").map(z => z.split(",").map(y => parseInt(y))));
  //console.log(data);
  
  var intCmp = ((a, b) => a == b ? 0 : (a < b) ? 1 : -1);
  
  var lineData = {}
  for (let l of data) {
    [x1, y1, x2, y2] = [].concat(...l);    
    let xDiff = intCmp(x1, x2);
    let yDiff = intCmp(y1, y2);
    
    for (let i = x1, j = y1; i != (x2 + xDiff) || j != (y2 + yDiff); i+=xDiff, j+=yDiff) {
      //if (x1 == x2 || y1 == y2) { //Part1
        let key = [i, j];
        if (!(key in lineData)) {
          lineData[key] = 0;
        }
        lineData[key]++;
      //}
    }
  }
  console.log(lineData, Object.values(lineData).filter(x => x > 1).length);
  
  let display = ((data) => {
    let keys = Object.keys(data).map(x => x.split(",").map(y => parseInt(y)));
    let xMax = Math.max(...keys.map(x => x[0]));
    let yMax = Math.max(...keys.map(x => x[1]));
    let output = "";
    for (let i=0; i<=yMax; i++) {
      for (let j=0; j<=xMax; j++) {
        if ([j,i] in data) {
          output += data[[j,i]];
        }
        else {
          output += ".";
        }
      }
      output += "\n";
    }
    
    console.log(output);
  });
  
  display(lineData);
  
})();