import React, { useState, useEffect, useRef } from 'react';
import Control from './controls/Control';
import VariableName from './controls/VariableName';

function formatNum(num) {    
    if (num === null || num === undefined) {
        return "";
    }
    return +(Math.round(num + "e+2")  + "e-2");
}

let secondaryVars = ["FGFO", "FGFA", "PEEP"];
let patientVars = ["pH", "PaCO2", "PaO2","HCO3","PIP","APEEP","VT","FiO2"];

let tableCategories = [
    ["primary-vent", "Primary", ["PC", "PEEP0", "RR", "IT"]],
    ["secondary-1", "Secondary 1", secondaryVars.map((s) => s + "_1")],
    ["patient-1", "Patient 1", patientVars.map((s) => s + "_1") ],
    ["secondary-2", "Secondary 2", secondaryVars.map((s) => s + "_2")],
    ["patient-2", "Patient 2", patientVars.map((s) => s + "_2") ]
];
let allVarsList = tableCategories.reduce((a, b) => a.concat(b[2]), []);

function TabularRow(props) {
    
    return <tr onClick={() => props.onChangeInput(props.input)} className={props.lastRow ? "current" : ""}>
        {props.variables.map((i) => <td key={i}>{formatNum((props.input ? props.input[i] : null) || (props.output ? props.output[i] : null))}</td>)}
    </tr>;
}

function TabularView(props) {

    let rows = [];

    for (var i = 0; i < props.history.length; i += 1) {
        let historyEntry = props.history[i];
        let entryOutputs = historyEntry[1];

        rows.push(<TabularRow key={i} variables={allVarsList}
            input={historyEntry[0]}
            output={entryOutputs.length > 0 ? entryOutputs[0] : null}
            onChangeInput={props.onChangeInput}
            lastRow={i == (props.history.length - 1) && entryOutputs.length < 2} />);

        if (entryOutputs.length > 1) {
            for (var j = 1; j < entryOutputs.length; j += 1) {
                rows.push(<TabularRow key={i+"."+j} variables={allVarsList} output={entryOutputs[j]}
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
        <div className="table-container" ref={tableContainerRef}>
            <table>
                <thead>
                    <tr>
                        {tableCategories.map((c) => <th className={c[0]} colSpan={c[2].length}>{c[1]}</th>)}
                    </tr>
                    <tr>
                        {allVarsList.map((i) => <th key={i} className={cellClass(i)}>{i.replace("_1", "").replace("_2", "")}</th>)}                    
                    </tr>
                </thead>
                <tbody>{rows.reverse()}</tbody>
            </table>
        </div>
        <p>Click on a row to reset input values to those values. Current values are <span className="current">bold</span></p>
    </div>;
}

export default TabularView;