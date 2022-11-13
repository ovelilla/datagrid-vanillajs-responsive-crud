import Form from "./Form";
import { IconButton } from "../../button";
import { icons } from "../modules/Icons";

class InputNumber extends Form {
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

        this.incDec = this.createIncDec();
        this.wrapper.appendChild(this.incDec);
    }

    createInput() {
        const input = document.createElement("input");
        input.classList.add("mio-input");

        input.type = "number";
        input.name = this.input.name;
        input.id = this.input.id;
        input.value = this.input.value;

        if (this.input.min) {
            input.min = this.min;
        }
        if (this.input.max) {
            input.max = this.max;
        }
        if (this.input.step) {
            input.step = this.step;
        }
        if (this.input.placeholder) {
            input.placeholder = this.input.placeholder;
        }
        if (this.input.maxLength) {
            input.maxLength = this.input.maxLength;
        }

        this.previousValue = input.value;

        input.addEventListener("focus", this.handleFocus.bind(this));
        input.addEventListener("blur", this.handleBlur.bind(this));
        input.addEventListener("input", this.handleInput.bind(this));
        input.addEventListener("keypress", this.handleKeypress.bind(this));

        return input;
    }

    createIncDec() {
        const incDec = document.createElement("div");
        incDec.classList.add("mio-inc-dec");

        const increase = new IconButton({
            type: "button",
            ariaLabel: "Incrementar",
            buttonSize: "medium",
            svgSize: "large",
            icon: icons.get("plus"),
            onClick: () => {
                if (!this.inputEl.value) {
                    this.inputEl.value = this.input.min;
                    this.field.classList.add("active");
                } else {
                    const value = parseInt(this.inputEl.value);
                    const step = this.input.step;
                    const max = this.input.max;

                    if (max && value + step > max) {
                        return;
                    }
                    this.inputEl.value = value + step;
                    this.previousValue = this.inputEl.value;

                    this.removeMessage();
                }

                this.inputEl.dispatchEvent(new Event("input"));

                if (this.onClick) {
                    this.onClick(parseInt(this.inputEl.value));
                }
            },
        });
        incDec.appendChild(increase.get());

        const decrease = new IconButton({
            type: "button",
            ariaLabel: "Decrementar",
            buttonSize: "medium",
            svgSize: "large",
            icon: icons.get("dash"),
            onClick: () => {
                if (!this.inputEl.value) {
                    this.inputEl.value = this.input.min;
                    
                    this.field.classList.add("active");
                } else {
                    const value = parseInt(this.inputEl.value);
                    const step = this.input.step;
                    const min = this.input.min;

                    if (min && value - step < min) {
                        return;
                    }

                    this.inputEl.value = value - step;
                    this.previousValue = this.inputEl.value;

                    this.removeMessage();
                }

                this.inputEl.dispatchEvent(new Event("input"));

                if (this.onClick) {
                    this.onClick(parseInt(this.inputEl.value));
                }
            },
        });
        incDec.appendChild(decrease.get());

        return incDec;
    }

    handleInput() {
        if (this.inputEl.value) {
            let value = parseInt(this.inputEl.value);
            const min = this.input.min;
            const max = this.input.max;

            if (value < min) {
                value = min;
            }

            if (value > max) {
                value = max;
            }

            this.previousValue = value;
            this.inputEl.value = value;
        }

        this.removeMessage();

        if (this.onInput) {
            const value = parseInt(this.inputEl.value) || this.inputEl.value;
            this.onInput(value);
        }
    }

    handleKeypress(e) {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    }

    handleBlur() {
        if (!this.inputEl.value) {
            this.field.classList.remove("active");
        }

        this.field.classList.remove("focus");

        if (this.onBlur) {
            this.onBlur(this.inputEl.value);
        }
    }
}

export default InputNumber;
