import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button, Typography, TextField, Box } from '@mui/material';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    showCloseIcon: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    width: { control: 'text' },
    okButtonColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    cancelButtonColor: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// 基础示例
export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          打开弹窗
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={handleClose}
          title="基础弹窗"
        >
          <Typography>这是一个基础的弹窗示例。</Typography>
        </Modal>
      </>
    );
  },
};

// 自定义按钮文本
export const CustomButtons: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          打开弹窗
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={handleClose}
          title="自定义按钮"
          okText="同意"
          cancelText="拒绝"
          okButtonColor="success"
          cancelButtonColor="warning"
        >
          <Typography>这个弹窗有自定义的按钮文本和颜色。</Typography>
        </Modal>
      </>
    );
  },
};

// 表单弹窗
export const FormModal: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSubmit = () => {
      alert(`提交的数据：姓名=${name}, 邮箱=${email}`);
      handleClose();
    };
    
    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          打开表单弹窗
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={handleClose}
          onOk={handleSubmit}
          title="表单弹窗"
          width={500}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Box>
        </Modal>
      </>
    );
  },
};

// 无底部按钮
export const NoFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          打开无底部弹窗
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={handleClose}
          title="无底部按钮"
          showFooter={false}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>这个弹窗没有底部按钮，只能通过右上角的关闭图标关闭。</Typography>
            <Button variant="contained" onClick={handleClose} sx={{ alignSelf: 'center' }}>
              自定义关闭按钮
            </Button>
          </Box>
        </Modal>
      </>
    );
  },
};