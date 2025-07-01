import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { globalModal } from './globalModal';
import { describe, expect, it, vi } from 'vitest';

describe('globalModal', () => {
  it('should show info modal', async () => {
    globalModal.info({ title: 'Info', content: 'Info content' });
    expect(await screen.findByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Info content')).toBeInTheDocument();
    // 关闭弹窗
    fireEvent.click(screen.getByLabelText('close'));
    await waitFor(() => {
      expect(screen.queryByText('Info')).not.toBeInTheDocument();
    });
  });

  it('should show confirm modal and handle ok/cancel', async () => {
    const onOk = vi.fn();
    const onCancel = vi.fn();
    globalModal.confirm({
      title: '确认',
      content: '你确定吗？',
      onOk,
      onCancel,
    });
    expect(await screen.findByText('确认')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确定'));
    expect(onOk).toHaveBeenCalled();

    // 再弹一次测试取消
    globalModal.confirm({
      title: '确认',
      content: '你确定吗？',
      onOk,
      onCancel,
    });
    expect(await screen.findByText('确认')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalled();
  });
});