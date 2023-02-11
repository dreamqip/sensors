export class CircularQueue<T> {
  private _queue: T[] = [];
  private readonly _capacity: number;

  constructor(capacity: number) {
    this._capacity = capacity;
  }

  enqueue(item: T) {
    this._queue.push(item);
    if (this._queue.length > this._capacity) {
      this._queue.shift();
    }
  }

  dequeue(): T | undefined {
    return this._queue.shift();
  }

  get length() {
    return this._queue.length;
  }

  isEmpty() {
    return this._queue.length === 0;
  }

  isFull() {
    return this._queue.length === this._capacity;
  }
}