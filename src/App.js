import wordList from 'word-list-json'
import { useState, useEffect } from 'react'
import './App.css';
import {words} from 'popular-english-words'
import _ from 'lodash'

function App() {
  const popular = words.getMostPopularLength(2000, 5)
  const fiveLetterWords = wordList.slice(wordList.lengths[4], wordList.lengths[5])
  const filteredPopular = popular.filter(word => fiveLetterWords.includes(word))
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
  let [keyboardColors, setKeyboardColors] = useState({})

  useEffect(()=>{
    setSecretWord(filteredPopular[Math.floor(Math.random() * filteredPopular.length)])
  },[])

  const reset = () => {
    setSecretWord(filteredPopular[Math.floor(Math.random() * filteredPopular.length)])
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
    setKeyboardColors({})
    return null
  }
  

  const checkWord = () => {
    guess = guess.toLowerCase()
    let realWord = fiveLetterWords.includes(guess)
    let correct = guess === secretWord
    
    let check = []
    let dupesUsed = []
    for(let i=0; i<5; i++){
      let guessLetter = guess.substring(i, i+1)
      let wordLetter = secretWord.substring(i, i+1)
      let timesUsed = _.countBy(guess)[guessLetter]
      let timesUsedInWord = _.countBy(secretWord)[guessLetter]
      let duplicatedLetter = timesUsed > timesUsedInWord
      let letterColor = guessLetter === wordLetter ? "green" : secretWord.includes(guessLetter) && !duplicatedLetter ? "yellow" : "grey"
      if(duplicatedLetter){
        dupesUsed.push({position:i, color:letterColor})
      }
      check.push({letter:guessLetter, color:letterColor})
      }
    console.log(dupesUsed)

    let makeOrange = []
    dupesUsed.forEach(dupe => {
      if(dupe.color === "grey"){
        makeOrange.push(dupe.position)
      } else {
        makeOrange = []
      }
    })
    makeOrange.pop()
    if(makeOrange.length > 0){
      makeOrange.forEach(orange => {
        check[orange] = {...check[orange], color:"yellow"}
      })
    }
    return [check, realWord ,correct]
  }

  const submitWord = () => {
    let checked = checkWord()
    let result = checked[0]
    let realWord = checked[1]
    let correct = checked[2]
    if(!realWord){
      // Not a word
      setMessage("Not a valid word")
      return null
    } else if(correct === true){
      setMessage("Congratulations!")
      setGameStatus({...gameStatus, [`round${gameRound}`]:result})
      colorKeyboard(result)
      return null
    } else {
      setMessage("")
      setGameStatus({...gameStatus, [`round${gameRound}`]:result})
      colorKeyboard(result)
      if(gameRound === 6){
        setMessage(`Sorry! The word was ${secretWord.toUpperCase()}`)
      } else {
        setGuess("")
        setGameRound(gameRound => gameRound+1)
      }
    }

  }

  const colorKeyboard = (result) => {
    let currentColors = keyboardColors
    
    result.forEach(letter => {
      let newColor = null
      if(letter.color === "green"){
        newColor= "greenKey"
      } else if(letter.color === "yellow"){
        newColor = keyboardColors[letter.letter] !== "greenKey" ? "yellowKey" : keyboardColors[letter.letter]
      } else if(keyboardColors[letter.letter] !== "greenKey" || keyboardColors[letter.letter] !== "yellowKey"){
        newColor = currentColors[letter.letter] ? currentColors[letter.letter] : "grayKey"
      }
      currentColors = {...currentColors, [letter.letter]: newColor}
    })
    setKeyboardColors(keyboardColors => ({...keyboardColors, ...currentColors}))
  }

  const GameRow = ({round}) => {
    if(gameStatus[`round${round}`].length > 0){
      
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
    let keyColor = null
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
          setMessage("")
        }
      } else {
        if(gameStatus[`round${gameRound}`].length < 5 ) {
          let nextLetter = {letter:letter, color:"empty"}
          let roundWord = gameStatus[`round${gameRound}`]
          roundWord.push(nextLetter)
          setGameStatus({...gameStatus, [`round${gameRound}`]:roundWord})
          setGuess(guess => guess+letter)
          keyColor = keyboardColors[letter] ? keyboardColors[letter] : null
        }
        
      }
    }
 

    return (
      <div className="keyboard">
        <div className="keyboardRow">
          {letters.row1.map(key =>(
            <div className={`key ${keyboardColors[key.toLowerCase()]}`} key={key} onClick={() => addLetter(key)}>{key}</div>
          ))}
        </div>
        <div className="keyboardRow">
          {letters.row2.map(key =>(
            <div className={`key ${keyboardColors[key.toLowerCase()]}`} key={key} onClick={() => addLetter(key)}>{key}</div>
          ))}
        </div>
        <div className="keyboardRow">
          {letters.row3.map(key =>(
            <div className={
              key === 'ENTER' 
                ? `key ${keyboardColors[key.toLowerCase()]} enter`
                : key === "DEL" ? `key ${keyboardColors[key.toLowerCase()]} del` 
                : `key ${keyboardColors[key.toLowerCase()]}`} 
              key={key} 
              onClick={() => addLetter(key)}>{key}</div>
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
