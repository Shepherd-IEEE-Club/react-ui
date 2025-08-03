import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { LoginPage } from './index';
import { trpc } from '@woco/web/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a wrapper to provide necessary context
const queryClient = new QueryClient();

const meta: Meta<typeof LoginPage> = {
    title: 'Pages/LoginPage',
    component: LoginPage,
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <Story />
            </QueryClientProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof LoginPage>;

// 👉 Story: Default (no user logged in)
export const Default: Story = {};

// // 👉 Story: Logged In (me query returns a user)
// export const LoggedIn: Story = {
//     parameters: {
//         msw: {
//             handlers: [
//                 trpc.auth.me.useQuery(() => ({
//                     id: 1,
//                     email: 'alice@example.com',
//                 })),
//             ],
//         },
//     },
// };
//
// // 👉 Story: Login Error (simulate wrong credentials)
// export const LoginError: Story = {
//     parameters: {
//         msw: {
//             handlers: [
//                 trpc.auth.login.mutation(() => {
//                     throw new Error('Invalid credentials');
//                 }),
//                 trpc.auth.me.query(() => null),
//             ],
//         },
//     },
// };
