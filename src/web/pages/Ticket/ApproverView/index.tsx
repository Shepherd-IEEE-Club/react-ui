import React, {useState} from "react";
import {trpc} from "@woco/web/trpc";
import type {Ticket} from "@woco/schema/ticket";
import TicketTable, {FilterButtons} from "../table";
import TicketModal from "./modal.tsx";
import DenialReasonModal from "./denialmodal.tsx";
import {PostmarkSchema} from "@woco/schema/postmark";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";

import {useApproveTicket} from "@woco/web/hooks/useApproveTicket.ts";
import {useDenyTicket} from "@woco/web/hooks/useDenyTicket.ts";
import {useModal} from "@woco/web/pages/ModalManager.tsx";

const ApproverView: React.FC = () => {
    const modal = useModal()
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showDenialModal, setShowDenialModal] = useState(false);

    // FIXME: make this more specific
    // TODO: share filtering from search page?
    const {data, isLoading, error} = trpc.tickets.mine.useQuery({
        user_id: 1,
    });

    const tickets = data?.tickets ?? [];
    const postmarks = data?.postmarks ?? {};

    const approve = useApproveTicket();
    const deny = useDenyTicket();

    type status_options = number | "all";
    const [statusFilter, setStatusFilter] = useState<status_options>(1);

    const filteredTickets = tickets.filter((t) => {
        if (statusFilter === "all") return true;
        return t.status_id === statusFilter;
    });

    const statusButtons: { label: string; value: status_options }[] = [
        {label: "Pending", value: 1},
        {label: "Approved", value: 2},
        {label: "Rejected", value: 3},
        {label: "All", value: "all"},
    ];


    return (
        <div style={{width: "100%", height: "100%", overflowY: "auto"}}>

            <FilterButtons
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusButtons}
            />


            <TicketTable
                tickets={filteredTickets}
                postmarks={postmarks}
                onRowClick={(ticket) => {
                    const postmark = PostmarkSchema.parse(postmarks[ticket.postmark_id]);
                    modal.push(
                        <TicketModal
                            ticket={ticket}
                            postmark={postmark}
                        />
                    );
                }}
                loading={isLoading}
            />

        </div>
    );
};

export default ApproverView;
