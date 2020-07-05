import { BACKEND_URL } from './util'

const url = new URL(BACKEND_URL + '/api/words')
export const fetchWords = async () => {
  const words = await fetch(url)
  const wordJson = await words.json()
  return wordJson
}