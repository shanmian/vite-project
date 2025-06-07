import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, TextFieldProps } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';

export type DateView = 'day' | 'month' | 'year';

export interface DatePickerProps {
  /**
   * 日期值
   */
  value?: Dayjs | null;
  /**
   * 默认日期值
   */
  defaultValue?: Dayjs | null;
  /**
   * 日期变化回调
   */
  onChange?: (date: Dayjs | null) => void;
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readOnly?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 错误状态
   */
  error?: boolean;
  /**
   * 帮助文本
   */
  helperText?: string;
  /**
   * 占位文本
   */
  placeholder?: string;
  /**
   * 日期格式
   */
  format?: string;
  /**
   * 最小日期
   */
  minDate?: Dayjs;
  /**
   * 最大日期
   */
  maxDate?: Dayjs;
  /**
   * 尺寸
   */
  size?: 'small' | 'medium';
  /**
   * 是否打开日历
   */
  open?: boolean;
  /**
   * 日历打开回调
   */
  onOpen?: () => void;
  /**
   * 日历关闭回调
   */
  onClose?: () => void;
  /**
   * 输入框属性
   */
  inputProps?: Partial<TextFieldProps>;
  /**
   * 是否显示今天按钮
   */
  showTodayButton?: boolean;
  /**
   * 是否禁用未来日期
   */
  disableFuture?: boolean;
  /**
   * 是否禁用过去日期
   */
  disablePast?: boolean;
  /**
   * 可见的日期视图
   */
  views?: DateView[];
  /**
   * 默认打开的视图
   */
  openTo?: DateView;
  /**
   * 日历方向
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * 自定义日期渲染
   */
  shouldDisableDate?: (day: Dayjs) => boolean;
  /**
   * 自定义月份渲染
   */
  shouldDisableMonth?: (month: Dayjs) => boolean;
  /**
   * 自定义年份渲染
   */
  shouldDisableYear?: (year: Dayjs) => boolean;
}

/**
 * 日期选择器组件，基于 Material-UI
 */
export const DatePicker = ({
  value,
  defaultValue,
  onChange,
  label = '选择日期',
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  helperText,
  placeholder = 'YYYY-MM-DD',
  format = 'YYYY-MM-DD',
  minDate,
  maxDate,
  size = 'medium',
  open,
  onOpen,
  onClose,
  inputProps,
  showTodayButton = true,
  disableFuture = false,
  disablePast = false,
  views = ['day'],
  openTo = 'day',
  orientation = 'portrait',
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  ...props
}: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <MuiDatePicker
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        label={label}
        disabled={disabled}
        readOnly={readOnly}
        format={format}
        minDate={minDate}
        maxDate={maxDate}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        views={views}
        openTo={openTo}
        orientation={orientation}
        shouldDisableDate={shouldDisableDate}
        shouldDisableMonth={shouldDisableMonth}
        shouldDisableYear={shouldDisableYear}
        slotProps={{
          textField: {
            size,
            required,
            error,
            helperText,
            placeholder,
            fullWidth: true,
            ...inputProps,
          },
          actionBar: {
            actions: showTodayButton ? ['today', 'clear'] : ['clear'],
          },
          // 自定义日期单元格样式
          day: {
            // 可以添加自定义样式
          },
          // 自定义弹出框样式
          popper: {
            sx: {
              // 可以添加自定义样式
            }
          },
        }}
        disableFuture={disableFuture}
        disablePast={disablePast}
        {...props}
      />
    </LocalizationProvider>
  );
};