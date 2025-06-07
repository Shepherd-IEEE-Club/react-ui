import React, { createContext, useContext } from "react";

export const TableContext = createContext<{ refresh: () => void }>({
    refresh: () => {},
});

export const useTableContext = () => useContext(TableContext);
