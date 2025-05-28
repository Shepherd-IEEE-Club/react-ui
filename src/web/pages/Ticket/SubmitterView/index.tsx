import React, { useState } from "react";
import { trpc } from "@woco/web/trpc";
import type { Ticket } from "@woco/schema/ticket";
import TicketTable from "./table";

const SubmitterView: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const { data, isLoading, error } = trpc.tickets.mine.useQuery({
        user_id: 1,       // ✅ required
        limit: 10000,     // ✅ high limit to get everything
    });

    // FIXME should blow up
    const tickets = data?.tickets ?? [];
    const postmarks = data?.postmarks ?? [];

    return (
        <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <TicketTable
                tickets={tickets}
                postmarks={postmarks}
                onRowClick={setSelectedTicket}
                loading={isLoading}
            />

            {/* {selectedTicket && (
                <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
            )} */}

            {error && <p style={{ color: "red" }}>{(error as Error).message}</p>}
        </div>
    );
};

export default SubmitterView;
