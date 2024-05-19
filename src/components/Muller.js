import React from "react"
const Muller = ({calculateExpression, expression}) => {
    const [inputs, setInputs] = React.useState({
        x0:"",
        x1:"",
        x2:"",
        iterations:""
    })
    const [table, setTable] = React.useState([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const handleChange = (event) => {
        const {value, name} = event.target
        setInputs(prevInputs => ({...prevInputs, [name]: value}))
    }
    const findH1 = (x0, x1) => {
        return x1 - x0
    }
    const findH2 = (x1, x2) => {
        return x2 - x1
    }
    const findSigma1 = (x0, x1) => {
        const result = (calculateExpression(expression,x1) - calculateExpression(expression, x0))/(x1-x0)
        return result
    }
    const findSigma2 = (x1, x2) => {
        const result = (calculateExpression(expression,x2) - calculateExpression(expression, x1))/(x2-x1)
        return result
    }
    const findA = (x0, x1, x2) => {
        const result = (findSigma2(x1, x2) - findSigma1(x0, x1)) / (findH2(x1, x2) + findH1(x0, x1))
        return result
    }
    const findB = (x0, x1, x2) => {
        const result = findA(x0, x1, x2) * findH2(x1, x2) + findSigma2(x1, x2)
        return result
    }
    const findC = (x2) => {
        const result = calculateExpression(expression, x2)
        return result
    }
    const findX3 = (x0, x1, x2) => {
        const condition = findB(x0, x1, x2)
        const discriminant = findB(x0, x1, x2) ** 2 - (4 * findA(x0, x1, x2) * findC(x2))
        if(discriminant < 0){
            setErrorMessage("Discriminant is negative. Unable to find real roots.")
            return null
        }
        if (condition > 0){
            const result = x2 + (((-2) * findC(x2)) / (findB(x0, x1, x2) + Math.sqrt(discriminant)))
            return result
        } else{
            const result = x2 + (((-2) * findC(x2)) / (findB(x0, x1, x2) - Math.sqrt(discriminant)))
            return result
        }
    }
    const handleMuller = () => {
        setTable([])
        const x0 = parseFloat(inputs.x0)
        const x1 = parseFloat(inputs.x1)
        const x2 = parseFloat(inputs.x2)
        
        let x0Temp = x0
        let x1Temp = x1
        let x2Temp = x2
        const newTable = []
        let epsilon = null
        for (let i = 1; i <= inputs.iterations; i++){
            const fx0 = calculateExpression(expression, x0Temp)
            const fx1 = calculateExpression(expression, x1Temp)
            const fx2 = calculateExpression(expression, x2Temp)
            const x3 = findX3(x0Temp, x1Temp, x2Temp)
            if(x3 === null){
                return
            }
            if(i > 1){
                epsilon = Math.abs((x3 - x2Temp)/x3) * 100
            }
            const fx3 = calculateExpression(expression, x3)
            if(fx0 == null || fx1 == null || fx2 == null || fx3 == null){
                setErrorMessage("Please enter a valid function")
                return
            } else if(fx0 === 'complex' || fx1 === 'complex' || fx2 === 'complex' || fx3 === 'complex'){
                setErrorMessage("Complex numbers are not supported")
                return
            }
            newTable.push({
                iteration: i,
                x0: x0Temp,
                fx0: fx0,
                x1: x1Temp,
                fx1: fx1,
                x2: x2Temp,
                fx2: fx2,
                x3: x3,
                fx3: fx3,
                epsilon: epsilon
            })
            x0Temp = x1Temp
            x1Temp = x2Temp
            x2Temp = x3
            if(fx3 === 0){
                break
            }
            if(isNaN(x3)){
                break
            }
        }
        setTable(newTable)
        setErrorMessage("")
    }
    const htmlTable = table.map((entry,index) => <tr key={index}>
    <td>{entry.iteration}</td>
    <td>{entry.x0 !== null ? entry.x0.toFixed(3) : null}</td>
    <td>{entry.fx0 !== null ? entry.fx0.toFixed(3) : null}</td>
    <td>{entry.x1 !== null ? entry.x1.toFixed(3) : null}</td>
    <td>{entry.fx1 !== null ? entry.fx1.toFixed(3) : null}</td>
    <td>{entry.x2 !== null ? entry.x2.toFixed(3) : null}</td>
    <td>{entry.fx2 !== null ? entry.fx2.toFixed(3) : null}</td>
    <td>{entry.x3 !== null ? entry.x3.toFixed(3) : null}</td>
    <td>{entry.fx3 !== null ? entry.fx3.toFixed(3) : null}</td>
    <td>{entry.epsilon !== null ? entry.epsilon.toFixed(2) : null} {index > 0 && '%'}</td>
    </tr>)
    return(
        <div className="method-container">
            <div className="inputs-container">
                <div>
                    <label htmlFor="X0">X0 = </label>
                    <input placeholder="Enter X0" type='number' required name="x0" value={inputs.x0} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="X1">X1 = </label>
                    <input placeholder="Enter X1" type='number' required name="x1" value={inputs.x1} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="X2">X2 = </label>
                    <input placeholder="Enter X2" type='number' required name="x2" value={inputs.x2} onChange={handleChange}/>
                </div>
            </div>
            <div className='submit-container'>
                <label htmlFor = 'iterations'>Iterations: </label>
                <input placeholder='How many iterations?' id='iterations' type='number' name="iterations" required value={inputs.iterations} onChange={handleChange}/>
                <button onClick={handleMuller}>Calculate</button>
            </div>
            {table.length > 0 && <table className="table" id="muller-table">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>X0</th>
                        <th>f(X0)</th>
                        <th>X1</th>
                        <th>f(X1)</th>
                        <th>X2</th>
                        <th>f(X2)</th>
                        <th>X3</th>
                        <th>f(X3)</th>
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
export default Muller