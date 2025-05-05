import type { Meta, StoryObj } from '@storybook/react';
import { TextareaAutosize } from './TextareaAutosize';

// 更多关于如何配置故事的信息: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Example/TextareaAutosize',
  component: TextareaAutosize,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    minRows: { control: { type: 'number', min: 1, max: 20 } },
    maxRows: { control: { type: 'number', min: 1, max: 50 } },
    maxLength: { control: { type: 'number', min: 1 } },
    showCount: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    onChange: { action: 'changed' },
    onBlur: { action: 'blurred' },
    onFocus: { action: 'focused' },
  },
} satisfies Meta<typeof TextareaAutosize>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础文本框
export const Basic: Story = {
  args: {
    placeholder: '请输入内容...',
    minRows: 3,
  },
};

// 默认值
export const WithDefaultValue: Story = {
  args: {
    defaultValue: '这是一段默认文本，可以自动调整高度。',
    minRows: 3,
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    defaultValue: '禁用状态的文本框',
    disabled: true,
  },
};

// 只读状态
export const ReadOnly: Story = {
  args: {
    defaultValue: '只读状态的文本框',
    readOnly: true,
  },
};

// 字符计数
export const WithCharCount: Story = {
  args: {
    placeholder: '带字符计数的文本框...',
    showCount: true,
  },
};

// 最大字符数
export const WithMaxLength: Story = {
  args: {
    placeholder: '最多输入100个字符...',
    maxLength: 100,
    showCount: true,
  },
};

// 错误状态
export const Error: Story = {
  args: {
    defaultValue: '错误状态的文本框',
    error: true,
    helperText: '输入内容有误',
  },
};

// 帮助文本
export const WithHelperText: Story = {
  args: {
    placeholder: '请输入您的反馈...',
    helperText: '您的反馈将帮助我们改进产品',
  },
};

// 必填
export const Required: Story = {
  args: {
    placeholder: '必填字段',
    required: true,
  },
};

// 自定义行数
export const CustomRows: Story = {
  args: {
    placeholder: '自定义最小和最大行数',
    minRows: 2,
    maxRows: 6,
  },
};