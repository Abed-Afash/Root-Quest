import React from 'react'
import Bisection from "./Bisection"
import FalsePosition from './FalsePosition'
import Secant from './Secant'
import Muller from './Muller'
import NewtonRaphson from './NewtonRaphson'
import {parse, isComplex} from 'mathjs'

const Roots = () => {
    const [expression, setExpression] = React.useState("")
    const [mode, setMode] = React.useState("Bisection")
    const handleSubmit = (event) => {
    event.preventDefault()
  }
  const handleChange = (event) =>{
    const {value, type} = event.target
    type === "select-one" ? setMode(value) : setExpression(value)
  }
  const calculateExpression = (expression, x) => {
    expression = expression.replace(/ln/g, 'log')
    expression = expression.replace(/X/g, 'x')
    try{
      const node = parse(expression)
      const scope = {x}
      const result = node.evaluate(scope)
      if(isComplex(result)){
        return 'complex'
      }
      return result
  } catch(error){
      console.error(error)
      return null
  }
}

  return (
    <div className='body-container'>
        <form className='main-container' onSubmit={handleSubmit}>
          <h1>Numerical methods calculator</h1>
          <h3>Finding the roots of f(x)</h3>
          <select onChange={handleChange} value={mode}>
            <option value="Bisection">Bisection</option>
            <option value="False Position">False position</option>
            <option value="Newton Raphson">Newton Raphson</option>
            <option value="Secant">Secant</option>
            <option value="Muller">Muller</option>
          </select>
          <div>
            <label htmlFor = 'equation'>f(x) = </label>
            <input placeholder='Please enter the equation' id='equation' onChange={handleChange} value={expression} required/>
          </div>
          {mode === "Bisection" && <Bisection calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "False Position" && <FalsePosition calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "Newton Raphson" && <NewtonRaphson calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "Secant" && <Secant calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "Muller" && <Muller calculateExpression = {calculateExpression} expression = {expression}/>}
        </form>
      
      </div>
  )
}

export default Roots