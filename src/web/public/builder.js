const state = {
    elements: [],
    selectedId: null,
};

const canvas = document.getElementById("messageCanvas");
const emptyState = document.getElementById("emptyState");
const properties = document.getElementById("properties");
const selectedLabel = document.getElementById("selectedLabel");
const elementCount = document.getElementById("elementCount");
const toast = document.getElementById("toast");

function createId(type) {
    return `${type}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

function createElement(type) {
    switch (type) {
        case "text":
            return {
                id: createId("text"),
                type: "text",
                text: {
                    content: "New text",
                },
            };

        case "image":
            return {
                id: createId("image"),
                type: "image",
                image: {
                    url: "https://placehold.co/800x400",
                    alt: "",
                },
            };

        case "separator":
            return {
                id: createId("separator"),
                type: "separator",
            };

        case "button":
            return {
                id: createId("button"),
                type: "button",
                button: {
                    label: "Button",
                    style: "primary",
                    customId: createId("button_action"),
                },
            };

        case "select":
            return {
                id: createId("select"),
                type: "select",
                select: {
                    type: "string",
                    customId: createId("select_action"),
                    placeholder: "Choose an option",
                    options: [
                        {
                            label: "Option 1",
                            value: "option_1",
                        },
                        {
                            label: "Option 2",
                            value: "option_2",
                        },
                    ],
                },
            };

        case "channel-select":
            return {
                id: createId("channel"),
                type: "select",
                select: {
                    type: "channel",
                    customId: createId("channel_select"),
                    placeholder: "Choose a channel",
                },
            };

        case "user-select":
            return {
                id: createId("user"),
                type: "select",
                select: {
                    type: "user",
                    customId: createId("user_select"),
                    placeholder: "Choose a user",
                },
            };

        case "role-select":
            return {
                id: createId("role"),
                type: "select",
                select: {
                    type: "role",
                    customId: createId("role_select"),
                    placeholder: "Choose a role",
                },
            };

        case "mentionable-select":
            return {
                id: createId("mentionable"),
                type: "select",
                select: {
                    type: "mentionable",
                    customId: createId("mentionable_select"),
                    placeholder: "Choose a user or role",
                },
            };

        case "section":
            return {
                id: createId("section"),
                type: "section",
                section: {
                    text: {
                        content: "Section text",
                    },
                },
            };

        default:
            throw new Error(`Unknown element type: ${type}`);
    }
}

function addElement(type) {
    const element = createElement(type);

    state.elements.push(element);
    state.selectedId = element.id;

    render();
}

function removeElement(id) {
    state.elements = state.elements.filter(
        (element) => element.id !== id,
    );

    if (state.selectedId === id) {
        state.selectedId = null;
    }

    render();
}

function moveElement(id, direction) {
    const index = state.elements.findIndex(
        (element) => element.id === id,
    );

    if (index === -1) {
        return;
    }

    const target = index + direction;

    if (target < 0 || target >= state.elements.length) {
        return;
    }

    const current = state.elements[index];

    state.elements[index] = state.elements[target];
    state.elements[target] = current;

    state.selectedId = id;

    render();
}

function selectedElement() {
    return state.elements.find(
        (element) => element.id === state.selectedId,
    );
}

function updateSelected(callback) {
    const element = selectedElement();

    if (!element) {
        return;
    }

    callback(element);
    render();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
       mkdir -p src/web/public

cat > src/web/public/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title>MYCTRA Message Builder</title>
    <link rel="stylesheet" href="/builder.css">
</head>

<body>
    <div class="app">

        <header class="topbar">
            <div class="brand">
                <div class="brand-logo">M</div>

                <div>
                    <div class="brand-title">MYCTRA</div>
                    <div class="brand-subtitle">Message Builder</div>
                </div>
            </div>

            <div class="top-actions">
                <button id="saveButton" class="button secondary">
                    Save
                </button>

                <button id="previewButton" class="button secondary">
                    Preview
                </button>

                <button id="clearButton" class="button danger">
                    Clear
                </button>
            </div>
        </header>

        <main class="workspace">

            <aside class="sidebar left-panel">

                <div class="panel-header">
                    <h2>Add Element</h2>
                    <p>Build your message freely.</p>
                </div>

                <div class="element-grid">

                    <button
                        class="element-button"
                        data-add="text"
                    >
                        <span> T </span>
                        <strong>Text</strong>
                        <small>Text display</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="image"
                    >
                        <span>IMG</span>
                        <strong>Image</strong>
                        <small>Media image</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="separator"
                    >
                        <span>—</span>
                        <strong>Separator</strong>
                        <small>Visual divider</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="button"
                    >
                        <span>BTN</span>
                        <strong>Button</strong>
                        <small>Interactive button</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="select"
                    >
                        <span>SEL</span>
                        <strong>Select</strong>
                        <small>String select</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="channel-select"
                    >
                        <span>#</span>
                        <strong>Channel Select</strong>
                        <small>Choose a channel</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="user-select"
                    >
                        <span>@</span>
                        <strong>User Select</strong>
                        <small>Choose a user</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="role-select"
                    >
                        <span>R</span>
                        <strong>Role Select</strong>
                        <small>Choose a role</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="mentionable-select"
                    >
                        <span>M</span>
                        <strong>Mentionable</strong>
                        <small>User or role</small>
                    </button>

                    <button
                        class="element-button"
                        data-add="section"
                    >
                        <span>S</span>
                        <strong>Section</strong>
                        <small>Text + accessory</small>
                    </button>
                </div>

            </aside>

            <section class="canvas-panel">

                <div class="canvas-header">
                    <div>
                        <h2>Message</h2>
                        <p id="elementCount">0 elements</p>
                    </div>

                    <div class="status">
                        <span class="status-dot"></span>
                        Draft
                    </div>
                </div>

                <div class="message-stage">

                    <div id="emptyState" class="empty-state">
                        <div class="empty-icon">+</div>
                        <h3>Your message is empty</h3>
                        <p>
                            Add any element from the left.
                            You can use them in any order.
                        </p>
                    </div>

                    <div
                        id="messageCanvas"
                        class="message-canvas"
                    ></div>

                </div>

            </section>

            <aside class="sidebar right-panel">

                <div class="panel-header">
                    <h2>Properties</h2>
                    <p id="selectedLabel">
                        Select an element
                    </p>
                </div>

                <div
                    id="properties"
                    class="properties"
                >
                    <div class="property-empty">
                        Select an element from the message
                        to edit its properties.
                    </div>
                </div>

            </aside>

        </main>

    </div>

    <div
        id="toast"
        class="toast"
    ></div>

    <script src="/builder.js"></script>
</body>
</html>

/* =========================================================
   MYCTRA BUILDER — PRODUCTIVITY LAYER
   ========================================================= */

(function () {
    const STORAGE_KEY = "myctra-builder-draft-v1";

    function saveDraft() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state.elements)
            );
            if (typeof showToast === "function") {
                showToast("Draft saved");
            }
        } catch (error) {
            console.error("MYCTRA save failed:", error);
        }
    }

    function loadDraft() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;

            const saved = JSON.parse(raw);

            if (!Array.isArray(saved)) return;

            state.elements = saved;
            state.selectedId = null;

            if (typeof render === "function") {
                render();
            }

            if (typeof renderProperties === "function") {
                renderProperties();
            }
        } catch (error) {
            console.error("MYCTRA load failed:", error);
        }
    }

    function clearDraft() {
        localStorage.removeItem(STORAGE_KEY);
        state.elements = [];
        state.selectedId = null;

        if (typeof render === "function") {
            render();
        }

        if (typeof renderProperties === "function") {
            renderProperties();
        }

        if (typeof showToast === "function") {
            showToast("Builder cleared");
        }
    }

    function previewDraft() {
        const payload = {
            version: 1,
            createdAt: new Date().toISOString(),
            elements: state.elements
        };

        console.log("MYCTRA MESSAGE PREVIEW", payload);

        const preview = window.open("", "_blank");

        if (!preview) {
            alert("Allow popups to open MYCTRA Preview.");
            return;
        }

        preview.document.write(`
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>MYCTRA Preview</title>
                <style>
                    body {
                        margin: 0;
                        padding: 40px 20px;
                        background: #f7f2e8;
                        color: #171717;
                        font-family: Inter, system-ui, sans-serif;
                    }

                    .preview {
                        max-width: 720px;
                        margin: auto;
                        background: #fffaf0;
                        border: 1px solid #262626;
                        border-radius: 18px;
                        padding: 24px;
                        box-shadow: 0 15px 45px rgba(23,23,23,.10);
                    }

                    h1 {
                        margin-top: 0;
                        font-size: 20px;
                    }

                    .element {
                        padding: 14px;
                        margin: 10px 0;
                        border: 1px solid #262626;
                        border-radius: 12px;
                        background: linear-gradient(
                            135deg,
                            #fffaf0 0%,
                            #fffaf0 72%,
                            rgba(229,27,42,.10) 100%
                        );
                    }

                    .type {
                        color: #e51b2a;
                        font-size: 11px;
                        font-weight: 800;
                        text-transform: uppercase;
                        margin-bottom: 6px;
                    }

                    button {
                        background: #e51b2a;
                        color: #fffaf0;
                        border: 0;
                        padding: 10px 16px;
                        border-radius: 9px;
                        font-weight: 700;
                    }

                    hr {
                        border: 0;
                        border-top: 1px solid #262626;
                    }
                </style>
            </head>
            <body>
                <div class="preview">
                    <h1>MYCTRA Message Preview</h1>
                    ${state.elements.map((element) => {
                        if (element.type === "text") {
                            return `
                                <div class="element">
                                    <div class="type">Text</div>
                                    ${escapeHtml(
                                        element.text?.content || ""
                                    )}
                                </div>
                            `;
                        }

                        if (element.type === "separator") {
                            return `
                                <div class="element">
                                    <div class="type">Separator</div>
                                    <hr>
                                </div>
                            `;
                        }

                        if (element.type === "button") {
                            return `
                                <div class="element">
                                    <div class="type">Button</div>
                                    <button>
                                        ${escapeHtml(
                                            element.button?.label || "Button"
                                        )}
                                    </button>
                                </div>
                            `;
                        }

                        return `
                            <div class="element">
                                <div class="type">${escapeHtml(
                                    element.type || "Element"
                                )}</div>
                                ${escapeHtml(
                                    JSON.stringify(element, null, 2)
                                )}
                            </div>
                        `;
                    }).join("")}
                </div>
            </body>
            </html>
        `);

        preview.document.close();
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    document.addEventListener("click", function (event) {
        const target = event.target.closest("button");

        if (!target) return;

        if (target.id === "saveButton") {
            saveDraft();
        }

        if (target.id === "previewButton") {
            previewDraft();
        }

        if (target.id === "clearButton") {
            clearDraft();
        }
    });

    window.myctraBuilder = {
        save: saveDraft,
        load: loadDraft,
        clear: clearDraft,
        preview: previewDraft,
        getState: function () {
            return state;
        }
    };

    window.addEventListener("load", function () {
        loadDraft();
    });
})();
