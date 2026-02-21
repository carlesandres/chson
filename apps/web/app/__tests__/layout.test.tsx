import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../layout';

// Mock the components
vi.mock('components/chson', () => ({
  Header: function MockHeader() {
    return <header data-testid="chson-header">ChSON Header</header>;
  },
  Footer: function MockFooter() {
    return <footer data-testid="chson-footer">ChSON Footer</footer>;
  },
}));

vi.mock('providers/query-provider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}));

vi.mock('providers/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe('Layout', () => {
  it('should render with required html and body tags', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    // Layout renders html and body tags, but in jsdom they're outside the container
    // We can verify the structure by checking that content is rendered within body
    const body = document.body;
    expect(body).toBeInTheDocument();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('should render children', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should wrap children with QueryProvider', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
  });

  it('should wrap children with ThemeProvider', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  it('should include Header component', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(screen.getByTestId('chson-header')).toBeInTheDocument();
    expect(screen.getByText('ChSON Header')).toBeInTheDocument();
  });

  it('should include Footer component', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(screen.getByTestId('chson-footer')).toBeInTheDocument();
    expect(screen.getByText('ChSON Footer')).toBeInTheDocument();
  });

  it('should render multiple children correctly', () => {
    render(
      <Layout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Layout>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
