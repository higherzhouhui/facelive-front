import { lazy, type ComponentType, type JSX } from 'react';

import BeginPage from '@/pages/Welecom';
import HomePage from '@/pages/Home';
import GamePage from '@/pages/Game';
import LeaderBoardPage from '@/pages/LeaderBoard';
import FrensPage from '@/pages/Frens';
import DetailPage from '@/pages/Detail';
import SecondPage from '@/pages/Second'
import ShopPage from '@/pages/Shop';
import CheckInlPage from '@/pages/CheckIn';
import GameLeaderBoardPage from '@/pages/GameLeaderBoard';
import LevelPage from '@/pages/Level';
import TaskPage from '@/pages/Task';
const FrensDetailPage = lazy(() => import('@/pages/Frens/Detail'))

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: HomePage },
  { path: '/my', Component: HomePage },
  { path: '/level', Component: LevelPage },
  { path: '/task', Component: TaskPage },
  { path: '/begin', Component: BeginPage },
  { path: '/second', Component: SecondPage },
  { path: '/rank', Component: LeaderBoardPage },
  { path: '/gameleaderboard', Component: GameLeaderBoardPage },
  { path: '/frens', Component: FrensPage },
  { path: '/game', Component: GamePage },
  { path: '/detail', Component: DetailPage },
  { path: '/checkIn', Component: CheckInlPage },
  { path: '/frens-detail', Component: FrensDetailPage },
];
