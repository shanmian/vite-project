import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

// 更多关于如何配置故事的信息: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Example/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    size: { 
      control: { type: 'select' }, 
      options: ['small', 'medium'] 
    },
    color: { 
      control: { type: 'select' }, 
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'] 
    },
    labelPlacement: { 
      control: { type: 'select' }, 
      options: ['end', 'start', 'top', 'bottom'] 
    },
    onChange: { action: 'changed' }
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础复选框
export const Basic: Story = {
  args: {
    label: '基础复选框',
  },
};

// 默认选中
export const DefaultChecked: Story = {
  args: {
    label: '默认选中',
    defaultChecked: true,
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    label: '禁用状态',
    disabled: true,
  },
};

// 小尺寸
export const Small: Story = {
  args: {
    label: '小尺寸',
    size: 'small',
  },
};

// 不同颜色
export const Colors: Story = {
  args: {
    label: '成功色',
    color: 'success',
    defaultChecked: true,
  },
};

// 标签位置
export const LabelPlacement: Story = {
  args: {
    label: '标签在左侧',
    labelPlacement: 'start',
  },
};

// 无标签
export const NoLabel: Story = {
  args: {},
};