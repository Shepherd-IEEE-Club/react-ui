import React, { useState } from 'react';
import styled from 'styled-components';
import { trpc } from '@woco/web/trpc';

import { Button, Input } from '@woco/web/pages/style.ts';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
`;

const Card = styled.form`
  width: 28rem;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ErrorMsg = styled.p`
  color: #dc2626;
  text-align: center;
  font-size: 0.9rem;
`;



export function LoginPage() {
    const login = trpc.auth.login.useMutation();
    const me    = trpc.auth.me.useQuery();
    const [email, setEmail]     = useState('');
    const [password, setPass]   = useState('');

    if (me.data) {
        return (
            <Wrapper>
                <h1>Welcome, {me.data.email}!</h1>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Card
                onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        await login.mutateAsync({ email, password });
                        await me.refetch();
                    } catch {

                    }
                }}
            >
                <Title>Log in</Title>

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPass(e.target.value)}
                />

                {login.error && <ErrorMsg>{login.error.message}</ErrorMsg>}

                <Button type="submit" disabled={login.isLoading}>
                    {login.isLoading ? 'Logging in…' : 'Login'}
                </Button>
            </Card>
        </Wrapper>
    );
}
