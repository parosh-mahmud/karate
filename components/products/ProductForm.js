import { useState, useEffect } from 'react';
export default function ProductForm({ initial = { name: '', price: '', image: '', description: '' }, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => setForm(initial), [initial]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <label className="block mb-1">Price (৳)</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
      <div>
        <label className="block mb-1">Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
    </form>
  );
}