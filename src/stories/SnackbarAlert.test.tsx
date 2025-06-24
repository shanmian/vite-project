import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnackbarAlert } from './SnackbarAlert';
import { describe, expect, test, vi } from 'vitest';

describe('SnackbarAlert', () => {
  // 测试组件渲染
  test('renders the component with message', () => {
    const handleClose = vi.fn();
    render(
      <SnackbarAlert 
        open={true} 
        onClose={handleClose} 
        message="Test Message" 
      />
    );
    
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  // 测试关闭按钮点击
  test('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <SnackbarAlert 
        open={true} 
        onClose={handleClose} 
        message="Test Message" 
      />
    );
    
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试不同的severity
  test('renders with different severity levels', () => {
    const { rerender } = render(
      <SnackbarAlert 
        open={true} 
        onClose={() => {}} 
        message="Success Message" 
        severity="success"
      />
    );
    
    expect(screen.getByText('Success Message')).toBeInTheDocument();
    
    rerender(
      <SnackbarAlert 
        open={true} 
        onClose={() => {}} 
        message="Error Message" 
        severity="error"
      />
    );
    
    expect(screen.getByText('Error Message')).toBeInTheDocument();
  });

  // 测试不显示关闭按钮
  test('does not show close button when showCloseButton is false', () => {
    render(
      <SnackbarAlert 
        open={true} 
        onClose={() => {}} 
        message="No Close Button" 
        showCloseButton={false}
      />
    );
    
    expect(screen.queryByLabelText('close')).not.toBeInTheDocument();
  });

  // 测试自动关闭功能
  test('calls onClose after autoHideDuration', async () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    
    render(
      <SnackbarAlert
        open={true}
        onClose={handleClose}
        message="Auto Hide"
        autoHideDuration={1000}
      />
    );
    
    await vi.runAllTimersAsync();
    expect(handleClose).toHaveBeenCalledTimes(1);
    // await waitFor(() => {
    //   expect(handleClose).toHaveBeenCalledTimes(1);
    // }, {
    //   timeout: 1000 // 设置更短的超时时间
    // });
    
    vi.useRealTimers();
  });
});