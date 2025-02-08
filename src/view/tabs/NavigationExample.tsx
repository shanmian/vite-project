import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Card } from '@mui/material';
import NavigationComponent from './NavigationComponent';
import { NavigationDataProvider, useNavigationData } from './NavigationDataContext';

// 用户信息表单
const UserInfoForm: React.FC = () => {
  const { sharedData, updateData } = useNavigationData();
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="姓名"
          value={sharedData.name || ''}
          onChange={(e) => updateData('name', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="电话"
          value={sharedData.phone || ''}
          onChange={(e) => updateData('phone', e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

// 地址信息表单
const AddressForm: React.FC = () => {
  const { sharedData, updateData } = useNavigationData();
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="省份"
          value={sharedData.province || ''}
          onChange={(e) => updateData('province', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="详细地址"
          multiline
          rows={3}
          value={sharedData.address || ''}
          onChange={(e) => updateData('address', e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

// 确认信息表单
const ConfirmForm: React.FC = () => {
  const { sharedData } = useNavigationData();
  
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>确认信息</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>姓名: {sharedData.name || '未填写'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>电话: {sharedData.phone || '未填写'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>省份: {sharedData.province || '未填写'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>地址: {sharedData.address || '未填写'}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

// 主容器组件
const StepperContent: React.FC = () => {
  const { sharedData } = useNavigationData();
  
  const stepItems = ['基本信息', '地址信息', '确认信息'];
  const stepContents = [
    <UserInfoForm key="1" />,
    <AddressForm key="2" />,
    <ConfirmForm key="3" />
  ];

  const handleFinish = () => {
    console.log('提交的数据:', sharedData);
  };

  const handleCancel = () => {
    console.log('取消操作');
  };

  return (
    <Box sx={{ p: 2 }}>
      <NavigationComponent
        type="stepper"
        items={stepItems}
        contents={stepContents}
        onFinish={handleFinish}
        onCancel={handleCancel}
        showNextButton={true}
        showBackButton={true}
        showFinishButton={true}
        showCancelButton={true}
      />
    </Box>
  );
};

// 导出组件
const NavigationExample: React.FC = () => {
  return (
    <NavigationDataProvider>
      <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
        <Typography variant="h5" gutterBottom>
          用户信息登记
        </Typography>
        <StepperContent />
      </Box>
    </NavigationDataProvider>
  );
};

export default NavigationExample;