import React from 'react';
import './Ventsim.css';
import View from './view/View';
import LogicModel from './model/LogicModel';

export default class Ventsim extends React.Component {
    constructor(props) {
        super(props);

        // Set up model
        this.model = new LogicModel();
        this.variables = this.model.variables();

        // Set up state
        this.state = { 
            current: this.model.initialState(),
            history: []
        };
    }


    changeInput(input, commitImmediately) {
        this.setState({
            current: input
        });
        
        if (commitImmediately) {
            this.commitInput(input);
        }
    }

    commitInput(input) {
        input = input || this.state.current;

        let newState = this.model.changeInput(input);

        this.setState({
            current: newState,
            history: [...this.state.history, newState]
        });
    }

    reset() {
        this.setState({
            current: this.model.initialState(),
            history: []
        });
    }

    render() {
        return <div className="ventsim">
            <View
                variables={this.variables}
                state={this.state.current}
                history={this.state.history}

                onCommitInput={this.commitInput.bind(this)}
                onReset={this.reset.bind(this)}
                onChangeInput={(input, commitImmediately) => {
                    this.changeInput(input, commitImmediately);
                }} />
          </div>;
    }
}

