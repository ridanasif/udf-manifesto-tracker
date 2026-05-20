import React from "react";

export default function DisclaimerBanner({ t }) {
  return (
    <div className="sticky top-0 z-50 bg-saffron text-slate-900 border-b-2 border-saffron-dark/30 text-center py-2 px-4 text-xs md:text-sm font-mono-tech font-bold">
      <div className="max-w-7xl mx-auto">
        {t.disclaimer}
      </div>
    </div>
  );
}
