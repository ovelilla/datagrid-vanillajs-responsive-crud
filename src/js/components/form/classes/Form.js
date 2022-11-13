class Form {
    constructor() {
        if (this.constructor === Form) {
            throw new TypeError("Abstract class 'Form' cannot be instantiated directly.");
        }

        window.addEventListener("load", () => {
            const autofilledInput = this.field.querySelector("input:-webkit-autofill");

            if (autofilledInput) {
                this.field.classList.add("active");
            }
        });
    }

    get() {
        return this.field;
    }

    createField() {
        const field = document.createElement("div");
        field.classList.add("mio-field");
        if (this.input.value !== "") {
            field.classList.add("active");
        }
        if (this.error) {
            field.classList.add("error");
        }

        return field;
    }

    createWrapper() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("mio-wrapper");

        return wrapper;
    }

    createLabel() {
        const label = document.createElement("label");
        label.classList.add("mio-label");
        label.textContent = this.label.text;
        label.htmlFor = this.label.for;

        return label;
    }

    createAdornment() {
        const adornment = document.createElement("div");
        adornment.classList.add("mio-adornment");

        adornment.appendChild(this.adornment);

        return adornment;
    }

    createMessage() {
        if (!this.message) {
            return;
        }

        const message = document.createElement("div");
        message.classList.add("mio-message");
        if (this.error) {
            message.classList.add("mio-error");
        }
        message.textContent = this.message;

        return message;
    }

    removeMessage() {
        if (!this.messageEl) {
            return;
        }
        this.messageEl.remove();
        if (this.error) {
            this.field.classList.remove("error");
            this.messageEl.classList.remove("mio-error");
        }
    }

    setValue(value) {
        this.inputEl.value = value;
        this.field.classList.add("active");
        this.removeMessage();
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

    handleFocus() {
        this.field.classList.add("active");
        this.field.classList.add("focus");
    }

    handleInput() {
        if (!this.manualErrorHandling) {
            this.removeMessage();
        }

        if (this.onInput) {
            this.onInput(this.inputEl.value);
        }
    }

    showError(message) {
        this.error = true;
        this.message = message;

        this.field.classList.add("error");

        this.messageEl = this.createMessage();
        this.field.appendChild(this.messageEl);
    }

    removeError() {
        this.error = false;
        this.message = null;
        this.field.classList.remove("error");
        this.removeMessage();
    }

    showAdornment(adornment) {
        this.adornment = adornment;
        this.wrapper.appendChild(this.createAdornment());
    }

    removeAdornment() {
        if (!this.adornmentEl) {
            return;
        }
        this.adornment = null;
        this.adornmentEl.remove();
    }

    focus() {
        this.inputEl.focus();
    }

    blur() {
        this.inputEl.blur();
    }

    clear() {
        this.inputEl.value = "";
        this.field.classList.remove("active");

        this.removeError();
        this.removeAdornment();
    }
}

export default Form;
