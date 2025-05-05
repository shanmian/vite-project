import React from 'react';
import { TextareaAutosize as MuiTextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TextareaAutosizeProps {
  /**
   * 文本框的值
   */
  value?: string;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 占位文本
   */
  placeholder?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readOnly?: boolean;
  /**
   * 最小行数
   */
  minRows?: number;
  /**
   * 最大行数
   */
  maxRows?: number;
  /**
   * 输入变化回调
   */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * 失去焦点回调
   */
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * 获得焦点回调
   */
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * 最大字符数
   */
  maxLength?: number;
  /**
   * 是否显示字符计数
   */
  showCount?: boolean;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * CSS类名
   */
  className?: string;
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
}

const StyledTextareaWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledTextarea = styled(MuiTextareaAutosize, {
  shouldForwardProp: (prop) => 
    prop !== 'error' && prop !== 'showCount' && prop !== 'helperText'
})<{ error?: boolean }>(({ theme, error }) => ({
  width: '100%',
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  lineHeight: '1.5',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
  '&:focus': {
    outline: 'none',
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${error ? theme.palette.error.light : theme.palette.primary.light}25`,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
  },
  resize: 'vertical',
}));

const HelperText = styled('div')<{ error?: boolean }>(({ theme, error }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  color: error ? theme.palette.error.main : theme.palette.text.secondary,
}));

const CharCount = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
  alignSelf: 'flex-end',
}));

/**
 * 自适应文本框组件，基于 Material-UI
 */
export const TextareaAutosize = ({
  value,
  defaultValue,
  placeholder,
  disabled = false,
  readOnly = false,
  minRows = 3,
  maxRows = 10,
  onChange,
  onBlur,
  onFocus,
  maxLength,
  showCount = false,
  style,
  className,
  required = false,
  error = false,
  helperText,
  ...props
}: TextareaAutosizeProps) => {
  const [inputValue, setInputValue] = React.useState(value || defaultValue || '');
  
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);
  
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    if (maxLength !== undefined && newValue.length > maxLength) {
      return;
    }
    
    if (value === undefined) {
      setInputValue(newValue);
    }
    
    if (onChange) {
      onChange(event);
    }
  };
  
  return (
    <StyledTextareaWrapper style={style} className={className}>
      <StyledTextarea
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        minRows={minRows}
        maxRows={maxRows}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
        error={error}
        {...props}
      />
      
      {helperText && (
        <HelperText error={error}>{helperText}</HelperText>
      )}
      
      {showCount && (
        <CharCount>
          {inputValue.length}{maxLength ? `/${maxLength}` : ''}
        </CharCount>
      )}
    </StyledTextareaWrapper>
  );
};