// 最简单的测试 - 返回纯文本
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'OG API working', title: req.query.title });
}
