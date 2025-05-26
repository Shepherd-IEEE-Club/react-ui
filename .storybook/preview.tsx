// .storybook/preview.tsx
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { TRPCReactProvider } from '@woco/web/msw';

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
                <Story />
            </TRPCReactProvider>
        ),
    ],
    parameters: { /* your controls/etc here */ },
};

export default preview;
