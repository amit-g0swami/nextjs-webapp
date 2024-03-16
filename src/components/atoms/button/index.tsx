import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnText: string | React.ReactNode
  className?: string
  disable?: boolean
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  btnText,
  disable = false,
  className = 'rounded-md bg-[#f68a1e] px-8 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
  onClick,
  ...props
}) => {
  return React.createElement(
    'button',
    {
      className,
      onClick,
      disabled: disable,
      ...props
    },
    btnText
  )
}
