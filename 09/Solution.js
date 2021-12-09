(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/9/input");
  var raw = (await result.text()).trim();
  /*raw = `2199943210
3987894921
9856789892
8767896789
9899965678`;*/
  
  var data = raw.split("\n").map(x => x.split("").map(y => parseInt(y)));
  console.log(data);
  
  let isLowPoint = ((map, x, y) => {
    if (x > 0 && map[x][y] >= map[x-1][y]) return false;
    if (x < (map.length - 1) && map[x][y] >= map[x+1][y]) return false;
    if (y > 0 && map[x][y] >= map[x][y-1]) return false;
    if (y < map[0].length - 1 && map[x][y] >= map[x][y+1]) return false;
    return true;
  });
  
  let getAvailDirections = ((x, y, map) => {
    var locations = [];
    for (var i = y-1; i <= y+1; i++) {
      for (var j = x-1; j <= x+1; j++) {
      	if ((i == y || j == x) && i >= 0 && i < map.length && j >= 0 && j < map[i].length && map[i][j] == 0) {
          locations.push([i, j]);
        }
    	}
    }
    return locations;
  });
  
  // https://stackoverflow.com/a/32257791
  let colorPaleteGenerator=(r,t,n)=>{function a(r){var t="0123456789abcdef",n=parseInt(r);return 0==n||isNaN(r)?"00":(n=Math.round(Math.min(Math.max(0,n),255)),t.charAt((n-n%16)/16)+t.charAt(n%16))}function e(r){return"#"==r.charAt(0)?r.substring(1,7):r}function u(r){var t=[];return t[0]=parseInt(e(r).substring(0,2),16),t[1]=parseInt(e(r).substring(2,4),16),t[2]=parseInt(e(r).substring(4,6),16),t}return function(r,t,n){var e,s=u(r),c=u(t),o=n,h=0,f=[];for(i=0;i<o;i++){var b=[];h+=1/o,b[0]=s[0]*h+(1-h)*c[0],b[1]=s[1]*h+(1-h)*c[1],b[2]=s[2]*h+(1-h)*c[2],f.push(a((e=b)[0])+a(e[1])+a(e[2]))}return f}(t,r,n)};
  
  let draw = ((w, h, type, drawFn) => { 
    var svgns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgns, 'svg');
    svg.style="width:100%; height:100%";
    for (let i = 0; i < h; i++) {
    	for (let j = 0; j < w; j++) {
        var rect = document.createElementNS( svgns,'rect' );
        rect.setAttributeNS( null,'x',j*5 );
        rect.setAttributeNS( null,'y',i*5 );
        rect.setAttributeNS( null,'width','5' );
        rect.setAttributeNS( null,'height','5' );
        rect.setAttributeNS( null,'fill', '#' + drawFn(j, i));
        svg.appendChild( rect );
      }
    }
    w = window.open("about:blank", type, "width=550,height=550");
    setTimeout(() => {
      w.document.body.innerHTML = "";
      w.document.body.appendChild(svg);
    }, 500);
    
  });
  
  let riskLevel = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (isLowPoint(data, i, j)) {
        //console.log([i, j, data[i][j]])
        riskLevel += 1 + data[i][j];
      }
    }
  }
  
  let basins = data.map(x => x.map(y => y == 9 ? "#" : 0));
  console.log(basins);
  let basinCounter = 2;
  
  for (let i = 0; i < basins.length; i++) {
    for (let j = 0; j < basins[i].length; j++) {
      if (basins[i][j] == 0) {
        //fill basin
        let stack = [[i, j]];
        while (stack.length > 0) {
         let [y, x] = stack.pop();
         basins[y][x] = basinCounter;
         var directions = getAvailDirections(x, y, basins);
         directions.forEach(d => stack.push(d));
        }
        basinCounter++; 
      }
    }
  }
  
  
  
  var mapColors = colorPaleteGenerator("#FF0000", "#00FF00", 10)
  mapColors[9] = "000000";
  draw(data[0].length, data.length, "map", (x, y) => (isLowPoint(data, y, x) ? "FFFF00" : mapColors[data[y][x]]));
  
  mapColors = Array(basinCounter).fill(0).map(x => Math.floor(Math.random()*8777215 + 4777215).toString(16));
  mapColors["#"] = "000000"
  draw(basins[0].length, basins.length, "basins", (x, y) => mapColors[basins[y][x]]);
  console.log(riskLevel);
  
  var basinSizes = basins.flat().reduce((a, c) => {
    a[c] ? ++a[c] : a[c] = 1;
    return a;
  }, {});
  delete basinSizes["#"];
  var sizes = Object.values(basinSizes);
  sizes.sort((a, b) => b - a);
  console.log(sizes[0]*sizes[1]*sizes[2])
  
})();