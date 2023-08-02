// import { createAvatar } from "@dicebear/core";
// import { lorelei } from "@dicebear/collection";
const core = require("@dicebear/avatars");
const collection = require("@dicebear/collection");

export default function generateSvg() {
  const avatar = core.createAvatar(collection.lorelei, {
    seed: "John Doe",
    size: 32,
  });

  const svg = avatar.toString();
  return svg;
}
