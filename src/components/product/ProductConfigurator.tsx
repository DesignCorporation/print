'use client';

import { useState, useEffect } from 'react';
import { Check, Info, Truck } from 'lucide-react';
import { clsx } from 'clsx';
import { useCartStore, UploadedFileRef } from '@/lib/store';
import { FileUpload } from './FileUpload';

// Types (DB-driven)
type OptionValue = { id: string; name: string; priceMod?: number; price?: number; isDefault?: boolean };
type OptionGroup = { id: string; name: string; type: string; values: OptionValue[] };
type ProductData = { title: string; description: string; basePrice: number; options: OptionGroup[]; productId?: number };

export default function ProductConfigurator({ product }: { product: ProductData }) {
  // State for selected options: { format: '90x50', paper: '350_matt', ... }
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState(0); // line total netto
  const [unitPrice, setUnitPrice] = useState(0); // unit netto
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileRef[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  // Initialize defaults
  useEffect(() => {
    const defaults: Record<string, string> = {};
    product.options.forEach(opt => {
      const defaultVal = opt.values.find(v => v.isDefault) ?? opt.values[0];
      defaults[opt.id] = defaultVal?.id;
    });
    setSelections(defaults);
  }, [product]);

  // Calculate Price
  useEffect(() => {
    if (Object.keys(selections).length === 0) return;

    let price = 0;
    let unit = 0;
    let qtyCount = 1;
    
    // 1. Find base quantity price
    const qtyOption = product.options.find(o => o.id === 'quantity');
    const selectedQty = qtyOption?.values.find(v => v.id === selections['quantity']);
    
    if (selectedQty?.price) {
        price = selectedQty.price;
        unit = selectedQty.price;
        qtyCount = parseInt(selectedQty.id, 10) || 1;
    } else {
        price = product.basePrice;
        unit = product.basePrice;
    }

    // 2. Apply modifiers
    product.options.forEach(opt => {
        if (opt.id === 'quantity') return; // handled above
        const val = opt.values.find(v => v.id === selections[opt.id]);
        if (val?.priceMod) {
            price *= val.priceMod;
            unit *= val.priceMod;
        }
    });

    const lineTotal = price * qtyCount;
    setUnitPrice(Number(unit.toFixed(2)));
    setTotalPrice(Number(lineTotal.toFixed(2)));
  }, [selections, product]);

  const handleSelect = (optionId: string, valueId: string) => {
    setSelections(prev => ({ ...prev, [optionId]: valueId }));
  };

  const handleAddToCart = () => {
    const qtyVal = parseInt(selections['quantity'] || '1', 10);
    const qtyUnits = Number.isFinite(qtyVal) && qtyVal > 0 ? qtyVal : 1;
    addItem({
      productId: product.productId ?? 0,
      title: product.title,
      options: selections,
      price: unitPrice,
      quantity: qtyUnits,
      files: uploadedFiles,
    });
    alert('Товар добавлен в корзину!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Left: Gallery (Placeholder) */}
      <div className="lg:col-span-7">
        <div className="bg-gray-100 rounded-2xl aspect-[4/3] flex items-center justify-center text-gray-400 mb-4 sticky top-24">
            <span className="text-lg">Product Preview</span>
        </div>
      </div>

      {/* Right: Configurator */}
      <div className="lg:col-span-5 space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-gray-500">{product.description}</p>
        </div>

        {/* Options */}
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <FileUpload onChange={setUploadedFiles} />
            </div>

            {product.options.map((opt) => (
                <div key={opt.id}>
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-900 text-sm">{opt.name}</label>
                        <button className="text-brand-600 text-xs flex items-center gap-1">
                            <Info size={12} /> Детали
                        </button>
                    </div>

                    {/* Render different inputs based on type */}
                    {opt.type === 'radio' && (
                        <div className="grid grid-cols-2 gap-3">
                            {opt.values.map(val => (
                                <button
                                    key={val.id}
                                    onClick={() => handleSelect(opt.id, val.id)}
                                    className={clsx(
                                        "px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between",
                                        selections[opt.id] === val.id 
                                            ? "border-brand-600 bg-brand-50 text-brand-900 ring-1 ring-brand-600" 
                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    )}
                                >
                                    {val.name}
                                    {selections[opt.id] === val.id && <Check size={16} className="text-brand-600" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {opt.type === 'select' && (
                        <div className="grid grid-cols-1 gap-2">
                             {opt.values.map(val => (
                                <button
                                    key={val.id}
                                    onClick={() => handleSelect(opt.id, val.id)}
                                    className={clsx(
                                        "px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between",
                                        selections[opt.id] === val.id 
                                            ? "border-brand-600 bg-brand-50 text-brand-900 ring-1 ring-brand-600" 
                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    )}
                                >
                                    {val.name}
                                    {selections[opt.id] === val.id && <Check size={16} className="text-brand-600" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {opt.type === 'grid' && (
                        <div className="grid grid-cols-3 gap-3">
                            {opt.values.map(val => (
                                <button
                                    key={val.id}
                                    onClick={() => handleSelect(opt.id, val.id)}
                                    className={clsx(
                                        "px-2 py-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center",
                                        selections[opt.id] === val.id 
                                            ? "border-brand-600 bg-brand-50 text-brand-900 ring-1 ring-brand-600" 
                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    )}
                                >
                                    <span className="font-bold text-sm block">{val.name}</span>
                                    {/* Show unit price estimate if needed */}
                                    <span className="text-xs text-gray-400 mt-1">
                                        {(val.price! / parseInt(val.id)).toFixed(2)} zł/шт
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Sticky Bottom Bar / Summary */}
        <div className="bg-white border-t border-gray-200 pt-6 mt-8">
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Truck size={16} className="text-green-500" />
                    <span>Доставка: <strong>Бесплатно</strong></span>
                </div>
                <div>
                    Срок: <strong>3-4 дня</strong>
                </div>
            </div>
            
            <div className="flex items-end justify-between gap-4">
                <div>
                    <span className="block text-sm text-gray-500">Итого (Netto):</span>
                    <span className="block text-4xl font-bold text-brand-900">{totalPrice} zł</span>
                    <span className="text-xs text-gray-400">+ 23% VAT = {(totalPrice * 1.23).toFixed(2)} zł</span>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-brand-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                    В корзину
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
