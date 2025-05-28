import React from 'react';
import styled from 'styled-components';


import {StyledTable} from '@woco/web/style.ts'
import type {Postmark} from "@woco/schema/postmark.ts";

interface PostmarksTableProps {
    postmarks: Postmark[],
    onRowClick: (postmark: Postmark) => void,
    query: { startYear?: number; endYear?: number },
    loading: boolean
}

const Image = styled.img`
    max-width: 80px;
    max-height: 80px;
    border-radius: 4px;
`;

//FIXME back to top button

const PostmarksTable: React.FC<PostmarksTableProps> = ({postmarks, onRowClick, query, loading}) => {
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
                    {/*FIXME do without mutating?*/}
                    <td><Image src={`data:image/jpeg;base64,${pm.images?.[0]?.thumbnail}`} alt={pm.postmark}/></td>
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
