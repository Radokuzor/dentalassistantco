"use client";

import { useCallback, useRef } from "react";

/**
 * Minimum time between a person first touching a form and being allowed to submit it, in ms.
 *
 * This is the only spam gate on the lead forms, on purpose: a timing check cannot mistake a real
 * person for a bot the way a captcha or a keyword filter can. Someone who is genuinely fast is
 * asked to press the button once more and goes straight through on the second attempt.
 */
export const MIN_FILL_MS = 3000;

/** Tracks how long a form has been in use. Start the clock on the first interaction, and fall
 *  back to mount time so a form that is submitted without any interaction is measured from when
 *  it appeared rather than being treated as instantly filled. */
export function useFormGate() {
  const mounted = useRef(Date.now());
  const firstTouch = useRef<number | null>(null);

  const touch = useCallback(() => {
    if (firstTouch.current === null) firstTouch.current = Date.now();
  }, []);

  const elapsed = useCallback(() => Date.now() - (firstTouch.current ?? mounted.current), []);

  const tooFast = useCallback(() => elapsed() < MIN_FILL_MS, [elapsed]);

  return { touch, elapsed, tooFast };
}
