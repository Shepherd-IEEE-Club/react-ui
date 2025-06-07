import React, {useState, createContext, useContext, useEffect} from 'react';
import styled from "styled-components";


// for external use
export let modalManager: {
    push: (view: React.ReactNode) => void;
    pop: () => void;
    clear: () => void;
} = {
    push: () => {
        throw new Error("modalManager not initialized");
    },
    pop: () => {},
    clear: () => {},
};



// TODO old way
const ModalManagerContext = createContext<{
    push: (view: React.ReactNode) => void;
    pop: () => void;
    clear: () => void;
}>({
    push: () => {
    }, pop: () => {
    }, clear: () => {
    }
});
//
// export const useModal = () => {
//     const ctx = useContext(ModalManagerContext);
//     console.log("fortnite")
//     if (!ctx || ctx.push === undefined) {
//         throw new Error("useModal must be used within a <ModalManager />");
//     }
//     return ctx;
// };


const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;


export const ModalManagerWrapper: React.FC<{ children?: React.ReactNode }> = ({children}) => {


    const [stack, setStack] = useState<React.ReactNode[]>([]);

    const push = (view: React.ReactNode) => {
        console.log("[ModalManager] Modal created:", view);
        setStack((s) => [...s, view]);
    };

    const pop = () => setStack((s) => s.slice(0, -1));
    const clear = () => setStack([]);

    const top = stack[stack.length - 1];


    // set modal manager accessor bob thingy context
    useEffect(() => {
        modalManager.push = push;
        modalManager.pop = pop;
        modalManager.clear = clear;
    }, []);



    // Pop top upon escape key
    // The design is very human
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") pop();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [pop]);

    return (
        <ModalManagerContext.Provider value={{push, pop, clear}}>
            {children}
            {top && (
                <Overlay onClick={pop}>
                    <div onClick={(e) => e.stopPropagation()}>
                        {top}
                    </div>
                </Overlay>
            )}
        </ModalManagerContext.Provider>
    );
};
