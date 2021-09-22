import { DomainsChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";

export const DomainsFilter = (props) => {
    const { onDomainFilterChange, selectedDomain, domains } = props;
    const selectedDomainObject = domains.find((x) => x.name === selectedDomain) || domains[0];

    return (
        <DomainsChipDownContainer
            onClick={onDomainFilterChange}
            selectedIds={{ [selectedDomainObject.name]: true }}
            selectedDomainText={selectedDomainObject.displayName}
            selectedDomainIcon={selectedDomainObject.icon}
            onCloseItem={() => onDomainFilterChange(null)}
            buttonText={null}
        >
            {domains.map((item, index) => {
                const { name, displayName, icon } = item;
                return (
                    <ListItemWebsite key={index} text={name} img={icon}>
                        {displayName}
                    </ListItemWebsite>
                );
            })}
        </DomainsChipDownContainer>
    );
};
