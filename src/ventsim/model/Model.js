//
// represents some sort of backend model for the simulator
// receives updates to the input variables with the changeInput() method
// sends updates on the output variables with the addOutputListener() method
//
export default class Model {

    constructor() {
        this.outputListeners = [];
    }

    inputVariables() {
        return [];
    }

    outputVariables() {
        return [];
    }

    // what the initial state of the inputs should be
    // your model will receive a changeInput call with this value when it is instantiated
    // override to provide better defaults
    initialInput() {
        var input = {};
        for (var variable of this.inputVariables()) {
            input[variable.key] = variable.range[0];
        }
        return input;
    }

    // input: object with key for each input variable
    changeInput(input) {
    }

    // only called by model itself to send output update
    changeOutput(output) {
        this.outputListeners.forEach((l) => l(output));
    }

    // add a listener to output changes
    // called with an object with a key for each output variable
    addOutputListener(listener) {
        this.outputListeners.push(listener);
        return listener;
    }

    removeOutputListener(listener) {
        let index = this.outputListeners.indexOf(listener);
        if (index > -1) {
            this.outputListeners.splice(index, 1);
        }
    }
}