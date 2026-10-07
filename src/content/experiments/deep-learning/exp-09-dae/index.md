---
subject: "Deep Learning"
subjectSlug: "deep-learning"
experimentNumber: 9
title: "Convolutional Denoising Autoencoder for Image Reconstruction"
description: "Develop and train a Convolutional Denoising Autoencoder (DAE) in TensorFlow/Keras to remove Gaussian noise from corrupted MNIST handwritten digits and reconstruct clean image representations."
tags: ["Autoencoder", "Denoising", "CNN", "MNIST", "Unsupervised Learning"]
dataset: "MNIST (Noisy)"
notebookUrl: "https://colab.research.google.com/"
vivaQuestions:
  - question: "What is a Denoising Autoencoder (DAE) and how does it differ from a standard autoencoder?"
    answer: 'A standard autoencoder takes clean input $\mathbf{x}$ and learns identity mapping through a bottleneck latent space $\mathbf{z}$. A Denoising Autoencoder (DAE) intentionally corrupts the input ($\tilde{\mathbf{x}} \sim q(\tilde{\mathbf{x}} \mid \mathbf{x})$) and trains the network to reconstruct the original uncorrupted target $\mathbf{x}$. This prevents trivial identity copying and forces the network to learn the underlying manifold of the data distribution.'
  - question: "Why is Binary Crossentropy used as the loss function instead of Mean Squared Error?"
    answer: 'Because pixel intensities are normalized to $[0, 1]$ and the final activation is a Sigmoid function, pixels can be interpreted as Bernoulli probabilities. Binary crossentropy treats reconstruction as independent Bernoulli log-likelihood maximization, which penalizes small contrast discrepancies more sharply than MSE.'
  - question: "What is the role of UpSampling2D in the decoder?"
    answer: 'UpSampling2D performs nearest-neighbor spatial interpolation to double the spatial resolution of feature maps (e.g., from $7 \times 7 \to 14 \times 14 \to 28 \times 28$), reversing the spatial downsampling performed by MaxPooling2D in the encoder.'
  - question: "What is the difference between UpSampling2D and Conv2DTranspose (deconvolution)?"
    answer: 'UpSampling2D is a fixed, non-trainable interpolation operation that duplicates pixel rows and columns, typically followed by a standard Conv2D layer to learn feature transformations. Conv2DTranspose possesses learnable convolutional kernels that perform both spatial expansion and feature projection simultaneously.'
  - question: "Why is np.clip utilized after adding Gaussian noise?"
    answer: 'Adding Gaussian noise $\mathcal{N}(0, 1)$ can produce values outside the normalized range $[0, 1]$ (e.g. negative numbers or values exceeding 1.0). np.clip(..., 0, 1) constrains the pixel values back to the valid interval $[0, 1]$ required for image rendering and loss computation.'
metrics:
  - epoch: 1
    trainLoss: 0.1703
    note: "val_loss: 0.0994"
  - epoch: 2
    trainLoss: 0.0950
    note: "val_loss: 0.0897"
  - epoch: 3
    trainLoss: 0.0889
    note: "val_loss: 0.0861"
  - epoch: 4
    trainLoss: 0.0859
    note: "val_loss: 0.0841"
  - epoch: 5
    trainLoss: 0.0842
    note: "val_loss: 0.0826"
---

# Convolutional Denoising Autoencoder for Image Reconstruction

## Aim

To design, build, and train a Convolutional Denoising Autoencoder in TensorFlow/Keras to remove stochastic Gaussian noise from corrupted MNIST handwritten digits and reconstruct high-fidelity clean images.

## Theory

An autoencoder is a neural network designed to reproduce its input. To prevent trivial identity learning, a **Denoising Autoencoder (DAE)** introduces stochastic noise into the inputs while requiring the network to recover the uncorrupted originals.

```mermaid
graph LR
    Clean["Clean Image x"] --> Corrupt["Add Noise: x_noisy"]
    Corrupt --> Enc["Encoder: Conv2D + MaxPool"]
    Enc --> Latent["Bottleneck Representation z"]
    Latent --> Dec["Decoder: Conv2D + UpSampling"]
    Dec --> Recon["Reconstructed Clean Image x_hat"]
    Recon -.->|"Loss L(x_hat, x)"| Clean
```

### 1. Corruption Process

Given a clean normalized image $\mathbf{x} \in [0, 1]^D$, synthetic Gaussian noise is added:

$$\tilde{\mathbf{x}} = \text{clip}\left(\mathbf{x} + \alpha \cdot \boldsymbol{\epsilon}, \, 0, \, 1\right), \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$$

where $\alpha = 0.3$ is the noise standard deviation.

### 2. Encoder-Decoder Network Topology

- **Encoder $f_\theta$:** Compresses noisy input $\tilde{\mathbf{x}}$ into lower-dimensional spatial representations using convolutional filters and $2 \times 2$ max pooling:

$$\mathbf{z} = f_\theta(\tilde{\mathbf{x}})$$

