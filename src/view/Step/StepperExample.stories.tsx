import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material';
import StepperExample from './StepperExample';
import { StepperProvider } from './StepperContext';

const theme = createTheme();

const meta = {
  title: 'Components/StepperExample',
  component: StepperExample,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <StepperProvider>
          <Story />
        </StepperProvider>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StepperExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPrefilledData: Story = {
  args: {},
  parameters: {
    initialState: {
      data: {
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
      },
    },
  },
};

export const CompletedForm: Story = {
  args: {},
  parameters: {
    initialState: {
      data: {
        name: '李四',
        phone: '13900139000',
        email: 'lisi@example.com',
        address: '上海市浦东新区',
        company: '示例公司',
        remark: '这是一条备注信息',
      },
      isCompleted: true,
    },
  },
};