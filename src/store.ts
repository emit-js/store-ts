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
    const parent = this.parentState(e)
    if (parent && typeof parent === "object") {
      delete parent[e.id[e.id.length - 1]]
    }
  }

  public get(e: EventType): any {
    return e.id.reduce((memo, id): any => {
      return memo && memo[id]
    }, this.state)
  }

  public merge(e: EventType, value: any): void {
    const parent = this.parentState(e)
    if (parent && typeof parent === "object") {
      Object.assign(parent[e.id[e.id.length - 1]], value)
    }
  }

  public set(e: EventType, value: any): void {
    const parent = this.parentState(e)
    if (parent && typeof parent === "object") {
      parent[e.id[e.id.length - 1]] = value
    }
  }

  private parentState(e: EventType): any {
    return e.id.slice(0, -1).reduce(
      (memo, id): any => {
        if (memo) {
          memo[id] = memo[id] || {}
          return memo[id]
        }
      },
      this.state
    )
  }
}

export function store(emit: Emit): void {
  const store = new Store()
  emit.any("delete", store.delete.bind(store))
  emit.any("get", store.get.bind(store))
  emit.any("merge", store.merge.bind(store))
  emit.any("set", store.set.bind(store))
}
