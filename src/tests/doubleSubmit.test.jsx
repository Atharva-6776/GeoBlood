import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

// Mock component simulating Accept / Action flow with in-flight loading state
const SimulatedAcceptFlow = ({ onAccept }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    setSubmitting(true);
    await onAccept();
    // keeps submitting true during flight
  };

  return (
    <Button
      variant="primary"
      loading={submitting}
      onClick={handleClick}
    >
      Accept Invitation
    </Button>
  );
};

describe('Double-Submission Prevention', () => {
  it('disables the button and sets aria-busy when loading is true', () => {
    const mockClick = vi.fn();
    const { rerender } = render(
      <Button variant="primary" loading={false} onClick={mockClick}>
        Accept Request
      </Button>
    );

    const btn = screen.getByRole('button', { name: /Accept Request/i });
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'false');

    // Click triggers
    fireEvent.click(btn);
    expect(mockClick).toHaveBeenCalledTimes(1);

    // Re-render in loading state (e.g. API request in flight)
    rerender(
      <Button variant="primary" loading={true} onClick={mockClick}>
        Accept Request
      </Button>
    );

    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');

    // Attempting further clicks while in-flight must NOT trigger additional calls
    fireEvent.click(btn);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('automatically prevents duplicate rapid clicks in simulated accept action', async () => {
    let resolvePromise;
    const asyncAction = vi.fn().mockImplementation(() => {
      return new Promise((res) => {
        resolvePromise = res;
      });
    });

    render(<SimulatedAcceptFlow onAccept={asyncAction} />);

    const button = screen.getByRole('button', { name: /Accept Invitation/i });
    expect(button).not.toBeDisabled();

    // First click initiates request
    fireEvent.click(button);
    expect(asyncAction).toHaveBeenCalledTimes(1);

    // Button should now be disabled
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    // Second click during in-flight request should be blocked
    fireEvent.click(button);
    expect(asyncAction).toHaveBeenCalledTimes(1); // Still 1!

    // Finish simulated async request
    if (resolvePromise) resolvePromise();
  });
});
