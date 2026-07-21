import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a production setup this would report to an error-tracking service.
    // eslint-disable-next-line no-console
    console.error("Section crashed:", error, info);
  }

  handleReset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="animate-fadeIn rounded-2xl border border-safety-red/20 bg-safety-redLight px-6 py-10 text-center">
            <p className="font-display text-base font-semibold text-navy-900">This section couldn't load</p>
            <p className="mt-1 text-sm text-navy-500">Something went wrong. The rest of the page is unaffected.</p>
            <button
              onClick={this.handleReset}
              className="btn-transition mt-4 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
