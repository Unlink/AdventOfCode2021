(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/14/input");
  var raw = (await result.text()).trim();
  /*raw = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;*/
  
	var parts = raw.split("\n\n");
  var polymer = [...parts[0]];
  var origPolymer = [...parts[0]];
  var rules = Object.assign({}, ...parts[1].split("\n").map(x => x.split(" -> ")).map(x => ({[x[0]]: x[1]})));
  
  console.log(polymer, rules);
  
  for (let i=0; i<10; i++) {
    let newPolymer = [];
    for (let j=0; j<polymer.length -1; j++) {
      newPolymer.push(polymer[j]);
      let pair = polymer[j]+polymer[j+1];
      if (pair in rules) {
        newPolymer.push(rules[pair]);
      }
    }
    newPolymer.push(polymer[polymer.length - 1]);
    polymer = newPolymer;
    //console.log(polymer);
  }
  let counts = polymer.reduce((a, e) => { a[e] = a[e] ? a[e] + 1 : 1; return a }, {});
  console.log(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)))
  
  let createOrAdd = ((dict, key, val = 1) => {
    if (!(key in dict)) {
      dict[key] = 0;
    }
    dict[key] += val;
  });
  let pairs = {};
  for (let j=0; j<origPolymer.length -1; j++) {
    let pair = origPolymer[j]+origPolymer[j+1];
    createOrAdd(pairs, pair);
  }
  
  for (let i=0; i<40; i++) {
    let newPairs = {};
    for (let p in pairs) {
      if (p in rules) {
        createOrAdd(newPairs, p[0]+rules[p], pairs[p]);
        createOrAdd(newPairs, rules[p]+p[1], pairs[p]);
      }
      else {
        createOrAdd(newPairs, p, pairs[p]);
      }
    }
    pairs = newPairs;
  }
  counts = {};
  for (let p in pairs) {
    createOrAdd(counts, p[0], pairs[p]);
  }
  counts[origPolymer[origPolymer.length-1]]++; //Last character of polymer is not included in pairs counter
  
  console.log(pairs);
  console.log(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)))
  
  
})();