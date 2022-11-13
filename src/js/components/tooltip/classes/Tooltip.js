class Tooltip {
    constructor(data) {
        Object.assign(this, data);

        this.isActive = false;

        this.init();
    }

    init() {
        window.addEventListener("scroll", this.handleScroll.bind(this));
        this.target.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
        this.target.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    }

    handleScroll() {
        if (this.isActive) {
            this.setPosition();
        }
    }

    handleMouseEnter() {
        this.isActive = true;

        this.tooltipEl = this.create();
        document.body.appendChild(this.tooltipEl);

        this.setPosition();
    }

    handleMouseLeave() {
        this.isActive = false;

        this.close();
    }

    create() {
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip", this.position);

        const span = document.createElement("span");
        span.textContent = this.message;
        tooltip.appendChild(span);

        this.arrow = document.createElement("span");
        this.arrow.classList.add("arrow");
        tooltip.appendChild(this.arrow);

        return tooltip;
    }

    close() {
        this.tooltipEl.remove();
    }

    setPosition() {
        const rect = this.target.getBoundingClientRect();

        this.tooltipEl.style.left = rect.left + this.target.offsetWidth / 2 - this.tooltipEl.offsetWidth / 2 + "px";

        if (this.position === "bottom") {
            if (rect.top + this.tooltipEl.offsetHeight + this.target.offsetHeight + 10 > window.innerHeight) {
                this.tooltipEl.style.top = rect.top - this.tooltipEl.offsetHeight - 10 + "px";
                this.tooltipEl.classList.remove("bottom");
                this.tooltipEl.classList.add("top");
            } else {
                this.tooltipEl.style.top = rect.top + this.target.offsetHeight + 10 + "px";
            }
        } else {
            if (rect.top - this.tooltipEl.offsetHeight - 10 < 0) {
                this.tooltipEl.style.top = rect.top + this.target.offsetHeight + 10 + "px";
                this.tooltipEl.classList.remove("top");
                this.tooltipEl.classList.add("bottom");
            } else {
                this.tooltipEl.style.top = rect.top - this.tooltipEl.offsetHeight - 10 + "px";
            }
        }

        if (this.tooltipEl.offsetLeft - 10 < 0) {
            this.tooltipEl.style.left = "10px";
            this.arrow.style.left = rect.left + this.target.offsetWidth / 2 - 10 + "px";
        }

        if (rect.left + rect.width / 2 + this.tooltipEl.offsetWidth / 2 + 10 > window.innerWidth) {
            this.tooltipEl.style.left = window.innerWidth - this.tooltipEl.offsetWidth - 10 + "px";
            this.arrow.style.left =
                rect.left + rect.width / 2 - (window.innerWidth - this.tooltipEl.offsetWidth - 10) + "px";
        }
    }
}

export default Tooltip;
