import { trpc } from "@woco/web/trpc";

export function useApproveTicket() {
    const utils = trpc.useUtils();

    return trpc.tickets.approve.useMutation({
        onSuccess: () => {
            utils.tickets.invalidate(); // Re-fetch tickets after approving
        },
        onError: (err) => {
            console.error("Approve ticket failed:", err);
        },
    });
}
