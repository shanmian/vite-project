import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';
import { describe, expect, test, vi } from 'vitest';

describe('Modal 组件', () => {
  // 测试基本渲染
  test('渲染基本弹窗', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal open={true} onClose={handleClose} title="测试标题">
        测试内容
      </Modal>
    );
    
    // 检查标题是否正确渲染
    const title = screen.getByText('测试标题');
    expect(title).toBeDefined();
    
    // 检查内容是否正确渲染
    const content = screen.getByText('测试内容');
    expect(content).toBeDefined();
    
    // 检查按钮是否正确渲染
    const okButton = screen.getByText('确定');
    const cancelButton = screen.getByText('取消');
    expect(okButton).toBeDefined();
    expect(cancelButton).toBeDefined();
  });

  // 测试自定义按钮文本
  test('自定义按钮文本正确显示', () => {
    const handleClose = vi.fn();
    render(
      <Modal 
        open={true} 
        onClose={handleClose} 
        okText="自定义确定" 
        cancelText="自定义取消"
      >
        测试内容
      </Modal>
    );
    
    const okButton = screen.getByText('自定义确定');
    const cancelButton = screen.getByText('自定义取消');
    expect(okButton).toBeDefined();
    expect(cancelButton).toBeDefined();
  });

  // 测试确认按钮点击
  test('确认按钮点击正确触发回调', () => {
    const handleClose = vi.fn();
    const handleOk = vi.fn();
    
    render(
      <Modal open={true} onClose={handleClose} onOk={handleOk}>
        测试内容
      </Modal>
    );
    
    const okButton = screen.getByText('确定');
    fireEvent.click(okButton);
    
    expect(handleOk).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试取消按钮点击
  test('取消按钮点击正确触发回调', () => {
    const handleClose = vi.fn();
    const handleCancel = vi.fn();
    
    render(
      <Modal open={true} onClose={handleClose} onCancel={handleCancel}>
        测试内容
      </Modal>
    );
    
    const cancelButton = screen.getByText('取消');
    fireEvent.click(cancelButton);
    
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试关闭图标点击
  test('关闭图标点击正确触发回调', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal open={true} onClose={handleClose} showCloseIcon={true}>
        测试内容
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试隐藏底部
  test('隐藏底部按钮正确', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal open={true} onClose={handleClose} showFooter={false}>
        测试内容
      </Modal>
    );
    
    // 底部按钮应该不存在
    const okButton = screen.queryByText('确定');
    const cancelButton = screen.queryByText('取消');
    
    expect(okButton).toBeNull();
    expect(cancelButton).toBeNull();
  });

  // 测试隐藏关闭图标
  test('隐藏关闭图标正确', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal open={true} onClose={handleClose} showCloseIcon={false}>
        测试内容
      </Modal>
    );
    
    // 关闭图标应该不存在
    const closeButton = screen.queryByLabelText('close');
    expect(closeButton).toBeNull();
  });

  // 测试自定义宽度
//   test('自定义宽度正确应用', () => {
//     const handleClose = vi.fn();
//     const { container } = render(
//       <Modal open={true} onClose={handleClose} width={600}>
//         测试内容
//       </Modal>
//     );
    
//     // 使用更通用的选择器，查找第一个直接子元素，它应该是 Modal 的容器
//     const modalBox = container.querySelector('[role="presentation"] > div');
//     expect(modalBox).not.toBeNull();
    
//     if (modalBox) {
//       // 检查样式是否包含宽度设置
//       const style = modalBox.getAttribute('style');
//       expect(style).not.toBeNull();
//       expect(style?.includes('width') || style?.includes('width: 600')).toBe(true);
//     }
//   });
});