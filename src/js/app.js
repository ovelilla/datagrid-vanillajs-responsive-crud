import Datagrid from "./components/datagrid";
import Modal from "./components/modal";
import Confirm from "./components/confirm";
import Popup from "./components/popup";
import { Input, InputNumber } from "./components/form";
import { icons } from "./modules/Icons";

const values = {
    name: "",
    lastname: "",
    age: "",
};

const errors = {
    name: "",
    lastname: "",
    age: "",
};

const columns = [
    { field: "id", name: "Id" },
    { field: "name", name: "Nombre" },
    { field: "lastname", name: "Apellidos" },
    { field: "age", name: "Edad" },
];

const rows = [
    { id: 1, lastname: "Snow", name: "Jon", age: 35 },
    { id: 2, lastname: "Lannister", name: "Cersei", age: 42 },
    { id: 3, lastname: "Lannister", name: "Jaime", age: 45 },
    { id: 4, lastname: "Stark", name: "Arya", age: 15 },
    { id: 5, lastname: "Targaryen", name: "Daenerys", age: 17 },
    { id: 6, lastname: "Melisandre", name: "De Asshai", age: 150 },
    { id: 7, lastname: "Greyjoy", name: "Theon", age: 44 },
    { id: 8, lastname: "Drogo", name: "Khal", age: 36 },
    { id: 9, lastname: "The Spider", name: "Varys", age: 65 },
    { id: 10, lastname: "Baratheon", name: "Joffrey", age: 18 },
    { id: 11, lastname: "Baratheon", name: "Sansa", age: 16 },
    { id: 12, lastname: "De Tarth", name: "Brienne", age: 27 },
    { id: 13, lastname: "Stark", name: "Eddard", age: 48 },
    { id: 14, lastname: "Baratheon", name: "Robert", age: 43 },
    { id: 15, lastname: "Mormont", name: "Jorah", age: 52 },
    { id: 16, lastname: "Tyrell", name: "Margaery", age: 20 },
    { id: 17, lastname: "Lannister", name: "Tywin", age: 55 },
    { id: 18, lastname: "Giantsbane", name: "Tormund", age: 40 },
    { id: 19, lastname: "Bolton", name: "Ramsay", age: 29 },
    { id: 20, lastname: "Stark", name: "Catelyn", age: 41 },
    { id: 21, lastname: "Targaryen", name: "Viserys", age: 22 },
];

let lastId = 21;

const container = document.querySelector(".container");

const table = new Datagrid({
    title: "Datagrid",
    columns: columns,
    rows: [],
    findFields: ["lastname", "name", "age"],
    container: container,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15, 25, 50, 100],
    showActionsMenu: true,
    fullscreen: true,
    onFullscreen: (isFullscreen) => {},
    headerActions: [
        {
            name: "Nuevo personaje",
            icon: icons.get("plus-lg"),
            onClick: handleCreate,
        },
    ],
    rowActions: [
        {
            name: "Actualizar",
            icon: icons.get("pencil-square"),
            onClick: handleUpdate,
        },
        {
            name: "Eliminar",
            icon: icons.get("trash"),
            onClick: handleDelete,
        },
    ],
    selectActions: [
        {
            name: "Eliminar seleccionados",
            icon: icons.get("trash"),
            onClick: handleDeleteSelected,
        },
    ],
});

table.load();
await timeout(3000);
table.setRows(rows);


function handleCreate() {
    const modal = new Modal({
        title: "Nuevo personaje",
        content: createForm(),
        maxWidth: 700,
        autoOpen: true,
        fullscreen: true,
        confirmClose: true,
        footerActions: [
            {
                text: "Crear",
                type: "button",
                ariaLabel: "Crear personaje",
                classes: ["btn", "primary-btn"],
                loading: true,
                onClick: async () => {
                    if (!validateForm()) {
                        modal.render(createForm());
                        return;
                    }

                    table.load();
                    await timeout(2000);
                    table.addRow({ id: ++lastId, ...values });
                    const popup = new Popup({
                        title: "Personaje creado",
                        message: "El personaje ha sido creado correctamente",
                        type: "success",
                        timer: 3000,
                    });
                    await popup.open();
                    modal.close();
                },
            },
        ],
        onClose: () => {
            resetValues();
            resetErrors();
        },
    });
}

