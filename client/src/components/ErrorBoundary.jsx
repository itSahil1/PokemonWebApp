import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by error boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-pokelightgray p-4">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pokered mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-xl font-bold text-pokedarkgray">Something went wrong</h1>
            </div>
            
            <p className="mb-4 text-gray-600">Sorry, an error occurred in the application. Please try refreshing the page.</p>
            
            <div className="bg-gray-100 p-3 rounded-md overflow-auto text-sm text-gray-700 mb-4">
              <p>{this.state.error && this.state.error.toString()}</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-pokeblue text-white py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
