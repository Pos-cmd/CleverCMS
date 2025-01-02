const messages = import.meta.glob('./lang/en/**/*.json', { eager: true })

const en: Record<string, any> = {}

Object.keys(messages).forEach((path: string) => {
  const matched = path.match(/\.\/lang\/en\/(.*?)\.json/)
  if (matched) {
    const key = matched[1]
    en[key] = (messages[path] as any).default
  }
})

export default en
