function throttle(func: any, wait = 100) {
  let timer: any = null
  return function cb(...args: any[]) {
    if (timer === null) {
      timer = setTimeout(() => {
        // @ts-ignore
        func.apply(this, args)
        timer = null
      }, wait)
    }
  }
}

export default throttle
