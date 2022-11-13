import Form from "./Form.js";

class Input extends Form {
    constructor(data) {
        super(data);

        Object.assign(this, data);

        this.create();
    }

    create() {
        this.field = this.createField();

        this.wrapper = this.createWrapper();
        this.field.appendChild(this.wrapper);

        this.labelEl = this.createLabel();
        this.wrapper.appendChild(this.labelEl);

        this.inputEl = this.createInput();
        this.wrapper.appendChild(this.inputEl);

        if (this.message && !this.manualErrorHandling) {
            this.messageEl = this.createMessage();
            this.field.appendChild(this.messageEl);
        }

        if (this.adornment) {
            this.adornmentEl = this.createAdornment();
            this.wrapper.appendChild(this.adornmentEl);
        }

        return this.field;
    }

    createInput() {
        const input = document.createElement("input");
        input.classList.add("mio-input");

        input.type = this.input.type;
        input.name = this.input.name;
        input.id = this.input.id;
        input.value = this.input.value;

        if (this.input.autocomplete) {
            input.autocomplete = this.input.autocomplete;
        }
        if (this.input.placeholder) {
            input.placeholder = this.input.placeholder;
        }
        if (this.input.readOnly) {
            input.readOnly = true;
        }
        if (this.input.maxLength) {
            input.maxLength = this.input.maxLength;
        }
        if (this.input.minLength) {
            input.minLength = this.input.minLength;
        }
        if (this.input.required) {
            input.required = true;
        }
        if (this.input.pattern) {
            input.pattern = this.input.pattern;
        }
        if (this.input.disabled) {
            input.disabled = true;
        }
        if (this.input.autofocus) {
            input.autofocus = true;
        }

        input.addEventListener("focus", this.handleFocus.bind(this));
        input.addEventListener("blur", this.handleBlur.bind(this));
        input.addEventListener("input", this.handleInput.bind(this));

        return input;
    }
}

export default Input;
