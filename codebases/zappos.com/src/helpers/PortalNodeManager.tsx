import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Component<P> = React.Component<P> | React.ComponentType<P>;

type ComponentProps<T extends Component<any>> = T extends Component<infer P> ? P : never;

export interface PortalNode<T extends Component<any> = Component<any>> {
  element: HTMLElement;
  setPortalProps(p: ComponentProps<T>): void;
  getInitialPortalProps(): ComponentProps<T>;
  mount(newParent: Node, placeholder: Node): void;
  unmount(expectedPlaceholder?: Node): void;
}

export const createInjectionContext = <T extends Component<any>>(): PortalNode<T> => {
  let initialProps = {} as ComponentProps<T>;

  let parent: Node | undefined;
  let lastPlaceholder: Node | undefined;

  const element = document.createElement('div');

  const portalNode: PortalNode<T> = {
    element,
    setPortalProps: (props: ComponentProps<T>) => {
      initialProps = props;
    },
    getInitialPortalProps: () => initialProps,
    mount: (newParent: HTMLElement, newPlaceholder: HTMLElement) => {
      if (newPlaceholder === lastPlaceholder) {
        return; // skip if already mounted
      }
      portalNode.unmount();

      newParent.replaceChild(
        portalNode.element,
        newPlaceholder,
      );

      parent = newParent;
      lastPlaceholder = newPlaceholder;
    },
    unmount: (expectedPlaceholder?: Node) => {
      if (expectedPlaceholder && expectedPlaceholder !== lastPlaceholder) {
        return; // skip if already unmounted
      }

      if (parent && lastPlaceholder) {
        parent.replaceChild(
          lastPlaceholder,
          portalNode.element,
        );

        parent = undefined;
        lastPlaceholder = undefined;
      }
    }
  };

  return portalNode;
};

interface BranchPortalProps {
  node: PortalNode;
  children: React.ReactNode;
}

export const BranchPortal = ({ children, node }: BranchPortalProps) => {
  // "pull" props in from the injection context and set to state
  // this way, if the "node" changes, we can update this peice of state and re-render with the new props
  const [nodeProps, setNodeProps] = useState(node.getInitialPortalProps());
  const getPropsFromPortalNode = useCallback(() => {
    Object.assign(node, {
      setPortalProps: (props: {}) => {
        setNodeProps(props);
      }
    });
  }, [node]);

  useEffect(() => {
    getPropsFromPortalNode();
  }, [getPropsFromPortalNode]);

  return createPortal(
    React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }
      return React.cloneElement(child, nodeProps);
    }),
    node.element
  );
};

type LeafPortalProps<T extends Component<any>> = {
  node: PortalNode<T>;
} & Partial<ComponentProps<T>>;

export const LeafPortal = <T extends Component<any>>(props: LeafPortalProps<T>) => {
  const { node } = props;
  const placeholderNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const placeholder = placeholderNode.current!;
    const parent = placeholder.parentNode!;
    const propsForTarget = Object.assign({}, props, { node: undefined });
    node.setPortalProps(propsForTarget);
    node.mount(parent, placeholder);

    return () => {
      node.unmount(placeholder);
    };
  }, [node, props]);

  // DOM placeholder which will be swapped out for the portalled-node later
  return <div ref={placeholderNode} />;
};

export default {
  createInjectionContext,
  LeafPortal,
  BranchPortal
};
