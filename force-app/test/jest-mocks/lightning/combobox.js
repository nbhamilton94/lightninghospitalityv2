import { LightningElement, api } from 'lwc';

export default class LightningCombobox extends LightningElement {
    constructor() {
        super();
        this._value = '';
        this._name = '';
        this._options = [];
    }

    set value(val) {
        this._value = val;
    }

    get value() {
        return this._value || '';
    }

    set name(val) {
        this._name = val;
    }

    get name() {
        return this._name || '';
    }

    set options(val) {
        this._options = val;
    }

    get options() {
        return this._options || [];
    }

    setAttribute(name, value) {
        if (name === 'name') this.name = value;
        if (name === 'value') this.value = value;
    }

    getAttribute(name) {
        if (name === 'name') return this.name;
        if (name === 'value') return this.value;
        return null;
    }
}
