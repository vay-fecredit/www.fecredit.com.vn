/**
 * Utility Functions for Security and Common Operations
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Utility function to safely escape HTML (prevents XSS)
   */
  window.escapeHtml = function(text) {
    if (typeof text !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  /**
   * Safely set text content (prevents XSS)
   */
  window.safeSetTextContent = function(element, text) {
    if (!element) return;
    element.textContent = text || '';
  };

  /**
   * Show loading state on button
   */
  window.setButtonLoading = function(button, isLoading) {
    if (!button) return;
    const originalText = button.dataset.originalText || button.textContent;
    if (!button.dataset.originalText) {
      button.dataset.originalText = originalText;
    }
    button.disabled = isLoading;
    if (isLoading) {
      button.innerHTML = '<span class="loading-spinner"></span>Đang xử lý...';
    } else {
      button.textContent = originalText;
    }
  };

  /**
   * Safe localStorage operations with error handling
   */
  window.safeLocalStorage = {
    getItem: function(key) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        if (window.Logger) {
          window.Logger.error("localStorage.getItem failed", error, { key });
        }
        return null;
      }
    },
    setItem: function(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        if (window.Logger) {
          window.Logger.error("localStorage.setItem failed", error, { key });
        }
        // Handle quota exceeded
        if (error.name === 'QuotaExceededError') {
          if (window.Logger) {
            window.Logger.warn("localStorage quota exceeded", { key });
          }
        }
        return false;
      }
    },
    removeItem: function(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        if (window.Logger) {
          window.Logger.error("localStorage.removeItem failed", error, { key });
        }
        return false;
      }
    }
  };

  /**
   * Safe sessionStorage operations with error handling
   */
  window.safeSessionStorage = {
    getItem: function(key) {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        if (window.Logger) {
          window.Logger.error("sessionStorage.getItem failed", error, { key });
        }
        return null;
      }
    },
    setItem: function(key, value) {
      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch (error) {
        if (window.Logger) {
          window.Logger.error("sessionStorage.setItem failed", error, { key });
        }
        return false;
      }
    },
    removeItem: function(key) {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        if (window.Logger) {
          window.Logger.error("sessionStorage.removeItem failed", error, { key });
        }
        return false;
      }
    }
  };

  /**
   * Retry function for async operations
   */
  window.retryOperation = async function(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        if (window.Logger) {
          window.Logger.warn(`Retry attempt ${i + 1} of ${maxRetries}`, { error: error.message });
        }
      }
    }
  };
})();
