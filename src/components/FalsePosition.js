import React from "react"
import AnimationReveal from "../helpers/AnimationRevealPage"
const FalsePosition = ({calculateExpression, expression}) => {
    const [inputs, setInputs] = React.useState({
        xiMinus1:"",
        xi:"",
        iterations:""
    })
    const [table, setTable] = React.useState([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const handleChange = (event) => {
        const {value, name} = event.target
        setInputs(prevInputs => ({...prevInputs, [name]: value}))
    }
    const findXiPlusOne = (xiMinus1, xi, fxiMinus1, fxi) => {
        const result = xi - fxi * ((xi-xiMinus1)/(fxi-fxiMinus1))
        return result
    }
    const handleFalsePosition = () => {
        setTable([])
        const xiMinus1 = parseFloat(inputs.xiMinus1)
        const xi = parseFloat(inputs.xi)
        const iterations = inputs.iterations
        const newTable = []
        let xiMinus1Temp = xiMinus1
        let xiTemp = xi
        let epsilon = null
        for (let i = 1; i<= iterations; i++){
            const fxiMinus1 = calculateExpression(expression, xiMinus1Temp)
            const fxi = calculateExpression(expression, xiTemp)
            const xiPlusOne = findXiPlusOne(xiMinus1Temp,xiTemp,fxiMinus1,fxi)
            const fxiPlusOne = calculateExpression(expression, xiPlusOne)
            if(fxiMinus1 == null || fxi == null || fxiPlusOne == null){
                setErrorMessage("Please enter a valid function")
                return
            } else if(fxiMinus1 === 'complex' || fxi === 'complex' || fxiPlusOne === 'complex'){
                setErrorMessage("Complex numbers are not supported")
                return
            }
            if(i > 1){
                epsilon = Math.abs((xiPlusOne - newTable[i-2].xiPlusOne) / xiPlusOne) * 100
            }
            newTable.push({
                iteration: i,
                xiMinus1: xiMinus1Temp,
                fxiMinus1:fxiMinus1,
                xi: xiTemp,
                fxi: fxi,
                xiPlusOne: xiPlusOne,
                fxiPlusOne: fxiPlusOne,
                epsilon: epsilon
            })
            if((fxiPlusOne > 0 && fxi > 0) || (fxiPlusOne < 0 && fxi < 0)){
                xiTemp = xiPlusOne
            } else{
                xiMinus1Temp = xiPlusOne
            }
            if(fxiPlusOne === 0){
                break
            }
        }
        setTable(newTable)
        setErrorMessage("")
    }
    const htmlTable = table.map((entry,index) => <tr key={index}>
    <td>{entry.iteration}</td>
    <td>{entry.xiMinus1 !== null ? entry.xiMinus1.toFixed(3) : null}</td>
    <td>{entry.fxiMinus1 !== null ? entry.fxiMinus1.toFixed(3) : null}</td>
    <td>{entry.xi !== null ? entry.xi.toFixed(3) : null}</td>
    <td>{entry.fxi !== null ? entry.fxi.toFixed(3) : null}</td>
    <td>{entry.xiPlusOne !== null ? entry.xiPlusOne.toFixed(3) : null}</td>
    <td>{entry.fxiPlusOne !== null ? entry.fxiPlusOne.toFixed(3) : null}</td>
    <td>{entry.epsilon !== null ? entry.epsilon.toFixed(3) : null} {index > 0 && '%'}</td>
</tr>)
    return(
        <div className="method-container">
            <div className="inputs-container">
                <div>
                    <label htmlFor="X(i-1)">X(i-1) = </label>
                    <input placeholder="Enter X(i-1)" type='number' required name="xiMinus1" onChange={handleChange} value={inputs.xiMinus1}/>
                </div>
                <div>
                    <label htmlFor="X(i)">X(i) = </label>
                    <input placeholder="Enter X(i)" type='number' required name="xi" onChange={handleChange} value= {inputs.xi}/>
                </div>
            </div>
            <div className='submit-container'>
            <div className="iternations">
                    <label htmlFor = 'iterations'>Iterations: </label>
                    <input placeholder='How many iterations?' id='iterations' type='number' required name="iterations" value={inputs.iterations} onChange={handleChange}/>
                </div>
                <button onClick={handleFalsePosition}>Calculate</button>
            </div>
            {table.length > 0 && <AnimationReveal><table className="table">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>X(i-1)</th>
                        <th>f(X(i-1))</th>
                        <th>Xi</th>
                        <th>f(Xi)</th>
                        <th>X(i+1)</th>
                        <th>f(X(i+1))</th>
                        <th>ϵA</th>
                    </tr>
                </thead>
                <tbody>
                    {htmlTable}
                </tbody>
            </table></AnimationReveal>}
            {errorMessage.length > 0 && <h1>{errorMessage}</h1>}
        </div>
    )
}
export default FalsePosition