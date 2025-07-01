import React, { useState, useCallback, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Modal, ModalProps } from './Modal';

type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface GlobalModalOptions extends Partial<ModalProps> {
  type?: ModalType;
  content?: ReactNode;
  title?: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const defaultTitles: Record<ModalType, string> = {
  info: '提示',
  success: '成功',
  warning: '警告',
  error: '错误',
  confirm: '确认',
};

const defaultOkColors: Record<ModalType, ModalProps['okButtonColor']> = {
  info: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  confirm: 'primary',
};

const defaultCancelColors: Record<ModalType, ModalProps['cancelButtonColor']> = {
  info: 'error',
  success: 'error',
  warning: 'error',
  error: 'error',
  confirm: 'error',
};

let root: ReturnType<typeof createRoot> | null = null;

function showModal(options: GlobalModalOptions) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const type = options.type || 'info';

  const handleClose = () => {
    if (root) {
      root.unmount();
      root = null;
    }
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 300);
  };

  const handleOk = () => {
    options.onOk?.();
    handleClose();
  };

  const handleCancel = () => {
    options.onCancel?.();
    handleClose();
  };

  const modalProps: ModalProps = {
    open: true,
    onClose: handleClose,
    onOk: options.onOk ? handleOk : undefined,
    onCancel: options.onCancel ? handleCancel : handleClose,
    title: options.title || defaultTitles[type],
    children: options.content,
    okText: options.okText || '确定',
    cancelText: options.cancelText || (type === 'confirm' ? '取消' : undefined),
    showCloseIcon: true,
    showFooter: type === 'confirm' || !!options.showFooter,
    okButtonColor: options.okButtonColor || defaultOkColors[type],
    cancelButtonColor: options.cancelButtonColor || defaultCancelColors[type],
    width: options.width || 400,
  };

  root = createRoot(container);
  root.render(<Modal {...modalProps} />);
}

export const globalModal = {
  info: (options: Omit<GlobalModalOptions, 'type'>) =>
    showModal({ ...options, type: 'info', showFooter: false }),
  success: (options: Omit<GlobalModalOptions, 'type'>) =>
    showModal({ ...options, type: 'success', showFooter: false }),
  warning: (options: Omit<GlobalModalOptions, 'type'>) =>
    showModal({ ...options, type: 'warning', showFooter: false }),
  error: (options: Omit<GlobalModalOptions, 'type'>) =>
    showModal({ ...options, type: 'error', showFooter: false }),
  confirm: (options: Omit<GlobalModalOptions, 'type'>) =>
    showModal({ ...options, type: 'confirm', showFooter: true }),
};