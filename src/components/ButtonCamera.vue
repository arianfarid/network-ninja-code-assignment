<template>
    <button class="bg-none p-1 border border-gray-300 text-white text-xs text-center p-1
          hover:border-white hover:border-2 hover:border-white hover:shadow-glow-md
          active:border-green-300 rounded"
          :class='{"border-green-500": isActive, "hover:border-green-300": isActive, "border-red-500": zeroPhotos(), "hover:border-red-500": zeroPhotos(), "hover:shadow-none": zeroPhotos(), "cursor-not-allowed": zeroPhotos(), "active:border-gray-300": zeroPhotos()}'
          @click='emitToggleButtonCamera()'>
        {{ cameraName }} <span class="h-4 w-4 rounded-full w-full p-1 bg-gray-500" :class='{"bg-green-500": isActive, "hover:bg-green-300": isActive, "bg-red-500": zeroPhotos(), "cursor-not-allowed": zeroPhotos()}'>{{ numberOfPhotos }}</span>
    </button>
</template>
<script>
export default {
    props: {
        isActive: Boolean,
        cameraName: String,
        cameraId: Number,
        numberOfPhotos: Number,
    },
    setup(props, context) {
        const emitToggleButtonCamera = () => {
            if (zeroPhotos()) {
                return
            }
            context.emit("toggleButtonCamera", {
                "id": props.cameraId,
                "name": props.cameraName
            })
        }
        const zeroPhotos = () => {
            if (props.numberOfPhotos == 0) {
                return true
            } else {
                return false
            }
        }
        return {
            emitToggleButtonCamera,
            zeroPhotos
        }
    }
}
</script>