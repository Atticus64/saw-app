import type { Editor, SawResponse, TopsisResponse } from "./types";

const API = import.meta.env.VITE_API ?? "http://localhost:3000/api";

enum status {
  loading = "loading",
  ok = "ok",
  error = "error",
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, init);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

async function getDecisionMatrix(): Promise<{ datos: Editor[]; estado: status }> {
  let datos: Editor[] = [];
  let estado: status = status.loading;
  try {
    datos = await request<Editor[]>("/matriz-decision");
    estado = status.ok;
  } catch {
    estado = status.error;
  }

  return { datos, estado };
}

async function evaluateEditorsSaw(pesos: number[], tipos: string[]): Promise<SawResponse> {
  return request<SawResponse>("/saw/evaluar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pesos, tipos }),
  });
}

async function evaluateEditorsTopsis(pesos: number[], tipos: string[]): Promise<TopsisResponse> {
  return request<TopsisResponse>("/topsis/evaluar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pesos, tipos }),
  });
}

export {
  getDecisionMatrix,
  status,
  evaluateEditorsSaw,
  evaluateEditorsTopsis,
}