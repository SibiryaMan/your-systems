'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SidebarProps {
  currentCategory: string;
}

// --- БАЗЫ ДАННЫХ ФИЛЬТРОВ ---

const SHARED_ANALYTICS = [
  "Детекция движения", "Детекция т/с", "Детекция человека", "Пересечение линии", 
  "Периметр", "Вторжение в зону", "Изменение сцены", "Захват лиц", 
  "Подсчет людей", "Скопление людей", "Праздношатание", "Оставленные предметы", 
  "Распознавание лиц", "Распознавание автомобильных номеров"
];

const CAMERA_FILTERS: Record<string, string[]> = {
  "Бренд": ["Hikvision", "HiWatch", "iFlou", "Ezviz", "TRASSIR", "Dahua", "LTV", "Tiandy"],
  "Тип корпуса": ["Купол", "Цилиндр", "Компактный", "Рыбий глаз", "Взрывозащищенный"],
  "Исполнение": ["Внутреннее", "Уличное", "Взрывозащищенное"],
  "Разрешение, Мп": ["2", "4", "5", "6", "8", "12"],
  "Тип объектива": ["Фиксированный", "Вариофокальный", "Моторизированный"],
  "Фокусное расстояние, мм": ["2.7 - 12", "2.7 - 13.5", "2.8", "2.8 - 12", "3.6", "4"],
  "Подсветка, м": ["от 1 до 15 м", "от 20 до 40 м", "от 45 до 90 м", "от 100 до 200 м"],
  "Слот под SD-карту": ["да", "нет"],
  "Wi-Fi": ["да", "нет"],
  "PIR-датчик": ["да", "нет"],
  "Пылевлагозащита": ["IP40", "IP42", "IP54", "IP65", "IP66", "IP67", "IP68", "Нет"],
  "IK": ["08", "10", "нет"],
  "Аудио": ["Аудиовход", "Аудиовыход", "Динамик", "Микрофон"],
  "Тревожный вход/выход": ["да", "нет"],
  "Питание": ["AC 24В", "DC 12В", "PoE"],
  "Видеоаналитика": SHARED_ANALYTICS
};

const NVR_FILTERS: Record<string, string[]> = {
  "Бренд": ["Hikvision", "HiWatch", "Dahua", "TRASSIR", "LTV", "Tiandy"],
  "Видеоаналитика": SHARED_ANALYTICS,
  "Количество каналов": ["4", "8", "16", "32", "64", "128"],
  "Пропускная способность": ["40 Мбит/с", "60 Мбит/с", "80 Мбит/с", "160 Мбит/с", "256 Мбит/с", "320 Мбит/с"],
  "Макс. разрешение записи": ["2 Мп", "4 Мп", "5 Мп", "6 Мп", "8 Мп", "12 Мп"],
  "Количество HDD": ["1", "2", "4", "8", "16", "24"],
  "Трев. входы/выходы": ["да", "нет"],
  "Аудиовходы/выходы": ["да", "нет"],
  "Видеовыходы": ["HDMI", "VGA", "BNC"],
  "Особенности": ["PoE коммутатор", "Wi-Fi", "eSATA", "RAID 0/1/5/10", "SFP порт"],
  "LAN порты": ["1 x RJ45", "2 x RJ45", "4 x RJ45"]
};

const SWITCH_FILTERS: Record<string, string[]> = {
  "Бренд": ["Aquarius", "Arista", "Aruba", "Asterfusion", "BDCOM", "Brocade", "Caswell", "Ciena", "Cisco", "D-Link", "Dahua", "Dell", "Edgecore Networks", "Extreme Networks", "Fujitsu", "H3C", "HP", "Huawei", "Juniper Networks", "MOXA", "MikroTik", "OSNOVO", "Orion Networks", "POWERTONE", "Ruijie Networks", "SNR", "TFortis", "Teltonika", "Tp-Link", "Ubiquiti", "Zyxel", "Дронсхаб"],
  "Тип коммутатора": ["PoE", "Обычный (non-PoE)", "Промышленный", "Управляемый", "Неуправляемый"],
  "Количество портов Downlink": ["4", "8", "16", "24", "48"],
  "Количество портов Uplink": ["1", "2", "4"],
  "Количество портов PoE": ["4", "8", "16", "24", "48", "Нет"],
  "Количество портов Downlink SFP": ["1", "2", "4", "8", "Нет"],
  "Количество портов Uplink SFP": ["1", "2", "4", "Нет"],
  "Гигабитные порты": ["Все порты 1000", "Только Uplink", "Нет"],
  "Общий бюджет PoE (Вт)": ["до 60 Вт", "61-120 Вт", "121-250 Вт", "от 250 Вт"],
  "Макс. мощность PoE порта": ["15.4 Вт", "30 Вт", "60 Вт", "90 Вт"],
  "Особенности": ["Extend 250м", "Watchdog", "Грозозащита", "VLAN изоляция", "Дисплей"],
  "Питание": ["AC 220В", "DC 12В", "DC 48В", "Внешний БП"],
  "Способ установки": ["В 19\" стойку", "Настольный", "На DIN-рейку", "Настенный"]
};

