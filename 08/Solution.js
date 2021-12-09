//Quick solution, not optimalized
(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/8/input");
  var raw = (await result.text()).trim();
  var data = raw.split("\n").map(x => x.split("|").map(y => y.trim().split(" ")));
  console.log(data);
  
  /* My segment mapping */
  /*
     0000
	5    1
	5    1
 	 6666
	4    2
	4    2
 	 3333
 */
  let countOfEasyDigits = 0;
  let countOfEasyDigits2 = 0;
  let decodedNumbers = new Set();
  for (let r of data) {
   for (let o of r[1]) {
     if (o.length == 2 || o.length == 3 || o.length == 4 || o.length == 7) {
       countOfEasyDigits++;
     }
   }
   let decodedDay = [[], [], [], [], [], [], []];
   let segments = Array(10).fill("");
   //Step 1 find segments 1,2 from number 1
   var availSegments = r[0].filter(x => x.length == 2);
   availSegments[0].split("").forEach(i => {
     decodedDay[1].push(i);
     decodedDay[2].push(i);
   });
   segments[1] = availSegments[0];
    
   //Step 2 find 0 segment using number 7
   availSegments = r[0].filter(x => x.length == 3);
   availSegments[0].split("").forEach(i => {
     if (!(decodedDay[1].includes(i))) {
     	decodedDay[0].push(i);
     }
   }); 
   segments[7] = availSegments[0];
    
   //Step 3 find segments 5,6 using number 4
   availSegments = r[0].filter(x => x.length == 4);
   availSegments[0].split("").forEach(i => {
     if (!(decodedDay[1].includes(i))) {
     	decodedDay[5].push(i);
      decodedDay[6].push(i);
     }
   });
   segments[4] = availSegments[0];
    
   //Step 4 find segment 3,4 using number 9
   availSegments = r[0]
     .filter(x => x.length == 6)
     .map(x => {
     		decodedDay.forEach(d => d.forEach(v => x = x.replace(v, "")));
     		return x;
   		})
     .filter(x => x.length == 1);
   decodedDay[3].push(availSegments[0]);
   availSegments = "abcdefg".split("").map(x => {
     decodedDay.forEach(d => d.forEach(v => x = x.replace(v, "")));
     return x;
   }).filter(x => x.length == 1);
   decodedDay[4].push(availSegments[0]);
   
   //Step 5 find segment 6, 1, 2 using numbers 0,6
   availSegments = r[0]
     .filter(x => x.length == 6)
     .filter(x => x.includes(decodedDay[4][0]));

   		//Find 0
    	let zero = availSegments.filter(x => x.split("").includes(decodedDay[1][0]) && x.split("").includes(decodedDay[1][1]));
			segments[0] = zero[0];
      if (zero[0].split("").includes(decodedDay[5][0])) {
        decodedDay[5] = [decodedDay[5][0]];
        decodedDay[6] = [decodedDay[6][1]];
      }
      else {
        decodedDay[5] = [decodedDay[5][1]];
        decodedDay[6] = [decodedDay[6][0]];
      }
    
      //Find 6
    	let six = availSegments.filter(x => x.split("").includes(decodedDay[5][0]) && x.split("").includes(decodedDay[6][0]));
      segments[6] = six[0];

      if (six[0].split("").includes(decodedDay[1][1])) {
        decodedDay[1] = [decodedDay[1][0]];
        decodedDay[2] = [decodedDay[2][1]];
      }
      else {
        decodedDay[1] = [decodedDay[1][1]];
        decodedDay[2] = [decodedDay[2][0]];
      }
    
    
    decodedDay = decodedDay.map(x => x[0]);
    segments[2] = decodedDay[0]+decodedDay[1]+decodedDay[3]+decodedDay[4]+decodedDay[6];
    segments[3] = decodedDay[0]+decodedDay[1]+decodedDay[2]+decodedDay[3]+decodedDay[6];
    segments[5] = decodedDay[0]+decodedDay[2]+decodedDay[3]+decodedDay[5]+decodedDay[6];
    segments[8] = "abcdefg";
    segments[9] = decodedDay[0]+decodedDay[1]+decodedDay[2]+decodedDay[3]+decodedDay[5]+decodedDay[6];
    segments = segments.map(x => {
      let tmp = x.split("");
      tmp.sort();
      return tmp.join("");
    });
    
    let numbers = r[1].map(x => {
      let tmp = x.split("");
      tmp.sort();
      x = tmp.join("");
      return segments.indexOf(x);
    });
    
    //console.log(segments, r[1])
    
    countOfEasyDigits2 += numbers.reduce((a, c, i) => a + c * Math.pow(10, numbers.length - i - 1), 0);
    
  }
  console.log(countOfEasyDigits, countOfEasyDigits2)
})();