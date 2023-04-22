export type Faction = {
    name: string
    leader: string
    story: string
    content: string
    tokens:number
    chunks: PGChunk[]
}

export type PGChunk = {
    essay_title: string
    esay_url: string
    essay_date: string
    content: string
    content_tokens: number
    embedding: number[]
}

// export type PGJSON = {
//     tokens: number
//     essays: PGEssay[]
// }