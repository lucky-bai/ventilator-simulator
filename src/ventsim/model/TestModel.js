import Model from './Model';

export default class TestModel extends Model {

    inputVariables() {
        return [
            { key: "W_1", desc: "Weight", unit: "kg", range: [40, 120] },
            { key: "Cr_1", desc: "Lung Compliance", interval: 5, unit: "ml/cmH20", range: [10, 70] },
            { key: "PF_1",
                desc: "Ratio of arterial partial pressure of oxygen to fraction of inspired oxygen",
                range: [100, 500] },

                
            { key: "W_2", desc: "Weight", unit: "kg", range: [40, 120] },
            { key: "Cr_2", desc: "Lung Compliance", interval: 5, unit: "ml/cmH20", range: [10, 70] },
            { key: "PF_2",
                desc: "Ratio of arterial partial pressure of oxygen to fraction of inspired oxygen",
                range: [100, 500] },

            { key: "PC", desc: "Pressure Control Level", unit: "cmH20", range: [0, 70], interval: 5 },
            { key: "PEEP0", desc: "Positive End-Expiratory Pressure Level", range: [0, 10] },
            { key: "RR", desc: "Respiratory Rate", unit: "breaths/min", range: [2, 40] },
            { key: "IT", desc: "Inspiratory Time", unit: "sec", range: [0.5, 10], interval: 0.1 },
            
            // { key: "I:E", desc: "Inspiratory Time:Expiratory Time Ratio" }

            { key: "FGFO_1", desc: "Fresh Gas Oxygen Flow", unit: "LPM", range: [0, 15] },
            { key: "FGFA_1", desc: "Fresh Gas Air Flow", unit: "LPM", range: [0, 15] },
            { key: "PEEP_1", desc: "PEEP Valve Setting", unit: "cmH20", range: [0, 25] }, 

            { key: "FGFO_2", desc: "Fresh Gas Oxygen Flow", unit: "LPM", range: [0, 15] },
            { key: "FGFA_2", desc: "Fresh Gas Air Flow", unit: "LPM", range: [0, 15] },
            { key: "PEEP_2", desc: "PEEP Valve Setting", unit: "cmH20", range: [0, 25] }, 

        ];
    }

    outputVariables() {
        let singlePatientOutputs = [
            { key: "pH", desc: "pH", range: [7.3, 7.4] },
            { key: "PaCO2", desc: "Partial pressure of carbon dioxide", range: [35,45], unit: "mmHg" },
            { key: "PaO2", desc: "Partial pressure of oxygen", range: [100, Infinity], unit: "mmHg" },
            { key: "HCO3", desc: "Bicarbonate concentration", range: [22, 28], unit: "mEq/L" },
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
        let newValues = {
            //"pH_1": input["W_1"] + input["W_2"],
            //"pH_2": input["W_1"] - input["W_2"],
        };
        this.changeOutput(newValues);
    }
}