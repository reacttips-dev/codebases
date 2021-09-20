/* eslint-disable import/no-default-export */
import React, { FunctionComponent } from 'react';
import ReactDOM from '@trello/react-dom-wrapper';

import styles from './LayerManager.less';

const LayerManagerContext = React.createContext({
  alertLayerRef: React.createRef<HTMLDivElement>(),
  flagLayerRef: React.createRef<HTMLDivElement>(),
  overlayLayerRef: React.createRef<HTMLDivElement>(),
  popoverLayerRef: React.createRef<HTMLDivElement>(),
  tooltipLayerRef: React.createRef<HTMLDivElement>(),
});

type Ref = React.RefObject<HTMLDivElement>;

interface LayerManagerRefs {
  alertLayerRef: Ref;
  flagLayerRef: Ref;
  overlayLayerRef: Ref;
  popoverLayerRef: Ref;
  tooltipLayerRef: Ref;
}

export enum Layers {
  Alert = 'layer-manager-alert',
  Flag = 'layer-manager-flag',
  Overlay = 'layer-manager-overlay',
  Popover = 'layer-manager-popover',
  Tooltip = 'layer-manager-tooltip',
}

export class LayerManager extends React.Component {
  layerRefs: LayerManagerRefs = {
    alertLayerRef: React.createRef<HTMLDivElement>(),
    flagLayerRef: React.createRef<HTMLDivElement>(),
    overlayLayerRef: React.createRef<HTMLDivElement>(),
    popoverLayerRef: React.createRef<HTMLDivElement>(),
    tooltipLayerRef: React.createRef<HTMLDivElement>(),
  };

  render() {
    return (
      <LayerManagerContext.Provider value={this.layerRefs}>
        <div className={styles.appLayer}>{this.props.children}</div>
        {/*
         * Wrap these elements in a parent with the magic class that suppresses
         * the global click-handling logic (see doc-init.js#domReady method)
         */}
        <div className="js-react-root">
          <div className={styles.alertLayer} id={Layers.Alert} />
          <div className={styles.flagLayer} id={Layers.Flag} />
          <div className={styles.overlayLayer} id={Layers.Overlay} />
          <div
            tabIndex={-1}
            className={styles.popoverLayer}
            id={Layers.Popover}
          />
          <div className={styles.tooltipLayerRef} id={Layers.Tooltip} />
        </div>
      </LayerManagerContext.Provider>
    );
  }
}

interface LayerManagerPortalProps {
  layer: Layers;
}

export const LayerManagerPortal: FunctionComponent<LayerManagerPortalProps> = ({
  layer,
  children,
}) => {
  const portalElement = document.getElementById(layer);

  return portalElement ? ReactDOM.createPortal(children, portalElement) : null;
};
