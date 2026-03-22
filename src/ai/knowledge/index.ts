import knowledgeJson from './maa-domain-knowledge.v1.json'

export interface KnowledgeSource {
  id: string
  note?: string
}

export interface KnowledgeEvidence {
  sourceId: string
  loc: string
}

export interface KnowledgeCard {
  id: string
  topic: string
  title: string
  rule: string
  details: string[]
  keywords: string[]
  evidence: KnowledgeEvidence[]
}

export interface KnowledgePack {
  id: string
  version: string
  generatedAt: string
  language: string
  sources: KnowledgeSource[]
  cards: KnowledgeCard[]
}

const pack = knowledgeJson as KnowledgePack

const normalize = (value: string) => value.trim().toLowerCase()
const ASCII_TOKEN_RE = /[a-z0-9_./-]{2,}/g
const CJK_TOKEN_RE = /[\u4e00-\u9fff]{2,}/g

export const maaKnowledgePack: KnowledgePack = pack

export const getKnowledgeCard = (id: string): KnowledgeCard | undefined => {
  const target = normalize(id)
  return maaKnowledgePack.cards.find(card => normalize(card.id) === target)
}

export const getKnowledgeByTopic = (topic: string): KnowledgeCard[] => {
  const target = normalize(topic)
  return maaKnowledgePack.cards.filter(card => normalize(card.topic) === target)
}

const splitQueryTerms = (query: string): string[] => {
  const normalized = normalize(query)
  if (!normalized) return []

  const terms: string[] = []
  const seen = new Set<string>()

  const push = (value: string) => {
    const token = normalize(value)
    if (!token) return
    if (token.length < 2) return
    if (seen.has(token)) return
    seen.add(token)
    terms.push(token)
  }

  push(normalized)

  const asciiMatches = normalized.match(ASCII_TOKEN_RE) ?? []
  for (const match of asciiMatches) push(match)

  const cjkMatches = normalized.match(CJK_TOKEN_RE) ?? []
  for (const match of cjkMatches) push(match)

  const splitMatches = normalized
    .split(/[\s,;:|()[\]{}<>]+/)
    .map(part => part.trim())
    .filter(Boolean)
  for (const match of splitMatches) push(match)

  return terms
}

const scoreByToken = (field: string, token: string, exactWeight: number, includeWeight: number): number => {
  if (!field || !token) return 0
  if (field === token) return exactWeight
  if (field.includes(token)) return includeWeight
  return 0
}

const scoreCard = (card: KnowledgeCard, tokens: string[]): number => {
  if (tokens.length === 0) return 0

  const id = normalize(card.id)
  const topic = normalize(card.topic)
  const title = normalize(card.title)
  const rule = normalize(card.rule)
  const details = card.details.map(normalize)
  const keywords = card.keywords.map(normalize)

  let score = 0

  for (const token of tokens) {
    score += scoreByToken(id, token, 16, 10)
    score += scoreByToken(topic, token, 14, 8)
    score += scoreByToken(title, token, 14, 9)
    score += scoreByToken(rule, token, 8, 4)

    for (const keyword of keywords) {
      score += scoreByToken(keyword, token, 13, 8)
    }

    for (const detail of details) {
      score += scoreByToken(detail, token, 6, 3)
    }

    if (token.length >= 6 && (token.includes('.') || token.includes('_'))) {
      if (keywords.some(keyword => keyword === token)) score += 6
      if (id.includes(token) || title.includes(token)) score += 4
    }
  }

  if (tokens.length > 1) {
    const hitCount = tokens.filter(token =>
      id.includes(token)
      || topic.includes(token)
      || title.includes(token)
      || rule.includes(token)
      || keywords.some(keyword => keyword.includes(token))
      || details.some(detail => detail.includes(token))
    ).length
    score += Math.min(12, hitCount * 2)
  }

  return score
}

export const searchKnowledge = (query: string, limit = 12): KnowledgeCard[] => {
  const tokens = splitQueryTerms(query)
  if (tokens.length === 0) return []

  const scored = maaKnowledgePack.cards
    .map((card) => {
      return {
        card,
        score: scoreCard(card, tokens),
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.card.id.localeCompare(b.card.id)
    })

  return scored.slice(0, Math.max(1, limit)).map(item => item.card)
}

export const getKnowledgeSummary = (): { cardCount: number; topicCount: number; topics: string[] } => {
  const topics = Array.from(new Set(maaKnowledgePack.cards.map(card => card.topic))).sort()
  return {
    cardCount: maaKnowledgePack.cards.length,
    topicCount: topics.length,
    topics,
  }
}
