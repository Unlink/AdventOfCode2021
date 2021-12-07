(async function() {
  
  var result = await fetch("https://adventofcode.com/2021/day/6/input");
  var raw = (await result.text()).trim();
  //raw = "3,4,3,1,2";
  var data = raw.split(",").map(x => parseInt(x));
  //console.log(data);
  var counts = Array(9).fill(0);
  for (let i of data) {
    counts[i]++;
  }
  console.log(counts);
  
  for (let i=0; i < 256; i++) {
    var toBeBorn = counts.shift();
    counts.push(toBeBorn);
    counts[6] += toBeBorn;
  }
  console.log(counts.reduce((a, c) => a + c))
})();