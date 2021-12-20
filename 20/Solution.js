(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/20/input");
  var raw = (await result.text()).trim();
  /*raw = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;*/
  
  var enhanceAlgorithm = raw.trim().split("\n")[0];
  var image = raw.trim().split("\n").slice(2);
  
  console.log(enhanceAlgorithm, image);
  
  let minX = 0, minY = 0, maxX = image[0].length, maxY = image.length;
  
  function* getNeighbors(x, y, data) {
    for (let i=y-1; i<y+2; i++) {
    	for (let j=x-1; j<x+2; j++) {
        let nX = j < 0 ? data[0].length+j : (j >= data[0].length ? 0 : j);
        let nY = i < 0 ? data.length+i : (i >= data.length ? 0 : i);
    		yield [nX,nY];
  		}
    }
  }
  
  function print(data) {
    let output = "";
    
    for (let i=0; i<data.length; i++) {
    	for (let j=0; j<data[i].length; j++) {
    		output += data[i][j];
 			}
      output += "\n";
  	}
    console.log(output);
  }
  
  let data = Array(image.length * 3).fill(null).map(x => Array(image[0].length * 3).fill("."));
  
  for (let i=0; i<image.length; i++) {
    for (let j=0; j<image[i].length; j++) {
    	data[i + image.length][j + image[0].length] = image[i][j];
 		}
  }
  print(data);                                        
  
  //For example image is 50x too smal, but it works on real data
  for (let i=0; i<50; i++) {
    let newData = data.map((r, y) => r.map((v, x) => {
      let number = "";
      for (let [a,b] of getNeighbors(x, y, data)) {
        //console.log([b, a]);
        if (data[b][a] == "#") {
          number += "1";
        }
        else {
          number += "0";
        }
      }
      let index = parseInt(number, 2);
      return enhanceAlgorithm[index];
    }));
    data = newData;
    print(data);
  }
  
  console.log(data.reduce((a, c) => a + c.reduce((a2, v) => a2 + (v == "#" ? 1 : 0), 0), 0));
  
  
})();