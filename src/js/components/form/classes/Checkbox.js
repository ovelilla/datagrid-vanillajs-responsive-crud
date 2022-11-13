import Form from "./Form";
import { IconButton } from "../../button";
import { icons } from "../modules/Icons";

class Checkbox extends Form {
    constructor(data) {
        super(data);

        Object.assign(this, data);

        this.create();
    }

    create() {
        this.field = this.createField();

        this.wrapper = this.createWrapper();
        this.field.appendChild(this.wrapper);

        this.checkbox = this.createCheckbox();
        this.wrapper.appendChild(this.checkbox);

        this.labelEl = this.createLabel();
        this.wrapper.appendChild(this.labelEl);

        if (this.message && !this.manualErrorHandling) {
            this.messageEl = this.createMessage();
            this.field.appendChild(this.messageEl);
        }
    }

    createCheckbox() {
        const input = document.createElement("input");
        input.classList.add("mio-checkbox-input");

        input.type = "checkbox";
        input.name = this.input.name;
        input.id = this.input.id;

        if (this.input.value) {
            input.checked = true;
        }

        return input;
    }

    createLabel() {
        const label = document.createElement("label");
        label.classList.add("mio-checkbox-label");
        label.htmlFor = this.label.for;
        label.addEventListener("click", () => {
            this.checkbox.checked = !this.checkbox.checked;
            this.removeMessage();
            this.onClick(this.checkbox.checked);
        });

        const button = new IconButton({
            type: "button",
            ariaLabel: "Checkbox",
            buttonSize: "large",
            svgSize: "large",
            icon: (() => {
                if (this.checkbox.checked && !this.input.indeterminate) {
                    return icons.get("check-box");
                } else if (!this.checkbox.checked && !this.input.indeterminate) {
                    return icons.get("check-box-outline-blank");
                } else if (this.input.indeterminate) {
                    return icons.get("indeterminate-check-box");
                }
            })(),
            onClick: () => {
                this.checkbox.checked = !this.checkbox.checked;
                this.removeMessage();
                this.onClick(this.checkbox.checked);
            },
        });
        label.appendChild(button.get());

        if (this.label.text) {
            const text = document.createElement("span");
            text.classList.add("mio-checkbox-text");
            text.innerText = this.label.text;
            label.appendChild(text);
        }

        return label;
    }
}

export default Checkbox;
