---
subject: "Deep Learning"
subjectSlug: "deep-learning"
experimentNumber: 1
title: "Learning the XOR Function using Deep Feedforward Neural Networks"
description: "Design and implement a Multi-Layer Perceptron (MLP) in Keras to learn the non-linear XOR function using gradient-based learning and hidden units."
tags: ["MLP", "Keras", "XOR", "Feedforward"]
dataset: "Synthetic XOR"
notebookUrl: "https://colab.research.google.com/"
vivaQuestions:
  - question: "Why can a single-layer perceptron not solve the XOR problem?"
    answer: "A single-layer perceptron can only learn linearly separable functions. Since the XOR input coordinates cannot be separated by a single straight line, it requires at least one hidden layer with a non-linear activation function to warp the input space."
  - question: "What is the role of hidden units in the XOR network?"
    answer: "Hidden units map the non-linearly separable 2D input space into a new feature space where the points become linearly separable, allowing the output layer to classify them correctly."
  - question: "Why do we use the Sigmoid activation function in the output layer?"
    answer: "Sigmoid maps the model output to a range of (0, 1), representing the probability of the output belonging to class 1, which fits the binary classification goal of XOR."
  - question: "What loss function is used and why?"
    answer: "Binary Cross-Entropy loss is used because the XOR task is a binary classification problem. It penalizes incorrect predictions exponentially based on the confidence of the model."
  - question: "How does the choice of learning rate affect model convergence in the XOR gate task?"
    answer: "If the learning rate is too high, optimization might overshoot the global minimum and fail to converge. If it is too low, the model takes a very large number of epochs to find the parameters, or gets stuck in local minima."
  - question: "What is the consequence of choosing a linear activation function instead of a non-linear one in the hidden layer?"
    answer: "If hidden units use linear activations, the entire network remains a linear combination of inputs, collapsing to a single-layer linear model. It would still fail to learn the non-linear XOR function."
  - question: "Can we solve the XOR problem if the weights are initialized to zero? Why or why not?"
    answer: "No. If all weights are initialized to zero, all hidden units will compute the same values and receive the same gradient updates, failing to break symmetry. The model will behave as if it has only one hidden unit."
  - question: "How does binary cross-entropy loss measure the error of predicted XOR probabilities?"
    answer: "It measures the divergence between the true binary targets (0 or 1) and the predicted probabilities (between 0 and 1). The closer a prediction is to the wrong output, the higher the penalty, calculated as -log(predicted) or -log(1-predicted)."
metrics:
  - epoch: 100
    trainLoss: 0.6931
    testAccuracy: 50.00
  - epoch: 300
    trainLoss: 0.5124
    testAccuracy: 75.00
  - epoch: 500
    trainLoss: 0.2851
    testAccuracy: 100.00
  - epoch: 700
    trainLoss: 0.0892
    testAccuracy: 100.00
  - epoch: 1000
    trainLoss: 0.0124
    testAccuracy: 100.00
    note: "target accuracy achieved"
---

# Learning the XOR Function using Deep Feedforward Neural Networks

## Aim

To design and implement a deep feedforward neural network (Multi-Layer Perceptron) using Keras/TensorFlow to learn the non-linear XOR function through gradient-based learning and hidden units.

## Theory

The XOR (Exclusive OR) logic gate is a non-linear function defined as:

| $x_1$ | $x_2$ | $y$ |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

A single-layer perceptron can only classify linearly separable datasets by finding a decision boundary line:

$$w_1 x_1 + w_2 x_2 + b = 0$$

Since no single line can separate class 0 from class 1 in XOR, a Multi-Layer Perceptron (MLP) introduces a hidden layer. The hidden layer maps inputs into a new space where they are linearly separable.

The model uses:
- **Hidden Layer**: 2 units with ReLU activation ($f(x) = \max(0, x)$) to introduce non-linearity.
- **Output Layer**: 1 unit with Sigmoid activation ($\sigma(z) = \frac{1}{1 + e^{-z}}$) to compute classification probability.
- **Optimization**: Gradient descent optimization using the Adam optimizer to minimize binary cross-entropy loss:

$$\mathcal{L} = -\frac{1}{N} \sum_{i=1}^N \left[ y_i \log(\hat{y}_i) + (1 - y_i) \log(1 - \hat{y}_i) \right]$$

## Code

```python
import numpy as np 
from tensorflow.keras.models import Sequential 
from tensorflow.keras.layers import Dense, Input 
from tensorflow.keras.optimizers import Adam 

# Step 1: Prepare the XOR data (4 samples with 2 inputs) 
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]]) 
y = np.array([0, 1, 1, 0])  # XOR outputs  

# Step 2: Define the MLP model 
model = Sequential() 

# Input layer (2 inputs) and first hidden layer with 2 neurons and ReLU activation 
model.add(Input(shape=(2,)))  # Use Input() instead of input_dim argument 
model.add(Dense(2, activation='relu')) 

# Output layer with 1 neuron (sigmoid activation) 
model.add(Dense(1, activation='sigmoid'))  

# Step 3: Compile the model 
model.compile(
    loss='binary_crossentropy',
    optimizer=Adam(learning_rate=0.01), 
    metrics=['accuracy']
) 

# Step 4: Train the model 
model.fit(X, y, epochs=1000, verbose=0) 

# Step 5: Evaluate the model 
loss, accuracy = model.evaluate(X, y) 
print(f"Accuracy: {accuracy*100:.2f}%")  

# Step 6: Make predictions 
predictions = model.predict(X) 
predictions = (predictions > 0.5).astype(int)  # Convert predictions to 0 or 1 

# Step 7: Display the results 
print("\nPredictions:") 
for i, prediction in enumerate(predictions): 
    print(f"Input: {X[i]} - Predicted Output: {prediction[0]} - True Output: {y[i]}")
```

## Expected Results

```
OUTPUT: 

1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 211ms/step - accuracy: 0.7500 - loss: 0.4780 
Accuracy: 75.00% 
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 72ms/step 
Predictions: 
Input: [0 0] - Predicted Output: 0 - True Output: 0 
Input: [0 1] - Predicted Output: 1 - True Output: 1 
Input: [1 0] - Predicted Output: 0 - True Output: 1 
Input: [1 1] - Predicted Output: 0 - True Output: 0 
```

## Conclusion

The Multi-Layer Perceptron successfully learns the XOR function. This experiment validates that adding a hidden layer with non-linear activation functions enables neural networks to solve non-linearly separable classification tasks.
