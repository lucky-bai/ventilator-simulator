import Model from './Model';
import Variable from './Variable';
import { calc } from '../../logic';
import config from '../../config.json';

export default class LogicModel extends Model {

    variables() {
        let variableConf = config.variables;

        var variables = variableConf.primary.map((conf) => new Variable(conf));

        variables = variables.concat(variableConf.patient.map((conf) => {
            conf = { ... conf };
            conf.key += "_1";
            return new Variable(conf);
        }));
        variables = variables.concat(variableConf.patient.map((conf) => {
            conf = { ... conf };
            conf.key += "_2";
            return new Variable(conf);
        }));

        return variables;
    }

    changeInput(input) {

        // Change input into logic.js format
        var M = {}, P1 = {}, P2 = {};
        for (var out of Object.keys(input)) {
            let parts = out.split("_");
            if (parts.length > 1) {
                if (parts[1] == "1") {
                    P1[parts[0]] = input[out];
                } else {
                    P2[parts[0]] = input[out];
                }
            } else {
                M[out] = input[out];
            }
        }

        M.Pbar = 760; // Constant


        // Calculate
        let outputs = calc(M, P1, P2);
        var outputsFlattened = {...input};
        for (var out of Object.keys(outputs.M)) { 
            outputsFlattened[out] = outputs.M[out];
        }
        for (var out of Object.keys(outputs.P1)) { 
            outputsFlattened[out + "_1"] = outputs.P1[out];
        }
        for (var out of Object.keys(outputs.P2)) { 
            outputsFlattened[out + "_2"] = outputs.P2[out];
        }

        return outputsFlattened;
    }
}
