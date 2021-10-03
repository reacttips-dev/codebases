import mitt, { EventType, Handler } from 'mitt'

type Status = 'running' | 'paused' | 'stopped'

class Timer {
  private _interval: number
  private _stopwatch: boolean
  private _duration: number = 0
  private _endTime: number = 0
  private _pauseTime: number = 0
  private _status: Status = 'stopped'
  private _timeoutID?: NodeJS.Timeout
  private _emitter = mitt()

  constructor ({ interval = 1000, stopwatch = false } = {}) {
    this._interval = interval
    this._stopwatch = stopwatch
  }

  public start (duration: number, interval?: number) {
    if (this.status !== 'stopped') return
    if (duration == null) {
      throw new TypeError('Must provide duration parameter')
    }
    this._duration = duration
    this._endTime = Date.now() + duration
    this._changeStatus('running')
    this._emitter.emit('tick', this._stopwatch ? 0 : this._duration)
    this._timeoutID = setInterval(this.tick, interval || this._interval)
  }

  public stop () {
    if (this._timeoutID) clearInterval(this._timeoutID)
    this._changeStatus('stopped')
  }

  public pause () {
    if (this.status !== 'running') return
    this._pauseTime = Date.now()
    this._changeStatus('paused')
  }

  public resume () {
    if (this.status !== 'paused') return
    this._endTime += Date.now() - this._pauseTime
    this._pauseTime = 0
    this._changeStatus('running')
  }

  private _changeStatus (status: Status) {
    this._status = status
    this._emitter.emit('statusChanged', this.status)
  }

  private tick = () => {
    if (this.status === 'paused') return
    if (Date.now() >= this._endTime) {
      this.stop()
      this._emitter.emit('tick', this._stopwatch ? this._duration : 0)
      this._emitter.emit('done')
    } else {
      this._emitter.emit('tick', this.time)
    }
  }

  get time () {
    if (this.status === 'stopped') return 0
    const time = this.status === 'paused' ? this._pauseTime : Date.now()
    const left = this._endTime - time
    return this._stopwatch ? this._duration - left : left
  }

  get duration () {
    return this._duration
  }

  get status () {
    return this._status
  }

  public on (eventName: EventType, handler: Handler<any>) {
    this._emitter.on(eventName, handler)
  }

  public off (eventName: EventType, handler: Handler<any>) {
    this._emitter.off(eventName, handler)
  }
}

export default Timer
