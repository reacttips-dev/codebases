import React, { useEffect, useRef } from 'react';

export const AccessibleErrorContainer = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  return (
    <div role="alert" ref={ref} className={className}>
      {children}
    </div>
  );
};
