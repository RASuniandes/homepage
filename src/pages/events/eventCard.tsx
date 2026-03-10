import type { IEEEEventResponse } from "./iEEEType";
import { 
  MapPin, Users, ChevronRight, Calendar, Share2, 
  Bookmark, ExternalLink, Globe, Clock, Award, 
  Wallet, ShieldCheck, Languages, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Card } from "../../components/ui/components"; // Assuming these exist in your UI kit
import { useState } from "react";

const BANNER_COLORS = [
  "from-blue-600 to-purple-600",
  "from-emerald-600 to-teal-600",
  "from-orange-600 to-red-600",
  "from-pink-600 to-rose-600",
  "from-indigo-600 to-blue-600",
  "from-cyan-600 to-blue-600",
];

export default function EventCard({ event, index }: { event: IEEEEventResponse; index: number }) {
  const attrs = event.attributes;
  const startDate = new Date(attrs["start-time"]);
  const endDate = new Date(attrs["end-time"]);
  const regStart = attrs["registration-start-time"] ? new Date(attrs["registration-start-time"]) : null;
  const regEnd = attrs["registration-end-time"] ? new Date(attrs["registration-end-time"]) : null;
  
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bannerColor = BANNER_COLORS[index % BANNER_COLORS.length];

  // Logical Helpers
  const isRegOpen = () => {
    const now = new Date();
    if (!regStart || !regEnd) return !!attrs["registration-url"];
    return now >= regStart && now <= regEnd;
  };

  const getPriceBadge = () => {
    if (attrs.cost) return { text: "Paid Event", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    return { text: "Free", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const getCleanLocationText = (text: string) => {
    return text.replace(/<[^>]*>/g, "").trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="group relative h-full flex flex-col border-slate-800 bg-slate-950 hover:border-blue-500/50 transition-all duration-300 shadow-xl overflow-hidden">
        
        {/* HEADER: Image & Floating Actions */}
        <div className="relative h-52 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${bannerColor} flex items-center justify-center`}>
            <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
          </div>
          <motion.img
            src={attrs.image || `https://images.unsplash.com/photo-1591115765373-520b7a217297?w=800&q=80`}
            // alt={attrs.title}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="w-full h-full object-cover transition-transform duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          {/* Top Row: Status Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <Badge className={`${getPriceBadge().color} backdrop-blur-md border`}>
                <Wallet className="w-3 h-3 mr-1" /> {getPriceBadge().text}
              </Badge>
              {attrs.cancelled && (
                <Badge className="bg-red-500 text-white animate-pulse">Cancelled</Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-blue-600 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Organizer Tag */}
          <div className="absolute bottom-4 left-4 right-4">
             <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-lg w-fit">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold">IEEE</div>
                <span className="text-xs font-medium text-white truncate max-w-[200px]">
                  {attrs["primary-host"]?.name || "IEEE RAS"}
                </span>
                <ShieldCheck className="w-3 h-3 text-blue-400" />
             </div>
          </div>
        </div>

        {/* BODY: Content & Details */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {getCleanLocationText(attrs["location-type"] as string)} Event
            </div>
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
              {attrs.title}
            </h3>
          </div>

          {/* Description */}
          {attrs.description && (
            <div 
              className="text-sm text-slate-300 line-clamp-3 prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: attrs.description }}
            />
          )}

          {/* THE TICKET BLOCK: Time & Place */}
          <div className="grid grid-cols-1 gap-2">
            {/* Date Row */}
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3 border border-slate-800">
              <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg h-10 w-10 border border-slate-700">
                <span className="text-[10px] uppercase text-slate-400 font-bold">{startDate.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-sm font-bold text-white">{startDate.getDate()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">{formatFullDate(startDate)}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({attrs["time-zone"].name})
                </p>
              </div>
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-3 border border-slate-800">
              <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg h-10 w-10 border border-slate-700 text-amber-500">
                {attrs.virtual ? <Globe className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {attrs.city ? `${attrs.city}, ${attrs["postal-code"]}` : "Global/Online"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {getCleanLocationText(attrs.building || attrs["virtual-info"] || "Address visible after registration")}
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof & Language */}
          <div className="flex items-center justify-between px-1">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="attendee" />
                </div>
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-slate-950 bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-200">
                +{attrs["ieee-attending"] || 0}
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-slate-500" /> English
              </span>
              {attrs["max-registrations"] > 0 && (
                <span className="flex items-center gap-1">
                   <Users className="w-3.5 h-3.5 text-slate-500" /> {attrs["max-registrations"]} max
                </span>
              )}
            </div>
          </div>

          {/* FOOTER: Primary Action */}
          <div className="mt-auto pt-4 flex gap-2">
            <button 
              onClick={() => window.open(attrs["registration-url"], "_blank")}
              disabled={!isRegOpen() || attrs.cancelled}
              className={`flex-[3] flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all
                ${isRegOpen() 
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
            >
              {attrs.cancelled ? "Event Cancelled" : isRegOpen() ? "Secure My Spot" : "Registration Closed"}
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => window.open(attrs.link, "_blank")}
              className="flex-1 flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
            >
              <Info className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Interactive Hover Border */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              layoutId="border"
              className="absolute inset-0 border-2 border-blue-500/50 pointer-events-none rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}