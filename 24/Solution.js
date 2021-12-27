(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/24/input");
  var raw = (await result.text()).trim();
  
 /*raw = `inp z
inp x
mul z 3
eql z x`;*/
  
  var monadProgram = raw.split("\n");
  
  class Alu {
    constructor(input) {
      this.input = input;
      this.w = 0;
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    
    execute(op, a=null, b=null) {
      let bDecoded = b == null ? null : (!isNaN(parseInt(b)) ? parseInt(b) : this[b]);
      //console.log(op, a, b, bDecoded);
      switch(op) {
        case "inp":
          this[a] = this.input.pop();
          //console.log(this[a]);
          break;
        case "add":
          this[a] += bDecoded;
          break;
        case "mul":
          this[a] *= bDecoded;
          break;
        case "div":
          if (bDecoded == 0) {
            throw Error("Zero division");
          }
          this[a] = parseInt(this[a] / bDecoded);
          break;
        case "mod":
          if (this[a] < 0 || bDecoded<= 0) {
            throw Error("Modulo exception");
          }
          this[a] = this[a] % bDecoded;
          break;
        case "eql":
          this[a] = this[a] == bDecoded ? 1 : 0;
          break;
      }
      //this[a] = this[a] | 0;
    }
  }
  
  
    let input = [..."96929994293996	".split("").reverse().map(x => parseInt(x))];
    let alu = new Alu(input);
    for (let r of monadProgram) {
      alu.execute(...r.split(" "));
    }
    console.log(alu);
  
  	let a = [], b = [], c = [];
  	for (let i=0; i<monadProgram.length; i++) {
      if (monadProgram[i] == "mod x 26") {
        a.push(parseInt(monadProgram[i+1].split(" ")[2]));
        b.push(parseInt(monadProgram[i+2].split(" ")[2]));
      }
      if (monadProgram[i] == "add y w") {
        c.push(parseInt(monadProgram[i+1].split(" ")[2]));
      }
    }
  
   //console.log(a, b, c);
   let number = Array(14).fill(null); 
   let number2 = Array(14).fill(null);
   let nToCalc = [];
   for (let i=0; i<14; i++) {
     if (a[i] == 1) {
       nToCalc.push(i);
     }
     else {
       let index = nToCalc.pop();
       let offset = b[i] + c[index];
       if (offset > 0) {
         number[i] = 9;
         number[index] = 9 - offset;
         
         number2[i] = 1 + offset;
         number2[index] = 1;
       }
       else {
         number[i] = 9 + offset;
         number[index] = 9;
         
         number2[i] = 1;
         number2[index] = 1 - offset;
       }
       
       
       
       /*for (let j=9; j>0; j--) {
         let sum = j + b[i] + c[index];
         if (sum <= 9 && sum > 0) {
           //Biggest
           number[i] = sum;
           number[index] = j;
           break;
         }
       }*/
     }
   }
  console.log(number, number.join(""));
  console.log(number2, number2.join(""));
  
  console.log("done"); 
})();