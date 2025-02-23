import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Button,
  Box,
  Paper,
  FormHelperText,
  Stack,
  IconButton,  // 添加 IconButton
  InputAdornment  // 添加 InputAdornment
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';  // 添加清除图标

// 删除 Grid 导入

// 添加 DynamicFormProps 接口定义
// 动态表单组件接口定义
interface DynamicFormProps {
  title?: string;                                    // 表单标题
  fields: FieldConfig[];                            // 表单字段配置数组
  submitText?: string;                              // 提交按钮文本
  onSubmit: (formData: Record<string, string>) => void;  // 表单提交回调
  initialValues?: Record<string, string>;           // 表单初始值
}

// 表单验证规则接口
interface ValidationRule {
  required?: boolean;    // 是否必填
  pattern?: RegExp;      // 正则表达式验证
  minLength?: number;    // 最小长度
  maxLength?: number;    // 最大长度
  message?: string;      // 错误提示信息
}

// 表单字段配置接口
interface FieldConfig {
  id: string;           // 字段唯一标识
  type: 'text' | 'select';  // 字段类型：文本输入或下拉选择
  label: string;        // 字段标签
  placeholder?: string; // 占位文本
  required?: boolean;   // 是否必填
  options?: Array<{ value: string; label: string }>;  // 下拉选项
  disabled?: boolean;   // 是否禁用
  validation?: ValidationRule;  // 验证规则
  // 值变化回调，支持同步和异步
  onChange?: (
    value: string, 
    allValues: Record<string, string>, 
    setValues: (values: Record<string, string>) => void
  ) => Record<string, string> | void | Promise<void>;
  // 字段依赖配置
  dependencies?: {
    fields: string[];   // 依赖的字段
    effect: (values: Record<string, string>) => {
      value?: string;   // 更新的值
      options?: Array<{ value: string; label: string }>;  // 更新的选项
      disabled?: boolean;  // 更新的禁用状态
    };
  };
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  title,
  fields, 
  submitText = '提交',
  onSubmit,
  initialValues = {}
}) => {
  // 表单状态管理
  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues);  // 表单值
  const [fieldOptions, setFieldOptions] = useState<Record<string, Array<{ value: string; label: string }>>>({});  // 动态选项
  const [errors, setErrors] = useState<Record<string, string>>({});  // 错误信息
  const [touched, setTouched] = useState<Record<string, boolean>>({});  // 触碰状态

  // 处理字段依赖关系
  useEffect(() => {
    fields.forEach(field => {
      if (field.dependencies) {
        const effect = field.dependencies.effect(formValues);
        if (effect.options) {
          setFieldOptions(prev => ({
            ...prev,
            [field.id]: effect.options || []
          }));
        }
      }
    });
  }, [fields, formValues]);

  // 处理字段值变化
  const handleFieldChange = async (fieldId: string, value: string) => {
    setFormValues(prev => {
      const newValues = {
        ...prev,
        [fieldId]: value
      };
      
      // 触发字段级别的 onChange 回调，并应用返回的更新
      const field = fields.find(f => f.id === fieldId);
      if (field?.onChange) {
        const result = field.onChange(value, newValues, setFormValues);
        // 如果返回对象，则更新表单值
        if (result && !(result instanceof Promise)) {
          return { ...newValues, ...result };
        }
      }
      
      return newValues;
    });

    // 处理字段验证
    const field = fields.find(f => f.id === fieldId);
    const error = validateField(fieldId, value, field?.validation);
    setErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));

    // 处理依赖关系
    fields.forEach(dependentField => {
      if (dependentField.dependencies?.fields.includes(fieldId)) {
        const effect = dependentField.dependencies.effect({
          ...formValues,
          [fieldId]: value
        });
    
        // 更新依赖字段的值
        if (effect.value !== undefined) {
          setFormValues(prev => ({
            ...prev,
            [dependentField.id]: effect.value || ''  // 添加空字符串作为默认值
          }));
        }
    
        // 更新依赖字段的选项
        if (effect.options !== undefined) {
          setFieldOptions(prev => ({
            ...prev,
            [dependentField.id]: effect.options || []
          }));
        }
      }
    });
  };

  // 验证单个字段
  const validateField = (fieldId: string, value: string, rules?: ValidationRule) => {
    if (!rules) return '';

    if (rules.required && !value) {
      return rules.message || '此字段为必填项';
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || '格式不正确';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `最少需要 ${rules.minLength} 个字符`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `最多允许 ${rules.maxLength} 个字符`;
    }

    return '';
  };

  // 处理字段失焦
  const handleBlur = (fieldId: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldId]: true
    }));
  };

  // 处理表单提交
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // 验证所有字段
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field.id, formValues[field.id] || '', field.validation);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    // 标记所有字段为已触碰
    const newTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      newTouched[field.id] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    // 如果没有错误，提交表单
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formValues);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 2 }}>
      {title && (
        <Box sx={{ mb: 3, typography: 'h5', textAlign: 'center' }}>
          {title}
        </Box>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} useFlexGap flexWrap="wrap">
            {fields.map((field) => (
              <Box 
                key={field.id} 
                sx={{ 
                  flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' },
                  minWidth: 0 // 防止内容溢出
                }}
              >
                <FormControl 
                  fullWidth 
                  error={touched[field.id] && !!errors[field.id]}
                >
                  <FormLabel required={field.validation?.required}>
                    {field.label}
                  </FormLabel>
                  {field.type === 'text' ? (
                    <TextField
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      onBlur={() => handleBlur(field.id)}
                      error={touched[field.id] && !!errors[field.id]}
                      helperText={touched[field.id] && errors[field.id]}
                      disabled={field.disabled || (field.dependencies?.effect(formValues).disabled ?? false)}
                      placeholder={field.placeholder}
                      fullWidth
                      size="small"
                      margin="normal"
                      InputProps={{
                        endAdornment: formValues[field.id] ? (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => handleFieldChange(field.id, '')}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null
                      }}
                    />
                  ) : (
                    <>
                      <Select
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value as string)}
                        onBlur={() => handleBlur(field.id)}
                        error={touched[field.id] && !!errors[field.id]}
                        disabled={field.disabled}
                        size="small"
                        fullWidth
                        endAdornment={formValues[field.id] ? (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFieldChange(field.id, '');
                            }}
                            sx={{ mr: 2 }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ) : null}
                      >
                        {(fieldOptions[field.id] || field.options)?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched[field.id] && errors[field.id] && (
                        <FormHelperText error>
                          {errors[field.id]}
                        </FormHelperText>
                      )}
                    </>
                  )}
                </FormControl>
              </Box>
            ))}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
            >
              {submitText}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default DynamicForm;