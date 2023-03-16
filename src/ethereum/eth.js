let contractConfig = {
  Helium: "",
  Config: "",
  Tokens: "",
  NFT: "",
  NowNFT: "",
  MapNFT: "",
  BuyStaker: "",
  BnbUsdt: "",
  BnbEsg: "",
  USDT: "",
  ESG: "",
  TpRuter: "",
  StarChian: "",
  MapEsg: "",
  AtaNFT2: "",
  SpaceId: "",
  BuyAndStaker: "",
  Key: "",
  Klp: "",
  Hash: "",
  AddLp: "",
  EsgRelease: "",
  LpReward: "",
  AndUandStaker: "",
  UlpReward: "",
  PancakeSwapRouterV2: "",
  NewBuyStaker: "",
  HashCollision: "",
};
if (process.env.VUE_APP_MODE != "development") {
  // 正式网
  contractConfig.Helium = "0x53E4cb8ACE999A4D9EcAa8c4B44e4446A99eAa93";
  contractConfig.Config = "0x481e772C50Dc32e00fA2B8279e392cEF87868d16";
  contractConfig.Tokens = "0x25F971c76593d0b9dA578777675828c3880C32E3";
  contractConfig.NowTokens = "0x8bB84C94b14e47Fe73C29B86c56DA596641c2223";
  contractConfig.NFT = "0x6E18913E9eb7952Df2F93aE3337227D99c71962C";
  contractConfig.NowNFT = "0x7988d65644006A08E2623FaAb2C4FD7036A85c42"; // maske baby
  contractConfig.MapNFT = "0x5ca438bAe21f528924FEa7469aE1aF4D0c699D53"; // ATA 1
  contractConfig.AtaNFT2 = "0xc8Cd31AbB800E133574b5C2a03f71e8088Fc3E6f"; // ATA 2
  contractConfig.SpaceId = "0xE3b1D32e43Ce8d658368e2CBFF95D57Ef39Be8a6"; // SPACE ID
  contractConfig.BuyStaker = "0x0AB76Bef3ed67B87247d39e16cBd519Ac994AFdd"; //  0x0AB76Bef3ed67B87247d39e16cBd519Ac994AFdd 0x1F73b770f43b3B6c253ea6952a6B2Ef2aaC320Fc
  contractConfig.BnbUsdt = "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE"; //  0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE 0x271b4eeae078450b4731fA8C29778297e73CBcdd
  contractConfig.BnbEsg = "0xF63eaC3B0094b1E9751B71ACB8AA487FD96996f8"; //  0xF63eaC3B0094b1E9751B71ACB8AA487FD96996f8 0x8514eF16C64b3082712ee65755c386A4967E01a4
  contractConfig.USDT = "0x55d398326f99059fF775485246999027B3197955"; //  0x55d398326f99059fF775485246999027B3197955 0xA10ca156eC6C696401360efeb73B6ed14eD2770E
  contractConfig.ESG = "0xc40B6e88FD7b09Eb8F768f402bF5dad6bF2bC622"; //  0xc40B6e88FD7b09Eb8F768f402bF5dad6bF2bC622 0x70B3fce8ffe17321Ee4AA7fB4A7CCB5388423Dad
  contractConfig.TpRuter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  contractConfig.StarChian = "0xB037f85383FaabcD968546B3A15AAAd10F694a2E";
  contractConfig.MapEsg = "0xEC9E3554026d16aF2165B28089941F2531C87b15";
  contractConfig.BuyAndStaker = "0xdb266814A3fA986bC1337a69D49eFcDEAECCD9f2";
  contractConfig.Key = "0x9954070E8665F64BAc09EFB552FC6Ca708aCd943";
  contractConfig.Klp = "0x492eDFBFD5351F42111655b2bA919b0d289A3bdF";
  contractConfig.AddLp = "0xf2944ccD1A532D1ed058Ea6c4A21F559e642489d";
  contractConfig.EsgRelease = "0xc6729EDFA10b2045964376C0fe7fC53F223D055D";
  contractConfig.LpReward = "0x54cd26950e2A6edbB6BCA370c12C320B706A28d1";
  contractConfig.AndUandStaker = "0xf4251d3E71CBEC7995cCD5aBE2f1DEA63f7694a9";
  contractConfig.UlpReward = "0xC416fE50699559c1Aed3a8d050a9a4ef13530b11";
  contractConfig.PancakeSwapRouterV2 =
    "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  contractConfig.NewBuyStaker = "0xc7D37b0D16336CB46D006B4B1f9028D816935993";
  contractConfig.HashCollision = "0xd9B02C85Fe2A0fd7FeB9fBCE4C95aE11A977C22d"
  contractConfig.Hash = "0x906Ab3b01bbF317d3991B1289Bad97f14C6941fE"
} else {
  // 测试网
  contractConfig.Helium = "0xDc53FbC542106715D39f91a8E8E634B9ff604389";
  contractConfig.Config = "0x293e47963BfA7d4b874E90f9b5137133750176B7";
  contractConfig.Tokens = "0x6D7927a841558b1CFef29EdC2D3973E74AdbCF6D";
  contractConfig.NowTokens = "0x25252c54f66eB36057421466Ba36f24AFa1F1c6b";
  contractConfig.NFT = "0xFf41b6687fDe040010Ccd5D5De0b71bffb2c9e05";
  contractConfig.NowNFT = "0xfEB1427edD8480385F3C80a3D96C04C7F1f4Cb3B";
}
export const NftName = {
  ATA1: {
    name: "AtAlpha1(NFT)",
    contract: "0x5ca438bAe21f528924FEa7469aE1aF4D0c699D53",
  },
  ATA2: {
    name: "AtAlpha2(NFT)",
    contract: "0xc8Cd31AbB800E133574b5C2a03f71e8088Fc3E6f",
  },
  MaskBaby: {
    name: "Mask Baby",
    contract: "0x7988d65644006A08E2623FaAb2C4FD7036A85c42",
  },
};
export const Eth = {
  BscUrl: "https://bscscan.com/",
  contract: {
    // 业务合约
    contrart_Helium: {
      name: "contrart_Helium",
      addr: contractConfig.Helium, // 合约部署 地址
      abi: require("./abiJson/contrart_Helium.json"), // 合约部署 abi
    },

    // 配置合约
    contract_Config: {
      name: "contract_Config",
      addr: contractConfig.Config,
      abi: require("./abiJson/contract_Config.json"), // 合约部署 abi
    },

    // 代币合约
    contrart_Tokens: {
      name: "contrart_Tokens",
      addr: contractConfig.Tokens, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },

    // 代币合约
    contrart_NowTokens: {
      name: "contrart_NowTokens",
      addr: contractConfig.NowTokens, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },

    // NFT 合约
    contrart_NFT: {
      name: "contrart_NFT",
      addr: contractConfig.NFT, // 合约部署 地址
      abi: require("./abiJson/contrart_NFT.json"), // 合约部署 abi
    },

    // NFT 新合约
    contrart_NowNFT: {
      name: "contrart_NowNFT",
      addr: contractConfig.NowNFT, // 合约部署 地址
      abi: require("./abiJson/contrart_NFT.json"), // 合约部署 abi
    },
    // map nft 新合约
    contrart_MapNFT: {
      name: "contrart_MapNFT",
      addr: contractConfig.MapNFT, // 合约部署 地址
      abi: require("./abiJson/contrart_NFT.json"), // 合约部署 abi
    },

    // 购买 ESG 分红
    contrart_BuyStaker: {
      name: "contrart_BuyStaker",
      addr: contractConfig.BuyAndStaker, // 合约部署 地址
      abi: require("./abiJson/contrart_BuyAndStaker.json"), // 合约部署 abi
    },

    // BNB - USDT
    contrart_BnbUsdt: {
      name: "contrart_BnbUsdt",
      addr: contractConfig.BnbUsdt, // 合约部署 地址
      abi: require("./abiJson/contract_ratio.json"), // 合约部署 abi
    },

    // BNB - ESG
    contrart_BnbEsg: {
      name: "contrart_BnbEsg",
      addr: contractConfig.BnbEsg, // 合约部署 地址
      abi: require("./abiJson/contract_ratio.json"), // 合约部署 abi
    },

    // USDT
    contrart_USDT: {
      name: "contrart_USDT",
      addr: contractConfig.USDT, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },
    // ESG
    contrart_ESG: {
      name: "contrart_ESG",
      addr: contractConfig.ESG, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },
    // 博饼交易所路由合约
    contrart_TpRuter: {
      name: "contrart_TpRuter",
      addr: contractConfig.TpRuter, // 合约部署 地址
      abi: require("./abiJson/contrart_TpRuter.json"), // 合约部署 abi
    },
    // 星链栏目合约
    contrart_StarChian: {
      name: "contrart_StarChian",
      addr: contractConfig.StarChian, // 合约部署 地址
      abi: require("./abiJson/contrart_StarChian.json"), // 合约部署 abi
    },
    // NFT兑换栏目合约 - ATA1
    contrart_MapEsg: {
      name: "contrart_MapEsg",
      addr: contractConfig.MapEsg, // 合约部署 地址
      abi: require("./abiJson/contrart_MapEsg.json"), // 合约部署 abi
    },
    // NFT兑换栏目合约 - ATA2
    contrart_AtaNFT2: {
      name: "contrart_AtaNFT2",
      addr: contractConfig.AtaNFT2, // 合约部署 地址
      abi: require("./abiJson/contrart_MapEsg.json"), // 合约部署 abi
    },
    // NFT兑换栏目合约 - SpaceId
    contrart_SpaceId: {
      name: "contrart_SpaceId",
      addr: contractConfig.SpaceId, // 合约部署 地址
      abi: require("./abiJson/contrart_MapEsg.json"), // 合约部署 abi
    },
    // Key 代币
    contrart_Key: {
      name: "contrart_Key",
      addr: contractConfig.Key, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },
    // Klp 代币
    contrart_Klp: {
      name: "contrart_Klp",
      addr: contractConfig.Klp, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },

    // Klp 代币
    contrart_Hash: {
      name: "contrart_Hash",
      addr: contractConfig.Hash, // 合约部署 地址
      abi: require("./abiJson/contrart_Tokens.json"), // 合约部署 abi
    },

    // 添加LP
    contrart_AddLp: {
      name: "contrart_AddLp",
      addr: contractConfig.AddLp, // 合约部署 地址
      abi: require("./abiJson/contrart_AddLp.json"), // 合约部署 abi
    },

    // LP 分红
    contrart_LpReward: {
      name: "contrart_LpReward",
      addr: contractConfig.LpReward, // 合约部署 地址
      abi: require("./abiJson/contrart_LpReward.json"), // 合约部署 abi
    },

    // ESG 释放
    contrart_EsgRelease: {
      name: "contrart_EsgRelease",
      addr: contractConfig.EsgRelease, // 合约部署 地址
      abi: require("./abiJson/contrart_EsgRelease.json"), // 合约部署 abi
    },

    // USDT ESG LP
    contrart_AndUandStaker: {
      name: "contrart_AndUandStaker",
      addr: contractConfig.AndUandStaker, // 合约部署 地址
      abi: require("./abiJson/contrart_AndUandStaker.json"), // 合约部署 abi
    },

    // UlpReward
    contrart_UlpReward: {
      name: "contrart_UlpReward",
      addr: contractConfig.UlpReward, // 合约部署 地址
      abi: require("./abiJson/contrart_UlpReward.json"), // 合约部署 abi
    },

    // UlpReward
    contrart_PancakeSwapRouterV2: {
      name: "contrart_PancakeSwapRouterV2",
      addr: contractConfig.PancakeSwapRouterV2, // 合约部署 地址
      abi: require("./abiJson/contrart_PancakeSwapRouterV2.json"), // 合约部署 abi
    },

    // HashBump
    contrart_NewBuyStaker: {
      name: "contrart_NewBuyStaker",
      addr: contractConfig.NewBuyStaker, // 合约部署 地址
      abi: require("./abiJson/contrart_BuyAndStaker.json"), // 合约部署 abi
    },

    // HashCollision
    contract_HashCollision: {
      name: "contract_HashCollision",
      addr: contractConfig.HashCollision, // 合约部署 地址
      abi: require("./abiJson/contract_HashCollision.json"), // 合约部署 abi
    },
  },
};
