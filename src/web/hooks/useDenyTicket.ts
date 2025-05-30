import { trpc } from "@woco/web/trpc";

export function useDenyTicket() {
    const utils = trpc.useUtils();

    return trpc.tickets.deny.useMutation({
        onSuccess: () => {
            utils.tickets.invalidate(); // Re-fetch tickets after denial
        },
        onError: (err) => {
            console.error("Deny ticket failed:", err);
        },
    });
}
