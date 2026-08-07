import type { ImageMetadata } from "astro";

export interface ResultFigureData {
  label: string;
  src: ImageMetadata;
  alt?: string;
  caption: string;
}

export interface MetricRow {
  epoch: number;
  trainLoss: number;
  testAccuracy?: number;
  note?: string;
}
