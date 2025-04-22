import React from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel, FormGroup } from '@mui/material';

export interface CheckboxProps {
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 默认是否选中
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 复选框大小
   */
  size?: 'small' | 'medium';
  /**
   * 复选框颜色
   */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
  /**
   * 复选框位置
   */
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  /**
   * 状态变化回调
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/**
 * 复选框组件，基于 Material-UI
 */
export const Checkbox = ({
  checked,
  defaultChecked,
  disabled = false,
  label,
  size = 'medium',
  color = 'primary',
  labelPlacement = 'end',
  onChange,
  ...props
}: CheckboxProps) => {
  if (label) {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <MuiCheckbox
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              size={size}
              color={color}
              onChange={onChange}
              {...props}
            />
          }
          label={label}
          labelPlacement={labelPlacement}
          disabled={disabled}
        />
      </FormGroup>
    );
  }

  return (
    <MuiCheckbox
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      size={size}
      color={color}
      onChange={onChange}
      {...props}
    />
  );
};