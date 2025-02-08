import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasicButtons from './index';
import { describe, expect, it } from 'vitest';

describe('BasicButtons', () => {
  it('should render button with default text', () => {
    render(<BasicButtons variant="contained" />);
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('should render button with custom text', () => {
    const customText = 'Custom Button';
    render(<BasicButtons variant="contained" text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('should render text variant button correctly', () => {
    render(<BasicButtons variant="text" />);
    const button = screen.getByText('Button');
    expect(button).toHaveClass('MuiButton-text');
  });

  it('should render contained variant button correctly', () => {
    render(<BasicButtons variant="contained" />);
    const button = screen.getByText('Button');
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('should render outlined variant button correctly', () => {
    render(<BasicButtons variant="outlined" />);
    const button = screen.getByText('Button');
    expect(button).toHaveClass('MuiButton-outlined');
  });
});