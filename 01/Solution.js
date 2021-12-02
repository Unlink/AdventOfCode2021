(async function() {

  var result = await fetch("https://adventofcode.com/2021/day/1/input");
  var numbers = (await result.text()).split("\n").map(x => parseInt(x));
  
  var last = NaN;
  var last2 = NaN;
  var incCount = 0;
  var incCount2 = 0;
  var slidingWindow = [];
  for (var i of numbers) {
    if (last != NaN && last < i) {
      incCount++;
    }
    last = i;
    
    slidingWindow.push(i);
    if (slidingWindow.length > 3) {
      slidingWindow.shift(); 
    }
    if (slidingWindow.length == 3) {
      var sum = slidingWindow.reduce((p, c) => p + c);
      if (last2 != NaN && last2 < sum) {
        incCount2++;
      }
      last2 = sum;
    }
  }
  
  console.log("Increments", incCount);
  console.log("Increments2", incCount2);
})();