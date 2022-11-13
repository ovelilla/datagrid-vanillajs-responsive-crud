import { tools } from "../modules/Tools";

class Menu {
    constructor(data) {
        Object.assign(this, data);

        this.isClose = false;
    }

    init() {
        window.addEventListener("resize", this.position.bind(this));
        window.addEventListener("scroll", this.position.bind(this));
    }

    async open() {
        this.menu = this.create();
        document.body.appendChild(this.menu);
        this.position();
        this.menu.classList.add("in");
        await tools.animationend(this.menu);
    }

    async close() {
        this.isClose = false;

        this.menu.classList.add("out");
        await tools.animationend(this.menu);
        this.destroy();
    }

    create() {
        this.positionEvent = this.position.bind(this);
        window.addEventListener("resize",  this.positionEvent);
        window.addEventListener("scroll",  this.positionEvent);
        
        const menu = document.createElement("div");
        menu.classList.add("menu");
        menu.addEventListener("mousedown", this.checkClose.bind(this));
        menu.addEventListener("touchstart", this.checkClose.bind(this), { passive: true });
        menu.addEventListener("click", () => {
            if (this.isClose) {
                this.close();
            }
        });

        const content = document.createElement("div");
        content.classList.add("content");
        content.addEventListener("click", (e) => e.stopPropagation());
        menu.appendChild(content);

        this.items.forEach((item) => {
            if (item.type === "button") {
                const button = document.createElement("button");
                button.type = "button";
                button.ariaLabel = item.ariaLabel;
                button.classList.add("item");
                button.addEventListener("click", () => {
                    item.onClick();
                    this.close();
                });
                content.appendChild(button);

                if (item.icon) {
                    button.appendChild(item.icon);
                }

                const span = document.createElement("span");
                span.textContent = item.text;
                button.appendChild(span);
            }

            if (item.type === "anchor") {
            }
        });

        return menu;
    }

    position() {
        const rect = this.target.getBoundingClientRect();

        if (rect.top + this.menu.firstChild.offsetHeight + this.target.offsetHeight > window.innerHeight) {
            this.menu.firstChild.style.top = `${rect.top - this.menu.firstChild.offsetHeight}px`;
        } else {
            this.menu.firstChild.style.top = `${rect.top + this.target.offsetHeight}px`;
        }

        this.menu.firstChild.style.left = `${rect.left - this.menu.firstChild.offsetWidth + this.target.offsetWidth}px`;
    }

    checkClose(e) {
        if (e.target === this.menu) {
            this.isClose = true;
        }
    }

    destroy() {
        window.removeEventListener("resize", this.positionEvent);
        window.removeEventListener("scroll", this.positionEvent);
        this.menu.remove();
    }
}

export default Menu;
