import Model from './Model';

export default class TestModel extends Model {

    inputVariables() {
        return [
            { key: "W_1", desc: "Weight", unit: "kg", range: [40, 120] },
            { key: "Cr_1", desc: "Lung Compliance", interval: 5, unit: "ml/cmH20", range: [10, 70] },
            { key: "PaO2:FiO2_1",
                desc: "Ratio of arterial partial pressure of oxygen to fraction of inspired oxygen",
                range: [100, 500] },

                
            { key: "W_2", desc: "Weight", unit: "kg", range: [40, 120] },
            { key: "Cr_2", desc: "Lung Compliance", interval: 5, unit: "ml/cmH20", range: [10, 70] },
            { key: "PaO2:FiO2_2",
                desc: "Ratio of arterial partial pressure of oxygen to fraction of inspired oxygen",
                range: [100, 500] },

            { key: "PC", desc: "Pressure Control Level", unit: "cmH20", range: [0, 70], interval: 5 },
            { key: "PEEP0", desc: "Positive End-Expiratory Pressure Level", range: [0, 10] },
            { key: "RR", desc: "Respiratory Rate", unit: "breaths/min", range: [2, 40] },
            { key: "IT", desc: "Inspiratory Time", unit: "sec", range: [0.5, 10], interval: 0.1 },
            
            // { key: "I:E", desc: "Inspiratory Time:Expiratory Time Ratio" }

        ];
    }

    outputVariables() {
        return [
            { key: "pH_1", desc: "pH" },
            { key: "pH_2", desc: "pH" },
        ];
    }

    changeInput(input) {
        let newValues = {
            "pH_1": input["W_1"] + input["W_2"],
            "pH_2": input["W_1"] - input["W_2"],
        };
        this.changeOutput(newValues);
    }
}