import React, { useState, useEffect, useRef } from 'react';
import Control from './controls/Control';
import VariableTooltip from './controls/VariableTooltip';
import config from '../../config.json';

let normalVarsList = config.outputFormat.primary.map((a) => a[1]).flat()
    .concat(config.outputFormat.patient.map((a) => a[1].map((b) => b + "_1")).flat())
    .concat(config.outputFormat.patient.map((a) => a[1].map((b) => b + "_2")).flat());

let allVarsList = config.variables.primary.map((a) => a.key).flat()
    .concat(config.variables.patient.map((a) => a.key + "_1").flat())
    .concat(config.variables.patient.map((a) => a.key + "_2").flat());

function formatNum(num) {    
    if (num === null || num === undefined) {
        return "";
    }
    return +(Math.round(num + "e+2")  + "e-2");
}

function TabularRow(props) {
    
    return <tr onClick={() => props.onChangeInput(props.state, true)} className={props.lastRow ? "current" : ""}>
        {props.variables.map((i) => {
            var value = props.state[i];
            let normal = props.varByKey[i] ? props.varByKey[i].isNormal(value, props.state) : true;
            return <td key={i} className={normal ? "" : "abnormal"}>{formatNum(value).toString()}</td>;
        })}
    </tr>;
}

function TabularView(props) {

    let [advanced, setAdvanced] = useState(false);

    let varsList = advanced ? allVarsList : normalVarsList;

    let rows = [];
    var varByKey = {};
    for (var variable of props.variables) {
        varByKey[variable.key] = variable;
    }

    for (var i = 0; i < props.history.length; i += 1) {
        let historyEntry = props.history[i];

        rows.push(<TabularRow key={i} variables={varsList}
            state={historyEntry}
            onChangeInput={props.onChangeInput}
            lastRow={i == (props.history.length - 1)}
            varByKey={varByKey} />);
    }
    
    let cellClass = (key) => (key.endsWith("_1") ? "patient-1" : (key.endsWith("_2") ? "patient-2" : ""));

    var categoryHeaders = [];
    for (var [header, vars] of config.outputFormat.primary) {
        categoryHeaders.push(<th key={header} colSpan={vars.length}>{header}</th>);
    }
    for (var [header, vars] of config.outputFormat.patient) {
        categoryHeaders.push(<th key={header+"_1"} className="patient-1" colSpan={vars.length}>{header + " 1"}</th>);
    }
    for (var [header, vars] of config.outputFormat.patient) {
        categoryHeaders.push(<th key={header+"_2"} className="patient-2" colSpan={vars.length}>{header + " 2"}</th>);
    }
    
    return <div className="tabular-view">
        <div className="table-container">
            <table>
                <thead>
                    {advanced ? null : <tr>
                        {categoryHeaders}
                    </tr>}
                    <tr>
                        {varsList.map((i) => varByKey[i] ? <th key={i} className={cellClass(i)}>
                            <VariableTooltip tooltipRef={props.tooltipRef} variable={varByKey[i]}>
                                {varByKey[i].formatName()}
                            </VariableTooltip>
                        </th> : <th key={i}>{i}</th>)}                    
                    </tr>
                </thead>
                <tbody>{rows.reverse()}</tbody>
            </table>
        </div>
        <div className="footer">
            <div>Click on a row to reset input values to those values. Current values are <span className="current">bold</span></div>
            <div className="advanced-check">
                <label>
                    <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)}/> Expert mode (show all variables)
                </label>
            </div>
        </div>
    </div>;
}

export default TabularView;