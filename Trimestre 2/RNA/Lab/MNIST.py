import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Activation, Reshape
from keras.layers.normalization import BatchNormalization as BN
from keras.layers import GaussianNoise as GN
from keras.optimizers import SGD
from keras.callbacks import CSVLogger, ModelCheckpoint
from keras.callbacks import LearningRateScheduler as LRS
from keras.preprocessing.image import ImageDataGenerator

def configure_callbacks(model_id, kpi_to_monitor='val_accuracy'):
    # Without log/ or models/ subfolder as not possible to access unexisting folders
    # If possible to train with jupyter revise
    name = "mlp"
    log_filename = 'models/%s-%s.log' % (name, model_id)
    csv_logger = CSVLogger(log_filename)
    
    chk_1_model_filename = 'models/%s-%s-{epoch:04d}-{%s:.6f}.h5' % (name, model_id, kpi_to_monitor)
    chk_2_model_filename = 'models/%s-%s.h5' % (name, model_id)
    
    # Save best model fully not only weights after each epoch (period=1) 
    # with best accuracy value (mode=max, save_best_only=True)
    checkpoint1 = ModelCheckpoint(
        chk_1_model_filename,
        monitor=kpi_to_monitor,
        save_best_only=True,
        save_weights_only=False, 
        verbose=1, mode='max', period=1
    )

    checkpoint2 = ModelCheckpoint(
        chk_2_model_filename, 
        monitor=kpi_to_monitor,
        save_best_only=False,
        save_weights_only=False, 
        verbose=1, mode='auto', period=1
    )

    callbacks = [csv_logger, checkpoint1, checkpoint2]
    return callbacks

# Define a learning rate scheduler
def scheduler(epoch):
    if epoch < 25:
        return .1
    elif epoch < 50:
        return 0.01
    else:
        return 0.001

set_lr = LRS(scheduler)

## Data Augmentation with an ImageGenerator
datagen = ImageDataGenerator(
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=False,
    vertical_flip=False)

batch_size = 64
epochs = 100
num_classes=10

# the data, shuffled and split between train and test sets
(x_train, y_train), (x_test, y_test) = mnist.load_data()

print('training set', x_train.shape)
print('test set', x_test.shape)

x_train = x_train.reshape(60000, 784)
x_test = x_test.reshape(10000, 784)
x_train = x_train.astype('float32')
x_test = x_test.astype('float32')

# Normalize [0..255]-->[0..1]
x_train /= 255
x_test /= 255

# convert class vectors to binary class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

# Models
models = []
models_id = []

# Basic
model = Sequential()
model.add(Dense(1024, activation=None, input_shape=(784,)))
model.add(Activation('relu'))
model.add(Dense(1024, activation=None))
model.add(Activation('relu'))
model.add(Dense(1024, activation=None))
model.add(Activation('relu'))
model.add(Dense(num_classes, activation='softmax'))

model.summary()
models.append(model)
models_id.append("mlp-basic")

# Basic-BN
model = Sequential()

model.add(Dense(1024, activation=None, input_shape=(784,)))
model.add(BN())
model.add(Activation('relu'))
model.add(Dense(1024, activation=None))
model.add(BN())
model.add(Activation('relu'))
model.add(Dense(1024, activation=None))
model.add(BN())
model.add(Activation('relu'))
model.add(Dense(num_classes, activation='softmax'))

model.summary()
models.append(model)
models_id.append("mlp-basic-BN")

# Basic-BN-GN
model = Sequential()
model.add(Reshape(target_shape=(784,), input_shape=(784,)))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
model.add(Dense(1024, activation=None))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
model.add(Dense(1024, activation=None))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
model.add(Dense(num_classes, activation='softmax'))

model.summary()
models.append(model)
models_id.append("mlp-basic-BN-GN")


models.append(model)
models_id.append("mlp-basic-BN-GN-LRA")
models.append(model)
models_id.append("mlp-basic-BN-GN-LRA-DA")

# Optimizer 
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9)

# Compile Model
model.compile(loss='categorical_crossentropy',
              optimizer=sgd,
              metrics=['accuracy'])

for i in range(len(models)):
    if i < 3:
        model.fit(x_train, y_train,
                    batch_size=batch_size,
                    epochs=epochs,
                    shuffle=True,
                    verbose=1,
                    validation_data=(x_test, y_test),
                    callbacks=[configure_callbacks(models_id[i])])
    elif i == 4:
        model.fit(x_train, y_train,
                    batch_size=batch_size,
                    epochs=epochs,
                    shuffle=True,
                    verbose=1,
                    validation_data=(x_test, y_test),                   
                    callbacks=[configure_callbacks(models_id[i]), set_lr])
    elif i == 5:
        model.fit(datagen.flow(x_train, y_train, batch_size=batch_size),
                    steps_per_epoch=len(x_train) / batch_size,
                    epochs=epochs,
                    shuffle=True,
                    verbose=1,
                    validation_data=(x_test, y_test),                   
                    callbacks=[configure_callbacks(models_id[i]), set_lr])
    
        loss, accuracy = model.evaluate(x_test, y_test, verbose=0)
        print('Test loss:', loss)
        print('Test accuracy:', accuracy)
        print('Test error:', (1-accuracy))

'''
# Training
history = model.fit(x_train, y_train,
                    batch_size=batch_size,
                    epochs=epochs,
                    shuffle=True,
                    verbose=1,
                    validation_data=(x_test, y_test),
                    callbacks=[configure_callbacks(model_id)])

# Training LRS
history = model.fit(x_train, y_train,
                    batch_size=batch_size,
                    epochs=epochs,
                    shuffle=True,
                    verbose=1,
                    validation_data=(x_test, y_test),
                    callbacks=[configure_callbacks(model_id), set_lr])

# Training DA
history = model.fit(datagen.flow(x_train, y_train, batch_size=batch_size),
                    steps_per_epoch=len(x_train) / batch_size,
                    epochs=epochs,
                    shuffle=True,
                    verbose=1,
                    validation_data=(x_test, y_test),                   
                    callbacks=[configure_callbacks(model_id), set_lr])

# Evaluate over test
loss, accuracy = model.evaluate(x_test, y_test, verbose=0)
print('Test loss:', loss)
print('Test accuracy:', accuracy)
print('Test error:', (1-accuracy))


plot_model(model, to_file='model.png', show_shapes=True, show_layer_names=False)
history = pd.read_csv("model-weights/model.log")
model = load_model("model-weights/model.h5")

evaluate_model(model, test_generator_photo, history)

print("Best model's epoch:", 15)
'''
from numba import cuda 
device = cuda.get_current_device()
device.reset()
