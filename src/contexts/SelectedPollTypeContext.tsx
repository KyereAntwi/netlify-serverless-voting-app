import type {PollType} from "../models/types.ts";
import {createContext, type ReactNode, useContext, useState} from "react";

interface SelectedPollTypeContextType {
    value: PollType;
    setValue: (val: PollType) => void;
}

const SelectedPollTypeContext = createContext<SelectedPollTypeContextType | undefined>(undefined);

export const SelectedPollTypeProvider = ({children} : {children: ReactNode}) => {
    const [value, setValue] = useState<PollType>("OpenBasic");
    
    return(
        <SelectedPollTypeContext.Provider value={{ value, setValue }}>
            {children}
        </SelectedPollTypeContext.Provider>
    )
}

export const useSelectedPollTypeContext = () => {
    const context = useContext(SelectedPollTypeContext);
    if (!context) throw new Error("useSelectedPollTypeContext must be used as useSelectedPollTypeContext");
    return context;
}