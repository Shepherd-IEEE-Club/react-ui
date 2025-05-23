// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@chromatic-com/storybook',
        '@storybook/experimental-addon-test'
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {}
    },
    typescript: {
        // turn off type-checking for faster reloads; remove or set to `true` to enable
        check: false,
        reactDocgen: 'none'
    }
};

export default config;
