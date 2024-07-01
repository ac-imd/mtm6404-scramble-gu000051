/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const words = ["react", "javascript", "programming", "interface", "component", "state", "props", "function", "variable", "constant"];

function ScrambleGame() {
  const [wordList, setWordList] = useState([...words]);
  const [currentWord, setCurrentWord] = useState(shuffle([...words])[0]);
  const [scrambledWord, setScrambledWord] = useState(shuffle(currentWord));
  const [guess, setGuess] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);

  useEffect(() => {
    const storedState = localStorage.getItem('scrambleGameState');
    if (storedState) {
      const { savedWordList, savedCurrentWord, savedScrambledWord, savedPoints, savedStrikes, savedPasses } = JSON.parse(storedState);
      setWordList(savedWordList);
      setCurrentWord(savedCurrentWord);
      setScrambledWord(savedScrambledWord);
      setPoints(savedPoints);
      setStrikes(savedStrikes);
      setPasses(savedPasses);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scrambleGameState', JSON.stringify({ wordList, currentWord, scrambledWord, points, strikes, passes }));
  }, [wordList, currentWord, scrambledWord, points, strikes, passes]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      const newWordList = wordList.filter(word => word !== currentWord);
      if (newWordList.length > 0) {
        const newWord = shuffle(newWordList)[0];
        setWordList(newWordList);
        setCurrentWord(newWord);
        setScrambledWord(shuffle(newWord));
      } else {
        alert(`Game over! You scored ${points + 1} points.`);
        resetGame();
      }
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= 3) {
        alert(`Game over! You received ${strikes + 1} strikes.`);
        resetGame();
      }
    }
    setGuess("");
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      const newWordList = wordList.filter(word => word !== currentWord);
      if (newWordList.length > 0) {
        const newWord = shuffle(newWordList)[0];
        setWordList(newWordList);
        setCurrentWord(newWord);
        setScrambledWord(shuffle(newWord));
      } else {
        alert(`Game over! You scored ${points} points.`);
        resetGame();
      }
    }
  };

  const resetGame = () => {
    setWordList([...words]);
    setCurrentWord(shuffle([...words])[0]);
    setScrambledWord(shuffle([...words])[0]);
    setGuess("");
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    localStorage.removeItem('scrambleGameState');
  };

  return (
    <div>
      <h1>Scramble Game</h1>
      <p>Scrambled Word: {scrambledWord}</p>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button type="submit">Guess</button>
      </form>
      <button onClick={handlePass} disabled={passes <= 0}>
        Pass ({passes} remaining)
      </button>
      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>
      <button onClick={resetGame}>Restart Game</button>
    </div>
  );
}

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));