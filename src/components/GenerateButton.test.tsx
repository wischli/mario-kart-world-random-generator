import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenerateButton } from './GenerateButton';

describe('GenerateButton', () => {
  const defaultProps = {
    onGenerate: vi.fn(),
    onReset: vi.fn(),
    hasSelection: false,
    trackCount: 16,
    onTrackCountChange: vi.fn(),
  };

  it('renders generate button when no selection', () => {
    render(<GenerateButton {...defaultProps} />);
    expect(screen.getByText('Generate')).toBeInTheDocument();
  });

  it('renders re-roll button when there is a selection', () => {
    render(<GenerateButton {...defaultProps} hasSelection={true} />);
    expect(screen.getByText('Re-roll')).toBeInTheDocument();
  });

  it('renders reset button only when there is a selection', () => {
    const { rerender } = render(<GenerateButton {...defaultProps} hasSelection={false} />);
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();

    rerender(<GenerateButton {...defaultProps} hasSelection={true} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders track count dropdown with correct value', () => {
    render(<GenerateButton {...defaultProps} trackCount={16} />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toHaveValue('16');
  });

  it('renders all track count options', () => {
    render(<GenerateButton {...defaultProps} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(7); // 4, 8, 12, 16, 20, 24, 30
    expect(options.map(o => o.textContent)).toEqual(['4', '8', '12', '16', '20', '24', '30']);
  });

  it('calls onGenerate when generate button is clicked', () => {
    const onGenerate = vi.fn();
    render(<GenerateButton {...defaultProps} onGenerate={onGenerate} />);

    fireEvent.click(screen.getByText('Generate'));
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<GenerateButton {...defaultProps} onReset={onReset} hasSelection={true} />);

    fireEvent.click(screen.getByText('Reset'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls onTrackCountChange when dropdown value changes', () => {
    const onTrackCountChange = vi.fn();
    render(<GenerateButton {...defaultProps} onTrackCountChange={onTrackCountChange} />);

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: '8' } });

    expect(onTrackCountChange).toHaveBeenCalledWith(8);
  });

  it('displays dice emoji in generate button', () => {
    render(<GenerateButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /generate/i });
    expect(button.textContent).toContain('Generate');
  });
});
