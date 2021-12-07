(async function() {
  
  var result = await fetch("https://adventofcode.com/2021/day/4/input");
  var raw = (await result.text()).trim().split("\n");
  
  /*raw = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`.split("\n");*/
  
  class Board {
    constructor(data) {
      this.data = data.map(x => x.map(z => new BoardField(z)));
    }
    
    markNumber(val) {
      for (let r of this.data) {
        for (let v of r) {
          if (v.mark(val)) {
            return this.checkBoard();
          }
        }
      }
    }
    
    checkBoard() {
      for (let i in this.data) {
        if (this.data[i].filter(x => !x.isMarked()).length == 0) {
          return true;
        }
        if (this.data.map(x => x[i]).filter(x => !x.isMarked()).length == 0) {
          return true;
        }
      }
      return false;
    }
    
    getWinningSum() {
      var sum = 0;
      for (let r of this.data) {
        for (let v of r){
          if (!v.isMarked()) {
            sum += v.val;
          }
        }
      }
      return sum;
    }
  }
  
  class BoardField {
    constructor(value) {
      this.value = value;
      this.marked = false;
    }
    
    get val() {
      return this.value;
    }
    
    mark(num) {
      if (num == this.value) {
      	this.marked = true;
        return true;
      }
      return false;
    }
    
    isMarked() {
      return this.marked;
    }
  } 
  
  var numbers = raw[0].split(",").map(x => parseInt(x));
  //console.log(numbers);
  
  var boards = [];
  for (let i = 2; i < raw.length; i+= 6) {
    let data = raw.slice(i, i+5).map(x => x.split(" ").filter(y => y != "").map(y => parseInt(y)));
    boards.push(new Board(data));
  }
  
  var winningBoards = []
  //console.log(boards);
  loop:
  for (let i of numbers) {
    console.log(i);
    for (let b of boards) {
      if (!winningBoards.includes(b) && b.markNumber(i)) {
        console.log("winning");
        console.log(b.getWinningSum(), b.getWinningSum() * i);
        winningBoards.push(b);
      }
    }
  }
  
})();