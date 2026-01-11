import React, { useState } from 'react';
import { CartTabProps } from '@/models/Cart';
import { fetchAddressByCep, maskCep } from '@/utils/cep';

const CartTab: React.FC<CartTabProps> = ({
  cartDetails,
  total,
  checkoutStep, 
  address,
  addToCart,
  handlePlaceOrder
}) => {
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const currentStep = checkoutStep[0];
  const currentAddress = address[0];

  const onCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCep(e.target.value);
    const rawValue = maskedValue.replace(/\D/g, '');

    currentAddress.setAddress({ ...currentAddress, zip: maskedValue });

    if (rawValue.length === 8) {
      setIsSearchingCep(true);
      const result = await fetchAddressByCep(rawValue);

      if (!result.error) {
        currentAddress.setAddress({
          ...currentAddress,
          zip: maskedValue,
          street: result.street ? `${result.street}, ` : '',
          city: result.city
        });
      }
      setIsSearchingCep(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      
      {/* Header com lógica da nova instância checkoutStep */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter">Finalizar Compra</h2>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
            {currentStep.name === 'cart' ? 'Conferir Itens' : currentStep.name === 'address' ? 'Dados de Entrega' : 'Pagamento'}
          </p>
        </div>
        <div className="flex gap-1">
          {['cart', 'address', 'payment'].map((step, idx) => (
            <div 
              key={step} 
              className={`w-8 h-1 rounded-full transition-all ${currentStep.name === step ? 'bg-white' : 'bg-white/30'}`} 
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* PASSO 1: CARRINHO */}
        {currentStep.name === 'cart' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartDetails.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-white" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm dark:text-white leading-tight">{item.product.name}</h4>
                    <p className="text-blue-600 font-black text-sm">R$ {item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1 rounded-xl border dark:border-gray-700 shadow-sm">
                    <button onClick={() => addToCart(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-red-500 font-bold">-</button>
                    <span className="font-black w-4 text-center dark:text-white text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-green-500 font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total</span>
                <span className="text-2xl font-black text-green-600">R$ {total.toFixed(2)}</span>
              </div>
              <button 
                disabled={cartDetails.length === 0} 
                onClick={() => currentStep.setCheckoutStep('address')} 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest"
              >
                Prosseguir
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: ENDEREÇO */}
        {currentStep.name === 'address' && (
          <div className="space-y-5 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                  CEP {isSearchingCep && <span className="text-blue-600 animate-pulse">Buscando...</span>}
                </label>
                <input
                  type="text"
                  maxLength={9}
                  className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  value={currentAddress.zip}
                  onChange={onCepChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rua e Número</label>
                <div className="grid grid-cols-4 gap-2">
                   <input
                    type="text"
                    placeholder="Rua"
                    className="col-span-3 p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none"
                    value={currentAddress.street}
                    onChange={e => currentAddress.setAddress({ ...currentAddress, street: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Nº"
                    className="col-span-1 p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none"
                    value={currentAddress.number}
                    onChange={e => currentAddress.setAddress({ ...currentAddress, number: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cidade</label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed"
                  value={currentAddress.city}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => currentStep.setCheckoutStep('cart')} className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-2xl font-bold uppercase text-xs tracking-widest">Voltar</button>
              <button
                disabled={!currentAddress.street || !currentAddress.city}
                onClick={() => currentStep.setCheckoutStep('payment')}
                className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 uppercase text-xs tracking-widest disabled:opacity-50"
              >
                PAGAMENTO
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: PAGAMENTO */}
        {currentStep.name === 'payment' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
             <button className="w-full p-5 border-2 border-blue-600 rounded-2xl flex items-center gap-4 dark:text-white bg-blue-50/50 dark:bg-blue-900/20">
               <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white"><span className="material-symbols-outlined text-3xl">pix</span></div>
               <div className="text-left flex-1 font-black">PIX</div>
               <span className="material-symbols-outlined text-blue-600">check_circle</span>
             </button>
             
             <div className="flex gap-4 pt-4 border-t dark:border-gray-700 mt-6">
              <button onClick={() => currentStep.setCheckoutStep('address')} className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-2xl font-bold uppercase text-xs tracking-widest">Voltar</button>
              <button onClick={handlePlaceOrder} className="flex-1 p-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 uppercase text-xs tracking-widest">Finalizar Pedido</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTab;