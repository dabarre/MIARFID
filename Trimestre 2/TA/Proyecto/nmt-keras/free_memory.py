from numba import cuda

device = cuda.get_current_device()
device.reset()

print("Memory of {} has been freed".format(device))
