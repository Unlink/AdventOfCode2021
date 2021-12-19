(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/18/input");
  var raw = (await result.text()).trim();
  /*raw = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;*/
  var data = raw.split("\n");
  
  class SNumber {
    constructor(a = null, b = null) {
      this.a = a;
      this.b = b;
      this.parent = null;
      if (this.a != null && typeof this.a === "object") {
        this.a.parent = this;
      }
      if (this.b != null && typeof this.b === "object") {
        this.b.parent = this;
      }
    }
    
    setNum(number) {
      if (this.a == null) {
        this.a = number;
        if (typeof number === "object") {
          number.parent = this;
        }
      }
      else {
        this.b = number;
        if (typeof number === "object") {
          number.parent = this;
        }
      }
    }
    
    add(number) {
      let n = new SNumber(this, number);
      n.reduce();
      return n;
    }
    
    toString() {
      return "["+this.a.toString()+","+this.b.toString()+"]";
    }
    
    magnitude() {
      return ((typeof this.a === "number") ? 3*this.a : 3*this.a.magnitude()) + ((typeof this.b === "number") ? 2*this.b : 2*this.b.magnitude());
    }
    
    reduce() {
      while (this.explode() || this.split()) {
        //console.log(this.toString());
      }
    }
    
    explode() {
      let toLookup = [[1, this.b], [1, this.a]];
      while (toLookup.length > 0) {
        let [level, num] = toLookup.pop();
        //console.log(num);
        if (typeof num !== "number" && !num.hasRegularNumbers()) {
          toLookup.push([level + 1, num.b, num]);
          toLookup.push([level + 1, num.a, num]);
        }
        else if (level == 4 && typeof num === "object" && num.hasRegularNumbers()) {
          //console.log([level, num]);
          if (num == num.parent.a) {
            num.parent.a = 0;
            if (typeof num.parent.b === "object") {
              num.parent.b.a = num.parent.b.a + num.b;
            }
            else {
            	num.parent.b = num.parent.b + num.b;
            }
            //Lookup previous
            let node = num.parent
            while (node.parent != null && node.parent.a == node) node = node.parent;
            if (node.parent != null) {
              node = node.parent;
              if (typeof node.a === "number") {
                node.a += num.a;
              }
              else {
                node = node.a;
                while (typeof node.b !== "number") node = node.b;
                node.b += num.a;
              }
            }
            
          }
          else {
            num.parent.b = 0;
            if (typeof num.parent.a === "object") {
              num.parent.a.b = num.parent.a.b + num.a;
            }
            else {
              num.parent.a = num.parent.a + num.a;
            }
            //Lookup next
            let node = num.parent
            while (node.parent != null && node.parent.b == node) node = node.parent;
            //console.log(node);
            if (node.parent != null) {
              node = node.parent;
              if (typeof node.b === "number") {
                node.b += num.b;
              }
              else {
                node = node.b;
                while (typeof node.a !== "number") node = node.a;
                node.a += num.b;
              }
            }
          }
          return true;
        }
      }
      
    }
    
    split() {
      let s = ((node) => {
        if (typeof node.a === "number") {
          if (node.a > 9) {
            node.a = new SNumber(parseInt(node.a / 2), parseInt(Math.ceil(node.a / 2)));
          	node.a.parent = node;
            return true;
          }
        }
        else {
          if (s(node.a)) return true;
        }
        if (typeof node.b === "number") {
          if (node.b > 9) {
            node.b = new SNumber(parseInt(node.b / 2), parseInt(Math.ceil(node.b / 2)));
          	node.b.parent = node;
            return true;
          }
        }
        else {
          if (s(node.b)) return true;
        }
        
        return false;
      });
      
      return s(this);
      
    }
    
    hasRegularNumbers() {
      return typeof this.a === "number" && typeof this.b === "number";
    }
  }
  
  let parseNumber = ((str) => {
    let stack = [];
    let chars = str.split("");
    for (let i=0; i<chars.length; i++) {
      let c = chars[i];
      if (c == "[") {
        stack.push(new SNumber());
      }
      else if (c == "]") {
        let num = stack.pop();
        if (stack.length == 0) return num;
        stack[stack.length - 1].setNum(num);
      }
      else if (c == ",") continue;
      else {
        let numStr = c;
        while (!isNaN(parseInt(chars[i+1]))) {
          numStr += chars[i+1];
          i++;
        }
        stack[stack.length - 1].setNum(parseInt(numStr));
      }
    }
  });
  
  //let a = parseNumber("[[[[4,3],4],4],[7,[[8,4],9]]]");
  //let b = parseNumber("[1,1]");
  /*let c = parseNumber("[[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]],[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]]");
  console.log(c.toString());
  c.reduce();
  console.log(c.toString());*/
  
  //console.log(a.toString(), b.toString());
  //console.log(a.add(b).toString());
  //console.log(parseNumber("[9,1]").magnitude())
  
  let odlData = data.map(x => x);
  let number = parseNumber(data.splice(0, 1)[0]);
  //console.log(number);
  for (let s of data) {
    number = number.add(parseNumber(s));
    console.log(number.toString());
  }
  
  console.log(number.toString());
  console.log(number.magnitude());
  
  let max = 0;
  for (let i=0; i<odlData.length; i++) {
    for (let j=0; j<odlData.length; j++) {
    	if (i != j) {
        let m = parseNumber(odlData[i]).add(parseNumber(odlData[j])).magnitude();
        //console.log([i, j, m]);
        if (m > max) {
          max = m;
        }
      }
  	}
  }
  
  console.log(max);
})();