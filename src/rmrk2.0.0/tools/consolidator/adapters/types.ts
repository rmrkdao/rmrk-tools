import { NFT } from "../../../classes/nft";
import { Collection } from "../../../classes/collection";
import {
  BaseConsolidated,
  CollectionConsolidated,
  NFTConsolidated,
} from "../consolidator";
import { Base } from "../../../classes/base";
import { AcceptEntityType } from "../../../classes/accept";
import { Remark } from "../remark";

export interface IConsolidatorAdapter {

  /** Hook for getting the next remark to be processed right before it is about to be processed */
  beforeProcessingRemark(remark: Remark): Promise<any>;
  /** Hook for getting the last remark to be processed right after it has been processed */
  afterProcessingRemark(remark: Remark): Promise<any>;
  updateNFTEmote(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateNFTList(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateNftResadd(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateEquip(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateNftAccept(
    nft: NFT,
    consolidatedNFT: NFTConsolidated,
    entity: AcceptEntityType
  ): Promise<any>;
  updateNFTBuy(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateNFTSend(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateNFTBurn(
    nft: NFT | NFTConsolidated,
    consolidatedNFT: NFTConsolidated
  ): Promise<any>;
  updateNFTMint(nft: NFT): Promise<any>;
  updateSetPriority(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateSetAttribute(nft: NFT, consolidatedNFT: NFTConsolidated): Promise<any>;
  updateCollectionMint(collection: CollectionConsolidated): Promise<any>;
  updateCollectionDestroy(collection: CollectionConsolidated): Promise<any>;
  updateCollectionLock(collection: CollectionConsolidated): Promise<any>;
  updateBase(base: Base): Promise<any>;
  updateBaseEquippable(
    base: Base,
    consolidatedBase: BaseConsolidated
  ): Promise<any>;
  updateBaseThemeAdd(
    base: Base,
    consolidatedBase: BaseConsolidated
  ): Promise<any>;
  updateCollectionIssuer(
    collection: Collection,
    consolidatedCollection: CollectionConsolidated
  ): Promise<any>;
  updateBaseIssuer(
    base: Base,
    consolidatedBase: BaseConsolidated
  ): Promise<any>;
  updateNFTChildrenRootOwner(nft: NFT): Promise<any>;
  getNFTById(id: string): Promise<NFTConsolidated | undefined>;
  getCollectionById(id: string): Promise<CollectionConsolidated | undefined>;
  getBaseById(id: string): Promise<BaseConsolidated | undefined>;
  getNFTByIdUnique(id: string): Promise<NFTConsolidated | undefined>;
  getNFTsByCollection(
    collectionId: string
  ): Promise<NFTConsolidated[] | undefined>;
  getAllNFTs?: () => Promise<Record<string, NFTConsolidated>>;
  getAllCollections?: () => Promise<Record<string, CollectionConsolidated>>;
  getAllBases?: () => Promise<Record<string, BaseConsolidated>>;
}
