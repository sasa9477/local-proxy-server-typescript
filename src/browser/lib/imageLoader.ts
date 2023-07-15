import path from 'path'
import fs from 'fs'

// electronで ローカル画像を表示するにはセキュリティの問題があるので base64 に変換する
export const loadImage = (url: string) => {
  const imagePath = path.resolve(__dirname, `../../src/renderer/assets/${url}`)
  if (!fs.existsSync(imagePath)) {
    return ''
  }

  const binary = fs.readFileSync(imagePath)
  const base64 = Buffer.from(binary).toString('base64')
  const extension = path.extname(url)
  return `data:image/${extension};base64,${base64}`
}
