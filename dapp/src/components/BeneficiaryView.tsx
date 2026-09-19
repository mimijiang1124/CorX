"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { parseUnits, formatUnits } from "viem";
import { HeartHandshake, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function BeneficiaryView() {
  const { address } = useAccount();
  const [merchantAddr, setMerchantAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // 查询当前余额
  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    address: 0x5FbDB2315678afecb367f032d93F642f64180aa3,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { writeContractAsync } = useWriteContract();

  // 1. 模拟 World ID 验证后领取 100 粮票
  const handleClaim = async () => {
    try {
      setStatusMsg("验证中并提交 Claim 交易...");
      await writeContractAsync({
        address: 0x5FbDB2315678afecb367f032d93F642f64180aa3,
        abi: CONTRACT_ABI,
        functionName: "claimVoucher",
        args: [address!],
      });
      setStatusMsg("领取成功！已获得 100 加密粮票。");
      refetchBalance();
    } catch (err: any) {
      setStatusMsg(`失败: ${err.shortMessage || err.message}`);
    }
  };

  // 2. 支付给商家 (尝试转给普通人会被智能合约拒绝)
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatusMsg("正在向商家核销支付...");
      await writeContractAsync({
        address: 0x5FbDB2315678afecb367f032d93F642f64180aa3,
        abi: CONTRACT_ABI,
        functionName: "transfer",
        args: [merchantAddr as `const`, parseUnits(amount, 18)],
      });
      setStatusMsg("支付成功！");
      setAmount("");
      refetchBalance();
    } catch (err: any) {
      // 合约 require 失败会在这里被捕获
      setStatusMsg(`支付失败: 合约拦截！受助者仅允许向白名单商家转账。`);
    }
  };

  const balance = rawBalance ? formatUnits(rawBalance as bigint, 18) : "0";

  return (
    <div className="space-y-6">
      {/* 余额卡片 */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-400">当前加密粮票余额 (CFV)</p>
          <h2 className="text-4xl font-bold text-blue-400 mt-1">{balance} CFV</h2>
        </div>
        <button
          onClick={handleClaim}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <HeartHandshake className="w-5 h-5" />
          申领 100 粮票 (World ID)
        </button>
      </div>

      {/* 支付表单 */}
      <form onSubmit={handlePay} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">线下核销与消费</h3>
        <div>
          <label className="text-xs text-slate-400">商家钱包地址 (白名单校验)</label>
          <input
            type="text"
            placeholder="0x..."
            value={merchantAddr}
            onChange={(e) => setMerchantAddr(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">消费金额 (CFV)</label>
          <input
            type="number"
            placeholder="例如: 20"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl flex justify-center items-center gap-2 transition"
        >
          <Send className="w-4 h-4" /> 确认支付给商家
        </button>
      </form>

      {/* 状态反馈 */}
      {statusMsg && (
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-sm text-slate-300 flex items-center gap-2">
          {statusMsg.includes("失败") ? <AlertCircle className="text-red-400" /> : <CheckCircle2 className="text-emerald-400" />}
          {statusMsg}
        </div>
      )}
    </div>
  );
}