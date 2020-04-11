import React from 'react';
import './Ventsim.css';
import View from './view/View';
import TestModel from './model/TestModel';

export default class Ventsim extends React.Component {
    constructor(props) {
        super(props);

        // Set up model
        this.model = new TestModel();

        // Set up state
        this.state = { 
            input: null,
            history: []
        };
    }

    componentDidMount() {
        this.outputListener = this.model.addOutputListener((newOutput) => {
            this.setState(prevState => {
                // ugly hack to get around not being able to deep copy array
                let newHistory = prevState.history.slice();
                newHistory[newHistory.length - 1] = newHistory[newHistory.length - 1].slice();
                newHistory[newHistory.length - 1][1] = newHistory[newHistory.length - 1][1].concat([newOutput]);
                return { history: newHistory };
            });
        });

        // initial input
        this.changeInput(this.model.initialInput());
    }

    changeInput(input) {
        this.setState({
            currentInput: input,
            history: [...this.state.history, [input, []]]
        });
        this.model.changeInput(input);
    }

    componentWillUnmount() {
        this.model.removeOutputListener(this.outputListener);
    }

    render() {
        return <div className="ventsim">
            <View
                inputs={this.model.inputVariables()}
                outputs={this.model.outputVariables()}
                currentInput={this.state.currentInput}
                history={this.state.history}
                onChangeInput={(input) => {
                    this.changeInput(input);
                }} />
          </div>;
    }
}

