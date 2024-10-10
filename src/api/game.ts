import service from '@/utils/request';

export const beginGameReq = () => {
  return service<any>({
    url: '/game/begin',
    method: 'GET',
  });
};

export const getGameInfoReq = () => {
  return service<any>({
    url: '/game/info',
    method: 'GET',
  });
};

export const endGameReq = (data: any) => {
  return service<any>({
    url: '/game/end',
    method: 'POST',
    data
  });
};


export const getGameListReq = () => {
  return service<any>({
    url: '/system/getGameList',
    method: 'GET',
  });
};