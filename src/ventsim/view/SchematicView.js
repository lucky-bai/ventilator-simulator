import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import raw from 'raw.macro';
import Control from './controls/Control';

function ControlPortal(props) {
    return ReactDOM.createPortal(
        <Control {...props} />,
        props.elm
    );
}

export default class SchematicView extends React.Component {

    constructor(props) {
        super(props);

        // Create hidden dom elements which will be used as portals to render controls
        this.controlElmsInput = {};
        this.controlElmsOutput = {};
        for (const input of props.inputs) {
            this.controlElmsInput[input.key] = document.createElement("div");
        }
        for (const output of props.outputs) {
            this.controlElmsOutput[output.key] = document.createElement("div");
        }
    }

    render() {

        let svgData = {__html: raw("./schematic.svg")}
        let currentInput = Object.assign({}, this.props.currentInput);

        let currentOutput = this.props.history[this.props.history.length - 1] || [null, null];
        currentOutput = currentOutput[1] || [];
        currentOutput = currentOutput[currentOutput.length - 1] || {};

        return <div>
            <div className="svg" dangerouslySetInnerHTML={svgData} />

            {this.props.inputs.map((n) => <ControlPortal 
                key={n.key}
                variable={n}
                mutable={true}
                value={currentInput[n.key]}
                elm={this.controlElmsInput[n.key]}
                onChange={(v) => {
                    currentInput[n.key] = v;
                    this.props.onChangeInput(currentInput);
                }} />)}
            {this.props.outputs.map((n) => <ControlPortal 
                key={n.key}
                variable={n}
                mutable={false}
                value={currentOutput[n.key]}
                elm={this.controlElmsOutput[n.key]} />)}

            <div className="container-container" ref={(e) => {
                this.containerContainer = e;
                this.updateSvgElements();
            }} />

            <div className="toolbar">
                <p>Change the inputs above, then click the "Simulate" button to see results below.</p>
                <div className="buttons">
                    <div className="simulate">Simulate</div>
                    <div className="reset">Reset</div>
                </div>
            </div>
        </div>;
    }

    componentWillMount() {
        this.windowResizeListener = (e) => this.updateSvgElements();
        window.addEventListener('resize', this.windowResizeListener);
    }

    componentWillUnmount() {
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            this.windowResizeListener = null;
        }
    }

    updateSvgElements() {
        if (this.containerContainer == null) {
            return;
        }

        this.containerContainer.innerHTML = "";
        


        let descs = document.querySelectorAll("desc");

        for (var desc of descs) {
            // Create container element
            let elm = document.createElement("div");
            this.containerContainer.appendChild(elm);

            elm.className = "schematic-container";

            let controlContaner = document.createElement("div");
            controlContaner.className = "control-container";
            elm.appendChild(controlContaner);
            
            let rect = desc.parentElement.getBoundingClientRect();
            elm.style.top = window.scrollY + rect.top + "px";
            elm.style.left = window.scrollX + rect.left + "px";
            elm.style.width = rect.width + "px";
            elm.style.height = rect.height + "px";

            let vars = desc.textContent.split(",");
            for (var v of vars) {
                v = v.trim();
                if (v in this.controlElmsInput) {
                    controlContaner.appendChild(this.controlElmsInput[v]);
                }
                if (v in this.controlElmsOutput) {
                    controlContaner.appendChild(this.controlElmsOutput[v]);
                }
            }

            desc.parentElement.style.opacity = 0;
        }
    }
}
