import { render, screen, fireEvent } from '@testing-library/react';
import type { DatePickerFieldProps } from './DatePickerField';
import { DatePickerField } from './DatePickerField';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('DatePickerField', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    field: 'date',
    value: null,
    onChange: mockOnChange
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('应该渲染默认的日期格式占位符', () => {
    render(<DatePickerField {...defaultProps} />);
    expect(screen.getByText('MM/DD/YYYY')).toBeInTheDocument();
  });

  it('应该正确显示选中的日期', () => {
    const date = dayjs('2024-01-25');
    render(
      <DatePickerField
        {...defaultProps}
        value={date}
      />
    );
    expect(screen.getByText('2024-01-25')).toBeInTheDocument();
  });

  it('点击清除按钮时应该调用 onChange', () => {
    const date = dayjs('2024-01-25');
    render(
      <DatePickerField
        {...defaultProps}
        value={date}
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('date', null);
  });

  it('选择新日期时应该调用 onChange', async () => {
    render(<DatePickerField {...defaultProps} />);
    
    // 使用更精确的选择器来找到日期单元格
    const dateCell = screen.getByRole('gridcell', { 
      name: /15/,
      hidden: false
    });
    fireEvent.click(dateCell);
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('不应该显示清除按钮当没有选中日期时', () => {
    render(<DatePickerField {...defaultProps} />);
    
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).not.toBeInTheDocument();
  });
});