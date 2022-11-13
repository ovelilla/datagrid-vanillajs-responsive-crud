import Menu from "./Menu.js";
import Select from "./Select.js";
import Tooltip from "../../tooltip";
import { icons } from "../modules/Icons";
import { IconButton } from "../../button";
import { Checkbox } from "../../form";

class Table {
    constructor(data) {
        Object.assign(this, data);

        this.filteredRows = [...this.rows];
        this.selectedRows = [];

        this.sort = false;
        this.sortColumn = null;

        this.page = 1;
        this.pages = 0;

        this.search = "";
        this.isSearch = false;

        this.isFullscreeen = false;
        this.isLoading = false;

        this.init();
    }

    init() {
        this.render();
    }

    setRows(rows) {
        this.rows = rows;
        this.filteredRows = rows;
        this.isLoading = false;
        this.render();
    }

    addRow(row) {
        this.rows = [...this.rows, row];
        this.filteredRows = [...this.filteredRows, row];
        this.isLoading = false;
        this.render();
    }

    updateRow(updateRow) {
        this.rows = this.rows.map((row) => (row.id === updateRow.id ? updateRow : row));
        this.filteredRows = this.filteredRows.map((row) => (row.id === updateRow.id ? updateRow : row));
        this.selectedRows = this.selectedRows.map((row) => (row.id === updateRow.id ? updateRow : row));
        this.isLoading = false;
        this.render();
    }

    deleteRow(deleteRow) {
        this.rows = this.rows.filter((row) => row.id !== deleteRow.id);
        this.filteredRows = this.filteredRows.filter((row) => row.id !== deleteRow.id);
        this.selectedRows = this.selectedRows.filter((row) => row.id !== deleteRow.id);
        this.isLoading = false;
        this.render();
    }

    deleteRows(deleteRows) {
        this.rows = this.rows.filter((row) => !deleteRows.some((deleteRow) => deleteRow.id === row.id));
        this.filteredRows = this.filteredRows.filter((row) => !deleteRows.some((deleteRow) => deleteRow.id === row.id));
        this.selectedRows = this.selectedRows.filter((row) => !deleteRows.some((deleteRow) => deleteRow.id === row.id));
        this.isLoading = false;
        this.render();
    }

    searchRow() {
        this.filteredRows = this.rows.filter((row) => {
            const fields = this.findFields ? this.findFields : Object.keys(row);

            const value = fields.reduce((previousValue, currentValue, currentIndex) => {
                return !currentIndex ? row[currentValue] : previousValue + " " + row[currentValue];
            }, "");

            const valueNormalized = value
                .toString()
                .toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ");

            const searchParts = this.search
                .toLowerCase()
                .normalize("NFD")
                .trim()
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ")
                .split(" ");

            return searchParts.every((searchPart) => {
                return valueNormalized.includes(searchPart);
            });
        });

        this.render();
    }

    checkPage() {
        if (this.page > this.pages) {
            this.page = this.pages;
        }
    }

    setPages() {
        this.pages = Math.ceil(this.rows.length / this.rowsPerPage) || 1;
    }

    create() {
        this.datagrid = document.createElement("div");
        this.datagrid.classList.add("datagrid");
        if (this.isFullscreen) {
            this.datagrid.classList.add("fullscreen");
        } else {
            this.datagrid.classList.remove("fullscreen");
        }
        this.container.appendChild(this.datagrid);

        if (this.isLoading) {
            this.loader = this.createLoader();
            this.datagrid.appendChild(this.loader);
        }

        const header = this.createHeader();
        this.datagrid.appendChild(header);

        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        wrapper.scrollTop = this.scrollPosition;
        wrapper.addEventListener("scroll", () => {
            this.scrollPosition = wrapper.scrollTop;
        });
        this.datagrid.appendChild(wrapper);

        this.observer = new MutationObserver(() => {
            wrapper.scrollTop = this.scrollPosition || 0;
        });
        this.observer.observe(this.datagrid, { childList: true });

        const table = document.createElement("table");
        wrapper.appendChild(table);

        const thead = this.createThead();
        table.appendChild(thead);

        const tbody = this.createTbody();
        table.appendChild(tbody);

        const footer = this.createFooter();
        this.datagrid.appendChild(footer);

        if (!this.selectedRows.length && this.isSearch) {
            const input = document.querySelector(".search input");
            input.focus();
        }
    }

