import React, { useState, useRef } from 'react';
import VariableTooltip from './VariableTooltip';
import Variable from '../../model/Variable';

function formatNum(num) {    
    if (num === null || num === undefined) {
        return "";
    }
    return +(Math.round(num + "e+2")  + "e-2");
}

function startDragging(target, initialValue, interval, range, mouseX, mouseY, onChange, onCommit) {
    var value = initialValue;
    let step = 300 / ((range[1] - range[0]) / interval);

    let moveListener = (e) => {
        let dx = e.clientX - mouseX, dy = -(e.clientY - mouseY);

        if (Math.abs(dx) > step || Math.abs(dy) > step) {
            value += interval * (Math.round(dx / step) + Math.round(dy / step));

            value = Math.min(value, range[1]);
            value = Math.max(value, range[0]);

            onChange(formatNum(value));

            mouseX = e.clientX;
            mouseY = e.clientY;
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
    let [inputFocused, setInputFocused] = useState(false);
    let [currentlyAdjusting, setCurrentlyAdjusting] = useState(false);
    let [hover, setHover] = useState(false);

    let variable = props.variable;
    let value = tempVal === null ? props.value : tempVal;
    let interval = variable.interval || 1;

    var valid = true;
    var normal = true;
    var rotation;

    let percent = (value - variable.range[0]) / (variable.range[1] - variable.range[0]);
    percent = Math.max(0, Math.min(1, percent));
    rotation = -140 + (percent * 2 * 140);

    valid = (value <= variable.range[1] || variable.range[1] === null) &&
        (value >= variable.range[0] || variable.range[0] === null);

    let patientClass = (key) => (key.endsWith("_1") ? "patient-1" : (key.endsWith("_2") ? "patient-2" : ""));

    let dialSticky = inputFocused || currentlyAdjusting;
    let stickyClass = dialSticky ? "dial-sticky" : "";

    return <VariableTooltip
        controlled={true}
        display={inputFocused || currentlyAdjusting || hover}
        variable={variable}
        tooltipRef={props.tooltipRef}>
            <div className={"control " + patientClass(variable.key) + " " + (normal ? "" : "abnormal") + " " + stickyClass}
                ref={(e) => {
                    if (e) {
                        e.addEventListener('mouseenter', () => setHover(true));
                        e.addEventListener('mouseleave', () => setHover(false));
                    }
                }}>
                <div className="key">{variable.formatLabel()}</div>
                <div className={"value " + (valid ? "" : "invalid")}>
                    <input type="text"
                        inputMode="decimal"
                        value={(value === undefined || value === null) ? "" : (tempVal === null ? formatNum(value) : tempVal)}
                        onFocus={(e) => {
                            e.target.select();
                            setInputFocused(true);
                        }}
                        onChange={(e) => {
                            setTempVal(e.target.value.replace(/[^\d.-]/g, ''));
                        }}
                        onBlur={(e) => {
                            // intervals
                            if (variable.range[0] !== null && variable.interval !== null) {
                                value = variable.range[0] + interval * Math.round((value - variable.range[0]) / interval);
                            }

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
                { variable.controlType == "ie_ratio" ? <div className="dial ie_ratio">
                        {[[1.5, 1], [1, 1], [1, 2], [1, 3]].map((ratio) => {
                            return <div key={ratio} className="ratio" onClick={() => {
                                props.onChange(ratio[0] / ratio[1]);
                            }}>{ratio[0]}:{ratio[1]}</div>;
                        })}
                    </div> : <div className="dial"
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
                </div>}
            </div>
    </VariableTooltip>;
}

export default Control;
