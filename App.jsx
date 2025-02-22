import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import {nanoid} from "nanoid" //generates random id
import Confetti from "react-confetti"

export default function App() {
    //useState () => instead of just generateAllNewDice() so it just generates new Dice once. makes it easier to reset game
    const [dice, setDice] = useState(() => generateAllNewDice())
    //buttonRef useful for accessibility
    const buttonRef = useRef(null)

    //every checks every item in array is held or not
    const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

    //ref use for accessibility, press spacebar for focus
    useEffect(() => {
      if(gameWon){
        buttonRef.current.focus()
      }
    }, [gameWon])

    function generateAllNewDice(){
      return new Array(10)
        .fill(0)
        .map(() => ({value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
        }))
      /*
      //create new array
      const newDice =[]
      //loop 10 times
      for(let i = 0; i < 10; i++){
        const rand = Math.floor(Math.random() * 6)
        newDice.push(rand)
      }
      return newDice
      */
    }
    function rollDice(){
      //only roll dice that is not held
      if(!gameWon){
        setDice(oldDice => oldDice.map(die => die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6)}))
      }else{
        setDice(generateAllNewDice())
      }
    }

    function hold(id){
      //if matches id then will turn green
      setDice(oldDice => oldDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      ))
      /* way 2
      setDice(oldDice => {
        return oldDice.map(die => {
          return die.id === id ?
            {...die, isHeld: !die.isHeld} :
            die
        })
      })
      */
    }

    console.log(generateAllNewDice())

    const diceElements = dice.map(dieObj =>
      <Die
        key= {dieObj.id}
        value= {dieObj.value}
        isHeld={dieObj.isHeld}
        //callbackfunction - gets id of die that is clicked with () will return value
        hold={() => hold(dieObj.id)}
      />)
    return (
      <main>
        {gameWon && <Confetti /> }
        <div aria-live="polite" className="sr-only">
          {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
        </div>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElements}
        </div>

        <button ref={buttonRef} className="roll-dice" onClick={rollDice}>{gameWon ? " New Game" : "Roll"}</button>
      </main>
    )
}
