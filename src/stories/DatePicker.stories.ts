import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';
import dayjs from 'dayjs';

// 更多关于如何配置故事的信息: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Example/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { 
      control: 'date',
      description: '日期选择器的值'
    },
    defaultValue: { 
      control: 'date',
      description: '默认日期值'
    },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    format: { control: 'text' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    size: { 
      control: { type: 'select' }, 
      options: ['small', 'medium'] 
    },
    showTodayButton: { control: 'boolean' },
    disableFuture: { control: 'boolean' },
    disablePast: { control: 'boolean' },
    views: {
      control: { type: 'multi-select' },
      options: ['day', 'month', 'year'],
      description: '可见的日期视图'
    },
    openTo: {
      control: { type: 'select' },
      options: ['day', 'month', 'year'],
      description: '默认打开的视图'
    },
    orientation: {
      control: { type: 'select' },
      options: ['portrait', 'landscape'],
      description: '日历方向'
    },
    onChange: { action: 'changed' }
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础日期选择器
export const Basic: Story = {
  args: {
    label: '选择日期',
  },
};

// 默认值
export const WithDefaultValue: Story = {
  args: {
    label: '默认日期',
    defaultValue: dayjs(),
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    label: '禁用状态',
    disabled: true,
  },
};

// 只读状态
export const ReadOnly: Story = {
  args: {
    label: '只读状态',
    readOnly: true,
    defaultValue: dayjs(),
  },
};

// 错误状态
export const Error: Story = {
  args: {
    label: '错误状态',
    error: true,
    helperText: '请选择有效日期',
  },
};

// 自定义格式
export const CustomFormat: Story = {
  args: {
    label: '自定义格式',
    format: 'YYYY年MM月DD日',
  },
};

// 日期范围限制
export const DateRange: Story = {
  args: {
    label: '日期范围限制',
    minDate: dayjs().subtract(7, 'day'),
    maxDate: dayjs().add(7, 'day'),
  },
};

// 小尺寸
export const Small: Story = {
  args: {
    label: '小尺寸',
    size: 'small',
  },
};

// 禁用未来日期
export const DisableFuture: Story = {
  args: {
    label: '禁用未来日期',
    disableFuture: true,
  },
};

// 禁用过去日期
export const DisablePast: Story = {
  args: {
    label: '禁用过去日期',
    disablePast: true,
  },
};

// 必填
export const Required: Story = {
  args: {
    label: '必填字段',
    required: true,
  },
};

// 年月视图
export const YearMonthView: Story = {
  args: {
    label: '选择年月',
    views: ['month', 'year'],
    openTo: 'month',
  },
};

// 横向布局
export const LandscapeOrientation: Story = {
  args: {
    label: '横向布局',
    orientation: 'landscape',
  },
};