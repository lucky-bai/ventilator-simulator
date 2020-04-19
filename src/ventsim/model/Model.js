//
// represents some sort of backend model for the simulator
// receives updates to the input variables with the changeInput() method
// sends updates on the output variables with the addOutputListener() method
//
export default class Model {

    constructor() {
        this.outputListeners = [];
    }

    variables() {
        return [];
    }


    // what the initial state of the variables should be
    initialState() {
        var input = {};
        for (var variable of this.variables()) {
            if(variable.defaultValue){
                input[variable.key] = variable.defaultValue;
            } else if (variable.range) {
                input[variable.key] = variable.range[0];
            }
        }
        return input;
    }

    // input: object with key for each input variable
    // return new state
    changeInput(input) {
        return {};
    }
}
