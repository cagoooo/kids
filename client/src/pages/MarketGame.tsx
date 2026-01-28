import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";
import { ShoppingCart, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { id: "apple", name: "蘋果", emoji: "🍎", price: 10 },
  { id: "milk", name: "牛奶", emoji: "🥛", price: 20 },
  { id: "bread", name: "麵包", emoji: "🍞", price: 15 },
  { id: "banana", name: "香蕉", emoji: "🍌", price: 5 },
  { id: "egg", name: "雞蛋", emoji: "🥚", price: 8 },
  { id: "cheese", name: "起司", emoji: "🧀", price: 25 },
  { id: "carrot", name: "胡蘿蔔", emoji: "🥕", price: 6 },
  { id: "cookie", name: "餅乾", emoji: "🍪", price: 12 },
];

interface Coin {
  value: number;
  emoji: string;
  color: string;
}

const COINS: Coin[] = [
  { value: 10, emoji: "🔴", color: "bg-red-400" },
  { value: 5, emoji: "🟡", color: "bg-yellow-400" },
  { value: 1, emoji: "🟤", color: "bg-amber-600" },
];

interface ShoppingItem {
  product: Product;
  quantity: number;
}

export default function MarketGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [cart, setCart] = useState<ShoppingItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [phase, setPhase] = useState<"shopping" | "payment">("shopping");
  const [showResult, setShowResult] = useState<"success" | "fail" | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const generateShoppingList = () => {
    const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
    const itemCount = Math.min(2 + Math.floor(questionIndex / 3), 3);
    const items: ShoppingItem[] = shuffled.slice(0, itemCount).map(p => ({
      product: p,
      quantity: 1
    }));
    return items;
  };

  useEffect(() => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }
    const list = generateShoppingList();
    setShoppingList(list);
    setCart([]);
    setPaymentAmount(0);
    setPhase("shopping");
    setShowResult(null);
    
    const itemNames = list.map(i => `${i.quantity}個${i.product.name}`).join("和");
    speak(`請幫媽媽買${itemNames}！`);
  }, [questionIndex]);

  const addToCart = (product: Product) => {
    const listItem = shoppingList.find(i => i.product.id === product.id);
    if (!listItem) return;

    const cartItem = cart.find(i => i.product.id === product.id);
    const currentQty = cartItem?.quantity || 0;
    
    if (currentQty < listItem.quantity) {
      if (cartItem) {
        setCart(cart.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ));
      } else {
        setCart([...cart, { product, quantity: 1 }]);
      }
      speak(product.name);
    }
  };

  const isCartComplete = () => {
    return shoppingList.every(listItem => {
      const cartItem = cart.find(c => c.product.id === listItem.product.id);
      return cartItem && cartItem.quantity >= listItem.quantity;
    });
  };

  const goToPayment = () => {
    if (isCartComplete()) {
      setPhase("payment");
      speak(`總共${totalPrice}元，請用硬幣付款！`);
    } else {
      speak("購物籃還沒裝滿喔！");
    }
  };

  const addCoin = (coin: Coin) => {
    setPaymentAmount(prev => prev + coin.value);
  };

  const checkPayment = () => {
    if (paymentAmount === totalPrice) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      speak("付款成功！謝謝光臨！");
      setShowResult("success");
      setScore(s => s + 10);
      setTimeout(() => {
        setQuestionIndex(i => i + 1);
      }, 1500);
    } else if (paymentAmount > totalPrice) {
      speak("錢太多了，重新付款！");
      setShowResult("fail");
      setTimeout(() => {
        setPaymentAmount(0);
        setShowResult(null);
      }, 1000);
    } else {
      speak("錢還不夠喔！");
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
    setCart([]);
    setPaymentAmount(0);
    setPhase("shopping");
    setShowResult(null);
  };

  return (
    <Layout>
      <GameShell
        title="超市小幫手"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="market"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-blue))] text-[hsl(var(--macaron-blue-dark))]"
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          {/* Shopping List */}
          <div className="bg-white/60 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md">
            <h4 className="font-bold text-sm sm:text-base mb-2 text-center">購物清單</h4>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
              {shoppingList.map((item) => {
                const inCart = cart.find(c => c.product.id === item.product.id)?.quantity || 0;
                const isComplete = inCart >= item.quantity;
                return (
                  <div 
                    key={item.product.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <span className="text-lg sm:text-xl">{item.product.emoji}</span>
                    <span className="text-xs sm:text-sm">{item.quantity}個</span>
                    <span className="text-xs text-gray-500">${item.product.price}</span>
                    {isComplete && <Check className="w-3 h-3 text-green-500" />}
                  </div>
                );
              })}
              <div className="w-full text-center text-xs sm:text-sm font-bold text-gray-600 mt-1">
                總計：${totalPrice}
              </div>
            </div>
          </div>

          {phase === "shopping" ? (
            <>
              {/* Product Shelf */}
              <div className="bg-amber-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-amber-200">
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {shoppingList.map((item) => (
                    <motion.button
                      key={item.product.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(item.product)}
                      className="bg-white p-2 sm:p-3 rounded-xl shadow-md flex flex-col items-center gap-1"
                      data-testid={`product-${item.product.id}`}
                    >
                      <span className="text-2xl sm:text-3xl">{item.product.emoji}</span>
                      <span className="text-xs font-medium">{item.product.name}</span>
                      <span className="text-xs text-gray-500">${item.product.price}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div className="flex items-center gap-2 sm:gap-3 bg-white/50 px-4 py-2 rounded-full">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <div className="flex gap-1">
                  {cart.map((item, idx) => (
                    <span key={idx} className="text-lg sm:text-xl">{item.product.emoji}</span>
                  ))}
                  {cart.length === 0 && <span className="text-gray-400 text-sm">購物籃是空的</span>}
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPayment}
                disabled={!isCartComplete()}
                className="bg-[hsl(var(--macaron-green))] text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg disabled:opacity-50"
                data-testid="button-checkout"
              >
                去結帳
              </motion.button>
            </>
          ) : (
            <>
              {/* Payment Area */}
              <div className="bg-white/60 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md text-center">
                <h4 className="font-bold text-base sm:text-lg mb-3">請付 ${totalPrice}</h4>
                <div className="text-3xl sm:text-4xl font-bold mb-4">
                  已付：<span className={paymentAmount === totalPrice ? 'text-green-500' : paymentAmount > totalPrice ? 'text-red-500' : ''}>${paymentAmount}</span>
                </div>
                
                {/* Coins */}
                <div className="flex gap-2 sm:gap-3 justify-center mb-4">
                  {COINS.map((coin) => (
                    <motion.button
                      key={coin.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addCoin(coin)}
                      disabled={showResult !== null}
                      className={`
                        ${coin.color} w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                        flex items-center justify-center font-bold text-white text-sm sm:text-base
                        shadow-lg border-4 border-white
                      `}
                      data-testid={`coin-${coin.value}`}
                    >
                      ${coin.value}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkPayment}
                  disabled={showResult !== null}
                  className="bg-[hsl(var(--macaron-yellow))] text-[hsl(var(--macaron-yellow-dark))] px-6 py-3 rounded-full font-bold shadow-lg"
                  data-testid="button-pay"
                >
                  確認付款
                </motion.button>
              </div>
            </>
          )}

          {/* Result Message */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`
                  px-6 py-3 rounded-full font-bold text-lg
                  ${showResult === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"}
                `}
              >
                {showResult === "success" ? "付款成功！🎉" : "金額不對喔！💰"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GameShell>
    </Layout>
  );
}
