import React, { useState } from "react";
import { trpc } from "@woco/web/trpc";
import type { Ticket } from "@woco/schema/ticket";
import TicketTable from "../table";
import TicketModal from "./modal.tsx";
import { PostmarkSchema } from "@woco/schema/postmark";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";

const ApproverView: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const { data, isLoading, error } = trpc.tickets.mine.useQuery({
        user_id: 1,
    });

    const tickets = data?.tickets ?? [];
    const postmarks = data?.postmarks ?? {};

    const { data: images } = trpc.tickets.images.useQuery(
        { ticket: selectedTicket! },
        { enabled: !!selectedTicket }
    );

    return (
        <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
            <TicketTable
                tickets={tickets}
                postmarks={postmarks}
                onRowClick={setSelectedTicket}
                loading={isLoading}
            />

            {selectedTicket && (
                <TicketModal
                    detail={
                        <Detail
                            ticket={selectedTicket}
                            postmark={PostmarkSchema.parse(postmarks[selectedTicket.postmark_id])}
                            images={images ?? {}}
                        />
                    }
                    onClose={() => setSelectedTicket(null)}
                    onApprove={() => approveTicket(selectedTicket.id)}
                    onDeny={() => denyTicket(selectedTicket.id)}
                />
            )}


            {error && <p style={{ color: "red" }}>{(error as Error).message}</p>}
        </div>
    );
};

export default ApproverView;
