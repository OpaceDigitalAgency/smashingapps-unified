import { useState, useCallback, useEffect } from 'react';

// Define the window interface with reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * A hook for managing reCAPTCHA tokens
 * 
 * @param siteKey The reCAPTCHA site key (defaults to environment variable)
 * @returns An object with the getReCaptchaToken function
 */
export function useReCaptcha(siteKey?: string) {
  const [isReady, setIsReady] = useState(false);
  const recaptchaSiteKey = siteKey || process.env.REACT_APP_RECAPTCHA_SITE_KEY || '';

  // Initialize reCAPTCHA when the component mounts
  useEffect(() => {
    // Skip if no site key is provided
    if (!recaptchaSiteKey) {
      console.warn('No reCAPTCHA site key provided');
      return;
    }

    // Skip if reCAPTCHA is not available
    if (!window.grecaptcha) {
      console.warn('reCAPTCHA is not loaded');
      return;
    }

    // Initialize reCAPTCHA
    window.grecaptcha.ready(() => {
      setIsReady(true);
    });
  }, [recaptchaSiteKey]);

  /**
   * Get a reCAPTCHA token for the specified action
   * 
   * @param action The action to get a token for
   * @returns A promise that resolves to the token, or null if reCAPTCHA is not available
   */
  const getReCaptchaToken = useCallback(async (action: string): Promise<string | null> => {
    // Skip if no site key is provided
    if (!recaptchaSiteKey) {
      console.warn('No reCAPTCHA site key provided');
      return null;
    }

    // Skip if reCAPTCHA is not available
    if (!window.grecaptcha) {
      console.warn('reCAPTCHA is not loaded');
      return null;
    }

    // Skip if reCAPTCHA is not ready
    if (!isReady) {
      console.warn('reCAPTCHA is not ready');
      return null;
    }

    try {
      // Execute reCAPTCHA with the specified action
      const token = await window.grecaptcha.execute(recaptchaSiteKey, { action });
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      return null;
    }
  }, [recaptchaSiteKey, isReady]);

  return { getReCaptchaToken };
}

export default useReCaptcha;