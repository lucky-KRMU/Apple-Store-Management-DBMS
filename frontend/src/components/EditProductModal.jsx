import React, { useState } from 'react';
import X from 'lucide-react/dist/esm/icons/x.js';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3.js';
import Save from 'lucide-react/dist/esm/icons/save.js';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.js';
import { api } from '../services/api.js';

export function EditProductModal({ product, categories, onClose, onUpdated }) {
  const [name, setName] = useState(product.name || '');
  const [categoryId, setCategoryId] = useState(product.category_id || categories[0]?.category_id || 'CAT-1');
  const [basePrice, setBasePrice] = useState(product.base_price || '');
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [specsText, setSpecsText] = useState(
    product.specs ? JSON.stringify(product.specs, null, 2) : '{\n  "chip": "",\n  "display": "",\n  "storage": ""\n}'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !basePrice) {
      setError('Please provide a product title and MSRP price.');
      return;
    }

    let parsedSpecs = {};
    try {
      parsedSpecs = JSON.parse(specsText);
    } catch {
      setError('Specifications must be valid JSON format.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.updateProduct(product.product_id, {
        name: name.trim(),
        category_id: categoryId,
        base_price: parseFloat(basePrice),
        image_url: imageUrl.trim() || null,
        specs: parsedSpecs
      });
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Edit Product Specification</h2>
              <p className="text-[11px] text-zinc-400 font-mono">Product ID: {product.product_id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Official Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1.5">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id} className="bg-zinc-900">
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1.5">Retail MSRP ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-white/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Product Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-zinc-300">Technical Specifications (JSONB)</label>
              <span className="text-[10px] text-zinc-500 font-mono">Valid JSON format</span>
            </div>
            <textarea
              rows={6}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-[11px] focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-black" />
              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
