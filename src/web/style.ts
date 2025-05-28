import styled from 'styled-components';

export const StyledTable = styled.table`
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