import { schema } from "normalizr";

export const layer = new schema.Entity("layers");
const layers = new schema.Array(layer);
layer.define({ layers });

export const group = new schema.Entity("layers", {
  layers: [layer],
});

export const page = new schema.Entity("pages", {
  layers: [layer],
});
