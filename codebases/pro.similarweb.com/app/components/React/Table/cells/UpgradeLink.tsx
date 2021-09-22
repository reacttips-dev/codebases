import { i18nFilter } from "filters/ngFilters";
import { ComponentProps, FC } from "react";
import UnlockModalV2Container from "../../UnlockModalContainer/UnlockModalV2Container";

type UnlockModalV2ContainerProps = ComponentProps<typeof UnlockModalV2Container>;

interface IUpgradeLinkProps {
    hookType?: UnlockModalV2ContainerProps["modalConfig"]["trackingSubName"];
}

export const UpgradeLink: FC<IUpgradeLinkProps> = ({ hookType }) => (
    <div className="swTable-content swTable-content--unlock">
        <UnlockModalV2Container
            buttonText={i18nFilter()("grid.upgrade")}
            isLink={true}
            modalConfig={{ featureKey: "GetMoreResults", trackingSubName: hookType }}
        />
    </div>
);
