import './App.css';
import React from "react"
import Bisection from "./components/Bisection"
import FalsePosition from './components/FalsePosition'
import Secant from './components/Secant'
import Muller from './components/Muller'
import Header from './components/Header'
function App() {
  const [mode, setMode] = React.useState("Bisection")
  const [expression, setExpression] = React.useState("")
  const handleChange = (event) =>{
    const {value, type} = event.target
    type === "select-one" ? setMode(value) : setExpression(value)
  }
  const transform = (expression) => {
    expression = expression.replace(/\s/g, '')
    expression = expression.replace(/\^/g, '**')
    expression = expression.replace(/(\d)tan/g, '$1 * tan')
    expression = expression.replace(/(\d)cos/g, '$1 * cos')
    expression = expression.replace(/(\d)sin/g, '$1 * sin')
    expression = expression.replace(/(\d)ln/g, '$1 * ln')
    expression = expression.replace(/ln/g, 'Math.log')
    expression = expression.replace(/sin/g, 'Math.sin')
    expression = expression.replace(/cos/g, 'Math.cos')
    expression = expression.replace(/tan/g, 'Math.tan')
    expression = expression.replace(/e/g, 'Math.E')
    expression = expression.replace(/(\d)x/g, '$1 * x')
    return expression
  }
  const calculateExpression = (expression, x) => {
    expression = transform(expression)
    expression = expression.replace(/x/g, `(${x})`)
    try{
        const result = eval(expression)
        return result
    } catch(error){
        console.error(error)
        return null
    }
}
  const handleSubmit = (event) => {
    event.preventDefault()
  }
  return (
    <div>
      <Header />
      <div className='body-container'>
        <form className='main-container' onSubmit={handleSubmit}>
          <h1>Numerical methods calculator</h1>
          <h3>Finding the roots of f(x)</h3>
          <select onChange={handleChange} value={mode}>
            <option value="Bisection">Bisection</option>
            <option value="False Position">False position</option>
            <option value="Secant">Secant</option>
            <option value="Muller">Muller</option>
          </select>
          <div>
            <label htmlFor = 'equation'>f(x) = </label>
            <input placeholder='Please enter the equation' id='equation' onChange={handleChange} value={expression} required/>
          </div>
          {mode === "Bisection" && <Bisection calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "False Position" && <FalsePosition calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "Secant" && <Secant calculateExpression ={calculateExpression} expression = {expression}/>}
          {mode === "Muller" && <Muller calculateExpression = {calculateExpression} expression = {expression}/>}
        </form>
      
      </div>
    </div>
  );
}

export default App;
