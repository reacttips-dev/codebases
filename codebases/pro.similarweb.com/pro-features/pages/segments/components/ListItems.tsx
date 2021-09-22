import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";

const ListItemSegmentTextWrapper = styled.div`
    .list-item-segment-domain {
        font-size: 14px;
        line-height: 16px;
    }

    .list-item-segment-name {
        font-size: 12px;
        line-height: 14px;
        color: ${colorsPalettes.carbon["300"]};
    }
`;

export const ListItemSegment: React.FC<any> = ({
    onClick,
    isActive,
    className,
    img,
    domain,
    name,
}) => (
    <ListItemWebsite
        onClick={onClick}
        isActive={isActive}
        className={className}
        img={img}
        // @ts-ignore [text prop is used as node and not just a string]
        text={
            <ListItemSegmentTextWrapper>
                <div className="list-item-segment-domain">{domain}</div>
                {name && <div className="list-item-segment-name">{name}</div>}
            </ListItemSegmentTextWrapper>
        }
    />
);
