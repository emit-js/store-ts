import { Emit, EventType } from "@emit-js/emit"

declare module "@emit-js/emit" {
  interface Emit {
    get(id?: EventIdType): any
    delete(id: EventIdType): Promise<void>
    merge(id: EventIdType, value: object): Promise<void>
    set(id: EventIdType, value: any): Promise<void>
  }
}

export class Store {
  private state: object

  public constructor() {
    this.state = {}
  }

  public delete(e: EventType): void {
    const [parent, state] = this.parentState(e)
    if (parent) {
      delete parent[e.id[e.id.length - 1]]
      this.state = state
    }
  }

  public get(e: EventType): any {
    return e.id.reduce((memo, id): any => {
      return memo && memo[id]
    }, this.state)
  }

  public merge(e: EventType, value: any): void {
    const [parent, state] = this.parentState(e)
    if (parent) {
      Object.assign(parent[e.id[e.id.length - 1]], value)
      this.state = state
    }
  }

  public set(e: EventType, value: any): void {
    const [parent, state] = this.parentState(e)
    if (parent) {
      parent[e.id[e.id.length - 1]] = value
      this.state = state
    }
  }

  private parentState(
    e: EventType
  ): [object | undefined, object] {
    const state = {...this.state}
    return [
      e.id.slice(0, -1).reduce(
        (memo, id): object => {
          if (memo && typeof memo === "object") {
            const exists = memo[id] !== undefined
            const obj = typeof memo[id] === "object"
            memo[id] = obj ?
              {...memo[id]} :
              (memo[id] || {})
            return !exists || obj ? memo[id] : undefined
          }
        },
        state
      ),
      state
    ]
  }
}

export function store(emit: Emit): void {
  const store = new Store()
  emit.any("delete", store.delete.bind(store))
  emit.any("get", store.get.bind(store))
  emit.any("merge", store.merge.bind(store))
  emit.any("set", store.set.bind(store))
}
