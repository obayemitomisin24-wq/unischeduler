// Multilayer Perceptron Model Implementation
// This is a client-side implementation for demonstration
// For production, use a backend service with PyTorch

export interface MLPConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  learningRate: number;
  epochs: number;
}

export interface TrainingData {
  X: number[][];
  y: number[];
}

export class MLPModel {
  private weights: number[][][];
  private biases: number[][];
  private config: MLPConfig;
  private trainingHistory: { loss: number; accuracy: number }[] = [];

  constructor(config: MLPConfig) {
    this.config = config;
    this.weights = [];
    this.biases = [];
    this.initializeWeights();
  }

  private initializeWeights(): void {
    const layerSizes = [
      this.config.inputSize,
      ...this.config.hiddenLayers,
      this.config.outputSize,
    ];

    for (let i = 0; i < layerSizes.length - 1; i++) {
      const w: number[][] = [];
      const b: number[] = [];

      for (let j = 0; j < layerSizes[i + 1]; j++) {
        w[j] = [];
        b[j] = Math.random() * 0.1 - 0.05;

        for (let k = 0; k < layerSizes[i]; k++) {
          w[j][k] = Math.random() * 0.5 - 0.25;
        }
      }

      this.weights.push(w);
      this.biases.push(b);
    }
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private softmax(x: number[]): number[] {
    const maxX = Math.max(...x);
    const exp = x.map((xi) => Math.exp(xi - maxX));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map((e) => e / sum);
  }

  private forward(input: number[]): number[][] {
    const activations: number[][] = [input];
    let current = input;

    for (let layer = 0; layer < this.weights.length; layer++) {
      const next: number[] = [];

      for (let j = 0; j < this.weights[layer].length; j++) {
        let sum = this.biases[layer][j];
        for (let i = 0; i < current.length; i++) {
          sum += this.weights[layer][j][i] * current[i];
        }

        if (layer === this.weights.length - 1) {
          next[j] = sum;
        } else {
          next[j] = this.relu(sum);
        }
      }

      current = next;
      activations.push(current);
    }

    return activations;
  }

  public predict(input: number[]): number[] {
    const activations = this.forward(input);
    const output = activations[activations.length - 1];
    return this.softmax(output);
  }

  public train(data: TrainingData): void {
    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;

      for (let sample = 0; sample < data.X.length; sample++) {
        const input = data.X[sample];
        const target = data.y[sample];

        const activations = this.forward(input);
        const output = this.softmax(
          activations[activations.length - 1]
        );

        const predicted = output.indexOf(Math.max(...output));
        if (predicted === target) {
          correct++;
        }

        const crossEntropyLoss = -Math.log(
          output[target] + 1e-10
        );
        totalLoss += crossEntropyLoss;
      }

      this.trainingHistory.push({
        loss: totalLoss / data.X.length,
        accuracy: correct / data.X.length,
      });
    }
  }

  public getHistory() {
    return this.trainingHistory;
  }

  public getWeights() {
    return { weights: this.weights, biases: this.biases };
  }
}

// Data preprocessing functions
export function encodeFeatures(data: any[]): number[][] {
  return data.map((item) => {
    const features: number[] = [];

    // Example encoding - customize based on your data
    if (item.day) {
      const dayMap = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
      };
      features.push(dayMap[item.day as keyof typeof dayMap] || 0);
    }

    if (item.time) {
      const [hours, minutes] = item.time.split(':').map(Number);
      features.push((hours * 60 + minutes) / (24 * 60));
    }

    if (item.capacity) {
      features.push(Math.min(item.capacity / 500, 1));
    }

    return features;
  });
}

export function normalizeFeatures(
  features: number[][]
): { normalized: number[][]; min: number[]; max: number[] } {
  if (features.length === 0) {
    return { normalized: [], min: [], max: [] };
  }

  const numFeatures = features[0].length;
  const min = Array(numFeatures).fill(Infinity);
  const max = Array(numFeatures).fill(-Infinity);

  for (const row of features) {
    for (let i = 0; i < numFeatures; i++) {
      min[i] = Math.min(min[i], row[i]);
      max[i] = Math.max(max[i], row[i]);
    }
  }

  const normalized = features.map((row) =>
    row.map((val, i) => {
      const range = max[i] - min[i];
      return range === 0 ? 0 : (val - min[i]) / range;
    })
  );

  return { normalized, min, max };
}