const ROUTER_FILTERS: Record<string, string[]> = {
  "Бренд": ["MikroTik", "TP-Link", "Ubiquiti", "Keenetic", "Cisco", "Huawei", "D-Link", "Ruijie", "Hikvision", "Dahua"],
  "Тип маршрутизатора": ["VPN-роутер", "Промышленный", "Wi-Fi роутер", "Mesh-система", "Проводной"],
  "Количество WAN портов": ["1 x WAN", "2 x WAN", "4 x WAN"],
  "Количество LAN портов": ["4", "5", "8", "10", "16", "24"],
  "Порты SFP / SFP+": ["1 x SFP", "2 x SFP", "4 x SFP", "Нет"],
  "Стандарт Wi-Fi": ["Wi-Fi 4 (N)", "Wi-Fi 5 (AC)", "Wi-Fi 6 (AX)", "Wi-Fi 7 (BE)", "Без Wi-Fi"],
  "PoE выход": ["Да (PoE-Out)", "Нет"],
  "USB порты": ["Для 3G/4G модема", "Для накопителя", "Нет"],
  "Особенности": ["Firewall", "Failover", "Балансировка нагрузки", "SIM-карта"],
  "Питание": ["AC 220В", "DC 12В-24В", "Passive PoE", "802.3af/at PoE"],
  "Способ установки": ["В 19\" стойку", "Настольный", "На DIN-рейку", "Настенный"]
};

const BOX_FILTERS: Record<string, string[]> = {
  "Бренд": ["ATIX", "BOXFORCAM", "Dahua", "Hikvision", "KadrOn"],
  "Материал": ["Пластик (ABS)", "Алюминиевый сплав", "Сталь", "Поликарбонат"],
  "Пылевлагозащита": ["IP44", "IP54", "IP65", "IP66", "IP67"],
  "Ударопрочность (IK)": ["IK08", "IK10", "Нет"],
  "Особенности": ["Внутренний монтаж", "Уличное исполнение", "Гермовводы", "Под камеру", "Распаячная"]
};

const MOUNT_FILTERS: Record<string, string[]> = {
  "Бренд": ["ATIX", "BOXFORCAM", "Dahua", "HiWatch", "Hikvision"],
  "Тип кронштейна": ["Настенный", "Потолочный", "На столб", "На угол", "Адаптер", "PTZ", "Парапетный"]
};

const MIC_FILTERS: Record<string, string[]> = {
  "Бренд": ["ATIX", "Dahua", "ESM", "Stelberry"],
  "Питание, В": ["DC 12В", "DC 5В-16В", "PoE"],
  "Акустическая дальность": ["до 5 м", "до 10 м", "до 15 м", "до 20 м"],
  "Частота, Гц": ["100 - 10000 Гц", "40 - 15000 Гц", "80 - 8000 Гц"]
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---

export default function Sidebar({ currentCategory }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ "Бренд": true });

  let FILTER_DATA;
  switch (currentCategory) {
    case 'registratory': FILTER_DATA = NVR_FILTERS; break;
    case 'korobki': FILTER_DATA = BOX_FILTERS; break;
    case 'kronshteiny': FILTER_DATA = MOUNT_FILTERS; break;
    case 'mikrofony': FILTER_DATA = MIC_FILTERS; break;
    case 'kommutatory': FILTER_DATA = SWITCH_FILTERS; break;
    case 'promyshlennye-kommutatory': FILTER_DATA = SWITCH_FILTERS; break;
    case 'routery': FILTER_DATA = ROUTER_FILTERS; break;
    case 'marshrutizatory': FILTER_DATA = ROUTER_FILTERS; break;
    default: FILTER_DATA = CAMERA_FILTERS;
  }

  useEffect(() => {
    const params: Record<string, string[]> = {};
    searchParams.forEach((v, k) => { params[k] = v.split(','); });
    setActiveFilters(params);
  }, [searchParams]);

  const toggleSection = (group: string) => {
    setOpenSections(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleFilter = (cat: string, val: string) => {
    const cur = activeFilters[cat] || [];
    const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
    setActiveFilters({ ...activeFilters, [cat]: next });
  };

  const applyFilters = () => {
    const p = new URLSearchParams();
    Object.entries(activeFilters).forEach(([k, v]) => { if (v.length) p.set(k, v.join(',')); });
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-[320px] bg-[#0f1116] text-white sticky top-20 h-[calc(100vh-80px)] flex flex-col border-r border-white/5 z-40 flex-shrink-0 shadow-2xl overflow-hidden">
      
      {/* HEADER: СТРОГО СЛЕВА */}
      <div className="h-24 w-full flex items-center justify-start px-10 relative border-b border-white/5 flex-shrink-0 bg-[#0f1116] z-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
        <h2 className="text-[20px] font-black uppercase tracking-[0.4em] text-white leading-none">ФИЛЬТРЫ</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
        <div className="pt-4">
          {Object.entries(FILTER_DATA).map(([group, options]) => {
            const isOpen = openSections[group];
            return (
              <section key={group} className="border-b border-white/5 last:border-0">
                <button 
                  onClick={() => toggleSection(group)}
                  className="w-full px-10 py-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className={`text-[11px] font-black uppercase tracking-[0.25em] text-left transition-colors 
                    ${isOpen ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    // {group}
                  </h3>
                  <ChevronDown size={14} className={`text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-4 px-10">
                    {options.map((opt) => {
                      const isChecked = activeFilters[group]?.includes(opt);
                      return (
                        <label key={opt} className="flex items-center group cursor-pointer">
                          <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleFilter(group, opt)} />
                          <div className={`w-4 h-4 border-2 mr-4 transition-all flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'border-gray-800 group-hover:border-gray-600'}`}>
                            {isChecked && <div className="w-1.5 h-1.5 bg-white rotate-45" />}
                          </div>
                          <span className={`text-[13px] font-medium transition-colors tracking-tight leading-tight ${isChecked ? 'text-white font-bold' : 'text-gray-400 group-hover:text-white'}`}>
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="p-8 pt-6 flex-shrink-0 bg-[#0f1116] border-t border-white/5">
        <button onClick={applyFilters} className="w-full py-5 bg-blue-600 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-white">ПРИМЕНИТЬ ПАРАМЕТРЫ</button>
      </div>
    </aside>
  );
}