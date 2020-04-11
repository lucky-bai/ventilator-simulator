import React, { useState, useEffect, useRef } from 'react';
import Control from './controls/Control';
import VariableName from './controls/VariableName';

function TabularRow(props) {
    
    return <tr onClick={() => props.onChangeInput(props.input)} className={props.lastRow ? "current" : ""}>
        {props.inputs.map((i) => <td key={i.key}>{props.input ? (props.input[i.key] + (i.unit ? (" " + i.unit) : "")) : null}</td>)}
        {props.outputs.map((i) => <td key={i.key}>{props.output ? (props.output[i.key] + (i.unit ? (" " + i.unit) : "")) : null}</td>)}
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

        rows.push(<TabularRow key={i} inputs={inputs} outputs={outputs}
            input={historyEntry[0]}
            output={entryOutputs.length > 0 ? entryOutputs[0] : null}
            onChangeInput={props.onChangeInput}
            lastRow={i == (props.history.length - 1) && entryOutputs.length < 2} />);

        if (entryOutputs.length > 1) {
            for (var j = 1; j < entryOutputs.length; j += 1) {
                rows.push(<TabularRow key={i+"."+j} inputs={inputs} outputs={outputs} output={entryOutputs[j]}
                    onChangeInput={props.onChangeInput}
                    lastRow={i == (props.history.length - 1) && j == (entryOutputs.length - 1)} />);
            }
        }
    }
    
    const tableContainerRef = useRef(null);

    let cellClass = (key) => (key.endsWith("_1") ? "patient-1" : (key.endsWith("_2") ? "patient-2" : ""));
    
    const scrollToBottom = () => {
        tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }

    useEffect(scrollToBottom);
    
    return <div className="tabular-view">
        <h1>Log</h1>
        <div className="table-container" ref={tableContainerRef}>
            <table>
                <thead>
                    <tr><th colSpan={inputs.length}>Input</th><th colSpan={outputs.length}>Output</th></tr>
                    <tr>
                        {inputs.map((i) => <th key={i.key} className={cellClass(i.key)}><VariableName variable={i} /></th>)}
                        {outputs.map((i) => <th key={i.key} className={cellClass(i.key)}><VariableName variable={i} /></th>)}
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </div>
        <p>Click on a row to reset input values to those values. Current values are highlighted in <span className="current">green</span></p>
        <h1>Inputs</h1>
        <div className="control-container tabular-controls">
            {props.inputs.map((input) => {
                return <Control key={input.key} variable={input} mutable={true} value={currentInput[input.key]} onChange={(v) => {
                    currentInput[input.key] = v;
                    props.onChangeInput(currentInput);
                }} />
            })}
        </div>
    </div>;
}

export default TabularView;