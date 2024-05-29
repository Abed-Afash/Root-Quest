import React, {useState} from 'react'
import {integral} from 'algebrite'
import AnimationReveal from '../helpers/AnimationRevealPage'
const Trapezoidal = ({expression, calculateExpression, integratedExpression, setIntegratedExpression, findTrueValue}) => {
    const [inputs, setInputs] = useState({
        upper: '',
        lower: '',
        n: '',
    })
    const [result, setResult] = useState({
        trueValue: null,
        approximation: null,
        marginOfError: null
    })
    const [errorMessage, setErrorMessage] = useState('')
    const handleChange = (event) => {
        const {value, name} = event.target
        setInputs(prevInputs => ({...prevInputs, [name]: value}))
    }
    console.log(calculateExpression(expression, 1.9))
    const findTheXs = (lower, upper, n) => {
        let xs = []
        let segment = (upper - lower) / n
        console.log(segment)
        for (let i = 0; i <= n; i++) {
            xs.push((lower + i * segment))
        }
        return xs
    }
    const calculateExpressions = (xs, expression) => {
        console.log(xs)
        let fxs = xs.map(entry => calculateExpression(expression,entry))
        console.log(fxs)
        return fxs
    }
    const handleTrapezoidal = () => {
        const upper = parseFloat(inputs.upper)
        const lower = parseFloat(inputs.lower)
        const n = parseFloat(inputs.n)
        const xs = findTheXs(lower, upper, n)
        const fxs = calculateExpressions(xs, expression)
        const integratedExpressionTemp = integral(expression).toString()
        setIntegratedExpression(integratedExpressionTemp)
        const trueValue = findTrueValue(integratedExpressionTemp, lower, upper)
        let sum = 0
        for (let i = 0; i < fxs.length; i++){
            if(fxs[i] === null){
                setErrorMessage("Please enter a valid function")
                return
            } else if (fxs[i] === 'complex'){
                setErrorMessage("Complex numbers are not supported")
                return
            }
            if (i !== 0 && i !== xs.length - 1){
                sum = sum + 2 * fxs[i]
            } else{
                sum = sum + fxs[i]
            }
        }
        const approximation = (upper - lower) * sum / (2 * n)
        let marginOfError = Math.abs(((trueValue - approximation) / trueValue) * 100)
        setResult({...result, approximation, trueValue, marginOfError})
    }

  return (
    <div className="method-container">
            <div className="inputs-container">
                <div>
                    <label htmlFor="lower">Lower = </label>
                    <input placeholder="Enter the lower bound" type='number' onChange={handleChange} value={inputs.lower} name="lower" required/>
                </div>
                <div>
                    <label htmlFor="upper">Upper = </label>
                    <input placeholder="Enter the upper bound" type="number" onChange={handleChange} value={inputs.upper} name="upper" required/>
                </div>
            </div>
            <div className='submit-container'>
                <div className="n">
                    <label htmlFor = 'n'>n = </label>
                    <input placeholder='Please enter n' id='n' type='number' required name="n" value={inputs.n} onChange={handleChange}/>
                </div>
                <button onClick={handleTrapezoidal}>Calculate</button>
            </div>
            {result.trueValue && <AnimationReveal>
                <div className='grid'>
                    {integratedExpression &&<div className='integral'>Integral: {integratedExpression}</div>}
                    {result.trueValue && <div className='true-value'>True value: {result.trueValue.toFixed(8)}</div>}
                    {result.approximation && <div className='approximation'>Approximation: {result.approximation.toFixed(8)}</div>}
                    {result.marginOfError && <div className='epsilon'>ƐT: {result.marginOfError.toFixed(4)} %</div>}

                </div>
            </AnimationReveal>}
    </div>
  )
}

export default Trapezoidal