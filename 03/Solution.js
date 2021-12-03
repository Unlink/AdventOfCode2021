(async function() {

  Array.prototype.toDecimal = function() {
    return this.reduce((a, c) => a *2 + c);
  };
  
  var result = await fetch("https://adventofcode.com/2021/day/3/input");
  var raw = (await result.text()).trim();
  var data = raw.split("\n").map(x => x.split("").map(i => parseInt(i)));
  //console.log(data)
  
  var summed = data.reduce((a, c) => a.map((e, i) => e + c[i]))
  console.log(summed);
  
  var gamaRate = summed.map(x => x > (data.length/2) ? 1 : 0);
  var epsilonRate = gamaRate.map(x => x == 1 ? 0 : 1);
  console.log(gamaRate, epsilonRate);
  
  var gamaRateDec = gamaRate.toDecimal();
  var epsilonRateDec = epsilonRate.toDecimal();
  console.log(gamaRateDec, epsilonRateDec, gamaRateDec*epsilonRateDec);
  
  var bitFilter = ((data, fn, index = 0) => {
    let bitCount = data.reduce((a, c) => a + c[index], 0);
    let filtered = data.filter(c => fn(bitCount >= data.length / 2) == c[index]);
    if (filtered.length == 0) return null;
    else if (filtered.length == 1) {
      return filtered[0];
    }
    return bitFilter(filtered, fn, index+1);
  });
  
  var ox = bitFilter(data, (r) => r ? 1 : 0);
  var co2 = bitFilter(data, (r) => r ? 0 : 1);
  console.log(ox, co2, ox.toDecimal() * co2.toDecimal());
  
  
  
})();