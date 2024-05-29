import React, {useState} from 'react'
import Trapezoidal from './Trapezoidal'
import Simpson3 from './Simpson3'
import Simpson8 from './Simpson8'
import Richardson from './Richardson'
import GuassLegender from './GuassLegender'
import {parse, isComplex} from 'mathjs'
const Integral = () => {
    const [expression, setExpression] = React.useState("")
    const [mode, setMode] = useState('Trapezoidal')
    const [integratedExpression, setIntegratedExpression] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault()
    }
    const handleChange = (event) =>{
        const {value, type} = event.target
        type === "select-one" ? setMode(value) : setExpression(value)
    }
    const findTrueValue = (expression, lower, upper) => {
      const lowerExpression = calculateExpression(expression, lower)
      const upperExpression = calculateExpression(expression, upper)
      return upperExpression - lowerExpression
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
    <div>
        <div className='body-container'>
        <form className='main-container' onSubmit={handleSubmit}>
          <h1>Numerical methods calculator</h1>
          <h3>Estimating the Integral of f(x)</h3>
          <select onChange={handleChange} value={mode}>
            <option value="Trapezoidal">Trapeziodal</option>
            <option value="Simpson's 1/3">Simpson's 1/3</option>
            <option value="Simpson's 3/8">Simpson's 3/8</option>
            <option value="Richardson">Richardson</option>
            <option value="Guass Legender">Guass Legender</option>
          </select>
          <div>
            <label htmlFor = 'equation'>f(x) = </label>
            <input placeholder='Please enter the equation' id='equation' onChange={handleChange} value={expression} required/>
          </div>
          {mode === "Trapezoidal" && <Trapezoidal calculateExpression ={calculateExpression} expression = {expression} integratedExpression={integratedExpression} setIntegratedExpression={setIntegratedExpression} findTrueValue={findTrueValue}/>}
          {mode === "Simpson's 1/3" && <Simpson8 calculateExpression ={calculateExpression} expression = {expression} integratedExpression={integratedExpression} setIntegratedExpression={setIntegratedExpression} findTrueValue={findTrueValue}/>}
          {mode === "Simpson's 3/8" && <Simpson3 calculateExpression ={calculateExpression} expression = {expression} integratedExpression={integratedExpression} setIntegratedExpression={setIntegratedExpression} findTrueValue={findTrueValue}/>}
          {mode === "Richardson" && <Richardson calculateExpression ={calculateExpression} expression = {expression} integratedExpression={integratedExpression} setIntegratedExpression={setIntegratedExpression} findTrueValue={findTrueValue}/>}
          {mode === "Guass Legender" && <GuassLegender calculateExpression = {calculateExpression} expression = {expression} integratedExpression={integratedExpression} setIntegratedExpression={setIntegratedExpression} findTrueValue={findTrueValue}/>}
        </form>
      
      </div>
    </div>
  )
}

export default Integral