import { createContext } from "react";
import { TechnologiesFilterContextType } from "../filters/technology/types";

const TechnologiesFilterContext = createContext<TechnologiesFilterContextType>(null);

export default TechnologiesFilterContext;
