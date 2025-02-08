import type { Meta, StoryObj } from '@storybook/react';
import NavigationComponent from '../../view/tabs/NavigationComponent';
import { Box } from '@mui/material';

const meta = {
  title: 'Components/Navigation',
  component: NavigationComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '一个统一的导航组件，支持 Tabs 和 Stepper 两种模式。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['tabs', 'stepper'],
      description: '导航类型'
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '方向'
    },
    activeIndex: {
      control: { type: 'number', min: 0 },
      description: '当前激活的索引'
    },
    items: {
      control: 'object',
      description: '导航项列表'
    },
    contents: {
      control: 'object',
      description: '内容列表'
    }
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 2, maxWidth: '800px', margin: '0 auto' }}>
        <Story />
      </Box>
    )
  ]
} satisfies Meta<typeof NavigationComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// 示例数据
const items = ['第一项', '第二项', '第三项'];
const contents = [
  <div key="1">第一项的内容详情第一项的内容详情第一项的内容详情第一项的内容详情第一项的内容详情第一项的内容详情第一项的内容详情</div>,
  <div key="2">第二项的内容详情第二项的内容详情第二项的内容详情第二项的内容详情第二项的内容详情第二项的内容详情第二项的内容详情</div>,
  <div key="3">第三项的内容详情第三项的内容详情第三项的内容详情第三项的内容详情第三项的内容详情第三项的内容详情第三项的内容详情</div>,
];

// 基础示例
export const Default: Story = {
  args: {
    type: 'tabs',
    items,
    contents,
    orientation: 'horizontal',
    activeIndex: 0
  }
};

// 垂直布局示例
export const VerticalLayout: Story = {
  args: {
    type: 'tabs',
    items,
    contents,
    orientation: 'vertical'
  }
};

// Stepper 模式示例
export const StepperMode: Story = {
  args: {
    type: 'stepper',
    items,
    contents,
    orientation: 'horizontal'
  }
};

// 垂直 Stepper 示例
export const VerticalStepperMode: Story = {
  args: {
    type: 'stepper',
    items,
    contents,
    orientation: 'vertical'
  }
};