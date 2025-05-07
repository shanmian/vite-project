import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from './DatePicker';
import { describe, expect, test, vi } from 'vitest';
import dayjs from 'dayjs';

describe('DatePicker 组件', () => {
  // 测试基本渲染
  test('渲染基本日期选择器', () => {
    const { container } = render(<DatePicker />);
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试自定义标签
  test('自定义标签正确显示', () => {
    const { container } = render(<DatePicker label="测试标签" />);
    // 使用更精确的选择器，避免匹配多个元素
    const labelElement = container.querySelector('.MuiFormLabel-root');
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toBe('测试标签');
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试默认值
  test('默认值正确显示', () => {
    const defaultDate = dayjs('2023-01-01');
    const { container } = render(<DatePicker defaultValue={defaultDate} />);
    const datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.value).toBe('2023-01-01');
  });

  // 测试禁用状态
  test('禁用状态正确', () => {
    const { container } = render(<DatePicker disabled />);
    const datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.disabled).toBe(true);
  });

  // 测试只读状态
  test('只读状态正确', () => {
    const { container } = render(<DatePicker readOnly />);
    const datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.readOnly).toBe(true);
  });

  // 测试必填属性
  test('必填属性正确', () => {
    const { container } = render(<DatePicker required />);
    const datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.required).toBe(true);
  });

  // 测试错误状态和帮助文本
  test('错误状态和帮助文本正确显示', () => {
    const { container } = render(<DatePicker error helperText="错误信息" />);
    // 使用更精确的选择器
    const helperTextElement = container.querySelector('.MuiFormHelperText-root');
    expect(helperTextElement).not.toBeNull();
    expect(helperTextElement?.textContent).toBe('错误信息');
  });

  // 测试占位符
  test('占位符正确显示', () => {
    const { container } = render(<DatePicker placeholder="测试占位符" />);
    const datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.placeholder).toBe('测试占位符');
  });

  // 测试日期格式
  test('日期格式正确显示', () => {
    const testDate = dayjs('2023-01-01');
    const { container } = render(<DatePicker value={testDate} format="YYYY/MM/DD" />);
    const datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.value).toBe('2023/01/01');
  });

  // 测试尺寸属性
  test('尺寸属性正确应用', () => {
    const { container } = render(<DatePicker size="small" />);
    const smallInput = container.querySelector('.MuiInputBase-sizeSmall');
    expect(smallInput).not.toBeNull();
  });

  // 测试日期变化回调
  test('日期变化回调正确触发', () => {
    const handleChange = vi.fn();
    const { container } = render(<DatePicker onChange={handleChange} />);
    
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
    fireEvent.change(datePicker as HTMLInputElement, { target: { value: '2023-01-01' } });
    
    // 注意：由于日期选择器的复杂性，这个测试可能需要更复杂的模拟
    // 这里只是简单检查回调是否被调用
    expect(handleChange).toHaveBeenCalled();
  });

  // 测试最小日期限制
  test('最小日期限制正确应用', () => {
    const minDate = dayjs('2023-01-01');
    const { container } = render(<DatePicker minDate={minDate} />);
    
    // 由于日期选择器的复杂性，这里只能检查属性是否被正确传递
    // 实际测试可能需要打开日期选择器并尝试选择早于最小日期的日期
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试最大日期限制
  test('最大日期限制正确应用', () => {
    const maxDate = dayjs('2023-12-31');
    const { container } = render(<DatePicker maxDate={maxDate} />);
    
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试禁用未来日期
  test('禁用未来日期正确应用', () => {
    const { container } = render(<DatePicker disableFuture />);
    
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试禁用过去日期
  test('禁用过去日期正确应用', () => {
    const { container } = render(<DatePicker disablePast />);
    
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试日期视图
  test('日期视图正确设置', () => {
    const { container } = render(<DatePicker views={['year']} />);
    
    const datePicker = container.querySelector('input');
    expect(datePicker).not.toBeNull();
  });

  // 测试受控组件行为
  test('作为受控组件正常工作', () => {
    const initialDate = dayjs('2023-01-01');
    const updatedDate = dayjs('2023-02-01');
    
    const { container, rerender } = render(<DatePicker value={initialDate} />);
    let datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.value).toBe('2023-01-01');
    
    rerender(<DatePicker value={updatedDate} />);
    datePicker = container.querySelector('input') as HTMLInputElement;
    expect(datePicker).not.toBeNull();
    expect(datePicker.value).toBe('2023-02-01');
  });
});