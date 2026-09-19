"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { formatUnits } from "viem";
import { Store, ShieldCheck, ShieldAlert } from "lucide-react";

export default function MerchantView() {
  const { address } = useAccount();

  // 1. 检查当前连接钱包是否是认证商家
  const { data: isMerchant } = useReadContract({
    address: 0x5FbDB2315678afecb367f032d93F642f64180aa3,
    abi: CONTRACT_ABI,
    functionName: "isMerchant",
    args: address ? [address] : undefined,
  });

  // 2. 查收到的粮票余额
  const { data: rawBalance } = useReadContract({
    address: 0x5FbDB2315678afecb367f032d93F642f64180aa3,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const balance = rawBalance ? formatUnits(rawBalance as bigint, 18) : "0";

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold">合作商家收银台</h2>
            <p className="text-xs text-slate-400">地址: {address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs">
          {isMerchant ? (
            <span className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 认证商家 (白名单生效)
            </span>
          ) : (
            <span className="text-amber-400 border-amber-500/30 bg-amber-500/10 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> 未认证 (需 DAO 授权)
            </span>
          )}
        </div>
      </div>

      <div className="bg-slate-950 p-6 rounded-xl text-center space-y-2">
        <p className="text-sm text-slate-400">累积核销到账金额</p>
        <p className="text-5xl font-extrabold text-emerald-400">{balance} CFV</p>
        <p className="text-xs text-slate-500 mt-2">智能合约已准备就绪，可随时 1:1 自动兑换 USDC 清算。</p>
      </div>
    </div>
  );
}