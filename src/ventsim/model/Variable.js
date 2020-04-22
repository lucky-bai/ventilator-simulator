export default class Variable {
    constructor({
        key=null,
        desc=null,
        unit=null,
        range=[null, null],
        interval=1,
        defaultValue=null,
        label=null,
        controlType="dial",
        rangePerKgOfWeight=false
    }) {
        this.key = key;
        this.desc = desc;
        this.unit = unit;
        this.range = range;
        this.interval = interval;
        this.defaultValue = defaultValue;
        this.label = label;
        this.controlType = controlType;
        this.rangePerKgOfWeight = rangePerKgOfWeight;
    }

    formatLabel() {

        if (this.label) {
            return this.label;
        } else {
            return this.formatName();
        }
    }

    formatName() {
        
        var splitName = this.key.split("_");
        return splitName[0];
    }

    isNormal(value, state) {
        var range = this.range.slice(0);

        if (range == null) {
            return true;
        }

        if (this.rangePerKgOfWeight) {
            let weight = state["W_" + this.key.split("_")[1]];
            range[0] *= weight;
            range[1] *= weight;
        }

        if (range[0] !== null && value < range[0]) {
            return false;
        }
        if (range[1] !== null && value > range[1]) {
            return false;
        }
        return true;
    }
}
