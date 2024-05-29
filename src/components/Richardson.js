import React, {useState} from 'react'
import {integral} from 'algebrite'
import AnimationReveal from '../helpers/AnimationRevealPage'
const Richardson = ({expression, calculateExpression, integratedExpression, setIntegratedExpression, findTrueValue}) => {
    const [inputs, setInputs] = useState({
        upper: '',
        lower: '',
        n1: '',
        n2: ''
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
    const findTheXs = (lower, upper, n) => {
        let xs = []
        let segment = (upper - lower) / n
        for (let i = 0; i <= n; i++) {
            xs.push((lower + i * segment))
        }
        return xs
    }
    const calculateExpressions = (xs, expression) => {
        let fxs = xs.map(entry => calculateExpression(expression,entry))
        return fxs
    }
    const handleRichardson = () => {
        setResult({})
        const upper = parseFloat(inputs.upper)
        const lower = parseFloat(inputs.lower)
        const n1 = parseFloat(inputs.n1)
        const n2 = parseFloat(inputs.n2)
        if(n1 <= 0 || n2 <= 0){
            setErrorMessage("n must be greater than 0")
            return
          } else if(n1 >= n2){
            setErrorMessage("n2 must be greater than n1")
            return
          }
        const xs1 = findTheXs(lower, upper, n1)
        const xs2 = findTheXs(lower, upper, n2)
        const fxs1 = calculateExpressions(xs1, expression)
        const fxs2 = calculateExpressions(xs2, expression)
        const integratedExpressionTemp = integral(expression).toString()
        setIntegratedExpression(integratedExpressionTemp)
        const trueValue = findTrueValue(integratedExpressionTemp, lower, upper)
        let sum1 = 0
        let sum2 = 0
        for (let i = 0; i < fxs1.length; i++){
            if(fxs1[i] === null){
                setErrorMessage("Please enter a valid function")
                return
            } else if (fxs1[i] === 'complex'){
                setErrorMessage("Complex numbers are not supported")
                return
            }
            if (i !== 0 && i !== fxs1.length - 1){
                sum1 = sum1 + 2 * fxs1[i]
            } else{
                sum1 = sum1 + fxs1[i]
            }
        }
        for (let i = 0; i < fxs2.length; i++){
          if(fxs2[i] === null){
              setErrorMessage("Please enter a valid function")
              return
          } else if (fxs2[i] === 'complex'){
              setErrorMessage("Complex numbers are not supported")
              return
          }
          if (i !== 0 && i !== fxs2.length - 1){
              sum2 = sum2 + 2 * fxs2[i]
          } else{
              sum2 = sum2 + fxs2[i]
          }
      }
        const approximation1 = (upper - lower) * sum1 / (2 * n1)
        const approximation2 = (upper - lower) * sum2 / (2 * n2)
        const approximation = (4/3) * approximation2 - (1/3) * approximation1
        let marginOfError = Math.abs(((trueValue - approximation) / trueValue) * 100)
        setResult({...result, approximation, trueValue, marginOfError})
        setErrorMessage('')
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
                    <label htmlFor = 'n1'>n1 = </label>
                    <input placeholder='Please enter n1' id='n1' type='number' required name="n1" value={inputs.n} onChange={handleChange}/>
                </div>
                <div className="n">
                    <label htmlFor = 'n2'>n2 = </label>
                    <input placeholder='Please enter n2' id='n2' type='number' required name="n2" value={inputs.n} onChange={handleChange}/>
                </div>
                <button onClick={handleRichardson}>Calculate</button>
            </div>
            {result.trueValue && <AnimationReveal>
                <div className='grid'>
                    {integratedExpression &&<div className='integral'>Integral: {integratedExpression}</div>}
                    {result.trueValue && <div className='true-value'>True value: {result.trueValue.toFixed(8)}</div>}
                    {result.approximation && <div className='approximation'>Approximation: {result.approximation.toFixed(8)}</div>}
                    {result.marginOfError && <div className='epsilon'>ƐT: {result.marginOfError.toFixed(4)} %</div>}

                </div>
            </AnimationReveal>}
            {errorMessage && <h1>{errorMessage}</h1>}
    </div>
  )
}

export default Richardson