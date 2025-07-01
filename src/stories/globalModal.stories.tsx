import React from 'react';
import { Button, Stack } from '@mui/material';
import { globalModal } from './globalModal';

export default {
  title: 'Global/GlobalModal',
};

export const AllTypes = () => (
  <Stack spacing={2} direction="row">
    <Button
      variant="contained"
      onClick={() =>
        globalModal.info({
          title: '信息',
          content: '这是一个 info 弹窗',
        })
      }
    >
      Info
    </Button>
    <Button
      variant="contained"
      color="success"
      onClick={() =>
        globalModal.success({
          title: '成功',
          content: '这是一个 success 弹窗',
        })
      }
    >
      Success
    </Button>
    <Button
      variant="contained"
      color="warning"
      onClick={() =>
        globalModal.warning({
          title: '警告',
          content: '这是一个 warning 弹窗',
        })
      }
    >
      Warning
    </Button>
    <Button
      variant="contained"
      color="error"
      onClick={() =>
        globalModal.error({
          title: '错误',
          content: '这是一个 error 弹窗',
        })
      }
    >
      Error
    </Button>
    <Button
      variant="outlined"
      onClick={() =>
        globalModal.confirm({
          title: '确认',
          content: '你确定要继续吗？',
          onOk: () => alert('点击了确定'),
          onCancel: () => alert('点击了取消'),
        })
      }
    >
      Confirm
    </Button>
  </Stack>
);