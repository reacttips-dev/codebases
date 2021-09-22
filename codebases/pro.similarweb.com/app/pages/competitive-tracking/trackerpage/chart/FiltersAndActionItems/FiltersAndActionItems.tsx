import { GraphTypeSwitcher } from "./GraphTypeSwitcher";
import { FiltersAndActionItemsContainer } from "./styled";

export const FiltersAndActionItems = () => {
    return (
        <FiltersAndActionItemsContainer>
            <GraphTypeSwitcher />
        </FiltersAndActionItemsContainer>
    );
};
