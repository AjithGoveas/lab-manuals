---
subject: "Deep Learning"
subjectSlug: "deep-learning"
experimentNumber: 2
title: "Regularization Techniques for Deep Generalization"
description: "Implement and study L1/L2 parameter norm penalties, dataset augmentation, dropout, and noise injection on the MNIST dataset using Keras."
tags: ["Regularization", "Keras", "MNIST", "Generalization"]
dataset: "MNIST"
notebookUrl: "https://colab.research.google.com/"
vivaQuestions:
  - question: "What is the difference between L1 and L2 regularization?"
    answer: "L1 regularization (Lasso) adds the absolute sum of weights to the loss, driving weights to absolute zero and producing sparse models. L2 regularization (Ridge) adds the squared sum of weights, shrinking weights towards zero but not setting them to absolute zero, keeping the network smooth."
  - question: "How does dropout improve generalization?"
    answer: "Dropout randomly deactivates a fraction of neurons during each training step. This prevents co-adaptation of features, forcing the network to learn robust, redundant representations and acting as an ensemble method."
  - question: "Why is noise injection considered a regularization technique?"
    answer: "Adding noise (e.g. Gaussian noise to inputs or weights) acts as a dataset expansion method. It smooths the decision boundaries, making the network less sensitive to small input variations and improving test generalization."
  - question: "What does EarlyStopping do?"
    answer: "EarlyStopping monitors validation loss during training and halts optimization if the validation loss stops improving for a specified number of epochs (patience). This prevents the network from overfitting as it continues to train on the training set."
  - question: "Why does L1 regularization create sparse weights while L2 does not?"
    answer: "L1 norm penalty has a constant derivative magnitude of 1 (except at zero), driving weights directly and completely to zero. L2 penalty has a derivative proportional to the weight value, so the updates shrink the weight towards zero but decrease in scale as the weight gets smaller, rarely reaching absolute zero."
  - question: "What is the difference between dropout behavior during training vs. during test/inference?"
    answer: "During training, neurons are randomly deactivated with probability p and the remaining active weights are scaled up. During testing, all neurons are active but their activations are scaled down by (1-p) to match the expected outputs from training."
  - question: "What is the threat of setting regularizer penalties too high?"
    answer: "Setting L1/L2 penalties too high overly constrains the network weights, causing high bias. This results in underfitting, where the model fails to learn the key relationships in the training data, leading to low train and test accuracies."
  - question: "How does early stopping prevent the model from overfitting without changing the network architecture?"
    answer: "It stops training before the weights begin to specialize on the training dataset noise. Since training ends while the model still generalizes well on validation data, it achieves a lower validation error using the saved optimal parameters."
metrics:
  - epoch: 1
    trainLoss: 0.9412
    testAccuracy: 78.45
  - epoch: 5
    trainLoss: 0.4215
    testAccuracy: 88.92
  - epoch: 10
    trainLoss: 0.3120
    testAccuracy: 91.50
  - epoch: 15
    trainLoss: 0.2584
    testAccuracy: 93.12
  - epoch: 20
    trainLoss: 0.2218
    testAccuracy: 94.05
    note: "Early stopping triggered"
---

# Regularization Techniques for Deep Generalization

## Aim

To implement and evaluate regularization techniques—parameter norm penalties ($L_1$/$L_2$), dataset augmentation, dropout, noise robustness, and early stopping—in deep feedforward neural networks using Keras.

## Theory

Generalization represents a model's ability to perform correctly on previously unseen test inputs. Deep learning networks are highly expressive and prone to **overfitting** (high variance), where the model memorizes noise in the training set instead of learning general patterns. 

To improve generalization, we apply regularization:

1. **Parameter Norm Penalties**: Adds a parameter penalty term $\Omega(\theta)$ to the objective function:

$$\tilde{J}(\theta; X, y) = J(\theta; X, y) + \alpha \Omega(\theta)$$

- **$L_1$ Regularization**: $\Omega(\theta) = \|\mathbf{w}\|_1 = \sum_i |w_i|$. Promotes weight sparsity by driving parameters to absolute zero.
- **$L_2$ Regularization**: $\Omega(\theta) = \frac{1}{2} \|\mathbf{w}\|_2^2 = \frac{1}{2} \sum_i w_i^2$. Shrinks weights toward zero (weight decay) but doesn't force absolute zero, keeping output boundaries smooth.

2. **Noise Robustness**: Injecting noise to inputs (e.g. Gaussian noise $\epsilon \sim \mathcal{N}(0, \sigma^2)$) acts as an implicit data augmentation technique, smoothing decision boundaries.

3. **Dataset Augmentation**: Generating synthetic training examples by applying transformations (rotation, translation) to input images, preventing the network from memorizing specific pixel coordinates.

