import React, { useState } from 'react';


function TabularRow(props) {
    return <tr>
        {props.inputs.map((i) => <td key={i}>{props.input ? props.input[i] : null}</td>)}
        {props.outputs.map((i) => <td key={i}>{props.output ? props.output[i] : null}</td>)}
    </tr>;
}

function TabularView(props) {

    let inputs = props.inputs;
    let outputs = props.outputs;
    let currentInput = Object.assign({}, props.currentInput);

    let rows = [];

    for (var i = 0; i < props.history.length; i += 1) {
        let historyEntry = props.history[i];
        let entryOutputs = historyEntry[1];

        rows.push(<TabularRow inputs={inputs} outputs={outputs}
            input={historyEntry[0]}
            output={entryOutputs.length > 0 ? entryOutputs[0] : null} />);

        if (entryOutputs.length > 1) {
            for (var j = 1; j < entryOutputs.length; j += 1) {
                rows.push(<TabularRow inputs={inputs} outputs={outputs} output={entryOutputs[j]} />);
            }
        }
    }
    
    return <div>
        <table>
            <thead>
                <tr><th colspan={inputs.length}>Input</th><th colspan={outputs.length}>Output</th></tr>
                <tr>
                    {inputs.map((i) => <th key={i}>{i}</th>)}
                    {outputs.map((i) => <th key={i}>{i}</th>)}
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
        <div className="tabular-controls">
            {props.inputs.map((input) => {
                return <input type="text" value={currentInput[input]} onChange={(e) => {
                    currentInput[input] = e.target.value;
                    props.onChangeInput(currentInput);
                }} />
            })}
        </div>
    </div>;
}

export default TabularView;