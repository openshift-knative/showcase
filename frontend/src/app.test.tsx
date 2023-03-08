import { render, screen, waitFor } from '@testing-library/react'
import App from './app'

test('renders Loading text', () => {
  render(<App />)
  const linkElement = screen.getByText(/Loading.../)
  expect(linkElement).toBeInTheDocument()
})

test('renders App after a while', async () => {
  withEnv({ STUB_DELAY: '5' }, async () => {
    render(<App />)
    await waitFor(() => {
      const title = screen.getByText(/Welcome to Serverless/)
      expect(title).toBeInTheDocument()
    })
  })
})

const withEnv = (env: { [key: string]: string }, fn: () => void) => {
  const originalEnv = process.env
  process.env = { ...originalEnv, ...env }
  try {
    fn()
  } finally {
    process.env = originalEnv
  }
}
