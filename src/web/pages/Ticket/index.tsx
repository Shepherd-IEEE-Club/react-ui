import React from "react";
import styled from "styled-components";
import SubmitterView from "./SubmitterView";
import ApproverView from "./ApproverView";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const TabButton = styled.button<{ $active: boolean }>`
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: ${({ $active }) => ($active ? "#007bff" : "#f0f0f0")};
    color: ${({ $active }) => ($active ? "white" : "black")};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: ${({ $active }) => ($active ? "#0056b3" : "#e0e0e0")};
    }
`;
const TicketsPage: React.FC = () => {
    const [view, setView] = React.useState<"submitter" | "approver">("submitter");

    return (
        <PageContainer>
            <h2>Tickets</h2>
            <Tabs>
                <TabButton $active={view === "submitter"} onClick={() => setView("submitter")}>My Tickets</TabButton>
                <TabButton $active={view === "approver"} onClick={() => setView("approver")}>Review Tickets</TabButton>

            </Tabs>
            {view === "submitter" ? <SubmitterView /> : <ApproverView />}
        </PageContainer>
    );
};

export default TicketsPage;
