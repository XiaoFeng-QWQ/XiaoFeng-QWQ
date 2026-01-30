import "./core.js";
import { initCore } from "./core.js";
import { initExtensions } from "./extensions.js";

document.addEventListener('DOMContentLoaded', () => {
    initCore();
    initExtensions();
});