(async function() {
  Array.prototype.sum = function() {
    return this.reduce((a, c) => a + c, 0);
  };
  
  var result = await fetch("https://adventofcode.com/2021/day/7/input");
  var raw = (await result.text()).trim();
  //raw = "16,1,2,0,4,2,7,1,2,14";
  var data = raw.split(",").map(x => parseInt(x));
  
  var calcFuel = ((pos) => {
    return data.map(x => Math.abs(x - pos)).sum();
  });
  
  var calcFuel2 = ((pos) => {
    return data.map(x => (Math.abs(x - pos) / 2)*(Math.abs(x - pos)+1)).sum();
  });
  
  var min = 9999999999;
  for (let i=0; i<1000; i++) {
    let sum = calcFuel(i);
    if (sum < min) {
      min = sum;
    }
  }
  console.log(min)
  
  min = 9999999999;
  for (let i=0; i<1000; i++) {
    let sum = calcFuel2(i);
    if (sum < min) {
      min = sum;
    }
  }
  console.log(min)
  
})();