    createHeader() {
        const header = document.createElement("div");
        header.classList.add("header");

        if (this.selectedRows.length) {
            const selectedRows = document.createElement("div");
            selectedRows.classList.add("selected-rows");
            selectedRows.textContent =
                this.selectedRows.length +
                (this.selectedRows.length > 1 ? " filas seleccionadas" : " fila seleccionada");
            header.appendChild(selectedRows);

            const actions = document.createElement("div");
            actions.classList.add("actions");
            header.appendChild(actions);

            if (this.selectActions) {
                this.selectActions.forEach((action) => {
                    const actionButton = new IconButton({
                        type: "button",
                        ariaLabel: action.name,
                        buttonSize: "large",
                        svgSize: "large",
                        icon: action.icon,
                        onClick: () => {
                            actionTooltip.close();
                            action.onClick(this.selectedRows);
                        },
                    });
                    actions.appendChild(actionButton.get());

                    const actionTooltip = new Tooltip({
                        target: actionButton.get(),
                        message: action.name,
                        position: "top",
                    });
                });
            }

            return header;
        }

        if (!this.selectedRows.length && this.isSearch) {
            const form = document.createElement("form");
            form.classList.add("search");
            form.noValidate;
            header.appendChild(form);

            const label = document.createElement("label");
            label.htmlFor = "search";
            label.textContent = "Buscar";
            form.appendChild(label);

            const input = document.createElement("input");
            input.type = "text";
            input.name = "search";
            input.id = "search";
            input.placeholder = "Buscar";
            input.value = this.search;
            input.addEventListener("keyup", () => {
                this.search = input.value;
                this.searchRow();
            });
            form.appendChild(input);

            const searchButton = new IconButton({
                type: "button",
                ariaLabel: "Cerrar buscador",
                buttonSize: "large",
                svgSize: "large",
                icon: icons.get("x-lg"),
                onClick: () => {
                    this.search = "";
                    this.isSearch = false;
                    this.filteredRows = [...this.rows];
                    searchTooltip.close();
                    this.render();
                },
            });
            header.appendChild(searchButton.get());

            const searchTooltip = new Tooltip({
                target: searchButton.get(),
                message: "Cerrar",
                position: "top",
            });

            return header;
        }

        if (!this.selectedRows.length) {
            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = this.title;
            header.appendChild(title);

            const actions = document.createElement("div");
            actions.classList.add("actions");
            header.appendChild(actions);

            const openSearchButton = new IconButton({
                type: "button",
                ariaLabel: "Abrir buscador",
                buttonSize: "large",
                svgSize: "large",
                icon: icons.get("search"),
                onClick: () => {
                    this.isSearch = true;
                    openSearchTooltip.close();
                    this.render();
                },
            });
            actions.appendChild(openSearchButton.get());

            const openSearchTooltip = new Tooltip({
                target: openSearchButton.get(),
                message: "Buscar",
                position: "top",
            });

            if (this.headerActions) {
                this.headerActions.forEach((action) => {
                    const actionButton = new IconButton({
                        ariaLabel: action.name,
                        buttonSize: "large",
                        svgSize: "large",
                        icon: action.icon.cloneNode(true),
                        onClick: () => {
                            actionTooltip.close();
                            action.onClick();
                        },
                    });
                    actions.appendChild(actionButton.get());

                    const actionTooltip = new Tooltip({
                        target: actionButton.get(),
                        message: action.name,
                        position: "top",
                    });
                });
            }

            if (this.fullscreen) {
                const fullscreenButton = new IconButton({
                    icon: icons.get("arrows-fullscreen"),
                    buttonSize: "large",
                    svgSize: "large",
                    ariaLabel: "Pantalla completa",
                    onClick: () => {
                        this.isFullscreen = !this.isFullscreen;
                        fullscreenTooltip.close();
                        this.render();
                        if (this.onFullscreen) {
                            this.onFullscreen(this.isFullscreen);
                        }
                    },
                });
                actions.appendChild(fullscreenButton.get());

                const fullscreenTooltip = new Tooltip({
                    target: fullscreenButton.get(),
                    message: "Pantalla completa",
                    position: "top",
                });
            }

            return header;
        }
    }

