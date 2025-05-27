// import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Main from './main';
import {Postmark} from "./search";

export default {
  title: 'Components/PostmarkModal',
  component: Main,
  argTypes: {
    postmark: {
      control: 'object',
      description: 'The Postmark data to display in the modal',
    },
    onClose: { action: 'closed', description: 'Callback when close button is clicked' },
  },
} as Meta<typeof Main>;

const Template: Story<{ postmark: Postmark; onClose: () => void }> = (args) => (
    <Main {...args} />
);

export const Default = Template.bind({});
Default.args = {
  postmark: {
    id: 1,
    images: [
      {
        "id": 1,
        "thumbnail": "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"
      },
      {
        "id": 2
      }
    ],
    postmark: 'Sample Postmark',
    town: 'Sample Town',
    state: 'Sample State',
    date_seen: '2025-05-26',
    size: 'Medium',
    colors: 'Red, Blue',
  },
  onClose: action('onClose'),
};
