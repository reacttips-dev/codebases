import { v4 } from "uuid";

export default class ArtBoardHandler {
  constructor(handler) {
    this.handler = handler;
  }

  onAddItem = (item, centered) => {
    // if (this.handler.interactionMode === "polygon") {
    //   // message.info('Already drawing');
    //   console.info("Already drawing");
    //   return;
    // }
    const id = v4();
    const option = Object.assign({}, item.option, { id });
    this.handler.add(option, centered);
  };
  onAddImage = (url, centered) => {
    const item = {
      option: {
        name: "New Image",
        src: url,
        type: "image",
      },
    };
    this.onAddItem(item);
  };
  onAddSVG = (data, centered) => {
    const option = {
      loadType: "svg",
      svg: data.content.svg,
      content: {
        meta: {
          ...data.content.meta,
        },
      },
    };

    this.handler.add(
      { ...option, type: "svg", superType: "svg", id: v4(), name: "New SVG" },
      centered
    );
  };
}
