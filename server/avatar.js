"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@dicebear/avatars");
const collection = require("@dicebear/collection");
function generateSvg() {
    const avatar = core.createAvatar(collection.lorelei, {
        seed: "John Doe",
        size: 32,
    });
    const svg = avatar.toString();
    return svg;
}
exports.default = generateSvg;
