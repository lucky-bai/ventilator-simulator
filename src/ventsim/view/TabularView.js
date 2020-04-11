import React, { useState } from 'react';
import Control from './controls/Control';
import VariableName from './controls/VariableName';

function TabularRow(props) {
    
    return <tr>
        {props.inputs.map((i) => <td key={i}>{props.input ? (props.input[i.key] + (i.unit ? (" " + i.unit) : "")) : null}</td>)}
        {props.outputs.map((i) => <td key={i}>{props.output ? (props.output[i.key] + (i.unit ? (" " + i.unit) : "")) : null}</td>)}
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
    
    return <div className="tabular-view">
        <h1>Log</h1>
        <table>
            <thead>
                <tr><th colspan={inputs.length}>Input</th><th colspan={outputs.length}>Output</th></tr>
                <tr>
                    {inputs.map((i) => <th key={i.key}><VariableName variable={i} /></th>)}
                    {outputs.map((i) => <th key={i.key}><VariableName variable={i} /></th>)}
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
        <h1>Inputs</h1>
        <div className="control-container tabular-controls">
            {props.inputs.map((input) => {
                return <Control variable={input} mutable={true} value={currentInput[input.key]} onChange={(e) => {
                    currentInput[input] = e.target.value;
                    props.onChangeInput(currentInput);
                }} />
            })}
        </div>
    </div>;
}

export default TabularView;