import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
interface IKeywordsList extends ITableCellProps {
    getLink?: (value: string) => string;
}

export const KeywordsList: StatelessComponent<IKeywordsList> = ({
    row,
    field,
    getLink,
    showTotalCount,
}) => {
    const { [field]: words = [] } = row;
    if (words[0] === "grid.upgrade") {
        return null;
    } else {
        return (
            <div className="keywords-container">
                {showTotalCount && <b>{`${words.length} keywords:`}</b>}
                {getLink
                    ? words
                          .map((word) => {
                              return (
                                  <a key={word} href={getLink(word)}>
                                      {word}
                                  </a>
                              );
                          })
                          .reduce((prev, curr) => [prev, " | ", curr])
                    : words.join(" | ")}
            </div>
        );
    }
};
KeywordsList.displayName = "KeywordsList";
