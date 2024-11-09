import { FieldMetadata } from '@conform-to/react'
import { ComponentProps } from 'react'

import { Field } from '@/components/ui/snippets/field'

interface Props extends ComponentProps<typeof Field> {
  field: FieldMetadata
}

export function BasicField({ field, ...rest }: Props) {
  return (
    <Field
      invalid={!!field.errors}
      errorText={field.errors?.join(' ')}
      {...rest}
    />
  )
}
