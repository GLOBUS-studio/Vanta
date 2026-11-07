type Listener = (payload: unknown) => void

export class Emitter<E extends object> {
  private readonly listeners = new Map<keyof E, Set<Listener>>()

  on<K extends keyof E>(event: K, listener: (payload: E[K]) => void): () => void {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(listener as Listener)
    return () => {
      set.delete(listener as Listener)
      if (set.size === 0) this.listeners.delete(event)
    }
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    const set = this.listeners.get(event)
    if (!set) return
    for (const listener of [...set]) {
      try {
        listener(payload)
      } catch (error) {
        // A broken listener must not break the animation loop.
        console.error('[VantaJS2] listener error', error)
      }
    }
  }

  clear(): void {
    this.listeners.clear()
  }
}
