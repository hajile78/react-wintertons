import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="error-boundary">
      <h2>Something went wrong:</h2>
      <pre>{error?.message || 'Unknown error occurred'}</pre>
      {resetErrorBoundary && (
        <button onClick={resetErrorBoundary}>Try again</button>
      )}
    </div>
  );
};

export default ErrorFallback;
