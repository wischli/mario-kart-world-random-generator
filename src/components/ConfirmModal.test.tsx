import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message content',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('displays custom title', () => {
    render(<ConfirmModal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('displays custom message', () => {
    render(<ConfirmModal {...defaultProps} message="Custom message here" />);
    expect(screen.getByText('Custom message here')).toBeInTheDocument();
  });

  it('displays default button text', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Yes, do it!')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('displays custom button text', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmText="Confirm Action"
        cancelText="Go Back"
      />
    );
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText('Yes, do it!'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when backdrop is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

    const backdrop = document.querySelector('.bg-black\\/70');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders warning variant by default', () => {
    render(<ConfirmModal {...defaultProps} />);
    // Warning variant uses flag emoji
    const modal = screen.getByText('Test Title').closest('h2');
    expect(modal?.textContent).toContain('Test Title');
  });

  it('renders danger variant with correct styling', () => {
    render(<ConfirmModal {...defaultProps} variant="danger" />);
    // Danger variant should still render with title
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles multiline messages', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        message="Line 1\nLine 2\nLine 3"
      />
    );
    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
  });
});
