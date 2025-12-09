export const PRODUCT_DATA = {
  'business-cards': {
    title: 'Визитки Стандарт',
    description: 'Классические визитки на плотной бумаге. Идеальный выбор для деловых встреч.',
    basePrice: 50, // Base price for min quantity
    images: [
      '/images/business-card-1.jpg',
      '/images/business-card-2.jpg'
    ],
    options: [
      {
        id: 'format',
        name: 'Формат',
        type: 'radio',
        values: [
          { id: '90x50', name: '90 x 50 мм', priceMod: 1 },
          { id: '85x55', name: '85 x 55 мм (Евро)', priceMod: 1 }
        ]
      },
      {
        id: 'paper',
        name: 'Бумага',
        type: 'select',
        values: [
          { id: '350_matt', name: '350 г/м² Мел матовая', priceMod: 1 },
          { id: '350_gloss', name: '350 г/м² Мел глянцевая', priceMod: 1.05 },
          { id: '450_silk', name: '450 г/м² Silk Touch (Премиум)', priceMod: 1.4 }
        ]
      },
      {
        id: 'refinement',
        name: 'Покрытие (Ламинация)',
        type: 'select',
        values: [
          { id: 'none', name: 'Без покрытия', priceMod: 1 },
          { id: 'lam_matt_10', name: 'Матовая 1+0', priceMod: 1.1 },
          { id: 'lam_matt_11', name: 'Матовая 1+1', priceMod: 1.2 },
          { id: 'lam_soft_11', name: 'Soft Touch 1+1', priceMod: 1.5 }
        ]
      },
      {
        id: 'quantity',
        name: 'Тираж',
        type: 'grid', // Special UI for quantity
        values: [
          { id: '100', name: '100 шт', price: 65 },
          { id: '250', name: '250 шт', price: 85 },
          { id: '500', name: '500 шт', price: 110 },
          { id: '1000', name: '1000 шт', price: 160 },
          { id: '2500', name: '2500 шт', price: 320 }
        ]
      },
      {
        id: 'timing',
        name: 'Срок изготовления',
        type: 'radio',
        values: [
          { id: 'standard', name: 'Стандарт (3 дня)', priceMod: 1 },
          { id: 'express', name: 'Экспресс (24ч)', priceMod: 1.5 }
        ]
      }
    ]
  }
};
