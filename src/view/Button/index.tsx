import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface ButtonProps {
    variant: 'text' | 'contained' | 'outlined';
    text?: string;
}

const BasicButtons = ({ variant, text = 'Button' }: ButtonProps) => {
  return (
    <Stack spacing={2} direction="row">
      <Button variant={variant}>{text}</Button>
    </Stack>
  );
}

export default BasicButtons;
