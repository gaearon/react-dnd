import * as React from 'react'
import styled from 'styled-components'
import StaticHtmlBlock from './statichtmlblock'

export interface DocProps {
	docPage: {
		htmlAst: any
		html: string
	}
}

const Doc: React.SFC<DocProps> = ({ docPage }) => {
	return (
		<Container>
			<Gutter />
			<StaticHtmlBlock html={docPage.html} />
			<Gutter />
		</Container>
	)
}

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: row;
`

const Gutter = styled.div`
	flex: 1;
`

export default Doc
