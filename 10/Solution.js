(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/10/input");
  var raw = (await result.text()).trim();
  /*raw = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;*/
  
  var data = raw.split("\n").map(x => x.split(""));
  var scoreMap = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
  };
  var fixerScoreMap = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4
  };
  var bracketMap = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">"
  };
  var score = 0;
  var autoCompleteScores = [];
  
  for (var line of data) {
    let stack = [];
    let isWrong = false;
    for (let c of line) {
      if (c in bracketMap) {
        stack.push(bracketMap[c]);
      }
      else {
        let c2 = stack.length > 0 ? stack.pop() : "";
        
        if (c != c2) {
          console.log("syntax error  Expected" + c2 + ", but found " + c + " instead.");
          score += scoreMap[c];
          isWrong = true;
          break;
        } 
      }
    }
    if (!isWrong) {
      let lineScore = 0;
      while (stack.length > 0) {
        lineScore = lineScore*5 + fixerScoreMap[stack.pop()];
      }
      autoCompleteScores.push(lineScore);
    }
  }
  
  autoCompleteScores.sort((a, b) => a - b);
  console.log(score, autoCompleteScores, autoCompleteScores[parseInt(autoCompleteScores.length / 2)]);
  
})();