import type { Meta, StoryObj } from '@storybook/react';
import { DatePickerField } from './DatePickerField';
import dayjs from 'dayjs';
import { Box } from '@mui/material';

// 更多关于如何配置故事的信息: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
    title: 'Example/DatePickerField',
    component: DatePickerField,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        field: { 
          control: 'text',
          description: '字段名称'
        },
        value: { 
          control: 'date',
          description: '日期值'
        },
        onChange: { 
          action: 'changed',
          description: '日期变化回调'
        }
      },
    
  } satisfies Meta<typeof DatePickerField>;
  
  export default meta;
  type Story = StoryObj<typeof meta>;

// 基础日期选择器字段
export const Basic: Story = {
  args: {
    field: 'date',
    value: null,
    onChange: (field, date) => console.log(field, date)
  },
};

// 带默认值的日期选择器字段
export const WithValue: Story = {
  args: {
    field: 'date',
    value: dayjs(),
    onChange: (field, date) => console.log(field, date)
  },
};

// 自定义日期选择器字段
export const CustomField: Story = {
  args: {
    field: 'birthday',
    value: dayjs('2000-01-01'),
    onChange: (field, date) => console.log(field, date)
  },
};