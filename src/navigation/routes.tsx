import { lazy, type ComponentType, type JSX } from 'react';

import HomePage from '@/pages/Home';
import LeaderBoardPage from '@/pages/LeaderBoard';
import FrensPage from '@/pages/Frens';
import DetailPage from '@/pages/Anchor';
import CheckInlPage from '@/pages/CheckIn';
import GameLeaderBoardPage from '@/pages/GameLeaderBoard';
import TaskPage from '@/pages/Task';
import MyselfPage from '@/pages/My';
import FollowPage from '@/pages/Follow';
import ChatPage from '@/pages/Chat';
import LanguagePage from '@/pages/Language';
import RechargePage from '@/pages/Recharge';
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
  { path: '/task', Component: TaskPage },
  { path: '/chat', Component: ChatPage },
  { path: '/language', Component: LanguagePage },
  { path: '/rank', Component: LeaderBoardPage },
  { path: '/gameleaderboard', Component: GameLeaderBoardPage },
  { path: '/frens', Component: FrensPage },
  { path: '/recharge', Component: RechargePage },
  { path: '/anchor', Component: DetailPage },
  { path: '/checkIn', Component: CheckInlPage },
  { path: '/frens-detail', Component: FrensDetailPage },
];
