import service from '@/utils/request';

export const loginReq = (data: any) => {
  return service<any>({
    url: '/user/login',
    method: 'POST',
    data,
  });
};

export const updateUserReq = (data: any) => {
  return service<any>({
    url: '/user/update',
    method: 'POST',
    data,
  });
};
export const getMyScoreHistoryReq = (params: any) => {
  return service<any>({
    url: '/user/getMyScoreHistory',
    method: 'GET',
    params,
  });
};
export const getUserListReq = (params: any) => {
  return service<any>({
    url: '/user/list',
    method: 'GET',
    params,
  });
};
export const getUserGameListReq = (params: any) => {
  return service<any>({
    url: '/user/gamelist',
    method: 'GET',
    params,
  });
};
export const getSubUserListReq = (params: any) => {
  return service<any>({
    url: '/user/subList',
    method: 'GET',
    params,
  });
};

export const getUserInfoReq = () => {
  return service<any>({
    url: '/user/userInfo',
    method: 'GET',
  });
};

export const userCheckReq = () => {
  return service<any>({
    url: '/user/check',
    method: 'POST',
  });
};


export const bindWalletReq = (data: any) => {
  return service<any>({
    url: '/user/bindWallet',
    method: 'POST',
    data,
  });
};

export const changeLangReq = (data: any) => {
  return service<any>({
    url: '/user/changeLang',
    method: 'POST',
    data,
  });
};

export const getCheckInRewardListReq = () => {
  return service<any>({
    url: '/checkInReward/list',
    method: 'GET',
  });
};

export const getSystemReq = () => {
  return service<any>({
    url: '/system/getAllConfig',
    method: 'GET',
  });
};


export const getPriceReq = (dev: boolean, type: string) => {
  const url = dev ? 'https://api.binance.com/api/v3/ticker' : '/binancePrice';
  return service<any>({
    url: url,
    method: 'GET',
    params: {
      symbol: type
    }
  });
}

export const getLevelListReq = () => {
  return service<any>({
    url: '/system/getLevelList',
    method: 'GET',
  });
};

export const getPieceListReq = () => {
  return service<any>({
    url: '/system/pieceList',
    method: 'GET',
  });
};


export const userBuySkinOrPieceReq = (data: any) => {
  return service<any>({
    url: '/bag/buy',
    method: 'POST',
    data,
  });
};

export const useCoinBuyPieceReq = (data: any) => {
  return service<any>({
    url: '/bag/buyPiece',
    method: 'POST',
    data,
  });
};

export const getBagListReq = () => {
  return service<any>({
    url: '/bag/list',
    method: 'GET',
  });
};

export const userUpgradeReq = (data: any) => {
  return service<any>({
    url: '/user/upgrade',
    method: 'POST',
    data,
  });
};

export const getSubUserTotalReq = () => {
  return service<any>({
    url: '/user/subTotal',
    method: 'GET',
  });
};


export const getAnchorList = (params: any) => {
  return service<any>({
    url: '/anchor/list',
    method: 'GET',
    params
  });
};

export const getAnchorInfo = (params: any) => {
  return service<any>({
    url: '/anchor/info',
    method: 'GET',
    params
  });
};

export const getNextAnchorInfo = (params: any) => {
  return service<any>({
    url: '/anchor/next',
    method: 'GET',
    params
  });
};

export const beginChatReq = (params: any) => {
  return service<any>({
    url: '/anchor/begin',
    method: 'GET',
    params
  });
};

export const getSwiperListReq = (params: any) => {
  return service<any>({
    url: '/anchor/three',
    method: 'GET',
    params
  });
};

export const getMoreAnchorReq = (params: any) => {
  return service<any>({
    url: '/anchor/more',
    method: 'GET',
    params
  });
};

export const followAnchorReq = (data: any) => {
  return service<any>({
    url: '/anchor/follow',
    method: 'POST',
    data
  });
};

export const followAnchorListReq = (params?: any) => {
  return service<any>({
    url: '/anchor/followList',
    method: 'GET',
    params
  });
};

export const chatAnchorListReq = (params?: any) => {
  return service<any>({
    url: '/anchor/chatList',
    method: 'GET',
    params
  });
};


export const getProductListReq = (params?: any) => {
  return service<any>({
    url: '/product/list',
    method: 'GET',
    params
  });
};

export const buyProductReq = (data?: any) => {
  return service<any>({
    url: '/product/buy',
    method: 'POST',
    data
  });
};

export const sendOrderProductReq = (data?: any) => {
  return service<any>({
    url: '/product/sendOrder',
    method: 'POST',
    data
  });
};


