(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/12/input");
  var raw = (await result.text()).trim();
  /*raw = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;*/
  
  var data = raw.split("\n").map(x => x.split("-"));
  
  class Cave {
    constructor(name) {
      this.name = name;
      this.paths = [];
    }
    
    connect(other) {
      this.paths.push(other);
    }
  }
  
  class Path {
    constructor(state, multiVisit = null, done = false) {
      this.p = state;
      this.multiVisit = multiVisit;
      this.multiVisitDone = done;
    }
    
    canGo(cave) {
      if (cave == cave.toUpperCase() || !this.p.includes(cave)) return true;
      if (cave == this.multiVisit && !this.multiVisitDone) {
        return true;
      }
    }
    
    canDeriveMultiVisit() {
      return this.multiVisit == null;
    }
    
    derive(cave, isMultiVisit = false) {
      if (isMultiVisit && this.multiVisit != null) throw Error("Cant derrive different multivisit");
      return new Path(this.p.concat([cave]), isMultiVisit ? cave : this.multiVisit, this.multiVisitDone || (this.multiVisit == cave && this.p.includes(cave)));
    }
    
    last() {
      return this.p[this.p.length - 1];
    }
    
    singleOrMultiVisitCompleted() {
      return this.multiVisit == null || this.multiVisitDone;
    }
    
    toString() {
      return this.p.join(",")+" ["+this.multiVisit+"]";
    }
  }
  
  let caves = {};
  for (let l of data) {
    if (!(l[0] in caves)) {
      caves[l[0]] = new Cave(l[0]);
    }
    if (!(l[1] in caves)) {
      caves[l[1]] = new Cave(l[1]);
    }
    caves[l[0]].connect(caves[l[1]]);
    caves[l[1]].connect(caves[l[0]]);
  }
  
  let paths = [];
  let pathStack = [new Path(["start"])];
  while (pathStack.length > 0) {
    let curr = pathStack.pop();
    for (let next of caves[curr.last()].paths) {
      if (next.name == "start") continue;
      if (next.name == "end") {
        if (curr.singleOrMultiVisitCompleted()) {
        	paths.push(curr.derive("end"));
        }
        continue;
      }
      if (curr.canGo(next.name)) {
        pathStack.push(curr.derive(next.name));
        if (curr.canDeriveMultiVisit() && next.name == next.name.toLowerCase()) {
          pathStack.push(curr.derive(next.name, true));
        }
      }
      
    }
  }
  console.log(paths);
  console.log(paths.map(p => p.toString()).join("\n"));
  
})();