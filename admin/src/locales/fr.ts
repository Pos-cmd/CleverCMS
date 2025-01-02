const messages = import.meta.glob('./lang/fr/**/*.json', { eager: true })

const fr: Record<string, any> = {}

Object.keys(messages).forEach((path: string) => {
  const matched = path.match(/\.\/lang\/fr\/(.*?)\.json/)
  if (matched) {
    const key = matched[1]
    fr[key] = (messages[path] as any).default
  }
})

export default fr
