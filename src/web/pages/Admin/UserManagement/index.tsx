import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { trpc } from '@woco/web/trpc';

const Container = styled.div`
  width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.75rem;
  color: #333;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.65rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  padding: 0.6rem 1rem;
  background: #28a745;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: #218838; }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 48rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  font-size: 0.9rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 0.65rem 1rem;
  border-bottom: 1px solid #f1f3f5;
  font-size: 0.9rem;
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
  padding: 0.35rem 0.75rem;
  margin-left: 0.4rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #fff;
  background: ${({ danger }) => (danger ? '#dc3545' : '#007bff')};
  cursor: pointer;
  &:hover {
    background: ${({ danger }) => (danger ? '#c82333' : '#0056b3')};
  }
`;

const EmptyState = styled.p`
  text-align: center;
  padding: 2rem 0;
  color: #666;
`;

/* ─────────── Component ─────────── */

export function AdminUserManagement() {
    // tRPC hooks
    const { data: users, isLoading } = trpc.admin.users.list.useQuery();
    const deleteUser = trpc.admin.users.delete.useMutation();
    const promote    = trpc.admin.users.promote.useMutation();

    // local search filter
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!users) return [];
        const q = search.trim().toLowerCase();
        return users.filter(
            ({ email, name }) =>
                email.toLowerCase().includes(q) || name?.toLowerCase().includes(q)
        );
    }, [users, search]);

    /* Handlers */
    async function handleDelete(id: number) {
        if (!confirm('Delete this user?')) return;
        await deleteUser.mutateAsync({ id });
    }

    async function handlePromote(id: number) {
        await promote.mutateAsync({ id });
    }

    /* ─── UI ─── */
    return (
        <Container>
            <Title>User Management</Title>

    <SearchRow>
    <SearchInput
        placeholder="Search by name or email…"
    value={search}
    onChange={e => setSearch(e.target.value)}
    />
    <AddButton onClick={() => alert('TODO: open create-user modal')}>
    + New User
    </AddButton>
    </SearchRow>

    <TableWrap>
    {isLoading ? (
            <EmptyState>Loading users…</EmptyState>
) : filtered.length === 0 ? (
        <EmptyState>No users found.</EmptyState>
) : (
        <Table>
            <thead>
                <tr>
                    <Th>ID</Th>
        <Th>Name</Th>
        <Th>Email</Th>
        <Th>Role</Th>
        <Th style={{ width: '12rem' }}>Actions</Th>
    </tr>
    </thead>
    <tbody>
    {filtered.map(u => (
            <tr key={u.id}>
            <Td>{u.id}</Td>
            <Td>{u.name ?? '—'}</Td>
            <Td>{u.email}</Td>
            <Td>{u.role}</Td>
            <Td>
            <ActionBtn onClick={() => handlePromote(u.id)}>
    {u.role === 'admin' ? 'Demote' : 'Promote'}
    </ActionBtn>
    <ActionBtn danger onClick={() => handleDelete(u.id)}>
    Delete
    </ActionBtn>
    </Td>
    </tr>
))}
    </tbody>
    </Table>
)}
    </TableWrap>
    </Container>
);
}
