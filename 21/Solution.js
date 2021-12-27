(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/21/input");
  var raw = (await result.text()).trim();
  /*raw = `Player 1 starting position: 4
Player 2 starting position: 8`;*/
  
  let positions = raw.trim().split("\n").map(x => parseInt(x.split(":")[1]));
  
  class Player {
    constructor(position) {
      this.position = position;
      this.score = 0;
    }
    
    move(n) {
      this.position = (((this.position + n) - 1) % 10) + 1;
      this.score += this.position;
    }
  }
  
  class DeterministicDice {
    constructor() {
      this.value = 1;
      this.roled = 0;
    }
    
    next() {
      this.roled++;
      let val = this.value;
      this.value++;
      if (this.value > 100) {
        this.value = 1;
      }
      return val;
    }
  }
  
  let dice = new DeterministicDice();
  let players = [new Player(positions[0]), new Player(positions[1])];
  let currPlayer = 0;
  
  while (Math.max(...players.map(p => p.score)) < 1000) {
    let move = dice.next()+dice.next()+dice.next();
    players[currPlayer].move(move);
    currPlayer = (currPlayer + 1) % 2;
  }
  
  console.log(players, dice, Math.min(...players.map(p => p.score)) * dice.roled);
  
  let wins = [0, 0];
  let playGame = ((currPlayer, pos, score, multiplicator) => {
    //play games sums
    let sums = [1,3,6,7,6,3,1];
    for (let i=3; i<10; i++) {
      let newPos = pos.map(x => x);
      let newScore = score.map(x => x);
      
      newPos[currPlayer] = (((newPos[currPlayer] + i) - 1) % 10) + 1;
      newScore[currPlayer] += newPos[currPlayer];
      if (newScore[currPlayer] >= 21) {
      	wins[currPlayer] += multiplicator * sums[i-3];
    	}
      else {
        playGame(
          (currPlayer + 1) % 2,
          newPos, 
          newScore, 
          multiplicator * sums[i-3]
        );
      }
    }
    
  });
  
  
  playGame(0, positions, [0, 0], 1);
  console.log(wins);
  console.log(Math.max(...wins));
  
})();