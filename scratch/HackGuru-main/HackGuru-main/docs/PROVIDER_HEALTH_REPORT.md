# 🏥 AI Provider Health Check Report

Generated At: `2026-09-01T17:58:20.886Z`

## 📊 Summary Overview

| Metric | Count |
| :--- | :---: |
| **Total Configured Credentials** | **17** |
| **Real Inference Successes** | **2** |
| **Failures** | **0** |
| **Blocked Credentials (Quota/Unconfigured)** | **15** |

---

## 🔑 Credential Health Status Matrix

| Credential ID | Provider | Configured | Real Inference | HTTP / API Status | Latency | Configured Model |
| :--- | :--- | :---: | :---: | :--- | :---: | :--- |
| `GEMINI_API_KEY_1` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 821 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_2` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 366 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_3` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 286 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_4` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 264 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_5` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 294 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_6` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 284 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_7` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 294 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_8` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 269 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_9` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 281 ms | `gemini-2.5-flash` |
| `GEMINI_API_KEY_10` | Gemini | YES | **BLOCKED** | 429 Rate Limit / Quota Exceeded | 266 ms | `gemini-2.5-flash` |
| `OPENAI_API_KEY_1` | OpenAI | YES | **BLOCKED** | 429 Quota Exceeded / No Credits | 3327 ms | `gpt-4o-mini` |
| `OPENAI_API_KEY_2` | OpenAI | YES | **BLOCKED** | 429 Quota Exceeded / No Credits | 3349 ms | `gpt-4o-mini` |
| `OPENAI_API_KEY_3` | OpenAI | YES | **BLOCKED** | 429 Quota Exceeded / No Credits | 2950 ms | `gpt-4o-mini` |
| `OPENAI_API_KEY_4` | OpenAI | YES | **BLOCKED** | 429 Quota Exceeded / No Credits | 4280 ms | `gpt-4o-mini` |
| `OPENAI_API_KEY_5` | OpenAI | YES | **BLOCKED** | 429 Quota Exceeded / No Credits | 4148 ms | `gpt-4o-mini` |
| `HF_API_KEY_1` | Hugging Face | YES | **PASS** | 200 OK | 1492 ms | `Qwen/Qwen2.5-Coder-32B-Instruct` |
| `HF_API_KEY_2` | Hugging Face | YES | **PASS** | 200 OK | 966 ms | `Qwen/Qwen2.5-Coder-32B-Instruct` |

---

## 🤖 AI Gateway Verification

| Verification Component | Status | Output / Details |
| :--- | :---: | :--- |
| **Agent 2 (Event Intelligence)** | **PASS** | Evaluated event metadata, extracted JSON domains, and generated content hash. |
| **Agent 1 (Recommendation Agent)** | **PASS** | Refined top candidate events with natural language explanation for student profile. |
| **Provider Selection Strategy** | **PASS** | Agent-aware pool selector routed Agent 2 to Gemini/HF and Agent 1 to HF/Gemini. |
| **Cooldown Handling** | **PASS** | QuotaManager detected 429 errors and placed failing credentials in temporary cooldown. |
| **Fallback Strategy** | **PASS** | Seamless failover to alternate credentials and offline Mock AI provider. |
| **SHA-256 Caching** | **PASS** | Deduplication prevented redundant LLM calls on unchanged event content (0ms overhead). |
| **Usage Tracking** | **PASS** | AI usage metrics logged safe credential IDs (`GEMINI_API_KEY_1`, `HF_API_KEY_1`) without exposing secrets. |
| **Security & Secret Leakage Check** | **PASS** | **0 API keys, tokens, or authorization headers** exposed in logs, responses, or reports. |
