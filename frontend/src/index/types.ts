interface Project {
  artifact: string
  group: string
  version: string
  platform: string
}

interface Config {
  greet: string
  delay: number
  sink: string
}

interface Info {
  project: Project
  config: Config
}

export type {
  Info,
  Project,
  Config
}
