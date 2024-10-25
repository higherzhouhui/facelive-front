import { useEffect, useState } from 'react';
import './index.scss'
import { throttle } from '@/utils/common';

function BackTop({ scrollName }: { scrollName?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  // 判断是否显示回到顶部按钮
  const toggleVisibility = () => {
    const layoutElement = document.getElementsByClassName(scrollName || 'content')[0]
    const filterElement = document.getElementById('home-filter')
    if (filterElement) {
      const domRect = filterElement.getBoundingClientRect()
      if (domRect.top == 0) {
        filterElement.style.background = 'linear-gradient(135deg, rgba(111, 66, 44, 0.93) 0%, rgb(0, 0, 0) 50%, rgb(0, 0, 0) 100%)'
      } else if (domRect.top > 0) {
        filterElement.style.background = 'transparent'
      }
    }
    if (layoutElement) {
      if (layoutElement.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false)
    }
  };

  // 滚动事件监听器
  useEffect(() => {
    const layoutElement = document.getElementsByClassName(scrollName || 'content')[0]
    if (layoutElement) {
      layoutElement.addEventListener('scroll', throttle(toggleVisibility, 50))
    }
    return () => {
      layoutElement.removeEventListener('scroll', throttle(toggleVisibility, 50));
    };
  }, []);

  // 点击按钮回到顶部
  const scrollToTop = () => {
    const layoutElement = document.getElementsByClassName(scrollName || 'content')[0]

    layoutElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return <div className='back-top' onClick={() => scrollToTop()} style={{ display: isVisible ? 'block' : 'none' }}>
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8442" width="32" height="32"><path d="M512 512m-488.1 0a488.1 488.1 0 1 0 976.2 0 488.1 488.1 0 1 0-976.2 0Z" fill="#d4237a" p-id="8443" data-spm-anchor-id="a313x.search_index.0.i9.1cca3a81hQTv4O"></path><path d="M740.8 272.5H283.2c-16.6 0-30-13.4-30-30s13.4-30 30-30h457.6c16.6 0 30 13.4 30 30s-13.4 30-30 30zM512 821.1c-33.1 0-60-26.9-60-60V506.9c0-33.1 26.9-60 60-60s60 26.9 60 60v254.2c0 33.2-26.9 60-60 60z" fill="#FFFFFF" p-id="8444"></path><path d="M720.5 557.8h-417l0.4-2.3 203.3-203.3h8.3l203.4 203.3" fill="#FFFFFF" p-id="8445"></path><path d="M720.5 587.8h-417c-8.7 0-17-3.8-22.7-10.3-5.7-6.6-8.3-15.3-7-23.9l0.3-2.2c0.9-6.4 3.9-12.4 8.5-17L486 330.9c5.6-5.6 13.3-8.8 21.2-8.8h8.3c8 0 15.6 3.2 21.2 8.8l203.4 203.4c1.5 1.5 2.9 3.2 4 4.9 4 5.1 6.4 11.5 6.4 18.5 0 16.6-13.5 30.1-30 30.1z m-346.4-60h274.6L511.4 390.5 374.1 527.8z" fill="#FFFFFF" p-id="8446"></path></svg>
    </div>
}

export default BackTop