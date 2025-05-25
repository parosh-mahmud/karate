import { products } from "../../../lib/db";
import { validateProduct } from "../../../utils/validators";
export default function handler(req, res) {
  const { id } = req.query;
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) return res.status(404).json({ error: "Not found" });

  if (req.method === "GET") {
    return res.status(200).json(products[index]);
  }
  if (req.method === "PUT") {
    const { valid, errors } = validateProduct(req.body);
    if (!valid) return res.status(400).json({ errors });
    products[index] = { id, ...req.body };
    return res.status(200).json(products[index]);
  }
  if (req.method === "DELETE") {
    products.splice(index, 1);
    return res.status(204).end();
  }
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
