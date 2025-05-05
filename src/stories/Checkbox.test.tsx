import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('Checkbox 组件', () => {
  // 测试基本渲染
  test('渲染不带标签的复选框', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  // 测试带标签的复选框
  test('渲染带标签的复选框', () => {
    render(<Checkbox label="测试标签" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('测试标签');
    
    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  // 测试默认选中状态
  test('默认选中状态正确', () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  // 测试禁用状态
  test('禁用状态正确', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  // 测试标签位置
  test('标签位置正确', () => {
    const { container } = render(<Checkbox label="左侧标签" labelPlacement="start" />);
    // 注意：这里使用 container 查询是因为 labelPlacement 会影响 DOM 结构
    // 实际测试中可能需要更精确的选择器
    expect(container.firstChild).toHaveTextContent('左侧标签');
  });

  // 测试点击事件
  test('点击触发 onChange 事件', () => {
    const handleChange = vi.fn(); // 使用 vi.fn() 替代 jest.fn()
    render(<Checkbox onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    // 检查回调函数的参数
    expect(handleChange.mock.calls[0][1]).toBe(true);
  });

  // 测试颜色属性
  test('颜色属性正确应用', () => {
    const { container } = render(<Checkbox color="secondary" />);
    // 注意：这里需要检查 DOM 中的类名，具体类名可能需要根据实际情况调整
    const checkboxElement = container.querySelector('.MuiCheckbox-colorSecondary');
    expect(checkboxElement).toBeInTheDocument();
  });

  // 测试尺寸属性
  test('尺寸属性正确应用', () => {
    const { container } = render(<Checkbox size="small" />);
    const checkboxElement = container.querySelector('.MuiCheckbox-sizeSmall');
    expect(checkboxElement).toBeInTheDocument();
  });

  // 测试受控组件行为
  test('作为受控组件正常工作', () => {
    const { rerender } = render(<Checkbox checked={false} />);
    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    rerender(<Checkbox checked={true} />);
    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});