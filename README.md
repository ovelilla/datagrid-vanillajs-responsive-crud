# datagrid-vanillajs-responsive-crud
Responsive crud vanilla JavaScript datagrid


Demo: https://glittering-sable-6eb139.netlify.app



```
import Datagrid from "./components/datagrid";

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
    rows: rows,
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
```
