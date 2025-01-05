import { Block, BlockApi, BlockType } from "./block";

export enum ContentManagementApi {
  defautPath = '/content_management',
}

const ContentManagement = {
  BlockApi,
  Block,
  BlockType,
}

export default ContentManagement
