import React, {useState} from "react";
import {trpc} from "@woco/web/trpc";
import type {Ticket} from "@woco/schema/ticket";
import TicketTable from "../table";
import TicketModal from "./modal.tsx";
import DenialReasonModal from "./denialmodal.tsx";
import {PostmarkSchema} from "@woco/schema/postmark";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";

import {useApproveTicket} from "@woco/web/hooks/useApproveTicket.ts";
import {useDenyTicket} from "@woco/web/hooks/useDenyTicket.ts";

const ApproverView: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showDenialModal, setShowDenialModal] = useState(false);

    // FIXME: make this more specific
    // TODO: share filtering from search page?
    const {data, isLoading, error} = trpc.tickets.mine.useQuery({
        user_id: 1,
    });

    const tickets = data?.tickets ?? [];
    const postmarks = data?.postmarks ?? {};

    const {data: images} = trpc.tickets.images.useQuery(
        {ticket: selectedTicket!},
        {enabled: !!selectedTicket}
    );

    const approve = useApproveTicket();
    const deny = useDenyTicket();

    return (
        <div style={{width: "100%", height: "100%", overflowY: "auto"}}>
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
                    onApprove={() => {
                        approve.mutate({ticket_id: selectedTicket.id});
                        setSelectedTicket(null);
                    }}
                    onDeny={() => {
                        setShowDenialModal(true);
                    }}
                />
            )}

            {showDenialModal && selectedTicket && (
                <DenialReasonModal
                    ticket={selectedTicket}
                    onClose={() => setShowDenialModal(false)}
                    onSubmit={
                        (updatedTicket) => {
                            deny.mutate(updatedTicket);
                        }
                    }

                />
            )}
        </div>
    );
};

export default ApproverView;
