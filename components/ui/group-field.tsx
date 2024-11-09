import { Fieldset } from '@chakra-ui/react'
import { FieldMetadata } from '@conform-to/react'
import { ComponentProps, ReactNode } from 'react'

interface Props extends ComponentProps<typeof Fieldset.Root> {
  field: FieldMetadata
  label?: ReactNode
  helperText?: ReactNode
}

export function GroupField({
  field,
  label,
  helperText,
  children,
  ...rest
}: Props) {
  const errorText = field.errors?.join(' ')

  return (
    <Fieldset.Root invalid={!!field.errors} {...rest}>
      <Fieldset.Legend>{label}</Fieldset.Legend>
      {children}
      {helperText && <Fieldset.HelperText>{helperText}</Fieldset.HelperText>}
      {errorText && <Fieldset.ErrorText>{errorText}</Fieldset.ErrorText>}
    </Fieldset.Root>
  )
}
