import React from 'react';
import './Ventsim.css';
import View from './view/View';
import LogicModel from './model/LogicModel';

export default class Ventsim extends React.Component {
    constructor(props) {
        super(props);

        // Set up model
        this.model = new LogicModel();

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

    changeInput(input, commitImmediately) {
        this.setState({
            currentInput: input
        });
        
        if (commitImmediately) {
            this.commitInput(input);
        }
    }

    commitInput(input) {
        input = input || this.state.currentInput;

        this.setState({
            history: [...this.state.history, [input, []]]
        });
        this.model.changeInput(input);
    }

    reset() {
        this.setState({
            currentInput: this.model.initialInput(),
            history: []
        });
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
                onCommitInput={this.commitInput.bind(this)}
                history={this.state.history}
                onReset={this.reset.bind(this)}
                onChangeInput={(input, commitImmediately) => {
                    this.changeInput(input, commitImmediately);
                }} />
          </div>;
    }
}

