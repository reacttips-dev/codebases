import * as React from "react";
import { StatelessComponent } from "react";

export interface IBulletProps {
    onClick: any;
    className: string;
}

const Bullet: StatelessComponent<IBulletProps> = ({ onClick, className, children }) => {
    return (
        <div onClick={onClick} className={className}>
            {children}
        </div>
    );
};

export default Bullet;
