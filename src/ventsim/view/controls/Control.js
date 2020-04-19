import React, { useState, useRef } from 'react';
import VariableName from './VariableName';

function convertRange(oldMin, oldMax, newMin, newMax, oldValue) {
    return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
};

function getDeg(cX, cY, pts, startAngle, endAngle) {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = Math.atan(y / x) * 180 / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(startAngle, deg), endAngle);
    return finalDeg;
};

function startDragging(target, initialValue, interval, range, mouseX, mouseY, onChange, onCommit) {
    var value = initialValue;
    let fullAngle = 300
    let startAngle = (360 - fullAngle) / 2;
    let endAngle = startAngle + fullAngle;

    let moveListener = (e) => {
        const knob = target.getBoundingClientRect();
        const pts = {
          x: knob.left + knob.width / 2,
          y: knob.top + knob.height / 2
        };
        let currentDeg = getDeg(e.clientX, e.clientY, pts, startAngle, endAngle);
        if (currentDeg === startAngle) currentDeg--;
        let newValue = Math.floor(
            convertRange(
              startAngle,
              endAngle,
              range[0],
              range[1],
              currentDeg
            )
        );
        if (newValue >= range[0] && newValue <= range[1]) value = newValue;
        onChange(value);
        mouseX = e.clientX;
        mouseY = e.clientY;
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
    let [inputFocused, setInputFocused] = useState(false);
    let [currentlyAdjusting, setCurrentlyAdjusting] = useState(false);

    let variable = props.variable;
    let mutable = props.mutable;
    let value = tempVal === null ? props.value : tempVal;
    let interval = variable.interval || 1;

    var valid = true;
    var normal = true;
    var rotation;
    if (mutable) {
        let percent = (value - variable.range[0]) / (variable.range[1] - variable.range[0]);
        percent = Math.max(0, Math.min(1, percent));
        rotation = -140 + (percent * 2 * 140);

        valid = value <= variable.range[1] && value >= variable.range[0];
    } else {
        if (variable.range) {
            normal = value <= variable.range[1] && value >= variable.range[0];
        }
    }

    let patientClass = (key) => (key.endsWith("_1") ? "patient-1" : (key.endsWith("_2") ? "patient-2" : ""));

    let dialSticky = inputFocused || currentlyAdjusting;
    let stickyClass = dialSticky ? "dial-sticky" : "";

    return <div className={"control " + patientClass(variable.key) + " " + (normal ? "" : "abnormal") + " " + stickyClass}>
        <div className="key"><VariableName input={mutable} variable={variable} /></div>
        <div className={"value " + (valid ? "" : "invalid")}>
            <input type="text"
                value={(value === undefined || value === null) ? "" : value.toString()}
                disabled={!mutable}
                onFocus={(e) => {
                    e.target.select();
                    setInputFocused(true);
                }}
                onChange={(e) => {
                    setTempVal(e.target.value.replace(/[^\d.-]/g, ''));
                }}
                onBlur={(e) => {
                    // intervals
                    value = variable.range[0] + interval * Math.round((value - variable.range[0]) / interval);

                    if (value !== props.value) {
                        if (valid) {
                            props.onChange(parseFloat(value));
                        } else if (value < variable.range[0]) { // min / max
                            props.onChange(variable.range[0]);
                        } else if (value > variable.range[1]) {
                            props.onChange(variable.range[1]);
                        }
                    }

                    setTempVal(null);
                    setInputFocused(false);
                }}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        e.target.blur();
                    }
                }}/>
        </div>
        <div className="unit">{variable.unit}</div>
        { mutable ? <div className="dial"
                onMouseDown={(e) => {
                    setCurrentlyAdjusting(true);
                    startDragging(e.target, value, interval, variable.range, e.clientX, e.clientY, setTempVal, (v) => {
                        if (v !== props.value) {
                            props.onChange(v);
                        }
                        setTempVal(null);
                        setCurrentlyAdjusting(false);
                    });
                }}>
            <div className="dial-control" style={{transform: "rotate(" + rotation + "deg)"}}></div>
            <div className="min">{variable.range[0]}</div>
            <div className="max">{variable.range[1]}</div>
        </div> : null}
    </div>;
}

export default Control;
