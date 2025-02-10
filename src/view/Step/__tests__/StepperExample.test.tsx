import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material';
import StepperExample from '../StepperExample';
import { StepperProvider } from '../StepperContext';

const theme = createTheme();

// 模拟提交函数
vi.mock('../StepperContext', async () => {
  const actual = await vi.importActual('../StepperContext');
  return {
    ...actual,
    submitForm: vi.fn().mockResolvedValue(true),
  };
});

describe('StepperExample 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <ThemeProvider theme={theme}>
        <StepperProvider>
          <StepperExample />
        </StepperProvider>
      </ThemeProvider>
    );
  });

  test('应该正确渲染初始步骤', () => {
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /姓名/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /电话/i })).toBeInTheDocument();
  });

  test('表单验证功能', async () => {
    const user = userEvent.setup();
    const nextButton = screen.getByRole('button', { name: /下一步/i });
    
    expect(nextButton).toBeDisabled();

    const nameInput = screen.getByRole('textbox', { name: /姓名/i });
    const phoneInput = screen.getByRole('textbox', { name: /电话/i });

    await user.type(nameInput, 'John Doe');
    await user.type(phoneInput, '13800138000');

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });

  test('步骤导航功能', async () => {
    const user = userEvent.setup();
    
    const nameInput = screen.getByRole('textbox', { name: /姓名/i });
    const phoneInput = screen.getByRole('textbox', { name: /电话/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(phoneInput, '13800138000');
    
    const nextButton = screen.getByRole('button', { name: /下一步/i });
    await waitFor(() => expect(nextButton).not.toBeDisabled());
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /邮箱/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /地址/i })).toBeInTheDocument();
    });
  });

  test('步骤点击导航功能', async () => {
    const user = userEvent.setup();
    
    const nameInput = screen.getByRole('textbox', { name: /姓名/i });
    const phoneInput = screen.getByRole('textbox', { name: /电话/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(phoneInput, '13800138000');

    await waitFor(() => {
      const stepTwo = screen.getByText('联系方式');
      expect(stepTwo).toBeInTheDocument();
      fireEvent.click(stepTwo);
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /邮箱/i })).toBeInTheDocument();
    });
  });
});