function handleUpdate(row) {
    setValues(row);

    const modal = new Modal({
        title: "Actualizar personaje",
        content: createForm(),
        maxWidth: 700,
        autoOpen: true,
        fullscreen: true,
        confirmClose: true,
        footerActions: [
            {
                text: "Actualizar",
                type: "button",
                ariaLabel: "Actualizar personaje",
                classes: ["btn", "primary-btn"],
                loading: true,
                onClick: async () => {
                    if (!validateForm()) {
                        modal.render(createForm());
                        return;
                    }

                    table.load();
                    await timeout(2000);
                    table.updateRow({ id: row.id, ...values });
                    const popup = new Popup({
                        title: "Personaje actualizado",
                        message: "El personaje ha sido actualizado correctamente",
                        type: "success",
                        timer: 3000,
                    });
                    await popup.open();
                    modal.close();
                },
            },
        ],
        onClose: () => {
            resetValues();
            resetErrors();
        },
    });
}

async function handleDelete(row) {
    const confirm = new Confirm({
        title: "¿Eliminar personaje?",
        description: "¿Estás seguro de que deseas eliminar el personaje? Los datos no podrán ser recuperados.",
        accept: "Eliminar",
        cancel: "Cancelar",
    });
    const confirmResponse = await confirm.question();

    if (!confirmResponse) {
        return;
    }

    table.load();
    await timeout(2000);
    table.deleteRow(row);
    const popup = new Popup({
        title: "Personaje eliminado",
        message: "El personaje ha sido eliminado correctamente",
        type: "success",
        timer: 3000,
    });
    await popup.open();
}

async function handleDeleteSelected(rows) {
    const confirm = new Confirm({
        title: "¿Eliminar personaje?",
        description: "¿Estás seguro de que deseas eliminar el personaje? Los datos no podrán ser recuperados.",
        accept: "Eliminar",
        cancel: "Cancelar",
    });
    const confirmResponse = await confirm.question();

    if (!confirmResponse) {
        return;
    }

    table.load();
    await timeout(2000);
    table.deleteRows(rows);
    const popup = new Popup({
        title: "Personajes eliminados",
        message: "Los personajes han sido eliminados correctamente",
        type: "success",
        timer: 3000,
    });
    await popup.open();
}

function validateForm() {
    if (!values.name) {
        errors.name = "El nombre es obligatorio";
    }

    if (!values.lastname) {
        errors.lastname = "El apellido es obligatorio";
    }

    if (!values.age) {
        errors.age = "La edad es obligatoria";
    }

    return !errors.name && !errors.lastname && !errors.age;
}

function createForm() {
    const form = document.createElement("form");
    form.noValidate = true;
    form.classList.add("mio-form");

    const name = new Input({
        label: {
            text: "Nombre",
            for: "name",
        },
        input: {
            type: "text",
            name: "name",
            id: "name",
            value: values.name,
        },
        error: errors.name.length > 0,
        message: errors.name,
        onInput: (value) => {
            values.name = value;
            errors.name = "";
        },
    });
    form.appendChild(name.get());

    const lastname = new Input({
        label: {
            text: "Apellidos",
            for: "lastname",
        },
        input: {
            type: "text",
            name: "lastname",
            id: "lastname",
            value: values.lastname,
        },
        error: errors.lastname.length > 0,
        message: errors.lastname,
        onInput: (value) => {
            values.lastname = value;
            errors.lastname = "";
        },
    });
    form.appendChild(lastname.get());

    const age = new InputNumber({
        label: {
            text: "Edad",
            for: "age",
        },
        input: {
            type: "text",
            name: "age",
            id: "age",
            step: 1,
            min: 1,
            max: 100,
            value: values.age,
        },
        error: errors.age.length > 0,
        message: errors.age,
        onInput: (value) => {
            console.log(value);
            values.age = value;
            errors.age = "";
        },
    });
    form.appendChild(age.get());

    return form;
}

function setValues(row) {
    for (const key of Object.keys(values)) {
        values[key] = row[key];
    }
}

function resetValues() {
    for (const key of Object.keys(values)) {
        values[key] = "";
    }
}

function resetErrors() {
    for (const key of Object.keys(errors)) {
        errors[key] = "";
    }
}

async function timeout(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
