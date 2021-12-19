(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/19/input");
  var raw = (await result.text()).trim();
  /*raw = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;*/
  
  const determinant = ((m) => 
  m.length == 1 ?
  m[0][0] :
  m.length == 2 ? 
  m[0][0]*m[1][1]-m[0][1]*m[1][0] :
  m[0].reduce((r,e,i) => 
    r+(-1)**(i+2)*e*determinant(m.slice(1).map(c => 
      c.filter((_,j) => i != j))),0));
  
  function multiply (a, b) {
  	const transpose = (a) => a[0].map((x, i) => a.map((y) => y[i]));
  	const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  	const result = (a, b) => a.map((x) => transpose(b).map((y) => dotproduct(x, y)));
  	return result(a, b);
	}
  
  
  var data = raw.split("\n\n").map(x => x.split("\n").slice(1).map(y => y.split(",").map(z => parseInt(z))));
  var allRotationMatixes = [];
    
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        if (x != y && x != z && y != z) {
          for (let k = 0; k < 8; k++) {
            let matrix = Array(3).fill(0);
            matrix[0] = Array(3).fill(0).map((a, i) => i == x ? (1 - (2 * ((k >> 0) & 1))) : 0);
            matrix[1] = Array(3).fill(0).map((a, i) => i == y ? (1 - (2 * ((k >> 1) & 1))) : 0);
            matrix[2] = Array(3).fill(0).map((a, i) => i == z ? (1 - (2 * ((k >> 2) & 1))) : 0);
            if (determinant(matrix) == 1) {
            	allRotationMatixes.push(matrix);
            }
          }
        }
      }
    }
  }
  //console.log(allRotationMatixes);
  var relativeOffsets = data.map(x => null);
  var rotationMatrix = data.map(x => null);
  let calculateOverlap = ((base, scanner) => {
    for (let r of allRotationMatixes) {
      let rotatedData = scanner.map(x => multiply([x], r).flat());
      for (let i in base) {
        for (let j in rotatedData) {
          let offset = base[i].map((v, k) => rotatedData[j][k] - v);
          let matched = 0;
          let matchedList = [];
          for (let orig of base) {
            let toFind = orig.map((x, k) => x + offset[k]);
            for (let toLookFor of rotatedData) {
              if (toFind[0] == toLookFor[0] && toFind[1] == toLookFor[1] && toFind[2] == toLookFor[2]) {
                matched++;
                matchedList.push(toLookFor.join(","));
                break;
              }
            }
          }
          if (matched >= 12) {
            //console.log([r, rotatedData.map(v => v.map((v2, k) => v2 - offset[k]))]);
            return [r, offset];
          }
        }
      }
    }
  });
  
  
  //Start from 0
  relativeOffsets[0] = [0, 0, 0];
  rotationMatrix[0] = allRotationMatixes[0];
  
  while (relativeOffsets.filter(x => x == null).length > 0) {
    for (let i in relativeOffsets) {
      if (relativeOffsets[i] != null) {
        for (let j in relativeOffsets) {
          if (relativeOffsets[j] == null) {
            
            let result = calculateOverlap(
              data[i].map(x => multiply([x], rotationMatrix[i]).flat()).map(x => x.map((v, k) => v - relativeOffsets[i][k])), 
              data[j]
            );
            
            if (result != undefined) {
              console.log(i, j, result);
              rotationMatrix[j] = result[0];
              relativeOffsets[j] = result[1];
            }
            
          }
        }
      }
    }
  }
  
  let beacons = new Set();
  for (let i in data) {
    for (let p of data[i].map(x => multiply([x], rotationMatrix[i]).flat()).map(x => x.map((v, k) => v - relativeOffsets[i][k]))) {
      beacons.add(p.join(","));
    }
  }
  console.log(beacons);
  
  let maxDistance = 0;
  for (let i in data) {
    for (let j in data) {
      let distance = relativeOffsets[i].reduce((a, c, k) => a + Math.abs(c - relativeOffsets[j][k]), 0);
      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
  }
  
  console.log(maxDistance);

  console.log("done");
  
  
})();