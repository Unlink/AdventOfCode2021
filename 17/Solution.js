(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/17/input");
  var raw = (await result.text()).trim();
  //raw = `target area: x=20..30, y=-10..-5`;
  
  const regex = /x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/gm;
	var target = [...raw.matchAll(regex)][0].slice(1).map(x => parseInt(x));
  console.log(target);
  
  class Probe {
    constructor(velX, velY) {
      this.x = 0;
      this.y = 0;
      this.velX = velX;
      this.velY = velY;
    }
    
    step() {
      this.x += this.velX;
      this.y += this.velY;
      this.velY -= 1;
      this.velX += (this.velX > 0 ? -1 : (this.velX < 0) ? 1 : 0);
    }
  }
  
  let counter = 0;
  let maxY = 0;
  for (let i=1; i<300; i++) {
    for (let j=-100; j<800; j++) {
      let localMaxY = 0;
      let p = new Probe(i, j);
      while (p.y >= target[2]) {
        if (p.y > localMaxY) {
          localMaxY = p.y;
        }
        if (p.x >= target[0] && p.x <= target[1] && p.y >= target[2] && p.y <= target[3]) {
          //console.log(i+","+j);
          counter++;
          if (localMaxY > maxY) {
            maxY = localMaxY;
          }
          break;
        }
        p.step();
      }
    }
  }
  console.log(maxY, counter);
  
})();