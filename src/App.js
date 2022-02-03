import wordList from 'word-list-json'
import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const words = wordList.slice(wordList.lengths[4], wordList.lengths[5])
  let [secretWord, setSecretWord] = useState()
  let [guess, setGuess] = useState("")
  let [gameStatus, setGameStatus] = useState({
    round1:[],
    round2:[],
    round3:[],
    round4:[],
    round5:[],
    round6:[],
  })
  let [gameRound, setGameRound] = useState(1)
  let [message, setMessage] = useState("")

  useEffect(()=>{
    setSecretWord(words[Math.floor(Math.random() * words.length)])
  },[])

  const reset = () => {
    setSecretWord(null)
    setGuess("")
    setGameStatus({
      round1:[],
      round2:[],
      round3:[],
      round4:[],
      round5:[],
      round6:[],
    })
    setGameRound(1)
    setMessage("")
    return null
  }
  

  const checkWord = () => {
    guess = guess.toLowerCase()
    if(!words.includes(guess)){
      return false
    }
    if(guess === secretWord) {
      return true
    }
    let check = [
      guess.substring(0,1) === secretWord.substring(0,1) ? {letter:guess.substring(0,1), color:"green"} : secretWord.includes(guess.substring(0,1)) ? {letter:guess.substring(0,1), color:"yellow"} : {letter:guess.substring(0,1), color:"grey"},
      guess.substring(1,2) === secretWord.substring(1,2) ? {letter:guess.substring(1,2), color:"green"} : secretWord.includes(guess.substring(1,2)) ? {letter:guess.substring(1,2), color:"yellow"} : {letter:guess.substring(1,2), color:"grey"},
      guess.substring(2,3) === secretWord.substring(2,3) ? {letter:guess.substring(2,3), color:"green"} : secretWord.includes(guess.substring(2,3)) ? {letter:guess.substring(2,3), color:"yellow"} : {letter:guess.substring(2,3), color:"grey"},
      guess.substring(3,4) === secretWord.substring(3,4) ? {letter:guess.substring(3,4), color:"green"} : secretWord.includes(guess.substring(3,4)) ? {letter:guess.substring(3,4), color:"yellow"} : {letter:guess.substring(3,4), color:"grey"},
      guess.substring(4,5) === secretWord.substring(4,5) ? {letter:guess.substring(4,5), color:"green"} : secretWord.includes(guess.substring(4,5)) ? {letter:guess.substring(4,5), color:"yellow"} : {letter:guess.substring(4,5), color:"grey"},
    ]
    return check
  }

  const submitWord = () => {
    let result = checkWord()
    console.log(result)
    if(!result){
      // Not a word
      setMessage("Not a valid word")
      return null
    } else if(result === true){
      setMessage("Congratulations!")
      setGameStatus({...gameStatus, [`round${gameRound}`]:result})
      return null
    } else {
      setGameStatus({...gameStatus, [`round${gameRound}`]:result})
      if(gameRound === 6){
        setMessage(`Sorry! The word was ${secretWord.toUpperCase()}`)
      } else {
        setGuess("")
        setGameRound(gameRound => gameRound+1)
      }
    }

  }

  const GameRow = ({round}) => {
    if(gameStatus[`round${round}`].length > 0){
      console.log(gameStatus[`round${round}`])
      return (
        <div className="gameRow">
          <div className={`square ${gameStatus[`round${round}`][0].color}`}>{gameStatus[`round${round}`][0].letter.toUpperCase()}</div>
          <div className={`square ${gameStatus[`round${round}`][1]?.color || "empty"}`}>{gameStatus[`round${round}`][1]?.letter.toUpperCase()}</div>
          <div className={`square ${gameStatus[`round${round}`][2]?.color || "empty"}`}>{gameStatus[`round${round}`][2]?.letter.toUpperCase()}</div>
          <div className={`square ${gameStatus[`round${round}`][3]?.color || "empty"}`}>{gameStatus[`round${round}`][3]?.letter.toUpperCase()}</div>
          <div className={`square ${gameStatus[`round${round}`][4]?.color || "empty"}`}>{gameStatus[`round${round}`][4]?.letter.toUpperCase()}</div>
        </div>
      )
    }
    return (
      <div className="gameRow">
        <div className="square empty"></div>
        <div className="square empty"></div>
        <div className="square empty"></div>
        <div className="square empty"></div>
        <div className="square empty"></div>
      </div>
    )
  }

  const Keyboard = () => {
    let letters = {
      row1: ["Q",'W','E','R','T','Y','U','I','O','P'],
      row2: ['A','S','D','F','G','H','J','K','L'],
      row3: ['ENTER','Z','X','C','V','B','N','M','DEL']
    }

    const addLetter = (letter) => {
      if(letter === "ENTER"){
        if(guess.length === 5){
          submitWord()
        }
      } else if(letter === "DEL"){
        if(gameStatus[`round${gameRound}`].length > 0 ) {
          let roundWord = gameStatus[`round${gameRound}`]
          roundWord.pop()
          setGameStatus({...gameStatus, [`round${gameRound}`]:roundWord})
          setGuess(guess => guess.slice(0, -1))
        }
      } else {
        if(gameStatus[`round${gameRound}`].length < 5 ) {
          let nextLetter = {letter:letter, color:"empty"}
          let roundWord = gameStatus[`round${gameRound}`]
          roundWord.push(nextLetter)
          setGameStatus({...gameStatus, [`round${gameRound}`]:roundWord})
          setGuess(guess => guess+letter)
        }
        
      }
    }
console.log(guess)
    return (
      <div className="keyboard">
        <div className="keyboardRow">
          {letters.row1.map(key =>(
            <div className="key" key={key} onClick={() => addLetter(key)}>{key}</div>
          ))}
        </div>
        <div className="keyboardRow">
          {letters.row2.map(key =>(
            <div className="key" key={key} onClick={() => addLetter(key)}>{key}</div>
          ))}
        </div>
        <div className="keyboardRow">
          {letters.row3.map(key =>(
            <div className="key" key={key} onClick={() => addLetter(key)}>{key}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header>BLAGGLE<span className="reset"><img src="resetIcon.png" className="resetIcon" onClick={()=>reset()} /></span></header>
      <div className="gameBoard">
        <GameRow round="1" />
        <GameRow round="2" />
        <GameRow round="3" />
        <GameRow round="4" />
        <GameRow round="5" />
        <GameRow round="6" />
      </div>
      <div className="messageRow">{message}</div>
      <Keyboard />
    </div>
  );
}

export default App;
