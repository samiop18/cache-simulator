# ⚡ Cache Matrix Simulator

<p align="center">
  <img src="https://img.shields.io/badge/Language-C++--17-ff007f?style=for-the-badge&logo=c%2B%2B" alt="C++ Version" />
  <img src="https://img.shields.io/badge/Architecture-Systems--Level-black?style=for-the-badge&logo=cpu-architecture&labelColor=ff007f" alt="Systems Level" />
  <img src="https://img.shields.io/badge/Theme-Dark%20%2B%20Pink-27272a?style=for-the-badge&logo=visual-studio-code&labelColor=ff007f" alt="Theme Aesthetic" />
</p>

---

## 🌌 Overview

**Cache Matrix Simulator** is a high-performance architectural evaluation engine written in C++. It models multi-level CPU cache hierarchies, memory reference maps, and spatial locality optimization structures. By analyzing execution access traces, it calculates miss-rate percentages and pipeline throughput friction to help developers design hardware-conscious codebases.

---

## 🎨 Architectural Pipeline

Below is the conceptual flow of memory request streaming from the processor registers through the simulator's tag-matching logic circuits:

```text
 ──► [ Processor Memory Request ] 
            │
            ▼
 ──► [ Index Extraction Matrix ] 
            │
            ├───► [ Tag Array Match ] ───► (HIT)  ──► [ Zero-Latency Return ]
            │
            └───► [ Tag Array Mismatch ] ──► (MISS) ──► [ Eviction Policy Trigger ]
                                                                 │
                                                                 ▼
                                                    [ LRU / LFU Eviction Swap ]
