export default class Variable {
    constructor({
        key=null,
        desc=null,
        unit=null,
        range=[-Infinity, Infinity],
        interval=1,
    }) {
        this.key = key;
        this.desc = desc;
        this.unit = unit;
        this.range = range;
        this.interval = interval;
    }
}