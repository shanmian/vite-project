import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import NavigationComponent, { NavigationProvider, useNavigation } from './NavigationComponentWithContext';

// 示例页面组件
const Page1 = () => {
  const { state, dispatch } = useNavigation();

  React.useEffect(() => {
    if (!state.isValid) {
      dispatch({ type: 'SET_VALID', payload: true });
    }
  }, [state.currentIndex]);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">第一页</Typography>
      <Typography>这是第一页的内容...</Typography>
    </Card>
  );
};

const Page2 = () => {
  const { state, dispatch } = useNavigation();

  React.useEffect(() => {
    if (!state.isValid) {
      dispatch({ type: 'SET_VALID', payload: true });
    }
  }, [state.currentIndex]);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">第二页</Typography>
      <Typography>这是第二页的内容...</Typography>
    </Card>
  );
};

const Page3 = () => {
  const { state, dispatch } = useNavigation();

  React.useEffect(() => {
    if (!state.isValid) {
      dispatch({ type: 'SET_VALID', payload: true });
    }
  }, [state.currentIndex]);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">第三页</Typography>
      <Typography>这是第三页的内容...</Typography>
    </Card>
  );
};

// 主容器组件
const NavigationDemo: React.FC = () => {
  const items = ['第一步', '第二步', '第三步'];
  const contents = [
    <Page1 key="1" />,
    <Page2 key="2" />,
    <Page3 key="3" />
  ];

  const handleFinish = () => {
    console.log('完成操作');
  };

  const handleCancel = () => {
    console.log('取消操作');
  };

  return (
    <NavigationProvider initialType="stepper">
      <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
        <Typography variant="h5" gutterBottom>
          导航组件示例
        </Typography>
        <NavigationComponent
          items={items}
          contents={contents}
          onFinish={handleFinish}
          onCancel={handleCancel}
          showNextButton
          showBackButton
          showFinishButton
          showCancelButton
        />
      </Box>
    </NavigationProvider>
  );
};

export default NavigationDemo;