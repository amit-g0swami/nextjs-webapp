import React, { ReactNode } from 'react'
import { Container } from '../../../atoms/container'

interface PanelProps {
  children: ReactNode
  title: string
}

export const Panel = <T,>(props: PanelProps) => {
  return <Container>{props.children}</Container>
}
