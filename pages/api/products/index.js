import { products } from '../../../lib/db';
import { validateProduct } from '../../../utils/validators';
import { nanoid } from 'nanoid';
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    const { valid, errors } = validateProduct(req.body);
    if (!valid) return res.status(400).json({ errors });
    const newProd = { id: nanoid(), ...req.body };
    products.push(newProd);
    return res.status(201).json(newProd);
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}