import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerField } from './DatePickerField';
import dayjs from 'dayjs';
import React, { useState } from 'react';

const meta = {
  title: 'Components/DatePickerField',
  component: DatePickerField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    field: {
      control: 'text',
      description: '字段名称',
    },
    value: {
      control: 'date',
      description: '日期值',
    },
    onChange: {
      description: '日期变化回调函数',
    },
  },
} satisfies Meta<typeof DatePickerField>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Basic: React.FC = () => {
  const [date, setDate] = useState(null);
  
  return (
    <DatePickerField
      field="date"
      value={date}
      onChange={(field, value) => {
        setDate(value);
        console.log('Date changed:', { field, value: value ? dayjs(value).format('YYYY-MM-DD') : null });
      }}
    />
  );
};

// 带默认值的示例
export const WithValue: React.FC = () => {
  const [date, setDate] = useState(dayjs('2024-01-25'));
  
  return (
    <DatePickerField
      field="date"
      value={date}
      onChange={(field, value) => {
        setDate(value);
        console.log('Date changed:', { field, value: value ? dayjs(value).format('YYYY-MM-DD') : null });
      }}
    />
  );
};

// 演示清除功能的示例
export const WithClearButton: React.FC = () => {
  const [date, setDate] = useState(dayjs('2024-01-25'));
  
  return (
    <DatePickerField
      field="date"
      value={date}
      onChange={(field, value) => {
        setDate(value);
        console.log('Date changed or cleared:', { field, value: value ? dayjs(value).format('YYYY-MM-DD') : null });
      }}
    />
  );
};