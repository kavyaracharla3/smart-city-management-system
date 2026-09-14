import React from 'react';

export const LoadingSkeleton = ({ count = 4, height = 'h-24' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`glass-panel rounded-xl ${height} bg-slate-800/40 p-4 flex flex-col justify-between`}>
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="h-8 bg-slate-800 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};
