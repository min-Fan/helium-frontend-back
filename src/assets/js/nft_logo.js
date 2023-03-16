
const nft_map = {
  "Amazy Sneaker": "Amazy_Sneaker",
  "Pancake Bunnies V5": "Pancake_Bunnies_V5",
  "Pancake Squad": "Pancake_Squad",
  "Stepn": "Stepn",
  "Melody": "Melody",
  "Mask Baby": "Mask_Baby",
  "AtAlpha1(NFT)": "AtAlpha(NFT)",
  "AtAlpha2(NFT)": "AtAlpha(NFT)"
}

export const nft_logo = (name) => {
  if (nft_map[name]) {
    return require(`../nftlogo/${nft_map[name]}.png`)
  } else {
    return require("../v2img/nft_icon.png")
  }
}