    createLoader() {
        const loader = document.createElement("div");
        loader.classList.add("loader");

        const spinner = document.createElement("div");
        spinner.classList.add("spinner");
        loader.appendChild(spinner);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "25 25 50 50");
        spinner.appendChild(svg);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "50");
        circle.setAttribute("cy", "50");
        circle.setAttribute("r", "20");
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke-width", "3");
        circle.setAttribute("stroke-miterlimit", "10");
        svg.appendChild(circle);

        return loader;
    }

    createThead() {
        const thead = document.createElement("thead");

        const tr = document.createElement("tr");
        thead.appendChild(tr);

        const thCheckAll = document.createElement("th");
        tr.appendChild(thCheckAll);

        const form = document.createElement("form");
        form.classList.add("mio-form");
        thCheckAll.appendChild(form);

        const checkbox = new Checkbox({
            label: {
                text: "",
                for: this.selectedRows.length > 0 ? "uncheck-all" : "check-all",
            },
            input: {
                name: this.selectedRows.length > 0 ? "uncheck-all" : "check-all",
                id: this.selectedRows.length > 0 ? "uncheck-all" : "check-all",
                value: this.selectedRows.length > 0,
                indeterminate: this.selectedRows.length > 0 && this.selectedRows.length < this.rows.length,
            },
            onClick: (value) => {
                this.selectedRows = value ? this.rows : [];
                checkTooltip.close();
                this.render();
            },
        });
        form.appendChild(checkbox.get());


        const checkTooltip = new Tooltip({
            target: checkbox.get(),
            message: this.selectedRows.length > 0 ? "Deseleccionar todo" : "Seleccionar todo",
            position: "top",
        });

        this.columns.forEach((column) => tr.appendChild(this.createTh(column)));

        if (this.customColumns) {
            this.customColumns.forEach((column) => tr.appendChild(this.createTh(column)));
        }

        if (this.rowActions) {
            const thActions = document.createElement("th");
            thActions.textContent = "Acciones";
            tr.appendChild(thActions);
        }

        return thead;
    }

    createTh(column) {
        const th = document.createElement("th");

        const button = document.createElement("button");
        button.type = "button";
        button.ariaLabel = "Ordenar";
        button.classList.add("sort-btn");
        button.addEventListener("click", this.handleSortColumn.bind(this, column));
        th.appendChild(button);

        const name = document.createElement("div");
        name.classList.add("name");
        name.textContent = column.name;
        button.appendChild(name);

        const icon = document.createElement("div");
        icon.classList.add("icon", "asc");
        if (this.sortColumn === column && this.sort) {
            icon.classList.remove("asc");
            icon.classList.add("asc");
        }
        if (this.sortColumn === column && !this.sort) {
            icon.classList.remove("asc");
            icon.classList.add("desc");
        }
        button.appendChild(icon);

        const sortIcon = icons.get("arrow-up-short");
        icon.appendChild(sortIcon);

        return th;
    }

    createTbody() {
        const tbody = document.createElement("tbody");

        this.filteredRows.forEach((row, index) => {
            if (index < this.rowsPerPage * (this.page - 1) || index >= this.rowsPerPage * this.page) {
                return;
            }

            const tr = document.createElement("tr");
            const exists = this.selectedRows.some((selectedRow) => selectedRow === row);
            if (exists) {
                tr.classList.add("selected");
            }
            tr.addEventListener("click", this.handleRowClick.bind(this, row));
            tbody.appendChild(tr);

            const tdCheck = document.createElement("td");
            tr.appendChild(tdCheck);

            const form = document.createElement("form");
            form.classList.add("mio-form");
            tdCheck.appendChild(form);

            const check = new Checkbox({
                label: {
                    text: "",
                    for: "check" + row.id,
                },
                input: {
                    name: "check" + row.id,
                    id: "check" + row.id,
                    value: exists,
                },
                onClick: (value) => {
                    if (value) {
                        this.selectedRows = [...this.selectedRows, row];
                    } else {
                        this.selectedRows = this.selectedRows.filter((selectedRow) => selectedRow !== row);
                    }
                    this.render();
                },
            });
            form.appendChild(check.get());

            this.columns.forEach((column) => {
                const td = document.createElement("td");
                if (column.formatter) {
                    td.textContent = column.formatter(row[column.field]);
                } else {
                    td.textContent = row[column.field];
                }
                tr.appendChild(td);
            });

            if (this.customColumns) {
                this.customColumns.forEach((column) => {
                    const td = document.createElement("td");
                    tr.appendChild(td);

                    const content = column.content(row);
                    td.appendChild(content);
                });
            }

            const tdActions = document.createElement("td");
            tdActions.classList.add("actions");
            tr.appendChild(tdActions);

            const actionsContainer = document.createElement("div");
            tdActions.appendChild(actionsContainer);

            if (this.showActionsMenu && this.rowActions) {
                const menuButton = new IconButton({
                    type: "button",
                    ariaLabel: "Menu Acciones",
                    buttonSize: "large",
                    svgSize: "medium",
                    icon: icons.get("three-dots-vertical"),
                    onClick: () => {
                        menuTooltip.close();
                        menu.open();
                    },
                });
                actionsContainer.appendChild(menuButton.get());

                const menuTooltip = new Tooltip({
                    target: menuButton.get(),
                    message: "Abrir menú",
                    position: "top",
                });

                const items = this.rowActions.map((action) => ({
                    type: "button",
                    text: action.name,
                    ariaLabel: action.name,
                    icon: action.icon,
                    onClick: () => action.onClick(row),
                }));

                const menu = new Menu({
                    target: menuButton.get(),
                    items: items,
                });
            }

            if (!this.showActionsMenu && this.rowActions) {
                this.rowActions.forEach((action) => {
                    const button = new IconButton({
                        ariaLabel: action.name,
                        buttonSize: "large",
                        svgSize: "medium",
                        icon: action.icon.cloneNode(true),
                        onClick: () => action.onClick(row),
                    });
                    actionsContainer.appendChild(button.get());
                });
            }
        });

        return tbody;
    }

    createFooter() {
        const footer = document.createElement("div");
        footer.classList.add("footer");

        const colLeft = document.createElement("div");
        colLeft.classList.add("col-left");
        footer.appendChild(colLeft);

        const rowsPerPage = document.createElement("div");
        rowsPerPage.classList.add("rows-per-page");
        colLeft.appendChild(rowsPerPage);

        const form = document.createElement("form");
        rowsPerPage.appendChild(form);

        const select = new Select({
            label: {
                text: "Filas por página:",
                for: "rows-per-page",
                position: "left",
            },
            select: {
                name: "rows-per-page",
                id: "rows-per-page",
            },
            option: {
                value: "value",
                text: "text",
            },
            options: this.rowsPerPageOptions.map((option) => ({ value: option, text: option })),
            selected: { value: this.rowsPerPage },
            onSelect: async (option) => {
                this.rowsPerPage = option.value;
                this.pages = Math.ceil(this.rows.length / this.rowsPerPage);

                this.checkPage();
                this.render();
            },
        });
        form.appendChild(select.get());

        const colRight = document.createElement("div");
        colRight.classList.add("col-right");
        footer.appendChild(colRight);

        const rows = document.createElement("div");
        rows.classList.add("rows");
        let text = "";
        if (this.rows.length) {
            text += (this.page - 1) * this.rowsPerPage + 1 + "-";
        } else {
            text += "0-";
        }
        if (this.page * this.rowsPerPage > this.rows.length) {
            text += this.rows.length + " de " + this.rows.length;
        } else {
            text += this.page * this.rowsPerPage + " de " + this.rows.length;
        }
        rows.textContent = text;
        colRight.appendChild(rows);

        const pagination = document.createElement("div");
        pagination.classList.add("pagination");
        colRight.appendChild(pagination);

        const prev = new IconButton({
            type: "button",
            ariaLabel: "Página anterior",
            disabled: this.page === 1,
            buttonSize: "large",
            svgSize: "large",
            icon: icons.get("chevron-left"),
            onClick: () => {
                this.scrollPosition = 0;
                this.page--;
                prevTooltip.close();
                this.render();
            },
        });
        pagination.appendChild(prev.get());

        const prevTooltip = new Tooltip({
            target: prev.get(),
            message: "Anterior",
            position: "top",
        });

        const next = new IconButton({
            type: "button",
            ariaLabel: "Página siguiente",
            disabled: this.page === this.pages,
            buttonSize: "large",
            svgSize: "large",
            icon: icons.get("chevron-right"),
            onClick: () => {
                this.scrollPosition = 0;
                this.page++;
                nextTooltip.close();
                this.render();
            },
        });
        pagination.appendChild(next.get());

        const nextTooltip = new Tooltip({
            target: next.get(),
            message: "Siguiente",
            position: "top",
        });

        return footer;
    }

    handleSortColumn(column) {
        console.log(column);
        if (this.sortColumn === column) {
            this.sort = !this.sort;
        } else {
            this.sort = true;
            this.sortColumn = column;
        }

        this.rows.sort((a, b) => {
            const aValue = a[column.field];
            const bValue = b[column.field];

            if (this.sort) {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.render();
    }

    handleRowClick(row, e) {
        const tr = e.currentTarget;
        tr.classList.toggle("selected");

        const checkbox = tr.querySelector("input[type=checkbox]");
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.selectedRows = [...this.selectedRows, row];
        } else {
            this.selectedRows = this.selectedRows.filter((selectedRow) => selectedRow !== row);
        }
        this.render();
    }

    load() {
        this.isLoading = true;
        this.render();
    }

    render() {
        this.setPages();
        this.checkPage();
        this.destroy();
        this.create();
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.datagrid) {
            this.datagrid.remove();
        }
    }
}

export default Table;
