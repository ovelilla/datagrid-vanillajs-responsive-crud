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

        this.inputEl = this.createTextarea();
        this.wrapper.appendChild(this.inputEl);

        if (this.message && !this.manualErrorHandling) {
            this.messageEl = this.createMessage();
            this.field.appendChild(this.messageEl);
        }
    }

    createTextarea() {
        const textarea = document.createElement("textarea");
        textarea.classList.add("mio-input");
        textarea.name = this.input.name;
        textarea.id = this.input.id;
        textarea.value = this.input.value;

        if (this.input.rows) {
            textarea.rows = this.input.rows;
        }
        if (this.input.cols) {
            textarea.cols = this.input.cols;
        }
        if (this.input.maxlength) {
            textarea.maxLength = this.input.maxlength;
        }
        if (this.input.minlength) {
            textarea.minLength = this.input.minlength;
        }
        if (this.input.placeholder) {
            textarea.placeholder = this.input.placeholder;
        }
        if (this.input.readOnly) {
            textarea.readOnly = true;
        }
        if (this.input.required) {
            textarea.required = true;
        }
        if (this.input.autofocus) {
            textarea.autofocus = true;
        }

        textarea.addEventListener("focus", this.handleFocus.bind(this));
        textarea.addEventListener("blur", this.handleBlur.bind(this));
        textarea.addEventListener("input", this.handleInput.bind(this));

        return textarea;
    }
}

export default Input;
