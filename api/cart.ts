import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";

// Temporary in-memory store for carts
const carts: { [id: string]: { [name: string]: number } } = {};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    // Save cart
    const cartData = req.body as { [name: string]: number };
    const id = nanoid(8); // short unique ID
    carts[id] = cartData;
    return res.status(200).json({ id });
  } else if (req.method === "GET") {
    // Retrieve cart by ID
    const { id } = req.query;
    if (!id || Array.isArray(id) || !carts[id]) {
      return res.status(404).json({ error: "Cart not found" });
    }
    return res.status(200).json(carts[id]);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
