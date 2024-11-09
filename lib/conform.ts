import {
  FieldMetadata,
  SubmissionResult,
  getInputProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { z } from '@/lib/zod'

export function useAppForm<ZodSchema extends z.ZodTypeAny>({
  defaultValue,
  lastResult,
  schema,
}: {
  defaultValue: z.input<ZodSchema>
  lastResult: SubmissionResult<string[]> | undefined
  schema: ZodSchema
}) {
  return useForm<z.input<ZodSchema>, z.output<ZodSchema>, string[]>({
    defaultValue,
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, { schema })
      if (submission.status === 'error') {
        console.log('form error', submission.payload, submission.error)
      }
      return submission
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })
}

export function getGroupProps<Schema>(
  metadata: FieldMetadata<Schema, any, any>,
) {
  const props = getInputProps(metadata, { type: 'text' })
  return {
    ...props,
    defaultValue: props.defaultValue as Schema | undefined,
    value: props.value as Schema | undefined,
  }
}
