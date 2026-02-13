import type { FeatureSpec } from "../types/spec"


const STORAGE_KEY = "feature_specs"

export function saveSpec(spec: FeatureSpec) {
  const existing = loadSpecs()
  const updated = [spec, ...existing]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function loadSpecs(): FeatureSpec[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function deleteSpec(id: string) {
  const updated = loadSpecs().filter((spec) => spec.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
