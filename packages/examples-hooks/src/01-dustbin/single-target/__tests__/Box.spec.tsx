import '@testing-library/jest-dom'
import { render, fireEvent, act } from '@testing-library/react'
import { Box } from '../Box'
import { wrapWithBackend, tick } from 'react-dnd-test-utils'

describe('Box', () => {
	it('can be tested with a backend', async () => {
		const TestBox = wrapWithBackend(Box)
		const rendered = render(<TestBox name="test" />)

		// Check that the opacity is 1
		const box = rendered.getByTestId('box-test')
		expect(box).toBeDefined()
		expect(box).toHaveStyle({ opacity: '1' })

		// Opacity drops on Drag
		await act(async () => {
			fireEvent.dragStart(box)
			await tick()
		})
		expect(box).toHaveStyle({ opacity: '0.4' })

		// Opacity returns on dragend
		fireEvent.dragEnd(box)
		expect(box).toHaveStyle({ opacity: '1' })
	})
})
