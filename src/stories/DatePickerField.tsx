import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

export interface DatePickerFieldProps {
  /**
   * 字段名称
   */
  field: string;
  /**
   * 日期值
   */
  value: any;
  /**
   * 日期变化回调
   * @param field 字段名称
   * @param date 日期值
   */
  onChange: (field: string, date: any) => void;
}

/**
 * 静态日期选择器字段组件
 * 
 * 显示当前选择的日期，并提供一个静态日期选择器供用户选择日期
 */
export const DatePickerField = React.memo(({ 
  field, 
  value, 
  onChange 
}: DatePickerFieldProps) => ( 
  <Box> 
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}> 
    <Typography variant="body2" sx={{ flex: 1 }}> 
  {value && dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : 'MM/DD/YYYY'} 
</Typography>
      {value && ( 
        <IconButton 
          size="small" 
          onClick={() => onChange(field, null)} 
          sx={{ p: 0.5 }} 
        > 
          <CloseIcon fontSize="small" /> 
        </IconButton> 
      )} 
    </Box> 
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn"> 
      <StaticDatePicker 
        displayStaticWrapperAs="desktop" 
        value={value || null} 
        onChange={(date) => onChange(field, date)} 
        slotProps={{ 
          actionBar: { 
            actions: ['clear'], 
          }, 
        }} 
      /> 
    </LocalizationProvider> 
  </Box> 
));

DatePickerField.displayName = 'DatePickerField';

/**
 * 
 * 
 * const [selectedDate, setSelectedDate] = useState(null)

  const handleDateChange = (field: string, date: any) => {
    setSelectedDate(date)
  }

  <DatePickerField
        field="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
 */

