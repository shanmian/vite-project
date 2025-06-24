import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SnackbarAlert } from './SnackbarAlert';
import { Button, Box } from '@mui/material';

const meta: Meta<typeof SnackbarAlert> = {
  title: 'Components/SnackbarAlert',
  component: SnackbarAlert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    message: { control: 'text' },
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    autoHideDuration: { control: 'number' },
    anchorOrigin: { control: 'object' },
    showCloseButton: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SnackbarAlert>;

// 基础示例
export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" onClick={handleOpen}>
          显示消息
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="这是一条基本的通知消息"
        />
      </Box>
    );
  },
};

// 成功消息
export const Success: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" color="success" onClick={handleOpen}>
          显示成功消息
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="操作成功完成！"
          severity="success"
        />
      </Box>
    );
  },
};

// 错误消息
export const Error: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" color="error" onClick={handleOpen}>
          显示错误消息
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="发生错误，请重试！"
          severity="error"
        />
      </Box>
    );
  },
};

// 警告消息
export const Warning: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" color="warning" onClick={handleOpen}>
          显示警告消息
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="请注意，这是一条警告消息！"
          severity="warning"
        />
      </Box>
    );
  },
};

// 自定义位置
export const CustomPosition: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" onClick={handleOpen}>
          顶部中央显示
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="我显示在顶部中央位置"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </Box>
    );
  },
};

// 长时间显示
export const LongDuration: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" onClick={handleOpen}>
          长时间显示消息
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="我会显示10秒钟"
          autoHideDuration={10000}
        />
      </Box>
    );
  },
};

// 无关闭按钮
export const NoCloseButton: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <Box>
        <Button variant="contained" onClick={handleOpen}>
          无关闭按钮消息
        </Button>
        <SnackbarAlert
          {...args}
          open={open}
          onClose={handleClose}
          message="我没有关闭按钮，只能自动关闭"
          showCloseButton={false}
        />
      </Box>
    );
  },
};