import Model from './Model';

export default class TestModel extends Model {
    initialInput() {
        return { in1: 10, in2: 5, in3: 4 };
    }

    inputVariables() {
        return ["in1", "in2", "in3"];
    }

    outputVariables() {
        return ["out1", "out2", "out3"];
    }

    changeInput(input) {
        let newValues = {
            "out1": input["in1"] + input["in2"],
            "out2": input["in1"] - input["in2"],
            "out3": input["in1"] * input["in2"]
        };
        this.changeOutput(newValues);
    }
}