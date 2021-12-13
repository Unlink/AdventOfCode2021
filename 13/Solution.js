(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/13/input");
  var raw = (await result.text()).trim();
  /*raw = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;*/
  
	var parts = raw.split("\n\n");
  var points = parts[0].split("\n").map(x => x.split(",").map(y => parseInt(y)));
  var folds = parts[1].split("\n").map(x => {
    let t = x.replace("fold along ", "").split("=");
  	return {axis: t[0], value: parseInt(t[1])}
  });
  
  //console.log(points);
  //console.log(folds);
  
  let fold = ((data, axis, value) => {
    return data.map(x => {
      let i = axis == "x" ? 0 : 1;
      if (x[i] > value) {
        x[i] = value - (x[i] - value);
      }
      return x;
    });
  });
  
  let dim = ((data) => [
    Math.min(...data.map(x => x[0])),
    Math.min(...data.map(x => x[1])),
    Math.max(...data.map(x => x[0])),
    Math.max(...data.map(x => x[1])),
  ]);
  
  let print = ((data) => {
    let sizes = dim(data);
    let output = Array(sizes[3] + 1).fill(null).map(x => Array(sizes[2] + 1).fill("."));
    let count = 0;
    for (let point of data) {
      if (output[point[1]][point[0]] == ".") {
      	output[point[1]][point[0]] = "#";
        count++;
      }
    }
    
    console.log(output.map(x => x.join("")).join("\n"), count);
  });
  
  
  print(points);
  for (let f of folds) {
    points = fold(points, f.axis, f.value)
    print(points)
  }
  
})();