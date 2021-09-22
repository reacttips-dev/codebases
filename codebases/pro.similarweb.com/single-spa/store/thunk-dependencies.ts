import { SalesIntelligenceThunkDeps } from "pages/sales-intelligence/types";
import siThunkDependencies from "pages/sales-intelligence/store/thunk-dependencies";

export type ThunkDependencies = {
    si: SalesIntelligenceThunkDeps;
};

const thunkDependencies: ThunkDependencies = {
    si: siThunkDependencies,
};

export default thunkDependencies;
