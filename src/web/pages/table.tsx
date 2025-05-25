import React from 'react';
import styled from 'styled-components';

interface Postmark {
    id: number;
    image: string;
    postmark: string;
    town: string;
    state: string;
    date_seen?: string;
}

interface PostmarksTableProps {
    postmarks: Postmark[];
    onRowClick: (postmark: Postmark) => void;
    query: { startYear?: number; endYear?: number };
}

const StyledTable = styled.table`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    th, td {
        border: 1px solid #ddd;
        padding: 0.75rem 1rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    thead th {
        position: sticky;
        top: 0;
        background-color: #f4f4f4;
    }

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #f1f1f1;
        cursor: pointer;
    }
`;

const Image = styled.img`
    max-width: 80px;
    max-height: 80px;
    border-radius: 4px;
`;

//FIXME scroll to load +query +filter makes this non-trivial and a can of worms. a lot needs to be redone here

const PostmarksTable: React.FC<PostmarksTableProps> = ({ postmarks, onRowClick, query }) => {
    // const filteredPostmarks = postmarks.filter(pm => {
    //     // if (!pm.date_seen) return true;
    //     // const year = new Date(pm.date_seen).getFullYear();
    //     return query;
    //     // return (!query.startYear || year >= query.startYear) &&
    //     //     (!query.endYear || year <= query.endYear);
    // });
    const filteredPostmarks = postmarks;
    // FIXME filtering not working


    return (
        <StyledTable>
            <thead>
            <tr>
                <th>Image</th>
                <th>Postmark</th>
                <th>Town</th>
                <th>State</th>
                <th>Date Seen</th>
            </tr>
            </thead>
            <tbody>
            {filteredPostmarks.map(pm => (
                <tr key={pm.id} onClick={() => onRowClick(pm)}>
                    <td><Image src={`data:image/jpeg;base64,${pm.image}`} alt={pm.postmark} /></td>
                    <td>{pm.postmark}</td>
                    <td>{pm.town}</td>
                    <td>{pm.state}</td>
                    <td>{pm.date_seen || 'N/A'}</td>
                </tr>
            ))}
            </tbody>
        </StyledTable>
    );
};

export default PostmarksTable;
