import React, { forwardRef } from 'react';
import {
  Snackbar,
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  SnackbarProps,
  SnackbarOrigin,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 创建自定义Alert组件
const Alert = forwardRef<HTMLDivElement, MuiAlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface SnackbarAlertProps {
  /**
   * 是否打开Snackbar
   */
  open: boolean;
  /**
   * 关闭Snackbar的回调函数
   */
  onClose: () => void;
  /**
   * 消息内容
   */
  message: string;
  /**
   * 消息类型
   * @default 'info'
   */
  severity?: 'success' | 'info' | 'warning' | 'error';
  /**
   * 自动关闭的时间（毫秒）
   * @default 3000
   */
  autoHideDuration?: number;
  /**
   * Snackbar的位置
   * @default { vertical: 'bottom', horizontal: 'left' }
   */
  anchorOrigin?: SnackbarOrigin;
  /**
   * 是否显示关闭按钮
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * 自定义Snackbar的样式
   */
  snackbarStyle?: React.CSSProperties;
  /**
   * 自定义Alert的样式
   */
  alertStyle?: React.CSSProperties;
}

/**
 * SnackbarAlert组件，结合了Snackbar和Alert功能，用于显示通知消息
 */
export const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  onClose,
  message,
  severity = 'info',
  autoHideDuration = 3000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  showCloseButton = true,
  snackbarStyle,
  alertStyle,
}) => {
  // 处理关闭事件
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      style={snackbarStyle}
    >
      <Alert
        onClose={showCloseButton ? handleClose : undefined}
        severity={severity}
        style={alertStyle}
        action={showCloseButton ? (
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : undefined}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};