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
    docs: {
      description: {
        component: '多步骤表单组件，支持数据验证和表单提交功能。'
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <StepperProvider>
          <div style={{ width: '600px', padding: '20px' }}>
            <Story />
          </div>
        </StepperProvider>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StepperExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础用法
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '基础的多步骤表单示例，包含三个步骤。'
      }
    }
  }
};

// 预填充数据
export const WithPrefilledData: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '展示带有预填充数据的表单。'
      }
    },
    initialState: {
      data: {
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
        company: '示例科技有限公司',
        remark: '这是一条备注信息'
      }
    }
  }
};

// 完成状态
export const CompletedForm: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '展示表单完成状态。'
      }
    },
    initialState: {
      data: {
        name: '李四',
        phone: '13900139000',
        email: 'lisi@example.com',
        address: '上海市浦东新区',
        company: '示例公司',
        remark: '备注信息'
      },
      isCompleted: true,
      currentStep: 2
    }
  }
};

// 验证失败状态
export const ValidationError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '展示表单验证失败的状态。'
      }
    },
    initialState: {
      data: {
        name: '',
        phone: '138',
        email: 'invalid-email'
      },
      currentStep: 0,
      isValid: false
    }
  }
};

// 自定义主题
export const CustomTheme: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ThemeProvider theme={createTheme({
        palette: {
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      })}>
        <StepperProvider>
          <div style={{ width: '600px', padding: '20px' }}>
            <Story />
          </div>
        </StepperProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '使用自定义主题的表单示例。'
      }
    }
  }
};