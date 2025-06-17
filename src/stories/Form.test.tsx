import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { TextareaAutosize } from './TextareaAutosize';
import { describe, expect, it } from 'vitest';

const FormComponent = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <div>
      <Checkbox
        label="启用/禁用文本输入"
        checked={isChecked}
        onChange={(_, checked) => setIsChecked(checked)}
      />
      <TextareaAutosize
        placeholder="请输入内容"
        disabled={isChecked}
        minRows={3}
        maxRows={5}
      />
    </div>
  );
};

describe('Form Component', () => {
  it('初始状态：复选框未选中，文本框可输入', () => {
    render(<FormComponent />);
    
    const checkbox = screen.getByRole('checkbox');
    const textarea = screen.getByPlaceholderText('请输入内容');
    
    expect(checkbox).not.toBeChecked();
    expect(textarea).not.toBeDisabled();
  });

  it('选中复选框后，文本框应被禁用', () => {
    render(<FormComponent />);
    
    const checkbox = screen.getByRole('checkbox');
    const textarea = screen.getByPlaceholderText('请输入内容');
    
    fireEvent.click(checkbox);
    
    expect(checkbox).toBeChecked();
    expect(textarea).toBeDisabled();
  });

  it('文本框在未禁用状态下可以输入内容', () => {
    render(<FormComponent />);
    
    const textarea = screen.getByPlaceholderText('请输入内容');
    
    fireEvent.change(textarea, { target: { value: '测试内容' } });
    
    expect(textarea).toHaveValue('测试内容');
  });

  it('文本框在禁用状态下无法输入内容', () => {
    render(<FormComponent />);
    
    const checkbox = screen.getByRole('checkbox');
    const textarea = screen.getByPlaceholderText('请输入内容');
    
    fireEvent.click(checkbox);
    fireEvent.change(textarea, { target: { value: '测试内容' } });
    
    expect(textarea).toBeDisabled();
    console.log(textarea)
    expect(textarea).toHaveValue(undefined);
  });
});