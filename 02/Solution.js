(async function() {

  var result = await fetch("https://adventofcode.com/2021/day/2/input");
  var plan = (await result.text()).split("\n").map(x => x.split(" ")).map(x => [x[0], parseInt(x[1])]);
  //console.log(plan)
  
  class Submarine {
    constructor(pos = 0, depth = 0, aim = 0) {
    	this.pos = pos;
    	this.depth = depth;
      this.aim = aim;
  	}
    
    move(dir, size) {
      switch (dir) {
        case "forward":
          //this.pos += size;
          this.pos += size;
          this.depth += size * this.aim;
          break;
        case "down":
          //this.depth += size;
          this.aim += size;
          break;
        case "up":
          //this.depth -= size;
          this.aim -= size;
          break;
      }
    }
    
    get finalPosition() {
      return this.pos * this.depth;
    }
  }
  
  var submarine = new Submarine();
  for (let i of plan) {
    submarine.move(...i);
  }
  
  console.log(submarine);
  console.log(submarine.finalPosition);
  
})();