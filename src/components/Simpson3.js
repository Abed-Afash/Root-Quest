import React, {useState} from 'react'
import AnimationReveal from '../helpers/AnimationRevealPage'
const Simpsons3 = ({expression, calculateExpression, integratedExpression, setIntegratedExpression, findTrueValue, findIntegral}) => {
    const [inputs, setInputs] = useState({
        upper: '',
        lower: '',
        n: '',
    })
    const [result, setResult] = useState({
        trueValue: null,
        approximation: null,
        marginOfError: null,
        xs: [],
        fxs: []
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
        let fxs = []
        for (let i = 0; i < xs.length; i++) {
            const entry = calculateExpression(expression, xs[i])
            if (entry === null){
                return null
            } else if(entry === 'complex'){
                return 'complex'
            }
            fxs.push(entry)
        }
        return fxs
    }
    const handleSimpsons = () => {
        setResult({
            trueValue: null,
            approximation: null,
            marginOfError: null,
            xs: [],
            fxs: []
        })
        if (inputs.upper === '' || inputs.lower === '' || inputs.n === '' || expression === '') {
            setErrorMessage('Please fill out all fields.');
            return;
        }
        const upper = parseFloat(inputs.upper)
        const lower = parseFloat(inputs.lower)
        const n = parseFloat(inputs.n)
        if(n <= 0){
          setErrorMessage("n must be greater than 0")
          return
        }
        if (n % 2 !== 0){
          setErrorMessage("n must be an even number")
          return
        }
        const xs = findTheXs(lower, upper, n)
        const fxs = calculateExpressions(xs, expression)
        if(fxs === null){
            setErrorMessage("Please enter a valid function")
            return
        } else if (fxs === 'complex'){
            setErrorMessage("Complex numbers are not supported")
            return
        }
        const integratedExpressionTemp = findIntegral(expression)
        setIntegratedExpression(integratedExpressionTemp)
        const trueValue = findTrueValue(integratedExpressionTemp, lower, upper)
        let sum = 0
        for (let i = 0; i < fxs.length; i++){
            
            if (i !== 0 && i !== fxs.length - 1){
                if(i % 2 === 0){
                  sum = sum + 2 * fxs[i]
                } else{
                  sum = sum + 4 * fxs[i]
                }
            } else{
                sum = sum + fxs[i]
            }
        }
        const approximation = (upper - lower) * sum / (3 * n)
        let marginOfError = Math.abs(((trueValue - approximation) / trueValue) * 100)
        console.log(marginOfError)
        setResult({...result, approximation, trueValue, marginOfError, xs, fxs})
        setErrorMessage('')
    }
    const htmlTable = result.xs.map((_ ,index) => <tr key={index}>
    <td>{result.xs[index].toFixed(3)}</td>
    <td>{result.fxs[index].toFixed(3)}</td>
    </tr>)

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
                <button onClick={handleSimpsons} className='integral-button'>Calculate</button>
            </div>
            {result.trueValue && <AnimationReveal>
                <div className='grid'>
                    {integratedExpression &&<div className='integral'>Integral: {integratedExpression}</div>}
                    {result.trueValue && <div className='true-value'>True value: {result.trueValue.toFixed(8)}</div>}
                    {result.approximation && <div className='approximation'>Approximation: {result.approximation.toFixed(8)}</div>}
                    {result.marginOfError >= 0 && <div className='epsilon'>ƐT: {result.marginOfError.toFixed(4)} %</div>}

                </div>
                <div>
                {result.xs.length > 0 && <table className="table" id='table'>
                <thead>
                    <tr>
                        <th>X</th>
                        <th>F(x)</th>
                    </tr>
                </thead>
                <tbody>
                    {htmlTable}
                </tbody>
            </table>}
                </div>
            </AnimationReveal>}
            {errorMessage && <h1>{errorMessage}</h1>}
    </div>
  )
}

export default Simpsons3