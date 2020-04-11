import React, { useState } from 'react';
import VariableName from './VariableName';

function Control(props) {


    let variable = props.variable;
    let mutable = props.mutable;

    var rotation;
    if (mutable) {
        let percent = (props.value - variable.range[0]) / (variable.range[1] - variable.range[0]);
        percent = Math.max(0, Math.min(1, percent));
        rotation = -140 + (percent * 2 * 140);
    }

    return <div className="control">
        <div className="key"><VariableName variable={variable} /></div>
        <div className="value">
            <input type="text" value={props.value} disabled={!mutable} />
        </div>
        <div className="unit">{variable.unit}</div>
        { mutable ? <div className="dial">
            <div className="dial-control" style={{transform: "rotate(" + rotation + "deg)"}}></div>
            <div className="min">{variable.range[0]}</div>
            <div className="max">{variable.range[1]}</div>
        </div> : null}
    </div>;
}

export default Control;