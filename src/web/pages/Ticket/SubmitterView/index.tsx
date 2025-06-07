import React, {useState} from "react";
import {trpc} from "@woco/web/trpc";
import type {Ticket} from "@woco/schema/ticket";
import TicketTable, {FilterButtons} from "../table";
import TicketModal from "./modal.tsx"; // ✅ correct
import {PostmarkSchema} from "@woco/schema/postmark.ts";
import Detail from "@woco/web/pages/Ticket/Detail.tsx";

import {TICKET_STATUS_LABELS} from "@woco/web/constants.ts";
import {useModal} from "@woco/web/pages/ModalManager.tsx";

const SubmitterView: React.FC = () => {
    const modal = useModal();


    const {data, isLoading, error} = trpc.tickets.mine.useQuery({
        user_id: 1,
        limit: 10000,
    });

    // FIXME should blow up
    // I forgot what i meant by that
    const tickets = data?.tickets ?? [];
    const postmarks = data?.postmarks ?? {};


    type status_options = number | "all";
    const [statusFilter, setStatusFilter] = useState<status_options>('all');

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

export default SubmitterView;
