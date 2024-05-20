import React from "react"
const Bisection = ({calculateExpression, expression}) => {
    const [inputs, setInputs] = React.useState({
        xl:"",
        xu:"",
        iterations:""
    })
    const [table, setTable] = React.useState([])
    const [errorMessage, setErrorMessage] = React.useState("")
    const handleChange = (event) => {
        const {value, name} = event.target
        setInputs(prevInputs => ({...prevInputs, [name]: value}))
    }
    const findXr = (xl, xu) => {
        return (parseFloat(xl) + parseFloat(xu)) / 2;
    };

    const handleBisection = () => {
        setTable([])
        let xlTemp = parseFloat(inputs.xl)
        let xuTemp = parseFloat(inputs.xu)
        let epsilon = null;
        const newTable = []
        for (let i = 1; i <= inputs.iterations; i++) {
            const xr = findXr(xlTemp, xuTemp);
            if(i > 1){
                epsilon = Math.abs((xr - newTable[i-2].xr) / xr) * 100
            }
            const fxl = calculateExpression(expression, xlTemp);
            const fxu = calculateExpression(expression, xuTemp);
            const fxr = calculateExpression(expression, xr);
            if(fxl == null || fxu == null || fxr == null){
                setErrorMessage("Please enter a valid function")
                return
            } else if(fxr === 'complex' || fxl === 'complex' || fxu === 'complex'){
                setErrorMessage("Complex numbers are not supported")
                return
            }
            newTable.push({
                iteration: i,
                xl: xlTemp,
                fxl: fxl,
                xu: xuTemp,
                fxu: fxu,
                xr: xr,
                fxr: fxr,
                epsilon: epsilon
            });
            if ((fxr > 0 && fxu > 0) || (fxr < 0 && fxu < 0)) {
                xuTemp = xr;
            } else {
                xlTemp = xr;
            }
            if (fxr === 0){
                break
            }
        }
        setTable(newTable);
        setErrorMessage("")
    };
    const htmlTable = table.map((entry,index) => <tr key={index}>
        <td>{entry.iteration}</td>
        <td>{entry.xl !== null ? entry.xl.toFixed(3) : null}</td>
        <td>{entry.fxl !== null ? entry.fxl.toFixed(3) : null}</td>
        <td>{entry.xu !== null ? entry.xu.toFixed(3) : null}</td>
        <td>{entry.fxu !== null ? entry.fxu.toFixed(3) : null}</td>
        <td>{entry.xr !== null ? entry.xr.toFixed(3) : null}</td>
        <td>{entry.fxr !== null ? entry.fxr.toFixed(3) : null}</td>
        <td>{entry.epsilon !== null ? entry.epsilon.toFixed(2) : null} {index > 0 && '%'}</td>
    </tr>)
    return(
        <div className="method-container">
            <div className="inputs-container">
                <div>
                    <label htmlFor="xl">Xl = </label>
                    <input placeholder="Enter xl" type="" onChange={handleChange} name="xl" required/>
                </div>
                <div>
                    <label htmlFor="xu">Xu = </label>
                    <input placeholder="Enter xu" type='number' onChange={handleChange} name="xu" required/>
                </div>
            </div>
            <div className='submit-container'>
                <div className="iternations">
                    <label htmlFor = 'iterations'>Iterations: </label>
                    <input placeholder='How many iterations?' id='iterations' type='number' required name="iterations" value={inputs.iterations} onChange={handleChange}/>
                </div>
                <button onClick={handleBisection}>Calculate</button>
            </div>
            {table.length > 0 && <table className="table">
                <thead>
                    <tr>
                        <th>Iteration</th>
                        <th>Xl</th>
                        <th>f(xl)</th>
                        <th>Xu</th>
                        <th>f(xu)</th>
                        <th>Xr</th>
                        <th>f(xr)</th>
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
export default Bisection