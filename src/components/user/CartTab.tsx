import React, { useState } from 'react';
import { CartTabProps } from '@/models/Cart';
import { fetchAddressByCep, maskCep } from '@/utils/cep';

const CartTab: React.FC<CartTabProps> = ({
  cartDetails,
  total,
  checkoutStep,
  setCheckoutStep,
  address,
  setAddress,
  addToCart,
  handlePlaceOrder
}) => {
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const onCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCep(e.target.value);
    const rawValue = maskedValue.replace(/\D/g, '');

    setAddress({ ...address, zip: maskedValue });

    if (rawValue.length === 8) {
      setIsSearchingCep(true);
      const result = await fetchAddressByCep(rawValue);

      if (!result.error) {
        setAddress({
          ...address,
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
      {/* ... (Header mantido igual) ... */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter">Finalizar Compra</h2>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
            {checkoutStep === 'cart' ? 'Conferir Itens' : checkoutStep === 'address' ? 'Dados de Entrega' : 'Pagamento'}
          </p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`w-8 h-1 rounded-full transition-all ${(step === 1 && checkoutStep === 'cart') || (step === 2 && checkoutStep === 'address') || (step === 3 && checkoutStep === 'payment') ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* PASSO 1: LISTA DE PRODUTOS (Mantido igual) */}
        {checkoutStep === 'cart' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* ... conteúdo do carrinho ... */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartDetails.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-white" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm dark:text-white leading-tight">{item.product.name}</h4>
                    <p className="text-blue-600 font-black text-sm">R$ {item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1 rounded-xl border dark:border-gray-700 shadow-sm">
                    <button onClick={() => addToCart(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-red-500 rounded-lg transition-colors text-lg">-</button>
                    <span className="font-black w-4 text-center dark:text-white text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-green-50 text-green-500 rounded-lg transition-colors text-lg">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total do Pedido</span>
                <span className="text-2xl font-black text-green-600">R$ {total.toFixed(2)}</span>
              </div>
              <button disabled={cartDetails.length === 0} onClick={() => setCheckoutStep('address')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50">PROSSEGUIR PARA ENTREGA</button>
            </div>
          </div>
        )}

        {/* PASSO 2: ENDEREÇO COM VIACEP */}
        {checkoutStep === 'address' && (
          <div className="space-y-5 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 gap-4">
              {/* CEP Primeiro para disparar a busca */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                  CEP
                  {isSearchingCep && <span className="text-blue-600 animate-pulse italic">Buscando...</span>}
                </label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="00000000"
                  className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  value={address.zip}
                  onChange={onCepChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rua e Número</label>
                <input
                  type="text"
                  placeholder="Rua, 123"
                  className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={address.street}
                  onChange={e => setAddress({ ...address, street: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cidade / UF</label>
                <input
                  type="text"
                  readOnly
                  placeholder="Cidade"
                  className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 outline-none cursor-not-allowed"
                  value={address.city}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setCheckoutStep('cart')} className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-2xl font-bold">VOLTAR</button>
              <button
                disabled={!address.street || !address.city || address.street.length < 5}
                onClick={() => setCheckoutStep('payment')}
                className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                PAGAMENTO
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: PAGAMENTO (Mantido igual) */}
        {checkoutStep === 'payment' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl mb-4 text-center">
              <p className="text-green-700 dark:text-green-400 text-xs font-bold">🛒 Quase lá! Selecione a forma de pagamento.</p>
            </div>
            <button className="w-full p-5 border-2 border-blue-600 rounded-2xl flex items-center gap-4 dark:text-white bg-blue-50/50 dark:bg-blue-900/20 group">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white"><span className="material-symbols-outlined text-3xl">pix</span></div>
              <div className="text-left flex-1"><p className="font-black">PIX</p><p className="text-xs text-blue-600 font-bold uppercase">Aprovação Imediata</p></div>
              <span className="material-symbols-outlined text-blue-600">check_circle</span>
            </button>
            <button className="w-full p-5 border-2 border-transparent bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center gap-4 dark:text-white opacity-50 cursor-not-allowed">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-3xl">credit_card</span></div>
              <div className="text-left"><p className="font-bold">Cartão de Crédito</p><p className="text-xs text-gray-400 uppercase">Indisponível</p></div>
            </button>
            <div className="flex gap-4 pt-4 border-t dark:border-gray-700 mt-6">
              <button onClick={() => setCheckoutStep('address')} className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-2xl font-bold">VOLTAR</button>
              <button onClick={handlePlaceOrder} className="flex-1 p-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700">FINALIZAR PEDIDO</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTab;