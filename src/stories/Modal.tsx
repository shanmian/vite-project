import React from 'react';
import {
  Modal as MuiModal,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ModalProps {
  /**
   * 是否打开弹窗
   */
  open: boolean;
  /**
   * 关闭弹窗的回调函数
   */
  onClose: () => void;
  /**
   * 确认按钮的回调函数
   */
  onOk?: () => void;
  /**
   * 取消按钮的回调函数
   */
  onCancel?: () => void;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 弹窗内容
   */
  children?: React.ReactNode;
  /**
   * 确认按钮文本
   */
  okText?: string;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 是否显示关闭图标
   */
  showCloseIcon?: boolean;
  /**
   * 是否显示底部按钮
   */
  showFooter?: boolean;
  /**
   * 弹窗宽度
   */
  width?: number | string;
  /**
   * 确认按钮颜色
   */
  okButtonColor?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * 取消按钮颜色
   */
  cancelButtonColor?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /**
   * 弹窗图标
   */
  icon?: React.ReactNode;
}

/**
 * Modal 弹窗组件，基于 Material-UI
 */
export const Modal = ({
  open,
  onClose,
  onOk,
  onCancel,
  title = '提示',
  children,
  okText = '确定',
  cancelText = '取消',
  showCloseIcon = true,
  showFooter = true,
  width = 400,
  okButtonColor = 'primary',
  cancelButtonColor = 'error',
  icon,
}: ModalProps) => {
  // 处理确认按钮点击
  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    onClose();
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          p: 0,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 弹窗头部 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
            <Typography id="modal-title" variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
          {showCloseIcon && (
            <IconButton
              aria-label="close"
              onClick={handleCancel}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* 弹窗内容 */}
        <Box
          sx={{
            p: 3,
            overflowY: 'auto',
            flexGrow: 1,
          }}
          id="modal-description"
        >
          {children}
        </Box>

        {/* 弹窗底部 */}
        {showFooter && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid',
              borderColor: 'divider',
              px: 3,
              py: 2,
            }}
          >
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color={cancelButtonColor}
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant="contained"
                color={okButtonColor}
                onClick={handleOk}
              >
                {okText}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </MuiModal>
  );
};