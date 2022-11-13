export const icons = (() => {
    const icons = [
        {
            name: "check-box",
            width: "24",
            height: "24",
            paths: [
                {
                    d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
                },
            ],
        },
        {
            name: "check-box-outline-blank",
            width: "24",
            height: "24",
            paths: [
                {
                    d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
                },
            ],
        },
        {
            name: "indeterminate-check-box",
            width: "24",
            height: "24",
            paths: [
                {
                    d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z",
                },
            ],
        },
        {
            name: "plus",
            paths: [
                {
                    d: "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z",
                },
            ],
        },
        {
            name: "dash",
            paths: [
                {
                    d: "M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z",
                },
            ],
        },
    ];

    const createIcon = (icon) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", `${icon.width || 16}`);
        svg.setAttribute("height", `${icon.height || 16}`);
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", `0 0 ${icon.width || 16} ${icon.height || 16}`);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        icon.paths.forEach((path) => {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            if (path.fillRule) {
                pathElement.setAttribute("fill-rule", path.fillRule);
            }
            pathElement.setAttribute("d", path.d);
            svg.appendChild(pathElement);
        });

        return svg;
    };

    const get = (name) => {
        const icon = icons.find((icon) => icon.name === name);
        if (!icon) {
            return null;
        }
        return createIcon(icon);
    };

    return {
        get,
    };
})();
