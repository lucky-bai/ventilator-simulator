import React, { useState, useEffect, useRef } from 'react';
import Control from './controls/Control';
import VariableTooltip from './controls/VariableTooltip';
import config from '../../config.json';

let allVarsList = config.outputFormat.primary.map((a) => a[1]).flat()
    .concat(config.outputFormat.patient.map((a) => a[1].map((b) => b + "_1")).flat())
    .concat(config.outputFormat.patient.map((a) => a[1].map((b) => b + "_2")).flat());

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

            return <td key={i}>{formatNum(value).toString()}</td>;
        })}
    </tr>;
}

function TabularView(props) {

    let rows = [];
    var varByKey = {};
    for (var variable of props.variables) {
        varByKey[variable.key] = variable;
    }

    for (var i = 0; i < props.history.length; i += 1) {
        let historyEntry = props.history[i];

        rows.push(<TabularRow key={i} variables={allVarsList}
            state={historyEntry}
            onChangeInput={props.onChangeInput}
            lastRow={i == (props.history.length - 1)} />);
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
                    <tr>
                        {categoryHeaders}
                    </tr>
                    <tr>
                        {allVarsList.map((i) => varByKey[i] ? <th key={i} className={cellClass(i)}>
                            <VariableTooltip tooltipRef={props.tooltipRef} variable={varByKey[i]}>
                                {varByKey[i].formatName()}
                            </VariableTooltip>
                        </th> : <th key={i}>{i}</th>)}                    
                    </tr>
                </thead>
                <tbody>{rows.reverse()}</tbody>
            </table>
        </div>
        <p>Click on a row to reset input values to those values. Current values are <span className="current">bold</span></p>
    </div>;
}

export default TabularView;