// @woco/web/context/TableProvider.tsx
import React, {useState, useEffect} from "react";
import {TableContext} from "./TableContext";
import {trpc} from "@woco/web/trpc";

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {refetch} = trpc.tickets.mine.useQuery({
        user_id: 1,
        limit: 10000,
    });

    return (
        <TableContext.Provider value={{refresh: () => refetch()}}>
            {children}
        </TableContext.Provider>
    );
};
