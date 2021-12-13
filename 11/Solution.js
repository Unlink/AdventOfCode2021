(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/11/input");
  var raw = (await result.text()).trim();
  /*raw = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;*/
  
  var data = raw.split("\n").map(x => x.split("").map(y => parseInt(y)));
  
  var flashCount = 0;
  var counter = 0;
  
  let flashed = new Set();
  while (flashed.size != 100) {
    flashed.clear();
    let flash = ((y, x) => {
      if (data[y][x] > 9 && !flashed.has(y+":"+x)) {
        flashed.add(y+":"+x);
        //console.log("flashing "+y+":"+x);
        for (let i=Math.max(0, y-1); i <= Math.min(data.length - 1, y+1); i++) {
      		for (let j=Math.max(0, x-1); j <= Math.min(data[i].length - 1, x+1); j++) {
            if (i != y || j != x)
              data[i][j]++;
      				flash(i, j);
    			}
    	  }
      }
    });
    //Initial update
    data = data.map(x => x.map(y => y + 1));
    
    //Flash
    data.forEach((e, y) => e.forEach((d, x) => flash(y, x)));
    
    //Reset
    data = data.map(x => x.map(y => y < 10 ? y : 0));
    
    if (counter < 100) {
    	flashCount += flashed.size;
    }
    counter++;
    //console.log(data.map(x => x.join("")).join("\n"));
  }
  console.log(flashCount, counter);
  
  
})();