import { LightningElement, api } from 'lwc';

export default class LightningInput extends LightningElement {
    constructor() {
        super();
        console.log('Custom LightningInput mock used!');

        this._value = '';
        this._name = '';
    }

    set value(val) {
        this._value = val;
        this.setAttribute('value', val); // Reflect value as an attribute
        this.render();
    }

    get value() {
        return this._value || '';
    }

    set name(val) {
        this._name = val;
        this.setAttribute('name', val); // Reflect name as an attribute
        this.render();
    }

    get name() {
        return this._name || '';
    }

    setAttribute(name, value) {
        if (name === 'name') {
            this._name = value;
        }
        if (name === 'value') {
            this._value = value;
        }
        super.setAttribute(name, value); // Call the native setAttribute method
        this.render();
    }

    render() {
        // Simulate the internal DOM representation for the mock
        this.innerHTML = `<input name="${this._name}" value="${this._value}" />`;
    }

    connectedCallback() {
        this.render();
    }
}
