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

export default class SchematicView extends React.PureComponent {

    constructor(props) {
        super(props);

        // Create hidden dom elements which will be used as portals to render controls
        this.controlElms = {};
        for (const variable of props.variables) {
            this.controlElms[variable.key] = document.createElement("div");
        }
    }

    render() {

        let svgData = {__html: raw("./schematic2.svg")}
        let state = Object.assign({}, this.props.state);

        return <div>
            <div className="svg" dangerouslySetInnerHTML={svgData} />

            {this.props.variables.map((n) => <ControlPortal 
                key={n.key}
                variable={n}
                value={state[n.key]}
                tooltipRef={this.props.tooltipRef}
                elm={this.controlElms[n.key]}
                onChange={(v) => {
                    this.props.onChangeVariable(n.key, v);
                }} />)}

            <div className="container-container" ref={(e) => {
                this.containerContainer = e;
                this.updateSvgElements();
            }} />

            <div className="toolbar">
                <div className="text">Change the inputs above, then click the "Simulate" button to see results below.</div>
                <div className="buttons">
                    <div className="request-solve" onClick={() => this.props.onRequestSolve()}><i className=""></i> Suggest Settings</div>
                    <div className="simulate" onClick={() => this.props.onCommitInput()}><i className="ri-arrow-down-fill"></i> Simulate</div>
                    <div className="reset" onClick={() => this.props.onReset()}><i className="ri-restart-line"></i> Reset</div>
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

        let elmsToAppend = [];


        for (var desc of descs) {
            // Create container element
            let elm = document.createElement("div");

            // We create a 2nd element used just for the label, this is for the mobile view
            let elm2 = document.createElement("div");
            this.containerContainer.appendChild(elm2);

            elm.className = "schematic-container entire-control-container";
            elm2.className = "schematic-container label-only-container";

            let titleParts = desc.parentElement.querySelector("title").innerHTML.split("-");
            let title = titleParts[1].trim();
            let idx = titleParts[0].trim();

            elmsToAppend.push([idx, elm]);

            for (const e of [elm, elm2]) {
                let label = document.createElement("div");
                label.className = "label";
                label.innerHTML = "<div>" + idx + "</div> " + title;
                e.appendChild(label);
            }

            let controlContaner = document.createElement("div");
            controlContaner.className = "control-container";
            elm.appendChild(controlContaner);
            
            let rect = desc.parentElement.getBoundingClientRect();
            for (const e of [elm, elm2]) {
                e.style.top = window.scrollY + rect.top + "px";
                e.style.left = window.scrollX + rect.left + "px";
                e.style.minWidth = rect.width + "px";
                e.style.minHeight = rect.height + "px";
            }

            let vars = desc.textContent.split(",");
            for (var v of vars) {
                v = v.trim();
                if (v in this.controlElms) {
                    controlContaner.appendChild(this.controlElms[v]);
                } else {
                    console.log("Error: variable " + v + " not found");
                }
            }

            desc.parentElement.style.opacity = 0;
        }
        
        
        elmsToAppend.sort((a, b) => a[0].localeCompare(b[0]))
            .map((a) => this.containerContainer.appendChild(a[1]));
    }
}
