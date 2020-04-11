import React, { useState, useRef } from 'react';
import VariableName from './VariableName';


function startDragging(initialValue, interval, range, mouseX, onChange, onCommit) {

    var value = initialValue;

    let fullDragSize = 300;
    let pixels = fullDragSize / (((range[1] - range[0]) / interval));

    let moveListener = (e) => {
        let diff = e.clientX - mouseX;
        if (Math.abs(diff) > pixels) {
            value = value + Math.sign(diff) * interval * Math.round(Math.abs(diff) / pixels);
            value = Math.max(range[0], Math.min(range[1], value));
            onChange(value);
            mouseX = e.clientX;
        }
    };

    let leaveListener = (e) => {
        window.removeEventListener('mousemove', moveListener);
        window.removeEventListener('mouseup', leaveListener);
        onCommit(value);
    }

    window.addEventListener('mousemove', moveListener);
    window.addEventListener('mouseup', leaveListener);
}

function Control(props) {

    let [tempVal, setTempVal] = useState(null);
    let mouseX = useRef(null);

    let variable = props.variable;
    let mutable = props.mutable;
    let value = tempVal === null ? props.value : tempVal;
    let interval = variable.interval || 1;

    var valid = true;
    var rotation;
    if (mutable) {
        let percent = (value - variable.range[0]) / (variable.range[1] - variable.range[0]);
        percent = Math.max(0, Math.min(1, percent));
        rotation = -140 + (percent * 2 * 140);

        valid = value <= variable.range[1] && value >= variable.range[0];
    }

    let patientClass = (key) => (key.endsWith("_1") ? "patient-1" : (key.endsWith("_2") ? "patient-2" : ""));

    return <div className={"control " + patientClass(variable.key)}>
        <div className="key"><VariableName variable={variable} /></div>
        <div className={"value " + (valid ? "" : "invalid")}>
            <input type="text" value={value || "0"} disabled={!mutable} onChange={(e) => {
                setTempVal(e.target.value.replace(/[^\d.-]/g, ''));
            }} onBlur={(e) => {
                // intervals
                value = variable.range[0] + interval * Math.round((value - variable.range[0]) / interval);

                if (valid) {
                    props.onChange(parseFloat(value));
                } else if (value < variable.range[0]) { // min / max
                    props.onChange(variable.range[0]);
                } else if (value > variable.range[1]) {
                    props.onChange(variable.range[1]);
                }
                setTempVal(null);
            }}/>
        </div>
        <div className="unit">{variable.unit}</div>
        { mutable ? <div className="dial"
                onMouseDown={(e) => {
                    startDragging(value, interval, variable.range, e.clientX, setTempVal, (v) => {
                        props.onChange(v);
                        setTempVal(null);
                    });
                }}>
            <div className="dial-control" style={{transform: "rotate(" + rotation + "deg)"}}></div>
            <div className="min">{variable.range[0]}</div>
            <div className="max">{variable.range[1]}</div>
        </div> : null}
    </div>;
}

export default Control;