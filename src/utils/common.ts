import { Toast } from "antd-mobile";
import moment from "moment";
import en from '@/locale/en.json'
import zh from '@/locale/zh.json'

const message: any = {
  en,
  zh,
}


export function getLabel(id: string) {
  let label = ''
  try {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const _user = JSON.parse(userInfo)
      label = message[_user.lang][id]
    }
  } catch(error) {

  }

  return label || id
}

export function stringToColor(string: string) {
  let hash = 0;
  let i;
  if (!string) {
    return ''
  }
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function formatNumber(num: any) {
  if (isNaN(num)) {
    return num
  }
  // 小于千直接返回  
  if (num < 1000) {
    return num;
  }

  // 超过千  
  if (num < 1000000) {
    return (num / 1000).toFixed(2) + 'K';
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else {
    return (num / 1000000000).toFixed(2) + 'B';
  }
}

export function getFileUrl(file: string) {
  if (!file) {
    return ''
  }
  const dev = import.meta.env.DEV
  let url = dev ? 'https://mini.facelive.top' : 'https://mini.facelive.top'
  if (file && file.includes('http')) {
    url = ''
  }
  return `${url}${file}`
}

function isObjectEqual(obj1: any, obj2: any) {
  // 比较属性数量
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // 比较属性值
  for (const key in obj1) {
    if (obj1[key] === obj2[key]) {
      const propValue1 = obj1[key];
      const propValue2 = obj2[key];
      if ((typeof propValue1 === 'object' && propValue1 !== null)
        && !isObjectEqual(propValue1, propValue2)) {
        return false;
      }
    } else {
      // 不匹配的属性值
      return false;
    }
  }

  // 所有属性值都相等
  return true;
}

export function isArrayEqual(arr1: any[], arr2: any[]) {
  // 如果数组长度不相等，返回false
  if (arr1.length !== arr2.length) return false;

  // 比较每个元素
  for (let i = 0; i < arr1.length; i++) {
    if (typeof arr1[i] === 'object' && arr1[i] !== null) {
      // 对象元素，递归比较
      if (!isObjectEqual(arr1[i], arr2[i])) return false;
    } else if (arr1[i] !== arr2[i]) {
      // 非对象元素，直接比较
      return false;
    }
  }

  // 所有元素都相等
  return true;
}

export function objectsEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    if (val1 === val2) {
      if (typeof val1 === 'object' && val1 !== null) {
        if (!objectsEqual(val1, val2)) return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

export function judgeIsCheckIn(time: any) {
  let flag = false
  try {
    if (time) {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      const currentArr = [year, month, day]
      const timeymd = moment(time).format('YYYY-MM-DD').split('-')
      flag = timeymd.every((item: any, index: number) => {
        return parseInt(item) == currentArr[index]
      })
    }
  } catch (error) {
    console.error(error)
    flag = false
  }
  return flag
}


export function formatWalletAddress(address: any) {
  let str = address
  try {
    if (address) {
      str = address.substring(0, 5) + '...' + address.substring(address.length - 5)
    }
  } catch (error) {

  }

  return str
}

export function handleCopyLink(link: string, str?: string) {
  const textToCopy = link; // 替换为你想要复制的内容  
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  Toast.show({ content: str || getLabel('copied'), position: 'top', duration: 3000 })
}

export function formatNumTen(money: number, length = 2) {
  let curZero = 1
  if (money) {
    if (length) {
      for (let i = 0; i < length; i++) {
        curZero *= 10
      }
    }
    return Math.floor(money * curZero) / curZero
  } else {
    return 0
  }
}

export function scaleDownByNumber(number: number, wei = 9) {
  for (let i = 0; i < wei; i++) {
    number = number / 10
  }
  return formatNumTen(number, 3)
}


type ThrottleHandler = (args: any[]) => void;

export function throttle(handler: ThrottleHandler, limit: number) {
  let inThrottle: boolean = false;
  let lastArgs: any[] = [];

  return function (this: any, ...args: any) {
    const context = this

    if (!inThrottle) {
      handler.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}


export function secondsToTime(seconds: number) {
  if (!isNaN(seconds)) {
    // 获取分钟
    let minutes: any = Math.floor(seconds / 60);
    // 获取秒钟，对60取余保证秒数不会超过59
    let secs: any = seconds % 60;
    // 将分钟和秒数转换为字符串，位数不足前面补零
    minutes = minutes < 10 ? '0' + minutes : minutes;
    secs = secs < 10 ? '0' + secs : secs;
    // 返回格式化的时间字符串
    return minutes + ':' + secs;
  }
}

export function getUserName(userInfo: any) {
  let name = 'FACELIVE'
  if (userInfo.firstName || userInfo.lastName) {
    name = userInfo.firstName + userInfo.lastName
  } else if (userInfo.username){
    name = userInfo.username
  }
  return name
}