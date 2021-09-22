import * as React from 'react';
import styles from './TwoColumn.scss';
function TwoColumn({
    children,
    firstColumnLength,
}: {
    children?: React.ReactNode;
    firstColumnLength?: number;
}) {
    const childArray = React.Children.toArray(children);
    const splitPoint = firstColumnLength || Math.ceil(childArray.length / 2);
    return (
        <>
            <div className={styles.column}>{childArray.slice(0, splitPoint)}</div>
            <div className={styles.column}>{childArray.slice(splitPoint)}</div>
        </>
    );
}
export default TwoColumn;
