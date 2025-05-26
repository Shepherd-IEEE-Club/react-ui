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
    image: '',
    postmark: 'Sample Postmark',
    town: 'Sample Town',
    state: 'Sample State',
    date_seen: '2025-05-26',
    size: 'Medium',
    colors: 'Red, Blue',
  },
  onClose: action('onClose'),
};
