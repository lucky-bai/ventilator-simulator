export default class Variable {
    constructor({
        key=null,
        desc=null,
        unit=null,
        range=[null, null],
        interval=1,
        defaultValue=null,
    }) {
        this.key = key;
        this.desc = desc;
        this.unit = unit;
        this.range = range;
        this.interval = interval;
        this.defaultValue = defaultValue;
    }

    formatName() {
        
        var splitName = this.key.split("_");
        return splitName[0];
    }
}
