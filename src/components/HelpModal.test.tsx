import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpModal } from './HelpModal';

describe('HelpModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  it('renders nothing when closed', () => {
    const { container } = render(<HelpModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when open', () => {
    render(<HelpModal {...defaultProps} />);
    expect(screen.getByText('How to Use')).toBeInTheDocument();
  });

  it('renders all section titles', () => {
    render(<HelpModal {...defaultProps} />);
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('World Map')).toBeInTheDocument();
    expect(screen.getByText('Track List')).toBeInTheDocument();
    expect(screen.getByText('Color Legend')).toBeInTheDocument();
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();
  });

  it('renders color legend with all colors', () => {
    render(<HelpModal {...defaultProps} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Up Next')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);

    // There are two close buttons - X button and "Got it!" button
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]); // Click the X button

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when "Got it!" button is clicked', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('Got it!'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);

    // Find and click the backdrop (the div with bg-black/70 class)
    const backdrop = document.querySelector('.bg-black\\/70');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays generate instructions', () => {
    render(<HelpModal {...defaultProps} />);
    // Check for the instruction containing "hit Generate"
    expect(screen.getByText(/then hit/)).toBeInTheDocument();
  });

  it('displays auto-save tip', () => {
    render(<HelpModal {...defaultProps} />);
    expect(screen.getByText(/saves automatically/)).toBeInTheDocument();
  });

  it('displays share tip', () => {
    render(<HelpModal {...defaultProps} />);
    expect(screen.getByText(/share it/)).toBeInTheDocument();
  });
});
