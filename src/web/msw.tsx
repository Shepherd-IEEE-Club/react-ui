import React, { useState } from "react";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import { AppRouter } from "@woco/server/appRouter.ts"; // Adjust this import to your project

export const api = createTRPCReact<AppRouter>();

const baseUrl = "http://localhost:3001/trpc"; // Your API base URL

export const TRPCReactProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpLink({
                    url: baseUrl,
                }),
            ],
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={trpcClient} queryClient={queryClient}>
                {children}
            </api.Provider>
        </QueryClientProvider>
    );
};