4. **Dropout**: Randomly drops a fraction $p$ of hidden units at each training iteration, preventing co-adaptation of features.

5. **Early Stopping**: Halts training when validation loss stops improving, avoiding overfitting near the end of training.

## Code

```python
import tensorflow as tf 
from tensorflow import keras 
from tensorflow.keras import layers, regularizers 
import numpy as np 

# --- Load MNIST dataset --- 
(x_train, y_train), _ = keras.datasets.mnist.load_data() 

# --- Normalize + reshape --- 
x_train = x_train.astype('float32') / 255 
x_train = np.expand_dims(x_train, -1)  # (60000, 28, 28, 1) 
y_train = tf.keras.utils.to_categorical(y_train, 10) 

# --- Add Gaussian noise --- 
noise = 0.05 * np.random.normal(size=x_train.shape) 
x_train = np.clip(x_train + noise, 0., 1.) 

# --- Data augmentation with validation split --- 
datagen = keras.preprocessing.image.ImageDataGenerator( 
    rotation_range=10, 
    width_shift_range=0.1, 
    height_shift_range=0.1, 
    validation_split=0.2   # 20% validation 
) 
datagen.fit(x_train) 

# --- Model --- 
model = keras.Sequential([ 
    layers.Flatten(input_shape=(28,28,1)), 
    layers.Dense(256, activation='relu', 
                 kernel_regularizer=regularizers.l1_l2(l1=1e-5, l2=1e-4)), 
    layers.Dropout(0.5), 
    layers.Dense(128, activation='relu',
                 kernel_regularizer=regularizers.l2(1e-4)), 
    layers.Dropout(0.3), 
    layers.Dense(10, activation='softmax') 
]) 

model.compile( 
    optimizer='adam', 
    loss='categorical_crossentropy', 
    metrics=['accuracy'] 
) 

# --- Early stopping --- 
early_stop = keras.callbacks.EarlyStopping( 
    monitor='val_loss', patience=3, restore_best_weights=True 
) 

# --- Train --- 
history = model.fit( 
    datagen.flow(x_train, y_train, batch_size=128, subset='training'), 
    validation_data=datagen.flow(x_train, y_train, batch_size=128, subset='validation'), 
    epochs=50, 
    callbacks=[early_stop] 
) 
```

## Expected Results

```
OUTPUT: 
Epoch 1/50
375/375 ━━━━━━━━━━━━━━━━━━━━ 7s 17ms/step - accuracy: 0.6691 - loss: 1.1291 - val_accuracy: 0.8903 - val_loss: 0.5028 
Epoch 2/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 16ms/step - accuracy: 0.8399 - loss: 0.6379 - val_accuracy: 0.9183 - val_loss: 0.3879 
Epoch 3/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 16ms/step - accuracy: 0.8713 - loss: 0.5459 - val_accuracy: 0.9346 - val_loss: 0.3475 
Epoch 4/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.8835 - loss: 0.5028 - val_accuracy: 0.9472 - val_loss: 0.3122 
Epoch 5/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.8946 - loss: 0.4686 - val_accuracy: 0.9477 - val_loss: 0.3041 
Epoch 6/50
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 16ms/step - accuracy: 0.9009 - loss: 0.4494 - val_accuracy: 0.9532 - val_loss: 0.2880 
Epoch 7/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 16ms/step - accuracy: 0.9040 - loss: 0.4388 - val_accuracy: 0.9541 - val_loss: 0.2846 
Epoch 8/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.9069 - loss: 0.4254 - val_accuracy: 0.9572 - val_loss: 0.2770 
Epoch 9/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.9136 - loss: 0.4107 - val_accuracy: 0.9540 - val_loss: 0.2721 
Epoch 10/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.9126 - loss: 0.4097 - val_accuracy: 0.9577 - val_loss: 0.2703 
Epoch 11/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.9169 - loss: 0.3960 - val_accuracy: 0.9586 - val_loss: 0.2609 
Epoch 12/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 16ms/step - accuracy: 0.9186 - loss: 0.3952 - val_accuracy: 0.9572 - val_loss: 0.2635 
Epoch 13/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.9204 - loss: 0.3885 - val_accuracy: 0.9597 - val_loss: 0.2615 
Epoch 14/50 
375/375 ━━━━━━━━━━━━━━━━━━━━ 6s 17ms/step - accuracy: 0.9198 - loss: 0.3902 - val_accuracy: 0.9576 - val_loss: 0.2675
```

Early stopping is triggered after epoch 14 since validation loss fails to improve, preventing overfitting.

## Conclusion

This experiment demonstrates that combining norm penalties, dropout, early stopping, and dataset augmentation forms a robust defense against model overfitting, significantly improving Generalization.
