"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import BeneficiaryView from "@/components/BeneficiaryView";
import MerchantView from "@/components/MerchantView";
import { Wallet, LogOut, Heart, User, Store } from "lucide-react";

export default function Home() {
  const { login, logout, authenticated, user } = usePrivy();
  const [role, setRole] = useState<"beneficiary" | "merchant">("beneficiary");

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-blue-500 fill-blue-500/20" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DirectAid Protocol</h1>
            <p className="text-xs text-slate-400">透明无中介 · 加密定向救助网</p>
          </div>
        </div>

        {authenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              {user?.email?.address || `${user?.wallet?.address.slice(0, 6)}...${user?.wallet?.address.slice(-4)}`}
            </span>
            <button
              onClick={logout}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            <Wallet className="w-4 h-4" /> 登录 / 一键创建钱包
          </button>
        )}
      </header>

      {/* Hero / Main Content Area */}
      {!authenticated ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-100">让每一分救助款直达受助者</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            结合 World ID 人类验证与受控链上凭证，杜绝中介抽成与贪腐，保障资金专款专用。
          </p>
          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl transition mt-4"
          >
            立即体验 Demo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 角色切换按钮 (黑客松 Demo 展示神器) */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setRole("beneficiary")}
              className={`flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                role === "beneficiary" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-4 h-4" /> 受助人模式
            </button>
            <button
              onClick={() => setRole("merchant")}
              className={`flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                role === "merchant" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Store className="w-4 h-4" /> 合作商家模式
            </button>
          </div>

          {/* 根据角色渲染视图 */}
          {role === "beneficiary" ? <BeneficiaryView /> : <MerchantView />}
        </div>
      )}
    </main>
  );
}