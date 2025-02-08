import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import NavigationComponent from './NavigationComponent';
import { NavigationDataProvider, useNavigationData } from './NavigationDataContext';

// 创建表单内容组件
const FormContent: React.FC<{ step: number }> = ({ step }) => {
  const { sharedData, updateData } = useNavigationData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData(`step${step}`, e.target.value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={`Step ${step} Input`}
        value={sharedData[`step${step}`] || ''}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <Typography>
        Previous step data: {step > 1 ? sharedData[`step${step-1}`] || 'No data' : 'This is first step'}
      </Typography>
    </Box>
  );
};

const StepperContent: React.FC = () => {
  const { sharedData } = useNavigationData();
  const [activeIndex, setActiveIndex] = useState(0);

  const stepItems = ['Step 1', 'Step 2', 'Step 3'];
  const stepContents = [
    <FormContent key="1" step={1} />,
    <FormContent key="2" step={2} />,
    <FormContent key="3" step={3} />
  ];

  const handleFinish = () => {
    console.log('所有步骤的数据:', sharedData);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5">带数据共享的 Stepper</Typography>
      <NavigationComponent
        type="stepper"
        items={stepItems}
        contents={stepContents}
        onFinish={handleFinish}
        showNextButton={true}
        showBackButton={true}
        showFinishButton={true}
      />
    </Box>
  );
};

const NavigationComponentExample: React.FC = () => {
  return (
    <NavigationDataProvider>
      <StepperContent />
    </NavigationDataProvider>
  );
};

export default NavigationComponentExample;