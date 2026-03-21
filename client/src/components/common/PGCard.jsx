import React from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PGCard = ({ id, name, location, price, rating, image, children }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-[#5A45FF]/10 transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 group/card">
      <Link to={`/pg/${id}`} className="block flex-grow cursor-pointer">
        <div className="relative overflow-hidden aspect-video">
          <img 
            src={!image ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : image.startsWith('http') ? image : `${api.defaults.baseURL}/api/users/images/${image}`} 
            alt={name} 
            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" 
          />
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center shadow-sm">
            <span className="text-yellow-500 mr-1 text-sm">★</span>
            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">{rating}</p>
          </div>
        </div>
        <div className="p-6 text-left space-y-3">
          <div>
            <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mt-1 italic">
              <span className="material-icons-outlined text-sm">place</span>
              {location}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center pt-2">
            <p className="font-black text-[#5A45FF] dark:text-[#7C6CFF] text-2xl tracking-tighter">{price}</p>
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
      {children && (
        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-5 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default PGCard;
