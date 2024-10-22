import { lazy, type ComponentType, type JSX } from 'react';

import HomePage from '@/pages/Home';

const ResultPage = lazy(() => import('@/pages/Result'))
const RechargePage = lazy(() => import('@/pages/Recharge'))
const LanguagePage = lazy(() => import('@/pages/Language'))
const ChatPage = lazy(() => import('@/pages/Chat'))
const FollowPage = lazy(() => import('@/pages/Follow'))
const MyselfPage = lazy(() => import('@/pages/My'))
const AnchorPage = lazy(() => import('@/pages/Anchor'))
const FrensPage = lazy(() => import('@/pages/Frens'))
const FrensDetailPage = lazy(() => import('@/pages/Frens/Detail'))

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/my', Component: MyselfPage },
  { path: '/follow', Component: FollowPage },
  { path: '/chat', Component: ChatPage },
  { path: '/language', Component: LanguagePage },
  { path: '/frens', Component: FrensPage },
  { path: '/recharge', Component: RechargePage },
  { path: '/anchor', Component: AnchorPage },
  { path: '/frens-detail', Component: FrensDetailPage },
  { path: '/result', Component: ResultPage },
];
