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

export const getCheckInRewardListReq = () => {
  return service<any>({
    url: '/checkInReward/list',
    method: 'GET',
  });
};

export const getSystemReq = () => {
  return service<any>({
    url: '/system/getConfig',
    method: 'GET',
  });
};


export const getPriceReq = (dev: boolean, type: string) => {
  const url = dev ? 'https://www.binance.com/api/v3/ticker' : '/binancePrice';
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

export const getTonPriceReq = (address: string) => {
  return service<any>({
    url: `/ton/v2/getWalletInformation?address=${address}`,
    method: 'GET',
    params: {api_key: '43c9443c5b88cad8ca1a35237a5caef73708f7a8e890d60ff58b57ba35dbba68'}
  });
};
