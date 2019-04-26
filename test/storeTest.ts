import { Emit } from "@emit-js/emit"
import { store } from "../"

let emit: Emit

beforeEach((): void => {
  emit = new Emit()
  store(emit)
})

test("get", (): void => {
  emit.set("hello", true)
  expect(emit.get("hello")).toBe(true)
})

test("get two ids", (): void => {
  emit.set(["hello", "world"], true)
  expect(emit.get(["hello", "world"])).toEqual(true)
})

test("set", (): void => {
  emit.set("hello", true)
  expect(emit.get()).toEqual({ hello: true })
})

test("set overwrite", (): void => {
  emit.set("hello", true)
  emit.set("hello", false)
  expect(emit.get()).toEqual({ hello: false })
})

test("set nested overwrite", (): void => {
  emit.set("hello", true)
  emit.set(["hello", "world"], true)
  expect(emit.get()).toEqual({ hello: true })
})

test("set two ids", (): void => {
  emit.set(["hello", "world"], true)
  expect(emit.get()).toEqual({ hello: { world: true } })
})

test("merge", (): void => {
  emit.set("hello", { world: true })
  emit.merge("hello", { universe: true })
  expect(emit.get()).toEqual({
    hello: { universe: true, world: true }
  })
})

test("delete", (): void => {
  emit.set("hello", { world: true })
  emit.delete("hello")
  expect(emit.get()).toEqual({})
})

test("immutable", (): void => {
  const s1a = emit.get()
  emit.set("hello", { world: true })
  const s1b = emit.get()
  const s2a = emit.get("hello")
  emit.set(["hello", "universe"], true)
  const s1c = emit.get()
  const s2b = emit.get("hello")
  expect(s1a).not.toBe(s1b)
  expect(s1b).not.toBe(s1c)
  expect(s2a).not.toBe(s2b)
})