- **Decoder $g_\phi$:** Expands the latent feature maps back to original dimensions $(28 \times 28 \times 1)$ using $2 \times 2$ upsampling followed by convolutions and a final sigmoid activation:

$$\hat{\mathbf{x}} = g_\phi(\mathbf{z})$$

### 3. Reconstruction Objective

The network minimizes pixel-wise binary cross-entropy between the reconstructed output $\hat{\mathbf{x}}$ and the clean ground truth $\mathbf{x}$:

$$\mathcal{L}(\mathbf{x}, \hat{\mathbf{x}}) = -\frac{1}{N} \sum_{i=1}^N \left[ x_i \log(\hat{x}_i) + (1 - x_i) \log(1 - \hat{x}_i) \right]$$

By training on $(\tilde{\mathbf{x}}, \mathbf{x})$ pairs, the network learns an orthogonal projection that projects points off the data manifold back onto the clean data manifold.

## Code

```python
import tensorflow as tf 
from tensorflow.keras import layers, models 
import numpy as np 
import matplotlib.pyplot as plt 

# Load and normalize MNIST dataset 
(x_train, _), (x_test, _) = tf.keras.datasets.mnist.load_data() 
x_train, x_test = x_train / 255.0, x_test / 255.0 
x_train, x_test = np.expand_dims(x_train, -1), np.expand_dims(x_test, -1)

# Add random noise 
x_train_noisy = np.clip(x_train + 0.3 * np.random.normal(0, 1, x_train.shape), 0, 1) 
x_test_noisy = np.clip(x_test + 0.3 * np.random.normal(0, 1, x_test.shape), 0, 1) 

# Visualize clean vs noisy images 
plt.figure(figsize=(10, 4)) 
for i in range(10): 
    plt.subplot(2, 10, i + 1)
    plt.imshow(x_test[i].squeeze(), cmap='gray')
    plt.axis('off') 
    plt.subplot(2, 10, i + 11)
    plt.imshow(x_test_noisy[i].squeeze(), cmap='gray')
    plt.axis('off') 
plt.show() 

# Build autoencoder 
autoencoder = models.Sequential([ 
    layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(28, 28, 1)), 
    layers.MaxPooling2D((2, 2), padding='same'), 
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'), 
    layers.MaxPooling2D((2, 2), padding='same'), 
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'), 
    layers.UpSampling2D((2, 2)), 
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'), 
    layers.UpSampling2D((2, 2)), 
    layers.Conv2D(1, (3, 3), activation='sigmoid', padding='same') 
]) 

autoencoder.compile(optimizer='adam', loss='binary_crossentropy') 
autoencoder.fit(
    x_train_noisy, 
    x_train, 
    epochs=5, 
    batch_size=256, 
    validation_data=(x_test_noisy, x_test)
) 

# Predict and visualize denoised images 
decoded = autoencoder.predict(x_test_noisy) 

plt.figure(figsize=(10, 4)) 
for i in range(10): 
    plt.subplot(3, 10, i + 1)
    plt.imshow(x_test[i].squeeze(), cmap='gray')
    plt.axis('off') 
    plt.subplot(3, 10, i + 11)
    plt.imshow(x_test_noisy[i].squeeze(), cmap='gray')
    plt.axis('off') 
    plt.subplot(3, 10, i + 21)
    plt.imshow(decoded[i].squeeze(), cmap='gray')
    plt.axis('off') 
plt.show() 
```

## Expected Results

```text
Epoch 1/5 
235/235 ━━━━━━━━━━━━━━━━━━━━ 9s 33ms/step - loss: 0.1703 - val_loss: 0.0994 
Epoch 2/5 
235/235 ━━━━━━━━━━━━━━━━━━━━ 8s 32ms/step - loss: 0.0950 - val_loss: 0.0897 
Epoch 3/5 
235/235 ━━━━━━━━━━━━━━━━━━━━ 8s 32ms/step - loss: 0.0889 - val_loss: 0.0861 
Epoch 4/5 
235/235 ━━━━━━━━━━━━━━━━━━━━ 7s 32ms/step - loss: 0.0859 - val_loss: 0.0841 
Epoch 5/5 
235/235 ━━━━━━━━━━━━━━━━━━━━ 8s 32ms/step - loss: 0.0842 - val_loss: 0.0826 
313/313 ━━━━━━━━━━━━━━━━━━━━ 1s 3ms/step 
```

### Output Figures

![Clean vs Noisy MNIST Sample Comparison](./result_1.png)

![Clean, Noisy, and Denoised Reconstruction Comparison](./result_2.png)

## Conclusion

The Convolutional Denoising Autoencoder effectively removed severe Gaussian corruption ($\sigma=0.3$) from handwritten digits. By forcing the latent feature bottleneck to discard uncorrelated random noise and retain robust spatial geometric features, the model converged to a low validation binary cross-entropy loss of 0.0826, recovering clean digits with high visual clarity.
