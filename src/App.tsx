/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, MouseEvent } from "react";
import { 
  Shirt, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  Plus, 
  Mic, 
  Trash2, 
  Copy, 
  Send,
  Building2,
  Settings2,
  Paintbrush,
  Layers,
  Palette,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { COMPANIES, CATEGORIES, Category, Product } from "./constants";

type LogoType = "تطريز" | "طباعة";
type SleeveType = "نص كم" | "كم كامل";
type PatternType = "قصة" | "منغير قصة" | "تغير ياقة وسورة فقط";

interface MockupItem {
  id: string;
  company: string;
  category: Category;
  product: Product;
  sleeveType?: SleeveType;
  patternType: PatternType;
  patternDetails?: string;
  mainColor: string;
  collarColor?: string;
  cuffColor?: string;
  useBandanaColor?: boolean;
  logoType: LogoType;
  logoChest: string;
  logoBack: string;
}

export default function App() {
  const [items, setItems] = useState<MockupItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<string | null>(null);

  // Initial state for a new mockup
  const createNewItem = (): MockupItem => ({
    id: Math.random().toString(36).substr(2, 9),
    company: COMPANIES[0],
    category: CATEGORIES[0],
    product: CATEGORIES[0].products[0],
    patternType: "منغير قصة",
    patternDetails: "",
    mainColor: "#1e293b",
    logoType: "تطريز",
    logoChest: "",
    logoBack: ""
  });

  useEffect(() => {
    if (items.length === 0) {
      setItems([createNewItem()]);
    }
  }, []);

  const updateItem = (index: number, updates: Partial<MockupItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = createNewItem();
    setItems([...items, newItem]);
    setActiveTab(items.length);
  };

  const removeItem = (index: number, e: MouseEvent) => {
    e.stopPropagation();
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const startVoiceToText = (index: number, field: keyof MockupItem) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("عذراً، متصفحك لا يدعم خاصية تحويل الصوت إلى نص.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(`${index}-${field}`);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const currentValue = items[index][field] as string;
      updateItem(index, { [field]: (currentValue || "") + " " + transcript });
    };

    recognition.onerror = () => {
      setIsRecording(null);
    };

    recognition.onend = () => {
      setIsRecording(null);
    };

    recognition.start();
  };

  const formatWhatsAppMessage = (item: MockupItem) => {
    let message = `*تفاصيل الموك اب (T&G)* \n\n`;
    message += `🏢 الشركة: ${item.company}\n`;
    message += `📦 المنتج: ${item.product.name} (${item.category.name})\n`;
    
    if (item.sleeveType) {
      message += `👕 النوع: ${item.sleeveType}\n`;
    }
    
    message += `✂️ النمط: ${item.patternType}\n`;
    if (item.patternType === "قصة" && item.patternDetails) {
      message += `📝 تفاصيل القصة: ${item.patternDetails}\n`;
    }
    
    message += `🎨 اللون الأساسي: ${item.mainColor}\n`;
    
    if (item.patternType !== "منغير قصة") {
      if (item.collarColor) message += `🧣 لون الياقة: ${item.collarColor}\n`;
      if (item.cuffColor) message += `🧶 لون الإسورة: ${item.cuffColor}\n`;
      if (item.useBandanaColor) message += `🧢 البندنا: نعم\n`;
    }
    
    message += `🪡 اللوجو: ${item.logoType}\n`;
    if (item.logoChest) message += `📍 صدر: ${item.logoChest}\n`;
    if (item.logoBack) message += `📍 ظهر: ${item.logoBack}\n`;
    
    return encodeURIComponent(message);
  };

  const sendWhatsApp = (item: MockupItem, phone: string) => {
    const message = formatWhatsAppMessage(item);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const copyToClipboard = (item: MockupItem) => {
    const message = decodeURIComponent(formatWhatsAppMessage(item));
    navigator.clipboard.writeText(message);
    alert("تم نسخ التفاصيل بنجاح!");
  };

  if (items.length === 0) return null;

  const currentItem = items[activeTab];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col p-4 md:p-6" dir="rtl">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">T&G</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">نظام تكوين الطلبات الموحد</h1>
            <p className="text-xs text-slate-500 font-medium">تخصيص كامل لليونيفورم - الإصدار 2.5</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-bold text-slate-600">الشركة:</label>
          <select 
            value={currentItem.company}
            onChange={(e) => updateItem(activeTab, { company: e.target.value })}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-40 md:w-48 font-medium"
          >
            {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <button 
            onClick={addItem}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            <span>طلب جديد</span>
          </button>
        </div>
      </header>

      {/* Tabs for Multiple Mockups */}
      {items.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scroll-smooth">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
                activeTab === idx 
                  ? "bg-slate-900 text-white border-slate-900" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>نموذج {idx + 1}</span>
              <Trash2 
                size={14} 
                onClick={(e) => removeItem(idx, e)}
                className={`transition-colors ${activeTab === idx ? "hover:text-red-400" : "hover:text-red-500"}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        
        {/* Column 1: Product Selection */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden max-h-[85vh]">
          <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-sm flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Layers size={16} className="text-slate-400" />
              1. اختيار المنتج
            </span>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px]">القوائم</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateItem(activeTab, { category: cat, product: cat.products[0] })}
                className={`w-full text-right p-3 text-sm rounded-lg transition-all font-medium flex items-center justify-between group ${
                  currentItem.category.id === cat.id 
                    ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{cat.name}</span>
                <ChevronLeft size={14} className={`transition-transform ${currentItem.category.id === cat.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
              </button>
            ))}
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">الصنف المحدد:</label>
            <select 
              value={currentItem.product.id}
              onChange={(e) => updateItem(activeTab, { product: currentItem.category.products.find(p => p.id === e.target.value)! })}
              className="w-full p-2.5 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
            >
              {currentItem.category.products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Column 2: Customization & Colors */}
        <div className="md:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 max-h-[85vh]">
          <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-sm flex items-center gap-2">
            <Settings2 size={16} className="text-slate-400" />
            2. تفاصيل الموديل والتلوين
          </div>
          <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Toggles: Sleeve & Style */}
            {(currentItem.category.id === "tshirts" || currentItem.product.hasSleeveOption) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">نوع الكم</label>
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                    {["نص كم", "كم كامل"].map((type) => (
                      <button 
                        key={type}
                        onClick={() => updateItem(activeTab, { sleeveType: type as SleeveType })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          currentItem.sleeveType === type 
                            ? "bg-white text-indigo-700 shadow-sm border border-slate-200" 
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">نوع القصة</label>
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                    {[
                      { label: "بدون", value: "منغير قصة" },
                      { label: "قصة", value: "قصة" },
                      { label: "ياقة/أسورة", value: "تغير ياقة وسورة فقط" }
                    ].map((opt) => (
                      <button 
                        key={opt.value}
                        onClick={() => updateItem(activeTab, { patternType: opt.value as PatternType })}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                          currentItem.patternType === opt.value 
                            ? "bg-white text-indigo-700 shadow-sm border border-slate-200" 
                            : "text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pattern Details Area - Conditional */}
            <AnimatePresence>
              {currentItem.patternType === "قصة" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">تفاصيل القصة المخصصة</label>
                  <div className="relative">
                    <textarea 
                      value={currentItem.patternDetails || ""}
                      onChange={(e) => updateItem(activeTab, { patternDetails: e.target.value })}
                      className="w-full p-4 text-sm border-2 border-indigo-100 rounded-xl bg-indigo-50/30 focus:bg-white focus:border-indigo-500 outline-none min-h-[120px] transition-all"
                      placeholder="أدخل هنا تفاصيل القصة المطلوبة بدقة..."
                    />
                    <button 
                      onClick={() => startVoiceToText(activeTab, "patternDetails")}
                      className={`absolute bottom-3 left-3 p-2 rounded-lg transition-all ${
                        isRecording === `${activeTab}-patternDetails` 
                          ? "bg-red-500 text-white animate-pulse" 
                          : "bg-white border text-slate-400 hover:text-indigo-600 shadow-sm"
                      }`}
                    >
                      <Mic size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Color Pickers */}
            <div className="space-y-6">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">لوحة الألوان</label>
              
              <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50 border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-inner border border-white" 
                    style={{ backgroundColor: currentItem.mainColor }}
                  ></div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">لون التيشرت الأساسي</span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{currentItem.mainColor.toUpperCase()}</span>
                  </div>
                </div>
                <input 
                  type="color" 
                  value={currentItem.mainColor} 
                  onChange={(e) => updateItem(activeTab, { mainColor: e.target.value })}
                  className="w-10 h-10 cursor-pointer border-0 bg-transparent"
                />
              </div>

              {(currentItem.patternType !== "منغير قصة") && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="p-3 border rounded-xl bg-white flex flex-col items-center gap-3 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-500">الياقة والباندانا</span>
                    <div 
                      className="w-full h-10 rounded-lg border-2 border-slate-100 shadow-inner" 
                      style={{ backgroundColor: currentItem.collarColor || "#ffffff" }}
                    ></div>
                    <input 
                      type="color" 
                      value={currentItem.collarColor || "#ffffff"} 
                      onChange={(e) => updateItem(activeTab, { collarColor: e.target.value })}
                      className="w-full h-2 rounded cursor-pointer appearance-none"
                    />
                  </div>
                  <div className="p-3 border rounded-xl bg-white flex flex-col items-center gap-3 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-500">الأسورة والسوار</span>
                    <div 
                      className="w-full h-10 rounded-lg border-2 border-slate-100 shadow-inner" 
                      style={{ backgroundColor: currentItem.cuffColor || "#ffffff" }}
                    ></div>
                    <input 
                      type="color" 
                      value={currentItem.cuffColor || "#ffffff"} 
                      onChange={(e) => updateItem(activeTab, { cuffColor: e.target.value })}
                      className="w-full h-2 rounded cursor-pointer appearance-none"
                    />
                  </div>
                </motion.div>
              )}

              {currentItem.patternType !== "منغير قصة" && (
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <input 
                    type="checkbox" 
                    id="bandana"
                    checked={currentItem.useBandanaColor}
                    onChange={(e) => updateItem(activeTab, { useBandanaColor: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="bandana" className="text-sm font-bold text-indigo-900 cursor-pointer">تفعيل البندانا بنفس لون الياقة</label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Logo Details & Final Options */}
        <div className="md:col-span-4 flex flex-col gap-6 max-h-[85vh]">
          {/* Logo Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[65%]">
            <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-sm flex items-center gap-2">
              <ImageIcon size={16} className="text-slate-400" />
              3. تفاصيل اللوجو والعلامة
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
                {["تطريز", "طباعة"].map((type) => (
                  <button 
                    key={type}
                    onClick={() => updateItem(activeTab, { logoType: type as LogoType })}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      currentItem.logoType === type 
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200" 
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">تفاصيل لوجو الصدر</label>
                  <textarea 
                    value={currentItem.logoChest}
                    onChange={(e) => updateItem(activeTab, { logoChest: e.target.value })}
                    className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none transition-all"
                    placeholder="لوجو دائري، جهة اليسار، 5 سم..."
                  />
                  <button 
                    onClick={() => startVoiceToText(activeTab, "logoChest")}
                    className={`absolute left-3 bottom-3 p-2 rounded-lg transition-all ${
                      isRecording === `${activeTab}-logoChest` 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-white border text-slate-400 hover:text-indigo-600 shadow-sm"
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">تفاصيل لوجو الظهر</label>
                  <textarea 
                    value={currentItem.logoBack}
                    onChange={(e) => updateItem(activeTab, { logoBack: e.target.value })}
                    className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none transition-all"
                    placeholder="اسم الشركة بالعرض، خلفية الظهر..."
                  />
                  <button 
                    onClick={() => startVoiceToText(activeTab, "logoBack")}
                    className={`absolute left-3 bottom-3 p-2 rounded-lg transition-all ${
                      isRecording === `${activeTab}-logoBack` 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-white border text-slate-400 hover:text-indigo-600 shadow-sm"
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <button 
              onClick={() => copyToClipboard(currentItem)}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Copy size={18} />
              <span>استخراج نسخة الموك اب</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => sendWhatsApp(currentItem, "201158159732")}
                className="bg-emerald-600 text-white p-3 rounded-xl font-bold text-center flex flex-col items-center gap-1 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <MessageSquare size={14} />
                  <span>واتساب أنس</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">01158159732</span>
              </button>
              <button 
                onClick={() => sendWhatsApp(currentItem, "201094526896")}
                className="bg-emerald-600 text-white p-3 rounded-xl font-bold text-center flex flex-col items-center gap-1 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <MessageSquare size={14} />
                  <span>واتساب عبدو</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">01094526896</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 border-t border-slate-200 pt-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>جاهز للإرسال | رقم الجلسة: {currentItem.id.toUpperCase()}</span>
        </div>
        <div className="flex gap-6 font-medium">
          <span className="hover:text-slate-600 cursor-pointer">سياسة الخصوصية</span>
          <span className="font-bold text-slate-600">T&G الموضة العملية © 2026</span>
        </div>
      </footer>
    </div>
  );
}

