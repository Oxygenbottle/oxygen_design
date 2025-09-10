import request from './request';

export const getTabbarInfo = () => {
  return request({
    url: '/tabbar/',
    method: 'get'
  });
};

export const getHomeInfo = () => {
  return request({
    url: '/home/data',
    method: 'get'
  });
};
