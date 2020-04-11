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
        let svgData = {__html: raw("./schematic2.svg")}
        let currentInput = Object.assign({}, this.props.currentInput);

        let currentOutput = this.props.history[this.props.history.length - 1] || [null, null];
        currentOutput = currentOutput[1] || [];
        currentOutput = currentOutput[currentOutput.length - 1] || {};

        return <div>
            <div className="svg" dangerouslySetInnerHTML={svgData} />

            {this.props.inputs.map((n) => <ControlPortal 
                variable={n}
                mutable={true}
                value={currentInput[n.key]}
                elm={this.controlElmsInput[n.key]} />)}
            {this.props.outputs.map((n) => <ControlPortal 
                variable={n}
                mutable={false}
                value={currentOutput[n.key]}
                elm={this.controlElmsOutput[n.key]} />)}

            <div className="control-container extra-controls" ref={(e) => this.extraControlsElm = e} />
        </div>;
    }

    componentDidUpdate() {
        // find svg todo
    }
}
