#!/usr/bin/env python3
"""Interactive Wells criteria calculator for pulmonary embolism (PE)."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Criterion:
    key: str
    prompt: str
    points: float


CRITERIA: tuple[Criterion, ...] = (
    Criterion(
        key="dvt_signs",
        prompt="Clinical signs/symptoms of DVT (leg swelling + deep vein tenderness)?",
        points=3.0,
    ),
    Criterion(
        key="pe_most_likely",
        prompt="Is PE the most likely diagnosis (alternative diagnosis less likely)?",
        points=3.0,
    ),
    Criterion(key="heart_rate", prompt="Heart rate > 100 bpm?", points=1.5),
    Criterion(
        key="immobilization_surgery",
        prompt="Immobilization >= 3 days OR surgery in previous 4 weeks?",
        points=1.5,
    ),
    Criterion(key="previous_vte", prompt="Previous DVT or PE?", points=1.5),
    Criterion(key="hemoptysis", prompt="Hemoptysis?", points=1.0),
    Criterion(
        key="malignancy",
        prompt="Malignancy (active, treated in last 6 months, or palliative)?",
        points=1.0,
    ),
)


def ask_yes_no(question: str) -> bool:
    while True:
        raw = input(f"{question} [y/n]: ").strip().lower()
        if raw in {"y", "yes"}:
            return True
        if raw in {"n", "no"}:
            return False
        print("Please answer with 'y' or 'n'.")


def classify_two_tier(score: float) -> str:
    return "PE likely" if score > 4.0 else "PE unlikely"


def classify_three_tier(score: float) -> str:
    if score < 2.0:
        return "Low probability"
    if score <= 6.0:
        return "Moderate probability"
    return "High probability"


def main() -> None:
    print("Wells Criteria Calculator for Pulmonary Embolism (PE)")
    print("-" * 52)

    score = 0.0
    selected: list[Criterion] = []

    for criterion in CRITERIA:
        if ask_yes_no(criterion.prompt):
            score += criterion.points
            selected.append(criterion)

    print("\nSelected criteria:")
    if not selected:
        print("- None")
    else:
        for item in selected:
            print(f"- {item.prompt} (+{item.points})")

    print(f"\nTotal Wells PE score: {score:.1f}")
    print(f"Two-tier interpretation: {classify_two_tier(score)}")
    print(f"Three-tier interpretation: {classify_three_tier(score)}")


if __name__ == "__main__":
    main()
