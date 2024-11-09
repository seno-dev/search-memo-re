// eslint-disable-next-line no-restricted-imports
import { z } from 'zod'

z.setErrorMap((issue, { defaultError }) => {
  switch (issue.code) {
    case 'too_small':
      switch (issue.type) {
        case 'string':
          return {
            message:
              issue.minimum === 1
                ? '入力してください'
                : `${issue.minimum}文字以上入力してください`,
          }
        case 'number':
          return { message: `${issue.minimum}以上の数字を入力してください` }
        case 'array':
          return { message: `${issue.minimum}個以上選択してください` }
        default:
          return { message: defaultError }
      }

    case 'too_big':
      switch (issue.type) {
        case 'string':
          return { message: `${issue.maximum}文字以内で入力してください` }
        case 'number':
          return { message: `${issue.maximum}以下の数字を入力してください` }
        case 'array':
          return { message: `選択できるのは${issue.maximum}個までです` }
        default:
          return { message: defaultError }
      }

    case 'invalid_string':
      switch (issue.validation) {
        case 'email':
          return { message: '有効なメールアドレスを入力してください' }
        case 'url':
          return { message: '有効なURLを入力してください' }
        default:
          return { message: defaultError }
      }

    case 'invalid_type':
      return { message: '入力してください' }

    default:
      return { message: defaultError }
  }
})

export { z }

export const zToggle = () => z.coerce.boolean()

export const zSelect = <U extends string, T extends Readonly<[U, ...U[]]>>(
  values: T,
) => z.enum(values, { message: '選択してください' })
