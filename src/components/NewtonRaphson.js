import React, {useState} from 'react'
import {derivative} from 'mathjs'

const NewtonRaphson = ({calculateExpression, expression}) => {
    const [derivedExpression, setDerivedExpression] = useState('')
    const [inputs, setInputs] = useState({
        xi: '',
        iterations: ''
    })
    const [table, setTable] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const handleChange = (event) => {
        const {value, name} = event.target;
        setInputs(prev =>({
           ...prev,
            [name]: value
    }))}
    const handleDerivative = (expression) => {
        expression = expression.replace(/X/g, 'x')
        expression = expression.replace(/ln/g, 'log')
        setDerivedExpression(derivative(expression, 'x').toString())
        const derived = derivative(expression, 'x').toString()
        return derived
    }
    const handleNewtonRaphson = () => {
        setTable([])
        const {xi, iterations} = inputs;
        let xiTemp = parseFloat(xi);
        const array = [];
        let epsilon = null
        let derivedExpression = handleDerivative(expression)
        for(let i = 0; i < iterations; i++){
            let fxi = calculateExpression(expression, xiTemp);
            let fxiDerivative = calculateExpression(derivedExpression, xiTemp);
            let xiPlusOne = xiTemp - (fxi/fxiDerivative);
            let fxiPlusOne = calculateExpression(expression, xiPlusOne);
            if(fxi == null || fxiPlusOne == null){
                setErrorMessage("Please enter a valid function")
                setDerivedExpression('')
                return
            } else if(fxi === 'complex' || fxiPlusOne === 'complex'){
                setErrorMessage("Complex numbers are not supported")
                return
            }
            if (i > 0){
                epsilon = Math.abs((xiPlusOne - xiTemp) / xiPlusOne) * 100
            }
            array.push({
                iteration: i + 1,
                xi: xiTemp,
                fxi: fxi,
                fxiDerivative: fxiDerivative,
                xiPlusOne: xiPlusOne,
                fxiPlusOne: fxiPlusOne,
                epsilon
            })
            xiTemp = xiPlusOne;
            if(fxiPlusOne === 0){
                break;
            }
        }
        setTable(array)
        setErrorMessage('')
    }
    const htmlTable = table.map((entry,index) => <tr key={index}>
    <td>{entry.iteration}</td>
    <td>{entry.xi !== null ? entry.xi.toFixed(3) : null}</td>
    <td>{entry.fxi !== null ? entry.fxi.toFixed(3) : null}</td>
    <td>{entry.fxiDerivative !== null ? entry.fxiDerivative.toFixed(3) : null}</td>
    <td>{entry.xiPlusOne !== null ? entry.xiPlusOne.toFixed(3) : null}</td>
    <td>{entry.fxiPlusOne !== null ? entry.fxiPlusOne.toFixed(3) : null}</td>
    <td>{entry.epsilon !== null ? entry.epsilon.toFixed(3) : null} {index > 0 && '%'}</td>
</tr>)
  return (
    <div className='method-container'>
        <div className="inputs-container">
                <div>
                    <label htmlFor="X(i)">X(i) = </label>
                    <input placeholder="Enter X(i)" type='number' required name="xi" onChange={handleChange} value={inputs.xi}/>
                </div>
            </div>
            <div className='submit-container'>
                <label htmlFor = 'iterations'>Iterations: </label>
                <input placeholder='How many iterations?' id='iterations' type='number' name="iterations" required onChange={handleChange} value={inputs.iterations}/>
                <button onClick={handleNewtonRaphson}>Calculate</button>
            </div>
            {derivedExpression && <h1>Derivative: {derivedExpression}</h1>}
            {table.length > 0 && <table className="table">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>X(i)</th>
                        <th>f(Xi)</th>
                        <th>f'(Xi)</th>
                        <th>X(i+1)</th>
                        <th>f(X(i+1))</th>
                        <th>ϵA</th>
                    </tr>
                </thead>
                <tbody>
                    {htmlTable}
                </tbody>
            </table>}
            {errorMessage.length > 0 && <h1>{errorMessage}</h1>}
    </div>
  )
}

export default NewtonRaphson