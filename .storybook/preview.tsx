// .storybook/preview.tsx
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { TRPCReactProvider } from '@woco/web/msw.tsx';
import { ModalManager } from "@woco/web/pages/ModalManager.tsx";
initialize();

const preview: Preview = {
    loaders: [mswLoader],
    decorators: [
        withThemeByDataAttribute({
            defaultTheme: 'light',
            themes: { light: 'light', dark: 'dark' },
            attributeName: 'data-mode',
        }),
        (Story) => (
            <TRPCReactProvider>
                <ModalManager>
                    <Story />
                </ModalManager>
            </TRPCReactProvider>
        ),
    ],
    parameters: { /* your controls/etc here */ },
};

export default preview;
