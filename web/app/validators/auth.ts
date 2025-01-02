import vine from '@vinejs/vine'

const password = vine.string().minLength(8).maxLength(255)

export const registerValidator = vine.compile(
  vine.object({
    firtsname: vine.string().minLength(4).trim(),
    lastname: vine.string().minLength(4).trim(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = db.from('users').select('id').where('email', value).first()

        return !match
      }),
    password,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password,
  })
)
