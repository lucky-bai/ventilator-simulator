import Model from './Model';
import Variable from './Variable';
import { calc } from '../../logic';

export default class LogicModel extends Model {

    inputVariables() {
        var inputs = [

            new Variable({ key: "PC", desc: "Pressure Control Level", unit: "cmH20", range: [0, 70], interval: 5 }),
            new Variable({ key: "PEEP0", desc: "Positive End-Expiratory Pressure Level", range: [0, 10] }),
            new Variable({ key: "RR", desc: "Respiratory Rate", unit: "breaths/min", range: [2, 40] }),
            new Variable({ key: "IT", desc: "Inspiratory Time", unit: "sec", range: [0.5, 10], interval: 0.1 }),
            
            // { key: "I:E", desc: "Inspiratory Time:Expiratory Time Ratio" }

        ];

        for (var suf of ["_1", "_2"]) {
            inputs = inputs.concat([
                new Variable({ key: "H"+suf, desc: "Height", unit: "cm", range: [100, 250] }),
                new Variable({ key: "W"+suf, desc: "Weight", unit: "kg", range: [40, 120] }),
                new Variable({ key: "Cr"+suf, desc: "Lung Compliance", interval: 5, unit: "ml/cmH20", range: [10, 70] }),
                new Variable({ key: "PF"+suf,
                    desc: "Ratio of arterial partial pressure of oxygen to fraction of inspired oxygen",
                    range: [100, 500] }),

                new Variable({ key: "HCO3"+suf, desc: "Arterial Bicarbonate Concentration", unit: "nM/L", range: [22, 28] }), 
                new Variable({ key: "FGFO"+suf, desc: "Fresh Gas Oxygen Flow", unit: "LPM", range: [0, 15] }),
                new Variable({ key: "FGFA"+suf, desc: "Fresh Gas Air Flow", unit: "LPM", range: [0, 15] }),
                new Variable({ key: "PEEP"+suf, desc: "PEEP Valve Setting", unit: "cmH20", range: [0, 25] }), 
            ]);
        }

        return inputs;
    }

    outputVariables() {
        let singlePatientOutputs = [
            { key: "pH", desc: "pH", range: [7.3, 7.4] },
            { key: "PaCO2", desc: "Partial pressure of carbon dioxide", range: [35,45], unit: "mmHg" },
            { key: "PaO2", desc: "Partial pressure of oxygen", range: [100, Infinity], unit: "mmHg" },
            //{ key: "HCO3", desc: "Bicarbonate concentration", range: [22, 28], unit: "mEq/L" },
            { key: "PIP", desc: "Peak Inspiratory pressure", range: [0, 40], unit: "cmH20" },
            { key: "APEEP", desc: "Actual PEEP", unit: "cmH20" },
            { key: "VT", desc: "Tidal volume", unit: "ml", range: [50, 700] }, /* TODO normal range depends on weight */
            { key: "FiO2", desc: "Fraction Inspired Oxygen" }, 
        ];

        var outputs = [];
        for (var out of singlePatientOutputs) {
            var p1 = {...out}, p2 = {...out};
            p1["key"] += "_1";
            p2["key"] += "_2";
            outputs.push(p1);
            outputs.push(p2);
        }

        return outputs;
    }

    changeInput(input) {
        let newValues = {};

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
        var outputsFlattened = {};
        for (var out of Object.keys(outputs.M)) { 
            outputsFlattened[out] = outputs.M[out];
        }
        for (var out of Object.keys(outputs.P1)) { 
            outputsFlattened[out + "_1"] = outputs.P1[out];
        }
        for (var out of Object.keys(outputs.P2)) { 
            outputsFlattened[out + "_2"] = outputs.P2[out];
        }
        console.log(outputsFlattened);

        this.changeOutput(outputsFlattened);
    }
}